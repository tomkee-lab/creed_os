import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import type { LearnerEvidence, CompetencyDomain } from '@core-os/domain';

export const POST: RequestHandler = async ({ request, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  // 2. Enforce educator or administrator credential
  const user = locals.user;
  const userRole = (user as any).role || (user as any).metadata?.role;
  if (!['teacher', 'admin'].includes(userRole)) {
    return json(
      { error: 'Forbidden: Educator credential required to log classroom observations' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { studentId, competency, notes, consistencyRating = 4 } = body;

    if (!studentId || typeof studentId !== 'string' || !studentId.trim()) {
      return json(
        { error: 'Bad Request: studentId is required and must be a valid identifier string' },
        { status: 400 }
      );
    }

    if (!notes || typeof notes !== 'string' || !notes.trim()) {
      return json(
        { error: 'Bad Request: observation notes are required and must be non-empty text' },
        { status: 400 }
      );
    }

    if (notes.trim().length > 2000) {
      return json(
        { error: 'Bad Request: observation notes cannot exceed 2000 characters' },
        { status: 400 }
      );
    }

    const rating = Number(consistencyRating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return json(
        { error: 'Bad Request: consistencyRating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    const VALID_COMPETENCIES: Set<string> = new Set([
      'spatial_reasoning',
      'quantitative_reasoning',
      'computational_thinking',
      'logical_deduction',
      'scientific_inquiry',
      'creative_ideation',
      'verbal_reasoning',
      'metacognition'
    ]);

    const sanitizedCompetency = String(competency || '').trim();
    if (!VALID_COMPETENCIES.has(sanitizedCompetency)) {
      return json(
        { error: `Bad Request: Invalid competency domain '${sanitizedCompetency}'` },
        { status: 400 }
      );
    }

    // Verify learner exists in repository
    const targetLearner = coreRepository.getLearnerProfile(studentId.trim());
    if (!targetLearner) {
      return json(
        { error: 'Not Found: Learner profile not found in class cohort registry' },
        { status: 404 }
      );
    }

    const educatorName = (user as any).name || 'Faculty Observer';
    const evidenceId = crypto.randomUUID();
    const now = new Date().toISOString();

    const evidenceRecord: LearnerEvidence = {
      id: evidenceId,
      learnerId: studentId.trim(),
      competency: sanitizedCompetency as CompetencyDomain,
      evidenceType: 'observation_log',
      sourceType: 'teacher_observation',
      sourceTitle: `Classroom Observation — ${educatorName}`,
      summary: notes.trim(),
      observedValue: {
        scoreFraction: Number((rating / 5).toFixed(2)),
        rubricCriteria: {
          consistencyRating: rating
        },
        qualitativeNotes: `Recorded by ${educatorName} (${(user as any).id || 'staff'}). Notes: ${notes.trim()}`
      },
      confidence: 0.85,
      evidenceStrength: 3, // Level 3: Educator Diagnostic Observation
      status: 'validated',
      visibility: 'teacher',
      observedAt: now,
      createdAt: now
    };

    coreRepository.addEvidence(evidenceRecord);

    return json({
      success: true,
      evidence: evidenceRecord,
      message: 'Classroom observation verified and appended to learner evidence ledger.'
    });
  } catch (err: any) {
    return json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
};
