import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import { toSafeLearnerProfileDTO, toSafeEvidenceDTO, deepSanitizePsychometrics } from '$lib/server/psychometricDto';

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
  const currentPath = url.pathname;
  let user = locals.user;

  if (!user) {
    if (currentPath.startsWith('/help') || currentPath.startsWith('/ide')) {
      user = { id: 'guest', name: 'Guest Explorer', email: 'guest@core-os.app', role: 'student' } as any;
    } else {
      throw redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
    }
  }

  const isUtilityRoute = currentPath.startsWith('/settings') || currentPath.startsWith('/help') || currentPath.startsWith('/ide');
  const requestedRole = currentPath.startsWith('/admin')
    ? 'admin'
    : currentPath.startsWith('/teacher')
    ? 'teacher'
    : currentPath.startsWith('/counselor')
    ? 'counselor'
    : currentPath.startsWith('/parent')
    ? 'parent'
    : currentPath.startsWith('/studio') || currentPath.startsWith('/author')
    ? 'studio'
    : isUtilityRoute
    ? 'student'
    : 'student';

  const userRole = (user as any).role || (user as any).metadata?.role || 'student';
  const effectiveRole = userRole;

  // Role access enforcement:
  // Non-privileged users cannot access staff, guardian, or administrative workspaces
  if (effectiveRole === 'parent_pending') {
    if (requestedRole === 'parent' || requestedRole === 'student') {
      throw redirect(303, '/consent');
    }
  }

  if (effectiveRole.endsWith('_pending')) {
    throw error(403, 'Forbidden: Account pending institutional verification. An administrator must approve credentials before accessing workspaces.');
  }

  // Authoritative RBAC validation
  if (requestedRole === 'admin' && effectiveRole !== 'admin') {
    throw error(403, 'Forbidden: Administrative privilege required');
  }
  if (requestedRole === 'teacher' && !['teacher', 'admin'].includes(effectiveRole)) {
    throw error(403, 'Forbidden: Educator credential required');
  }
  if (requestedRole === 'counselor' && !['counselor', 'admin'].includes(effectiveRole)) {
    throw error(403, 'Forbidden: Counselor credential required');
  }
  if (requestedRole === 'studio' && !['studio', 'admin', 'teacher'].includes(effectiveRole)) {
    throw error(403, 'Forbidden: Item calibration credentials required');
  }
  if (requestedRole === 'parent' && !['parent', 'admin'].includes(effectiveRole)) {
    throw error(403, 'Forbidden: Guardian relationship credential required');
  }

  // Scope data based on authenticated role and relationship
  // Minor learner details and evidence are strictly isolated to verified student and authorized guardian views
  const isStudentOrParentRoute = !isUtilityRoute && ['student', 'parent'].includes(requestedRole);
  const isVerifiedAccess =
    !isUtilityRoute &&
    ((requestedRole === 'student' && ['student', 'parent', 'teacher', 'counselor', 'admin'].includes(effectiveRole)) ||
    (requestedRole === 'parent' && ['parent', 'admin'].includes(effectiveRole)));

  const requestedLearnerId = url.searchParams.get('learnerId') || cookies.get('creed_active_learner');
  if (url.searchParams.has('learnerId') && requestedRole === 'parent') {
    cookies.set('creed_active_learner', url.searchParams.get('learnerId')!, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30
    });
  }

  const scopedLearnerId = resolveLearnerId(user, requestedLearnerId);

  let rawLearner = isStudentOrParentRoute && isVerifiedAccess && scopedLearnerId
    ? coreRepository.getLearnerProfile(scopedLearnerId, user)
    : null;
  if (!rawLearner && isStudentOrParentRoute && isVerifiedAccess && scopedLearnerId && 'getLearnerProfileFromDb' in coreRepository) {
    rawLearner = await (coreRepository as any).getLearnerProfileFromDb(scopedLearnerId);
  }

  // Bifurcated Paradigm Security: Construct role-specific allowlist DTO (zero psychometrics on student/parent wire)
  const learner = rawLearner
    ? deepSanitizePsychometrics(toSafeLearnerProfileDTO(rawLearner))
    : null;

  // Resolve all authorized linked children for verified guardian workspace
  const guardianId = (user as any)?.id || 'parent_1';
  const rawLinked = requestedRole === 'parent' && isVerifiedAccess && 'getLinkedLearners' in coreRepository
    ? (coreRepository as any).getLinkedLearners(guardianId)
    : [];
  const linkedLearners = rawLinked.map(toSafeLearnerProfileDTO).map(deepSanitizePsychometrics);

  const rawEvidence = isStudentOrParentRoute && isVerifiedAccess && learner
    ? coreRepository.getLearnerEvidence(learner.id)
    : null;

  const evidence = rawEvidence
    ? deepSanitizePsychometrics(rawEvidence.map(toSafeEvidenceDTO))
    : null;

  const pathways = isStudentOrParentRoute && isVerifiedAccess
    ? coreRepository.getPathways()
    : null;

  // Cohort analytics scoped strictly to verified educator/admin roles
  const isEducatorOrAdmin = ['teacher', 'counselor', 'admin', 'studio'].includes(requestedRole) &&
    ['teacher', 'counselor', 'admin', 'studio'].includes(effectiveRole) &&
    !effectiveRole.endsWith('_pending');
  const cohort = isEducatorOrAdmin ? coreRepository.getClassCohort() : null;

  return {
    user: {
      ...user,
      role: effectiveRole
    },
    session: locals.session,
    activeRole: requestedRole,
    learner,
    evidence,
    pathways,
    cohort,
    linkedLearners
  };
};
