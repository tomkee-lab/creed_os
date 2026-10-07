import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transitionConsentState, type ConsentRecord, type VerificationChannel } from '@core-os/domain';
// Import the OTP store from the challenge endpoint (same server boundary)
import { OTP_STORE, hashContact } from '../challenge/+server';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  const {
    learnerId = '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    channel = 'SMS_OTP',
    parentName,
    parentContact,
    otp,
    auditToken
  } = body;

  // Enforce statutory guardian identity fields under DPDP Act 2023
  if (!parentName?.trim()) {
    return json({ error: 'Guardian full legal name is required for DPDP compliance.' }, { status: 400 });
  }
  if (!parentContact?.trim()) {
    return json({ error: 'Guardian contact identifier (mobile / DigiLocker ID) is required.' }, { status: 400 });
  }

  const token = (otp ?? auditToken ?? '').toString().trim();
  if (!token || token.length < 4) {
    return json({ error: 'A valid 6-digit OTP or DigiLocker verification token is required.' }, { status: 400 });
  }

  // Verify OTP against server-issued challenge (guardian contact keyed, TTL-gated)
  const key = await hashContact(parentContact);
  const stored = OTP_STORE.get(key);

  if (!stored) {
    return json({ error: 'No OTP challenge found for this contact. Please request a new OTP.' }, { status: 400 });
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
    learnerId,
    parentName: parentName.trim(),
    parentContact: parentContact.trim(),
    verificationChannel: channel as VerificationChannel,
    status: 'NOTICE_SENT',
    consentVersion: 'v1.2-dpdp-2023',
    purposes: ['COMPETENCY_ASSESSMENT', 'SOCRATIC_MENTORSHIP', 'PATHWAY_NAVIGATION'],
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    immutableAuditHash: '',
    updatedAt: new Date().toISOString()
  };

  try {
    const verifiedRecord = transitionConsentState(initialRecord, {
      type: 'VERIFY_CONSENT',
      channel: channel as VerificationChannel,
      verifiedAt: new Date().toISOString(),
      expiresAt: initialRecord.expiresAt,
      auditToken: token
    });

    return json({
      success: true,
      message: 'DPDP statutory parental consent verified and cryptographically sealed.',
      consent: verifiedRecord
    }, { status: 200 });
  } catch (err: any) {
    return json({ error: err.message }, { status: 400 });
  }
};
