import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GeneCategory } from '@/data/types';

interface GenomicGridProps {
  categories: GeneCategory[];
}

export function GenomicGrid({ categories }: GenomicGridProps) {
  const [activeCat, setActiveCat] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {categories.map((g, idx) => (
        <motion.div
          key={g.category}
          onHoverStart={() => setActiveCat(idx)}
          onHoverEnd={() => setActiveCat(null)}
          className={`p-6 rounded-xl transition-all duration-300 relative overflow-hidden ${
            activeCat === idx
              ? 'scale-[1.02] shadow-xl bg-white'
              : 'shadow-sm border border-slate-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-6 ${g.color} rounded-full`} />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              {g.category}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {g.genes.map((gene) => (
              <span
                key={gene}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  activeCat === idx
                    ? 'bg-slate-100 text-slate-900'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                {gene}
              </span>
            ))}
          </div>
          <AnimatePresence>
            {activeCat === idx && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-[10px] text-slate-400 italic"
              >
                {g.detail}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
