import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import {
  compilePisaProcessReport,
  type PisaTelemetryEvent
} from '@core-os/domain';

/**
 * POST /api/v1/missions/[id]/telemetry
 * Ingests interactive simulation event streams, evaluates VOTAT (Vary One Thing At A Time),
 * computes Self-Regulated Learning (SRL) metrics, infers OECD PISA 2025 proficiency level (1–6),
 * and emits a Level 4 Learner Evidence atom into the growth ledger.
 */
export const POST: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const learnerId = resolveLearnerId(locals.user);
  if (!learnerId) {
    return json({ error: 'Forbidden: No authorized learner relationship associated with account' }, { status: 403 });
  }

  // Statutory DPDP Act Section 9 Active Consent Verification
  const hasConsent = await coreRepository.hasActiveConsentAsync(learnerId);
  const isDevDemo = import.meta.env.DEV && learnerId === '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  if (!hasConsent && !isDevDemo) {
    return json({
      error: 'Forbidden: Statutory parental consent under DPDP Act 2023 Section 9 missing or not active for this minor learner profile.'
    }, { status: 403 });
  }

  const { id: missionId } = params;
  const mission = coreRepository.getMissionById(missionId);
  if (!mission) {
    return json({ error: `Mission '${missionId}' not found in curriculum catalog` }, { status: 404 });
  }

  try {
    const body = await request.json();
    const events: PisaTelemetryEvent[] = Array.isArray(body.events) ? body.events : [];
    const optimalSteps = typeof body.optimalSteps === 'number' ? body.optimalSteps : 3;

    const userRole = (locals.user as any).role || (locals.user as any).metadata?.role || 'student';
    const isStaff = ['teacher', 'counselor', 'admin'].includes(userRole);

    const report = compilePisaProcessReport(learnerId, missionId, events, {
      optimalSteps,
      missionTitle: mission.title,
      isServerVerified: isStaff && locals.user.id !== learnerId
    });

    await coreRepository.savePisaProcessTelemetryAsync(report);

    return json({
      success: true,
      missionId,
      pisaLevel: report.inferredPisaLevel,
      levelRationale: report.levelRationale,
      srlMetrics: report.srlMetrics,
      evidenceRecorded: !!report.evidenceAtom,
      evidenceAtom: report.evidenceAtom || null,
      report
    });
  } catch (err: any) {
    return json({ error: 'Failed to process simulation telemetry', details: err?.message }, { status: 400 });
  }
};

/**
 * GET /api/v1/missions/[id]/telemetry
 * Retrieves historical PISA process telemetry reports for the authenticated learner on this mission.
 */
export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const learnerId = resolveLearnerId(locals.user);
  if (!learnerId) {
    return json({ error: 'Forbidden: No authorized learner relationship associated with account' }, { status: 403 });
  }

  const { id: missionId } = params;
  const allReports = await coreRepository.getPisaProcessReportsAsync(learnerId);
  const missionReports = allReports.filter((r) => r.missionId === missionId);

  return json({
    success: true,
    missionId,
    learnerId,
    reports: missionReports
  });
};
