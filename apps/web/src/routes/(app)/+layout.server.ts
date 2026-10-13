import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
  const currentPath = url.pathname;
  const user = locals.user;

  if (!user) {
    throw redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
  }

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
    ? 'student'
    : 'student';

  const userRole = (user as any).role || (user as any).metadata?.role || 'student';
  const isDevLoopback = import.meta.env.DEV && (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
  const effectiveRole = (isDevLoopback && requestedRole) ? requestedRole : userRole;

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

  const sanitizeEvidenceItem = (ev: any) => {
    if (!ev) return ev;
    if (ev.observedValue && typeof ev.observedValue === 'object') {
      const { theta, standardError, se, ...safeObserved } = ev.observedValue;
      return { ...ev, observedValue: safeObserved };
    }
    return ev;
  };

  const scopedLearnerId = resolveLearnerId(user);

  const rawLearner = isStudentOrParentRoute && isVerifiedAccess && scopedLearnerId
    ? coreRepository.getLearnerProfile(scopedLearnerId, user)
    : null;

  // Bifurcated Paradigm Security: Purge raw psychometric parameters (theta, standardError) from student/parent wire payload
  const learner = rawLearner ? {
    ...rawLearner,
    recentEvidence: (rawLearner.recentEvidence || []).map(sanitizeEvidenceItem),
    competencies: Object.fromEntries(
      Object.entries(rawLearner.competencies || {}).map(([key, comp]: [string, any]) => {
        const { theta, standardError, ...safeComp } = comp;
        return [key, safeComp];
      })
    )
  } : null;
  const rawEvidence = isStudentOrParentRoute && isVerifiedAccess && learner
    ? coreRepository.getLearnerEvidence(learner.id)
    : null;
  const evidence = rawEvidence ? rawEvidence.map(sanitizeEvidenceItem) : null;
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
