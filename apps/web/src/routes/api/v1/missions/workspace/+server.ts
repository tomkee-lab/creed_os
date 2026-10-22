import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.session && !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const missionId = url.searchParams.get('missionId') || 'robotics_default';
  const learnerId = (locals.user && resolveLearnerId(locals.user)) || locals.user?.id || locals.session?.id;

  if (!learnerId) {
    return json({ error: 'Unauthorized: Valid account identifier required' }, { status: 401 });
  }

  const key = `${learnerId}:${missionId}`;
  const data = coreRepository.getWorkspace(key);

  return json({
    success: true,
    key,
    learnerId,
    missionId,
    workspace: data?.workspace || null,
    stage: data?.stage || 'primary',
    code: data?.code || null,
    evaluation: data?.evaluation || null,
    updatedAt: data?.updatedAt || null
  });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.session && !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const learnerId = (locals.user && resolveLearnerId(locals.user)) || locals.user?.id || locals.session?.id;
  if (!learnerId) {
    return json({ error: 'Unauthorized: Valid account identifier required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      missionId = 'robotics_default',
      workspace,
      stage = 'primary',
      code = '',
      evaluation = null
    } = body;

    const key = `${learnerId}:${missionId}`;
    const saved = coreRepository.saveWorkspace(key, {
      workspace,
      stage,
      code,
      evaluation
    });

    return json({
      success: true,
      key,
      learnerId,
      missionId,
      savedAt: saved.updatedAt,
      message: 'Workspace progress saved successfully.'
    });
  } catch (err: any) {
    return json({ error: err?.message || 'Failed to save workspace' }, { status: 500 });
  }
};
