/**
 * CREED OS — Role-Specific Psychometric Data Transfer Object (DTO) Layer
 *
 * Implements strict role-scoped data minimization and allowlist-based payload construction.
 * Ensures internal psychometric parameters (theta, standardError, 3PL a/b/c, Fisher info)
 * are NEVER serialized to minor learners or parents.
 *
 * Route-to-Recipient Governance Matrix:
 * - /student/report, /student: StudentSelfProfileDTO, StudentBenchmarkReportDTO
 *   Permitted Recipient: Minor Learner (Self-reflection, milestone roadmap, qualitative bands).
 *   Excluded: Adult guardian metadata, institutional identifiers, competitive peer comparisons, raw psychometrics.
 * - /parent/report, /parent: ParentLearnerSummaryDTO, ParentBenchmarkReportDTO
 *   Permitted Recipient: Verified Guardian (Family diagnostic guide, formative context, international scale reference).
 *   Excluded: Other families' records, raw CAT item parameters (a, b, c), Fisher information, raw theta.
 * - /api/v1/learners/:id/evidence: SafeEvidenceDTO[]
 *   Permitted Recipient: Student & Verified Guardian
 *   Semantic Note: 'activityScore' (0-100) reflects local activity or rubric completion; it is NEVER latent trait theta.
 */

import type { BenchmarkDomain } from '@core-os/assessment';

/**
 * Tangible demonstration of competency.
 *
 * Semantic Note on Scores:
 * 'activityScore' (0-100) or 'rubricLevel' represents local activity/task completion or classroom rubric scoring.
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
  activityScore?: number; // 0-100 task performance; local task score, NOT latent ability theta
  score?: number; // Alias to activityScore for component backwards-compatibility
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
 * Recipient-specific DTO: Minor Learner Diagnostic Benchmark Report (/student/report)
 *
 * Focuses on developmental milestones, growth roadmaps, and qualitative tiers.
 * Excludes comparative delta metrics vs global means to eliminate stereotype threat.
 */
export interface StudentBenchmarkReportDTO {
  domain: BenchmarkDomain;
  domainTitle: string;
  percentileRank: number; // Approved macro international standing anchor (never fixed IQ or ranking)
  standardScaleScore: number;
  scaleFormatted: string; // Contextual reference scale (e.g. "540 Ref Pts · Pending Gate 4 Validation")
  scaleName: string;
  internationalTier: string;
  developmentalBand: 'Emergent Explorer' | 'Developing Foundation' | 'Competent Practitioner' | 'Advanced Master';
  subCompetencies: SafeSubCompetencyDTO[];
  identifiedMisconceptions: SafeMisconceptionDTO[];
  actionableRoadmap: SafeRoadmapMilestoneDTO[];
  generatedAt: string;
}

/**
 * Recipient-specific DTO: Verified Parent Benchmark Report (/parent/report)
 *
 * Includes contextual global norm comparison for family educational planning,
 * with explicit psychometric governance disclosure regarding Gate 4 validation.
 */
export interface ParentBenchmarkReportDTO extends StudentBenchmarkReportDTO {
  globalComparison: {
    oecdAverage: number;
    topDecileThreshold: number;
    learnerScore: number;
    deltaVsGlobalMean: number;
  };
  psychometricNotice: string;
}

/** Standard alias for parent/family benchmark report */
export type SafeBenchmarkReportDTO = ParentBenchmarkReportDTO;

/**
 * Maps a single sub-competency using an explicit allowlist schema.
 */
export function toSafeSubCompetencyDTO(sub: any): SafeSubCompetencyDTO {
  const allowedStatuses = ['Needs Remediation', 'Developing', 'Secure', 'Exceeding'];
  const status = allowedStatuses.includes(sub?.qualitativeStatus) ? sub.qualitativeStatus : 'Developing';

  return {
    name: String(sub?.name || 'Competency'),
    scoreRatio: typeof sub?.scoreRatio === 'number' ? Math.max(0, Math.min(1, sub.scoreRatio)) : 0,
    qualitativeStatus: status as SafeSubCompetencyDTO['qualitativeStatus'],
    evidenceNote: String(sub?.evidenceNote || '')
  };
}

/**
 * Maps an identified misconception using an explicit allowlist schema.
 */
export function toSafeMisconceptionDTO(misc: any): SafeMisconceptionDTO {
  const allowedSeverities = ['mild', 'moderate', 'critical'];
  const severity = allowedSeverities.includes(misc?.severity) ? misc.severity : 'moderate';

  return {
    tag: String(misc?.tag || 'misconception'),
    label: String(misc?.label || 'Targeted Learning Opportunity'),
    severity: severity as SafeMisconceptionDTO['severity'],
    frequency: typeof misc?.frequency === 'number' ? misc.frequency : 1,
    pedagogicalRemedy: String(misc?.pedagogicalRemedy || '')
  };
}

/**
 * Maps an actionable roadmap milestone using an explicit allowlist schema.
 */
export function toSafeRoadmapMilestoneDTO(ms: any): SafeRoadmapMilestoneDTO {
  return {
    week: typeof ms?.week === 'number' ? ms.week : 1,
    title: String(ms?.title || 'Growth Milestone'),
    focusArea: String(ms?.focusArea || 'Foundational Skill'),
    pedagogicalObjective: String(ms?.pedagogicalObjective || ''),
    recommendedActivities: Array.isArray(ms?.recommendedActivities) ? ms.recommendedActivities.map(String) : [],
    primingQuestion: String(ms?.primingQuestion || '')
  };
}

/**
 * Maps an evidence item using an explicit allowlist.
 * Psychometric internals (theta, standardError, 3PL parameters) are physically excluded from object creation.
 */
export function toSafeEvidenceDTO(ev: any): SafeEvidenceDTO {
  if (!ev) return ev;

  let qualitativeBand: string | undefined = ev.qualitativeBand;
  let rubricLevel: string | undefined = ev.rubricLevel;
  let activityScore: number | undefined = typeof ev.activityScore === 'number' ? ev.activityScore : (typeof ev.score === 'number' ? ev.score : undefined);

  if (ev.observedValue && typeof ev.observedValue === 'object') {
    if (ev.observedValue.band) qualitativeBand = String(ev.observedValue.band);
    if (ev.observedValue.level) rubricLevel = String(ev.observedValue.level);
    if (typeof ev.observedValue.score === 'number') activityScore = ev.observedValue.score;
  }

  return {
    id: String(ev.id || ''),
    learnerId: String(ev.learnerId || ''),
    competencyId: String(ev.competencyId || ev.competency || ''),
    competency: String(ev.competency || ev.competencyId || ''),
    timestamp: String(ev.timestamp || ev.observedAt || ''),
    observedAt: String(ev.observedAt || ev.timestamp || new Date().toISOString()),
    activityType: String(ev.activityType || ev.sourceType || 'ASSESSMENT'),
    sourceType: ev.sourceType ? String(ev.sourceType) : undefined,
    sourceTitle: String(ev.sourceTitle || ev.title || 'Competency Demonstration'),
    title: ev.title ? String(ev.title) : undefined,
    summary: String(ev.summary || ev.description || ''),
    description: ev.description ? String(ev.description) : undefined,
    qualitativeBand,
    rubricLevel,
    strengthLevel: ev.strengthLevel ? String(ev.strengthLevel) : ev.evidenceStrength ? String(ev.evidenceStrength) : undefined,
    confidence: typeof ev.confidence === 'number' ? ev.confidence : undefined,
    activityScore,
    score: activityScore,
    status: ev.status ? String(ev.status) : 'VERIFIED',
    provenance: ev.provenance ? {
      source: String(ev.provenance.source || 'MAKER_MISSION'),
      assessorRole: String(ev.provenance.assessorRole || 'SYSTEM'),
      sessionId: ev.provenance.sessionId ? String(ev.provenance.sessionId) : undefined
    } : undefined
  };
}

/**
 * Maps a single competency record using an explicit allowlist.
 */
export function toSafeCompetencyDTO(id: string, comp: any): SafeCompetencyDTO {
  return {
    id: String(comp.id || id),
    name: String(comp.name || comp.title || id),
    score: typeof comp.score === 'number' ? comp.score : undefined,
    level: String(comp.level || comp.qualitativeBand || 'Foundational'),
    status: String(comp.status || 'Active'),
    qualitativeTier: comp.qualitativeTier ? String(comp.qualitativeTier) : undefined,
    lastAssessed: comp.lastAssessed ? String(comp.lastAssessed) : undefined
  };
}

/**
 * Maps a learner profile using explicit allowlist construction.
 */
export function toSafeLearnerProfileDTO(raw: any): SafeLearnerProfileDTO {
  const safeCompetencies: Record<string, SafeCompetencyDTO> = {};
  if (raw.competencies && typeof raw.competencies === 'object') {
    for (const [key, comp] of Object.entries(raw.competencies)) {
      safeCompetencies[key] = toSafeCompetencyDTO(key, comp);
    }
  }

  const safeEvidence: SafeEvidenceDTO[] = Array.isArray(raw.recentEvidence)
    ? raw.recentEvidence.map(toSafeEvidenceDTO)
    : [];

  return {
    id: String(raw.id || ''),
    userId: String(raw.userId || ''),
    name: String(raw.name || raw.fullName || ''),
    fullName: String(raw.fullName || raw.name || 'Enrolled Learner'),
    age: typeof raw.age === 'number' ? raw.age : undefined,
    grade: String(raw.grade || '8'),
    gradeBand: raw.gradeBand ? String(raw.gradeBand) : undefined,
    schoolName: raw.schoolName ? String(raw.schoolName) : undefined,
    avatarUrl: raw.avatarUrl ? String(raw.avatarUrl) : undefined,
    dominantFocus: raw.dominantFocus ? String(raw.dominantFocus) : undefined,
    competencies: safeCompetencies,
    recentEvidence: safeEvidence,
    createdAt: String(raw.createdAt || ''),
    updatedAt: String(raw.updatedAt || '')
  };
}

/**
 * Maps a benchmark report for Minor Student self-reflection view.
 * Physically excludes raw theta, SE, and competitive peer-delta comparisons.
 */
export function toStudentBenchmarkReportDTO(report: any): StudentBenchmarkReportDTO | null {
  if (!report) return null;

  return {
    domain: report.domain,
    domainTitle: String(report.domainTitle || ''),
    percentileRank: typeof report.percentileRank === 'number' ? report.percentileRank : 50,
    standardScaleScore: typeof report.standardScaleScore === 'number' ? report.standardScaleScore : 500,
    scaleFormatted: String(report.scaleFormatted || ''),
    scaleName: String(report.scaleName || ''),
    internationalTier: String(report.internationalTier || ''),
    developmentalBand: report.developmentalBand || 'Developing Foundation',
    subCompetencies: Array.isArray(report.subCompetencies) ? report.subCompetencies.map(toSafeSubCompetencyDTO) : [],
    identifiedMisconceptions: Array.isArray(report.identifiedMisconceptions) ? report.identifiedMisconceptions.map(toSafeMisconceptionDTO) : [],
    actionableRoadmap: Array.isArray(report.actionableRoadmap) ? report.actionableRoadmap.map(toSafeRoadmapMilestoneDTO) : [],
    generatedAt: String(report.generatedAt || new Date().toISOString())
  };
}

/**
 * Maps a benchmark report for Verified Guardian Family Diagnostic Guide.
 * Includes globalComparison context and Gate 4 calibration disclosure.
 */
export function toParentBenchmarkReportDTO(report: any): ParentBenchmarkReportDTO | null {
  if (!report) return null;

  const base = toStudentBenchmarkReportDTO(report);
  if (!base) return null;

  return {
    ...base,
    globalComparison: report.globalComparison ? {
      oecdAverage: Number(report.globalComparison.oecdAverage || 500),
      topDecileThreshold: Number(report.globalComparison.topDecileThreshold || 600),
      learnerScore: Number(report.globalComparison.learnerScore || 500),
      deltaVsGlobalMean: Number(report.globalComparison.deltaVsGlobalMean || 0)
    } : {
      oecdAverage: 500,
      topDecileThreshold: 600,
      learnerScore: 500,
      deltaVsGlobalMean: 0
    },
    psychometricNotice: 'Standard scaled scores and international standing tiers are contextual reference benchmarks. Empirical external calibration and formal concordance (such as OECD PISA or TIMSS linking) remain subject to Gate 4 psychometric validation.'
  };
}

/**
 * Standard backward-compatible alias for benchmark reports.
 */
export function toSafeBenchmarkReportDTO(report: any): ParentBenchmarkReportDTO | null {
  return toParentBenchmarkReportDTO(report);
}

/**
 * Secondary defense-in-depth recursive sanitizer.
 * Traverses any nested structure and purges forbidden psychometric keys.
 */
const FORBIDDEN_KEYS = new Set([
  'theta',
  'standarderror',
  'standard_error',
  'se',
  '3pl',
  'fisher',
  'fisherinfo',
  'fisher_info',
  'itemparameters',
  'discrimination',
  'difficulty',
  'guessing'
]);

export function deepSanitizePsychometrics<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => deepSanitizePsychometrics(item)) as unknown as T;
  }

  const clean: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
      continue;
    }
    clean[key] = deepSanitizePsychometrics(val);
  }
  return clean as T;
}
