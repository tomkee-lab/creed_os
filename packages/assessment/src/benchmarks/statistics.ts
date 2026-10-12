import type { StatisticalTestResult } from './types.js';

/**
 * Calculates basic descriptive statistics for a numeric sample.
 */
export function calculateDescriptiveStats(values: number[]): {
  mean: number;
  median: number;
  stdev: number;
  min: number;
  max: number;
} {
  if (values.length === 0) {
    return { mean: 0, median: 0, stdev: 0, min: 0, max: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / sorted.length;

  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  const variance =
    sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
    Math.max(1, sorted.length - 1);
  const stdev = Math.sqrt(variance);

  return {
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    stdev: Math.round(stdev * 100) / 100,
    min: sorted[0],
    max: sorted[sorted.length - 1]
  };
}

/**
 * Computes empirical percentile rank of a value within a normative baseline sample.
 * For execution time: lower time = higher percentile (superior performance).
 */
export function calculateTimePercentile(value: number, baseline: number[]): number {
  if (baseline.length === 0) return 50;
  // Count how many baseline trials were SLOWER (greater duration) than this value
  const slowerCount = baseline.filter((b) => b > value).length;
  const equalCount = baseline.filter((b) => b === value).length;
  const rank = ((slowerCount + equalCount * 0.5) / baseline.length) * 100;
  return Math.min(99, Math.max(1, Math.round(rank)));
}

/**
 * Two-Sample Kolmogorov-Smirnov Test
 * Evaluates whether student robot execution times follow a significantly different/superior
 * distribution compared to the global TC-PEBRAS baseline cohort.
 */
export function calculateKolmogorovSmirnov(
  sample1: number[],
  sample2: number[]
): StatisticalTestResult {
  if (sample1.length === 0 || sample2.length === 0) {
    return {
      statisticName: 'Kolmogorov-Smirnov (D)',
      value: 0,
      pValueApprox: 1.0,
      isSignificant: false,
      interpretation: 'Insufficient observations for empirical distribution test.'
    };
  }

  const n1 = sample1.length;
  const n2 = sample2.length;

  const allValues = Array.from(new Set([...sample1, ...sample2])).sort((a, b) => a - b);

  let maxDiff = 0;
  for (const val of allValues) {
    const cdf1 = sample1.filter((x) => x <= val).length / n1;
    const cdf2 = sample2.filter((x) => x <= val).length / n2;
    const diff = Math.abs(cdf1 - cdf2);
    if (diff > maxDiff) {
      maxDiff = diff;
    }
  }

  // Asymptotic critical value calculation
  const ne = Math.sqrt((n1 * n2) / (n1 + n2));
  const lambda = (ne + 0.12 + 0.11 / ne) * maxDiff;

  // Approximate p-value using first 6 terms of the Kolmogorov distribution series
  let pValue = 0;
  for (let j = 1; j <= 6; j++) {
    const sign = j % 2 === 1 ? 1 : -1;
    pValue += 2 * sign * Math.exp(-2 * j * j * lambda * lambda);
  }
  pValue = Math.max(0, Math.min(1, pValue));

  const isSignificant = pValue < 0.05;
  const mean1 = sample1.reduce((a, b) => a + b, 0) / n1;
  const mean2 = sample2.reduce((a, b) => a + b, 0) / n2;

  let interpretation = 'No statistically significant difference from global baseline distribution.';
  if (isSignificant) {
    if (mean1 < mean2) {
      interpretation = 'Statistically significant superiority over normative cohort distribution (p < 0.05).';
    } else {
      interpretation = 'Distribution deviates significantly from baseline norms (p < 0.05).';
    }
  }

  return {
    statisticName: 'Kolmogorov-Smirnov (D)',
    value: Math.round(maxDiff * 1000) / 1000,
    pValueApprox: Math.round(pValue * 1000) / 1000,
    isSignificant,
    interpretation
  };
}

/**
 * One-Way Analysis of Variance (ANOVA)
 * Compares variance between trial iterations and baseline benchmark sets to verify
 * stability across runs and discriminate genuine competency from stochastic noise.
 */
export function calculateOneWayANOVA(groups: number[][]): StatisticalTestResult {
  const validGroups = groups.filter((g) => g.length > 0);
  const k = validGroups.length;
  const totalN = validGroups.reduce((acc, g) => acc + g.length, 0);

  if (k < 2 || totalN <= k) {
    return {
      statisticName: 'One-Way ANOVA (F)',
      value: 0,
      pValueApprox: 1.0,
      isSignificant: false,
      interpretation: 'Insufficient groups or sample size for variance analysis.'
    };
  }

  // Grand mean
  const allValues = validGroups.flat();
  const grandMean = allValues.reduce((a, b) => a + b, 0) / totalN;

  // Group means & SS between
  let ssBetween = 0;
  let ssWithin = 0;

  for (const group of validGroups) {
    const groupMean = group.reduce((a, b) => a + b, 0) / group.length;
    ssBetween += group.length * Math.pow(groupMean - grandMean, 2);

    for (const val of group) {
      ssWithin += Math.pow(val - groupMean, 2);
    }
  }

  const dfBetween = k - 1;
  const dfWithin = totalN - k;

  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / Math.max(1, dfWithin);

  const fRatio = msWithin > 0 ? msBetween / msWithin : 0;

  // Approximate p-value for F distribution using empirical thresholding
  // (F critical for typical df at alpha=0.05 is around 3.0 to 4.5)
  const approxCriticalF = 3.84;
  let pValueApprox = 0.5;
  if (fRatio > approxCriticalF * 2.5) {
    pValueApprox = 0.005;
  } else if (fRatio > approxCriticalF * 1.5) {
    pValueApprox = 0.02;
  } else if (fRatio > approxCriticalF) {
    pValueApprox = 0.045;
  } else if (fRatio > 1.0) {
    pValueApprox = 0.25;
  } else {
    pValueApprox = 0.75;
  }

  const isSignificant = fRatio >= approxCriticalF;

  return {
    statisticName: 'One-Way ANOVA (F)',
    value: Math.round(fRatio * 100) / 100,
    pValueApprox,
    isSignificant,
    interpretation: isSignificant
      ? 'Variance between trials and baseline indicates distinct capability separation (p < 0.05).'
      : 'Variation between sample and baseline is within expected stochastic repeatability limits.'
  };
}
