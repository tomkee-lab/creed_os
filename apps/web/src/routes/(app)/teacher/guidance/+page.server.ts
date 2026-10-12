import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async () => {
  const playbooks = coreRepository.getTeacherGuidancePlaybooks();
  const cohort = coreRepository.getClassCohort();

  return {
    playbooks,
    misconceptionClusters: cohort.misconceptionClusters
  };
};
