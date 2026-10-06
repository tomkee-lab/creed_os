import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async () => {
  const overview = coreRepository.getSchoolOverview();
  const consentLedger = coreRepository.getConsentLedger();
  const teacherRoster = coreRepository.getTeacherRoster();
  const pathwayMetrics = coreRepository.getSchoolPathwayDistribution();

  return {
    overview,
    consentLedger,
    teacherRoster,
    pathwayMetrics
  };
};
