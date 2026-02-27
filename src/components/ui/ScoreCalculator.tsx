import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import { clsx } from 'clsx';
import type { ScoringSystem } from '@/data/types';

interface ScoreCalculatorProps {
  system: ScoringSystem;
  className?: string;
}

export function ScoreCalculator({ system, className }: ScoreCalculatorProps) {
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const handleSelect = (paramId: string, value: string, isMulti: boolean) => {
    setSelections((prev) => {
      if (isMulti) {
        const current = prev[paramId] || [];
        return {
          ...prev,
          [paramId]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [paramId]: [value] };
    });
  };

  const totalScore = system.parameters.reduce((sum, param) => {
    const selected = selections[param.id] || [];
    return (
      sum +
      param.options
        .filter((opt) => selected.includes(opt.value))
        .reduce((s, opt) => s + opt.points, 0)
    );
  }, 0);

  const riskGroup = system.riskGroups.find(
    (g) => totalScore >= g.minScore && totalScore <= g.maxScore,
  ) || system.riskGroups[0];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-600',
  };

  return (
    <div className={clsx('bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl', className)}>
      <h3 className="font-serif text-2xl mb-8 flex items-center gap-2 text-white">
        <FlaskConical className="text-med-gold" />
        {system.name} Calculator
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8 text-left">
          {system.parameters.map((param) => (
            <div key={param.id}>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">
                {param.label}
              </label>
              <div className={clsx('flex flex-wrap gap-2', param.type === 'multi-select' && 'grid grid-cols-2')}>
                {param.options.map((opt) => {
                  const isSelected = (selections[param.id] || []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(param.id, opt.value, param.type === 'multi-select')}
                      className={clsx(
                        'px-4 py-2 rounded text-xs font-bold border transition-all text-left',
                        isSelected
                          ? 'bg-med-gold text-slate-900 border-med-gold'
                          : 'border-slate-600 text-slate-400 hover:border-slate-400',
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-xl border border-slate-700">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">
            Calculated Risk Group
          </span>
          <motion.div
            key={riskGroup.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={clsx(
              'text-2xl font-serif text-white px-6 py-2 rounded-full mb-4',
              colorMap[riskGroup.color] || 'bg-slate-500',
            )}
          >
            {riskGroup.name}
          </motion.div>
          <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-6">
            <motion.div
              animate={{ width: `${Math.min((totalScore / 3) * 100, 100)}%` }}
              className={clsx('h-full', colorMap[riskGroup.color] || 'bg-slate-500')}
            />
          </div>
          {riskGroup.recommendation && (
            <p className="text-slate-400 text-[10px] italic text-center">
              {riskGroup.recommendation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
