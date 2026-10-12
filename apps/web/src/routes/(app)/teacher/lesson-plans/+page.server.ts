import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async () => {
  const lessonPlans = coreRepository.getLessonPlans();
  const cohort = coreRepository.getClassCohort();

  return {
    lessonPlans,
    misconceptionClusters: cohort.misconceptionClusters
  };
};
