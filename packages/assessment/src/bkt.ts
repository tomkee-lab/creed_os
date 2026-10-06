/**
 * Bayesian Knowledge Tracing (BKT) & Spaced Repetition Decay Engine
 * 
 * Implements deterministic mastery estimation using the standard 4-parameter BKT model
 * (Corbett & Anderson, 1995) combined with an exponential forgetting curve / SM-2
 * interval scheduler for spaced repetition learning navigation.
 */

export interface BktParameters {
  /** P(L0): Prior probability student already knows the skill before any practice */
  pInit: number;
  /** P(T): Probability of learning/transitioning to known state on each opportunity */
  pTransit: number;
  /** P(S): Slip probability - student knows skill but made an accidental mistake */
  pSlip: number;
  /** P(G): Guess probability - student does not know skill but guessed correctly */
  pGuess: number;
}

export const DEFAULT_BKT_PARAMS: BktParameters = {
  pInit: 0.15,
  pTransit: 0.20,
  pSlip: 0.10,
  pGuess: 0.20
};

export interface BktObservation {
  correct: boolean;
  timestamp?: string;
  itemDifficulty?: number;
}

export interface BktState {
  competencyId: string;
  masteryProbability: number; // P(L_t) in [0, 1]
  consecutiveCorrect: number;
  totalAttempts: number;
  lastUpdated: string;
}

/**
 * Updates mastery probability after an observed response using Bayes' Theorem.
 * 
 * Posterior given correct observation:
 *   P(L_t | obs=1) = (P(L_t) * (1 - P(S))) / (P(L_t) * (1 - P(S)) + (1 - P(L_t)) * P(G))
 * 
 * Posterior given incorrect observation:
 *   P(L_t | obs=0) = (P(L_t) * P(S)) / (P(L_t) * P(S) + (1 - P(L_t)) * (1 - P(G)))
 * 
 * Forward projection with transition (learning during step):
 *   P(L_{t+1}) = P(L_t | obs) + (1 - P(L_t | obs)) * P(T)
 */
export function updateBktMastery(
  currentMastery: number,
  correct: boolean,
  params: Partial<BktParameters> = {}
): number {
  const p = { ...DEFAULT_BKT_PARAMS, ...params };
  const L = Math.max(0.001, Math.min(0.999, currentMastery));

  let posterior: number;
  if (correct) {
    const pCorrectGivenKnown = 1 - p.pSlip;
    const pCorrectGivenUnknown = p.pGuess;
    const numerator = L * pCorrectGivenKnown;
    const denominator = numerator + (1 - L) * pCorrectGivenUnknown;
    posterior = denominator > 0 ? numerator / denominator : L;
  } else {
    const pIncorrectGivenKnown = p.pSlip;
    const pIncorrectGivenUnknown = 1 - p.pGuess;
    const numerator = L * pIncorrectGivenKnown;
    const denominator = numerator + (1 - L) * pIncorrectGivenUnknown;
    posterior = denominator > 0 ? numerator / denominator : L;
  }

  // Next state incorporates learning transition P(T)
  const nextMastery = posterior + (1 - posterior) * p.pTransit;
  return Math.max(0.01, Math.min(0.99, Number(nextMastery.toFixed(4))));
}

export interface SpacedRepetitionSchedule {
  competencyId: string;
  currentRetention: number; // R(t) in [0, 1]
  retentionRisk: 'low' | 'moderate' | 'critical';
  stabilityDays: number;
  recommendedReviewAt: string;
  isDueForReview: boolean;
  reviewIntervalDays: number;
}

/**
 * Exponential forgetting curve and SM-2 interval scheduler.
 * R(t) = exp(-t / S) where S is stability in days.
 */
export function calculateSpacedRepetition(options: {
  competencyId: string;
  masteryProbability: number;
  consecutiveCorrect: number;
  lastAssessedAt: string;
  now?: Date;
}): SpacedRepetitionSchedule {
  const {
    competencyId,
    masteryProbability,
    consecutiveCorrect,
    lastAssessedAt,
    now = new Date()
  } = options;

  const lastDate = new Date(lastAssessedAt);
  const elapsedDays = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  // Memory stability S scales with mastery probability and reinforcement streaks
  // Base stability: 2 days at low mastery up to 28 days at high mastery with streaks
  const streakFactor = Math.pow(1.6, Math.min(5, consecutiveCorrect));
  const baseStability = 1.5 + masteryProbability * 6.0;
  const stabilityDays = Math.max(1, baseStability * streakFactor);

  // Exponential decay retention: R(t) = exp(-t / S)
  const currentRetention = Math.max(0.05, Math.min(1.0, Math.exp(-elapsedDays / stabilityDays)));

  let retentionRisk: 'low' | 'moderate' | 'critical' = 'low';
  if (currentRetention < 0.60) {
    retentionRisk = 'critical';
  } else if (currentRetention < 0.80) {
    retentionRisk = 'moderate';
  }

  // Recommended review threshold: review before retention drops below 85%
  // 0.85 = exp(-t_review / S) => t_review = -S * ln(0.85) ≈ S * 0.1625
  const intervalDays = Math.max(1, Math.round(stabilityDays * 0.25));
  const nextReviewDate = new Date(lastDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  const isDueForReview = now.getTime() >= nextReviewDate.getTime();

  return {
    competencyId,
    currentRetention: Number(currentRetention.toFixed(3)),
    retentionRisk,
    stabilityDays: Number(stabilityDays.toFixed(1)),
    recommendedReviewAt: nextReviewDate.toISOString(),
    isDueForReview,
    reviewIntervalDays: intervalDays
  };
}
