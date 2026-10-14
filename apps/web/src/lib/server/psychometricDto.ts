/**
 * CREED OS — Role-Specific Psychometric Data Transfer Object (DTO) Layer
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

export type {
  SafeEvidenceDTO,
  SafeCompetencyDTO,
  SafeSubCompetencyDTO,
  SafeMisconceptionDTO,
  SafeRoadmapMilestoneDTO,
  SafeLearnerProfileDTO,
  StudentSelfProfileDTO,
  ParentLearnerSummaryDTO,
  BenchmarkGatingOptions,
  StudentBenchmarkReportDTO,
  ParentBenchmarkReportDTO,
  SafeBenchmarkReportDTO
} from '$lib/types/psychometricDto';

import type {
  SafeEvidenceDTO,
  SafeCompetencyDTO,
  SafeSubCompetencyDTO,
  SafeMisconceptionDTO,
  SafeRoadmapMilestoneDTO,
  SafeLearnerProfileDTO,
  BenchmarkGatingOptions,
  StudentBenchmarkReportDTO,
  ParentBenchmarkReportDTO
} from '$lib/types/psychometricDto';

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
 *
 * Gate 4 Governance Rule:
 * Unvalidated numerical metrics (percentileRank, standardScaleScore, scaleFormatted)
 * are WITHHELD from responses by default until Gate 4 empirical validation is approved.
 */
export function toStudentBenchmarkReportDTO(
  report: any,
  options: BenchmarkGatingOptions = {}
): StudentBenchmarkReportDTO | null {
  if (!report) return null;

  const isGate4Calibrated = Boolean(options.enableGate4Outputs);
  const approvedFields = new Set(
    options.approvedFields ||
      (isGate4Calibrated ? ['percentileRank', 'standardScaleScore', 'scaleFormatted'] : [])
  );

  const base: StudentBenchmarkReportDTO = {
    domain: report.domain,
    domainTitle: String(report.domainTitle || ''),
    scaleName: String(report.scaleName || 'CREED Foundational Competency Horizon'),
    internationalTier: String(report.internationalTier || 'Foundational Competency Demonstrated'),
    developmentalBand: report.developmentalBand || 'Developing Foundation',
    subCompetencies: Array.isArray(report.subCompetencies) ? report.subCompetencies.map(toSafeSubCompetencyDTO) : [],
    identifiedMisconceptions: Array.isArray(report.identifiedMisconceptions) ? report.identifiedMisconceptions.map(toSafeMisconceptionDTO) : [],
    actionableRoadmap: Array.isArray(report.actionableRoadmap) ? report.actionableRoadmap.map(toSafeRoadmapMilestoneDTO) : [],
    generatedAt: String(report.generatedAt || new Date().toISOString()),
    isGate4Calibrated,
    calibrationStatus: isGate4Calibrated ? 'CALIBRATED' : 'DEVELOPMENTAL_UNLINKED'
  };

  // Only expose numerical indicators when Gate 4 approval has explicitly authorized each output
  if (isGate4Calibrated && approvedFields.has('percentileRank') && typeof report.percentileRank === 'number') {
    base.percentileRank = report.percentileRank;
  }
  if (isGate4Calibrated && approvedFields.has('standardScaleScore') && typeof report.standardScaleScore === 'number') {
    base.standardScaleScore = report.standardScaleScore;
  }
  if (isGate4Calibrated && approvedFields.has('scaleFormatted') && report.scaleFormatted) {
    base.scaleFormatted = String(report.scaleFormatted);
  }

  return base;
}

/**
 * Maps a benchmark report for Verified Guardian Family Diagnostic Guide.
 * Includes family diagnostic context with Gate 4 calibration disclosures.
 *
 * Gate 4 Governance Rule:
 * Global comparison norm delta is WITHHELD from responses by default until Gate 4 validation.
 */
export function toParentBenchmarkReportDTO(
  report: any,
  options: BenchmarkGatingOptions = {}
): ParentBenchmarkReportDTO | null {
  if (!report) return null;

  const base = toStudentBenchmarkReportDTO(report, options);
  if (!base) return null;

  const isGate4Calibrated = Boolean(options.enableGate4Outputs);
  const approvedFields = new Set(
    options.approvedFields ||
      (isGate4Calibrated ? ['percentileRank', 'standardScaleScore', 'scaleFormatted', 'globalComparison'] : [])
  );

  let globalComparison: ParentBenchmarkReportDTO['globalComparison'] = undefined;
  if (isGate4Calibrated && approvedFields.has('globalComparison') && report.globalComparison) {
    globalComparison = {
      oecdAverage: Number(report.globalComparison.oecdAverage || 500),
      topDecileThreshold: Number(report.globalComparison.topDecileThreshold || 600),
      learnerScore: Number(report.globalComparison.learnerScore || 500),
      deltaVsGlobalMean: Number(report.globalComparison.deltaVsGlobalMean || 0)
    };
  }

  const psychometricNotice = isGate4Calibrated
    ? 'Calibrated benchmark output authorized under Gate 4 psychometric validation. Normative references are contextual formative indicators, not deterministic ability labels.'
    : 'Developmental diagnostic report based on verified evidence and qualitative pedagogical rubrics. Standard numerical scaled scores, percentile ranks, and international norm comparisons remain gated pending formal empirical Gate 4 psychometric calibration.';

  return {
    ...base,
    globalComparison,
    psychometricNotice
  };
}

/**
 * Standard backward-compatible alias for benchmark reports.
 */
export function toSafeBenchmarkReportDTO(
  report: any,
  options: BenchmarkGatingOptions = {}
): ParentBenchmarkReportDTO | null {
  return toParentBenchmarkReportDTO(report, options);
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
