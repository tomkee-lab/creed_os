/**
 * CREED OS — Role-Specific Psychometric Data Transfer Object (DTO) Layer
 *
 * Implements strict role-scoped data minimization and allowlist-based payload construction.
 * Ensures internal psychometric parameters (theta, standardError, 3PL a/b/c, Fisher info)
 * are NEVER serialized to minor learners or parents.
 */

import type { BenchmarkDomain } from '@core-os/assessment';

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

export interface SafeBenchmarkReportDTO {
  domain: BenchmarkDomain;
  domainTitle: string;
  percentileRank: number;
  standardScaleScore: number;
  scaleFormatted: string;
  scaleName: string;
  internationalTier: string;
  developmentalBand: 'Emergent Explorer' | 'Developing Foundation' | 'Competent Practitioner' | 'Advanced Master';
  globalComparison: {
    oecdAverage: number;
    topDecileThreshold: number;
    learnerScore: number;
    deltaVsGlobalMean: number;
  };
  subCompetencies: any[];
  identifiedMisconceptions: any[];
  actionableRoadmap: any[];
  generatedAt: string;
}

/**
 * Maps an evidence item using an explicit allowlist.
 * Psychometric internals (theta, standardError, 3PL parameters) are physically excluded from object creation.
 */
export function toSafeEvidenceDTO(ev: any): SafeEvidenceDTO {
  if (!ev) return ev;

  let qualitativeBand: string | undefined = ev.qualitativeBand;
  let rubricLevel: string | undefined = ev.rubricLevel;
  let score: number | undefined = typeof ev.score === 'number' ? ev.score : undefined;

  if (ev.observedValue && typeof ev.observedValue === 'object') {
    if (ev.observedValue.band) qualitativeBand = String(ev.observedValue.band);
    if (ev.observedValue.level) rubricLevel = String(ev.observedValue.level);
    if (typeof ev.observedValue.score === 'number') score = ev.observedValue.score;
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
    score,
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
 * Maps a benchmark report using an explicit allowlist.
 * Excludes raw theta and SE fields.
 */
export function toSafeBenchmarkReportDTO(report: any): SafeBenchmarkReportDTO | null {
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
    subCompetencies: Array.isArray(report.subCompetencies) ? report.subCompetencies : [],
    identifiedMisconceptions: Array.isArray(report.identifiedMisconceptions) ? report.identifiedMisconceptions : [],
    actionableRoadmap: Array.isArray(report.actionableRoadmap) ? report.actionableRoadmap : [],
    generatedAt: String(report.generatedAt || new Date().toISOString())
  };
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
