import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { coreRepository, type DifferentiatedLessonPlan } from '$lib/server/repository';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const role = (locals.user as any).role || (locals.user as any).metadata?.role;
  if (!['teacher', 'counselor', 'admin'].includes(role)) {
    return json({ error: 'Forbidden: Educator access required' }, { status: 403 });
  }

  const plans = coreRepository.getLessonPlans();
  return json({ lessonPlans: plans });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const role = (locals.user as any).role || (locals.user as any).metadata?.role;
  if (!['teacher', 'counselor', 'admin'].includes(role)) {
    return json({ error: 'Forbidden: Educator access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const serverGeneratedId = `LP-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const newPlan: DifferentiatedLessonPlan = {
      id: body.id || serverGeneratedId,
      title: body.title || 'Untitled Differentiated Lesson',
      subject: body.subject || 'STEM Reasoning',
      targetGrade: body.targetGrade || 'Class 8 / Middle Stage',
      durationMinutes: Number(body.durationMinutes) || 45,
      alignedStandards: Array.isArray(body.alignedStandards) ? body.alignedStandards : ['National Learning Standard'],
      targetedMisconception: body.targetedMisconception || {
        tag: 'general_foundation',
        label: 'Foundation Gap',
        diagnosis: 'Remediating student misconception observed in recent benchmarking.'
      },
      pedagogicalFramework: body.pedagogicalFramework || 'CRA (Concrete-Representational-Abstract)',
      tier1Remediation: body.tier1Remediation || {
        tierTitle: 'Tier 1: Hands-On Tactile Scaffolding',
        studentTarget: 'Emergent learners needing concrete modeling',
        scaffoldStrategy: 'Physical observation and guided measurement',
        tactileActivity: 'Hands-on experiment using manipulatives',
        checkQuestion: 'Can you describe the physical relationship in your own words?'
      },
      tier2Core: body.tier2Core || {
        tierTitle: 'Tier 2: Guided Representational Task',
        studentTarget: 'Learners working on grade-level representations',
        collaborativeTask: 'Pairs construct diagrams and mathematical models',
        evidenceCheckpoint: 'Demonstrate solution on 2 standard checkpoint items'
      },
      tier3Extension: body.tier3Extension || {
        tierTitle: 'Tier 3: Autonomous Synthesis & Optimization',
        studentTarget: 'Advanced learners requiring open-ended challenge',
        inquiryChallenge: 'Design an open-ended optimization or proof',
        evaluationRubric: 'Algorithmic or mathematical rigor and creativity'
      },
      teacherFacilitatorNotes: Array.isArray(body.teacherFacilitatorNotes)
        ? body.teacherFacilitatorNotes
        : ['Apply 140s silence rule before providing cues.'],
      createdAt: new Date().toISOString()
    };

    const saved = coreRepository.saveLessonPlan(newPlan);
    return json({ lessonPlan: saved }, { status: 201 });
  } catch (err: any) {
    return json({ error: err.message || 'Failed to save lesson plan' }, { status: 500 });
  }
};
