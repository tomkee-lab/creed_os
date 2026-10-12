import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import type { LearnerEvidence } from '@core-os/domain';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.session || !locals.user) {
    throw redirect(303, '/login?next=/student/missions');
  }

  const learnerId = resolveLearnerId(locals.user) || '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  const learner = coreRepository.getLearnerProfile(learnerId);

  const selectedStage = url.searchParams.get('stage') || 'all';
  const selectedDomain = url.searchParams.get('domain') || 'all';

  const missions = coreRepository.getMissions(selectedStage, selectedDomain);
  const evidenceList: LearnerEvidence[] = coreRepository.getLearnerEvidence(learnerId) || [];

  // Collect set of completed missions based on learner evidence
  const completedMissionTitles = new Set(
    evidenceList
      .filter((e: LearnerEvidence) => e.sourceType === 'project_mission' || e.evidenceType === 'mission_artifact')
      .map((e: LearnerEvidence) => e.sourceTitle)
  );

  return {
    learner,
    missions,
    totalMissions: coreRepository.getMissions().length,
    completedCount: completedMissionTitles.size,
    selectedStage,
    selectedDomain
  };
};
