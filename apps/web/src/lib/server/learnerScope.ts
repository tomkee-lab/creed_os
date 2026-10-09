/**
 * Shared Learner Scope Resolution Helper
 * Ensures consistent relationship-bound learner ID resolution between layout servers and API endpoints.
 */

export const DEFAULT_DEMO_LEARNER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

export function resolveLearnerId(user: any, fallbackId: string = DEFAULT_DEMO_LEARNER_ID): string {
  if (!user) {
    return fallbackId;
  }

  // 1. Explicit bound learnerId on user record takes top priority
  if (user.learnerId && typeof user.learnerId === 'string') {
    return user.learnerId;
  }

  const role = user.role || user.metadata?.role || 'student';

  // 2. Student accounts are self-scoped to their unique authenticated account identity
  if (role === 'student') {
    return user.id || fallbackId;
  }

  // 3. Verified parents resolve to their bound child learner ID (or fallback demo child in evaluation mode)
  if (role === 'parent' || role === 'parent_pending') {
    return user.childLearnerId || fallbackId;
  }

  // 4. Staff / educator / admin fallback to user ID
  return user.id || fallbackId;
}
