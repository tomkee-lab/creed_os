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
    const { studentId, competency, notes, consistencyRating } = body;

    if (!studentId || !notes || !notes.trim()) {
      return json(
        { error: 'Bad Request: studentId and observation notes are required' },
        { status: 400 }
      );
    }

    const educatorName = (user as any).name || 'Faculty Observer';
    const evidenceId = crypto.randomUUID();
    const now = new Date().toISOString();

    const evidenceRecord: LearnerEvidence = {
      id: evidenceId,
      learnerId: studentId,
      competency: (competency as CompetencyDomain) || 'spatial_reasoning',
      evidenceType: 'observation_log',
      sourceType: 'teacher_observation',
      sourceTitle: `Classroom Observation — ${educatorName}`,
      summary: notes.trim(),
      observedValue: {
        scoreFraction: (consistencyRating || 4) / 5,
        rubricCriteria: {
          consistencyRating: consistencyRating || 4
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
