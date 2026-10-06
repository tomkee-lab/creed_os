/**
 * Three-Parameter Logistic (3PL) Item Response Theory (IRT) Formulations
 * 
 * P_i(θ) = c_i + (1 - c_i) / (1 + exp(-D * a_i * (θ - b_i)))
 * Where D = 1.702 (normal ogive scaling constant)
 */

export const D_CONSTANT = 1.702;

export interface IrtParams {
  a: number; // Discrimination slope (> 0, typically 0.5 - 2.5)
  b: number; // Difficulty location (-3.0 to +3.0)
  c: number; // Pseudo-guessing asymptote (0.0 to 0.35)
}

/**
 * Calculates the probability of a correct response under 3PL IRT.
 */
export function calculateProbability3PL(theta: number, params: IrtParams): number {
  const { a, b, c } = params;
  const exponent = -D_CONSTANT * a * (theta - b);
  
  // Guard against numerical underflow / overflow
  if (exponent > 35) return c;
  if (exponent < -35) return 1.0;
  
  const logistic = 1 / (1 + Math.exp(exponent));
  return c + (1 - c) * logistic;
}

/**
 * Calculates the derivative of the 3PL response function with respect to theta: dP/dθ
 */
export function calculateDerivative3PL(theta: number, params: IrtParams): number {
  const { a, b, c } = params;
  const exponent = -D_CONSTANT * a * (theta - b);
  
  if (Math.abs(exponent) > 35) return 0.0;
  
  const expVal = Math.exp(exponent);
  const denominator = Math.pow(1 + expVal, 2);
  return D_CONSTANT * a * (1 - c) * (expVal / denominator);
}

/**
 * Computes the Fisher Information provided by item i at ability level θ:
 * I_i(θ) = (P'_i(θ))^2 / (P_i(θ) * Q_i(θ))
 * 
 * Equivalent to:
 * I_i(θ) = (D * a)^2 * (Q / P) * ((P - c) / (1 - c))^2
 */
export function calculateFisherInformation(theta: number, params: IrtParams): number {
  const { a, c } = params;
  const P = calculateProbability3PL(theta, params);
  const Q = 1 - P;
  
  if (P <= 0 || Q <= 0) return 0.0;
  if (P <= c) return 0.0;
  
  const term1 = Math.pow(D_CONSTANT * a, 2);
  const term2 = Q / P;
  const term3 = Math.pow((P - c) / (1 - c), 2);
  
  const info = term1 * term2 * term3;
  return isNaN(info) || !isFinite(info) ? 0.0 : Math.max(0, info);
}

/**
 * Computes Test Information Function across a set of administered items:
 * I(θ) = \sum I_i(θ)
 */
export function calculateTestInformation(theta: number, itemsParams: IrtParams[]): number {
  return itemsParams.reduce((sum, item) => sum + calculateFisherInformation(theta, item), 0);
}

/**
 * Computes asymptotic Standard Error of measurement at θ:
 * SE(θ) = 1 / sqrt(I(θ))
 */
export function calculateStandardError(theta: number, itemsParams: IrtParams[]): number {
  const testInfo = calculateTestInformation(theta, itemsParams);
  if (testInfo <= 0.0001) return 1.5; // Baseline prior standard error
  return 1 / Math.sqrt(testInfo);
}
