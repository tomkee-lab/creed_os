import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import { createRoleBasedEvidenceAtom, type LearnerEvidence } from '@core-os/domain';

const ALLOWED_TRUSS_TYPES = new Set(['warren', 'pratt', 'howe', 'k-truss', 'isometric', 'custom']);
const ALLOWED_MATERIALS = new Set(['carbon', 'carbon_fiber', 'steel', 'titanium', 'aluminum', 'wood', 'composite']);

const ALLOWED_COMPETENCIES = new Set([
  'computational_thinking',
  'stem_reasoning',
  'scientific_inquiry',
  'spatial_reasoning',
  'metacognition',
  'language_literacy'
]);

export const POST: RequestHandler = async ({ request, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  // 2. Authorize learner relationship (Anti-spoofing)
  const boundLearnerId = resolveLearnerId(locals.user);
  if (!boundLearnerId) {
    return json(
      { error: 'Forbidden: No authorized learner relationship associated with account' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Support Activity Theory Role-Based Team Submissions (Kinematics, Firmware, Telemetry)
    if (body.teamRole && ['kinematics', 'firmware', 'telemetry'].includes(body.teamRole)) {
      const userRole = (locals.user as any).role || (locals.user as any).metadata?.role || 'student';
      const isStaffEvaluator = ['teacher', 'admin', 'counselor'].includes(userRole) && locals.user.id !== boundLearnerId;

      const rawRecord = createRoleBasedEvidenceAtom(boundLearnerId, {
        missionId: body.missionId || 'team-mission-01',
        missionTitle: body.missionTitle || 'Collaborative Robotics Proving Ground',
        teamRole: body.teamRole,
        roleArtifact: body.roleArtifact || {
          kinematicsMetrics: body.kinematicsMetrics,
          firmwareAst: body.firmwareAst,
          telemetry: body.telemetry
        },
        collaborators: body.collaborators || [],
        notes: body.learnerNotes || body.notes
      });

      const evidenceRecord: LearnerEvidence = {
        ...rawRecord,
        confidence: isStaffEvaluator ? rawRecord.confidence : 0.70,
        evidenceStrength: isStaffEvaluator ? 4 : 2,
        status: isStaffEvaluator ? 'validated' : 'candidate'
      };

      await coreRepository.addEvidenceAsync(evidenceRecord, locals.user.id);

      return json({
        success: true,
        verified: isStaffEvaluator,
        teamRole: body.teamRole,
        evidence: evidenceRecord,
        message: isStaffEvaluator
          ? `Activity Theory role '${body.teamRole.toUpperCase()}' verified! Level 4 applied evidence recorded in growth ledger.`
          : `Activity Theory role '${body.teamRole.toUpperCase()}' recorded as candidate evidence pending educator review.`
      });
    }

    // Support Robotics IDE Mission Submissions
    if (body.missionType === 'robotics' || body.telemetry) {
      const evidenceId = crypto.randomUUID();
      const now = new Date().toISOString();
      const telemetry = body.telemetry || {};
      const evaluation = body.evaluation || {};
      const stage = body.stage || 'primary';
      const missionTitle = body.missionTitle || 'Autonomous Robotics Kinematics Mission';

      // Server verification of mission telemetry and block structure
      const kinematicSteps = telemetry.timeline?.length || 0;
      const motionSteps = Array.isArray(telemetry.motionPath) ? telemetry.motionPath.length : 0;
      const executionSteps = Array.isArray(telemetry.executionSteps) ? telemetry.executionSteps.length : 0;
      const hasExecutedSteps = kinematicSteps > 0 || motionSteps > 0 || executionSteps > 0;
      const hasCodeBlocks = (evaluation.totalBlocks || 0) > 0;
      const isVerified = hasExecutedSteps && hasCodeBlocks;
      const totalSteps = Math.max(kinematicSteps, motionSteps, executionSteps);

      const evidenceRecord: LearnerEvidence = {
        id: evidenceId,
        learnerId: boundLearnerId,
        competency: 'computational_thinking',
        evidenceType: 'mission_artifact',
        sourceType: 'project_mission',
        sourceTitle: missionTitle,
        summary: `Orchestrated autonomous mission in ${stage.toUpperCase()} IDE (${evaluation.totalBlocks || 0} AST nodes, ${totalSteps} kinematic steps). Mastery: ${evaluation.developmentalBand || 'Developing'}.`,
        observedValue: {
          scoreFraction: isVerified ? Math.min(1.0, Math.max(0.3, (evaluation.totalBlocks || 3) / 8)) : 0.4,
          rubricCriteria: {
            totalBlocks: evaluation.totalBlocks || 0,
            kinematicSteps: totalSteps,
            verified: isVerified ? 1 : 0
          },
          qualitativeNotes: `Stage: ${stage}. Developmental band: ${evaluation.developmentalBand || 'Developing'}. Last action: ${telemetry.lastAction || 'Complete'}. Sonar: ${telemetry.distance || 38}cm.`
        },
        confidence: isVerified ? 0.94 : 0.70,
        evidenceStrength: isVerified ? 4 : 2, // Level 4 when verified
        status: isVerified ? 'validated' : 'candidate',
        visibility: 'learner_only',
        observedAt: now,
        createdAt: now
      };

      await coreRepository.addEvidenceAsync(evidenceRecord, locals.user.id);

      return json({
        success: true,
        verified: isVerified,
        evidence: evidenceRecord,
        message: isVerified
          ? 'Robotics mission verified! Level 4 applied competency evidence recorded in your growth profile.'
          : 'Robotics mission recorded as pending review.'
      });
    }

    // Support Generalized STEM Simulation Submissions (Grid Rover, Gear Train, Telemetry, Winch, Vision, PID)
    if (body.missionType === 'stem_simulation' || body.solution) {
      const missionId = String(body.missionId || '').trim();
      if (!missionId) {
        return json({ error: 'Bad Request: A valid missionId is required for mission submission' }, { status: 400 });
      }

      const existingMission = coreRepository.getMissionById(missionId);
      if (!existingMission) {
        return json({ error: `Bad Request: Mission '${missionId}' not found in curriculum catalog.` }, { status: 400 });
      }

      const evidenceId = crypto.randomUUID();
      const now = new Date().toISOString();
      const solution = body.solution || {};
      const missionTitle = body.missionTitle || existingMission.title || 'Applied STEM Engineering Challenge';
      const requestedCompetency = String(body.competency || existingMission.domain || 'computational_thinking');
      const competency = ALLOWED_COMPETENCIES.has(requestedCompetency) ? requestedCompetency : 'computational_thinking';

      const userRole = (locals.user as any).role || (locals.user as any).metadata?.role || 'student';
      const isStaffEvaluator = ['teacher', 'admin', 'counselor'].includes(userRole) && locals.user.id !== boundLearnerId;

      // F05 Remediation: Untrusted browser telemetry cannot self-declare authoritative 'validated' status.
      // Candidate submissions from students remain 'candidate' until verified by an educator or deterministic server verifier.
      const clientReportedPass = Boolean(
        solution.rubricResults?.verified ||
        solution.rubricResults?.passed ||
        solution.verified ||
        solution.passed
      );

      const isVerified = isStaffEvaluator && clientReportedPass;
      const passRate = Number(solution.rubricResults?.passRate) || (clientReportedPass ? 0.8 : 0.4);

      const evidenceRecord: LearnerEvidence = {
        id: evidenceId,
        learnerId: boundLearnerId,
        competency: competency as any,
        evidenceType: 'mission_artifact',
        sourceType: 'project_mission',
        sourceTitle: missionTitle,
        summary: isVerified
          ? `Educator-verified engineering solution for ${missionTitle}. Performance: ${solution.summary || 'Specification verified'}.`
          : `Candidate engineering attempt for ${missionTitle}. Self-reported: ${clientReportedPass ? 'Pass criteria met' : 'Incomplete'}.`,
        observedValue: {
          scoreFraction: isVerified ? Math.min(1.0, Math.max(0.5, passRate)) : (clientReportedPass ? 0.6 : 0.3),
          rubricCriteria: {
            passRate: isVerified ? passRate : (clientReportedPass ? passRate : 0),
            verified: isVerified ? 1 : 0
          },
          qualitativeNotes: body.learnerNotes || (isVerified ? 'Verified by educator review.' : 'Client simulator telemetry; recorded as candidate evidence.')
        },
        confidence: isVerified ? 0.95 : 0.65,
        evidenceStrength: isVerified ? 4 : 2, // Level 4 requires verified review; Level 2 for candidate client submissions
        status: isVerified ? 'validated' : 'candidate',
        visibility: 'learner_only',
        observedAt: now,
        createdAt: now
      };

      await coreRepository.addEvidenceAsync(evidenceRecord, locals.user.id);

      return json({
        success: true,
        verified: isVerified,
        evidence: evidenceRecord,
        message: isVerified
          ? 'Engineering mission verified! Level 4 applied competency evidence recorded in your growth profile.'
          : 'Engineering mission solution recorded as candidate evidence pending educator verification.'
      });
    }

    const {
      missionId: rawMissionId = 'robobridge',
      missionTitle,
      trussType = 'warren',
      material = 'carbon_fiber',
      massKg,
      maxLoadKg,
      learnerNotes
    } = body;

    const missionId = String(rawMissionId).trim();
    const existingMission = coreRepository.getMissionById(missionId);
    if (!existingMission && missionId !== 'robobridge') {
      return json({ error: `Bad Request: Mission '${missionId}' not found in curriculum catalog.` }, { status: 400 });
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
    await coreRepository.addEvidenceAsync(evidenceRecord, locals.user.id);

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
