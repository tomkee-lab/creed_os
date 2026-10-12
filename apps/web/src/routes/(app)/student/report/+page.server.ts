import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';

export const load: PageServerLoad = async ({ locals, url }) => {
  const learnerId = locals.user ? resolveLearnerId(locals.user) : null;
  if (!learnerId) {
    throw error(404, 'No bound learner profile found for this student account');
  }

  const profile = coreRepository.getLearnerProfile(learnerId);
  const reports = coreRepository.getBenchmarkReports(learnerId);
  const selectedDomain = (url.searchParams.get('domain') || 'stem') as 'stem' | 'english' | 'robotics';
  const activeReport = coreRepository.getBenchmarkReport(learnerId, selectedDomain) || reports[0] || null;

  return {
    learner: profile,
    reports,
    activeReport,
    selectedDomain
  };
};
