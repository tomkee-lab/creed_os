import { createChallenge, verifySolution } from 'altcha-lib/v1';

export interface AltchaChallenge {
  algorithm: string;
  challenge: string;
  maxnumber: number;
  salt: string;
  signature: string;
}

const ALTCHA_HMAC_KEY = process.env.ALTCHA_HMAC_KEY || 'creed-os-authoritative-altcha-key-2026';

/**
 * Creates a cryptographically signed Proof-of-Work challenge for client solving.
 * @param maxnumber The computational complexity (default 30,000 hashes, ~200-500ms on modern client).
 */
export async function createAltchaChallenge(maxnumber: number = 30000): Promise<AltchaChallenge> {
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minute challenge TTL
  return (await createChallenge({
    hmacKey: ALTCHA_HMAC_KEY,
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
    return await verifySolution(payload, ALTCHA_HMAC_KEY, true);
  } catch {
    return false;
  }
}
