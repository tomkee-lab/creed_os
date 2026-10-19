import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async () => {
  const rawCohort = coreRepository.getClassCohort();
  const sampleReports = coreRepository.getBenchmarkReports('3fa85f64-5717-4562-b3fc-2c963f66afa6');

  // Compute live per-learner DPDP statutory consent status
  const students = (rawCohort.students || []).map((s) => ({
    ...s,
    hasConsent: coreRepository.hasActiveConsent(s.id)
  }));

  const verifiedCount = students.filter((s) => s.hasConsent).length;
  const consentRate = students.length > 0 ? Math.round((verifiedCount / students.length) * 100) : 100;

  const cohort = {
    ...rawCohort,
    students,
    verifiedCount,
    consentRate
  };

  return {
    cohort,
    sampleReports
  };
};
