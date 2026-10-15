/**
 * CREED OS — Singapore Full SBB Multi-Route Pathway & Constructive Mismatch Engine
 *
 * Implements:
 * 1. Singapore Ministry of Education Full Subject-Based Banding (Full SBB) mapping:
 *    - PSLE Achievement Level (AL) aggregate to Posting Groups (PG1, PG2, PG3)
 *    - Subject Bands (G1, G2, G3)
 *    - Post-Secondary Aggregates (ELR2B2 for Polytechnic, ELMAB3 for ITE Higher Nitec)
 * 2. 3-Tier Multi-Route Parallel Architecture (Academic, Vocational, Open-Source Portfolio)
 * 3. Constructive Mismatch Algorithm (Zero Rejection, Foundation Sprints & Try-Before-You-Choose Mini-Missions)
 */

import { Effect, Data } from 'effect';
import type { CompetencyDomain } from './types/competency.js';
import type { SubjectBand, PostingGroup } from './workflows/pathway.js';
export type { SubjectBand, PostingGroup };
export type RouteTier = 'tier1_academic' | 'tier2_vocational' | 'tier3_portfolio';

export interface PsleSubjectScore {
  subject: 'english' | 'mathematics' | 'science' | 'mother_tongue';
  alGrade: number; // 1 (best) to 8
  isFoundation?: boolean;
}

export interface FullSbbPlacement {
  psleAggregate: number; // Sum of 4 AL grades (4 - 32)
  postingGroup: PostingGroup;
  initialBandRecommendation: Record<string, SubjectBand>;
  eligibleForHigherLevel: string[];
}

export interface PostSecondaryAggregates {
  elr2b2: number; // English + 2 Relevant + 2 Best (Polytechnic JAE)
  elmab3: number; // English + Math + 1 Aptitude + 2 Best (ITE Higher Nitec)
  isPolyEligible: boolean; // Typically ELR2B2 <= 26
  isIteEligible: boolean;  // Typically ELMAB3 <= 19
}

export interface MultiRoutePathwayTrack {
  tier: RouteTier;
  title: string;
  credential: string;
  institutionCategory: string;
  typicalDurationYears: number;
  description: string;
  prerequisites: Array<{
    competency: CompetencyDomain;
    requiredLevel: number;
  }>;
  verifiedArtifactsRequired: string[];
  status: 'strongly_aligned' | 'aligned' | 'constructive_mismatch';
}

export interface ConstructiveMismatchResult {
  pathwayId: string;
  pathwayTitle: string;
  developmentalBand: 'Strong Foundation' | 'Developing Foundation' | 'Emerging Explorer';
  competenciesDemonstratedRatio: string; // e.g. "4 / 6 foundational competencies demonstrated"
  prerequisiteDelta: number; // max(0, Preq - Eobserved)
  feasibilityCategory: 'minor_refresher' | 'foundation_sprint' | 'multi_term_roadmap';
  recommendedSprintWeeks: number; // 4, 8, or 12
  remediationFocusAreas: string[];
  tryBeforeYouChooseMissions: Array<{
    id: string;
    slug: string;
    title: string;
    durationMinutes: number;
    scenario: string;
    evidenceAtomSlug: string;
  }>;
  multiRouteTracks: MultiRoutePathwayTrack[];
}

// -----------------------------------------------------------------------------
// Singapore Full SBB Core Algorithms
// -----------------------------------------------------------------------------

/**
 * Maps PSLE Achievement Level (AL) aggregate score to Posting Group (PG1, PG2, PG3)
 * per Singapore MOE Full SBB 2024+ Secondary School Posting Framework.
 */
export function mapPsleToPostingGroup(psleAggregate: number): PostingGroup {
  if (psleAggregate <= 22) return 'PG3'; // Express standard equivalent
  if (psleAggregate <= 24) return 'PG2'; // Normal (Academic) equivalent
  return 'PG1';                          // Normal (Technical) equivalent
}

/**
 * Determines Full SBB subject eligibility at start of Secondary 1 based on individual AL grades.
 */
export function evaluateFullSbbPlacement(scores: PsleSubjectScore[]): FullSbbPlacement {
  const aggregate = scores.reduce((sum, s) => sum + s.alGrade, 0);
  const postingGroup = mapPsleToPostingGroup(aggregate);

  const initialBandRecommendation: Record<string, SubjectBand> = {};
  const eligibleForHigherLevel: string[] = [];

  for (const s of scores) {
    if (postingGroup === 'PG3') {
      initialBandRecommendation[s.subject] = 'G3';
    } else if (postingGroup === 'PG2') {
      // G2 base; can offer G3 if AL 5 or better
      if (s.alGrade <= 5 && !s.isFoundation) {
        initialBandRecommendation[s.subject] = 'G3';
        eligibleForHigherLevel.push(s.subject);
      } else {
        initialBandRecommendation[s.subject] = 'G2';
      }
    } else {
      // PG1 base; can offer G2 if AL 5 or 6 (or Foundation AL A)
      if (s.alGrade <= 5 && !s.isFoundation) {
        initialBandRecommendation[s.subject] = 'G2';
        eligibleForHigherLevel.push(s.subject);
      } else {
        initialBandRecommendation[s.subject] = 'G1';
      }
    }
  }

  return {
    psleAggregate: aggregate,
    postingGroup,
    initialBandRecommendation,
    eligibleForHigherLevel
  };
}

/**
 * Simulates Singapore JAE post-secondary admission aggregates (ELR2B2 & ELMAB3).
 */
export function calculatePostSecondaryAggregates(
  subjectGrades: Record<string, number>
): PostSecondaryAggregates {
  const el = subjectGrades['english'] ?? 3;
  const ma = subjectGrades['mathematics'] ?? 3;
  const sc = subjectGrades['science'] ?? 3;
  const dt = subjectGrades['design_tech'] ?? subjectGrades['computing'] ?? 2;
  const hu = subjectGrades['humanities'] ?? 3;

  // ELR2B2: English (EL) + 2 Relevant (Math, Science) + 2 Best other
  const elr2b2 = el + ma + sc + dt + hu;

  // ELMAB3: English (EL) + Math (MA) + 1 Aptitude (DT/Computing) + 2 Best
  const elmab3 = el + ma + dt + sc + hu;

  return {
    elr2b2,
    elmab3,
    isPolyEligible: elr2b2 <= 26,
    isIteEligible: elmab3 <= 19
  };
}

// -----------------------------------------------------------------------------
// Constructive Mismatch Algorithm (Zero Rejection & 3-Tier Multi-Route)
// -----------------------------------------------------------------------------

export interface PathwayPrerequisiteInput {
  competency: CompetencyDomain;
  requiredLevel: number; // e.g. 3.5
  importance: 'critical_foundation' | 'strongly_recommended' | 'desirable';
}

export function evaluateConstructiveMismatch(
  pathwayId: string,
  pathwayTitle: string,
  requirements: PathwayPrerequisiteInput[],
  observedCompetencies: Record<string, number>
): ConstructiveMismatchResult {
  let maxGap = 0;
  let demonstratedCount = 0;
  const remediationFocusAreas: string[] = [];

  for (const req of requirements) {
    const demonstrated = observedCompetencies[req.competency] ?? 2.5;
    const gap = Math.max(0, req.requiredLevel - demonstrated);

    if (gap === 0) {
      demonstratedCount++;
    } else {
      remediationFocusAreas.push(
        `${formatCompetencyName(req.competency)} (Need +${gap.toFixed(1)} level)`
      );
      if (gap > maxGap) {
        maxGap = gap;
      }
    }
  }

  // Feasibility classification
  let feasibilityCategory: 'minor_refresher' | 'foundation_sprint' | 'multi_term_roadmap';
  let recommendedSprintWeeks: number;

  if (maxGap <= 0.5) {
    feasibilityCategory = 'minor_refresher';
    recommendedSprintWeeks = 4;
  } else if (maxGap <= 1.5) {
    feasibilityCategory = 'foundation_sprint';
    recommendedSprintWeeks = 8;
  } else {
    feasibilityCategory = 'multi_term_roadmap';
    recommendedSprintWeeks = 12;
  }

  // Qualitative developmental band (NO false precision percentage)
  const ratio = demonstratedCount / Math.max(1, requirements.length);
  const developmentalBand: 'Strong Foundation' | 'Developing Foundation' | 'Emerging Explorer' =
    ratio >= 0.8
      ? 'Strong Foundation'
      : ratio >= 0.5
      ? 'Developing Foundation'
      : 'Emerging Explorer';

  const competenciesDemonstratedRatio = `${demonstratedCount} / ${requirements.length} foundational competencies demonstrated`;

  // Curated "Try-Before-You-Choose" mini-missions
  const tryBeforeYouChooseMissions = [
    {
      id: 'tb-01',
      slug: 'mars-rover-pathfinder',
      title: '2D Grid Sonar Pathfinder',
      durationMinutes: 20,
      scenario: '5×5 terrain grid sonar obstacle avoidance and sequential decomposition',
      evidenceAtomSlug: 'EVID_ROVER_GRID_L4'
    },
    {
      id: 'tb-02',
      slug: 'gear-train-mechanics',
      title: 'Gear Train Torque Transmission',
      durationMinutes: 25,
      scenario: 'Compute reciprocal RPM vs torque ratio for 25° incline climb',
      evidenceAtomSlug: 'EVID_GEAR_KINEMATICS_L4'
    },
    {
      id: 'tb-03',
      slug: 'sonar-autonomous-rover',
      title: 'Obstacle Evasion & Feedback',
      durationMinutes: 30,
      scenario: 'Ultrasonic sensor threshold tuning with 90° corner-trap evasion FSM',
      evidenceAtomSlug: 'EVID_FSM_OBSTACLE_L4'
    }
  ];

  // 3-Tier Multi-Route Parallel Tracks
  const multiRouteTracks: MultiRoutePathwayTrack[] = [
    {
      tier: 'tier1_academic',
      title: 'Academic University Route',
      credential: 'B.Tech / B.S. in Robotics & Autonomous Systems',
      institutionCategory: 'Autonomous Research Universities (e.g. NUS, NTU, SUTD)',
      typicalDurationYears: 4,
      description: 'Rigorous engineering foundations with mathematical modeling, control theory, and hardware-software co-design.',
      prerequisites: requirements.map((r) => ({
        competency: r.competency,
        requiredLevel: r.requiredLevel
      })),
      verifiedArtifactsRequired: ['Standard SEC G3 Math & Physics', 'CAT Theta >= +0.80'],
      status: maxGap === 0 ? 'strongly_aligned' : maxGap <= 0.5 ? 'aligned' : 'constructive_mismatch'
    },
    {
      tier: 'tier2_vocational',
      title: 'Applied Vocational Route',
      credential: 'Polytechnic Diploma in Mechatronics & Robotics / Higher Nitec',
      institutionCategory: 'Polytechnics & Institutes of Technical Education (ITE)',
      typicalDurationYears: 3,
      description: 'Hands-on hardware labs, industry CAD tooling, PLC programming, and applied robotics apprenticeships.',
      prerequisites: requirements.map((r) => ({
        competency: r.competency,
        requiredLevel: Math.max(2.0, r.requiredLevel - 0.5)
      })),
      verifiedArtifactsRequired: ['Applied Kinematics Proving Ground', 'ELR2B2 <= 26'],
      status: maxGap <= 1.0 ? 'strongly_aligned' : 'aligned'
    },
    {
      tier: 'tier3_portfolio',
      title: 'Open-Source & Competition Portfolio Route',
      credential: 'Verified Technical Portfolio & Competition Badging',
      institutionCategory: 'Open Source Community (GitHub, WRO, FRC, VEX)',
      typicalDurationYears: 2,
      description: 'Direct skill demonstration through open-source GitHub repositories, verified competition match rubrics, and simulator telemetry artifacts.',
      prerequisites: requirements.map((r) => ({
        competency: r.competency,
        requiredLevel: Math.max(2.0, r.requiredLevel - 0.8)
      })),
      verifiedArtifactsRequired: ['Verified Git AST Repo', 'WRO / FRC Competition Artifact'],
      status: 'strongly_aligned'
    }
  ];

  return {
    pathwayId,
    pathwayTitle,
    developmentalBand,
    competenciesDemonstratedRatio,
    prerequisiteDelta: Number(maxGap.toFixed(2)),
    feasibilityCategory,
    recommendedSprintWeeks,
    remediationFocusAreas,
    tryBeforeYouChooseMissions,
    multiRouteTracks
  };
}

function formatCompetencyName(c: string): string {
  return c
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
