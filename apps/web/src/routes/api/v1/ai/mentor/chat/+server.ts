import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatWithSocraticMentor } from '@core-os/ai';
import { coreRepository } from '$lib/server/repository';
import type { LearnerEvidence } from '@core-os/domain';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { message, learnerId = '3fa85f64-5717-4562-b3fc-2c963f66afa6', history = [] } = body;

    if (!message || typeof message !== 'string') {
      return json({ error: 'Message text is required' }, { status: 400 });
    }

    const mentorResponse = await chatWithSocraticMentor(message, history);

    // If an observation was extracted, log it as candidate evidence
    if (mentorResponse.observation) {
      const observationEvidence: LearnerEvidence = {
        id: crypto.randomUUID(),
        learnerId,
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
