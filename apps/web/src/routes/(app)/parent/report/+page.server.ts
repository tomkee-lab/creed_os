import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';

export const load: PageServerLoad = async ({ locals, url }) => {
  const learnerId = locals.user ? resolveLearnerId(locals.user) : null;
  if (!learnerId) {
    throw error(404, 'No bound learner profile found for this account');
  }

  const profile = coreRepository.getLearnerProfile(learnerId);
  const rawReports = coreRepository.getBenchmarkReports(learnerId);
  const selectedDomain = (url.searchParams.get('domain') || 'stem') as 'stem' | 'english' | 'robotics';
  const rawActiveReport = coreRepository.getBenchmarkReport(learnerId, selectedDomain) || rawReports[0] || null;

  // Enforce zero psychometric leaks on wire: purge raw theta and SE parameters from client hydration payload
  const sanitizeReport = (report: any) => {
    if (!report) return null;
    const { theta, se, ...safe } = report;
    return safe;
  };

  const sanitizeLearner = (learner: any) => {
    if (!learner) return null;
    const { competencies, recentEvidence, ...safe } = learner;
    return safe;
  };

  return {
    learner: sanitizeLearner(profile),
    reports: rawReports.map(sanitizeReport),
    activeReport: sanitizeReport(rawActiveReport),
    selectedDomain
  };
};
