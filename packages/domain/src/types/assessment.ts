import type { CompetencyDomain } from './competency.js';

export interface AssessmentDistractor {
  id: string;
  text: string;
  misconceptionCode?: string;
  misconceptionDescription?: string;
}

export interface AssessmentItemOption {
  id: string;
  text: string;
}

export interface AssessmentItem {
  id: string;
  competency: CompetencyDomain;
  skillId: string;
  code: string;
  prompt: string;
  stimulusUrl?: string;
  explanation: string;
  options: AssessmentItemOption[];
  correctOptionId: string;
  distractors: AssessmentDistractor[];
  
  // 3PL IRT Psychometric Parameters (Unexposed to Client)
  irt: {
    a: number; // Discrimination (slope) e.g. 1.2
    b: number; // Difficulty e.g. 0.4
    c: number; // Guessing lower asymptote e.g. 0.25
  };
  ageBand: [number, number];
  status: 'calibrated' | 'experimental' | 'retired';
}

// Client-safe version of an assessment item (parameters & correct answer stripped)
export interface ClientAssessmentItem {
  id: string;
  competency: CompetencyDomain;
  code: string;
  prompt: string;
  stimulusUrl?: string;
  options: AssessmentItemOption[];
}

export interface AssessmentResponse {
  itemId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  misconceptionCode?: string;
  thetaAfter: number;
  standardErrorAfter: number;
  timestamp: string;
}

export interface AssessmentSession {
  id: string;
  learnerId: string;
  organizationId?: string;
  domain: string;
  status: 'initialized' | 'in_progress' | 'completed' | 'paused' | 'abandoned';
  currentTheta: number;
  standardError: number;
  itemsAnswered: number;
  administeredItemIds: string[];
  history: AssessmentResponse[];
  startedAt: string;
  completedAt?: string;
}
