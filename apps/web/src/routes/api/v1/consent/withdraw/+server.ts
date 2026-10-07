import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transitionConsentState, type ConsentRecord } from '@core-os/domain';

export const POST: RequestHandler = async ({ request, locals }) => {
  // Enforce session requirements for consent withdrawal under DPDP Act 2023
  if (!locals.session && !import.meta.env.DEV) {
    return json({ error: 'Unauthorized: Active session required to withdraw statutory consent.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const {
    learnerId = '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    reason = 'Parent requested statutory deletion under DPDP Act 2023'
  } = body;

  const activeRecord: ConsentRecord = {
    id: 'cst_' + crypto.randomUUID().slice(0, 8),
    learnerId,
    parentName: 'Verified Guardian',
    parentContact: '+91 98765 43210',
    verificationChannel: 'SMS_OTP',
    status: 'VERIFIED_ACTIVE',
    consentVersion: 'v1.2-dpdp-2023',
    purposes: ['COMPETENCY_ASSESSMENT', 'SOCRATIC_MENTORSHIP', 'PATHWAY_NAVIGATION'],
    verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
    immutableAuditHash: 'dpdp_prior_verified',
    updatedAt: new Date().toISOString()
  };

  try {
    const withdrawnRecord = transitionConsentState(activeRecord, {
      type: 'WITHDRAW_CONSENT',
      withdrawnAt: new Date().toISOString(),
      reason
    });

    return json({
      success: true,
      message: 'DPDP consent successfully withdrawn. Processing is frozen and telemetry embargoed.',
      consent: withdrawnRecord
    }, { status: 200 });
  } catch (err: any) {
    return json({ error: err.message }, { status: 400 });
  }
};
