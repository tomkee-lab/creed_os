import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId, DEFAULT_DEMO_LEARNER_ID } from '$lib/server/learnerScope';
import {
  evaluateItemResponse,
  estimateThetaEAP,
  selectNextAdaptiveItem,
  generateGlobalBenchmarkReport,
  type BenchmarkDomain
} from '@core-os/assessment';
import type { ClientAssessmentItem, LearnerEvidence } from '@core-os/domain';
import {
  toStudentBenchmarkReportDTO,
  toParentBenchmarkReportDTO,
  deepSanitizePsychometrics
} from '$lib/server/psychometricDto';

export const POST: RequestHandler = async ({ params, request, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  try {
    const sessionId = params.id;
    let session = coreRepository.getAssessmentSession(sessionId);
    if (!session && typeof (coreRepository as any).getAssessmentSessionFromDb === 'function') {
      session = await (coreRepository as any).getAssessmentSessionFromDb(sessionId);
    }

    if (!session) {
      return json({ error: 'Assessment session not found' }, { status: 404 });
    }

    // 2. Authorize session ownership and relationship (Prevent unrelated actors or cross-learner injection)
    const user = locals.user;
    const userRole = (user as any).role || (user as any).metadata?.role || 'student';
    const boundLearnerId = resolveLearnerId(user);

    const allowedRoles = ['student', 'teacher', 'counselor', 'studio', 'admin', 'parent'];
    if (!allowedRoles.includes(userRole)) {
      return json({ error: 'Forbidden: Unauthorized role for assessment responses.' }, { status: 403 });
    }

    const isDemoSession = import.meta.env.DEV && session.learnerId === DEFAULT_DEMO_LEARNER_ID;

    // Statutory child privacy: Students can only submit to their own sessions
    if (userRole === 'student') {
      if (!isDemoSession && (!boundLearnerId || session.learnerId !== boundLearnerId)) {
        return json({ error: 'Forbidden: You cannot submit responses to an assessment session belonging to another learner.' }, { status: 403 });
      }
    }

    // Parents can only submit for their verified linked child
    if (userRole === 'parent' || userRole === 'parent_pending') {
      if (!isDemoSession && (!boundLearnerId || session.learnerId !== boundLearnerId)) {
        return json({ error: 'Forbidden: You cannot submit responses to an assessment session belonging to an unrelated learner.' }, { status: 403 });
      }
    }

    if (session.status === 'completed') {
      return json({ error: 'Session is already completed' }, { status: 400 });
    }

    const body = await request.json();
    const { itemId, selectedOptionId, timeSpentSeconds = 15 } = body;

    if (!itemId || !selectedOptionId) {
      return json({ error: 'Bad Request: itemId and selectedOptionId are required' }, { status: 400 });
    }

    // F04: Prevent item replay attacks / duplicate answers
    if (session.history.some((h) => h.itemId === itemId)) {
      return json({
        error: 'Conflict: This item has already been submitted for this session.',
        code: 'ITEM_ALREADY_ANSWERED',
        sessionId: session.id,
        itemsAnswered: session.itemsAnswered
      }, { status: 409 });
    }

    const item = coreRepository.getItemById(itemId);
    if (!item) {
      return json({ error: 'Item not found in bank' }, { status: 404 });
    }

    // F04: Verify item domain membership matches session blueprint
    const domainPool = coreRepository.getItemsByDomain(session.domain);
    if (!domainPool.some((p) => p.id === item.id)) {
      return json({ error: 'Forbidden: Item does not belong to this assessment domain blueprint.' }, { status: 400 });
    }

    // Validate selected option exists on item
    const validOption = item.options.some((opt: any) => opt.id === selectedOptionId);
    if (!validOption) {
      return json({ error: 'Bad Request: selectedOptionId does not exist for this item' }, { status: 400 });
    }

    const boundedTimeSpent = Math.max(1, Math.min(600, Number(timeSpentSeconds) || 15));

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
      timeSpentSeconds: boundedTimeSpent,
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
    await coreRepository.addEvidenceAsync(newEvidence, locals.user.id);

    // 7. Adaptive Next-Item Selection
    const pool = coreRepository.getItemsByDomain(session.domain);
    const isBenchmark = session.mode === 'benchmark';
    const isRapid = session.mode === 'rapid';
    const maxItems = isBenchmark ? 30 : (isRapid ? 8 : 12);
    const minItems = isBenchmark ? 10 : (isRapid ? 4 : 5);
    const targetSE = isBenchmark ? 0.22 : (isRapid ? 0.38 : 0.32);

    const selection = selectNextAdaptiveItem(
      pool,
      {
        currentTheta: eapResult.theta,
        administeredItemIds: session.administeredItemIds
      },
      {
        minItems,
        maxItems,
        targetSE,
        currentSE: eapResult.standardError
      }
    );

    if (selection.isTestComplete || !selection.selectedItem) {
      session.status = 'completed';
      session.completedAt = new Date().toISOString();
      coreRepository.saveAssessmentSession(session);

      const domainKey: BenchmarkDomain =
        session.domain === 'english' || session.domain === 'language_literacy'
          ? 'english'
          : session.domain === 'robotics' || session.domain === 'computational_thinking'
          ? 'robotics'
          : 'stem';

      const benchmarkReport = generateGlobalBenchmarkReport(
        domainKey,
        eapResult.theta,
        eapResult.standardError,
        session.history.map((h) => ({
          itemId: h.itemId,
          selectedOptionId: h.selectedOptionId,
          isCorrect: h.isCorrect,
          misconceptionTag: h.misconceptionCode
        })),
        pool
      );

      coreRepository.saveBenchmarkReport(session.learnerId, benchmarkReport);

      const isStaff = ['teacher', 'counselor', 'studio', 'admin'].includes(userRole);

      // Safe role-aware benchmark report DTO mapping
      const safeReport = userRole === 'parent'
        ? deepSanitizePsychometrics(toParentBenchmarkReportDTO(benchmarkReport))
        : userRole === 'student'
        ? deepSanitizePsychometrics(toStudentBenchmarkReportDTO(benchmarkReport))
        : benchmarkReport;

      return json({
        sessionId: session.id,
        status: 'completed',
        isCorrect: evalResult.isCorrect,
        explanation: evalResult.explanation,
        misconceptionCode: evalResult.misconceptionCode,
        ...(isStaff ? { currentTheta: eapResult.theta, standardError: eapResult.standardError } : {}),
        itemsAnswered: session.itemsAnswered,
        isTestComplete: true,
        completionSummary: {
          competencyAssessed: item.competency,
          ...(isStaff ? { finalTheta: eapResult.theta, finalStandardError: eapResult.standardError } : {}),
          itemsCount: session.itemsAnswered,
          evidenceGeneratedId: newEvidence.id,
          benchmarkReport: safeReport
        }
      });
    }

    coreRepository.saveAssessmentSession(session);

    const isStaff = ['teacher', 'counselor', 'studio', 'admin'].includes(userRole);

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
      ...(isStaff ? { currentTheta: eapResult.theta, standardError: eapResult.standardError } : {}),
      itemsAnswered: session.itemsAnswered,
      isTestComplete: false,
      nextItem: nextItemSafe
    });
  } catch (err: any) {
    return json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
};
