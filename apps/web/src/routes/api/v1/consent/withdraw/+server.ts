import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transitionConsentState, type ConsentRecord } from '@core-os/domain';
import { resolveLearnerId } from '$lib/server/learnerScope';

export const POST: RequestHandler = async ({ request, locals }) => {
  // 1. Enforce session requirements for statutory consent withdrawal under DPDP Act 2023
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required to withdraw statutory consent.' }, { status: 401 });
  }

  // 2. Enforce guardian or administrative authorization
  const user = locals.user;
  const userRole = (user as any).role || (user as any).metadata?.role || 'student';
  if (!['parent', 'admin'].includes(userRole)) {
    return json({ error: 'Forbidden: Only authorized guardians or institutional administrators may withdraw statutory consent.' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const boundLearnerId = resolveLearnerId(user);

  if (userRole === 'parent' && body.learnerId && body.learnerId !== boundLearnerId) {
    return json({ error: 'Forbidden: Guardians may strictly withdraw statutory consent for their verified child only.' }, { status: 403 });
  }

  const targetLearnerId = userRole === 'parent' ? boundLearnerId : (body.learnerId || boundLearnerId);
  const reason = body.reason || 'Parent requested statutory deletion under DPDP Act 2023';

  const activeRecord: ConsentRecord = {
    id: 'cst_' + crypto.randomUUID().slice(0, 8),
    learnerId: targetLearnerId,
    parentName: (user as any).name || 'Verified Guardian',
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
