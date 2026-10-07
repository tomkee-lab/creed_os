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

  const userRole = (user as any).role || 'student';

  // Role access enforcement:
  // Non-privileged users (students, parents) cannot access staff or administrative workspaces
  if (!import.meta.env.DEV) {
    if (requestedRole === 'admin' && userRole !== 'admin') {
      throw error(403, 'Forbidden: Administrative privilege required');
    }
    if ((requestedRole === 'teacher' || requestedRole === 'counselor') && !['teacher', 'counselor', 'admin'].includes(userRole)) {
      throw error(403, 'Forbidden: Educator or counselor credential required');
    }
  }

  // Scope data based on authenticated role and relationship
  const scopedLearnerId = (user as any).learnerId || '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  const learner = coreRepository.getLearnerProfile(scopedLearnerId);
  const evidence = coreRepository.getLearnerEvidence(learner.id);
  const pathways = coreRepository.getPathways();

  // Cohort analytics scoped strictly to educator/admin roles
  const isEducatorOrAdmin = ['teacher', 'counselor', 'admin', 'studio'].includes(requestedRole);
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
