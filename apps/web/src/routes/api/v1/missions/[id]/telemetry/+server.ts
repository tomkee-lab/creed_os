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

  const { id: missionId } = params;
  const mission = coreRepository.getMissionById(missionId);
  if (!mission) {
    return json({ error: `Mission '${missionId}' not found in curriculum catalog` }, { status: 404 });
  }

  try {
    const body = await request.json();
    const events: PisaTelemetryEvent[] = Array.isArray(body.events) ? body.events : [];
    const optimalSteps = typeof body.optimalSteps === 'number' ? body.optimalSteps : 3;

    const report = compilePisaProcessReport(learnerId, missionId, events, {
      optimalSteps,
      missionTitle: mission.title
    });

    coreRepository.savePisaProcessTelemetry(report);

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
  const allReports = coreRepository.getPisaProcessReports(learnerId);
  const missionReports = allReports.filter((r) => r.missionId === missionId);

  return json({
    success: true,
    missionId,
    learnerId,
    reports: missionReports
  });
};
