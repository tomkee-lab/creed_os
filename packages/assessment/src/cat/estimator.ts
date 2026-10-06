import { calculateProbability3PL, type IrtParams } from '../irt/three_pl.js';

export interface ResponseHistoryItem {
  params: IrtParams;
  isCorrect: boolean;
}

export interface EapEstimate {
  theta: number;        // Expected A Posteriori ability estimate (-3.0 to +3.0)
  standardError: number; // Posterior standard error of measurement
  nodeCount: number;
}

// 41 quadrature nodes spanning -4.0 to +4.0 with step Δ = 0.2
const QUADRATURE_MIN = -4.0;
const QUADRATURE_MAX = 4.0;
const QUADRATURE_STEPS = 41;
const DELTA_X = (QUADRATURE_MAX - QUADRATURE_MIN) / (QUADRATURE_STEPS - 1);

const QUADRATURE_NODES: Array<{ x: number; priorWeight: number }> = [];

for (let i = 0; i < QUADRATURE_STEPS; i++) {
  const x = QUADRATURE_MIN + i * DELTA_X;
  // Standard normal density prior: (1 / sqrt(2 * pi)) * exp(-x^2 / 2)
  const density = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  QUADRATURE_NODES.push({ x, priorWeight: density * DELTA_X });
}

/**
 * Computes EAP ability estimate and posterior standard error given a history of scored responses.
 */
export function estimateThetaEAP(history: ResponseHistoryItem[]): EapEstimate {
  // If no items answered yet, return prior mean (0.0) and prior variance (1.0)
  if (history.length === 0) {
    return { theta: 0.0, standardError: 1.0, nodeCount: QUADRATURE_STEPS };
  }

  // Pre-calculate log-likelihoods to avoid floating point underflow
  let numerator = 0;
  let denominator = 0;

  // First pass: compute likelihoods at each node
  const weightedLikelihoods: number[] = new Array(QUADRATURE_STEPS);
  let maxLogLikelihood = -Infinity;

  const logLikelihoods: number[] = QUADRATURE_NODES.map((node) => {
    let logL = 0;
    for (const item of history) {
      const P = calculateProbability3PL(node.x, item.params);
      const prob = item.isCorrect ? Math.max(1e-10, P) : Math.max(1e-10, 1 - P);
      logL += Math.log(prob);
    }
    if (logL > maxLogLikelihood) maxLogLikelihood = logL;
    return logL;
  });

  // Second pass: exponentiate stabilized log-likelihoods and multiply by prior
  for (let i = 0; i < QUADRATURE_STEPS; i++) {
    const node = QUADRATURE_NODES[i];
    const normalizedLikelihood = Math.exp(logLikelihoods[i] - maxLogLikelihood);
    const weightedL = normalizedLikelihood * node.priorWeight;
    weightedLikelihoods[i] = weightedL;
    denominator += weightedL;
    numerator += node.x * weightedL;
  }

  if (denominator <= 0) {
    return { theta: 0.0, standardError: 1.0, nodeCount: QUADRATURE_STEPS };
  }

  const thetaEap = numerator / denominator;

  // Third pass: calculate posterior standard deviation (SE)
  let varianceNumerator = 0;
  for (let i = 0; i < QUADRATURE_STEPS; i++) {
    const node = QUADRATURE_NODES[i];
    const diff = node.x - thetaEap;
    varianceNumerator += diff * diff * weightedLikelihoods[i];
  }

  const posteriorVariance = varianceNumerator / denominator;
  const standardError = Math.sqrt(Math.max(0.01, posteriorVariance));

  // Bound theta to [-3.5, +3.5]
  const boundedTheta = Math.max(-3.5, Math.min(3.5, Math.round(thetaEap * 1000) / 1000));
  const roundedSE = Math.round(standardError * 1000) / 1000;

  return {
    theta: boundedTheta,
    standardError: roundedSE,
    nodeCount: QUADRATURE_STEPS
  };
}
