import { createChallenge, verifySolution } from 'altcha-lib/v1';

export interface AltchaChallenge {
  algorithm: string;
  challenge: string;
  maxnumber: number;
  salt: string;
  signature: string;
}

function getAltchaHmacKey(): string {
  const key = process.env.ALTCHA_HMAC_KEY;
  if (key && key.trim()) {
    return key.trim();
  }
  if (!import.meta.env.DEV) {
    throw new Error('FATAL: ALTCHA_HMAC_KEY environment variable is mandatory outside local development.');
  }
  return 'creed-os-dev-only-altcha-ephemeral-key';
}

/**
 * Creates a cryptographically signed Proof-of-Work challenge for client solving.
 * @param maxnumber The computational complexity (default 30,000 hashes, ~200-500ms on modern client).
 */
export async function createAltchaChallenge(maxnumber: number = 30000): Promise<AltchaChallenge> {
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minute challenge TTL
  return (await createChallenge({
    hmacKey: getAltchaHmacKey(),
    maxnumber,
    expires
  })) as AltchaChallenge;
}

/**
 * Verifies an ALTCHA Proof-of-Work payload submitted by a client.
 * @param payload Base64-encoded JSON solution payload from client.
 */
export async function verifyAltchaPayload(payload: string): Promise<boolean> {
  if (!payload || typeof payload !== 'string') {
    return false;
  }
  try {
    return await verifySolution(payload, getAltchaHmacKey(), true);
  } catch {
    return false;
  }
}
