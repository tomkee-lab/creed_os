import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async () => {
  const cohort = coreRepository.getClassCohort();
  const sampleReports = coreRepository.getBenchmarkReports('3fa85f64-5717-4562-b3fc-2c963f66afa6');

  return {
    cohort,
    sampleReports
  };
};
