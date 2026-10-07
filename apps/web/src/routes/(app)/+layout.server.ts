import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // Server-side route protection
  // In development, provide high-fidelity local session if not logged into live database
  const user = locals.user ?? (import.meta.env.DEV ? {
    id: 'usr_anaya_verma',
    name: 'Anaya Verma',
    email: 'anaya.verma@example.edu',
    role: 'student'
  } : null);

  if (!user) {
    throw redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
  }

  const learner = coreRepository.getLearnerProfile('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  const evidence = coreRepository.getLearnerEvidence(learner.id);
  const pathways = coreRepository.getPathways();
  const cohort = coreRepository.getClassCohort();

  return {
    user,
    session: locals.session,
    learner,
    evidence,
    pathways,
    cohort
  };
};
