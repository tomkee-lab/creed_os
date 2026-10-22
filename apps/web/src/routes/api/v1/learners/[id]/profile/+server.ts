import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import { toSafeCompetencyDTO } from '$lib/server/psychometricDto';

export const GET: RequestHandler = async ({ params, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const { id } = params;
  const user = locals.user;
  const userRole = (user as any).role || (user as any).metadata?.role || 'student';

  // 2. Relationship-scoped authorization (DPDP Act & Child Privacy)
  if (userRole.endsWith('_pending')) {
    return json({ error: 'Forbidden: Account pending verification.' }, { status: 403 });
  }

  if (!['student', 'parent', 'teacher', 'admin', 'counselor'].includes(userRole)) {
    return json({ error: 'Forbidden: Unauthorized credential.' }, { status: 403 });
  }

  const boundLearnerId = resolveLearnerId(user);

  if (userRole === 'student' && id !== boundLearnerId) {
    return json({ error: 'Forbidden: Students are restricted strictly to their own learner profile.' }, { status: 403 });
  }

  if (userRole === 'parent') {
    const isAuthorized =
      coreRepository.isGuardianLinkedToLearner(user.id, id) ||
      id === boundLearnerId ||
      (import.meta.env.DEV && id === '3fa85f64-5717-4562-b3fc-2c963f66afa6');
    if (!isAuthorized) {
      return json({ error: 'Forbidden: Guardians are restricted to their verified child profile.' }, { status: 403 });
    }
  }

  if (['teacher', 'counselor'].includes(userRole)) {
    const isCohort = await coreRepository.isLearnerInEducatorCohortAsync(user.id, id);
    if (!isCohort && (!import.meta.env.DEV || id !== '3fa85f64-5717-4562-b3fc-2c963f66afa6')) {
      return json({ error: 'Forbidden: Educators are restricted strictly to students within their authorized cohort.' }, { status: 403 });
    }
  }

  let learner = coreRepository.getLearnerProfile(id);
  if (!learner && typeof (coreRepository as any).getLearnerProfileFromDb === 'function') {
    learner = await (coreRepository as any).getLearnerProfileFromDb(id);
  }

  if (!learner) {
    return json({ error: 'Learner profile not found' }, { status: 404 });
  }

  const pathways = coreRepository.getPathways();

  // Compute pathway alignment summaries without false precision or synthetic default scores
  const topPathways = pathways.slice(0, 3).map((p) => {
    let demonstratedCount = 0;
    const totalRequired = p.requirements.length;
    let sumScore = 0;
    let assessedCount = 0;

    for (const req of p.requirements) {
      const comp = learner.competencies[req.competency];
      if (comp && typeof comp.score === 'number') {
        sumScore += comp.score;
        assessedCount++;
        if (comp.score >= 3.0) {
          demonstratedCount++;
        }
      }
    }

    const avgScore = assessedCount > 0 ? sumScore / assessedCount : 0;
    const band = assessedCount === 0
      ? 'Exploratory baseline'
      : avgScore >= 3.8 && demonstratedCount === totalRequired
      ? 'Strong foundation'
      : avgScore >= 2.8
      ? 'Developing foundation'
      : 'Emerging exploration';

    return {
      pathwayId: p.id,
      title: p.title,
      developmentalBand: band,
      foundationalCompetenciesDemonstrated: `${demonstratedCount} / ${totalRequired}`,
      mismatchStatus: assessedCount === 0 ? 'exploratory' : avgScore >= 3.0 ? 'aligned' : 'foundation_gap'
    };
  });

  const isMinorOrGuardian = ['student', 'parent'].includes(userRole);
  const safeCompetencies = isMinorOrGuardian
    ? Object.fromEntries(
        Object.entries(learner.competencies || {}).map(([key, comp]: [string, any]) => [
          key,
          toSafeCompetencyDTO(key, comp)
        ])
      )
    : learner.competencies;

  return json({
    learnerId: learner.id,
    name: learner.fullName,
    age: learner.age,
    grade: 8,
    gradeBand: learner.gradeBand,
    schoolName: learner.schoolName,
    competencies: safeCompetencies,
    topPathways
  });
};
