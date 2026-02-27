import type { DiseaseModule } from '../types';

export const cmmlModule: DiseaseModule = {
  slug: 'cmml',
  name: 'CMML',
  fullName: 'Chronic Myelomonocytic Leukaemia',
  category: 'MDS/MPN Overlap',
  color: 'med-red',
  description:
    'Chronic myelomonocytic leukaemias are myeloid neoplasms characterized by a sustained increase in monocyte counts, accompanied by dysplasia, abnormal proliferation, chromosomal anomalies and somatic mutations of haematopoietic cells.',

  sections: [
    { id: 'pathogenesis', title: 'The Molecular Landscape', categoryLabel: 'Pathogenesis', icon: 'Microscope', theme: 'light' },
    { id: 'diagnosis', title: 'Establishing the Diagnosis', categoryLabel: 'Diagnostic Framework', icon: 'ListChecks', theme: 'light' },
    { id: 'prognosis', title: 'Risk Assessment', categoryLabel: 'Stratification', icon: 'Activity', theme: 'dark' },
    { id: 'therapy', title: 'Therapeutic Pathways', categoryLabel: 'Clinical Management', icon: 'HeartPulse', theme: 'light' },
    { id: 'future', title: 'Future Directions', categoryLabel: 'Emerging Science', icon: 'Beaker', theme: 'light' },
  ],

  geneCategories: [
    { category: 'Epigenetic', genes: ['TET2', 'ASXL1', 'DNMT3A', 'EZH2', 'IDH1/2', 'BCOR'], color: 'bg-indigo-600', detail: 'Often affected early in disease course.' },
    { category: 'Spliceosome', genes: ['SRSF2', 'U2AF1', 'SF3B1', 'ZRSR2'], color: 'bg-med-red', detail: 'SRSF2 is mutated in ~50% of cases.' },
    { category: 'Cell Signaling', genes: ['NRAS', 'KRAS', 'CBL', 'NF1', 'JAK2'], color: 'bg-navy', detail: 'RAS pathway mutations drive myeloproliferation.' },
    { category: 'Other Transcription', genes: ['RUNX1', 'SETBP1', 'NPM1', 'FLT3', 'TP53', 'STAG2'], color: 'bg-amber-600', detail: 'NPM1/FLT3 indicate potential rapid progression.' },
  ],

  diagnosticCriteria: {
    system: 'WHO 2022',
    prerequisites: [
      { id: 'mono', label: 'Persistent Absolute Monocytosis (>0.5 x 10\u2079/L)', detail: 'and relative >10% of WBC' },
      { id: 'blasts', label: 'Blasts <20% in blood and marrow', detail: 'Includes promonocytes' },
      { id: 'cml', label: 'Does not meet CML/MPN criteria', detail: 'BCR::ABL1 negative' },
    ],
    supportive: [
      { id: 'dysplasia', label: 'Dysplasia in one or more lineages', detail: 'Morphological dysplasia' },
      { id: 'clonal', label: 'Clonal cytogenetic or molecular abnormality', detail: 'Somatic mutations detected' },
      { id: 'flow', label: '>94% classical monocytes by flow', detail: 'CD14+/CD16- immunophenotype' },
    ],
  },

  differentialDiagnoses: [
    {
      category: 'Malignant Stem Cell Disorders',
      conditions: [
        'Myelodysplastic neoplasms',
        'Myeloproliferative neoplasms',
        'Chronic eosinophilic leukaemia',
        'Acute monocytic leukaemia',
        'JMML (Juvenile variant)',
        'VEXAS / Systemic mastocytosis',
      ],
    },
    {
      category: 'Non-Malignant Conditions',
      conditions: [
        'Acute bacterial infections',
        'Viral infections (HIV, etc.)',
        'Chronic infections (Tbc)',
        'Inflammatory (RA, SLE)',
        'Immune thrombocytopenia (ITP)',
        'Hypersplenism (Splenomegaly)',
      ],
    },
  ],

  subtypes: [
    {
      name: 'Dysplastic Variant',
      shortName: 'MD-CMML',
      criteria: 'WBC <13,000/\u03BCL',
      description: 'Patients generally suffer from haematopoietic insufficiency and are more reminiscent of a myelodysplastic syndrome.',
      features: ['Higher cytopenias', 'Lower WBC counts'],
      color: 'indigo-500',
    },
    {
      name: 'Proliferative Variant',
      shortName: 'MP-CMML',
      criteria: 'WBC \u226513,000/\u03BCL',
      description: 'Fewer cytopenias, higher white blood cell counts, greater organomegaly, and more severe constitutional symptoms.',
      features: ['Night sweats / Fever', 'Skin/Kidney infiltration'],
      color: 'med-red',
    },
  ],

  scoringSystems: [
    {
      id: 'cpss-mol',
      name: 'CPSSmol',
      fullName: 'CMML-Specific Prognostic Scoring System (Molecular)',
      description: 'High risk disease according to CPSSmol should prompt transplantation planning without delay.',
      parameters: [
        {
          id: 'blasts',
          label: 'Marrow Blasts',
          type: 'select',
          options: [
            { label: '<5%', value: 'low', points: 0 },
            { label: '\u22655%', value: 'high', points: 1 },
          ],
        },
        {
          id: 'mutations',
          label: 'Molecular Mutations',
          type: 'multi-select',
          options: [
            { label: 'ASXL1', value: 'ASXL1', points: 1 },
            { label: 'NRAS', value: 'NRAS', points: 1 },
            { label: 'RUNX1', value: 'RUNX1', points: 1 },
            { label: 'SETBP1', value: 'SETBP1', points: 1 },
          ],
        },
      ],
      riskGroups: [
        { name: 'Low', minScore: 0, maxScore: 0, color: 'emerald', recommendation: 'Observation with regular monitoring' },
        { name: 'Intermediate-1', minScore: 1, maxScore: 1, color: 'yellow', recommendation: 'Consider HMA therapy' },
        { name: 'Intermediate-2', minScore: 2, maxScore: 2, color: 'orange', recommendation: 'HMA therapy, consider transplant evaluation' },
        { name: 'High', minScore: 3, maxScore: 10, color: 'red', recommendation: 'Prompt transplant planning' },
      ],
    },
  ],

  treatmentIndications: [
    { id: 'a', title: 'Haematopoietic Insufficiency', description: 'Severe anaemia (Hb <10g/dL), platelets <50,000/\u03BCL, or neutropenia (<800/\u03BCL).' },
    { id: 'b', title: 'Increasing Blast Count', description: '>5% peripheral or marrow blasts, indicating progression into acute leukaemia.' },
    { id: 'c', title: 'Rising WBC Counts', description: 'Leucocytes >30,000/\u03BCL, potentially leading to hyperleucocytosis complications.' },
    { id: 'd', title: 'Splenomegaly & Symptoms', description: 'Spleen >5cm below costal margin and constitutional symptoms (sweats, fever).' },
    { id: 'e', title: 'Inflammatory Signs', description: 'Non-infectious lung disease, pericardial effusion, ascites, or VEXAS co-occurrence.' },
    { id: 'f', title: 'Extramedullary Disease', description: 'Skin infiltration or significant lymphadenopathy.' },
  ],

  treatmentPathways: [
    { id: 'insufficiency', label: 'Haematopoietic Insufficiency', indication: 'Cytopenias', therapy: 'EPO, Transfusions, G-CSF', icon: 'Thermometer' },
    { id: 'proliferation', label: 'High WBC / Proliferation', indication: 'Leucocytosis', therapy: 'Hydroxyurea, Cytoreduction', icon: 'Activity' },
    { id: 'inflammation', label: 'Constitutional Symptoms', indication: 'Systemic', therapy: 'JAK2 Inhibitors, Ruxolitinib', icon: 'Stethoscope' },
    { id: 'highrisk', label: 'High Risk (CPSSmol High)', indication: 'Transplant', therapy: 'HMA \u00b1 BCL2-i, Allo-SCT', icon: 'FlaskConical' },
  ],

  futureTherapies: [
    { name: 'Lenzilumab', target: 'GM-CSF', type: 'Neutralizing Antibody', description: 'Addresses GM-CSF hypersensitivity characterizing the MP-type.' },
    { name: 'IO-202', target: 'LILRB4', type: 'Monoclonal Antibody', description: 'Binds LILRB4 on monocytic cells to hinder cell infiltration.' },
    { name: 'Onvansertib', target: 'RAS Signaling', type: 'Inhibitor', description: 'Targets signaling aberrations driven by RAS mutations.' },
    { name: 'Tipifarnib', target: 'Farnesyltransferase', type: 'Inhibitor', description: 'Compounds addressing post-translational modification in myeloid cells.' },
  ],

  cases: [
    {
      id: 'cmml-case-1',
      title: 'Persistent Monocytosis in a 68-year-old Male',
      difficulty: 'intermediate',
      diseaseSlug: 'cmml',
      presentation: {
        demographics: '68-year-old male, retired engineer',
        chiefComplaint: 'Fatigue and recurrent infections over 6 months',
        history: 'Progressive fatigue, two episodes of pneumonia in 4 months. No significant weight loss. Past medical history: hypertension, well-controlled. No family history of haematological malignancies.',
        examination: 'Palpable splenomegaly 3cm below costal margin. No lymphadenopathy. Mild pallor. No petechiae or bruising.',
      },
      labResults: [
        {
          category: 'Complete Blood Count',
          tests: [
            { name: 'WBC', value: '18.2', unit: 'x10\u2079/L', flag: 'high' },
            { name: 'Haemoglobin', value: '9.8', unit: 'g/dL', flag: 'low' },
            { name: 'Platelets', value: '112', unit: 'x10\u2079/L', flag: 'low' },
            { name: 'Monocytes (absolute)', value: '4.2', unit: 'x10\u2079/L', flag: 'high' },
            { name: 'Monocytes (relative)', value: '23', unit: '%', flag: 'high' },
          ],
        },
        {
          category: 'Bone Marrow',
          tests: [
            { name: 'Blasts', value: '7', unit: '%', flag: 'high' },
            { name: 'Cellularity', value: 'Hypercellular', unit: '' },
            { name: 'Dysplasia', value: 'Trilineage', unit: '' },
          ],
        },
        {
          category: 'Molecular',
          tests: [
            { name: 'TET2', value: 'Mutated', unit: '', flag: 'critical' },
            { name: 'SRSF2', value: 'Mutated', unit: '', flag: 'critical' },
            { name: 'ASXL1', value: 'Mutated', unit: '', flag: 'critical' },
            { name: 'BCR::ABL1', value: 'Negative', unit: '' },
          ],
        },
      ],
      questions: [
        {
          id: 'q1',
          stem: 'Based on the CBC results, which finding is most significant for the suspected diagnosis?',
          options: [
            { id: 'a', text: 'Elevated WBC count', correct: false, explanation: 'While elevated, the WBC alone is non-specific.' },
            { id: 'b', text: 'Persistent absolute monocytosis >0.5 x 10\u2079/L', correct: true, explanation: 'Persistent absolute monocytosis (>0.5 x 10\u2079/L) with monocytes >10% of WBC is the cardinal feature of CMML per WHO 2022 criteria.' },
            { id: 'c', text: 'Low platelet count', correct: false, explanation: 'Thrombocytopenia is common but not specific to CMML.' },
            { id: 'd', text: 'Anaemia', correct: false, explanation: 'Anaemia is a supportive finding but not the key diagnostic criterion.' },
          ],
        },
        {
          id: 'q2',
          stem: 'Given the molecular findings (TET2, SRSF2, ASXL1 mutated), what is the CPSSmol risk category?',
          options: [
            { id: 'a', text: 'Low risk', correct: false, explanation: 'Low risk requires a score of 0.' },
            { id: 'b', text: 'Intermediate-1', correct: false, explanation: 'Intermediate-1 requires a score of 1.' },
            { id: 'c', text: 'Intermediate-2 to High', correct: true, explanation: 'ASXL1 mutation (1 point) + blasts \u22655% (1 point) = score 2, placing the patient in the Intermediate-2 category. Transplant evaluation should be considered.' },
            { id: 'd', text: 'Cannot be determined', correct: false, explanation: 'CPSSmol can be calculated with the available information.' },
          ],
        },
      ],
      diagnosis: 'CMML-1 (MP-CMML variant) based on WHO 2022 criteria. WBC >13,000/\u03BCL classifies this as the myeloproliferative variant.',
      discussion: 'This case illustrates a classic presentation of MP-CMML. The combination of persistent monocytosis, splenomegaly, and the typical mutation profile (TET2/SRSF2/ASXL1) is highly characteristic. The presence of ASXL1 mutation confers adverse prognosis. With a CPSSmol score in the intermediate-2 range and the patient being under 70, allogeneic stem cell transplantation should be discussed.',
      keyLearningPoints: [
        'Persistent absolute monocytosis >0.5 x 10\u2079/L is the cardinal feature',
        'WBC threshold of 13,000/\u03BCL distinguishes MD-CMML from MP-CMML',
        'ASXL1 mutation is an independent adverse prognostic marker',
        'CPSSmol integrates molecular data for superior risk stratification',
        'High-risk patients should be promptly evaluated for transplantation',
      ],
    },
  ],
};
