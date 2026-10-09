import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import type { LearnerEvidence } from '@core-os/domain';

const ALLOWED_TRUSS_TYPES = new Set(['warren', 'pratt', 'howe', 'k-truss', 'isometric', 'custom']);
const ALLOWED_MATERIALS = new Set(['carbon', 'carbon_fiber', 'steel', 'titanium', 'aluminum', 'wood', 'composite']);

export const POST: RequestHandler = async ({ request, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      missionId = 'robobridge',
      missionTitle,
      trussType = 'warren',
      material = 'carbon_fiber',
      massKg,
      maxLoadKg,
      learnerNotes
    } = body;

    // 2. Authorize learner relationship (Anti-spoofing)
    const user = locals.user;
    const boundLearnerId = resolveLearnerId(user);
    if (!boundLearnerId) {
      return json(
        { error: 'Forbidden: No authorized learner relationship associated with account' },
        { status: 403 }
      );
    }

    // 3. Deterministic engineering input validation
    const mass = Number(massKg);
    const maxLoad = Number(maxLoadKg);

    if (!Number.isFinite(mass) || !Number.isFinite(maxLoad) || mass <= 0 || maxLoad <= 0 || mass > 1000) {
      return json(
        { error: 'Bad Request: massKg and maxLoadKg must be positive finite numbers within physical bounds.' },
        { status: 400 }
      );
    }

    const sanitizedTruss = String(trussType || '').toLowerCase().trim();
    const rawMaterial = String(material || '').toLowerCase().trim();
    const sanitizedMaterial = rawMaterial === 'carbon' ? 'carbon_fiber' : rawMaterial;

    if (!ALLOWED_TRUSS_TYPES.has(sanitizedTruss)) {
      return json(
        { error: `Bad Request: Unsupported truss type '${trussType}'. Allowed types: ${Array.from(ALLOWED_TRUSS_TYPES).join(', ')}` },
        { status: 400 }
      );
    }

    if (!ALLOWED_MATERIALS.has(sanitizedMaterial)) {
      return json(
        { error: `Bad Request: Unsupported material '${material}'. Allowed materials: ${Array.from(ALLOWED_MATERIALS).join(', ')}` },
        { status: 400 }
      );
    }

    const sanitizedNotes = typeof learnerNotes === 'string' ? learnerNotes.slice(0, 1000).trim() : '';

    // Calculate ratio server-side (ignore client-supplied ratio)
    const computedRatio = Number((maxLoad / mass).toFixed(2));

    // Requirement: Strength-to-Weight Ratio >= 4.5x and Total Structural Mass <= 250kg
    const isValid = computedRatio >= 4.5 && mass <= 250;

    if (!isValid) {
      return json(
        {
          success: false,
          verified: false,
          computedRatio,
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
      summary: `Engineered ${sanitizedMaterial} ${sanitizedTruss} truss structure achieving strength-to-weight ratio of ${computedRatio}x across 12m terrain span (Mass: ${mass} kg, Load: ${maxLoad} kg).`,
      observedValue: {
        scoreFraction: Math.min(1.0, Math.max(0.0, Number((computedRatio / 5.0).toFixed(2)))),
        rubricCriteria: {
          strengthToWeightRatio: computedRatio,
          massKg: mass,
          maxLoadKg: maxLoad
        },
        qualitativeNotes: `Truss Architecture: ${sanitizedTruss}, Material: ${sanitizedMaterial}. ${sanitizedNotes}`
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
