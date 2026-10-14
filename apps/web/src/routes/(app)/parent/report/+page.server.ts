import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import { toParentBenchmarkReportDTO, deepSanitizePsychometrics } from '$lib/server/psychometricDto';
import type { BenchmarkGatingOptions } from '$lib/types/psychometricDto';

export const load: PageServerLoad = async ({ locals, url }) => {
  const user = locals.user;
  const userRole = (user as any)?.role || (user as any)?.metadata?.role || 'student';
  const boundLearnerId = user ? resolveLearnerId(user) : null;

  if (!boundLearnerId) {
    throw error(404, 'No bound learner profile found for this account');
  }

  // Cross-learner unauthorized read must be blocked with 403 Forbidden
  const requestedLearnerId = url.searchParams.get('learnerId');
  if (requestedLearnerId && requestedLearnerId !== boundLearnerId) {
    throw error(403, 'Forbidden: Guardians are restricted to their verified child profile.');
  }

  const learnerId = boundLearnerId;

  const userId = (user as any)?.id || (user as any)?.sub || '';

  // Authoritative server-side identity & relationship validation:
  // Requires authenticated parent role (administrators are strictly excluded from guardian status),
  // and an active statutory consent record bound to this authenticated guardian identity.
  const isVerifiedGuardian =
    userRole === 'parent' &&
    userRole !== 'parent_pending' &&
    coreRepository.isVerifiedGuardianForLearner(userId, learnerId);

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

  // Authoritative server-side policy options:
  // In pre-Gate 4 baseline, enableGate4Outputs remains false.
  // isVerifiedGuardian is derived strictly from server-side policy.
  const gatingOptions: BenchmarkGatingOptions = {
    enableGate4Outputs: false,
    isVerifiedGuardian
  };

  const safeReports = rawReports
    .map((r) => toParentBenchmarkReportDTO(r, gatingOptions))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => deepSanitizePsychometrics(r));

  const safeActiveReport = deepSanitizePsychometrics(toParentBenchmarkReportDTO(rawActiveReport, gatingOptions));

  return {
    learner: sanitizeLearner(profile),
    reports: safeReports,
    activeReport: safeActiveReport,
    selectedDomain
  };
};
