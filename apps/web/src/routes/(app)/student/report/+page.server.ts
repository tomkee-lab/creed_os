import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId, DEFAULT_DEMO_LEARNER_ID } from '$lib/server/learnerScope';
import {
  toStudentBenchmarkReportDTO,
  toSafeLearnerProfileDTO,
  deepSanitizePsychometrics
} from '$lib/server/psychometricDto';

export const load: PageServerLoad = async ({ locals, url }) => {
  const user = locals.user;
  const userRole = (user as any)?.role || (user as any)?.metadata?.role || 'student';
  const boundLearnerId = user ? resolveLearnerId(user) : null;

  // Authoritative role scoping:
  // Students are strictly self-isolated to their own learner profile (DPDP child privacy).
  // Staff/educators (teachers, counselors, admins) may inspect requested learners or preview demo learner diagnostics.
  let learnerId: string | null = null;

  if (userRole === 'student') {
    learnerId = boundLearnerId;
    const requestedLearnerId = url.searchParams.get('learnerId');
    if (requestedLearnerId && requestedLearnerId !== boundLearnerId && (!import.meta.env.DEV || requestedLearnerId !== DEFAULT_DEMO_LEARNER_ID)) {
      throw error(403, 'Forbidden: Students are restricted strictly to their own learner profile.');
    }
  } else {
    learnerId = url.searchParams.get('learnerId') || (boundLearnerId && !boundLearnerId.startsWith('usr_') ? boundLearnerId : DEFAULT_DEMO_LEARNER_ID);
  }

  if (!learnerId) {
    learnerId = DEFAULT_DEMO_LEARNER_ID;
  }

  const profile = coreRepository.getLearnerProfile(learnerId) || (userRole !== 'student' ? coreRepository.getLearnerProfile(DEFAULT_DEMO_LEARNER_ID) : null);
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

  const safeActiveReport = rawActiveReport
    ? deepSanitizePsychometrics(toStudentBenchmarkReportDTO(rawActiveReport))
    : null;

  return {
    learner: safeLearner,
    reports: safeReports,
    activeReport: safeActiveReport,
    selectedDomain
  };
};
