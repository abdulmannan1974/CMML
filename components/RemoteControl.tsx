import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  Wifi,
  WifiOff,
  Microscope,
  ListChecks,
  Activity,
  Stethoscope,
  HeartPulse,
  Beaker,
  Users,
} from 'lucide-react';
import { useRemoteController, SECTIONS } from '../hooks/useRemoteControl';

const SECTION_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pathophysiology: { label: 'Pathogenesis', icon: <Microscope size={18} />, color: 'bg-red-800' },
  diagnosis: { label: 'Diagnosis', icon: <ListChecks size={18} />, color: 'bg-blue-900' },
  prognosis: { label: 'Prognosis', icon: <Activity size={18} />, color: 'bg-amber-700' },
  indications: { label: 'Indications', icon: <Stethoscope size={18} />, color: 'bg-red-800' },
  therapy: { label: 'Therapy', icon: <HeartPulse size={18} />, color: 'bg-rose-800' },
  future: { label: 'Future', icon: <Beaker size={18} />, color: 'bg-blue-900' },
  authors: { label: 'Authors', icon: <Users size={18} />, color: 'bg-slate-700' },
};

const RemoteControl: React.FC = () => {
  const { connected, currentSection, navigateTo, scrollNext, scrollPrev } = useRemoteController();

  const currentIdx = SECTIONS.indexOf(currentSection);
  const isFirst = currentIdx <= 0;
  const isLast = currentIdx >= SECTIONS.length - 1;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col select-none">
      {/* Header */}
      <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-800 rounded flex items-center justify-center text-white font-serif font-bold text-sm">
            B
          </div>
          <span className="font-serif font-bold text-sm tracking-tight">CMML Remote</span>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
              <Wifi size={14} />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium animate-pulse">
              <WifiOff size={14} />
              Connecting...
            </span>
          )}
        </div>
      </header>

      {/* Current Section Display */}
      <div className="px-4 py-4 bg-slate-900/50">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">Now Showing</p>
        <p className="text-lg font-serif font-bold text-white">
          {currentSection ? SECTION_META[currentSection]?.label || currentSection : 'No section'}
        </p>
      </div>

      {/* Prev/Next Controls */}
      <div className="flex gap-3 px-4 py-3">
        <button
          onClick={scrollPrev}
          disabled={isFirst || !connected}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed active:bg-slate-700 transition-colors"
        >
          <ChevronUp size={20} />
          Prev
        </button>
        <button
          onClick={scrollNext}
          disabled={isLast || !connected}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-red-800 border border-red-700 text-white font-bold text-sm uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed active:bg-red-700 transition-colors"
        >
          Next
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Section Grid */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3">Jump to Section</p>
        <div className="grid grid-cols-2 gap-2">
          {SECTIONS.map((id) => {
            const meta = SECTION_META[id];
            const isActive = id === currentSection;
            return (
              <button
                key={id}
                onClick={() => navigateTo(id)}
                disabled={!connected}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm font-medium transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-red-900/40 border-red-700 text-red-300'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className={`w-8 h-8 rounded flex items-center justify-center text-white ${meta?.color || 'bg-slate-700'}`}>
                  {meta?.icon}
                </span>
                <span>{meta?.label || id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-3 bg-slate-900 border-t border-slate-800 text-center">
        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-600">
          CMML Digital Review — Remote Control
        </p>
      </footer>
    </div>
  );
};

export default RemoteControl;
