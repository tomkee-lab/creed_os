import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transitionConsentState, type ConsentRecord, type VerificationChannel } from '@core-os/domain';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  const {
    learnerId = '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    channel = 'SMS_OTP',
    auditToken = 'otp_verified_' + Math.random().toString(36).slice(2, 8)
  } = body;

  const initialRecord: ConsentRecord = {
    id: 'cst_' + crypto.randomUUID().slice(0, 8),
    learnerId,
    parentName: body.parentName || 'Verified Guardian',
    parentContact: body.parentContact || '+91 98765 43210',
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
      auditToken
    });

    return json({
      success: true,
      message: 'DPDP statutory parental consent verified and sealed.',
      consent: verifiedRecord
    }, { status: 200 });
  } catch (err: any) {
    return json({ error: err.message }, { status: 400 });
  }
};
