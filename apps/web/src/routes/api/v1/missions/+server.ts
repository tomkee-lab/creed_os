import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';

export const GET: RequestHandler = async ({ url }) => {
  const stage = url.searchParams.get('stage') || undefined;
  const domain = url.searchParams.get('domain') || undefined;

  const missions = coreRepository.getMissions(stage, domain);

  return json({
    success: true,
    total: missions.length,
    missions
  });
};
