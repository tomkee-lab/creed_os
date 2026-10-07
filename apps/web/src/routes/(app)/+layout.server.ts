import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const currentPath = url.pathname;
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
    : 'student';

  // In development, calibrate high-fidelity user to the requested workspace role if unauthenticated
  const user = locals.user ?? (import.meta.env.DEV ? {
    id: `usr_${requestedRole}`,
    name: requestedRole === 'student' ? 'Anaya Verma' : requestedRole === 'parent' ? 'Sunita Verma' : requestedRole === 'teacher' ? 'Rajesh Kumar' : 'DPIS Administrator',
    email: `${requestedRole}@example.edu`,
    role: requestedRole
  } : null);

  if (!user) {
    throw redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
  }

  const userRole = (user as any).role || (user as any).metadata?.role || 'student';

  // Role access enforcement:
  // Non-privileged users cannot access staff, guardian, or administrative workspaces
  if (userRole === 'parent_pending' && requestedRole === 'parent') {
    throw redirect(303, '/consent');
  }

  if (userRole.endsWith('_pending')) {
    throw error(403, 'Forbidden: Account pending institutional verification. An administrator must approve credentials before accessing workspaces.');
  }

  if (!import.meta.env.DEV) {
    if (requestedRole === 'admin' && userRole !== 'admin') {
      throw error(403, 'Forbidden: Administrative privilege required');
    }
    if ((requestedRole === 'teacher' || requestedRole === 'counselor') && !['teacher', 'counselor', 'admin'].includes(userRole)) {
      throw error(403, 'Forbidden: Educator or counselor credential required');
    }
    if (requestedRole === 'studio' && !['studio', 'admin', 'teacher'].includes(userRole)) {
      throw error(403, 'Forbidden: Item calibration credentials required');
    }
    if (requestedRole === 'parent' && !['parent', 'admin'].includes(userRole)) {
      throw error(403, 'Forbidden: Guardian relationship credential required');
    }
  }

  // Scope data based on authenticated role and relationship
  // Minor learner details and evidence are strictly isolated to verified student and authorized guardian views
  const isStudentOrParentRoute = ['student', 'parent'].includes(requestedRole);
  const isVerifiedAccess =
    import.meta.env.DEV ||
    (requestedRole === 'student' && userRole === 'student') ||
    (requestedRole === 'parent' && ['parent', 'admin'].includes(userRole));

  const scopedLearnerId = (user as any).learnerId || (import.meta.env.DEV ? '3fa85f64-5717-4562-b3fc-2c963f66afa6' : (user as any).id);

  const learner = isStudentOrParentRoute && isVerifiedAccess && scopedLearnerId
    ? coreRepository.getLearnerProfile(scopedLearnerId)
    : null;
  const evidence = isStudentOrParentRoute && isVerifiedAccess && learner
    ? coreRepository.getLearnerEvidence(learner.id)
    : null;
  const pathways = isStudentOrParentRoute && isVerifiedAccess
    ? coreRepository.getPathways()
    : null;

  // Cohort analytics scoped strictly to verified educator/admin roles
  const isEducatorOrAdmin = ['teacher', 'counselor', 'admin', 'studio'].includes(requestedRole) &&
    (import.meta.env.DEV || ['teacher', 'counselor', 'admin', 'studio'].includes(userRole)) &&
    !userRole.endsWith('_pending');
  const cohort = isEducatorOrAdmin ? coreRepository.getClassCohort() : null;

  return {
    user,
    session: locals.session,
    activeRole: requestedRole,
    learner,
    evidence,
    pathways,
    cohort
  };
};
