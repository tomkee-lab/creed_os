import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import { SOCRATIC_SYSTEM_PROMPT } from '@core-os/ai';

export const POST: RequestHandler = async ({ locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  try {
    // 2. Authorize learner relationship (DPDP child protection / anti-spoofing)
    const user = locals.user;
    const userRole = (user as any).role || (user as any).metadata?.role || 'student';
    const boundLearnerId = resolveLearnerId(user);

    if (['student', 'parent'].includes(userRole) && !boundLearnerId) {
      return json({ error: 'Forbidden: No learner profile bound to this account' }, { status: 403 });
    }

    const effectiveLearnerId = boundLearnerId || (user as any).id;

    // 3. Statutory DPDP Act Section 9 Consent Check before granting ephemeral Live API session
    const hasConsent = await coreRepository.hasActiveConsentAsync(effectiveLearnerId);
    if (!hasConsent) {
      return json({
        error: 'Statutory parental consent under DPDP Act 2023 Section 9 missing or not active for this learner.'
      }, { status: 403 });
    }

    const apiKey = typeof process !== 'undefined' && process.env ? process.env['GEMINI_API_KEY'] : undefined;

    if (!apiKey) {
      // Graceful fallback signal: API key not set, client should use REST deterministic mentor
      return json({
        available: false,
        fallback: true,
        mode: 'rest_deterministic',
        message: 'Gemini Live API key not configured. Fallback to resilient REST mentor.'
      });
    }

    // Call Google AI auth_tokens endpoint for ephemeral token creation
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/auth_tokens';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        bidiGenerateContentSetup: {
          model: 'models/gemini-2.0-flash-exp',
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: 'Aoede'
                }
              }
            }
          },
          systemInstruction: {
            parts: [
              {
                text: `${SOCRATIC_SYSTEM_PROMPT}\nStrict Rule: You are an encouraging Socratic guide for Class 5-10 learners. You ask guiding questions. You NEVER score, alter theta, or assess ability estimates; you only scaffold student reasoning through questions.`
              }
            ]
          }
        }
      })
    });

    if (!res.ok) {
      // If token creation fails (e.g. rate limit, preview endpoint restriction), fall back cleanly
      const errText = await res.text();
      console.warn('Gemini ephemeral auth token creation skipped:', res.status, errText);
      return json({
        available: false,
        fallback: true,
        mode: 'rest_deterministic',
        message: 'Live API token generation unavailable. Using REST mentor.'
      });
    }

    const tokenData = await res.json();
    return json({
      available: true,
      token: tokenData.name,
      wsUrl: 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent',
      mode: 'live_websocket'
    });
  } catch (err: any) {
    console.error('Error generating ephemeral mentor token:', err);
    return json({
      available: false,
      fallback: true,
      mode: 'rest_deterministic',
      message: err.message || 'Ephemeral token generation error'
    });
  }
};
