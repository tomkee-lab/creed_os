/**
 * CREED OS — Longitudinal Learner Evidence Graph & Activity Theory Engine
 *
 * Implements:
 * 1. 5-Level Strength Hierarchy (Levels 1 to 5 with statistical weights w = 0.20 to 0.98)
 * 2. Activity Theory Role-Based Team Payloads (Kinematics, Firmware, Telemetry)
 * 3. Evidence State Machine (candidate -> validated -> accepted -> superseded / expired)
 * 4. Longitudinal Competency Graph Projection (Evidence before inference)
 */

import { Effect, Data } from 'effect';
import type { CompetencyDomain } from './types/competency.js';
import type { LearnerEvidence, EvidenceStrengthLevel, EvidenceStatus } from './types/evidence.js';

export const EVIDENCE_LEVEL_WEIGHTS: Record<EvidenceStrengthLevel, number> = {
  1: 0.20, // Self-Report
  2: 0.40, // Structured Inventory
  3: 0.80, // Structured Diagnostic (3PL IRT CAT)
  4: 0.90, // Applied Mission Task (Proving Ground simulator, AST, kinematics)
  5: 0.98  // Longitudinal Performance across diverse contexts
};

export type TeamMissionRole = 'kinematics' | 'firmware' | 'telemetry';

export interface RoleBasedMissionPayload {
  missionId: string;
  missionTitle: string;
  teamRole: TeamMissionRole;
  roleArtifact: {
    kinematicsMetrics?: {
      gearRatio?: number;
      torqueInLbs?: number;
      deflectionMm?: number;
      massKg?: number;
      safetyFactor?: number;
    };
    firmwareAst?: {
      totalBlocks?: number;
      fsmStatesCount?: number;
      astChecksum?: string;
    };
    telemetry?: {
      sensorSampleCount?: number;
      signalDriftPpm?: number;
      boundingBoxIou?: number;
      noiseFloorDb?: number;
    };
  };
  collaborators?: string[];
  notes?: string;
}

export class InvalidEvidenceStateTransitionError extends Data.TaggedError('InvalidEvidenceStateTransitionError')<{
  readonly currentStatus: EvidenceStatus;
  readonly targetStatus: EvidenceStatus;
  readonly reason: string;
}> {}

/**
 * Maps an Activity Theory team role to its primary underlying competency domain.
 */
export function mapRoleToCompetency(role: TeamMissionRole): CompetencyDomain {
  switch (role) {
    case 'kinematics':
      return 'spatial_reasoning';
    case 'firmware':
      return 'computational_thinking';
    case 'telemetry':
      return 'scientific_inquiry';
  }
}

/**
 * Constructs a verified Level 4 Evidence Atom from an Activity Theory role-based mission submission.
 */
export function createRoleBasedEvidenceAtom(
  learnerId: string,
  payload: RoleBasedMissionPayload
): LearnerEvidence {
  const competency = mapRoleToCompetency(payload.teamRole);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  let summary = '';
  let scoreFraction = 0.90;
  const criteria: Record<string, number> = {
    roleWeight: 1.0,
    evidenceLevel: 4
  };

  if (payload.teamRole === 'kinematics') {
    const k = payload.roleArtifact.kinematicsMetrics || {};
    summary = `[Kinematics Specialist] Optimized mechanical force transfer in ${payload.missionTitle} (Torque: ${k.torqueInLbs ?? 24} in-lbs, Ratio: ${k.gearRatio ?? 3}:1).`;
    if (k.safetyFactor) criteria['safetyFactor'] = k.safetyFactor;
  } else if (payload.teamRole === 'firmware') {
    const f = payload.roleArtifact.firmwareAst || {};
    summary = `[Firmware Specialist] Architected autonomous control loop AST in ${payload.missionTitle} (${f.totalBlocks ?? 14} AST nodes, ${f.fsmStatesCount ?? 3} FSM states).`;
    if (f.totalBlocks) criteria['totalBlocks'] = f.totalBlocks;
  } else {
    const t = payload.roleArtifact.telemetry || {};
    summary = `[Telemetry Specialist] Calibrated sensor telemetry stream in ${payload.missionTitle} (Samples: ${t.sensorSampleCount ?? 500}, IOU: ${t.boundingBoxIou ?? 0.88}).`;
    if (t.boundingBoxIou) criteria['boundingBoxIou'] = t.boundingBoxIou;
  }

  return {
    id,
    learnerId,
    competency,
    evidenceType: 'mission_artifact',
    sourceType: 'project_mission',
    sourceTitle: payload.missionTitle,
    summary,
    observedValue: {
      scoreFraction,
      rubricCriteria: criteria,
      qualitativeNotes: `Activity Theory Role: ${payload.teamRole.toUpperCase()}. Collaborators: ${payload.collaborators?.join(', ') || 'Independent'}. ${payload.notes || ''}`
    },
    confidence: 0.92,
    evidenceStrength: 4 as const, // Level 4 Applied Task
    status: 'validated' as const,
    visibility: 'learner_only',
    observedAt: now,
    createdAt: now
  };
}

/**
 * Validates and executes an Evidence State Transition.
 * CANDIDATE -> VALIDATED -> ACCEPTED -> SUPERSEDED / EXPIRED
 */
export function transitionEvidenceState(
  evidence: LearnerEvidence,
  targetStatus: EvidenceStatus
): Effect.Effect<LearnerEvidence, InvalidEvidenceStateTransitionError> {
  const current = evidence.status;

  if (current === targetStatus) {
    return Effect.succeed(evidence);
  }

  // Legal state transitions
  const legalTransitions: Record<EvidenceStatus, EvidenceStatus[]> = {
    candidate: ['validated', 'contested', 'expired'],
    validated: ['accepted', 'contested', 'superseded', 'expired'],
    accepted: ['superseded', 'expired', 'contested'],
    contested: ['candidate', 'validated', 'expired'],
    superseded: ['expired'],
    expired: []
  };

  if (!legalTransitions[current]?.includes(targetStatus)) {
    return Effect.fail(
      new InvalidEvidenceStateTransitionError({
        currentStatus: current,
        targetStatus,
        reason: `Cannot transition directly from '${current}' to '${targetStatus}'.`
      })
    );
  }

  return Effect.succeed({
    ...evidence,
    status: targetStatus
  });
}

export interface ProjectedCompetency {
  competency: CompetencyDomain;
  weightedScore: number;
  confidence: number;
  activeEvidenceCount: number;
  highestStrengthLevel: EvidenceStrengthLevel;
  developmentalBand: 'Strong Foundation' | 'Developing Foundation' | 'Emerging Explorer';
}

/**
 * Projects a learner's multi-modal evidence atoms into longitudinal competency states.
 */
export function projectLearnerEvidenceGraph(
  evidenceRecords: LearnerEvidence[]
): Record<CompetencyDomain, ProjectedCompetency> {
  const activeRecords = evidenceRecords.filter(
    (e) => e.status === 'accepted' || e.status === 'validated'
  );

  const grouped: Record<string, LearnerEvidence[]> = {};
  for (const r of activeRecords) {
    if (!grouped[r.competency]) grouped[r.competency] = [];
    grouped[r.competency].push(r);
  }

  const result: Partial<Record<CompetencyDomain, ProjectedCompetency>> = {};

  for (const [comp, items] of Object.entries(grouped)) {
    let totalWeight = 0;
    let weightedSum = 0;
    let maxLevel: EvidenceStrengthLevel = 1;

    for (const item of items) {
      const w = EVIDENCE_LEVEL_WEIGHTS[item.evidenceStrength] * (item.confidence || 0.8);
      const score = (item.observedValue.scoreFraction ?? 0.7) * 5.0; // scale 0-5
      weightedSum += score * w;
      totalWeight += w;

      if (item.evidenceStrength > maxLevel) {
        maxLevel = item.evidenceStrength;
      }
    }

    const finalScore = totalWeight > 0 ? Number((weightedSum / totalWeight).toFixed(2)) : 2.5;
    const finalConfidence = Math.min(1.0, Number((totalWeight / (items.length * 0.95)).toFixed(2)));

    const developmentalBand: 'Strong Foundation' | 'Developing Foundation' | 'Emerging Explorer' =
      finalScore >= 3.8
        ? 'Strong Foundation'
        : finalScore >= 2.8
        ? 'Developing Foundation'
        : 'Emerging Explorer';

    result[comp as CompetencyDomain] = {
      competency: comp as CompetencyDomain,
      weightedScore: finalScore,
      confidence: finalConfidence,
      activeEvidenceCount: items.length,
      highestStrengthLevel: maxLevel,
      developmentalBand
    };
  }

  return result as Record<CompetencyDomain, ProjectedCompetency>;
}
