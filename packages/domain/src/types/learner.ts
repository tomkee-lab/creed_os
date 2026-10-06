import type { CompetencyDomain, CompetencyScore } from './competency.js';
import type { LearnerEvidence } from './evidence.js';
import type { MismatchAnalysis } from './pathway.js';

export interface LearnerProfile {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  gradeBand: string;
  schoolName?: string;
  avatarUrl?: string;
  
  // Dynamic Competency Graph
  competencies: Record<CompetencyDomain, CompetencyScore>;
  
  // Longitudinal Evidence Graph
  recentEvidence: LearnerEvidence[];
  
  // Pathway Exploration States
  savedPathways: string[];
  mismatchAnalyses: Record<string, MismatchAnalysis>;
  
  // Mission Experiments
  completedMissions: Array<{
    missionId: string;
    pathwayId: string;
    title: string;
    completedAt: string;
    rating: number;
    reflectionText: string;
  }>;
  
  activeFocusCompetency?: CompetencyDomain;
  updatedAt: string;
}
