import { ChevronRight } from 'lucide-react';
import type { Subtype } from '@/data/types';

interface SubtypeComparisonProps {
  subtypes: Subtype[];
}

export function SubtypeComparison({ subtypes }: SubtypeComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {subtypes.map((subtype) => (
        <div
          key={subtype.shortName}
          className={`p-8 bg-slate-50 rounded-2xl border-l-4 border-l-${subtype.color}`}
        >
          <h4 className="font-serif text-2xl mb-4 text-slate-900">
            {subtype.name} ({subtype.shortName})
          </h4>
          <div className={`text-xs font-bold text-${subtype.color} uppercase tracking-widest mb-4`}>
            {subtype.criteria}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
            &ldquo;{subtype.description}&rdquo;
          </p>
          <div className="space-y-2">
            {subtype.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase"
              >
                <ChevronRight size={14} /> {feature}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
