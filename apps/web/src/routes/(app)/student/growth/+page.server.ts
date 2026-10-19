import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId, DEFAULT_DEMO_LEARNER_ID } from '$lib/server/learnerScope';
import {
  toStudentBenchmarkReportDTO,
  toSafeLearnerProfileDTO,
  deepSanitizePsychometrics
} from '$lib/server/psychometricDto';
import { toSafeEvidenceView, sanitizeForPersona } from '@core-os/domain';

export const load: PageServerLoad = async ({ locals, url }) => {
  const user = locals.user;
  const userRole = (user as any)?.role || (user as any)?.metadata?.role || 'student';
  const boundLearnerId = user ? resolveLearnerId(user) : null;

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
  const rawEvidence = coreRepository.getEvidence(learnerId);
  const pathways = coreRepository.getPathways();

  const safeLearner = profile
    ? deepSanitizePsychometrics(toSafeLearnerProfileDTO(profile))
    : null;

  const safeReports = rawReports
    .map((r) => toStudentBenchmarkReportDTO(r))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => deepSanitizePsychometrics(r));

  const safeEvidence = (rawEvidence || []).map((ev) =>
    sanitizeForPersona(toSafeEvidenceView(ev), 'student')
  );

  return {
    learner: safeLearner,
    reports: safeReports,
    evidence: safeEvidence,
    pathways
  };
};
