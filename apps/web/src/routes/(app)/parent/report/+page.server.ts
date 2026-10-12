import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async ({ locals, url }) => {
  const learnerId = locals.user?.id || '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  const profile = coreRepository.getLearnerProfile(learnerId);
  const reports = coreRepository.getBenchmarkReports(learnerId);
  const selectedDomain = (url.searchParams.get('domain') || 'stem') as 'stem' | 'english' | 'robotics';
  const activeReport = coreRepository.getBenchmarkReport(learnerId, selectedDomain) || reports[0];

  return {
    learner: profile,
    reports,
    activeReport,
    selectedDomain
  };
};
