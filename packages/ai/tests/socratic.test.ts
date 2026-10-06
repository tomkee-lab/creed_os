import { describe, it, expect } from 'vitest';
import {
  SOCRATIC_SYSTEM_PROMPT,
  generateDeterministicSocraticResponse
} from '../src/mentor/socratic.js';
import {
  classifyQueryCompetency,
  extractObservationCandidate
} from '../src/evidence/extractor.js';

describe('Socratic Mentor System & Guardrails', () => {
  it('enforces pedagogical rules in system prompt', () => {
    expect(SOCRATIC_SYSTEM_PROMPT).toContain('NEVER dump the final answer');
    expect(SOCRATIC_SYSTEM_PROMPT).toContain('Validate effort and persistence');
    expect(SOCRATIC_SYSTEM_PROMPT).toContain('NEVER assign an IQ score');
  });

  it('produces inquiry-based deterministic fallback replies without giving raw answers', () => {
    const res = generateDeterministicSocraticResponse('How do I solve the balance scale problem?');
    expect(res.reply).toBeDefined();
    // Prompt should guide with a question, not tell the final weight
    expect(res.reply).toContain('?');
    expect(res.extractedObservation).toBeDefined();
    expect(res.extractedObservation?.competency).toBe('quantitative_reasoning');
  });

  it('handles spatial queries with visualization prompts', () => {
    const res = generateDeterministicSocraticResponse('What happens if I rotate the painted cube?');
    expect(res.reply).toContain('faces');
    expect(res.extractedObservation?.competency).toBe('spatial_reasoning');
  });

  it('falls back to general problem decomposition for open questions', () => {
    const res = generateDeterministicSocraticResponse('I have no idea what to do here.');
    expect(res.reply).toContain('clue');
    expect(res.reply).toContain('?');
    expect(res.extractedObservation?.competency).toBe('metacognition');
  });
});

describe('Evidence Extraction & Query Classification', () => {
  it('classifies STEM queries into appropriate competency domains', () => {
    expect(classifyQueryCompetency('balance equations')).toBe('quantitative_reasoning');
    expect(classifyQueryCompetency('rotating 3D cube')).toBe('spatial_reasoning');
    expect(classifyQueryCompetency('testing an experiment hypothesis')).toBe('scientific_thinking');
    expect(classifyQueryCompetency('card logic rules')).toBe('logical_deduction');
    expect(classifyQueryCompetency('how should I study better?')).toBe('metacognition');
  });

  it('extracts structured observation candidates with provenance', () => {
    const candidate = extractObservationCandidate(
      'How do I balance this?',
      'Try subtracting from both sides?',
      {
        competency: 'quantitative_reasoning',
        note: 'Decomposed algebraic balance.'
      },
      'mentor_chat'
    );

    expect(candidate).not.toBeNull();
    expect(candidate?.competency).toBe('quantitative_reasoning');
    expect(candidate?.sourceContext).toBe('mentor_chat');
    expect(candidate?.extractedAt).toBeDefined();
  });

  it('returns null when no observation is extracted', () => {
    const candidate = extractObservationCandidate('Hello', 'Hi there!', undefined);
    expect(candidate).toBeNull();
  });
});
