import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import {
  toStudentBenchmarkReportDTO,
  toSafeLearnerProfileDTO,
  deepSanitizePsychometrics
} from '$lib/server/psychometricDto';

export const load: PageServerLoad = async ({ locals, url }) => {
  const learnerId = locals.user ? resolveLearnerId(locals.user) : null;
  if (!learnerId) {
    throw error(404, 'No bound learner profile found for this student account');
  }

  const profile = coreRepository.getLearnerProfile(learnerId);
  const rawReports = coreRepository.getBenchmarkReports(learnerId);
  const selectedDomain = (url.searchParams.get('domain') || 'stem') as 'stem' | 'english' | 'robotics';
  const rawActiveReport = coreRepository.getBenchmarkReport(learnerId, selectedDomain) || rawReports[0] || null;

  const safeLearner = profile
    ? deepSanitizePsychometrics(toSafeLearnerProfileDTO(profile))
    : null;

  const safeReports = rawReports
    .map((r) => toStudentBenchmarkReportDTO(r))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => deepSanitizePsychometrics(r));

  const safeActiveReport = deepSanitizePsychometrics(toStudentBenchmarkReportDTO(rawActiveReport));

  return {
    learner: safeLearner,
    reports: safeReports,
    activeReport: safeActiveReport,
    selectedDomain
  };
};
