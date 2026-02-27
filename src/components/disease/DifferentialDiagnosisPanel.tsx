import { AlertTriangle } from 'lucide-react';
import type { DifferentialDiagnosisGroup } from '@/data/types';

interface DifferentialDiagnosisPanelProps {
  groups: DifferentialDiagnosisGroup[];
}

export function DifferentialDiagnosisPanel({ groups }: DifferentialDiagnosisPanelProps) {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
        <AlertTriangle className="text-med-gold" size={14} />
        Differential Diagnoses
      </h4>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[11px]">
        {groups.map((group) => (
          <div key={group.category}>
            <span className="block font-bold text-med-gold mb-2 border-b border-white/10 pb-1">
              {group.category}
            </span>
            <ul className="space-y-1 text-slate-400">
              {group.conditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
