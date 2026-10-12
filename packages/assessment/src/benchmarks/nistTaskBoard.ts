import type {
  BenchmarkEvaluationResult,
  CompetitionEcosystemId,
  NistTaskBoardTask,
  NistTaskType,
  RobotRunTrial
} from './types.js';
import {
  calculateDescriptiveStats,
  calculateKolmogorovSmirnov,
  calculateOneWayANOVA,
  calculateTimePercentile
} from './statistics.js';
import { GLOBAL_COMPETITION_BENCHMARKS } from './competitions.js';

export const NIST_TC_PEBRAS_TASKS: Record<NistTaskType, NistTaskBoardTask> = {
  line_tracking_autonomy: {
    id: 'line_tracking_autonomy',
    title: 'Standard Line Tracking & Acute Curve Traversal',
    category: 'Kinematics',
    description:
      'Continuous line tracking across standardized 19mm black line track with 90° acute bends and loop-de-loops under NIST task board geometry.',
    standardTargetTimeSec: 22.5,
    maxAllowedTimeSec: 45.0,
    toleranceMm: 3.0,
    globalCohortTimes: [
      26.4, 25.8, 28.1, 24.2, 27.5, 23.9, 29.0, 31.2, 22.8, 25.1,
      27.9, 24.6, 26.0, 28.5, 23.4, 30.1, 26.8, 25.5, 24.9, 27.2
    ],
    globalCohortSuccessRate: 0.82
  },

  april_tag_optical_docking: {
    id: 'april_tag_optical_docking',
    title: 'AprilTag 36h11 Optical Target Docking',
    category: 'Perception',
    description:
      'Computer vision detection of standard AprilTag fiducial marker with autonomous homing to within ±2.0mm and ±1.5° orientation offset.',
    standardTargetTimeSec: 15.0,
    maxAllowedTimeSec: 35.0,
    toleranceMm: 2.0,
    globalCohortTimes: [
      18.2, 17.5, 19.8, 16.4, 21.0, 15.9, 18.7, 22.4, 16.1, 17.8,
      20.5, 19.1, 17.3, 18.9, 16.8, 23.0, 18.0, 17.1, 16.5, 19.4
    ],
    globalCohortSuccessRate: 0.74
  },

  ultrasonic_corner_evasion: {
    id: 'ultrasonic_corner_evasion',
    title: 'Ultrasonic Sonar Dual-Scan Corner Evasion',
    category: 'Navigation',
    description:
      'Autonomous navigation into a 60° acute angled corner obstacle followed by bilateral distance scanning and evasive exit without touch contact.',
    standardTargetTimeSec: 18.0,
    maxAllowedTimeSec: 40.0,
    toleranceMm: 5.0,
    globalCohortTimes: [
      21.5, 20.2, 23.4, 19.1, 24.8, 18.6, 22.0, 25.5, 19.8, 21.2,
      23.1, 20.7, 22.4, 24.0, 19.4, 26.2, 21.8, 20.5, 22.9, 21.0
    ],
    globalCohortSuccessRate: 0.78
  },

  precision_pick_and_place: {
    id: 'precision_pick_and_place',
    title: 'NIST Peg-in-Hole Precision Insertion',
    category: 'Manipulation',
    description:
      'Grasping a standardized 15mm cylindrical peg from the task board rack and inserting it into a chamfered fixture hole within 1.0mm tolerance.',
    standardTargetTimeSec: 25.0,
    maxAllowedTimeSec: 60.0,
    toleranceMm: 1.0,
    globalCohortTimes: [
      32.0, 29.5, 34.2, 28.1, 36.0, 27.4, 31.8, 38.5, 28.9, 30.5,
      33.8, 31.2, 29.8, 33.1, 28.0, 39.0, 32.5, 30.1, 29.2, 32.8
    ],
    globalCohortSuccessRate: 0.65
  },

  dynamic_maze_traversal: {
    id: 'dynamic_maze_traversal',
    title: '3x3 Modular Cell Maze Traversal',
    category: 'Navigation',
    description:
      'Autonomous exploration and shortest-path egress from a randomized orthogonal wall maze using flood-fill or wall-following odometry.',
    standardTargetTimeSec: 40.0,
    maxAllowedTimeSec: 90.0,
    toleranceMm: 10.0,
    globalCohortTimes: [
      48.5, 45.2, 52.0, 43.1, 56.4, 42.0, 49.8, 59.1, 44.5, 47.0,
      51.2, 48.0, 46.5, 50.8, 43.8, 61.0, 49.0, 46.2, 44.9, 48.7
    ],
    globalCohortSuccessRate: 0.69
  }
};

/**
 * Deterministically evaluates a series of student robotic runs against IEEE RAS TC-PEBRAS
 * benchmark standards and global competition normative cohorts.
 */
export function evaluateNistRoboticsBenchmark(
  trials: RobotRunTrial[],
  competitionId: CompetitionEcosystemId,
  taskType: NistTaskType
): BenchmarkEvaluationResult {
  const compDef = GLOBAL_COMPETITION_BENCHMARKS[competitionId];
  const taskDef = NIST_TC_PEBRAS_TASKS[taskType];

  if (trials.length === 0) {
    return {
      competitionId,
      taskType,
      trialCount: 0,
      successRate: 0,
      meanDurationSec: 0,
      medianDurationSec: 0,
      stdevDurationSec: 0,
      percentileRank: 50,
      developmentalBand: 'Emergent Explorer',
      kolmogorovSmirnovTest: {
        statisticName: 'Kolmogorov-Smirnov (D)',
        value: 0,
        pValueApprox: 1.0,
        isSignificant: false,
        interpretation: 'No trials recorded.'
      },
      anovaComparison: {
        statisticName: 'One-Way ANOVA (F)',
        value: 0,
        pValueApprox: 1.0,
        isSignificant: false,
        interpretation: 'No trials recorded.'
      },
      qualitativeSummary: 'Awaiting execution trials to formulate benchmark evidence.',
      evidenceTags: []
    };
  }

  const successCount = trials.filter((t) => t.success).length;
  const successRate = Math.round((successCount / trials.length) * 100) / 100;
  const durations = trials.map((t) => t.durationSec);
  const stats = calculateDescriptiveStats(durations);

  // Percentile rank based on successful trial speed relative to global cohort
  const medianTime = stats.median;
  const percentileRank = calculateTimePercentile(medianTime, taskDef.globalCohortTimes);

  // Two-sample Kolmogorov-Smirnov Test: student trials vs global cohort
  const ksResult = calculateKolmogorovSmirnov(durations, taskDef.globalCohortTimes);

  // One-way ANOVA comparing trial splits against the baseline group
  const anovaResult = calculateOneWayANOVA([durations, taskDef.globalCohortTimes]);

  // Determine qualitative developmental band (ZERO percentage or raw psychometric labels)
  let developmentalBand: BenchmarkEvaluationResult['developmentalBand'];
  if (percentileRank >= 85 && successRate >= 0.8) {
    developmentalBand = 'Advanced Master';
  } else if (percentileRank >= 60 && successRate >= 0.65) {
    developmentalBand = 'Competent Practitioner';
  } else if (percentileRank >= 35 && successRate >= 0.45) {
    developmentalBand = 'Developing Foundation';
  } else {
    developmentalBand = 'Emergent Explorer';
  }

  // Constructive qualitative summary
  let qualitativeSummary = '';
  switch (developmentalBand) {
    case 'Advanced Master':
      qualitativeSummary = `Exceptional autonomous repeatability. Trial consistency and execution times align strongly with elite national qualifiers for ${compDef.name}. High trajectory fidelity under NIST task board tolerances.`;
      break;
    case 'Competent Practitioner':
      qualitativeSummary = `Solid autonomous control and steady sensor response. The robot reliably meets baseline ${compDef.name} autonomous specifications with repeatable cycle times.`;
      break;
    case 'Developing Foundation':
      qualitativeSummary = `Demonstrating clear algorithmic problem-solving. Minor velocity oscillations or sensor noise observed during acute turns; foundation sprint recommended to refine PID tuning.`;
      break;
    case 'Emergent Explorer':
      qualitativeSummary = `Early exploratory stage. Focus on closed-loop sensor verification and mechanical wheel friction reduction before multi-point tournament routes.`;
      break;
  }

  const evidenceTags = [
    `comp:${compDef.id}`,
    `nist:${taskDef.id}`,
    `category:${taskDef.category.toLowerCase()}`,
    `band:${developmentalBand.toLowerCase().replace(/\s+/g, '_')}`,
    `trials:${trials.length}`,
    `success_rate:${Math.round(successRate * 100)}%`
  ];

  return {
    competitionId,
    taskType,
    trialCount: trials.length,
    successRate,
    meanDurationSec: stats.mean,
    medianDurationSec: stats.median,
    stdevDurationSec: stats.stdev,
    percentileRank,
    developmentalBand,
    kolmogorovSmirnovTest: ksResult,
    anovaComparison: anovaResult,
    qualitativeSummary,
    evidenceTags
  };
}
