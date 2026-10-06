import type { CompetencyDomain } from './competency.js';

export interface PathwayRequirement {
  competency: CompetencyDomain;
  minimumLevel: number; // e.g. 3.2
  importance: 'critical_foundation' | 'strongly_recommended' | 'desirable';
}

export interface EducationRoute {
  id: string;
  type: 'university_degree' | 'polytechnic_diploma' | 'vocational_apprenticeship' | 'project_portfolio';
  title: string;
  durationYears: number;
  description: string;
  entryMilestones: string[];
}

export interface TryBeforeYouChooseMission {
  id: string;
  pathwayId: string;
  title: string;
  headline: string;
  description: string;
  durationMinutes: number;
  difficulty: 'introductory' | 'intermediate' | 'stretch';
  competenciesTested: CompetencyDomain[];
  scenario: string;
  constraints: string[];
  deliverable: string;
}

export interface Pathway {
  id: string;
  code: string;
  title: string;
  field: 'engineering' | 'computing_ai' | 'natural_sciences' | 'design_architecture' | 'applied_tech';
  tagline: string;
  overview: string;
  growthOutlook: string;
  requirements: PathwayRequirement[];
  routes: EducationRoute[];
  missions: TryBeforeYouChooseMission[];
}

export interface MismatchAnalysis {
  pathwayId: string;
  pathwayTitle: string;
  readinessScore: number; // 0.0 to 1.0 (e.g. 0.74 = 74% aligned)
  status: 'strongly_aligned' | 'aligned' | 'constructive_mismatch' | 'exploratory';
  alignedCompetencies: Array<{
    competency: CompetencyDomain;
    required: number;
    demonstrated: number;
    delta: number;
  }>;
  foundationGaps: Array<{
    competency: CompetencyDomain;
    required: number;
    demonstrated: number;
    delta: number;
    remediationConcept: string;
  }>;
  constructiveRoadmap: {
    recommendedSprintWeeks: number;
    focusAreas: string[];
    actionPlan: string;
  };
  recommendedMissions: TryBeforeYouChooseMission[];
}
