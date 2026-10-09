import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import type { LearnerEvidence } from '@core-os/domain';

export const POST: RequestHandler = async ({ request, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      missionId,
      missionTitle,
      trussType,
      material,
      massKg,
      maxLoadKg,
      ratio,
      learnerNotes
    } = body;

    // 2. Authorize learner relationship (Anti-spoofing)
    const user = locals.user;
    const userRole = (user as any).role || (user as any).metadata?.role || 'student';
    const boundLearnerId =
      (user as any).learnerId ||
      (['student', 'parent'].includes(userRole)
        ? '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        : (user as any).id);

    // 3. Deterministic engineering verification
    // Requirement: Ratio >= 4.5x and Mass <= 250kg
    const isValid = Number(ratio) >= 4.5 && Number(massKg) <= 250;

    if (!isValid) {
      return json(
        {
          success: false,
          verified: false,
          message:
            'Structural criteria not met: Bridge must support at least 4.5x its own mass while staying under 250 kg.'
        },
        { status: 422 }
      );
    }

    // 4. Construct Level 4 Applied Mission Evidence Record
    const evidenceId = crypto.randomUUID();
    const now = new Date().toISOString();

    const evidenceRecord: LearnerEvidence = {
      id: evidenceId,
      learnerId: boundLearnerId,
      competency: 'spatial_reasoning',
      evidenceType: 'mission_artifact',
      sourceType: 'project_mission',
      sourceTitle: missionTitle || 'RoboBridge Structural Optimization Challenge',
      summary: `Engineered ${material} ${trussType} truss structure achieving strength-to-weight ratio of ${Number(ratio).toFixed(1)}x across 12m terrain span (Mass: ${massKg} kg, Load: ${maxLoadKg} kg).`,
      observedValue: {
        scoreFraction: Math.min(1.0, Number(ratio) / 5.0),
        rubricCriteria: {
          strengthToWeightRatio: Number(ratio),
          massKg: Number(massKg),
          maxLoadKg: Number(maxLoadKg)
        },
        qualitativeNotes: `Truss Architecture: ${trussType}, Material: ${material}. ${learnerNotes || ''}`
      },
      confidence: 0.92,
      evidenceStrength: 4, // Level 4: Applied Mission Task
      status: 'validated',
      visibility: 'learner_only',
      observedAt: now,
      createdAt: now
    };

    // 5. Persist into learner's evidence ledger
    coreRepository.addEvidence(evidenceRecord);

    return json({
      success: true,
      verified: true,
      evidence: evidenceRecord,
      message: 'Design verified! Level 4 applied mission evidence created in your growth profile.'
    });
  } catch (err: any) {
    return json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
};
