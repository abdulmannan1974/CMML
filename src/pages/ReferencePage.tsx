import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs } from '@/components/ui/Tabs';
import { ScoreCalculator } from '@/components/ui/ScoreCalculator';
import { TreatmentPathways } from '@/components/disease/TreatmentPathways';
import { SubtypeComparison } from '@/components/disease/SubtypeComparison';
import { getAllDiseases } from '@/data/diseases';
import { Calculator } from 'lucide-react';

const diseases = getAllDiseases();

export function ReferencePage() {
  const allScoringystems = diseases.flatMap((d) =>
    d.scoringSystems.map((s) => ({ ...s, diseaseName: d.name })),
  );

  const tabs = [
    {
      id: 'calculators',
      label: 'Calculators',
      content: (
        <div className="space-y-8">
          {diseases.map((d) =>
            d.scoringSystems.map((sys) => (
              <div key={sys.id}>
                <h3 className="font-serif text-xl text-slate-900 mb-4">
                  {d.name} &mdash; {sys.name}
                </h3>
                <ScoreCalculator system={sys} />
              </div>
            )),
          )}
        </div>
      ),
    },
    {
      id: 'classification',
      label: 'Classification',
      content: (
        <div className="space-y-12">
          {diseases.map((d) => (
            <div key={d.slug}>
              <h3 className="font-serif text-xl text-slate-900 mb-6">{d.name} Subtypes</h3>
              <SubtypeComparison subtypes={d.subtypes} />
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'algorithms',
      label: 'Treatment Algorithms',
      content: (
        <div className="space-y-12">
          {diseases.map((d) => (
            <div key={d.slug}>
              <h3 className="font-serif text-xl text-slate-900 mb-6">
                {d.name} Treatment Pathways
              </h3>
              <TreatmentPathways pathways={d.treatmentPathways} />
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <div className="bg-white border-b border-slate-200 py-16 pt-28">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-emerald-600 mb-4">
            <Calculator size={24} />
            <span className="text-xs font-black tracking-widest uppercase">Quick Reference</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4">
            Reference Dashboard
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Scoring calculators, classification criteria, and treatment algorithms for rapid clinical reference.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs tabs={tabs} />
      </div>
    </PageLayout>
  );
}
