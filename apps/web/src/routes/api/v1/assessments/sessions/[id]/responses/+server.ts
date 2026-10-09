import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import {
  evaluateItemResponse,
  estimateThetaEAP,
  selectNextAdaptiveItem
} from '@core-os/assessment';
import type { ClientAssessmentItem, LearnerEvidence } from '@core-os/domain';

export const POST: RequestHandler = async ({ params, request, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  try {
    const sessionId = params.id;
    const session = coreRepository.getAssessmentSession(sessionId);

    if (!session) {
      return json({ error: 'Assessment session not found' }, { status: 404 });
    }

    // 2. Authorize session ownership (Prevent student response injection into other learners)
    const user = locals.user;
    const userRole = (user as any).role || (user as any).metadata?.role || 'student';
    const boundLearnerId = (user as any).learnerId || (['student', 'parent'].includes(userRole) ? '3fa85f64-5717-4562-b3fc-2c963f66afa6' : (user as any).id);

    if (userRole === 'student' && session.learnerId !== boundLearnerId) {
      return json({ error: 'Forbidden: You cannot submit responses to an assessment session belonging to another learner.' }, { status: 403 });
    }

    if (session.status === 'completed') {
      return json({ error: 'Session is already completed' }, { status: 400 });
    }

    const body = await request.json();
    const { itemId, selectedOptionId, timeSpentSeconds = 15 } = body;

    const item = coreRepository.getItemById(itemId);
    if (!item) {
      return json({ error: 'Item not found in bank' }, { status: 404 });
    }

    // 1. Deterministic Scoring & Misconception Diagnosis
    const evalResult = evaluateItemResponse(item, selectedOptionId);

    // 2. Update psychometric history
    const historyItem = {
      params: item.irt,
      isCorrect: evalResult.isCorrect
    };

    const updatedHistory = [
      ...session.history.map((h) => {
        const itemObj = coreRepository.getItemById(h.itemId);
        return {
          params: itemObj ? itemObj.irt : { a: 1.0, b: 0.0, c: 0.25 },
          isCorrect: h.isCorrect
        };
      }),
      historyItem
    ];

    // 3. EAP Numerical Quadrature Ability Recalculation
    const eapResult = estimateThetaEAP(updatedHistory);

    // 4. Update session state
    session.currentTheta = eapResult.theta;
    session.standardError = eapResult.standardError;
    session.itemsAnswered += 1;
    session.administeredItemIds.push(item.id);
    session.history.push({
      itemId: item.id,
      selectedOptionId,
      isCorrect: evalResult.isCorrect,
      timeSpentSeconds,
      misconceptionCode: evalResult.misconceptionCode,
      thetaAfter: eapResult.theta,
      standardErrorAfter: eapResult.standardError,
      timestamp: new Date().toISOString()
    });

    // 5. Update learner's dynamic competency profile
    coreRepository.updateLearnerCompetency(
      session.learnerId,
      item.competency,
      eapResult.theta,
      eapResult.standardError
    );

    // 6. Generate Traceable Evidence Record (Level 3 Diagnostic)
    const newEvidence: LearnerEvidence = {
      id: crypto.randomUUID(),
      learnerId: session.learnerId,
      competency: item.competency,
      evidenceType: 'diagnostic_response',
      sourceType: 'cat_assessment',
      sourceId: session.id,
      sourceTitle: `Adaptive CAT Diagnostic Session (${item.code})`,
      summary: evalResult.isCorrect
        ? `Correctly solved item on ${item.competency.replace('_', ' ')}: demonstrated valid analytical reasoning.`
        : `Identified misconception [${evalResult.misconceptionCode}] on ${item.competency.replace('_', ' ')}.`,
      observedValue: {
        theta: eapResult.theta,
        standardError: eapResult.standardError,
        misconceptionsIdentified: evalResult.misconceptionCode ? [evalResult.misconceptionCode] : []
      },
      confidence: Math.round((1 - eapResult.standardError * 0.5) * 100) / 100,
      evidenceStrength: 3,
      status: 'accepted',
      visibility: 'guardian',
      observedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    coreRepository.addEvidence(newEvidence);

    // 7. Adaptive Next-Item Selection
    const pool = coreRepository.getItemBank();
    const selection = selectNextAdaptiveItem(
      pool,
      {
        currentTheta: eapResult.theta,
        administeredItemIds: session.administeredItemIds
      },
      {
        minItems: 4,
        maxItems: 8,
        targetSE: 0.38,
        currentSE: eapResult.standardError
      }
    );

    if (selection.isTestComplete || !selection.selectedItem) {
      session.status = 'completed';
      session.completedAt = new Date().toISOString();
      coreRepository.saveAssessmentSession(session);

      return json({
        sessionId: session.id,
        status: 'completed',
        isCorrect: evalResult.isCorrect,
        explanation: evalResult.explanation,
        misconceptionCode: evalResult.misconceptionCode,
        currentTheta: eapResult.theta,
        standardError: eapResult.standardError,
        itemsAnswered: session.itemsAnswered,
        isTestComplete: true,
        completionSummary: {
          competencyAssessed: item.competency,
          finalTheta: eapResult.theta,
          finalStandardError: eapResult.standardError,
          itemsCount: session.itemsAnswered,
          evidenceGeneratedId: newEvidence.id
        }
      });
    }

    coreRepository.saveAssessmentSession(session);

    const nextItemSafe: ClientAssessmentItem = {
      id: selection.selectedItem.id,
      competency: selection.selectedItem.competency,
      code: selection.selectedItem.code,
      prompt: selection.selectedItem.prompt,
      stimulusUrl: selection.selectedItem.stimulusUrl,
      options: selection.selectedItem.options
    };

    return json({
      sessionId: session.id,
      status: 'in_progress',
      isCorrect: evalResult.isCorrect,
      explanation: evalResult.explanation,
      misconceptionCode: evalResult.misconceptionCode,
      currentTheta: eapResult.theta,
      standardError: eapResult.standardError,
      itemsAnswered: session.itemsAnswered,
      isTestComplete: false,
      nextItem: nextItemSafe
    });
  } catch (err: any) {
    return json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
};
