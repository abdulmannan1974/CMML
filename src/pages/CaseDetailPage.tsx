import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getAllDiseases } from '@/data/diseases';
import {
  BookOpen, User, FileText, FlaskConical, HelpCircle,
  CheckCircle2, XCircle, ChevronRight, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import type { ClinicalCase } from '@/data/types';

const allCases: ClinicalCase[] = getAllDiseases().flatMap((d) => d.cases);

const steps = ['Presentation', 'Lab Results', 'Questions', 'Discussion'];

export function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const clinicalCase = allCases.find((c) => c.id === caseId);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  if (!clinicalCase) {
    return (
      <PageLayout className="flex items-center justify-center">
        <div className="text-center py-32">
          <h1 className="font-serif text-4xl text-slate-900 mb-4">Case Not Found</h1>
          <Link to="/cases" className="text-med-red font-bold text-sm uppercase tracking-widest">
            Back to Cases
          </Link>
        </div>
      </PageLayout>
    );
  }

  const handleAnswer = (qId: string, optId: string) => {
    if (!revealed[qId]) {
      setAnswers((prev) => ({ ...prev, [qId]: optId }));
      setRevealed((prev) => ({ ...prev, [qId]: true }));
    }
  };

  const answeredCount = Object.keys(revealed).length;
  const totalQuestions = clinicalCase.questions.length;

  return (
    <PageLayout>
      <div className="bg-white border-b border-slate-200 py-12 pt-28">
        <div className="container mx-auto px-6">
          <Link to="/cases" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 hover:text-slate-600 transition-colors">
            <ArrowLeft size={14} /> Back to Cases
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="gold">{clinicalCase.difficulty}</Badge>
            <Badge>{clinicalCase.diseaseSlug.toUpperCase()}</Badge>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-4">{clinicalCase.title}</h1>
          <ProgressBar value={currentStep + 1} max={steps.length} className="max-w-md mt-4" />
          <div className="flex gap-4 mt-4">
            {steps.map((step, i) => (
              <button
                key={step}
                onClick={() => setCurrentStep(i)}
                className={clsx(
                  'text-[10px] font-black uppercase tracking-widest transition-colors',
                  currentStep === i ? 'text-med-red' : 'text-slate-400 hover:text-slate-600',
                )}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Presentation */}
        {currentStep === 0 && (
          <div className="space-y-8">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-2 text-med-blue mb-4">
                <User size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Demographics</span>
              </div>
              <p className="text-slate-700">{clinicalCase.presentation.demographics}</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-2 text-med-red mb-4">
                <FileText size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Chief Complaint</span>
              </div>
              <p className="text-slate-700 font-bold">{clinicalCase.presentation.chiefComplaint}</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-3">History</h3>
              <p className="text-slate-600 leading-relaxed">{clinicalCase.presentation.history}</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-3">Examination</h3>
              <p className="text-slate-600 leading-relaxed">{clinicalCase.presentation.examination}</p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 text-sm font-bold text-med-red uppercase tracking-widest hover:underline"
            >
              View Lab Results <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Lab Results */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {clinicalCase.labResults.map((group) => (
              <div key={group.category} className="p-6 bg-white border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 text-med-gold mb-4">
                  <FlaskConical size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">{group.category}</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Test</th>
                      <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Value</th>
                      <th className="text-right py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.tests.map((test) => (
                      <tr key={test.name} className="border-b border-slate-50">
                        <td className="py-2 text-slate-700">{test.name}</td>
                        <td className={clsx(
                          'py-2 text-right font-bold',
                          test.flag === 'high' && 'text-red-600',
                          test.flag === 'low' && 'text-blue-600',
                          test.flag === 'critical' && 'text-red-700 font-black',
                          !test.flag && 'text-slate-700',
                        )}>
                          {test.value}
                          {test.flag && (
                            <span className="ml-1 text-[9px] uppercase">{test.flag === 'critical' ? '!!' : test.flag === 'high' ? 'H' : 'L'}</span>
                          )}
                        </td>
                        <td className="py-2 text-right text-slate-400">{test.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 text-sm font-bold text-med-red uppercase tracking-widest hover:underline"
            >
              Answer Questions <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Questions */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <p className="text-slate-500 text-sm">
              {answeredCount}/{totalQuestions} questions answered
            </p>
            {clinicalCase.questions.map((q, qi) => (
              <div key={q.id} className="p-6 bg-white border border-slate-200 rounded-2xl">
                <div className="flex items-start gap-3 mb-4">
                  <HelpCircle size={20} className="text-med-blue shrink-0 mt-0.5" />
                  <p className="font-bold text-slate-900">{q.stem}</p>
                </div>
                <div className="space-y-2 ml-8">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    const isRevealed = revealed[q.id];
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleAnswer(q.id, opt.id)}
                        className={clsx(
                          'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
                          !isRevealed && 'border-slate-200 hover:border-slate-400 hover:bg-slate-50',
                          isRevealed && opt.correct && 'border-emerald-400 bg-emerald-50',
                          isRevealed && !opt.correct && isSelected && 'border-red-400 bg-red-50',
                          isRevealed && !opt.correct && !isSelected && 'border-slate-100 opacity-50',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {isRevealed && opt.correct && <CheckCircle2 size={16} className="text-emerald-600" />}
                          {isRevealed && !opt.correct && isSelected && <XCircle size={16} className="text-red-500" />}
                          <span>{opt.text}</span>
                        </div>
                        <AnimatePresence>
                          {isRevealed && (isSelected || opt.correct) && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-xs text-slate-500 mt-2 italic"
                            >
                              {opt.explanation}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 text-sm font-bold text-med-red uppercase tracking-widest hover:underline"
            >
              View Discussion <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Discussion */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <h3 className="font-serif text-2xl text-slate-900 mb-2">Diagnosis</h3>
              <p className="text-slate-700 font-bold text-lg">{clinicalCase.diagnosis}</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <h3 className="font-serif text-2xl text-slate-900 mb-4">Discussion</h3>
              <p className="text-slate-600 leading-relaxed">{clinicalCase.discussion}</p>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">
                Key Learning Points
              </h3>
              <ul className="space-y-2">
                {clinicalCase.keyLearningPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/cases"
              className="inline-flex items-center gap-2 text-sm font-bold text-med-red uppercase tracking-widest hover:underline"
            >
              <ArrowLeft size={16} /> Back to Case Library
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
