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
    const effectiveLearnerId = ['student', 'parent'].includes(userRole)
      ? boundLearnerId
      : (body.learnerId || boundLearnerId);

    const domain = body.domain || 'stem_reasoning';

    const session = coreRepository.createAssessmentSession(effectiveLearnerId, domain);
    const pool = coreRepository.getItemBank();

    // Select initial item at θ = 0.0
    const selection = selectNextAdaptiveItem(
      pool,
      { currentTheta: 0.0, administeredItemIds: [] },
      { minItems: 4, maxItems: 8, targetSE: 0.35, currentSE: 1.0 }
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
