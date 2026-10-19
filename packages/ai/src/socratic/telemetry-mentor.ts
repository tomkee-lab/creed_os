/**
 * CREED OS — Telemetry-Grounded Socratic Bridge
 *
 * Streams live physical failure telemetry (maxDeflectionMm, failedMemberId, activeMisconceptionCode)
 * to gemini-2.5-flash with a strict 45-word ceiling and deterministic fallback playbook.
 */

export interface SimulatorTelemetry {
  maxDeflectionMm?: number;
  failedMemberId?: string;
  activeMisconceptionCode?: string;
  torqueMultiplier?: number;
  stressRatio?: number;
  vibrationHz?: number;
  learnerId?: string;
  missionId?: string;
  stage?: number;
}

export interface TelemetryMentorOptions {
  apiKey?: string;
  model?: string;
}

export interface TelemetryMentorResponse {
  reply: string;
  wordCount: number;
  source: 'gemini-2.5-flash' | 'deterministic_playbook';
  telemetryGrounded: boolean;
}

/**
 * Deterministic Socratic Playbook for structural, mechanical & physical simulator failure.
 * Every response is strictly under 30 words (guaranteeing <= 45 words).
 */
export function getDeterministicTelemetryResponse(telemetry: SimulatorTelemetry): string {
  if (telemetry.failedMemberId || (telemetry.maxDeflectionMm && telemetry.maxDeflectionMm > 12)) {
    const member = telemetry.failedMemberId || 'the stressed beam';
    return `Look closely at ${member}: when the downward load hits it, is it buckling under compression or pulling under tension?`;
  }

  if (telemetry.activeMisconceptionCode === 'MISC_RATIO_INVERSION') {
    return 'Over 40% of engineers ponder this gear step: if the driving gear has fewer teeth, does output torque increase or decrease?';
  }

  if (telemetry.activeMisconceptionCode === 'MISC_SIGN_INVERSION') {
    return 'Notice the direction of your support forces: if gravity pulls downward, which way must the reaction force push to maintain equilibrium?';
  }

  if (telemetry.stressRatio && telemetry.stressRatio > 1.0) {
    return 'Internal stress surpassed material yield limits. How would widening the cross-sectional area change the force distributed across each square millimeter?';
  }

  if (telemetry.vibrationHz && telemetry.vibrationHz > 50) {
    return 'High-frequency resonance is shaking the assembly. What happens to the natural frequency when you add damping or redistribute mass?';
  }

  return 'Look closely at the deformation pattern right before collapse. Which joint or member began deflecting first?';
}

function enforceWordLimit(text: string, maxWords = 45): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  const truncated = words.slice(0, maxWords).join(' ');
  return truncated.endsWith('?') || truncated.endsWith('.') ? truncated : `${truncated}?`;
}

/**
 * Prompts gemini-2.5-flash with physical failure telemetry and enforces a strict 45-word ceiling.
 */
export async function queryTelemetrySocraticMentor(
  telemetry: SimulatorTelemetry,
  options: TelemetryMentorOptions = {}
): Promise<TelemetryMentorResponse> {
  const apiKey =
    options.apiKey ||
    (typeof process !== 'undefined' && typeof process.env !== 'undefined'
      ? (process.env as Record<string, string | undefined>)['GEMINI_API_KEY']
      : undefined);

  if (!apiKey) {
    const fallback = getDeterministicTelemetryResponse(telemetry);
    return {
      reply: fallback,
      wordCount: fallback.split(/\s+/).length,
      source: 'deterministic_playbook',
      telemetryGrounded: true
    };
  }

  try {
    const model = options.model || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const systemInstruction = `You are the CREED OS Socratic Physics & Engineering Mentor for K-12 students.
CRITICAL CONSTRAINT: You MUST respond in ONE single Socratic question, strictly under 45 words total.
Never give the answer, never tell them which slider to move, and never use jargon like "theta" or "IRT".
Ground your inquiry directly in the student's physical failure telemetry.`;

    const userPrompt = `Live Simulator Telemetry:
- Failed Member: ${telemetry.failedMemberId ?? 'none'}
- Max Deflection: ${telemetry.maxDeflectionMm ? `${telemetry.maxDeflectionMm.toFixed(1)} mm` : 'nominal'}
- Stress Ratio: ${telemetry.stressRatio ? telemetry.stressRatio.toFixed(2) : 'nominal'}
- Active Misconception: ${telemetry.activeMisconceptionCode ?? 'none'}
- Mission ID: ${telemetry.missionId ?? 'applied_mechanics'}

Formulate a single Socratic question under 45 words guiding the student to understand why this physical failure occurred.`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 120
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API status ${res.status}`);
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateText) {
      const sanitizedReply = enforceWordLimit(candidateText, 45);
      return {
        reply: sanitizedReply,
        wordCount: sanitizedReply.split(/\s+/).length,
        source: 'gemini-2.5-flash',
        telemetryGrounded: true
      };
    }

    throw new Error('Empty Gemini reply');
  } catch (_err) {
    const fallback = getDeterministicTelemetryResponse(telemetry);
    return {
      reply: fallback,
      wordCount: fallback.split(/\s+/).length,
      source: 'deterministic_playbook',
      telemetryGrounded: true
    };
  }
}
