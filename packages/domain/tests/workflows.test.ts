import { describe, it, expect } from 'vitest';
import { Effect } from 'effect';
import {
  evaluateAssessmentSubmissionEffect,
  SessionClosedError
} from '../src/workflows/assessment_pipeline.js';
import { evaluatePathwayMismatchEffect } from '../src/workflows/mismatch_pipeline.js';
import type { AssessmentSession, AssessmentItem, Pathway, LearnerProfile } from '../src/index.js';

describe('Effect Domain Workflows', () => {
  const dummyItem: AssessmentItem = {
    id: 'ITEM-TEST-01',
    competency: 'spatial_reasoning',
    skillId: 'SKILL-01',
    code: 'CODE-01',
    prompt: 'Rotate the prism',
    explanation: 'Geometric symmetry.',
    options: [
      { id: 'opt-a', text: 'Option A' },
      { id: 'opt-b', text: 'Option B' }
    ],
    correctOptionId: 'opt-a',
    distractors: [{ id: 'opt-b', text: 'Option B', misconceptionDescription: 'Inverted axis' }],
    irt: { a: 1.2, b: 0.5, c: 0.2 },
    ageBand: [11, 14],
    status: 'calibrated'
  };

  const dummySession: AssessmentSession = {
    id: 'sess-01',
    learnerId: 'learner-01',
    domain: 'stem_reasoning',
    status: 'in_progress',
    currentTheta: 0.0,
    standardError: 1.0,
    itemsAnswered: 0,
    administeredItemIds: [],
    history: [],
    startedAt: new Date().toISOString()
  };

  it('evaluates correct response and emits level 3 evidence via Effect', async () => {
    const program = evaluateAssessmentSubmissionEffect({
      session: dummySession,
      item: dummyItem,
      input: {
        sessionId: dummySession.id,
        itemId: dummyItem.id,
        selectedOptionId: 'opt-a',
        timeSpentSeconds: 15
      },
      newTheta: 0.65,
      newStandardError: 0.42,
      isConverged: false
    });

    const result = await Effect.runPromise(program);

    expect(result.isCorrect).toBe(true);
    expect(result.newTheta).toBe(0.65);
    expect(result.evidenceRecord.evidenceStrength).toBe(3);
    expect(result.evidenceRecord.sourceType).toBe('cat_assessment');
  });

  it('fails with SessionClosedError when session is already completed', async () => {
    const closedSession = { ...dummySession, status: 'completed' as const };
    const program = evaluateAssessmentSubmissionEffect({
      session: closedSession,
      item: dummyItem,
      input: {
        sessionId: closedSession.id,
        itemId: dummyItem.id,
        selectedOptionId: 'opt-a',
        timeSpentSeconds: 15
      },
      newTheta: 0.65,
      newStandardError: 0.42,
      isConverged: true
    });

    await expect(Effect.runPromise(program)).rejects.toThrow();
  });

  it('evaluates pathway mismatch and generates constructive roadmap', async () => {
    const pathway: Pathway = {
      id: 'path-01',
      code: 'ROBOTICS',
      title: 'Robotics Engineering',
      field: 'engineering',
      tagline: 'Build autonomous machines',
      overview: 'Mechatronics focus',
      growthOutlook: '+20%',
      requirements: [
        { competency: 'spatial_reasoning', minimumLevel: 4.0, importance: 'critical_foundation' },
        { competency: 'quantitative_reasoning', minimumLevel: 3.5, importance: 'critical_foundation' }
      ],
      routes: [],
      missions: []
    };

    const learner: LearnerProfile = {
      id: 'learner-01',
      userId: 'user-01',
      fullName: 'Test Student',
      age: 13,
      gradeBand: 'Class 8',
      competencies: {
        spatial_reasoning: {
          competency: 'spatial_reasoning',
          title: 'Spatial',
          score: 4.5,
          theta: 1.2,
          standardError: 0.3,
          descriptor: 'Advanced',
          confidence: 0.9,
          lastAssessedAt: ''
        },
        quantitative_reasoning: {
          competency: 'quantitative_reasoning',
          title: 'Quantitative',
          score: 2.8,
          theta: -0.2,
          standardError: 0.4,
          descriptor: 'Developing',
          confidence: 0.8,
          lastAssessedAt: ''
        },
        logical_deduction: null as any,
        scientific_inquiry: null as any,
        computational_thinking: null as any,
        systems_thinking: null as any,
        creative_problem_solving: null as any,
        metacognition: null as any
      },
      recentEvidence: [],
      savedPathways: [],
      mismatchAnalyses: {},
      completedMissions: [],
      updatedAt: ''
    };

    const program = evaluatePathwayMismatchEffect(pathway, learner);
    const result = await Effect.runPromise(program);

    expect(result.status).toBe('constructive_mismatch');
    expect(result.gaps).toHaveLength(1);
    expect(result.gaps[0].competency).toBe('quantitative_reasoning');
    expect(result.sprintWeeks).toBe(6);
  });
});
