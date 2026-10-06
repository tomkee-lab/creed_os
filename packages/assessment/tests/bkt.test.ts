import { describe, it, expect } from 'vitest';
import { updateBktMastery, calculateSpacedRepetition, DEFAULT_BKT_PARAMS } from '../src/bkt.js';

describe('Bayesian Knowledge Tracing (BKT)', () => {
  it('increases mastery on a correct response', () => {
    const prior = 0.20;
    const posterior = updateBktMastery(prior, true);
    expect(posterior).toBeGreaterThan(prior);
  });

  it('decreases mastery on an incorrect response', () => {
    const prior = 0.60;
    const posterior = updateBktMastery(prior, false);
    expect(posterior).toBeLessThan(prior);
  });

  it('keeps probability strictly within bounded limits [0.01, 0.99]', () => {
    let p = 0.95;
    for (let i = 0; i < 10; i++) {
      p = updateBktMastery(p, true);
    }
    expect(p).toBeLessThanOrEqual(0.99);

    let pLow = 0.05;
    for (let i = 0; i < 10; i++) {
      pLow = updateBktMastery(pLow, false);
    }
    expect(pLow).toBeGreaterThanOrEqual(0.01);
  });

  it('converges toward mastery with continuous positive observations', () => {
    let mastery = 0.15;
    const trajectory: number[] = [mastery];
    for (let i = 0; i < 5; i++) {
      mastery = updateBktMastery(mastery, true);
      trajectory.push(mastery);
    }
    // Each step should increase until reaching the maximum ceiling
    for (let i = 1; i < trajectory.length; i++) {
      expect(trajectory[i]).toBeGreaterThanOrEqual(trajectory[i - 1]);
    }
    expect(mastery).toBeGreaterThan(0.70);
  });
});

describe('Spaced Repetition & Decay', () => {
  it('calculates higher retention immediately after assessment', () => {
    const now = new Date();
    const schedule = calculateSpacedRepetition({
      competencyId: 'computational_thinking',
      masteryProbability: 0.85,
      consecutiveCorrect: 4,
      lastAssessedAt: now.toISOString(),
      now
    });

    expect(schedule.currentRetention).toBeCloseTo(1.0, 1);
    expect(schedule.retentionRisk).toBe('low');
    expect(schedule.isDueForReview).toBe(false);
  });

  it('detects retention decay and flags overdue reviews after time passes', () => {
    const now = new Date();
    // 30 days ago
    const pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const schedule = calculateSpacedRepetition({
      competencyId: 'spatial_reasoning',
      masteryProbability: 0.35,
      consecutiveCorrect: 0,
      lastAssessedAt: pastDate.toISOString(),
      now
    });

    expect(schedule.currentRetention).toBeLessThan(0.60);
    expect(schedule.retentionRisk).toBe('critical');
    expect(schedule.isDueForReview).toBe(true);
  });
});
