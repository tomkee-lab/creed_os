import { describe, it, expect } from 'vitest';
import { Effect } from 'effect';
import {
  createRoleBasedEvidenceAtom,
  transitionEvidenceState,
  projectLearnerEvidenceGraph,
  mapRoleToCompetency,
  EVIDENCE_LEVEL_WEIGHTS,
  type RoleBasedMissionPayload
} from '../src/evidence.js';
import type { LearnerEvidence } from '../src/types/evidence.js';

describe('Activity Theory Role-Based Evidence Engine', () => {
  const learnerId = 'learner-test-01';

  it('maps team roles to specific educational competencies', () => {
    expect(mapRoleToCompetency('kinematics')).toBe('spatial_reasoning');
    expect(mapRoleToCompetency('firmware')).toBe('computational_thinking');
    expect(mapRoleToCompetency('telemetry')).toBe('scientific_inquiry');
  });

  it('creates verified Level 4 evidence atoms for kinematics specialist', () => {
    const payload: RoleBasedMissionPayload = {
      missionId: 'gear-train-mechanics',
      missionTitle: 'Gear Train Torque Transmission',
      teamRole: 'kinematics',
      roleArtifact: {
        kinematicsMetrics: {
          gearRatio: 4.5,
          torqueInLbs: 38,
          safetyFactor: 1.8
        }
      },
      collaborators: ['learner-peer-02'],
      notes: 'Calibrated driving pinion for 25 degree ramp'
    };

    const evidence = createRoleBasedEvidenceAtom(learnerId, payload);

    expect(evidence.evidenceStrength).toBe(4);
    expect(evidence.competency).toBe('spatial_reasoning');
    expect(evidence.evidenceType).toBe('mission_artifact');
    expect(evidence.sourceType).toBe('project_mission');
    expect(evidence.status).toBe('validated');
    expect(evidence.summary).toContain('[Kinematics Specialist]');
    expect(evidence.summary).toContain('Gear Train Torque Transmission');
    expect(evidence.observedValue.rubricCriteria?.['safetyFactor']).toBe(1.8);
  });

  it('creates verified Level 4 evidence atoms for firmware specialist', () => {
    const payload: RoleBasedMissionPayload = {
      missionId: 'sonar-autonomous-rover',
      missionTitle: 'Obstacle Evasion & Feedback',
      teamRole: 'firmware',
      roleArtifact: {
        firmwareAst: {
          totalBlocks: 18,
          fsmStatesCount: 4,
          astChecksum: 'ast-sha256-abc'
        }
      }
    };

    const evidence = createRoleBasedEvidenceAtom(learnerId, payload);

    expect(evidence.evidenceStrength).toBe(4);
    expect(evidence.competency).toBe('computational_thinking');
    expect(evidence.summary).toContain('[Firmware Specialist]');
    expect(evidence.observedValue.rubricCriteria?.['totalBlocks']).toBe(18);
  });

  it('creates verified Level 4 evidence atoms for telemetry specialist', () => {
    const payload: RoleBasedMissionPayload = {
      missionId: 'cv-element-tracker',
      missionTitle: 'Computer Vision HSV Tracking',
      teamRole: 'telemetry',
      roleArtifact: {
        telemetry: {
          sensorSampleCount: 1200,
          boundingBoxIou: 0.91
        }
      }
    };

    const evidence = createRoleBasedEvidenceAtom(learnerId, payload);

    expect(evidence.evidenceStrength).toBe(4);
    expect(evidence.competency).toBe('scientific_inquiry');
    expect(evidence.summary).toContain('[Telemetry Specialist]');
    expect(evidence.observedValue.rubricCriteria?.['boundingBoxIou']).toBe(0.91);
  });
});

describe('Evidence State Machine Transitions', () => {
  const dummyEvidence: LearnerEvidence = {
    id: 'ev-01',
    learnerId: 'learner-01',
    competency: 'computational_thinking',
    evidenceType: 'mission_artifact',
    sourceType: 'project_mission',
    sourceTitle: 'Rover Pathfinder',
    summary: 'Pathfinder completed',
    observedValue: { scoreFraction: 0.9 },
    confidence: 0.9,
    evidenceStrength: 4,
    status: 'candidate',
    visibility: 'learner_only',
    observedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  it('executes valid transitions: candidate -> validated -> accepted', async () => {
    const step1 = await Effect.runPromise(transitionEvidenceState(dummyEvidence, 'validated'));
    expect(step1.status).toBe('validated');

    const step2 = await Effect.runPromise(transitionEvidenceState(step1, 'accepted'));
    expect(step2.status).toBe('accepted');
  });

  it('rejects illegal jump from candidate directly to accepted', async () => {
    const program = transitionEvidenceState(dummyEvidence, 'accepted');
    await expect(Effect.runPromise(program)).rejects.toThrow();
  });
});

describe('Longitudinal Competency Graph Projection', () => {
  it('projects multi-level evidence atoms into qualitative developmental bands', () => {
    const records: LearnerEvidence[] = [
      {
        id: 'ev-1',
        learnerId: 'l1',
        competency: 'computational_thinking',
        evidenceType: 'diagnostic_response',
        sourceType: 'cat_assessment',
        sourceTitle: 'Adaptive CAT',
        summary: 'Theta estimate +0.95',
        observedValue: { scoreFraction: 0.85 },
        confidence: 0.9,
        evidenceStrength: 3, // Level 3 (w = 0.80)
        status: 'accepted',
        visibility: 'learner_only',
        observedAt: '',
        createdAt: ''
      },
      {
        id: 'ev-2',
        learnerId: 'l1',
        competency: 'computational_thinking',
        evidenceType: 'mission_artifact',
        sourceType: 'project_mission',
        sourceTitle: 'PID Tuning Mission',
        summary: 'PID settled under 2.5s',
        observedValue: { scoreFraction: 0.95 },
        confidence: 0.95,
        evidenceStrength: 4, // Level 4 (w = 0.90)
        status: 'validated',
        visibility: 'learner_only',
        observedAt: '',
        createdAt: ''
      }
    ];

    const graph = projectLearnerEvidenceGraph(records);
    const ct = graph['computational_thinking'];

    expect(ct).toBeDefined();
    expect(ct.activeEvidenceCount).toBe(2);
    expect(ct.highestStrengthLevel).toBe(4);
    expect(ct.developmentalBand).toBe('Strong Foundation');
    expect(ct.weightedScore).toBeGreaterThanOrEqual(4.0);
  });
});
