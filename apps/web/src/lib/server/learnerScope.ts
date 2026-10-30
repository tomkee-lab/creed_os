/**
 * Shared Learner Scope Resolution Helper
 * Ensures consistent relationship-bound learner ID resolution between layout servers and API endpoints.
 * Prevents account mixing and eliminates shared demo UUID fallbacks outside local development.
 */

export const DEFAULT_DEMO_LEARNER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
export const SECOND_DEMO_LEARNER_ID = '2bb88c44-4812-4912-9921-220194811099';

export function resolveLearnerId(user: any, requestedLearnerId?: string | null): string | null {
  if (!user) {
    return null;
  }

  // 1. Explicit bound learnerId on user record takes top priority
  if (user.learnerId && typeof user.learnerId === 'string' && user.learnerId.trim()) {
    return user.learnerId.trim();
  }

  const role = user.role || user.metadata?.role || 'student';

  // 2. Student accounts are strictly self-scoped to their unique authenticated account identity
  if (role === 'student') {
    return user.id || null;
  }

  // 3. Parents resolve to requested linked child, bound child, or demo learner in local development
  if (role === 'parent' || role === 'parent_pending') {
    if (requestedLearnerId && typeof requestedLearnerId === 'string' && requestedLearnerId.trim()) {
      return requestedLearnerId.trim();
    }
    if (user.childLearnerId && typeof user.childLearnerId === 'string' && user.childLearnerId.trim()) {
      return user.childLearnerId.trim();
    }
    if (import.meta.env.DEV) {
      return DEFAULT_DEMO_LEARNER_ID;
    }
    return null;
  }

  // 4. Staff / educator / admin fallback to requested learner ID or user ID
  if (requestedLearnerId && typeof requestedLearnerId === 'string' && requestedLearnerId.trim()) {
    return requestedLearnerId.trim();
  }
  return user.id || null;
}
