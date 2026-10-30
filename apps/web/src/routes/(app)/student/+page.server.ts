import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(303, '/login?next=/student');
  }

  const role = (user as any)?.role || (user as any)?.metadata?.role;

  if (role === 'parent_pending') {
    throw redirect(303, '/consent');
  }

  const learnerId = resolveLearnerId(user);
  const hasActiveConsent = learnerId ? coreRepository.hasActiveConsent(learnerId) : false;
  const consentRecord = learnerId ? coreRepository.getConsentRecord(learnerId) : undefined;

  return {
    hasActiveConsent,
    consentStatus: consentRecord?.status || (hasActiveConsent ? 'VERIFIED_ACTIVE' : 'PENDING_PARENTAL_NOTICE')
  };
};
