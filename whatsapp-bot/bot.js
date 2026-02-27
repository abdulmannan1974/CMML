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
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT ||
  'You are a helpful assistant responding via WhatsApp. Keep replies concise and well-formatted for mobile reading. Use short paragraphs.';

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

      // Handle commands
      if (text.startsWith('/')) {
        const command = text.slice(1).toLowerCase().trim();

        if (command === 'reset') {
          chatHistory.delete(jid);
          await sock.sendMessage(jid, { text: '🔄 Conversation reset. Start fresh!' });
          continue;
        }

        if (command === 'help') {
          await sock.sendMessage(jid, {
            text:
              '🤖 *WhatsApp Claude Bot*\n\n' +
              'Send any message and I\'ll respond using Claude AI.\n\n' +
              '*Commands:*\n' +
              '• /reset — Clear conversation history\n' +
              '• /help — Show this help message\n' +
              '• /model — Show current AI model',
          });
          continue;
        }

        if (command === 'model') {
          await sock.sendMessage(jid, { text: `🧠 Current model: *${CLAUDE_MODEL}*` });
          continue;
        }
      }

      // Send to Claude
      console.log(`📨 [${jid}]: ${text.slice(0, 80)}${text.length > 80 ? '...' : ''}`);

      try {
        // Show typing indicator
        await sock.sendPresenceUpdate('composing', jid);

        const reply = await askClaude(jid, text);

        // Stop typing indicator
        await sock.sendPresenceUpdate('paused', jid);

        // Send reply (split if too long for WhatsApp)
        const MAX_MSG_LENGTH = 4000;
        if (reply.length <= MAX_MSG_LENGTH) {
          await sock.sendMessage(jid, { text: reply });
        } else {
          // Split into chunks
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
          text: '⚠️ Sorry, I encountered an error processing your message. Please try again.',
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
