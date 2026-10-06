import { describe, it, expect } from 'vitest';
import {
  StartAssessmentSessionSchema,
  SubmitAssessmentResponseSchema,
  CreateEvidenceSchema,
  MismatchQuerySchema,
  CompetencyDomainSchema
} from '../src/index.js';

describe('Core_OS Domain Zod Schemas', () => {
  it('validates competency domain enum', () => {
    expect(CompetencyDomainSchema.parse('quantitative_reasoning')).toBe('quantitative_reasoning');
    expect(CompetencyDomainSchema.parse('spatial_reasoning')).toBe('spatial_reasoning');
    expect(() => CompetencyDomainSchema.parse('invalid_domain')).toThrow();
  });

  it('validates start assessment session input', () => {
    const valid = {
      learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      domain: 'stem_reasoning'
    };
    expect(StartAssessmentSessionSchema.parse(valid)).toEqual(valid);

    const invalid = {
      learnerId: 'not-a-uuid'
    };
    expect(() => StartAssessmentSessionSchema.parse(invalid)).toThrow();
  });

  it('validates assessment response submission', () => {
    const valid = {
      itemId: 'ITEM-QR-001',
      selectedOptionId: 'opt-b',
      timeSpentSeconds: 24.5
    };
    expect(SubmitAssessmentResponseSchema.parse(valid)).toEqual(valid);

    const invalidTime = {
      itemId: 'ITEM-QR-001',
      selectedOptionId: 'opt-b',
      timeSpentSeconds: -5
    };
    expect(() => SubmitAssessmentResponseSchema.parse(invalidTime)).toThrow();
  });

  it('validates evidence creation payload and enforces strength range 1-5', () => {
    const validEvidence = {
      learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      competency: 'spatial_reasoning',
      evidenceType: 'project_rubric',
      sourceType: 'project_mission',
      sourceTitle: 'RoboBridge Challenge',
      summary: 'Truss design carried 4.8x load-to-weight ratio.',
      observedValue: { ratio: 4.8 },
      confidence: 0.92,
      evidenceStrength: 4
    };
    const parsed = CreateEvidenceSchema.parse(validEvidence);
    expect(parsed.evidenceStrength).toBe(4);
    expect(parsed.status).toBe('candidate');

    const invalidStrength = { ...validEvidence, evidenceStrength: 6 };
    expect(() => CreateEvidenceSchema.parse(invalidStrength)).toThrow();
  });
});
