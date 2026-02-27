import { useEffect, useRef, useCallback, useState } from 'react';

export type RemoteMessage =
  | { type: 'navigate'; section: string }
  | { type: 'scroll-next' }
  | { type: 'scroll-prev' }
  | { type: 'status'; currentSection: string; connected: boolean }
  | { type: 'ping' }
  | { type: 'pong'; currentSection: string };

const CHANNEL_NAME = 'cmml-remote-control';

const SECTIONS = [
  'pathophysiology',
  'diagnosis',
  'prognosis',
  'indications',
  'therapy',
  'future',
  'authors',
];

function getCurrentSection(): string {
  const scrollY = window.scrollY + 120;
  let current = SECTIONS[0];
  for (const id of SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) {
      current = id;
    }
  }
  return current;
}

export function usePresenterReceiver(onNavigate: (section: string) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [remoteConnected, setRemoteConnected] = useState(false);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<RemoteMessage>) => {
      const msg = event.data;
      if (msg.type === 'navigate') {
        onNavigate(msg.section);
      } else if (msg.type === 'scroll-next') {
        const current = getCurrentSection();
        const idx = SECTIONS.indexOf(current);
        if (idx < SECTIONS.length - 1) {
          onNavigate(SECTIONS[idx + 1]);
        }
      } else if (msg.type === 'scroll-prev') {
        const current = getCurrentSection();
        const idx = SECTIONS.indexOf(current);
        if (idx > 0) {
          onNavigate(SECTIONS[idx - 1]);
        }
      } else if (msg.type === 'ping') {
        setRemoteConnected(true);
        channel.postMessage({
          type: 'pong',
          currentSection: getCurrentSection(),
        } as RemoteMessage);
      }
    };

    // Periodically broadcast status
    const interval = setInterval(() => {
      channel.postMessage({
        type: 'status',
        currentSection: getCurrentSection(),
        connected: true,
      } as RemoteMessage);
    }, 1000);

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [onNavigate]);

  return { remoteConnected };
}

export function useRemoteController() {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentSection, setCurrentSection] = useState('');

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<RemoteMessage>) => {
      const msg = event.data;
      if (msg.type === 'status') {
        setConnected(msg.connected);
        setCurrentSection(msg.currentSection);
      } else if (msg.type === 'pong') {
        setConnected(true);
        setCurrentSection(msg.currentSection);
      }
    };

    // Send initial ping
    channel.postMessage({ type: 'ping' } as RemoteMessage);

    // Periodic ping
    const interval = setInterval(() => {
      channel.postMessage({ type: 'ping' } as RemoteMessage);
    }, 3000);

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, []);

  const navigateTo = useCallback((section: string) => {
    channelRef.current?.postMessage({ type: 'navigate', section } as RemoteMessage);
  }, []);

  const scrollNext = useCallback(() => {
    channelRef.current?.postMessage({ type: 'scroll-next' } as RemoteMessage);
  }, []);

  const scrollPrev = useCallback(() => {
    channelRef.current?.postMessage({ type: 'scroll-prev' } as RemoteMessage);
  }, []);

  return { connected, currentSection, navigateTo, scrollNext, scrollPrev };
}

export { SECTIONS };
