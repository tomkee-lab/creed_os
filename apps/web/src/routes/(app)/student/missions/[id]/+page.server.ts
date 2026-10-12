import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.session || !locals.user) {
    throw redirect(303, `/login?next=/student/missions/${params.id}`);
  }

  const { id } = params;
  const mission = coreRepository.getMissionById(id);

  if (!mission) {
    throw error(404, `Mission '${id}' not found in curriculum catalog.`);
  }

  const allMissions = coreRepository.getMissions();

  return {
    mission,
    allMissions
  };
};
