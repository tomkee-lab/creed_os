import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';

export const POST: RequestHandler = async ({ params, request }) => {
  const { id: pathwayId } = params;
  const body = await request.json().catch(() => ({}));
  const learnerId = body.learnerId ?? '3fa85f64-5717-4562-b3fc-2c963f66afa6';

  const pathway = coreRepository.getPathwayById(pathwayId);
  if (!pathway) {
    return json({ error: 'Pathway not found' }, { status: 404 });
  }

  const learner = coreRepository.getLearnerProfile(learnerId);
  if (!learner) {
    return json({ error: 'Learner profile not found' }, { status: 404 });
  }

  // Calculate alignment deltas
  const strengthsMeetingRequirements: Array<{
    competency: string;
    required: number;
    demonstrated: number;
    delta: string;
  }> = [];

  const foundationGaps: Array<{
    competency: string;
    required: number;
    demonstrated: number;
    delta: string;
    coreConcept: string;
  }> = [];

  let totalDemonstrated = 0;
  let totalRequired = 0;

  for (const req of pathway.requirements) {
    const scoreObj = learner.competencies[req.competency];
    const demonstrated = scoreObj ? scoreObj.score : 3.0;
    const required = req.minimumLevel;
    const deltaVal = demonstrated - required;
    const deltaStr = (deltaVal >= 0 ? '+' : '') + deltaVal.toFixed(1);

    totalDemonstrated += demonstrated;
    totalRequired += required;

    if (demonstrated >= required) {
      strengthsMeetingRequirements.push({
        competency: req.competency.replace('_', ' '),
        required,
        demonstrated,
        delta: deltaStr
      });
    } else {
      foundationGaps.push({
        competency: req.competency.replace('_', ' '),
        required,
        demonstrated,
        delta: deltaStr,
        coreConcept: getRemediationConcept(req.competency)
      });
    }
  }

  const overallReadiness = Number(
    Math.min(1.0, totalDemonstrated / Math.max(1, totalRequired)).toFixed(2)
  );

  const status =
    foundationGaps.length === 0
      ? overallReadiness >= 0.85
        ? 'strongly_aligned'
        : 'aligned'
      : 'constructive_mismatch';

  const recommendedIntervention = {
    title: `6-Week ${pathway.title} Foundations Sprint`,
    durationWeeks: 6,
    weeklyCommitmentHours: 3,
    targetedSkills: foundationGaps.map((g) => g.competency)
  };

  const tryBeforeYouChooseMissions = pathway.missions.map((m) => ({
    missionId: m.id,
    title: m.title,
    description: m.description
  }));

  return json({
    pathwayId: pathway.id,
    pathwayTitle: pathway.title,
    overallReadiness,
    status,
    strengthsMeetingRequirements,
    foundationGaps,
    recommendedIntervention,
    tryBeforeYouChooseMissions
  });
};

function getRemediationConcept(competency: string): string {
  switch (competency) {
    case 'quantitative_reasoning':
      return 'Proportional scaling and multi-variable equation isolation';
    case 'computational_thinking':
      return 'Decomposition and state invariant tracking in iterative loops';
    case 'spatial_reasoning':
      return '3D topological projection and rotational symmetry analysis';
    case 'scientific_inquiry':
      return 'Controlled variable isolation and hypothesis falsification';
    case 'logical_deduction':
      return 'Contrapositive implications and truth table constraints';
    default:
      return 'Core foundational problem solving heuristics';
  }
}
