import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';

export const GET: RequestHandler = async ({ params, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const { id } = params;
  const user = locals.user;
  const userRole = (user as any).role || (user as any).metadata?.role || 'student';

  if (userRole.endsWith('_pending')) {
    return json({ error: 'Forbidden: Account pending verification.' }, { status: 403 });
  }

  const boundLearnerId = resolveLearnerId(user);

  // 2. Relationship-scoped authorization (DPDP Act & Child Privacy)
  if (userRole === 'student' && id !== boundLearnerId) {
    return json({ error: 'Forbidden: Students are restricted strictly to their own diagnostic evidence.' }, { status: 403 });
  }

  if (userRole === 'parent' && id !== boundLearnerId) {
    return json({ error: 'Forbidden: Guardians are restricted to their verified child evidence records.' }, { status: 403 });
  }

  if (!['student', 'parent', 'teacher', 'admin', 'counselor'].includes(userRole)) {
    return json({ error: 'Forbidden: Unauthorized credential.' }, { status: 403 });
  }

  const evidence = coreRepository.getLearnerEvidence(id);

  return json({
    learnerId: id,
    evidenceCount: evidence.length,
    evidence: evidence.map((e) => ({
      id: e.id,
      competency: e.competency,
      strengthLevel: e.evidenceStrength,
      sourceType: e.sourceType,
      sourceName: e.sourceTitle,
      observedAt: e.observedAt,
      confidence: e.confidence,
      summary: e.summary,
      observedValue: e.observedValue
    }))
  });
};
