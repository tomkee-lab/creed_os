/**
 * CREED OS — Socratic AI Trust Protocol & System Prompt Generator
 *
 * Implements socio-psychological trust protocols and misconception
 * de-individualization derived from:
 * Howson C. & Kingsbury M. (2024) Belonging and Identity in STEM Higher Education (UCL Press)
 * - Ch. 1: STEM Ways of Thinking as Badges of Belonging (Imperial Lambda Feedback)
 * - Ch. 6: Universal Teacher Trust & Stereotype Threat Inoculation (Myyry et al.)
 */

export interface SocraticPromptConfig {
  learnerGradeBand: 'preparatory' | 'middle' | 'secondary';
  currentTheta: number;
  itemDifficultyB: number;
  misconceptionCode?: string;
}

export const MISCONCEPTION_DE_INDIVIDUALIZATIONS: Record<string, string> = {
  MISC_SIGN_INVERSION:
    'Over 40% of young engineers navigate this exact conceptual step when balancing equations—let\'s unravel it together.',
  MISC_TURN_OMISSION:
    'Over 40% of young engineers navigate this exact conceptual step when sequencing autonomous navigation turns—let\'s unravel it together.',
  MISC_RATIO_INVERSION:
    'Over 40% of young engineers navigate this exact conceptual step when calculating gear torque ratios—let\'s unravel it together.',
  MISC_HARDWARE_BLAME:
    'Over 40% of young engineers navigate this exact conceptual step when isolating software feedback from sensor state—let\'s unravel it together.',
  MISC_OPERATOR_PRECEDENCE:
    'Over 40% of young engineers navigate this exact conceptual step when determining operator precedence—let\'s unravel it together.'
};

export const UNIVERSAL_TRUST_MESSAGE =
  'This is an advanced challenge designed to test high-level reasoning; I\'m sharing it with you because your recent missions prove you are ready to tackle it.';

export function generateSocraticSystemPrompt(config: SocraticPromptConfig): string {
  let prompt = `You are the CREED OS Socratic Mentor. Guide the learner using inquiry. NEVER give direct answers.`;

  // Grade-band adaptation
  if (config.learnerGradeBand === 'preparatory') {
    prompt += `\n[GRADE BAND: PREPARATORY (Grades 3-5)]: Use physical, sensory metaphors and visual analogies. Keep sentences short and clear.`;
  } else if (config.learnerGradeBand === 'middle') {
    prompt += `\n[GRADE BAND: MIDDLE (Grades 6-8)]: Balance concrete engineering examples with mathematical relationships.`;
  } else {
    prompt += `\n[GRADE BAND: SECONDARY (Grades 9-12)]: Use rigorous physical principles, formal notation, and computational abstractions.`;
  }

  // Rule 1: Universal Growth Mindset Framing for High Difficulty (Howson Ch. 6, Myyry et al.)
  if (config.itemDifficultyB > 1.50) {
    prompt += `\n[TRUST PROTOCOL]: Prefix your greeting by explicitly expressing confidence in the learner's potential. Say: "${UNIVERSAL_TRUST_MESSAGE}"`;
  }

  // Rule 2: De-Individualize Misconceptions (Howson Ch. 1, Imperial Lambda Feedback)
  if (config.misconceptionCode) {
    const specificMessage =
      MISCONCEPTION_DE_INDIVIDUALIZATIONS[config.misconceptionCode] ||
      `Over 40% of young engineers navigate this exact conceptual step when balancing equations—let's unravel it together.`;

    prompt += `\n[DE-INDIVIDUALIZATION PROTOCOL]: The student triggered misconception ${config.misconceptionCode}. Do NOT frame this as a personal mistake. Say: "${specificMessage}"`;
  }

  return prompt;
}
