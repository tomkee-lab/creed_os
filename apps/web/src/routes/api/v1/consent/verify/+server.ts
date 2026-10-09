import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transitionConsentState, type ConsentRecord, type VerificationChannel } from '@core-os/domain';
// Import the OTP store and learner-bound hash function from consent-otp helper
import { OTP_STORE, hashChallengeKey } from '$lib/server/consent-otp';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
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
      learnerId = '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      channel = 'SMS_OTP',
      parentName,
      parentContact,
      otp,
      auditToken
    } = body as Record<string, unknown>;

    // Enforce statutory guardian identity fields under DPDP Act 2023
    if (typeof parentName !== 'string' || !parentName.trim()) {
      return json({ error: 'Guardian full legal name is required for DPDP compliance.' }, { status: 400 });
    }
    if (typeof parentContact !== 'string' || !parentContact.trim()) {
      return json({ error: 'Guardian contact identifier (mobile / DigiLocker ID) is required.' }, { status: 400 });
    }
    if (typeof learnerId !== 'string' || !learnerId.trim()) {
      return json({ error: 'Learner identifier is required to verify statutory consent.' }, { status: 400 });
    }

    const sanitizedContact = parentContact.trim();
    const sanitizedLearnerId = learnerId.trim();
    const sanitizedParentName = parentName.trim();
    const token = (otp ?? auditToken ?? '').toString().trim();

    if (!token || token.length < 4) {
      return json({ error: 'A valid 6-digit OTP or DigiLocker verification token is required.' }, { status: 400 });
    }

    // Verify OTP against server-issued challenge bound to BOTH contact and learnerId
    const key = await hashChallengeKey(sanitizedContact, sanitizedLearnerId);
    const stored = OTP_STORE.get(key);

    if (!stored) {
      return json(
        { error: 'No OTP challenge found for this contact and learner. Please request a new verification code.' },
        { status: 400 }
      );
    }

    if (stored.learnerId !== sanitizedLearnerId) {
      return json(
        { error: 'Verification code mismatch: OTP challenge was not issued for this learner.' },
        { status: 403 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      OTP_STORE.delete(key);
      return json({ error: 'OTP has expired. Please request a new verification code.' }, { status: 400 });
    }

    if (stored.otp !== token) {
      return json({ error: 'Invalid OTP. Please check your verification code and try again.' }, { status: 400 });
    }

    // OTP valid — consume it (single-use)
    OTP_STORE.delete(key);

    const initialRecord: ConsentRecord = {
      id: 'cst_' + crypto.randomUUID().slice(0, 8),
      learnerId: sanitizedLearnerId,
      parentName: sanitizedParentName,
      parentContact: sanitizedContact,
      verificationChannel: (channel as VerificationChannel) || 'SMS_OTP',
      status: 'NOTICE_SENT',
      consentVersion: 'v1.2-dpdp-2023',
      purposes: ['COMPETENCY_ASSESSMENT', 'SOCRATIC_MENTORSHIP', 'PATHWAY_NAVIGATION'],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      immutableAuditHash: '',
      updatedAt: new Date().toISOString()
    };

    const verifiedRecord = transitionConsentState(initialRecord, {
      type: 'VERIFY_CONSENT',
      channel: (channel as VerificationChannel) || 'SMS_OTP',
      verifiedAt: new Date().toISOString(),
      expiresAt: initialRecord.expiresAt,
      auditToken: token
    });

    // Set statutory consent verification cookie so parent session is immediately recognized
    cookies.set('creed_consent_verified', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60
    });

    // If an authenticated user session exists with pending parent role, promote to active verified parent
    if (locals.user && (locals.user.role === 'parent_pending' || !locals.user.role)) {
      locals.user.role = 'parent';
    }

    return json({
      success: true,
      message: 'DPDP statutory parental consent verified and cryptographically sealed.',
      consent: verifiedRecord
    }, { status: 200 });
  } catch (err: any) {
    console.error('[Consent Verify Failure]', {
      timestamp: new Date().toISOString(),
      error: err?.message || String(err),
      stack: err?.stack
    });
    return json({ error: err?.message || 'Failed to verify consent record.' }, { status: 400 });
  }
};
