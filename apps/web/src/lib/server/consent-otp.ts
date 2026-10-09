export interface StoredOtpChallenge {
  otp: string;
  expiresAt: number;
  learnerId: string;
  parentContact: string;
}

// In-memory OTP store: challenge hash → { otp, expiresAt, learnerId, parentContact }
export const OTP_STORE = new Map<string, StoredOtpChallenge>();
export const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function generateOtp(): string {
  // Cryptographically random 6-digit OTP
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(100000 + (arr[0] % 900000));
}

/**
 * Hash parent contact and learnerId together to bind OTP challenge strictly
 * to the specified learner, preventing unauthorized cross-learner verification.
 */
export async function hashChallengeKey(contact: string, learnerId: string): Promise<string> {
  const normalized = `${contact.trim().toLowerCase()}::${learnerId.trim().toLowerCase()}`;
  const encoded = new TextEncoder().encode(normalized);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
