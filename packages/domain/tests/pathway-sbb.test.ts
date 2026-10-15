import { describe, it, expect } from 'vitest';
import {
  mapPsleToPostingGroup,
  evaluateFullSbbPlacement,
  calculatePostSecondaryAggregates,
  evaluateConstructiveMismatch,
  type PsleSubjectScore,
  type PathwayPrerequisiteInput
} from '../src/mismatch.js';

describe('Singapore Full SBB Multi-Route Engine', () => {
  it('maps PSLE AL aggregates to correct Posting Groups (PG1, PG2, PG3)', () => {
    expect(mapPsleToPostingGroup(8)).toBe('PG3');
    expect(mapPsleToPostingGroup(20)).toBe('PG3');
    expect(mapPsleToPostingGroup(22)).toBe('PG3');
    expect(mapPsleToPostingGroup(23)).toBe('PG2');
    expect(mapPsleToPostingGroup(24)).toBe('PG2');
    expect(mapPsleToPostingGroup(25)).toBe('PG1');
    expect(mapPsleToPostingGroup(28)).toBe('PG1');
  });

  it('evaluates Full SBB placement and higher-level subject eligibility at S1', () => {
    const scores: PsleSubjectScore[] = [
      { subject: 'english', alGrade: 3 },
      { subject: 'mathematics', alGrade: 4 },
      { subject: 'science', alGrade: 5 },
      { subject: 'mother_tongue', alGrade: 6 }
    ];

    const placement = evaluateFullSbbPlacement(scores);
    expect(placement.psleAggregate).toBe(18);
    expect(placement.postingGroup).toBe('PG3');
    expect(placement.initialBandRecommendation['mathematics']).toBe('G3');
  });

  it('allows PG2 students with AL <= 5 to offer subjects at G3 level', () => {
    const scores: PsleSubjectScore[] = [
      { subject: 'english', alGrade: 6 },
      { subject: 'mathematics', alGrade: 4 }, // Eligible for G3
      { subject: 'science', alGrade: 6 },
      { subject: 'mother_tongue', alGrade: 7 }
    ];

    const placement = evaluateFullSbbPlacement(scores);
    expect(placement.postingGroup).toBe('PG2');
    expect(placement.initialBandRecommendation['mathematics']).toBe('G3');
    expect(placement.initialBandRecommendation['science']).toBe('G2');
    expect(placement.eligibleForHigherLevel).toContain('mathematics');
  });

  it('calculates ELR2B2 and ELMAB3 post-secondary aggregate simulations', () => {
    const grades = {
      english: 2,
      mathematics: 1,
      science: 2,
      design_tech: 1,
      humanities: 2
    };

    const aggregates = calculatePostSecondaryAggregates(grades);
    expect(aggregates.elr2b2).toBe(8);
    expect(aggregates.elmab3).toBe(8);
    expect(aggregates.isPolyEligible).toBe(true);
    expect(aggregates.isIteEligible).toBe(true);
  });
});

describe('Constructive Mismatch & 3-Tier Multi-Route Parallel Architecture', () => {
  const prerequisites: PathwayPrerequisiteInput[] = [
    { competency: 'quantitative_reasoning', requiredLevel: 4.0, importance: 'critical_foundation' },
    { competency: 'computational_thinking', requiredLevel: 3.5, importance: 'critical_foundation' },
    { competency: 'spatial_reasoning', requiredLevel: 3.2, importance: 'strongly_recommended' }
  ];

  it('classifies small gap as minor refresher (4 weeks)', () => {
    const observed = {
      quantitative_reasoning: 3.8, // gap = 0.2
      computational_thinking: 3.5, // gap = 0
      spatial_reasoning: 3.2       // gap = 0
    };

    const result = evaluateConstructiveMismatch('robotics-path', 'Robotics Engineering', prerequisites, observed);
    expect(result.feasibilityCategory).toBe('minor_refresher');
    expect(result.recommendedSprintWeeks).toBe(4);
    expect(result.developmentalBand).toBe('Developing Foundation');
    expect(result.prerequisiteDelta).toBe(0.2);
  });

  it('classifies medium gap as 8-week structured foundation sprint', () => {
    const observed = {
      quantitative_reasoning: 2.8, // gap = 1.2
      computational_thinking: 3.0, // gap = 0.5
      spatial_reasoning: 3.2       // gap = 0
    };

    const result = evaluateConstructiveMismatch('robotics-path', 'Robotics Engineering', prerequisites, observed);
    expect(result.feasibilityCategory).toBe('foundation_sprint');
    expect(result.recommendedSprintWeeks).toBe(8);
    expect(result.remediationFocusAreas.length).toBeGreaterThan(0);
  });

  it('preserves zero-rejection policy without percentage precision', () => {
    const observed = {
      quantitative_reasoning: 1.5,
      computational_thinking: 1.5,
      spatial_reasoning: 1.5
    };

    const result = evaluateConstructiveMismatch('robotics-path', 'Robotics Engineering', prerequisites, observed);
    expect(result.developmentalBand).toBe('Emerging Explorer');
    // Ensure no percentage precision like "74% fit" is used
    expect(result.competenciesDemonstratedRatio).toMatch(/\d+ \/ \d+ foundational competencies demonstrated/);
  });

  it('outputs 3 equal-status parallel routes: Academic, Vocational, Portfolio', () => {
    const observed = {
      quantitative_reasoning: 3.2,
      computational_thinking: 3.0,
      spatial_reasoning: 3.0
    };

    const result = evaluateConstructiveMismatch('robotics-path', 'Robotics Engineering', prerequisites, observed);
    expect(result.multiRouteTracks).toHaveLength(3);

    const [tier1, tier2, tier3] = result.multiRouteTracks;
    expect(tier1.tier).toBe('tier1_academic');
    expect(tier1.credential).toContain('B.Tech / B.S.');
    expect(tier2.tier).toBe('tier2_vocational');
    expect(tier2.credential).toContain('Polytechnic');
    expect(tier3.tier).toBe('tier3_portfolio');
    expect(tier3.credential).toContain('Verified Technical Portfolio');
  });

  it('unlocks curated Try-Before-You-Choose mini-missions', () => {
    const observed = { quantitative_reasoning: 3.0, computational_thinking: 3.0, spatial_reasoning: 3.0 };
    const result = evaluateConstructiveMismatch('robotics-path', 'Robotics Engineering', prerequisites, observed);

    expect(result.tryBeforeYouChooseMissions).toHaveLength(3);
    expect(result.tryBeforeYouChooseMissions[0].slug).toBe('mars-rover-pathfinder');
    expect(result.tryBeforeYouChooseMissions[1].slug).toBe('gear-train-mechanics');
    expect(result.tryBeforeYouChooseMissions[2].slug).toBe('sonar-autonomous-rover');
  });
});
