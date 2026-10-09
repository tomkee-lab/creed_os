import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAltchaChallenge } from '$lib/server/security/altcha';

export const GET: RequestHandler = async () => {
  try {
    const challenge = await createAltchaChallenge(30000);
    return json(challenge, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (err) {
    return json(
      { error: 'Failed to generate Proof-of-Work challenge' },
      { status: 500 }
    );
  }
};
