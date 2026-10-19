/**
 * CREED OS — Persona Mapper Boundary (NCERT PARAKH & DPDP Compliance)
 *
 * Enforces zero raw psychometric parameter leakage (theta, SE, irt_a/b/c, Fisher info)
 * and maps latent estimates to qualitative PARAKH developmental bands:
 * - Stream: Guided Foundation
 * - Mountain: Emerging Independence
 * - Sky: Autonomous Mastery
 *
 * Also maps evidence levels (1-5) to semantic provenance badges rather than numerical scores.
 */

export type ParakhBand =
  | 'Stream (Guided Foundation)'
  | 'Mountain (Emerging Independence)'
  | 'Sky (Autonomous Mastery)';

export interface SafeEvidenceView {
  id: string;
  learnerId: string;
  competency: string;
  provenanceBadge: string;
  sourceType: string;
  title: string;
  claim: string;
  chainHash?: string;
  timestamp: string;
}

/**
 * Maps latent theta capability into qualitative NCERT PARAKH band.
 */
export function mapThetaToParakhBand(theta: number): {
  band: 'Stream' | 'Mountain' | 'Sky';
  label: ParakhBand;
  descriptor: string;
} {
  if (theta >= 1.0) {
    return {
      band: 'Sky',
      label: 'Sky (Autonomous Mastery)',
      descriptor: 'Demonstrates consistent autonomous problem-solving and transfer across complex domains.'
    };
  }
  if (theta >= -0.5) {
    return {
      band: 'Mountain',
      label: 'Mountain (Emerging Independence)',
      descriptor: 'Shows solid conceptual grasp with emerging independence in novel applied situations.'
    };
  }
  return {
    band: 'Stream',
    label: 'Stream (Guided Foundation)',
    descriptor: 'Benefits from guided inquiry, concrete scaffolds, and structured step-by-step challenges.'
  };
}

export const EVIDENCE_PROVENANCE_BADGES: Record<number, string> = {
  1: 'Self-Report Reflection',
  2: 'Structured Diagnostic Inventory',
  3: 'Adaptive Diagnostic (3PL CAT)',
  4: 'Verified Maker Artifact',
  5: 'Longitudinal Field Evidence'
};

/**
 * Translates raw internal evidence records into safe semantic presentation objects.
 * Prevents evidence levels (1-5) from displaying as fractional scores (e.g. 4/5) next to misconceptions.
 */
export function toSafeEvidenceView(evidence: any): SafeEvidenceView {
  const level = Number(evidence.level ?? evidence.evidenceStrength ?? 4);
  const provenanceBadge = EVIDENCE_PROVENANCE_BADGES[level] || 'Verified Evidence Artifact';

  return {
    id: evidence.id || 'ev-gen-' + Math.random().toString(36).slice(2, 9),
    learnerId: evidence.learnerId,
    competency: evidence.competency,
    provenanceBadge,
    sourceType: evidence.sourceType || 'project_mission',
    title: evidence.title || 'Demonstrated Capability',
    claim: evidence.claim || evidence.summary || 'Competency demonstration verified.',
    chainHash: evidence.chainHash || (evidence.observedValue && evidence.observedValue.chainHash),
    timestamp: evidence.timestamp || evidence.observedAt || new Date().toISOString()
  };
}

/**
 * Strictly strips raw latent psychometric parameters for student and parent consumption.
 */
export function sanitizeForPersona<T extends Record<string, any>>(data: T, persona: 'student' | 'parent' | 'teacher'): Partial<T> {
  if (persona === 'teacher') return data;
  const clone = { ...data };
  delete (clone as any).theta;
  delete (clone as any).standardError;
  delete (clone as any).irt_a;
  delete (clone as any).irt_b;
  delete (clone as any).irt_c;
  delete (clone as any).fisherInformation;
  return clone;
}
