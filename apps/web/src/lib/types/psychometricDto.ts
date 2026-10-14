/**
 * CREED OS — Role-Specific Psychometric Data Transfer Object (DTO) Types
 *
 * Implements strict role-scoped data minimization, allowlist-based payload construction,
 * and psychometric benchmark gating under Gate 4 governance.
 *
 * Ensures internal psychometric parameters (theta, standardError, 3PL a/b/c, Fisher info)
 * and unvalidated numerical benchmark metrics (percentileRank, standardScaleScore, globalComparison)
 * are NEVER serialized to minor learners or parents prior to formal Gate 4 calibration.
 *
 * =========================================================================================
 * AUTHORITATIVE DATA GOVERNANCE & FIELD EXPOSURE MATRIX:
 * =========================================================================================
 * | Field & Type                       | Allowed Recipient    | Authorized Routes               | Educational Purpose                               | Sensitivity  | Gate 4 Status | Exposure Decision        |
 * |------------------------------------|----------------------|---------------------------------|---------------------------------------------------|--------------|---------------|--------------------------|
 * | id: string                         | Student, Parent      | /student, /parent, /api/v1      | Stable entity identification                      | Personal     | Approved      | ALLOWED                  |
 * | name / fullName: string            | Student, Parent      | /student, /parent, /api/v1      | Learner salutation and portal context             | Personal     | Approved      | ALLOWED                  |
 * | grade / gradeBand: string          | Student, Parent      | /student, /parent, /api/v1      | Curriculum cohort framing                         | Educational  | Approved      | ALLOWED                  |
 * | dominantFocus: string              | Student              | /student                        | "What should I do next?" orientation              | Educational  | Approved      | ALLOWED                  |
 * | schoolName: string                 | Parent               | /parent                         | Institutional verification                         | Personal     | Approved      | ALLOWED                  |
 * | competencies: Record<string, Comp> | Student, Parent      | /student, /parent, /api/v1      | Multi-dimensional competency profile              | Educational  | Approved      | ALLOWED (Safe DTO)       |
 * | recentEvidence: SafeEvidenceDTO[]  | Student, Parent      | /student, /parent, /api/v1      | Tangible proof of mission demonstrations          | Educational  | Approved      | ALLOWED (Safe DTO)       |
 * | activityScore: number (0-100)      | Student, Parent      | /student, /parent, /api/v1      | Local task completion percentage                  | Educational  | Approved      | ALLOWED                  |
 * | score: number (deprecated alias)   | Student, Parent      | /student, /parent, /api/v1      | Backward-compatible alias for activityScore       | Educational  | Deprecated    | ALLOWED (Scheduled v3.0) |
 * | developmentalBand: string          | Student, Parent      | /student/report, /parent/report | Qualitative mastery tier (Growth over labeling)   | Educational  | Approved      | ALLOWED                  |
 * | subCompetencies: SubCompDTO[]      | Student, Parent      | /student/report, /parent/report | Formative syllabus dimension mastery              | Educational  | Approved      | ALLOWED (Safe DTO)       |
 * | identifiedMisconceptions: MiscDTO[]| Student, Parent      | /student/report, /parent/report | Targeted pedagogical remedies                     | Educational  | Approved      | ALLOWED (Safe DTO)       |
 * | actionableRoadmap: MilestoneDTO[]  | Student, Parent      | /student/report, /parent/report | Actionable 4-week practice milestones              | Educational  | Approved      | ALLOWED (Safe DTO)       |
 * | isGate4Calibrated: boolean         | Student, Parent      | /student/report, /parent/report | Explicit psychometric calibration state           | Operational  | Approved      | ALLOWED                  |
 * | calibrationStatus: string          | Student, Parent      | /student/report, /parent/report | Machine-readable calibration status               | Operational  | Approved      | ALLOWED                  |
 * | percentileRank: number             | Parent, Student      | /parent/report, /student/report | Normative cohort standing                         | Psychometric | PENDING (G4)  | GATED (Withheld pre-G4)   |
 * | standardScaleScore: number         | Parent, Student      | /parent/report, /student/report | Standard scaled metric                            | Psychometric | PENDING (G4)  | GATED (Withheld pre-G4)   |
 * | scaleFormatted: string             | Parent, Student      | /parent/report, /student/report | Contextual reference scale label                  | Psychometric | PENDING (G4)  | GATED (Withheld pre-G4)   |
 * | globalComparison: object           | Parent               | /parent/report                  | International benchmark norm delta vs OECD mean   | Psychometric | PENDING (G4)  | GATED (Withheld pre-G4)   |
 * | theta: number                      | Teacher/Console Only | /studio, /counselor/telemetry   | Raw latent psychometric ability parameter         | Restricted   | Internal Only | WITHHELD FROM STUDENTS   |
 * | standardError (se): number         | Teacher/Console Only | /studio, /counselor/telemetry   | Item information / estimation uncertainty         | Restricted   | Internal Only | WITHHELD FROM STUDENTS   |
 * | 3PL item parameters (a, b, c)      | Item Authoring Only  | /studio                         | Discrimination, difficulty, pseudo-guessing       | Restricted   | Internal Only | WITHHELD FROM CLIENTS    |
 * | Fisher information: number         | Engine Internal Only | Internal Engine                 | Test information function value                   | Restricted   | Internal Only | WITHHELD FROM CLIENTS    |
 * =========================================================================================
 */

import type { BenchmarkDomain } from '@core-os/assessment';

/**
 * Tangible demonstration of competency.
 *
 * Semantic Note on Scores:
 * 'activityScore' (0-100) represents local activity/task completion percentage or classroom rubric scoring.
 * It is strictly decoupled from latent psychometric trait estimations (theta).
 */
export interface SafeEvidenceDTO {
  id: string;
  learnerId: string;
  competencyId: string;
  competency?: string;
  timestamp: string;
  observedAt: string;
  activityType: string;
  sourceType?: string;
  sourceTitle: string;
  title?: string;
  summary: string;
  description?: string;
  qualitativeBand?: string;
  rubricLevel?: string;
  strengthLevel?: string;
  confidence?: number;

  /**
   * Canonical task performance score (0-100 scale).
   * Represents local activity completion (e.g. 85% criteria fulfilled).
   * Strictly decoupled from latent psychometric trait estimates (theta).
   */
  activityScore?: number;

  /**
   * @deprecated Deprecated in favor of 'activityScore'.
   * Maintained as an alias for backwards compatibility with legacy UI consumers.
   * Scheduled for removal in v3.0 after client migration.
   */
  score?: number;

  status: string;
  provenance?: {
    source: string;
    assessorRole: string;
    sessionId?: string;
  };
}

export interface SafeCompetencyDTO {
  id: string;
  name: string;
  score?: number;
  level: string;
  status: string;
  qualitativeTier?: string;
  lastAssessed?: string;
}

export interface SafeSubCompetencyDTO {
  name: string;
  scoreRatio: number; // 0.0 - 1.0 (activity completion / rubric ratio)
  qualitativeStatus: 'Needs Remediation' | 'Developing' | 'Secure' | 'Exceeding';
  evidenceNote: string;
}

export interface SafeMisconceptionDTO {
  tag: string;
  label: string;
  severity: 'mild' | 'moderate' | 'critical';
  frequency: number;
  pedagogicalRemedy: string;
}

export interface SafeRoadmapMilestoneDTO {
  week: number;
  title: string;
  focusArea: string;
  pedagogicalObjective: string;
  recommendedActivities: string[];
  primingQuestion: string;
}

export interface SafeLearnerProfileDTO {
  id: string;
  userId: string;
  name: string;
  fullName: string;
  age?: number;
  grade: string;
  gradeBand?: string;
  schoolName?: string;
  avatarUrl?: string;
  dominantFocus?: string;
  competencies: Record<string, SafeCompetencyDTO>;
  recentEvidence: SafeEvidenceDTO[];
  createdAt: string;
  updatedAt: string;
}

/** Recipient-specific DTO: Minor learner self-reflection view */
export type StudentSelfProfileDTO = SafeLearnerProfileDTO;

/** Recipient-specific DTO: Verified parent diagnostic guide view */
export type ParentLearnerSummaryDTO = SafeLearnerProfileDTO;

/**
 * Gate 4 Psychometric Calibration Control Options.
 * By default in production, enableGate4Outputs is false.
 */
export interface BenchmarkGatingOptions {
  enableGate4Outputs?: boolean;
  approvedFields?: Array<'percentileRank' | 'standardScaleScore' | 'scaleFormatted' | 'globalComparison'>;
  /**
   * Authoritative server-side indicator confirming the recipient is a verified guardian of this learner.
   * Required before parent-only normative comparison metrics (globalComparison) can be exposed.
   */
  isVerifiedGuardian?: boolean;
}

/**
 * Recipient-specific DTO: Minor Learner Diagnostic Benchmark Report (/student/report)
 *
 * Focuses on developmental milestones, growth roadmaps, and qualitative tiers.
 * Excludes comparative delta metrics vs global means to eliminate stereotype threat.
 * Numerical scale scores and percentiles are withheld until Gate 4 empirical calibration approval.
 */
export interface StudentBenchmarkReportDTO {
  domain: BenchmarkDomain;
  domainTitle: string;
  developmentalBand: 'Emergent Explorer' | 'Developing Foundation' | 'Competent Practitioner' | 'Advanced Master';
  scaleName: string;
  internationalTier: string;
  subCompetencies: SafeSubCompetencyDTO[];
  identifiedMisconceptions: SafeMisconceptionDTO[];
  actionableRoadmap: SafeRoadmapMilestoneDTO[];
  generatedAt: string;
  isGate4Calibrated: boolean;
  calibrationStatus: 'DEVELOPMENTAL_UNLINKED' | 'CALIBRATED';

  // Gated numerical indicators: ONLY present when Gate 4 psychometric validation is complete
  percentileRank?: number;
  standardScaleScore?: number;
  scaleFormatted?: string;
  globalComparison?: never; // Explicitly excluded from student contract
}

/**
 * Recipient-specific DTO: Verified Parent Benchmark Report (/parent/report)
 *
 * Includes family diagnostic context with Gate 4 calibration disclosures.
 * Global comparison norm delta is withheld until Gate 4 empirical validation is complete.
 */
export interface ParentBenchmarkReportDTO extends Omit<StudentBenchmarkReportDTO, 'globalComparison'> {
  globalComparison?: {
    oecdAverage: number;
    topDecileThreshold: number;
    learnerScore: number;
    deltaVsGlobalMean: number;
  };
  psychometricNotice: string;
}

/** Standard alias for parent/family benchmark report */
export type SafeBenchmarkReportDTO = ParentBenchmarkReportDTO;
