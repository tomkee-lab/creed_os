import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import { selectNextAdaptiveItem } from '@core-os/assessment';
import type { ClientAssessmentItem } from '@core-os/domain';

export const POST: RequestHandler = async ({ request, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const user = locals.user;
    const userRole = (user as any).role || (user as any).metadata?.role || 'student';
    const boundLearnerId = resolveLearnerId(user);

    // 2. Authorize learner relationship (Child privacy)
    if (['student', 'parent'].includes(userRole) && !boundLearnerId) {
      return json({ error: 'Forbidden: No learner profile bound to this account' }, { status: 403 });
    }

    const effectiveLearnerId = ['student', 'parent'].includes(userRole)
      ? boundLearnerId!
      : (body.learnerId || boundLearnerId);

    if (!effectiveLearnerId) {
      return json({ error: 'Bad Request: Valid learner ID required' }, { status: 400 });
    }

    const domain = body.domain || 'stem';
    const mode: 'rapid' | 'benchmark' | 'diagnostic' =
      body.mode === 'rapid'
        ? 'rapid'
        : (body.mode === 'benchmark' || body.benchmark === true)
        ? 'benchmark'
        : 'diagnostic';

    const isBenchmarkMode = mode === 'benchmark';
    const isRapidMode = mode === 'rapid';
    const maxItems = isBenchmarkMode ? 30 : (isRapidMode ? 8 : 12);
    const minItems = isBenchmarkMode ? 10 : (isRapidMode ? 4 : 5);
    const targetSE = isBenchmarkMode ? 0.22 : (isRapidMode ? 0.38 : 0.32);

    const session = coreRepository.createAssessmentSession(effectiveLearnerId, domain, mode);
    const pool = coreRepository.getItemsByDomain(domain);

    // Select initial item at θ = 0.0
    const selection = selectNextAdaptiveItem(
      pool,
      { currentTheta: 0.0, administeredItemIds: [] },
      { minItems, maxItems, targetSE, currentSE: 1.0 }
    );

    if (!selection.selectedItem) {
      return json({ error: 'Failed to select initial diagnostic item' }, { status: 500 });
    }

    const firstItemSafe: ClientAssessmentItem = {
      id: selection.selectedItem.id,
      competency: selection.selectedItem.competency,
      code: selection.selectedItem.code,
      prompt: selection.selectedItem.prompt,
      stimulusUrl: selection.selectedItem.stimulusUrl,
      options: selection.selectedItem.options
    };

    return json({
      sessionId: session.id,
      status: session.status,
      domain: session.domain,
      currentTheta: session.currentTheta,
      standardError: session.standardError,
      itemsAnswered: 0,
      firstItem: firstItemSafe
    }, { status: 201 });
  } catch (err: any) {
    return json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
};
