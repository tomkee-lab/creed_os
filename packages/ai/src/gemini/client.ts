import {
  SOCRATIC_SYSTEM_PROMPT,
  generateDeterministicSocraticResponse,
  type SocraticTurn
} from '../mentor/socratic.js';

export interface MentorChatOptions {
  apiKey?: string;
  model?: string;
}

export interface MentorChatResponse {
  reply: string;
  source: 'gemini' | 'deterministic_fallback';
  observation?: { competency: string; note: string };
}

/**
 * Handles Socratic mentor dialogue, calling Gemini API when configured,
 * or using the local deterministic Socratic engine when key is missing or network fails.
 */
export async function chatWithSocraticMentor(
  userQuery: string,
  history: SocraticTurn[] = [],
  options: MentorChatOptions = {}
): Promise<MentorChatResponse> {
  const apiKey =
    options.apiKey ||
    (typeof process !== 'undefined' && typeof process.env !== 'undefined'
      ? (process.env as Record<string, string | undefined>)['GEMINI_API_KEY']
      : undefined);

  if (!apiKey) {
    const fallback = generateDeterministicSocraticResponse(userQuery, history);
    return {
      reply: fallback.reply,
      source: 'deterministic_fallback',
      observation: fallback.extractedObservation
    };
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${
      options.model || 'gemini-1.5-flash'
    }:generateContent?key=${apiKey}`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${SOCRATIC_SYSTEM_PROMPT}\n\nStudent Query: ${userQuery}` }]
      }
    ];

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 250
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error status: ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      return {
        reply: text.trim(),
        source: 'gemini',
        observation: {
          competency: 'metacognition',
          note: 'Participated in live AI Socratic dialogue.'
        }
      };
    }

    throw new Error('Empty Gemini response payload');
  } catch (error) {
    // Graceful pedagogical fallback
    const fallback = generateDeterministicSocraticResponse(userQuery, history);
    return {
      reply: fallback.reply,
      source: 'deterministic_fallback',
      observation: fallback.extractedObservation
    };
  }
}
