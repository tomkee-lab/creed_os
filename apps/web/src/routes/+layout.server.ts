import type { LayoutServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: LayoutServerLoad = async () => {
  const learner = coreRepository.getLearnerProfile('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  const evidence = coreRepository.getLearnerEvidence(learner.id);
  const pathways = coreRepository.getPathways();
  const cohort = coreRepository.getClassCohort();

  return {
    learner,
    evidence,
    pathways,
    cohort
  };
};
