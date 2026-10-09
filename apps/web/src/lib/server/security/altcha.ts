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

// In-memory replay prevention store: challenge/signature -> expiry timestamp
const consumedSolutions = new Map<string, number>();

function pruneConsumedSolutions() {
  const now = Date.now();
  for (const [key, expiresAt] of consumedSolutions.entries()) {
    if (expiresAt <= now) {
      consumedSolutions.delete(key);
    }
  }
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
 * Enforces one-time usage to prevent replay attacks within the 5-minute TTL.
 * @param payload Base64-encoded JSON solution payload from client.
 */
export async function verifyAltchaPayload(payload: string): Promise<boolean> {
  if (!payload || typeof payload !== 'string' || !payload.trim()) {
    return false;
  }
  try {
    pruneConsumedSolutions();

    // Extract unique identifier from payload
    let uniqueKey: string;
    try {
      const decodedJson = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
      uniqueKey = decodedJson.challenge || decodedJson.signature || payload;
    } catch {
      uniqueKey = payload;
    }

    if (consumedSolutions.has(uniqueKey)) {
      console.warn('[ALTCHA] Replay detected: solution payload has already been consumed.');
      return false;
    }

    const isValid = await verifySolution(payload, getAltchaHmacKey(), true);
    if (!isValid) {
      return false;
    }

    // Persist consumed key for 10 minutes (exceeds 5-minute challenge lifetime)
    consumedSolutions.set(uniqueKey, Date.now() + 10 * 60 * 1000);
    return true;
  } catch {
    return false;
  }
}
