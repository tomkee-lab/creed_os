import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user ?? (import.meta.env.DEV ? { role: 'admin' } : null);

  // Enforce administrative role verification before returning full consent ledger
  if (!import.meta.env.DEV && (user as any)?.role !== 'admin') {
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
