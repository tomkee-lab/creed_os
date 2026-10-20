import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import { PARAKH_I18N, isValidApaarId, type ParakhHpcRecord } from '@core-os/domain';

/**
 * GET /api/v1/parakh/hpc
 * Retrieves the canonical PARAKH 360-Degree Holistic Progress Card for the authenticated learner.
 * Supports bilingual localization (locale=en or locale=hi) conforming to NEP 2020 / NCERT PARAKH.
 */
export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const learnerId = resolveLearnerId(locals.user);
  if (!learnerId) {
    return json({ error: 'Forbidden: No authorized learner relationship associated with account' }, { status: 403 });
  }

  const localeParam = url.searchParams.get('locale');
  const locale = localeParam === 'hi' ? 'hi' : 'en';

  const hpc = coreRepository.getParakhHpc(learnerId);

  return json({
    success: true,
    learnerId,
    locale,
    i18n: PARAKH_I18N[locale],
    hpc
  });
};

/**
 * POST /api/v1/parakh/hpc
 * Updates or appends 360-degree evaluation quad feedback (Self, Peer, Teacher, Parent) or APAAR ID.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const learnerId = resolveLearnerId(locals.user);
  if (!learnerId) {
    return json({ error: 'Forbidden: No authorized learner relationship associated with account' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const currentHpc = coreRepository.getParakhHpc(learnerId);

    let updatedHpc: ParakhHpcRecord = { ...currentHpc };

    // Update APAAR ID if supplied and valid
    if (body.apaarId !== undefined) {
      if (body.apaarId === null || body.apaarId === '') {
        (updatedHpc as any).apaarId = null;
      } else if (isValidApaarId(body.apaarId)) {
        (updatedHpc as any).apaarId = body.apaarId;
      } else {
        return json({ error: 'Invalid APAAR ID: Must be exactly 12 numeric digits.' }, { status: 400 });
      }
    }

    // Append Self Reflection
    if (body.selfReflection) {
      updatedHpc = {
        ...updatedHpc,
        selfReflections: [body.selfReflection, ...updatedHpc.selfReflections]
      };
    }

    // Append Peer Evaluation
    if (body.peerEvaluation) {
      updatedHpc = {
        ...updatedHpc,
        peerEvaluations: [body.peerEvaluation, ...updatedHpc.peerEvaluations]
      };
    }

    // Append Teacher Observation (CRA)
    if (body.teacherObservation) {
      updatedHpc = {
        ...updatedHpc,
        teacherObservations: [body.teacherObservation, ...updatedHpc.teacherObservations]
      };
    }

    // Append Parent Feedback
    if (body.parentFeedback) {
      updatedHpc = {
        ...updatedHpc,
        parentFeedback: [body.parentFeedback, ...updatedHpc.parentFeedback]
      };
    }

    coreRepository.saveParakhHpc(updatedHpc);

    return json({
      success: true,
      message: 'PARAKH 360° HPC record updated successfully.',
      hpc: updatedHpc
    });
  } catch (err: any) {
    return json({ error: 'Malformed request payload', details: err?.message }, { status: 400 });
  }
};
