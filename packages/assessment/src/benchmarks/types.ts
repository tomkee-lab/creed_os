export type CompetitionEcosystemId =
  | 'fll'
  | 'ftc'
  | 'frc'
  | 'viqrc'
  | 'v5rc'
  | 'wro'
  | 'robocup_jr'
  | 'zero_robotics'
  | 'botball'
  | 'techradiance'
  | 'avishkaar'
  | 'atl_marathon';

export type EducationStage = 'preparatory' | 'middle' | 'secondary';

export interface CompetitionBenchmarkDefinition {
  id: CompetitionEcosystemId;
  name: string;
  organizer: string;
  region: 'Global' | 'Americas' | 'Asia-Pacific' | 'India / Regional';
  targetStage: EducationStage;
  targetClasses: string;
  coreFocus: string;
  rubricCriteria: Array<{
    id: string;
    dimension: string;
    description: string;
    weight: number; // 0.0 - 1.0
  }>;
  normativeExecutionTimeSec: {
    mean: number;
    stdev: number;
    sampleSize: number;
  };
  normativeSuccessRate: number; // 0.0 - 1.0
}

export type NistTaskType =
  | 'line_tracking_autonomy'
  | 'april_tag_optical_docking'
  | 'ultrasonic_corner_evasion'
  | 'precision_pick_and_place'
  | 'dynamic_maze_traversal';

export interface NistTaskBoardTask {
  id: NistTaskType;
  title: string;
  category: 'Kinematics' | 'Perception' | 'Manipulation' | 'Navigation';
  description: string;
  standardTargetTimeSec: number;
  maxAllowedTimeSec: number;
  toleranceMm: number;
  globalCohortTimes: number[]; // Normative baseline times in seconds
  globalCohortSuccessRate: number;
}

export interface RobotRunTrial {
  trialIndex: number;
  taskType: NistTaskType;
  success: boolean;
  durationSec: number;
  trajectoryDeviationsMm: number[];
  collisionsCount: number;
  telemetryDataPoints: number;
}

export interface StatisticalTestResult {
  statisticName: string;
  value: number;
  pValueApprox: number;
  isSignificant: boolean; // p < 0.05
  interpretation: string;
}

export interface BenchmarkEvaluationResult {
  competitionId: CompetitionEcosystemId;
  taskType: NistTaskType;
  trialCount: number;
  successRate: number;
  meanDurationSec: number;
  medianDurationSec: number;
  stdevDurationSec: number;
  percentileRank: number; // 0 - 100
  developmentalBand: 'Emergent Explorer' | 'Developing Foundation' | 'Competent Practitioner' | 'Advanced Master';
  kolmogorovSmirnovTest: StatisticalTestResult;
  anovaComparison: StatisticalTestResult;
  qualitativeSummary: string;
  evidenceTags: string[];
}
