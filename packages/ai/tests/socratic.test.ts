import { describe, it, expect } from 'vitest';
import {
  SOCRATIC_SYSTEM_PROMPT,
  generateDeterministicSocraticResponse
} from '../src/mentor/socratic.js';
import { generateSocraticSystemPrompt } from '../src/socratic.js';
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

describe('Howson C. (2024) Socio-Psychological Trust Protocol & De-individualization', () => {
  it('triggers Trust Protocol greeting when item difficulty b > 1.50', () => {
    const prompt = generateSocraticSystemPrompt({
      learnerGradeBand: 'middle',
      currentTheta: 1.2,
      itemDifficultyB: 1.85
    });

    expect(prompt).toContain('[TRUST PROTOCOL]');
    expect(prompt).toContain('This is an advanced challenge designed to test high-level reasoning');
    expect(prompt).toContain('your recent missions prove you are ready to tackle it');
  });

  it('omits Trust Protocol greeting when item difficulty b <= 1.50', () => {
    const prompt = generateSocraticSystemPrompt({
      learnerGradeBand: 'middle',
      currentTheta: 0.5,
      itemDifficultyB: 0.8
    });

    expect(prompt).not.toContain('[TRUST PROTOCOL]');
  });

  it('de-individualizes algebraic sign inversion (MISC_SIGN_INVERSION)', () => {
    const prompt = generateSocraticSystemPrompt({
      learnerGradeBand: 'middle',
      currentTheta: 0.4,
      itemDifficultyB: 1.1,
      misconceptionCode: 'MISC_SIGN_INVERSION'
    });

    expect(prompt).toContain('[DE-INDIVIDUALIZATION PROTOCOL]');
    expect(prompt).toContain('Over 40% of young engineers navigate this exact conceptual step');
    expect(prompt).toContain('balancing equations');
    expect(prompt).toContain("let's unravel it together");
  });

  it('de-individualizes hardware blame misconception (MISC_HARDWARE_BLAME)', () => {
    const prompt = generateSocraticSystemPrompt({
      learnerGradeBand: 'secondary',
      currentTheta: 1.0,
      itemDifficultyB: 1.6,
      misconceptionCode: 'MISC_HARDWARE_BLAME'
    });

    expect(prompt).toContain('[DE-INDIVIDUALIZATION PROTOCOL]');
    expect(prompt).toContain('isolating software feedback from sensor state');
    // Also asserts trust protocol because b = 1.6 > 1.50
    expect(prompt).toContain('[TRUST PROTOCOL]');
  });

  it('adapts pedagogical tone across grade bands', () => {
    const prepPrompt = generateSocraticSystemPrompt({
      learnerGradeBand: 'preparatory',
      currentTheta: -0.2,
      itemDifficultyB: -0.1
    });
    expect(prepPrompt).toContain('GRADE BAND: PREPARATORY');
    expect(prepPrompt).toContain('sensory metaphors');

    const secPrompt = generateSocraticSystemPrompt({
      learnerGradeBand: 'secondary',
      currentTheta: 1.5,
      itemDifficultyB: 1.4
    });
    expect(secPrompt).toContain('GRADE BAND: SECONDARY');
    expect(secPrompt).toContain('computational abstractions');
  });
});

describe('Telemetry-Grounded Socratic Bridge', () => {
  it('generates physical failure Socratic guidance strictly under 45 words', async () => {
    const { getDeterministicTelemetryResponse, queryTelemetrySocraticMentor } = await import(
      '../src/socratic/telemetry-mentor.js'
    );

    const deflectionReply = getDeterministicTelemetryResponse({
      failedMemberId: 'strut_4',
      maxDeflectionMm: 24.5
    });
    expect(deflectionReply).toContain('strut_4');
    expect(deflectionReply.split(/\s+/).length).toBeLessThanOrEqual(45);

    const gearReply = getDeterministicTelemetryResponse({
      activeMisconceptionCode: 'MISC_RATIO_INVERSION'
    });
    expect(gearReply).toContain('torque');
    expect(gearReply.split(/\s+/).length).toBeLessThanOrEqual(45);

    const response = await queryTelemetrySocraticMentor({
      failedMemberId: 'truss_node_2',
      maxDeflectionMm: 18.2
    });
    expect(response.source).toBe('deterministic_playbook');
    expect(response.wordCount).toBeLessThanOrEqual(45);
    expect(response.telemetryGrounded).toBe(true);
  });
});
