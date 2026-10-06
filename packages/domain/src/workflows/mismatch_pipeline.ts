/**
 * Effect Domain Pipeline for Constructive Pathway Mismatch Evaluation
 *
 * Implements type-safe prerequisite evaluation, gap analysis, and roadmap
 * sprint generation as an Effect program.
 */

import { Effect, Data } from 'effect';
import type { Pathway } from '../types/pathway.js';
import type { LearnerProfile } from '../types/learner.js';

export class PathwayNotFoundError extends Data.TaggedError('PathwayNotFoundError')<{
  readonly pathwayId: string;
}> {}

export class LearnerNotFoundError extends Data.TaggedError('LearnerNotFoundError')<{
  readonly learnerId: string;
}> {}

export interface MismatchEvaluationResult {
  readonly pathwayId: string;
  readonly overallReadiness: number;
  readonly status: 'strongly_aligned' | 'aligned' | 'constructive_mismatch';
  readonly gaps: Array<{ competency: string; required: number; demonstrated: number; delta: number }>;
  readonly sprintWeeks: number;
}

export function evaluatePathwayMismatchEffect(
  pathway: Pathway,
  learner: LearnerProfile
): Effect.Effect<MismatchEvaluationResult, never> {
  let totalScore = 0;
  let totalRequired = 0;
  const gaps: Array<{ competency: string; required: number; demonstrated: number; delta: number }> = [];

  for (const req of pathway.requirements) {
    const demonstrated = learner.competencies[req.competency]?.score ?? 3.0;
    const required = req.minimumLevel;
    totalScore += demonstrated;
    totalRequired += required;

    if (demonstrated < required) {
      gaps.push({
        competency: req.competency,
        required,
        demonstrated,
        delta: Number((demonstrated - required).toFixed(2))
      });
    }
  }

  const overallReadiness = Number((totalScore / Math.max(1, totalRequired)).toFixed(2));
  const status =
    gaps.length === 0
      ? overallReadiness >= 0.85
        ? 'strongly_aligned'
        : 'aligned'
      : 'constructive_mismatch';

  const sprintWeeks = gaps.length > 2 ? 8 : gaps.length > 0 ? 6 : 0;

  return Effect.succeed({
    pathwayId: pathway.id,
    overallReadiness,
    status,
    gaps,
    sprintWeeks
  });
}
