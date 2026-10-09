import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatWithSocraticMentor } from '@core-os/ai';
import { coreRepository } from '$lib/server/repository';
import { resolveLearnerId } from '$lib/server/learnerScope';
import type { LearnerEvidence } from '@core-os/domain';

export const POST: RequestHandler = async ({ request, locals }) => {
  // 1. Enforce active authentication
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message, learnerId, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return json({ error: 'Message text is required' }, { status: 400 });
    }

    // 2. Authorize learner relationship (Child privacy / anti-spoofing)
    const user = locals.user;
    const userRole = (user as any).role || (user as any).metadata?.role || 'student';
    const boundLearnerId = resolveLearnerId(user);

    // Students and parents are strictly scoped to their own learner
    const effectiveLearnerId = ['student', 'parent'].includes(userRole)
      ? boundLearnerId
      : (learnerId || boundLearnerId);

    const mentorResponse = await chatWithSocraticMentor(message, history);

    // If an observation was extracted, log it as candidate evidence bound strictly to the verified learner
    if (mentorResponse.observation) {
      const observationEvidence: LearnerEvidence = {
        id: crypto.randomUUID(),
        learnerId: effectiveLearnerId,
        competency: (mentorResponse.observation.competency as any) || 'metacognition',
        evidenceType: 'reflection_synthesis',
        sourceType: 'voice_reflection',
        sourceTitle: 'Socratic Reasoning Session',
        summary: mentorResponse.observation.note,
        observedValue: { qualitativeNotes: mentorResponse.observation.note },
        confidence: 0.65,
        evidenceStrength: 2,
        status: 'candidate',
        visibility: 'learner_only',
        observedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      coreRepository.addEvidence(observationEvidence);
    }

    return json({
      reply: mentorResponse.reply,
      source: mentorResponse.source,
      observation: mentorResponse.observation
    });
  } catch (err: any) {
    return json({ error: err.message || 'Internal mentor error' }, { status: 500 });
  }
};
