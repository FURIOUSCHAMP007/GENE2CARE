export interface MutationAnalysis {
  gene: string;
  mutation: string;
  impact: string;
  proteinEffect: string;
  pathways: string[];
  diseases: {
    name: string;
    riskScore: number;
    description: string;
  }[];
}

export interface ClinicalIntelligence {
  primaryDiagnosis: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  confidenceScore: number;
  redFlags: string[];
  decisionSupport?: {
    evidenceLevel: string;
    acmgClassification: string;
    differentialDiagnosis: string[];
    clinicalActionability: string;
  };
  recommendations: {
    drugs: {
      name: string;
      target: string;
      sideEffects: string[];
    }[];
    lifestyle: string[];
    screenings: string[];
  };
  explanation: string;
  patientSummary: string;
}

export interface AnalysisResult {
  mutationAnalysis: MutationAnalysis;
  clinicalIntelligence: ClinicalIntelligence;
}
