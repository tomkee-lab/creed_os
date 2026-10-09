import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';

export const GET: RequestHandler = async ({ params, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const { id } = params;
  const user = locals.user;
  const userRole = (user as any).role || (user as any).metadata?.role || 'student';
  const boundLearnerId = (user as any).learnerId || (['student', 'parent'].includes(userRole) ? '3fa85f64-5717-4562-b3fc-2c963f66afa6' : (user as any).id);

  // 2. Relationship-scoped authorization (DPDP Act & Child Privacy)
  if (userRole === 'student' && id !== boundLearnerId) {
    return json({ error: 'Forbidden: Students are restricted strictly to their own learner profile.' }, { status: 403 });
  }

  if (userRole === 'parent' && id !== boundLearnerId) {
    return json({ error: 'Forbidden: Guardians are restricted to their verified child profile.' }, { status: 403 });
  }

  const learner = coreRepository.getLearnerProfile(id);

  if (!learner) {
    return json({ error: 'Learner profile not found' }, { status: 404 });
  }

  const pathways = coreRepository.getPathways();

  // Compute pathway alignment summaries
  const topPathways = pathways.slice(0, 3).map((p) => {
    // Average demonstrated score across required competencies
    let totalScore = 0;
    let count = 0;
    for (const req of p.requirements) {
      const comp = learner.competencies[req.competency];
      totalScore += comp ? comp.score : 3.0;
      count++;
    }
    const readiness = count > 0 ? Number((totalScore / (count * 5.0)).toFixed(2)) : 0.75;
    const isAligned = readiness >= 0.70;

    return {
      pathwayId: p.id,
      title: p.title,
      readiness,
      mismatchStatus: isAligned ? 'aligned' : 'foundation_gap'
    };
  });

  return json({
    learnerId: learner.id,
    name: learner.fullName,
    age: learner.age,
    grade: 8,
    gradeBand: learner.gradeBand,
    schoolName: learner.schoolName,
    competencies: learner.competencies,
    topPathways
  });
};
