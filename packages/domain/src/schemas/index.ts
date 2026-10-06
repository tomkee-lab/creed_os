import { z } from 'zod';

export const CompetencyDomainSchema = z.enum([
  'quantitative_reasoning',
  'spatial_reasoning',
  'logical_deduction',
  'scientific_inquiry',
  'computational_thinking',
  'systems_thinking',
  'creative_problem_solving',
  'metacognition'
]);

export const StartAssessmentSessionSchema = z.object({
  learnerId: z.string().uuid(),
  domain: z.string().default('stem_reasoning'),
  gradeBand: z.string().optional()
});

export const SubmitAssessmentResponseSchema = z.object({
  itemId: z.string().min(1),
  selectedOptionId: z.string().min(1),
  timeSpentSeconds: z.number().min(0).max(600)
});

export const CreateEvidenceSchema = z.object({
  learnerId: z.string().uuid(),
  organizationId: z.string().uuid().optional(),
  competency: CompetencyDomainSchema,
  skillId: z.string().optional(),
  evidenceType: z.string().min(1),
  sourceType: z.enum([
    'cat_assessment',
    'project_mission',
    'teacher_observation',
    'voice_reflection',
    'self_report',
    'inventory_survey'
  ]),
  sourceId: z.string().optional(),
  sourceTitle: z.string().min(1),
  summary: z.string().min(1),
  observedValue: z.record(z.any()),
  confidence: z.number().min(0).max(1),
  evidenceStrength: z.number().int().min(1).max(5),
  status: z.enum(['candidate', 'validated', 'accepted', 'contested', 'superseded', 'expired']).default('candidate'),
  visibility: z.enum(['private', 'learner_only', 'guardian', 'teacher', 'organization_admin']).default('private')
});

export const MismatchQuerySchema = z.object({
  learnerId: z.string().uuid()
});

export const SocraticMentorMessageSchema = z.object({
  learnerId: z.string().uuid(),
  message: z.string().min(1).max(2000),
  contextItemOrMissionId: z.string().optional()
});
