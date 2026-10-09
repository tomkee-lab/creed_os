import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
  const currentPath = url.pathname;
  const user = locals.user;

  if (!user) {
    throw redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
  }

  const userRole = (user as any).role || (user as any).metadata?.role || 'student';
  const hasVerifiedConsent = cookies.get('creed_consent_verified') === 'true';
  const effectiveRole = (userRole === 'parent_pending' && hasVerifiedConsent) ? 'parent' : userRole;

  const isUtilityRoute = currentPath.startsWith('/settings') || currentPath.startsWith('/help');
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
    ? (['admin', 'teacher', 'counselor', 'parent', 'studio'].includes(effectiveRole) ? effectiveRole : 'student')
    : 'student';

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
  if ((requestedRole === 'teacher' || requestedRole === 'counselor') && !['teacher', 'counselor', 'admin'].includes(effectiveRole)) {
    throw error(403, 'Forbidden: Educator or counselor credential required');
  }
  if (requestedRole === 'studio' && !['studio', 'admin', 'teacher'].includes(effectiveRole)) {
    throw error(403, 'Forbidden: Item calibration credentials required');
  }
  if (requestedRole === 'parent' && !['parent', 'admin'].includes(effectiveRole)) {
    throw error(403, 'Forbidden: Guardian relationship credential required');
  }

  // Scope data based on authenticated role and relationship
  // Minor learner details and evidence are strictly isolated to verified student and authorized guardian views
  const isStudentOrParentRoute = ['student', 'parent'].includes(requestedRole);
  const isVerifiedAccess =
    (requestedRole === 'student' && ['student', 'parent', 'teacher', 'counselor', 'admin'].includes(effectiveRole)) ||
    (requestedRole === 'parent' && ['parent', 'admin'].includes(effectiveRole));

  const scopedLearnerId = (user as any).learnerId || (['student', 'parent'].includes(effectiveRole) ? (user as any).id || '3fa85f64-5717-4562-b3fc-2c963f66afa6' : (user as any).id);

  const learner = isStudentOrParentRoute && isVerifiedAccess && scopedLearnerId
    ? coreRepository.getLearnerProfile(scopedLearnerId, user)
    : null;
  const evidence = isStudentOrParentRoute && isVerifiedAccess && learner
    ? coreRepository.getLearnerEvidence(learner.id)
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
    cohort
  };
};
