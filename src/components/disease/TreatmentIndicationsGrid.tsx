import type { TreatmentIndication } from '@/data/types';

interface TreatmentIndicationsGridProps {
  indications: TreatmentIndication[];
}

export function TreatmentIndicationsGrid({ indications }: TreatmentIndicationsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {indications.map((ind) => (
        <div
          key={ind.id}
          className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-med-red font-bold text-xs uppercase">
            {ind.id}
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm mb-2">{ind.title}</h5>
            <p className="text-xs text-slate-500 leading-relaxed italic">{ind.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
