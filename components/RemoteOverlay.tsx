import React, { useState } from 'react';
import { Smartphone, X, Wifi, WifiOff, Copy, Check } from 'lucide-react';
import QRCode from './QRCode';

interface RemoteOverlayProps {
  remoteConnected: boolean;
}

const RemoteOverlay: React.FC<RemoteOverlayProps> = ({ remoteConnected }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  const remoteUrl = `${window.location.origin}${window.location.pathname}?remote=true`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(remoteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text for manual copy
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          remoteConnected
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-800 text-white'
        }`}
        title="Remote Control"
      >
        <Smartphone size={20} />
        {remoteConnected && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {showPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPanel(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-slate-900">Mobile Remote</h3>
              <button onClick={() => setShowPanel(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Connection status */}
            <div className={`flex items-center gap-2 mb-6 px-3 py-2 rounded-lg text-sm font-medium ${
              remoteConnected
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {remoteConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
              {remoteConnected ? 'Remote connected' : 'Waiting for connection...'}
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">
                Scan with your phone
              </p>
              <div className="p-3 bg-white border-2 border-slate-200 rounded-xl">
                <QRCode value={remoteUrl} size={180} />
              </div>
            </div>

            {/* URL copy */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">
                Or open this URL
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-slate-100 px-3 py-2 rounded-lg text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap">
                  {remoteUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-600"
                >
                  {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center italic leading-relaxed">
              Open the URL on your phone (same network). Use the remote to navigate between sections during your presentation.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default RemoteOverlay;
