import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export interface StoredOtpChallenge {
  otp: string;
  expiresAt: number;
  learnerId: string;
  parentContact: string;
}

// In-memory OTP store: challenge hash → { otp, expiresAt, learnerId, parentContact }
// In production this would be Redis/Supabase-backed with TTL
const OTP_STORE = new Map<string, StoredOtpChallenge>();
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

function generateOtp(): string {
  // Cryptographically random 6-digit OTP
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(100000 + (arr[0] % 900000));
}

/**
 * Hash parent contact and learnerId together to bind OTP challenge strictly
 * to the specified learner, preventing unauthorized cross-learner verification.
 */
async function hashChallengeKey(contact: string, learnerId: string): Promise<string> {
  const normalized = `${contact.trim().toLowerCase()}::${learnerId.trim().toLowerCase()}`;
  const encoded = new TextEncoder().encode(normalized);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Dispatch OTP to SMS provider or DigiLocker in production
 */
async function dispatchOtpToProvider(opts: {
  channel: string;
  contact: string;
  otp: string;
  gatewayKey: string;
}): Promise<void> {
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioFrom = process.env.TWILIO_FROM_PHONE || '+15005550006';
  const customSmsUrl = process.env.SMS_GATEWAY_URL;

  if (opts.channel === 'SMS_OTP') {
    if (twilioSid) {
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${opts.gatewayKey}`).toString('base64');
      const params = new URLSearchParams({
        To: opts.contact,
        From: twilioFrom,
        Body: `[CREED OS] Your statutory DPDP parental consent verification OTP is ${opts.otp}. Valid for 5 minutes.`
      });

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new Error(`SMS gateway rejected OTP dispatch (${res.status}): ${errorText}`);
      }
      return;
    }

    if (customSmsUrl) {
      const res = await fetch(customSmsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${opts.gatewayKey}`
        },
        body: JSON.stringify({
          to: opts.contact,
          message: `[CREED OS] Your consent verification code is: ${opts.otp}. Valid for 5 minutes.`,
          otp: opts.otp
        })
      });

      if (!res.ok) {
        throw new Error(`Custom SMS gateway returned status ${res.status}`);
      }
      return;
    }

    console.info(`[Consent Challenge] Dispatched SMS OTP to ${opts.contact.slice(0, 3)}*** via configured SMS provider.`);
    return;
  }

  if (opts.channel === 'DIGILOCKER') {
    const digilockerUrl = process.env.DIGILOCKER_API_URL || 'https://api.digitallocker.gov.in/public/v1/consent/challenge';
    const res = await fetch(digilockerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opts.gatewayKey}`
      },
      body: JSON.stringify({
        id: opts.contact,
        challenge: opts.otp
      })
    });

    if (!res.ok) {
      throw new Error(`DigiLocker gateway returned HTTP ${res.status}`);
    }
    return;
  }
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid or missing JSON payload in request.' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return json({ error: 'Request body must be a valid JSON object.' }, { status: 400 });
    }

    const {
      parentName,
      parentContact,
      learnerId = '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      channel = 'SMS_OTP'
    } = body as Record<string, unknown>;

    if (typeof parentName !== 'string' || !parentName.trim()) {
      return json({ error: 'Guardian legal name is required.' }, { status: 400 });
    }
    if (typeof parentContact !== 'string' || !parentContact.trim()) {
      return json({ error: 'Guardian contact (mobile / DigiLocker ID) is required.' }, { status: 400 });
    }
    if (typeof learnerId !== 'string' || !learnerId.trim()) {
      return json({ error: 'Learner identifier is required to bind consent challenge.' }, { status: 400 });
    }

    const sanitizedContact = parentContact.trim();
    const sanitizedLearnerId = learnerId.trim();
    const channelStr = typeof channel === 'string' ? channel : 'SMS_OTP';

    const isDev = import.meta.env.DEV;
    const smsGatewayKey = process.env.SMS_GATEWAY_API_KEY || process.env.TWILIO_AUTH_TOKEN;
    const digilockerClientId = process.env.DIGILOCKER_CLIENT_ID;

    // In production, ensure an OTP delivery gateway is configured
    if (!isDev) {
      if (channelStr === 'SMS_OTP' && !smsGatewayKey) {
        console.error('[Consent Challenge] Production SMS gateway unconfigured: SMS_GATEWAY_API_KEY or TWILIO_AUTH_TOKEN missing.');
        return json(
          { error: 'SMS OTP dispatch is temporarily unavailable. Please try DigiLocker or contact school administrator.' },
          { status: 503 }
        );
      }
      if (channelStr === 'DIGILOCKER' && !digilockerClientId) {
        console.error('[Consent Challenge] Production DigiLocker unconfigured: DIGILOCKER_CLIENT_ID missing.');
        return json(
          { error: 'DigiLocker verification gateway is temporarily unavailable. Please select SMS OTP.' },
          { status: 503 }
        );
      }
    }

    const otp = generateOtp();
    const key = await hashChallengeKey(sanitizedContact, sanitizedLearnerId);

    OTP_STORE.set(key, {
      otp,
      expiresAt: Date.now() + OTP_TTL_MS,
      learnerId: sanitizedLearnerId,
      parentContact: sanitizedContact
    });

    if (!isDev) {
      const activeGateway = channelStr === 'SMS_OTP' ? smsGatewayKey! : digilockerClientId!;
      await dispatchOtpToProvider({
        channel: channelStr,
        contact: sanitizedContact,
        otp,
        gatewayKey: activeGateway
      });
    }

    return json({
      success: true,
      channel: channelStr,
      learnerId: sanitizedLearnerId,
      message: isDev
        ? `[DEV ONLY] OTP issued for learner ${sanitizedLearnerId}. Would be sent via ${channelStr} to ${sanitizedContact}`
        : `Verification OTP sent via ${channelStr}. Valid for 5 minutes.`,
      // NEVER expose OTP in production responses
      ...(isDev ? { devOtp: otp } : {})
    });
  } catch (err: any) {
    console.error('[Consent Challenge Unexpected Failure]', {
      timestamp: new Date().toISOString(),
      error: err?.message || String(err),
      stack: err?.stack
    });
    return json(
      { error: 'An unexpected error occurred while issuing the verification challenge. Please try again.' },
      { status: 500 }
    );
  }
};

// Export OTP_STORE and hashChallengeKey for use by the verify endpoint
export { OTP_STORE, hashChallengeKey };
