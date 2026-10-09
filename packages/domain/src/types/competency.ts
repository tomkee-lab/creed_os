export const COMPETENCY_DOMAINS = [
  'quantitative_reasoning',
  'spatial_reasoning',
  'logical_deduction',
  'scientific_inquiry',
  'computational_thinking',
  'systems_thinking',
  'creative_problem_solving',
  'metacognition'
] as const;

export type CompetencyDomain = (typeof COMPETENCY_DOMAINS)[number];

export interface Competency {
  id: string;
  domain: CompetencyDomain;
  code: string;
  name: string;
  description: string;
  ageBand: [number, number];
  nationalFrameworkMappings?: Record<string, string>; // e.g. { "PARAKH": "M-COG-04", "CBSE": "CT-AI-08" }
}

export interface Skill {
  id: string;
  competencyId: string;
  code: string;
  title: string;
  description: string;
  difficultyBaseline: number; // 3PL b-parameter estimate
}

export interface SkillPrerequisite {
  skillId: string;
  prerequisiteSkillId: string;
  strength: 'mandatory' | 'recommended' | 'extension';
}

export interface CompetencyScore {
  competency: CompetencyDomain;
  title: string;
  score: number; // Normalized continuous metric (1.0 to 5.0 scale derived from θ)
  theta: number; // Latent ability on normal scale (-3.0 to +3.0)
  standardError: number;
  descriptor: 'Developing' | 'Expected' | 'Proficient' | 'Advanced' | 'Mastery';
  confidence: number; // 0.0 to 1.0
  lastAssessedAt: string;
}
