import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  const role = (user as any)?.role || (user as any)?.metadata?.role;

  // Enforce administrative role verification before returning full consent ledger
  if (!user || role !== 'admin') {
    throw error(403, 'Forbidden: Administrative privilege required to view institutional consent ledger');
  }

  const overview = coreRepository.getSchoolOverview();
  const consentLedger = coreRepository.getConsentLedger();
  const teacherRoster = coreRepository.getTeacherRoster();
  const pathwayMetrics = coreRepository.getSchoolPathwayDistribution();

  return {
    overview,
    consentLedger,
    teacherRoster,
    pathwayMetrics
  };
};
