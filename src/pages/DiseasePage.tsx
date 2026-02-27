import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { GenomicGrid } from '@/components/disease/GenomicGrid';
import { DiagnosticChecklist } from '@/components/disease/DiagnosticChecklist';
import { DifferentialDiagnosisPanel } from '@/components/disease/DifferentialDiagnosisPanel';
import { SubtypeComparison } from '@/components/disease/SubtypeComparison';
import { TreatmentPathways } from '@/components/disease/TreatmentPathways';
import { TreatmentIndicationsGrid } from '@/components/disease/TreatmentIndicationsGrid';
import { FutureTherapiesPanel } from '@/components/disease/FutureTherapiesPanel';
import { ScoreCalculator } from '@/components/ui/ScoreCalculator';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { getDiseaseModule } from '@/data/diseases';
import {
  Microscope, ListChecks, Activity, HeartPulse, Beaker,
  Stethoscope, Info, AlertTriangle
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Microscope: <Microscope size={24} />,
  ListChecks: <ListChecks size={24} />,
  Activity: <Activity size={24} />,
  HeartPulse: <HeartPulse size={24} />,
  Beaker: <Beaker size={24} />,
};

export function DiseasePage() {
  const { slug } = useParams<{ slug: string }>();
  const disease = getDiseaseModule(slug || '');

  const sectionIds = disease?.sections.map((s) => s.id) || [];
  const activeSection = useScrollSpy(sectionIds);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (!disease) {
    return (
      <PageLayout className="flex items-center justify-center">
        <div className="text-center py-32">
          <h1 className="font-serif text-4xl text-slate-900 mb-4">Disease Not Found</h1>
          <p className="text-slate-500">The requested disease module does not exist yet.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Disease Header */}
      <header className="bg-white border-b border-slate-200 py-16 pt-28">
        <div className="container mx-auto px-6">
          <Badge variant="red" className="mb-4">{disease.category}</Badge>
          <h1 className="font-serif text-4xl md:text-6xl text-slate-900 mb-3">{disease.fullName}</h1>
          <p className="text-lg text-slate-500 max-w-3xl italic">
            &ldquo;{disease.description}&rdquo;
          </p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 flex gap-12">
        <Sidebar
          sections={disease.sections}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />

        <div className="flex-1 min-w-0">
          {/* Pathogenesis */}
          <section id="pathogenesis" className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2 text-med-red mb-4">
                  <Microscope size={24} />
                  <span className="text-xs font-black tracking-widest uppercase">Pathogenesis</span>
                </div>
                <h2 className="font-serif text-4xl mb-8 leading-tight text-slate-900">The Molecular Landscape</h2>
                <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                  <p>
                    CMML development is driven by somatic mutations in haematopoietic stem cells that alter DNA methylation, RNA splicing, histone modification, and cell signalling.
                  </p>
                  <p>
                    Over <strong className="text-slate-900">95%</strong> of patients harbour one or more somatic mutations. TET2 (~60%), SRSF2 (~50%), and ASXL1 (~40%) are the primary drivers.
                  </p>
                  <div className="p-4 bg-white border rounded border-slate-200 text-sm">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Activity size={16} className="text-med-red" />
                      Clonal Evolution
                    </h4>
                    Epigenetic genes are typically affected early, followed by RNA splicing mutations, and later by signalling pathway genes (RAS) which drive proliferation and AML transformation.
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7">
                <GenomicGrid categories={disease.geneCategories} />
              </div>
            </div>
          </section>

          {/* Diagnosis */}
          <section id="diagnosis" className="mb-24">
            <div className="text-center mb-16">
              <div className="flex justify-center gap-2 text-med-blue mb-4">
                <ListChecks size={24} />
                <span className="text-xs font-black tracking-widest uppercase">Diagnostic Framework</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Establishing the Diagnosis</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                CMML must be separated from other myeloid neoplasms and reactive monocytosis using WHO 2022 and International Consensus Classification (ICC) criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
              <DiagnosticChecklist criteria={disease.diagnosticCriteria} />
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 border-t-4 border-t-med-blue">
                  <h3 className="font-serif text-2xl mb-4 text-slate-900">Morphology & Flow Cytometry</h3>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                    Diagnosis relies on absolute monocytosis ({'>'} 0.5 x 10&#x2079;/L) and {'>'} 10% of WBC. Flow cytometry shows {'>'} 95% CD14+/CD16- classical monocytes.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Esterase Staining</span>
                      <span className="text-xs font-bold text-slate-700">Better monocyte ID</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Blast Equivalent</span>
                      <span className="text-xs font-bold text-slate-700">Includes Promonocytes</span>
                    </div>
                  </div>
                </div>
                <DifferentialDiagnosisPanel groups={disease.differentialDiagnoses} />
              </div>
            </div>

            <div className="pt-12 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-8">
                <Info size={20} />
                <span className="text-xs font-black tracking-widest uppercase">Classification Subgroups</span>
              </div>
              <SubtypeComparison subtypes={disease.subtypes} />
            </div>
          </section>

          {/* Prognosis */}
          <section id="prognosis" className="mb-24 -mx-6 lg:-mx-12">
            <div className="bg-slate-900 text-white py-24 px-6 lg:px-12 rounded-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2 text-med-gold mb-4">
                    <Activity size={24} />
                    <span className="text-xs font-black tracking-widest uppercase">Stratification</span>
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl mb-8">Risk Assessment</h2>
                  <div className="space-y-6 text-slate-300 leading-relaxed text-lg mb-12">
                    <p>
                      Standard MDS scores like IPSS-R are poorly suited for CMML. CMML-specific tools like CPSSmol and iCPSS provide superior stratification.
                    </p>
                    <p className="text-sm italic border-l-2 border-med-gold pl-6 py-2">
                      &ldquo;Trisomy 8 is associated with high risk in CMML but not in MDS. Parameters like monocytosis and molecular markers (ASXL1) are critical.&rdquo;
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  {disease.scoringSystems.map((sys) => (
                    <ScoreCalculator key={sys.id} system={sys} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Treatment Indications */}
          <section id="indications" className="mb-24">
            <div className="flex items-center justify-center gap-2 text-med-red mb-4">
              <Stethoscope size={24} />
              <span className="text-xs font-black tracking-widest uppercase">Clinical Decisions</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-12 text-center text-slate-900">
              Indications for Treatment
            </h2>
            <TreatmentIndicationsGrid indications={disease.treatmentIndications} />
          </section>

          {/* Therapy */}
          <section id="therapy" className="mb-24">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="flex justify-center gap-2 text-med-red mb-4">
                <HeartPulse size={24} />
                <span className="text-xs font-black tracking-widest uppercase">Clinical Management</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Therapeutic Pathways</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Treatment options are limited. 5-azacitidine is the only approved compound for dysplastic CMML in the EU. Allogeneic stem cell transplantation remains the only curative approach.
              </p>
            </div>
            <TreatmentPathways pathways={disease.treatmentPathways} />
          </section>

          {/* Future */}
          <section id="future" className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2 text-med-blue mb-4">
                  <Beaker size={24} />
                  <span className="text-xs font-black tracking-widest uppercase">Emerging Science</span>
                </div>
                <h2 className="font-serif text-4xl mb-6 text-slate-900">Future Directions</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  Drug development is shifting toward targeting specific molecular vulnerabilities and neutralizing growth factor hypersensitivity.
                </p>
              </div>
              <div className="lg:col-span-7">
                <FutureTherapiesPanel therapies={disease.futureTherapies} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
