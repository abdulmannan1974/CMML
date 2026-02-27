export interface DiseaseModule {
  slug: string;
  name: string;
  fullName: string;
  category: string;
  color: string;
  description: string;
  sections: DiseaseSection[];
  diagnosticCriteria: DiagnosticCriteria;
  scoringSystems: ScoringSystem[];
  differentialDiagnoses: DifferentialDiagnosisGroup[];
  subtypes: Subtype[];
  treatmentPathways: TreatmentPathway[];
  treatmentIndications: TreatmentIndication[];
  futureTherapies: TherapyTarget[];
  geneCategories: GeneCategory[];
  cases: ClinicalCase[];
}

export interface DiseaseSection {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  categoryLabel: string;
  theme?: 'light' | 'dark';
}

export interface DiagnosticCriteria {
  system: string;
  prerequisites: Criterion[];
  supportive: Criterion[];
}

export interface Criterion {
  id: string;
  label: string;
  detail: string;
}

export interface ScoringSystem {
  id: string;
  name: string;
  fullName: string;
  description: string;
  parameters: ScoringParameter[];
  riskGroups: RiskGroup[];
}

export interface ScoringParameter {
  id: string;
  label: string;
  type: 'select' | 'multi-select';
  options: { label: string; value: string; points: number }[];
}

export interface RiskGroup {
  name: string;
  minScore: number;
  maxScore: number;
  color: string;
  recommendation?: string;
}

export interface DifferentialDiagnosisGroup {
  category: string;
  conditions: string[];
}

export interface Subtype {
  name: string;
  shortName: string;
  criteria: string;
  description: string;
  features: string[];
  color: string;
}

export interface TreatmentPathway {
  id: string;
  label: string;
  indication: string;
  therapy: string;
  icon: string;
}

export interface TreatmentIndication {
  id: string;
  title: string;
  description: string;
}

export interface TherapyTarget {
  name: string;
  target: string;
  type: string;
  description: string;
}

export interface GeneCategory {
  category: string;
  genes: string[];
  color: string;
  detail: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  diseaseSlug: string;
  presentation: {
    demographics: string;
    chiefComplaint: string;
    history: string;
    examination: string;
  };
  labResults: LabResultGroup[];
  questions: CaseQuestion[];
  diagnosis: string;
  discussion: string;
  keyLearningPoints: string[];
}

export interface LabResultGroup {
  category: string;
  tests: LabTest[];
}

export interface LabTest {
  name: string;
  value: string;
  unit: string;
  flag?: 'high' | 'low' | 'critical';
}

export interface CaseQuestion {
  id: string;
  stem: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}
