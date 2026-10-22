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
  } else if (userRole === 'parent') {
    const guardianId = (user as any)?.id || (user as any)?.sub || 'parent_1';

    let linkedLearners: string[] = [];
    if ('getLinkedLearnerIdsFromDb' in coreRepository) {
      linkedLearners = await (coreRepository as any).getLinkedLearnerIdsFromDb(guardianId);
    } else {
      linkedLearners = coreRepository.getLinkedLearnerIds(guardianId);
    }

    if (linkedLearners.length === 0 && import.meta.env.DEV) {
      linkedLearners = coreRepository.getLinkedLearnerIds('parent_1');
    }

    const requestedParam = url.searchParams.get('learnerId');
    let targetLearnerId: string | null = null;

    if (requestedParam) {
      targetLearnerId = requestedParam;
    } else if (boundLearnerId && !boundLearnerId.startsWith('usr_') && linkedLearners.includes(boundLearnerId)) {
      targetLearnerId = boundLearnerId;
    } else if (linkedLearners.length > 0) {
      targetLearnerId = linkedLearners[0];
    } else if (import.meta.env.DEV) {
      targetLearnerId = DEFAULT_DEMO_LEARNER_ID;
    }

    const isAuthorized =
      targetLearnerId &&
      (linkedLearners.includes(targetLearnerId) ||
       coreRepository.isGuardianLinkedToLearner(guardianId, targetLearnerId) ||
       (import.meta.env.DEV && targetLearnerId === DEFAULT_DEMO_LEARNER_ID));

    if (!targetLearnerId || !isAuthorized) {
      throw error(403, 'Forbidden: Guardian unauthorized for this learner');
    }
    learnerId = targetLearnerId;
  } else {
    learnerId = url.searchParams.get('learnerId') || (boundLearnerId && !boundLearnerId.startsWith('usr_') ? boundLearnerId : (import.meta.env.DEV ? DEFAULT_DEMO_LEARNER_ID : null));
  }

  if (!learnerId) {
    if (import.meta.env.DEV) {
      learnerId = DEFAULT_DEMO_LEARNER_ID;
    } else {
      throw error(400, 'Bad Request: Missing required learnerId identifier');
    }
  }

  let profile = coreRepository.getLearnerProfile(learnerId);
  if (!profile && 'getLearnerProfileFromDb' in coreRepository) {
    profile = await (coreRepository as any).getLearnerProfileFromDb(learnerId);
  }
  if (!profile && userRole !== 'student') {
    profile = coreRepository.getLearnerProfile(DEFAULT_DEMO_LEARNER_ID);
  }
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
