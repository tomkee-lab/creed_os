import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In-memory OTP store: contact hash → { otp, expiresAt }
// In production this would be Redis/Supabase-backed with TTL
const OTP_STORE = new Map<string, { otp: string; expiresAt: number }>();
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

function generateOtp(): string {
  // Cryptographically random 6-digit OTP
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(100000 + (arr[0] % 900000));
}

async function hashContact(contact: string): Promise<string> {
  const encoded = new TextEncoder().encode(contact.trim().toLowerCase());
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  const { parentName, parentContact, channel = 'SMS_OTP' } = body;

  if (!parentName?.trim()) {
    return json({ error: 'Guardian legal name is required.' }, { status: 400 });
  }
  if (!parentContact?.trim()) {
    return json({ error: 'Guardian contact (mobile / DigiLocker ID) is required.' }, { status: 400 });
  }

  const otp = generateOtp();
  const key = await hashContact(parentContact);
  OTP_STORE.set(key, { otp, expiresAt: Date.now() + OTP_TTL_MS });

  // In production: dispatch OTP via SMS gateway or DigiLocker API here.
  // For development/demo environments, return OTP in response body for testing.
  const isDev = import.meta.env.DEV;

  return json({
    success: true,
    channel,
    message: isDev
      ? `[DEV ONLY] OTP issued. Would be sent via ${channel} to ${parentContact}`
      : `Verification OTP sent via ${channel}. Valid for 5 minutes.`,
    // NEVER expose OTP in production responses
    ...(isDev ? { devOtp: otp } : {})
  });
};

// Export OTP_STORE for use by the verify endpoint (same module boundary)
export { OTP_STORE, hashContact };
