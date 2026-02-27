import { Target } from 'lucide-react';
import type { TherapyTarget } from '@/data/types';

interface FutureTherapiesPanelProps {
  therapies: TherapyTarget[];
}

export function FutureTherapiesPanel({ therapies }: FutureTherapiesPanelProps) {
  return (
    <div className="space-y-4">
      {therapies.map((t) => (
        <div
          key={t.name}
          className="flex gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex-shrink-0 mt-1">
            <Target size={20} className="text-med-red" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-slate-900">{t.name}</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {t.target}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">
              {t.type}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed italic">{t.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
