import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import { toParentBenchmarkReportDTO, deepSanitizePsychometrics } from '$lib/server/psychometricDto';

export const load: PageServerLoad = async ({ locals, url }) => {
  const learnerId = locals.user ? resolveLearnerId(locals.user) : null;
  if (!learnerId) {
    throw error(404, 'No bound learner profile found for this account');
  }

  const profile = coreRepository.getLearnerProfile(learnerId);
  const rawReports = coreRepository.getBenchmarkReports(learnerId);
  const selectedDomain = (url.searchParams.get('domain') || 'stem') as 'stem' | 'english' | 'robotics';
  const rawActiveReport = coreRepository.getBenchmarkReport(learnerId, selectedDomain) || rawReports[0] || null;

  // Enforce zero psychometric leaks on wire: construct role-specific allowlist DTOs (theta and SE physically excluded)
  const sanitizeLearner = (learner: any) => {
    if (!learner) return null;
    const { competencies, recentEvidence, ...safe } = learner;
    return safe;
  };

  const safeReports = rawReports
    .map(toParentBenchmarkReportDTO)
    .filter(Boolean)
    .map((r) => deepSanitizePsychometrics(r));

  const safeActiveReport = deepSanitizePsychometrics(toParentBenchmarkReportDTO(rawActiveReport));

  return {
    learner: sanitizeLearner(profile),
    reports: safeReports,
    activeReport: safeActiveReport,
    selectedDomain
  };
};
