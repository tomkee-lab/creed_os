import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
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
