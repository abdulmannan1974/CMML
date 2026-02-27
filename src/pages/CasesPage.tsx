import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/Badge';
import { getAllDiseases } from '@/data/diseases';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { ClinicalCase } from '@/data/types';

const allCases: ClinicalCase[] = getAllDiseases().flatMap((d) => d.cases);

const difficultyVariant = {
  beginner: 'green' as const,
  intermediate: 'gold' as const,
  advanced: 'red' as const,
};

export function CasesPage() {
  return (
    <PageLayout>
      <div className="bg-white border-b border-slate-200 py-16 pt-28">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-med-gold mb-4">
            <BookOpen size={24} />
            <span className="text-xs font-black tracking-widest uppercase">Case-Based Learning</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4">Clinical Case Library</h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Work through clinical presentations with lab interpretation, diagnostic reasoning, and interactive questions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {allCases.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg">No cases available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCases.map((c) => (
              <Link
                key={c.id}
                to={`/cases/${c.id}`}
                className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={difficultyVariant[c.difficulty]}>{c.difficulty}</Badge>
                  <Badge>{c.diseaseSlug.toUpperCase()}</Badge>
                </div>
                <h3 className="font-serif text-xl text-slate-900 mb-3 group-hover:text-med-red transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {c.presentation.chiefComplaint}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{c.questions.length} questions</span>
                  <span>&middot;</span>
                  <span>{c.labResults.length} lab panels</span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-med-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Case <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
