import { describe, it, expect } from 'vitest';
import {
  validateIrtParameters,
  verifyQuadratureConvergence,
  evaluateSympsonHetterPass,
  getQualitativeDevelopmentalTier,
  equipercentileEquate,
  calibrateItemParameters,
  PsychometricCalibrationError
} from '../src/irt/calibration.js';
import { estimateThetaEAP } from '../src/cat/estimator.js';
import { calculateFisherInformation } from '../src/irt/three_pl.js';

describe('Gate 4 — Psychometric CAT Item Calibration & Convergence Testing', () => {
  it('validates 3PL item parameters against empirical bounds', () => {
    // Valid item
    expect(validateIrtParameters({ a: 1.25, b: 0.5, c: 0.2 })).toBe(true);

    // Discrimination 'a' too low (< 0.20)
    expect(() => validateIrtParameters({ a: 0.1, b: 0.0, c: 0.2 })).toThrow(
      PsychometricCalibrationError
    );

    // Discrimination 'a' too high (> 2.50)
    expect(() => validateIrtParameters({ a: 2.8, b: 0.0, c: 0.2 })).toThrow(
      PsychometricCalibrationError
    );

    // Difficulty 'b' outside [-3.5, 3.5]
    expect(() => validateIrtParameters({ a: 1.0, b: 4.2, c: 0.2 })).toThrow(
      PsychometricCalibrationError
    );

    // Guessing 'c' too high (> 0.35)
    expect(() => validateIrtParameters({ a: 1.0, b: 0.0, c: 0.45 })).toThrow(
      PsychometricCalibrationError
    );
  });

  it('proves Gauss-Hermite numerical quadrature convergence for 41 standard normal nodes', () => {
    const result = verifyQuadratureConvergence(41);
    expect(result.isConverged).toBe(true);
    expect(result.moment0Error).toBeLessThan(0.001); // Total probability ~ 1.0
    expect(result.moment1Error).toBeLessThan(0.001); // Mean ~ 0.0
    expect(result.moment2Error).toBeLessThan(0.01);  // Variance ~ 1.0
  });

  it('tests Expected A Posteriori (EAP) ability convergence under quadrature', () => {
    // Initial empty state returns prior mean (0.0) and standard error (1.0)
    const prior = estimateThetaEAP([]);
    expect(prior.theta).toBe(0.0);
    expect(prior.standardError).toBe(1.0);
    expect(prior.nodeCount).toBe(41);

    // Consistent correct answers on moderately difficult items should increase theta
    const highAbilityEstimate = estimateThetaEAP([
      { params: { a: 1.5, b: 0.0, c: 0.2 }, isCorrect: true },
      { params: { a: 1.4, b: 0.8, c: 0.2 }, isCorrect: true },
      { params: { a: 1.6, b: 1.5, c: 0.2 }, isCorrect: true }
    ]);
    expect(highAbilityEstimate.theta).toBeGreaterThan(0.8);
    expect(highAbilityEstimate.standardError).toBeLessThan(1.0);

    // Low ability responses should reduce theta below 0
    const lowAbilityEstimate = estimateThetaEAP([
      { params: { a: 1.5, b: 0.0, c: 0.2 }, isCorrect: false },
      { params: { a: 1.4, b: -0.8, c: 0.2 }, isCorrect: false },
      { params: { a: 1.6, b: -1.5, c: 0.2 }, isCorrect: false }
    ]);
    expect(lowAbilityEstimate.theta).toBeLessThan(-0.8);
  });

  it('evaluates Sympson-Hetter exposure rate limiting', () => {
    // Passing parameter 1.0 always passes
    expect(evaluateSympsonHetterPass(1.0, 0.99)).toBe(true);

    // Passing parameter 0.0 always rejects
    expect(evaluateSympsonHetterPass(0.0, 0.01)).toBe(false);

    // Controlled threshold: sample 0.15 passes with P(A|S) = 0.20
    expect(evaluateSympsonHetterPass(0.20, 0.15)).toBe(true);

    // Controlled threshold: sample 0.25 rejected with P(A|S) = 0.20
    expect(evaluateSympsonHetterPass(0.20, 0.25)).toBe(false);
  });

  it('verifies qualitative developmental tier translation without raw metric leakage', () => {
    const tierLow = getQualitativeDevelopmentalTier(-1.8);
    expect(tierLow.tier).toBe('FOUNDATIONAL_EXPLORATION');
    expect(tierLow.label).toBe('Foundational Exploration');

    const tierMid = getQualitativeDevelopmentalTier(0.0);
    expect(tierMid.tier).toBe('DEVELOPING_COMPETENCY');

    const tierHigh = getQualitativeDevelopmentalTier(1.0);
    expect(tierHigh.tier).toBe('DEMONSTRATED_PROFICIENCY');

    const tierAdv = getQualitativeDevelopmentalTier(2.2);
    expect(tierAdv.tier).toBe('ADVANCED_MASTERY');
    expect(tierAdv.recommendedPathway).toContain('Premier Olympiad Robotics');
  });

  it('verifies Fisher Information monotonicity at item difficulty b', () => {
    const params = { a: 1.5, b: 1.0, c: 0.0 };
    // For 2PL/3PL without guessing, Fisher information peaks at theta = b
    const infoAtPeak = calculateFisherInformation(1.0, params);
    const infoFarBelow = calculateFisherInformation(-1.0, params);
    const infoFarAbove = calculateFisherInformation(3.0, params);

    expect(infoAtPeak).toBeGreaterThan(infoFarBelow);
    expect(infoAtPeak).toBeGreaterThan(infoFarAbove);
  });

  it('verifies equipercentile equating across international scales', () => {
    const pisaEquated = equipercentileEquate(1.0, 'PISA', 0.2);
    expect(pisaEquated.scale).toBe('PISA');
    expect(pisaEquated.scaleScore).toBe(600); // 500 + 1.0 * 100
    expect(pisaEquated.percentileRank).toBeGreaterThanOrEqual(84);
    expect(pisaEquated.confidenceBand[0]).toBeLessThan(pisaEquated.scaleScore);
    expect(pisaEquated.confidenceBand[1]).toBeGreaterThan(pisaEquated.scaleScore);

    const lexileEquated = equipercentileEquate(0.5, 'LEXILE', 0.2);
    expect(lexileEquated.scale).toBe('LEXILE');
    expect(lexileEquated.scaleScore).toBe(975); // 850 + 0.5 * 250
    expect(lexileEquated.formattedScore).toBe('975L');

    const meanPisa = equipercentileEquate(0.0, 'PISA', 0.25);
    expect(meanPisa.scaleScore).toBe(500);
    expect(meanPisa.percentileRank).toBe(50);
  });

  it('performs empirical Marginal Maximum Likelihood (MML) item calibration on response samples', () => {
    // Cohort of 10 students: higher-ability students answer correctly
    const samples = [
      { learnerTheta: -1.5, isCorrect: false },
      { learnerTheta: -1.0, isCorrect: false },
      { learnerTheta: -0.5, isCorrect: false },
      { learnerTheta: 0.0, isCorrect: true },
      { learnerTheta: 0.2, isCorrect: false },
      { learnerTheta: 0.5, isCorrect: true },
      { learnerTheta: 1.0, isCorrect: true },
      { learnerTheta: 1.2, isCorrect: true },
      { learnerTheta: 1.5, isCorrect: true },
      { learnerTheta: 2.0, isCorrect: true }
    ];

    const calibration = calibrateItemParameters(samples, 0.20);
    expect(calibration.converged).toBe(true);
    expect(calibration.sampleSize).toBe(10);
    expect(calibration.c).toBe(0.20);
    expect(calibration.a).toBeGreaterThanOrEqual(0.5);
    expect(calibration.b).toBeGreaterThan(-1.5);
    expect(calibration.b).toBeLessThan(1.5);
  });
});
