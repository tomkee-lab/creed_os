import {
  SOCRATIC_SYSTEM_PROMPT,
  generateDeterministicSocraticResponse,
  type SocraticTurn
} from '../mentor/socratic.js';
import {
  generateSocraticSystemPrompt,
  type SocraticPromptConfig
} from '../socratic.js';

export interface MentorChatOptions {
  apiKey?: string;
  model?: string;
  promptConfig?: SocraticPromptConfig;
}

export interface MentorChatResponse {
  reply: string;
  source: 'gemini' | 'deterministic_fallback';
  observation?: { competency: string; note: string };
}

/**
 * Handles Socratic mentor dialogue, calling Google Gemini API when configured,
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
    const model =
      options.model ||
      (typeof process !== 'undefined' && typeof process.env !== 'undefined'
        ? (process.env as Record<string, string | undefined>)['GEMINI_MODEL']
        : undefined) ||
      'gemini-2.5-flash';

    // Use header-based authentication rather than leaking key in query string
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    // Construct active system instruction (with dynamic trust protocol & misconception de-individualization if configured)
    const systemPromptText = options.promptConfig
      ? generateSocraticSystemPrompt(options.promptConfig)
      : SOCRATIC_SYSTEM_PROMPT;

    // Map conversation history preserving user / model dialogue context
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const turn of history) {
      if (turn.content && typeof turn.content === 'string') {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPromptText }]
        },
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
