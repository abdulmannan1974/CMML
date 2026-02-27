import { Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/Badge';
import {
  Droplets, Microscope, Stethoscope, BookOpen,
  Calculator, ArrowRight, Activity
} from 'lucide-react';
import { getAllDiseases } from '@/data/diseases';

const HematologyScene = lazy(() =>
  import('@/components/visualization/HematologyScene').then((m) => ({
    default: m.HematologyScene,
  })),
);

const diseases = getAllDiseases();

const features = [
  {
    icon: <Microscope size={24} />,
    title: 'Disease Modules',
    desc: 'Comprehensive educational content for each blood disorder with interactive diagrams.',
    to: '/disease/cmml',
    color: 'text-med-red',
  },
  {
    icon: <Stethoscope size={24} />,
    title: 'Diagnostic Assistant',
    desc: 'Step-by-step diagnostic workflows with criteria checklists and differential diagnosis.',
    to: '/diagnostic',
    color: 'text-med-blue',
  },
  {
    icon: <BookOpen size={24} />,
    title: 'Case-Based Learning',
    desc: 'Clinical case presentations with lab interpretation and interactive questions.',
    to: '/cases',
    color: 'text-med-gold',
  },
  {
    icon: <Calculator size={24} />,
    title: 'Reference Dashboard',
    desc: 'Scoring calculators, classification criteria, and treatment algorithms.',
    to: '/reference',
    color: 'text-emerald-600',
  },
];

export function HomePage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
        <Suspense fallback={null}>
          <HematologyScene />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-med-cream z-[1]" />

        <div className="relative z-10 container mx-auto px-6 text-center pt-20">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-2 font-serif font-bold text-2xl tracking-tight">
              <span className="text-slate-900">Blood</span>
              <Droplets size={24} className="text-red-600 fill-red-600" />
              <span className="text-red-700">Doctor</span>
            </div>
            <Badge variant="red">Hematology Education Platform</Badge>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] mb-8 text-slate-900 max-w-4xl mx-auto">
            Master the Science
            <br />
            <span className="italic font-light">of Blood Disorders</span>
          </h1>

          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
            An interactive clinical education platform with disease modules, diagnostic tools,
            case-based learning, and reference calculators for practicing hematologists.
          </p>

          <Link
            to="/disease/cmml"
            className="inline-flex items-center gap-2 px-8 py-3 bg-med-red text-white font-bold text-sm uppercase tracking-widest rounded-lg hover:bg-red-800 transition-colors"
          >
            Explore CMML Module
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Disease Modules Grid */}
      <section className="py-24 bg-med-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-2 text-med-red mb-4">
              <Activity size={24} />
              <span className="text-xs font-black tracking-widest uppercase">Disease Modules</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4">
              Blood Disorder Library
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Explore comprehensive educational modules covering diagnosis, prognosis, and management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {diseases.map((disease) => (
              <Link
                key={disease.slug}
                to={`/disease/${disease.slug}`}
                className="group p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:border-med-red/30"
              >
                <Badge variant="red" className="mb-4">{disease.category}</Badge>
                <h3 className="font-serif text-2xl text-slate-900 mb-2 group-hover:text-med-red transition-colors">
                  {disease.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">{disease.fullName}</p>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {disease.description}
                </p>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-med-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={14} />
                </div>
              </Link>
            ))}

            {/* Coming soon placeholders */}
            {['AML', 'MDS', 'MPN'].map((name) => (
              <div
                key={name}
                className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center opacity-50"
              >
                <Badge className="mb-4">Coming Soon</Badge>
                <h3 className="font-serif text-2xl text-slate-400">{name}</h3>
                <p className="text-xs text-slate-400 mt-2">Module in development</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4">
              Platform Features
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Interactive tools designed for clinical education and decision support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.to}
                className="group p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-slate-200 mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Author Credit */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
            Produced for Clinical Education by
          </p>
          <p className="font-serif text-2xl text-slate-800">
            Dr Abdul Mannan{' '}
            <span className="text-sm font-sans font-medium text-slate-500 ml-1 italic">
              FRCPath FCPS
            </span>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
