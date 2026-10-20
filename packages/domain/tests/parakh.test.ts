import { describe, it, expect } from 'vitest';
import {
  isValidApaarId,
  ApaarIdSchema,
  scoreToParakhTier,
  generateParakhHpc,
  PARAKH_I18N,
  type ParakhSelfReflection,
  type ParakhPeerEvaluation,
  type ParakhTeacherObservation,
  type ParakhParentFeedback
} from '../src/parakh.js';

describe('PARAKH 360-Degree Holistic Progress Card & APAAR Engine', () => {
  describe('APAAR ID Validation', () => {
    it('accepts valid 12-digit numeric APAAR IDs', () => {
      expect(isValidApaarId('123456789012')).toBe(true);
      expect(isValidApaarId('987654321098')).toBe(true);
      expect(ApaarIdSchema.safeParse('123456789012').success).toBe(true);
    });

    it('rejects malformed APAAR IDs', () => {
      expect(isValidApaarId('12345')).toBe(false);
      expect(isValidApaarId('1234567890123')).toBe(false);
      expect(isValidApaarId('12345678901A')).toBe(false);
      expect(isValidApaarId('')).toBe(false);
      expect(isValidApaarId('abcdefghijkl')).toBe(false);

      expect(ApaarIdSchema.safeParse('12345').success).toBe(false);
      expect(ApaarIdSchema.safeParse('non-numeric1').success).toBe(false);
    });
  });

  describe('Qualitative Milestone Tier Mapping (Zero False Precision)', () => {
    it('maps scores >= 3.8 to Advanced', () => {
      expect(scoreToParakhTier(4.5)).toBe('Advanced');
      expect(scoreToParakhTier(3.8)).toBe('Advanced');
    });

    it('maps scores >= 2.8 and < 3.8 to Proficient', () => {
      expect(scoreToParakhTier(3.79)).toBe('Proficient');
      expect(scoreToParakhTier(2.8)).toBe('Proficient');
    });

    it('maps scores >= 1.8 and < 2.8 to Developing', () => {
      expect(scoreToParakhTier(2.79)).toBe('Developing');
      expect(scoreToParakhTier(1.8)).toBe('Developing');
    });

    it('maps scores < 1.8 to Beginner', () => {
      expect(scoreToParakhTier(1.79)).toBe('Beginner');
      expect(scoreToParakhTier(0.5)).toBe('Beginner');
    });
  });

  describe('generateParakhHpc Compilation', () => {
    it('compiles default HPC record with curriculum stage and 4-way evaluation quad', () => {
      const hpc = generateParakhHpc({
        id: 'learner-101',
        fullName: 'Aarav Sharma',
        grade: 8,
        apaarId: '123456789012'
      });

      expect(hpc.id).toMatch(/^hpc_learner-101_\d+$/);
      expect(hpc.learnerId).toBe('learner-101');
      expect(hpc.learnerName).toBe('Aarav Sharma');
      expect(hpc.gradeBand).toBe('Class 8');
      expect(hpc.stage).toBe('middle');
      expect(hpc.apaarId).toBe('123456789012');
      expect(hpc.academicSession).toBe('2026–2027');

      // 4-Way Quad
      expect(hpc.selfReflections.length).toBeGreaterThan(0);
      expect(hpc.peerEvaluations.length).toBeGreaterThan(0);
      expect(hpc.teacherObservations.length).toBeGreaterThan(0);
      expect(hpc.parentFeedback.length).toBeGreaterThan(0);

      // Developmental Domains
      expect(hpc.cognitiveDevelopment.stemReasoning.tier).toBeDefined();
      expect(hpc.cognitiveDevelopment.computationalThinking.tier).toBeDefined();
      expect(hpc.socioEmotionalDevelopment.empathyAndCollaboration.tier).toBe('Proficient');
      expect(hpc.socioEmotionalDevelopment.metacognitionAndResilience.tier).toBe('Advanced');
      expect(hpc.aestheticAndAppliedDevelopment.engineeringDesign.tier).toBe('Advanced');
      expect(hpc.overallHolisticSummary.totalEvidenceLedgerCount).toBeGreaterThanOrEqual(6);
    });

    it('correctly maps stages: foundational (<=2/3), preparatory (<=5), middle (<=8), secondary (>8)', () => {
      const prepHpc = generateParakhHpc({ id: 'l1', grade: 4 });
      expect(prepHpc.stage).toBe('preparatory');

      const midHpc = generateParakhHpc({ id: 'l2', grade: 7 });
      expect(midHpc.stage).toBe('middle');

      const secHpc = generateParakhHpc({ id: 'l3', grade: 10 });
      expect(secHpc.stage).toBe('secondary');
    });

    it('sets apaarId to null if missing or invalid', () => {
      const hpcNoApaar = generateParakhHpc({ id: 'l1', grade: 8 });
      expect(hpcNoApaar.apaarId).toBeNull();

      const hpcInvalidApaar = generateParakhHpc({ id: 'l2', grade: 8, apaarId: 'invalid' });
      expect(hpcInvalidApaar.apaarId).toBeNull();
    });

    it('incorporates custom observations and reflections into the 4-way quad', () => {
      const customReflection: ParakhSelfReflection = {
        missionOrAssessmentId: 'smart-grid-balancing',
        confidenceLevel: 5,
        perceivedChallenge: 'manageable',
        keyConceptLearned: 'Dynamic solar shedding prevents grid frequency collapse under peak load.',
        nextGrowthGoal: 'Integrate battery discharge buffer with real-time response.',
        submittedAt: '2026-10-20T10:00:00Z'
      };

      const customPeer: ParakhPeerEvaluation = {
        peerDisplayName: 'Diya Patel',
        projectTitle: 'Smart Grid Load Balancing',
        collaborativeContribution: 'lead_problem_solver',
        communicationClarity: 'Advanced',
        constructiveFeedback: 'Engineered clean frequency stabilizer logic during peak simulation test.',
        observedAt: '2026-10-20T10:30:00Z'
      };

      const customTeacher: ParakhTeacherObservation = {
        teacherId: 'tch-science-02',
        teacherName: 'Dr. Ramesh Iyer',
        subject: 'Clean Energy & Physical Sciences',
        craStage: 'Abstract',
        targetedCompetency: 'Energy Flow & Dynamic Equilibrium',
        demonstratedMilestone: 'Solved non-linear load distribution under high stochastic variance.',
        developmentalTier: 'Advanced',
        scaffoldingNotes: 'Mastered mathematical energy equilibrium principles.',
        loggedAt: '2026-10-20T11:00:00Z'
      };

      const customParent: ParakhParentFeedback = {
        parentId: 'p-88',
        homeInquiryObservation: 'Discussed clean energy load shifting and solar peak hours at home.',
        curiosityRating: 5,
        screenTimeBalance: 'optimal',
        practicalHandsOnAtHome: 'Measured household energy appliance consumption with home smart meter.',
        recordedAt: '2026-10-20T12:00:00Z'
      };

      const hpc = generateParakhHpc(
        { id: 'l-custom', grade: 9, apaarId: '998877665544' },
        [],
        {
          selfReflections: [customReflection],
          peerEvaluations: [customPeer],
          teacherObservations: [customTeacher],
          parentFeedback: [customParent]
        }
      );

      expect(hpc.selfReflections[0].missionOrAssessmentId).toBe('smart-grid-balancing');
      expect(hpc.peerEvaluations[0].peerDisplayName).toBe('Diya Patel');
      expect(hpc.teacherObservations[0].craStage).toBe('Abstract');
      expect(hpc.parentFeedback[0].curiosityRating).toBe(5);
    });
  });

  describe('Bilingual Localization (NCERT/CBSE Terminology)', () => {
    it('provides complete English dictionary tokens', () => {
      expect(PARAKH_I18N.en.hpcTitle).toBe('360° Holistic Progress Card (HPC)');
      expect(PARAKH_I18N.en.evaluationQuad).toBe('360° Evaluation Quadrant');
      expect(PARAKH_I18N.en.tierAdvanced).toBe('Advanced');
      expect(PARAKH_I18N.en.apaarId).toBe('APAAR ID');
    });

    it('provides complete Hindi dictionary tokens', () => {
      expect(PARAKH_I18N.hi.hpcTitle).toContain('समग्र प्रगति पत्रक');
      expect(PARAKH_I18N.hi.evaluationQuad).toContain('मूल्यांकन चतुर्भुज');
      expect(PARAKH_I18N.hi.tierAdvanced).toContain('उन्नत');
      expect(PARAKH_I18N.hi.apaarId).toContain('अपार');
    });
  });
});
