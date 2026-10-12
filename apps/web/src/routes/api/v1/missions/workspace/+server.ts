import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';

export const GET: RequestHandler = async ({ url, locals }) => {
  const missionId = url.searchParams.get('missionId') || 'robotics_default';
  
  // Resolve learner or development/guest fallback
  let learnerId = 'guest_learner';
  if (locals.user) {
    const bound = resolveLearnerId(locals.user);
    if (bound) learnerId = bound;
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
  try {
    const body = await request.json();
    const {
      missionId = 'robotics_default',
      workspace,
      stage = 'primary',
      code = '',
      evaluation = null
    } = body;

    let learnerId = 'guest_learner';
    if (locals.user) {
      const bound = resolveLearnerId(locals.user);
      if (bound) learnerId = bound;
    }

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
      message: 'Workspace autosaved to cloud ledger successfully.'
    });
  } catch (err: any) {
    return json({ error: err?.message || 'Failed to save workspace' }, { status: 500 });
  }
};
