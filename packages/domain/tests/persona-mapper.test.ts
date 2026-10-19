import { describe, it, expect } from 'vitest';
import {
  mapThetaToParakhBand,
  toSafeEvidenceView,
  sanitizeForPersona,
  EVIDENCE_PROVENANCE_BADGES
} from '../src/presenters/persona-mapper.js';

describe('Persona Mapper — Zero Leakage & PARAKH Boundary', () => {
  it('maps latent theta values to qualitative PARAKH bands without leaking theta', () => {
    const sky = mapThetaToParakhBand(1.4);
    expect(sky.band).toBe('Sky');
    expect(sky.label).toBe('Sky (Autonomous Mastery)');
    expect(sky.descriptor).toContain('autonomous problem-solving');

    const mountain = mapThetaToParakhBand(0.2);
    expect(mountain.band).toBe('Mountain');
    expect(mountain.label).toBe('Mountain (Emerging Independence)');

    const stream = mapThetaToParakhBand(-0.8);
    expect(stream.band).toBe('Stream');
    expect(stream.label).toBe('Stream (Guided Foundation)');
  });

  it('translates internal evidence records to SafeEvidenceView with provenance badges', () => {
    const rawEvidence = {
      id: 'ev-123',
      learnerId: 'learner-99',
      competency: 'mechanical_reasoning',
      level: 4,
      title: 'Truss Bridge Structural Test',
      claim: 'Withstood 50kN load with sub-10mm deflection',
      observedValue: { chainHash: 'hash-abc-123' },
      timestamp: '2026-10-18T10:00:00Z'
    };

    const safeView = toSafeEvidenceView(rawEvidence);
    expect(safeView.id).toBe('ev-123');
    expect(safeView.provenanceBadge).toBe(EVIDENCE_PROVENANCE_BADGES[4]);
    expect(safeView.provenanceBadge).toBe('Verified Maker Artifact');
    expect(safeView.chainHash).toBe('hash-abc-123');
    // Ensure no fractional score like "4/5" is present in provenanceBadge
    expect(safeView.provenanceBadge).not.toContain('/5');
  });

  it('strips latent psychometric parameters for student and parent personas', () => {
    const internalPayload = {
      learnerId: 'student_1',
      theta: 1.25,
      standardError: 0.28,
      irt_a: 1.4,
      irt_b: 0.5,
      irt_c: 0.2,
      fisherInformation: 4.8,
      name: 'Aarav',
      competency: 'spatial_reasoning'
    };

    const studentView = sanitizeForPersona(internalPayload, 'student');
    expect(studentView.theta).toBeUndefined();
    expect(studentView.standardError).toBeUndefined();
    expect(studentView.irt_a).toBeUndefined();
    expect(studentView.irt_b).toBeUndefined();
    expect(studentView.irt_c).toBeUndefined();
    expect(studentView.fisherInformation).toBeUndefined();
    expect(studentView.name).toBe('Aarav');
    expect(studentView.competency).toBe('spatial_reasoning');

    const parentView = sanitizeForPersona(internalPayload, 'parent');
    expect(parentView.theta).toBeUndefined();
    expect(parentView.standardError).toBeUndefined();

    // Teacher can view diagnostic telemetry
    const teacherView = sanitizeForPersona(internalPayload, 'teacher');
    expect(teacherView.theta).toBe(1.25);
    expect(teacherView.standardError).toBe(0.28);
  });
});
