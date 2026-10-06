/**
 * Effect Domain Pipeline for Adaptive Assessment Submission
 *
 * Implements type-safe, composable domain workflows for CAT scoring,
 * ability estimation, and outbox event publishing as specified in
 * docs/ARCHITECTURE.md Section 5.
 */

import { Effect, Data } from 'effect';
import type { AssessmentItem, AssessmentSession, AssessmentResponse } from '../types/assessment.js';
import type { LearnerEvidence } from '../types/evidence.js';

export class SessionNotFoundError extends Data.TaggedError('SessionNotFoundError')<{
  readonly sessionId: string;
}> {}

export class SessionClosedError extends Data.TaggedError('SessionClosedError')<{
  readonly sessionId: string;
  readonly status: string;
}> {}

export class ItemNotFoundError extends Data.TaggedError('ItemNotFoundError')<{
  readonly itemId: string;
}> {}

export interface AssessmentSubmissionInput {
  sessionId: string;
  itemId: string;
  selectedOptionId: string;
  timeSpentSeconds: number;
}

export interface AssessmentSubmissionResult {
  readonly isCorrect: boolean;
  readonly newTheta: number;
  readonly newStandardError: number;
  readonly isConverged: boolean;
  readonly evidenceRecord: LearnerEvidence;
  readonly response: AssessmentResponse;
}

/**
 * Deterministic submission evaluation Effect pipeline.
 */
export function evaluateAssessmentSubmissionEffect(options: {
  session: AssessmentSession;
  item: AssessmentItem;
  input: AssessmentSubmissionInput;
  newTheta: number;
  newStandardError: number;
  isConverged: boolean;
}): Effect.Effect<AssessmentSubmissionResult, SessionClosedError> {
  const { session, item, input, newTheta, newStandardError, isConverged } = options;

  if (session.status === 'completed' || session.status === 'abandoned') {
    return Effect.fail(
      new SessionClosedError({
        sessionId: session.id,
        status: session.status
      })
    );
  }

  const isCorrect = item.correctOptionId === input.selectedOptionId;
  const distractor = item.distractors.find((d) => d.id === input.selectedOptionId);

  const response: AssessmentResponse = {
    itemId: item.id,
    selectedOptionId: input.selectedOptionId,
    isCorrect,
    timeSpentSeconds: input.timeSpentSeconds,
    misconceptionCode: distractor?.misconceptionCode,
    thetaAfter: newTheta,
    standardErrorAfter: newStandardError,
    timestamp: new Date().toISOString()
  };

  const evidenceRecord: LearnerEvidence = {
    id: `ev_${crypto.randomUUID().slice(0, 8)}`,
    learnerId: session.learnerId,
    competency: item.competency,
    skillId: item.skillId,
    evidenceType: 'diagnostic_response',
    sourceType: 'cat_assessment',
    sourceId: session.id,
    sourceTitle: item.prompt.slice(0, 60) + '...',
    summary: isCorrect
      ? `Successfully solved 3PL item (${item.code}) with calibrated difficulty b=${item.irt.b.toFixed(2)}.`
      : `Diagnosed conceptual misconception: ${distractor?.misconceptionDescription || 'Incorrect option selected'}.`,
    observedValue: {
      theta: newTheta,
      standardError: newStandardError,
      scoreFraction: isCorrect ? 1.0 : 0.0
    },
    confidence: Number(Math.max(0.70, 1.0 - newStandardError).toFixed(2)),
    evidenceStrength: 3, // Level 3: Controlled Diagnostic Assessment
    status: 'validated',
    visibility: 'guardian',
    observedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  return Effect.succeed({
    isCorrect,
    newTheta,
    newStandardError,
    isConverged,
    evidenceRecord,
    response
  });
}
