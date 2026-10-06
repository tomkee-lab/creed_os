import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository } from '$lib/server/repository';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  const evidence = coreRepository.getLearnerEvidence(id);

  return json({
    learnerId: id,
    evidenceCount: evidence.length,
    evidence: evidence.map((e) => ({
      id: e.id,
      competency: e.competency,
      strengthLevel: e.evidenceStrength,
      sourceType: e.sourceType,
      sourceName: e.sourceTitle,
      observedAt: e.observedAt,
      confidence: e.confidence,
      summary: e.summary,
      observedValue: e.observedValue
    }))
  });
};
