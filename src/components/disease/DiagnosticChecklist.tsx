import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import type { DiagnosticCriteria } from '@/data/types';

interface DiagnosticChecklistProps {
  criteria: DiagnosticCriteria;
}

export function DiagnosticChecklist({ criteria }: DiagnosticChecklistProps) {
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (id: string) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const allMet = criteria.prerequisites.every((p) => checked.includes(p.id));

  return (
    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
      <h3 className="font-serif text-2xl mb-6 text-slate-900 flex items-center gap-2">
        <ShieldAlert className="text-med-red" />
        {criteria.system} Prerequisite Criteria
      </h3>
      <div className="space-y-4">
        {criteria.prerequisites.map((item) => (
          <div
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
              checked.includes(item.id)
                ? 'bg-white shadow-md border-l-4 border-l-med-red'
                : 'bg-slate-100 hover:bg-slate-200 opacity-60'
            }`}
          >
            <div
              className={`mt-1 ${checked.includes(item.id) ? 'text-med-red' : 'text-slate-300'}`}
            >
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{item.label}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {criteria.supportive.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
            Supportive Criteria
          </h4>
          <div className="space-y-2">
            {criteria.supportive.map((item) => (
              <div
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all text-sm ${
                  checked.includes(item.id)
                    ? 'bg-white shadow-sm'
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                <CheckCircle2
                  size={18}
                  className={checked.includes(item.id) ? 'text-emerald-500' : 'text-slate-300'}
                />
                <span className="text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {allMet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold text-center uppercase tracking-widest"
          >
            All Prerequisite Criteria Met
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
