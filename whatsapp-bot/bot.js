import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import Anthropic from '@anthropic-ai/sdk';
import qrcode from 'qrcode-terminal';
import { readFileSync, existsSync } from 'fs';

// ─── Configuration ──────────────────────────────────────────────
function loadEnv() {
  if (existsSync('.env')) {
    const lines = readFileSync('.env', 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

loadEnv();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const BOT_TRIGGER = (process.env.BOT_TRIGGER || 'ai').toLowerCase();
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT ||
  `You are a knowledgeable teaching assistant in a WhatsApp study group.
Your role:
- Answer student questions clearly and accurately
- Explain complex concepts in simple terms
- Give examples when helpful
- Encourage learning and curiosity
- Keep replies concise for mobile reading (use short paragraphs)
- Use *bold* for key terms and numbered lists for steps
- If a question is unclear, ask for clarification`;

if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is required.');
  console.error('Create a .env file with: ANTHROPIC_API_KEY=sk-ant-xxxxx');
  process.exit(1);
}

// ─── Claude AI Client ───────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// Per-chat conversation history (keeps last N messages for context)
const MAX_HISTORY = 20;
const chatHistory = new Map();

function getChatHistory(jid) {
  if (!chatHistory.has(jid)) {
    chatHistory.set(jid, []);
  }
  return chatHistory.get(jid);
}

function addToHistory(jid, role, content) {
  const history = getChatHistory(jid);
  history.push({ role, content });
  // Trim to max history
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
}

async function askClaude(jid, userMessage) {
  addToHistory(jid, 'user', userMessage);

  const messages = getChatHistory(jid);

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const reply = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  addToHistory(jid, 'assistant', reply);

  return reply;
}

// ─── WhatsApp Bot ───────────────────────────────────────────────
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  // Handle connection updates
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📱 Scan this QR code with WhatsApp:\n');
      qrcode.generate(qr, { small: true });
      console.log('Open WhatsApp > Settings > Linked Devices > Link a Device\n');
    }

    if (connection === 'open') {
      console.log('✅ Connected to WhatsApp!');
      console.log(`🤖 Bot is ready. Using model: ${CLAUDE_MODEL}`);
      console.log('   Send any message to start chatting with Claude.\n');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === 401) {
        console.log('❌ Logged out. Delete ./auth_info and restart to re-authenticate.');
      } else {
        console.log('⚠️  Disconnected. Reconnecting in 3 seconds...');
        setTimeout(startBot, 3000);
      }
    }
  });

  // Save credentials on update
  sock.ev.on('creds.update', saveCreds);

  // Handle incoming messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      // Skip own messages
      if (msg.key.fromMe) continue;

      const jid = msg.key.remoteJid;
      if (!jid) continue;

      // Extract text content
      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text;

      if (!text) continue;

      const isGroup = jid.endsWith('@g.us');
      const senderName = msg.pushName || 'Someone';

      // In groups: only respond to trigger word or commands
      // In private chats: respond to everything
      if (isGroup) {
        const lowerText = text.toLowerCase();
        const triggered =
          lowerText.startsWith(BOT_TRIGGER + ' ') ||
          lowerText.startsWith(BOT_TRIGGER + ',') ||
          lowerText === BOT_TRIGGER ||
          text.startsWith('/');

        if (!triggered) continue;
      }

      // Strip trigger word from the question
      let question = text;
      if (isGroup && !text.startsWith('/')) {
        // Remove "ai " or "ai," prefix
        question = text.replace(new RegExp(`^${BOT_TRIGGER}[,:\\s]+`, 'i'), '').trim();
        if (!question) continue;
      }

      // Handle commands (work in both groups and private)
      if (text.startsWith('/')) {
        const command = text.slice(1).toLowerCase().trim();

        if (command === 'reset') {
          chatHistory.delete(jid);
          await sock.sendMessage(jid, { text: '🔄 Conversation reset. Start fresh!' });
          continue;
        }

        if (command === 'help') {
          const triggerInfo = isGroup
            ? `In groups, start your message with *${BOT_TRIGGER}* to ask me.\n` +
              `Example: _${BOT_TRIGGER} what is hemoglobin?_\n\n`
            : '';
          await sock.sendMessage(jid, {
            text:
              '🤖 *Claude Teaching Assistant*\n\n' +
              triggerInfo +
              '*Commands:*\n' +
              '• /reset — Clear conversation history\n' +
              '• /help — Show this help message\n' +
              '• /model — Show current AI model\n' +
              '• /topic — Set a topic for focused Q&A',
          });
          continue;
        }

        if (command === 'model') {
          await sock.sendMessage(jid, { text: `🧠 Current model: *${CLAUDE_MODEL}*` });
          continue;
        }

        if (command.startsWith('topic ')) {
          const topic = command.slice(6).trim();
          if (topic) {
            chatHistory.delete(jid);
            addToHistory(jid, 'user', `The study topic is: ${topic}. Please focus answers on this subject.`);
            addToHistory(jid, 'assistant', `Got it! I'm now focused on *${topic}*. Ask me anything about it.`);
            await sock.sendMessage(jid, {
              text: `📚 Topic set to: *${topic}*\n\nConversation history cleared. Ask your questions!`,
            });
          }
          continue;
        }

        continue;
      }

      // Prefix with sender name in groups for context
      const messageForClaude = isGroup
        ? `[${senderName} asks]: ${question}`
        : question;

      console.log(`📨 [${isGroup ? 'GROUP' : 'DM'}] ${senderName}: ${question.slice(0, 80)}${question.length > 80 ? '...' : ''}`);

      try {
        await sock.sendPresenceUpdate('composing', jid);

        const reply = await askClaude(jid, messageForClaude);

        await sock.sendPresenceUpdate('paused', jid);

        // Send reply (split if too long)
        const MAX_MSG_LENGTH = 4000;
        if (reply.length <= MAX_MSG_LENGTH) {
          await sock.sendMessage(jid, { text: reply });
        } else {
          const chunks = [];
          for (let i = 0; i < reply.length; i += MAX_MSG_LENGTH) {
            chunks.push(reply.slice(i, i + MAX_MSG_LENGTH));
          }
          for (const chunk of chunks) {
            await sock.sendMessage(jid, { text: chunk });
          }
        }

        console.log(`📤 [${jid}]: Replied (${reply.length} chars)`);
      } catch (error) {
        console.error(`❌ Error processing message from ${jid}:`, error.message);
        await sock.sendPresenceUpdate('paused', jid);
        await sock.sendMessage(jid, {
          text: '⚠️ Sorry, I encountered an error. Please try again.',
        });
      }
    }
  });

  return sock;
}

// ─── Start ──────────────────────────────────────────────────────
console.log('🚀 WhatsApp Claude Bot starting...');
console.log(`   Model: ${CLAUDE_MODEL}`);
console.log('');
startBot().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
