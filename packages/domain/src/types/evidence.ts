import type { CompetencyDomain } from './competency.js';

export type EvidenceStrengthLevel = 1 | 2 | 3 | 4 | 5;

export type EvidenceStatus =
  | 'candidate'
  | 'validated'
  | 'accepted'
  | 'contested'
  | 'superseded'
  | 'expired';

export type EvidenceSourceType =
  | 'cat_assessment'
  | 'project_mission'
  | 'teacher_observation'
  | 'voice_reflection'
  | 'self_report'
  | 'inventory_survey';

export interface LearnerEvidence {
  id: string;
  learnerId: string;
  organizationId?: string;
  competency: CompetencyDomain;
  skillId?: string;
  evidenceType: string;
  sourceType: EvidenceSourceType;
  sourceId?: string;
  sourceTitle: string;
  summary: string;
  observedValue: {
    theta?: number;
    standardError?: number;
    scoreFraction?: number;
    rubricCriteria?: Record<string, number>;
    misconceptionsIdentified?: string[];
    qualitativeNotes?: string;
  };
  confidence: number; // 0.0 to 1.0
  evidenceStrength: EvidenceStrengthLevel;
  status: EvidenceStatus;
  visibility: 'private' | 'learner_only' | 'guardian' | 'teacher' | 'organization_admin';
  observedAt: string;
  expiresAt?: string;
  createdAt: string;
}
