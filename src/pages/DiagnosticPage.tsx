import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/Badge';
import { DiagnosticChecklist } from '@/components/disease/DiagnosticChecklist';
import { DifferentialDiagnosisPanel } from '@/components/disease/DifferentialDiagnosisPanel';
import { getAllDiseases } from '@/data/diseases';
import { Stethoscope, ArrowRight } from 'lucide-react';
import type { DiseaseModule } from '@/data/types';

const diseases = getAllDiseases();

export function DiagnosticPage() {
  const [selectedDisease, setSelectedDisease] = useState<DiseaseModule | null>(
    diseases[0] || null,
  );

  return (
    <PageLayout>
      <div className="bg-white border-b border-slate-200 py-16 pt-28">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-med-blue mb-4">
            <Stethoscope size={24} />
            <span className="text-xs font-black tracking-widest uppercase">Diagnostic Assistant</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4">
            Interactive Diagnostic Workflow
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Select a disease to explore its diagnostic criteria, differential diagnoses, and classification framework.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Disease Selector */}
        <div className="mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
            Select Disease
          </span>
          <div className="flex flex-wrap gap-3">
            {diseases.map((d) => (
              <button
                key={d.slug}
                onClick={() => setSelectedDisease(d)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${
                  selectedDisease?.slug === d.slug
                    ? 'bg-med-red text-white border-med-red'
                    : 'border-slate-200 text-slate-500 hover:border-slate-400'
                }`}
              >
                {d.name}
              </button>
            ))}
            {['AML', 'MDS', 'MPN'].map((name) => (
              <button
                key={name}
                disabled
                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest border border-dashed border-slate-200 text-slate-300 cursor-not-allowed"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {selectedDisease && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <DiagnosticChecklist criteria={selectedDisease.diagnosticCriteria} />
              <DifferentialDiagnosisPanel groups={selectedDisease.differentialDiagnoses} />
            </div>

            <div className="text-center pt-8">
              <Link
                to={`/disease/${selectedDisease.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-med-red uppercase tracking-widest hover:underline"
              >
                View Full {selectedDisease.name} Module <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
