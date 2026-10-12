import { Effect, Data } from 'effect';

// -----------------------------------------------------------------------------
// Errors
// -----------------------------------------------------------------------------
export class InsufficientEvidenceError extends Data.TaggedError('InsufficientEvidenceError')<{
  readonly message: string;
}> {}

export class InvalidThetaRangeError extends Data.TaggedError('InvalidThetaRangeError')<{
  readonly message: string;
}> {}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export type SubjectBand = 'G1' | 'G2' | 'G3';
export type PostingGroup = 'PG1' | 'PG2' | 'PG3';

export interface SbbLearnerProfile {
  readonly id: string;
  readonly psleScore: number; // For SG context mapping, or general achievement index
  readonly psychometricTheta: number; // IRT ability estimate (-3.0 to +3.0)
  readonly standardError: number;
}

export interface SubjectPrerequisite {
  readonly subjectId: string;
  readonly targetBand: SubjectBand;
  readonly requiredTheta: number;
}

// -----------------------------------------------------------------------------
// Algorithms (Constructive Mismatch & SBB)
// -----------------------------------------------------------------------------

/**
 * Maps a standardized score to an SBB Posting Group.
 * Lower PSLE score aggregate (e.g. AL4-AL20) generally maps to PG3 (express equivalent)
 */
export const determinePostingGroup = (score: number): Effect.Effect<PostingGroup, never> =>
  Effect.sync(() => {
    if (score <= 22) return 'PG3';
    if (score <= 25) return 'PG2';
    return 'PG1';
  });

/**
 * Calculates Constructive Mismatch.
 * Optimal flow state is achieved when a task is slightly harder than the learner's current ability.
 * Vygotsky's Zone of Proximal Development mapped via IRT.
 */
export const calculateConstructiveMismatch = (
  learnerTheta: number,
  requiredTheta: number
): Effect.Effect<{ isOptimal: boolean; delta: number }, InvalidThetaRangeError> => {
  if (learnerTheta < -4 || learnerTheta > 4) {
    return Effect.fail(
      new InvalidThetaRangeError({ message: 'Theta is outside standard [-4, 4] bounds.' })
    );
  }

  const delta = Number((requiredTheta - learnerTheta).toFixed(2));
  // Optimal mismatch: The task is between 0.05 and 0.6 logits harder than the learner's ability.
  const isOptimal = delta > 0.05 && delta <= 0.6;

  return Effect.succeed({ isOptimal, delta });
};

/**
 * Validates if a learner can take a specific Subject Band.
 */
export const validateSubjectBand = (
  profile: SbbLearnerProfile,
  prereq: SubjectPrerequisite
): Effect.Effect<
  { status: 'APPROVED' | 'STRETCH' | 'UNREADY'; delta: number },
  InsufficientEvidenceError | InvalidThetaRangeError
> => {
  if (profile.standardError > 0.5) {
    return Effect.fail(
      new InsufficientEvidenceError({
        message: 'High standard error. More assessment items required.'
      })
    );
  }

  return Effect.map(
    calculateConstructiveMismatch(profile.psychometricTheta, prereq.requiredTheta),
    (mismatch) => {
      if (mismatch.delta <= 0) {
        return { status: 'APPROVED' as const, delta: mismatch.delta }; // Learner ability >= required
      }

      if (mismatch.isOptimal) {
        return { status: 'STRETCH' as const, delta: mismatch.delta }; // Perfect constructive mismatch
      }

      return { status: 'UNREADY' as const, delta: mismatch.delta }; // Delta too large
    }
  );
};
