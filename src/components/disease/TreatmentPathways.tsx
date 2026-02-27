import { useState } from 'react';
import {
  Thermometer, Activity, Stethoscope, FlaskConical
} from 'lucide-react';
import type { TreatmentPathway } from '@/data/types';

const iconMap: Record<string, React.ReactNode> = {
  Thermometer: <Thermometer />,
  Activity: <Activity />,
  Stethoscope: <Stethoscope />,
  FlaskConical: <FlaskConical />,
};

interface TreatmentPathwaysProps {
  pathways: TreatmentPathway[];
}

export function TreatmentPathways({ pathways }: TreatmentPathwaysProps) {
  const [activePath, setActivePath] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {pathways.map((p) => (
        <div
          key={p.id}
          onMouseEnter={() => setActivePath(p.id)}
          onMouseLeave={() => setActivePath(null)}
          className={`relative p-8 rounded-2xl border-2 transition-all cursor-default flex flex-col items-center text-center ${
            activePath === p.id
              ? 'border-med-red bg-red-50/50 scale-105 shadow-xl'
              : 'border-slate-100 bg-white'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors ${
              activePath === p.id
                ? 'bg-med-red text-white'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {iconMap[p.icon] || <Activity />}
          </div>
          <h4 className="font-serif text-lg text-slate-900 mb-2 leading-tight">
            {p.label}
          </h4>
          <div
            className={`mt-auto pt-4 border-t border-slate-100 w-full transition-opacity ${
              activePath === p.id ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Recommended Approach
            </span>
            <span className="text-xs font-bold text-slate-800">{p.therapy}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
