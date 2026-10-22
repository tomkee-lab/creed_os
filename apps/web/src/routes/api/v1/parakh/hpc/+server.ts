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

  const user = locals.user;
  const userRole = (user as any).role || (user as any).metadata?.role || 'student';

  try {
    const body = await request.json();

    // Determine target learner ID
    let targetLearnerId = body.learnerId || resolveLearnerId(user);
    if (!targetLearnerId) {
      return json({ error: 'Forbidden: No authorized learner relationship associated with account' }, { status: 403 });
    }

    // Students are strictly bound to their own record
    if (userRole === 'student') {
      const boundId = resolveLearnerId(user);
      if (body.learnerId && body.learnerId !== boundId) {
        return json({ error: 'Forbidden: Learners cannot modify records belonging to another learner.' }, { status: 403 });
      }
      targetLearnerId = boundId;
    }

    const currentHpc = coreRepository.getParakhHpc(targetLearnerId);
    let updatedHpc: ParakhHpcRecord = { ...currentHpc };

    // 1. APAAR ID Modification: Administrative/Guardian statutory authority only
    if (body.apaarId !== undefined) {
      if (userRole === 'student') {
        return json({ error: 'Forbidden: Minor learners cannot modify statutory APAAR registration numbers.' }, { status: 403 });
      }
      if (body.apaarId === null || body.apaarId === '') {
        (updatedHpc as any).apaarId = null;
      } else if (isValidApaarId(body.apaarId)) {
        (updatedHpc as any).apaarId = body.apaarId;
      } else {
        return json({ error: 'Invalid APAAR ID: Must be exactly 12 numeric digits.' }, { status: 400 });
      }
    }

    // 2. Student Self-Reflection: Must be authored by the learner
    if (body.selfReflection) {
      if (userRole !== 'student' && userRole !== 'admin') {
        return json({ error: 'Forbidden: Self-reflections must be authored by the learner.' }, { status: 403 });
      }
      const selfRef = {
        ...body.selfReflection,
        submittedAt: body.selfReflection.submittedAt || new Date().toISOString()
      };
      updatedHpc = {
        ...updatedHpc,
        selfReflections: [selfRef, ...updatedHpc.selfReflections]
      };
    }

    // 3. Peer Evaluation: Collaborative inquiry between peer learners or teachers
    if (body.peerEvaluation) {
      if (userRole === 'student' && body.peerEvaluation.peerLearnerId === targetLearnerId) {
        return json({ error: 'Forbidden: A learner cannot submit a peer evaluation for themselves.' }, { status: 403 });
      }
      const peerEval = {
        ...body.peerEvaluation,
        peerLearnerId: userRole === 'student' ? user.id : body.peerEvaluation.peerLearnerId,
        observedAt: body.peerEvaluation.observedAt || new Date().toISOString()
      };
      updatedHpc = {
        ...updatedHpc,
        peerEvaluations: [peerEval, ...updatedHpc.peerEvaluations]
      };
    }

    // 4. Teacher Observation: Only verified educators can author
    if (body.teacherObservation) {
      if (userRole !== 'teacher' && userRole !== 'counselor' && userRole !== 'admin') {
        return json({ error: 'Forbidden: Only verified educators or counselors can author continuous teacher observations.' }, { status: 403 });
      }
      const teacherObs = {
        ...body.teacherObservation,
        teacherId: user.id,
        teacherName: user.name || (user as any).metadata?.name || 'Assigned Educator',
        loggedAt: body.teacherObservation.loggedAt || new Date().toISOString()
      };
      updatedHpc = {
        ...updatedHpc,
        teacherObservations: [teacherObs, ...updatedHpc.teacherObservations]
      };
    }

    // 5. Parent Feedback: Only verified guardians can author
    if (body.parentFeedback) {
      if (userRole !== 'parent' && userRole !== 'guardian' && userRole !== 'admin') {
        return json({ error: 'Forbidden: Only verified guardians can author home milestone feedback.' }, { status: 403 });
      }
      const parentFb = {
        ...body.parentFeedback,
        parentId: user.id,
        recordedAt: body.parentFeedback.recordedAt || new Date().toISOString()
      };
      updatedHpc = {
        ...updatedHpc,
        parentFeedback: [parentFb, ...updatedHpc.parentFeedback]
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
