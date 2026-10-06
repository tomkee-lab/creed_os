import { describe, it, expect } from 'vitest';
import {
  calculateProbability3PL,
  calculateFisherInformation,
  estimateThetaEAP,
  evaluateItemResponse,
  selectNextAdaptiveItem,
  CALIBRATED_ITEM_BANK
} from '../src/index.js';

describe('3-Parameter Logistic (3PL) IRT Engine', () => {
  const itemParams = { a: 1.5, b: 0.5, c: 0.25 };

  it('calculates correct probability at θ = b', () => {
    // At θ = b, logistic is 1/(1+1) = 0.5.
    // P = c + (1 - c) * 0.5 = 0.25 + 0.75 * 0.5 = 0.625
    const prob = calculateProbability3PL(0.5, itemParams);
    expect(prob).toBeCloseTo(0.625, 4);
  });

  it('asymptotes towards guessing parameter c as θ -> -infinity', () => {
    const probLow = calculateProbability3PL(-10.0, itemParams);
    expect(probLow).toBeCloseTo(0.25, 3);
  });

  it('asymptotes towards 1.0 as θ -> +infinity', () => {
    const probHigh = calculateProbability3PL(10.0, itemParams);
    expect(probHigh).toBeCloseTo(1.0, 3);
  });

  it('evaluates Fisher Information with peak near difficulty b', () => {
    const infoAtB = calculateFisherInformation(0.5, itemParams);
    const infoFar = calculateFisherInformation(-3.0, itemParams);
    expect(infoAtB).toBeGreaterThan(infoFar);
    expect(infoAtB).toBeGreaterThan(0);
  });
});

describe('EAP Numerical Quadrature Ability Estimator', () => {
  it('returns standard normal prior (θ=0, SE=1) for empty history', () => {
    const estimate = estimateThetaEAP([]);
    expect(estimate.theta).toBe(0.0);
    expect(estimate.standardError).toBe(1.0);
  });

  it('raises ability θ after multiple correct responses and reduces SE', () => {
    const history = [
      { params: { a: 1.2, b: -0.5, c: 0.25 }, isCorrect: true },
      { params: { a: 1.4, b: 0.2, c: 0.25 }, isCorrect: true },
      { params: { a: 1.6, b: 0.8, c: 0.25 }, isCorrect: true }
    ];
    const estimate = estimateThetaEAP(history);
    expect(estimate.theta).toBeGreaterThan(0.5);
    expect(estimate.standardError).toBeLessThan(1.0);
  });

  it('lowers ability θ after incorrect responses', () => {
    const history = [
      { params: { a: 1.2, b: -0.5, c: 0.25 }, isCorrect: false },
      { params: { a: 1.0, b: -1.0, c: 0.25 }, isCorrect: false }
    ];
    const estimate = estimateThetaEAP(history);
    expect(estimate.theta).toBeLessThan(0.0);
  });
});

describe('Deterministic Scoring & Misconception Evaluation', () => {
  const item = CALIBRATED_ITEM_BANK[0]; // QR-001 (Correct: opt-b)

  it('scores correct response accurately', () => {
    const result = evaluateItemResponse(item, 'opt-b');
    expect(result.isCorrect).toBe(true);
    expect(result.explanation).toContain('3x = x + 18');
  });

  it('diagnoses conceptual misconception on incorrect distractor', () => {
    const result = evaluateItemResponse(item, 'opt-a');
    expect(result.isCorrect).toBe(false);
    expect(result.misconceptionCode).toBe('MISC_DIVIDED_BY_THREE');
    expect(result.misconceptionDescription).toContain('Divided 18 by 3');
  });
});

describe('Maximum Fisher Information CAT Item Selection', () => {
  it('selects highest information unadministered item for current theta', () => {
    const stoppingRules = { minItems: 4, maxItems: 10, targetSE: 0.32, currentSE: 0.85 };
    const result = selectNextAdaptiveItem(
      CALIBRATED_ITEM_BANK,
      { currentTheta: 0.2, administeredItemIds: ['ITEM-QR-001'] },
      stoppingRules
    );

    expect(result.isTestComplete).toBe(false);
    expect(result.selectedItem).not.toBeNull();
    expect(result.selectedItem?.id).not.toBe('ITEM-QR-001');
    expect(result.fisherInformation).toBeGreaterThan(0);
  });

  it('terminates assessment when max items threshold is reached', () => {
    const stoppingRules = { minItems: 4, maxItems: 2, targetSE: 0.32, currentSE: 0.85 };
    const result = selectNextAdaptiveItem(
      CALIBRATED_ITEM_BANK,
      { currentTheta: 0.0, administeredItemIds: ['ITEM-QR-001', 'ITEM-QR-002'] },
      stoppingRules
    );

    expect(result.isTestComplete).toBe(true);
    expect(result.selectedItem).toBeNull();
  });
});
