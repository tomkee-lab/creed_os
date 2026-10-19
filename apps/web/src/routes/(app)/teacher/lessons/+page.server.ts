import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async () => {
  const lessonPlans = coreRepository.getLessonPlans();
  const playbooks = coreRepository.getTeacherGuidancePlaybooks();
  const cohort = coreRepository.getClassCohort();

  return {
    lessonPlans,
    playbooks,
    misconceptionClusters: cohort.misconceptionClusters
  };
};
