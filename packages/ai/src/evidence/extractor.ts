import {
  SOCRATIC_SYSTEM_PROMPT,
  generateDeterministicSocraticResponse,
  type SocraticTurn
} from '../mentor/socratic.js';

/**
 * Extracts structured observation candidates from a mentor dialogue turn.
 * These are lightweight, competency-tagged metacognitive observations that
 * can be promoted into learner_evidence records (strength level 1) pending
 * teacher or system validation.
 *
 * Observation lifecycle: extracted → candidate → accepted
 * (See docs/EVIDENCE_ENGINE.md for the full state machine.)
 */
export interface ObservationCandidate {
  competency: string;
  note: string;
  /** ISO 8601 timestamp when the observation was extracted */
  extractedAt: string;
  /** Source context for audit provenance */
  sourceContext: 'mentor_chat' | 'socratic_fallback';
}

/**
 * Extract an observation candidate from a Socratic mentor response.
 * Returns null if no meaningful observation could be identified.
 */
export function extractObservationCandidate(
  userQuery: string,
  mentorReply: string,
  rawObservation?: { competency: string; note: string },
  source: 'mentor_chat' | 'socratic_fallback' = 'socratic_fallback'
): ObservationCandidate | null {
  if (!rawObservation) return null;

  return {
    competency: rawObservation.competency,
    note: rawObservation.note,
    extractedAt: new Date().toISOString(),
    sourceContext: source
  };
}

/**
 * Classify a learner query into a target competency domain.
 * Used as a lightweight pre-filter before calling the AI mentor.
 */
export function classifyQueryCompetency(
  query: string
): string {
  const q = query.toLowerCase();
  if (q.includes('balance') || q.includes('equation') || q.includes('algebra') || q.includes('ratio')) {
    return 'quantitative_reasoning';
  }
  if (q.includes('cube') || q.includes('rotate') || q.includes('spatial') || q.includes('faces')) {
    return 'spatial_reasoning';
  }
  if (q.includes('gear') || q.includes('teeth') || q.includes('rotation')) {
    return 'quantitative_reasoning';
  }
  if (q.includes('logic') || q.includes('rule') || q.includes('card') || q.includes('if')) {
    return 'logical_deduction';
  }
  if (q.includes('science') || q.includes('hypothesis') || q.includes('experiment')) {
    return 'scientific_thinking';
  }
  return 'metacognition';
}
