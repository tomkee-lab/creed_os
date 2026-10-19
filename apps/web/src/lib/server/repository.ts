import type {
  LearnerProfile,
  LearnerEvidence,
  Pathway,
  AssessmentSession,
  AssessmentItem,
  CompetencyDomain,
  ConsentRecord
} from '@core-os/domain';
import { isConsentActive, StatutoryConsentError } from '@core-os/domain';
import crypto from 'node:crypto';
import { queryDb, getDbPool, isCloudDatabaseEnabled } from './supabase';
import {
  CALIBRATED_ITEM_BANK,
  STEM_BENCHMARK_ITEMS,
  ENGLISH_BENCHMARK_ITEMS,
  ROBOTICS_BENCHMARK_ITEMS,
  getBenchmarkItemsByDomain,
  generateGlobalBenchmarkReport,
  type GlobalBenchmarkReport,
  type BenchmarkDomain
} from '@core-os/assessment';

export interface DifferentiatedLessonPlan {
  id: string;
  title: string;
  subject: 'STEM Reasoning' | 'English Literacy' | 'Autonomous Robotics';
  targetGrade: string;
  durationMinutes: number;
  alignedStandards: string[];
  targetedMisconception: {
    tag: string;
    label: string;
    diagnosis: string;
  };
  pedagogicalFramework: 'PRIMM' | 'CRA (Concrete-Representational-Abstract)' | 'Productive Struggle Scaffolding';
  tier1Remediation: {
    tierTitle: string;
    studentTarget: string;
    scaffoldStrategy: string;
    tactileActivity: string;
    checkQuestion: string;
  };
  tier2Core: {
    tierTitle: string;
    studentTarget: string;
    collaborativeTask: string;
    evidenceCheckpoint: string;
  };
  tier3Extension: {
    tierTitle: string;
    studentTarget: string;
    inquiryChallenge: string;
    evaluationRubric: string;
  };
  teacherFacilitatorNotes: string[];
  createdAt: string;
}

export interface PedagogicalPlaybook {
  id: string;
  frameworkName: string;
  tagline: string;
  domain: 'STEM' | 'English' | 'Robotics' | 'Universal';
  corePrinciples: Array<{ principle: string; explanation: string }>;
  classroomImplementationSteps: Array<{ step: number; title: string; teacherAction: string; studentAction: string }>;
  misconceptionInterventions: Array<{ misconception: string; whatNotToDo: string; recommendedIntervention: string }>;
}

export interface TeacherStudentSummary {
  id: string;
  name: string;
  overallReadiness: string;
  weakestCompetency: CompetencyDomain;
  weakestScore: number;
  strongestCompetency: CompetencyDomain;
  activeGapRemediation: string;
  stemScore?: string;
  englishScore?: string;
  roboticsScore?: string;
}

export interface ClassCohort {
  id: string;
  name: string;
  grade: number;
  totalStudents: number;
  students: TeacherStudentSummary[];
  misconceptionClusters: Array<{
    clusterName: string;
    affectedCompetency: CompetencyDomain;
    studentCount: number;
    recommendedDifferentiatedActivity: string;
  }>;
}

export interface StemMission {
  id: string;
  title: string;
  code: string;
  domain: CompetencyDomain;
  domainTitle: string;
  stage: 'preparatory' | 'middle' | 'secondary';
  stageLabel: string;
  targetGrades: string;
  estimatedMinutes: number;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Olympiad';
  brief: string;
  pedagogicalObjective: string;
  simulatorType: 'truss' | 'grid_rover' | 'gear_train' | 'sensor_telemetry' | 'obstacle_avoidance' | 'winch_lift' | 'cv_vision' | 'pid_control' | 'planetary_space';
  alignedStandards: string[];
  prerequisites: string[];
  starterCode?: string;
  rubricCriteria: Array<{
    criterion: string;
    target: string;
    importance: 'Primary' | 'Mandatory' | 'Safety Margin' | 'Excellence';
  }>;
}

export const STEM_MISSIONS: StemMission[] = [
  {
    id: 'robobridge',
    title: 'RoboBridge Structural Optimization Challenge',
    code: 'MISSION-STRUCT-01',
    domain: 'spatial_reasoning',
    domainTitle: 'Spatial Reasoning & Statics',
    stage: 'middle',
    stageLabel: 'Middle Stage (Classes 6–8)',
    targetGrades: 'Classes 6–8',
    estimatedMinutes: 20,
    difficulty: 'Intermediate',
    brief: 'An autonomous planetary exploration rover needs to cross a 12-meter terrain chasm. Design an optimal bridge truss that withstands a 1,200kg test load with minimal structural mass and minimal center-span deflection.',
    pedagogicalObjective: 'Understand vector tension and compression distribution across Warren, Pratt, and Howe truss configurations.',
    simulatorType: 'truss',
    alignedStandards: ['PISA Science Level 5', 'TIMSS Physics Statics', 'NEP 2020 Experiential Learning'],
    prerequisites: ['Basic geometric trigonometry', 'Static force equilibrium'],
    rubricCriteria: [
      { criterion: 'Strength-to-Weight Ratio', target: '≥ 4.5x load capacity', importance: 'Primary' },
      { criterion: 'Structural Mass Ceiling', target: '≤ 250 kg total mass', importance: 'Mandatory' },
      { criterion: 'Center-Span Deflection', target: '< 18 mm under full test load', importance: 'Safety Margin' }
    ]
  },
  {
    id: 'climate-sensor',
    title: 'Urban Heat Island Pattern Discovery',
    code: 'MISSION-DATA-01',
    domain: 'computational_thinking',
    domainTitle: 'Computational Thinking & Telemetry',
    stage: 'middle',
    stageLabel: 'Middle Stage (Classes 6–8)',
    targetGrades: 'Classes 6–8',
    estimatedMinutes: 20,
    difficulty: 'Intermediate',
    brief: 'Analyze 10,000 spatial telemetry temperature feeds from urban sensors, filter high-frequency noise artifacts, compensate for thermal drift, and isolate microclimate heat anomalies with 95% statistical confidence.',
    pedagogicalObjective: 'Master data cleaning, moving average signal filtering, and statistical confidence intervals on real-world IoT telemetry.',
    simulatorType: 'sensor_telemetry',
    alignedStandards: ['CSTA 2-DA-08', 'CBSE AI Curriculum Code 417', 'OECD Data Literacy'],
    prerequisites: ['Mean and standard deviation', 'Basic threshold logic'],
    rubricCriteria: [
      { criterion: 'Data Cleaning Completeness', target: 'Eliminate 100% sensor drift artifacts', importance: 'Primary' },
      { criterion: 'Statistical Confidence', target: '≥ 95% Confidence Interval on delta-T', importance: 'Mandatory' },
      { criterion: 'False Positive Rejection', target: '< 2% spurious heat warnings', importance: 'Safety Margin' }
    ]
  },
  {
    id: 'mars-rover-pathfinder',
    title: 'Mars Surface 2D Grid Sonar Pathfinder',
    code: 'MISSION-ROBOT-01',
    domain: 'computational_thinking',
    domainTitle: 'Algorithmic Thinking & Navigation',
    stage: 'preparatory',
    stageLabel: 'Preparatory Stage (Classes 3–5)',
    targetGrades: 'Classes 3–5',
    estimatedMinutes: 15,
    difficulty: 'Foundational',
    brief: 'A planetary rover must traverse an uncharted 5x5 Martian terrain grid avoiding craters. Program the exact sequence of motion commands [MOVE FORWARD, TURN RIGHT 90°, TURN LEFT 90°] to reach the landing base with zero collisions.',
    pedagogicalObjective: 'Build mental models of sequential algorithmic decomposition, orientation frames of reference, and coordinate mapping.',
    simulatorType: 'grid_rover',
    alignedStandards: ['CBSE Circular Acad-15/2026 CT Framework', 'CSTA 1A-AP-10', 'FLL Explore Rubric'],
    prerequisites: ['Cardinal directions', 'Basic 2D grid coordinates'],
    rubricCriteria: [
      { criterion: 'Navigation Accuracy', target: '100% destination reach without crater collisions', importance: 'Primary' },
      { criterion: 'Step Efficiency', target: 'Optimal path within ≤ 8 command steps', importance: 'Excellence' },
      { criterion: 'Orientation Invariance', target: 'Zero rotational direction inversions', importance: 'Mandatory' }
    ]
  },
  {
    id: 'gear-train-mechanics',
    title: 'Gear Train Mechanical Advantage & Torque Transmission',
    code: 'MISSION-MECH-01',
    domain: 'quantitative_reasoning',
    domainTitle: 'Quantitative Reasoning & Kinematics',
    stage: 'preparatory',
    stageLabel: 'Preparatory Stage (Classes 3–5)',
    targetGrades: 'Classes 3–5',
    estimatedMinutes: 15,
    difficulty: 'Foundational',
    brief: 'A rover drive axle requires maximum climbing torque. Connect a driving gear with driven gears to calculate the final angular velocity, rotational direction, and mechanical advantage required to scale a 25° incline.',
    pedagogicalObjective: 'Understand the reciprocal relationship between angular speed (RPM) and torque via integer tooth ratios.',
    simulatorType: 'gear_train',
    alignedStandards: ['FLL SPIKE Prime Kinematics', 'TIMSS Science Physical Forces', 'VEX IQ Mechanical Foundation'],
    prerequisites: ['Integer multiplication and division', 'Rotational clockwise/counter-clockwise sense'],
    rubricCriteria: [
      { criterion: 'Gear Ratio Precision', target: 'Exact calculation of speed reduction ratio', importance: 'Primary' },
      { criterion: 'Rotation Direction State', target: 'Correct parity for multi-gear mesh', importance: 'Mandatory' },
      { criterion: 'Torque Balance Verification', target: 'Demonstrate conservation of mechanical power', importance: 'Safety Margin' }
    ]
  },
  {
    id: 'sonar-autonomous-rover',
    title: 'Autonomous Rover Obstacle Avoidance & Sensor Feedback',
    code: 'MISSION-ROBOT-02',
    domain: 'computational_thinking',
    domainTitle: 'Sensor Feedback & Autonomous Systems',
    stage: 'middle',
    stageLabel: 'Middle Stage (Classes 6–8)',
    targetGrades: 'Classes 6–8',
    estimatedMinutes: 25,
    difficulty: 'Intermediate',
    brief: 'Equip an autonomous rover with ultrasonic range-finding to navigate a dynamic proving ground. Overcome the classic corner trap flaw by implementing multi-directional scanning and state-machine recovery.',
    pedagogicalObjective: 'Replace naive single-direction reactive loops with finite-state machine (FSM) scanning and proportional speed tapering.',
    simulatorType: 'obstacle_avoidance',
    alignedStandards: ['WRO RoboMission Junior', 'CSTA 2-CS-02', 'FLL Challenge Autonomous Rubric'],
    prerequisites: ['Conditional branching (if/else)', 'Sensor threshold polling'],
    rubricCriteria: [
      { criterion: 'Corner Trap Evasion', target: '100% escape from 90° concave corners', importance: 'Primary' },
      { criterion: 'Continuous Drive Speed', target: 'Maintain average velocity ≥ 45 cm/s', importance: 'Mandatory' },
      { criterion: 'Sensor Deadzone Margin', target: 'Zero collisions within 5cm ultrasonic blind spot', importance: 'Safety Margin' }
    ]
  },
  {
    id: 'frc-winch-kinematics',
    title: 'Vertical Winch Kinematics & Motor Holding Torque',
    code: 'MISSION-PHYS-01',
    domain: 'quantitative_reasoning',
    domainTitle: 'Applied Physics & Mechanical Statics',
    stage: 'secondary',
    stageLabel: 'Secondary Stage (Classes 9–12)',
    targetGrades: 'Classes 9–12',
    estimatedMinutes: 25,
    difficulty: 'Advanced',
    brief: 'A 120-pound FIRST Robotics Competition (FRC) robot must hold its position on a vertical climb chain. Calculate the minimum motor holding torque required at varying spool drum radii, incorporating planetary gear reduction ratios.',
    pedagogicalObjective: 'Synthesize rotational torque tau = r x F, gearhead mechanical efficiency, and motor stall current curves.',
    simulatorType: 'winch_lift',
    alignedStandards: ['FRC Engineering Principles', 'AP Physics 1 Rotational Dynamics', 'CBSE Class 11 Mechanics'],
    prerequisites: ['Rotational equilibrium', 'Vector cross products', 'Gravitational weight'],
    rubricCriteria: [
      { criterion: 'Torque Calculation Accuracy', target: 'Exact minimum holding torque tau >= r * F_g', importance: 'Primary' },
      { criterion: 'Planetary Stage Optimization', target: 'Select optimal reduction ratio (e.g. 25:1)', importance: 'Mandatory' },
      { criterion: 'Safety Factor Headroom', target: '≥ 1.5x factor of safety above stall torque', importance: 'Safety Margin' }
    ]
  },
  {
    id: 'cv-element-tracker',
    title: 'Computer Vision Color Segmentation & HSV Thresholding',
    code: 'MISSION-AI-01',
    domain: 'computational_thinking',
    domainTitle: 'Applied AI & Computer Vision',
    stage: 'secondary',
    stageLabel: 'Secondary Stage (Classes 9–12)',
    targetGrades: 'Classes 9–12',
    estimatedMinutes: 25,
    difficulty: 'Advanced',
    brief: 'Develop a computer vision pipeline to detect yellow game pieces on an autonomous robotics competition field under fluctuating ambient lighting. Convert RGB/BGR frames to HSV to isolate illumination from chrominance.',
    pedagogicalObjective: 'Understand color space geometry, hue angle invariance, and binary mask contour filtering in automated perception.',
    simulatorType: 'cv_vision',
    alignedStandards: ['WRO Future Engineers Vision Rubric', 'CBSE AI Subject Code 417/843', 'CSTA 3A-AP-16'],
    prerequisites: ['Array matrix representation', 'Color spaces (RGB vs HSV)'],
    rubricCriteria: [
      { criterion: 'Lighting Invariance', target: 'Consistent detection under 200–1200 lux variation', importance: 'Primary' },
      { criterion: 'Bounding Box IOU', target: 'Intersection-over-Union ≥ 0.85 on target element', importance: 'Mandatory' },
      { criterion: 'Inference Latency', target: '< 15 ms per frame pipeline latency', importance: 'Excellence' }
    ]
  },
  {
    id: 'closed-loop-pid',
    title: 'Closed-Loop PID Heading & Variable Ballast Stabilizer',
    code: 'MISSION-CTRL-01',
    domain: 'quantitative_reasoning',
    domainTitle: 'Control Systems & Closed-Loop Dynamics',
    stage: 'secondary',
    stageLabel: 'Secondary Stage (Classes 9–12)',
    targetGrades: 'Classes 9–12',
    estimatedMinutes: 30,
    difficulty: 'Olympiad',
    brief: 'Tune the Proportional, Integral, and Derivative gains of an autonomous underwater robot ballast system. Eliminate steady-state depth drift and dampen resonant oscillations during sudden hydrodynamic turbulence.',
    pedagogicalObjective: 'Analyze error signals, steady-state offset (Kp), cumulative bias (Ki), and rate-of-change damping (Kd).',
    simulatorType: 'pid_control',
    alignedStandards: ['IEEE Robotics Automation TC-PEBRAS', 'WRO RoboMission Senior', 'University Engineering Bridging'],
    prerequisites: ['Differential calculus / rate of change', 'Closed-loop feedback concepts'],
    rubricCriteria: [
      { criterion: 'Overshoot Damping', target: 'Maximum overshoot < 8% of step setpoint', importance: 'Primary' },
      { criterion: 'Settling Time', target: 'Step response settles within ± 2% in < 2.5s', importance: 'Mandatory' },
      { criterion: 'Steady-State Error', target: 'e_ss = 0 via integral action without windup', importance: 'Excellence' }
    ]
  },
  {
    id: 'mission-iss-speed',
    title: 'Orbital Mechanics: Calculate the ISS Velocity',
    code: 'MISSION-SPACE-01',
    domain: 'quantitative_reasoning',
    domainTitle: 'Quantitative Kinematics & Orbital Dynamics',
    stage: 'secondary',
    stageLabel: 'Secondary Stage (Classes 9–12)',
    targetGrades: 'Classes 9–10',
    estimatedMinutes: 20,
    difficulty: 'Intermediate',
    brief: 'Calculate the instantaneous orbital velocity of the International Space Station from its Keplerian ground fixes. The ISS orbits Earth every ~92 minutes at an altitude of approximately 418 kilometers.',
    pedagogicalObjective: 'Understand Keplerian orbital mechanics, centrifugal-gravitational equilibrium, and ground-track propagation.',
    simulatorType: 'planetary_space',
    alignedStandards: ['CBSE Physics Class 11 Gravitation', 'PISA Scientific Literacy', 'TIMSS Advanced Physics'],
    prerequisites: ['Uniform circular motion', 'Newtonian gravitation law'],
    rubricCriteria: [
      { criterion: 'Orbital Velocity Calculation', target: '27,600 km/h ± 6% tolerance', importance: 'Mandatory' },
      { criterion: 'Orbital Period Verification', target: 'T ≈ 92.6 minutes', importance: 'Primary' },
      { criterion: 'Evidence Provenance', target: 'State vectors captured from Orbital SGP4 Telemetry HUD', importance: 'Excellence' }
    ]
  },
  {
    id: 'mission-cyclone-path',
    title: 'Tropical Cyclone Track & Landfall Horizon Estimation',
    code: 'MISSION-SPACE-02',
    domain: 'computational_thinking',
    domainTitle: 'Computational Earth Science & Meteorology',
    stage: 'middle',
    stageLabel: 'Middle Stage (Classes 6–8)',
    targetGrades: 'Classes 6–8',
    estimatedMinutes: 20,
    difficulty: 'Intermediate',
    brief: 'Inspect advisory uncertainty cones and estimate the coastal landfall timeline for an active storm system in the Arabian Sea using geostationary satellite telemetry.',
    pedagogicalObjective: 'Master vector tracking, isobaric gradient analysis, and risk uncertainty estimation on geospatial feeds.',
    simulatorType: 'planetary_space',
    alignedStandards: ['CBSE Geography Class 8 Natural Hazards', 'OECD Earth Systems Literacy'],
    prerequisites: ['Speed, distance, time formula', 'Compass coordinates'],
    rubricCriteria: [
      { criterion: 'Landfall Timeline Estimation', target: '18 hours ± 15% tolerance', importance: 'Mandatory' },
      { criterion: 'Translation Speed Vector', target: 'Forward propagation vector measured', importance: 'Primary' }
    ]
  },
  {
    id: 'mission-great-circle',
    title: 'Aeronautics: Great-Circle Polar Routing vs Flat Mapping',
    code: 'MISSION-SPACE-03',
    domain: 'spatial_reasoning',
    domainTitle: 'Spherical Geometry & Navigation',
    stage: 'secondary',
    stageLabel: 'Secondary Stage (Classes 9–12)',
    targetGrades: 'Classes 11–12',
    estimatedMinutes: 25,
    difficulty: 'Advanced',
    brief: 'Demonstrate spherical geodesic fuel and distance conservation across polar flight corridors comparing WGS84 geodesic arcs against Mercator projection lines.',
    pedagogicalObjective: 'Understand non-Euclidean spherical trigonometry, map projection distortions, and flight fuel optimization.',
    simulatorType: 'planetary_space',
    alignedStandards: ['CBSE Mathematics Class 12 Vector Geometry', 'ICAO Polar Navigation Standards'],
    prerequisites: ['Spherical coordinate systems', 'Map projection basics'],
    rubricCriteria: [
      { criterion: 'Distance Conservation Calculation', target: '1,850 km saved ± 10% tolerance', importance: 'Mandatory' },
      { criterion: 'Geodesic Curvature Verification', target: 'Orthodromic route verified in 3D', importance: 'Primary' }
    ]
  },
  {
    id: 'mission-gear-train',
    title: 'RoboBridge Structural Optimization & Gear Train Mechanics',
    code: 'MISSION-MECH-02',
    domain: 'spatial_reasoning',
    domainTitle: 'Mechanical Advantage & Structural Statics',
    stage: 'middle',
    stageLabel: 'Middle Stage (Classes 6–8)',
    targetGrades: 'Classes 7–9',
    estimatedMinutes: 20,
    difficulty: 'Intermediate',
    brief: 'Design and optimize a compound gear train and structural truss bridge. Calculate velocity ratios, mechanical advantage, and load distribution under variable robotic vehicle stress.',
    pedagogicalObjective: 'Master gear tooth ratios, torque multipliers, and truss moment equilibrium.',
    simulatorType: 'gear_train',
    alignedStandards: ['CBSE Science Class 8 Force and Pressure', 'PISA Engineering Design'],
    prerequisites: ['Basic ratio calculation', 'Lever and torque principles'],
    rubricCriteria: [
      { criterion: 'Velocity Ratio Calculation', target: 'VR = 4.0 ± 5% tolerance', importance: 'Mandatory' },
      { criterion: 'Structural Stress Equilibrium', target: 'Truss deflection < 2mm under 50N load', importance: 'Primary' }
    ]
  },
  {
    id: 'mission-telemetry-filter',
    title: 'Urban Climate Heat-Island Discovery & Telemetry Filtering',
    code: 'MISSION-AI-02',
    domain: 'computational_thinking',
    domainTitle: 'Sensor Telemetry & Environmental Informatics',
    stage: 'middle',
    stageLabel: 'Middle Stage (Classes 6–8)',
    targetGrades: 'Classes 7–9',
    estimatedMinutes: 25,
    difficulty: 'Intermediate',
    brief: 'Process noisy multi-sensor microclimate telemetry across urban transit corridors. Apply rolling average and Kalman noise filtering to isolate thermal anomalies and heat-island gradients.',
    pedagogicalObjective: 'Understand time-series noise filtering, spatial sensor clustering, and environmental data literacy.',
    simulatorType: 'sensor_telemetry',
    alignedStandards: ['CBSE Geography Class 8 Climate and Weather', 'CSTA 2-DA-08 Data Analysis'],
    prerequisites: ['Statistical mean and variance', 'Basic Python list operations'],
    rubricCriteria: [
      { criterion: 'Noise Reduction SNR', target: 'Signal-to-noise improvement ≥ 12 dB', importance: 'Mandatory' },
      { criterion: 'Thermal Gradient Detection', target: 'Accurately locate microclimate hot-spots', importance: 'Primary' }
    ]
  }
];

/**
 * Resilient In-Memory & Dual-Mode Local Repository for Core_OS.
 * Provides rich deterministic data out-of-the-box with zero setup required.
 */
class LocalCoreRepository {
  private learnerProfiles: Map<string, LearnerProfile> = new Map();
  private assessmentSessions: Map<string, AssessmentSession> = new Map();
  private evidenceStore: Map<string, LearnerEvidence[]> = new Map();
  private itemBank: AssessmentItem[] = [...CALIBRATED_ITEM_BANK];
  private pathways: Pathway[] = [];
  private classCohort: ClassCohort;
  private benchmarkReports: Map<string, GlobalBenchmarkReport[]> = new Map();
  private lessonPlans: DifferentiatedLessonPlan[] = [];
  private playbooks: PedagogicalPlaybook[] = [];
  private missions: StemMission[] = [...STEM_MISSIONS];
  private consentRecords: Map<string, ConsentRecord> = new Map();
  private guardianLearnerMap: Map<string, Set<string>> = new Map();

  constructor() {
    // 1. Initialize Baseline Learner Profile
    const defaultLearnerId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const now = new Date().toISOString();

    const initialProfile: LearnerProfile = {
      id: defaultLearnerId,
      userId: defaultLearnerId,
      fullName: 'Student Learner',
      age: 13,
      gradeBand: 'Class 8 (Middle Stage)',
      schoolName: 'Affiliated Educational Institution',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      activeFocusCompetency: 'quantitative_reasoning',
      competencies: {
        spatial_reasoning: {
          competency: 'spatial_reasoning',
          title: 'Spatial Reasoning',
          score: 4.5,
          theta: 1.45,
          standardError: 0.28,
          descriptor: 'Advanced',
          confidence: 0.94,
          lastAssessedAt: now
        },
        computational_thinking: {
          competency: 'computational_thinking',
          title: 'Computational Thinking',
          score: 4.1,
          theta: 1.15,
          standardError: 0.31,
          descriptor: 'Advanced',
          confidence: 0.89,
          lastAssessedAt: now
        },
        logical_deduction: {
          competency: 'logical_deduction',
          title: 'Logical Deduction',
          score: 3.8,
          theta: 0.85,
          standardError: 0.35,
          descriptor: 'Proficient',
          confidence: 0.86,
          lastAssessedAt: now
        },
        scientific_inquiry: {
          competency: 'scientific_inquiry',
          title: 'Scientific Inquiry',
          score: 3.6,
          theta: 0.70,
          standardError: 0.38,
          descriptor: 'Proficient',
          confidence: 0.82,
          lastAssessedAt: now
        },
        quantitative_reasoning: {
          competency: 'quantitative_reasoning',
          title: 'Quantitative Reasoning',
          score: 2.8,
          theta: -0.15,
          standardError: 0.42,
          descriptor: 'Developing',
          confidence: 0.88,
          lastAssessedAt: now
        },
        systems_thinking: {
          competency: 'systems_thinking',
          title: 'Systems Thinking',
          score: 3.2,
          theta: 0.30,
          standardError: 0.45,
          descriptor: 'Expected',
          confidence: 0.76,
          lastAssessedAt: now
        },
        creative_problem_solving: {
          competency: 'creative_problem_solving',
          title: 'Creative Problem Solving',
          score: 4.2,
          theta: 1.20,
          standardError: 0.33,
          descriptor: 'Advanced',
          confidence: 0.90,
          lastAssessedAt: now
        },
        metacognition: {
          competency: 'metacognition',
          title: 'Metacognition',
          score: 3.4,
          theta: 0.45,
          standardError: 0.40,
          descriptor: 'Expected',
          confidence: 0.79,
          lastAssessedAt: now
        },
        verbal_reasoning: {
          competency: 'verbal_reasoning',
          title: 'Verbal Reasoning',
          score: 3.5,
          theta: 0.52,
          standardError: 0.35,
          descriptor: 'Proficient',
          confidence: 0.84,
          lastAssessedAt: now
        },
        language_literacy: {
          competency: 'language_literacy',
          title: 'Language & Literacy',
          score: 3.6,
          theta: 0.58,
          standardError: 0.34,
          descriptor: 'Proficient',
          confidence: 0.85,
          lastAssessedAt: now
        }
      },
      recentEvidence: [],
      savedPathways: ['PATH-ROBOTICS', 'PATH-AI-DATA'],
      mismatchAnalyses: {},
      completedMissions: [
        {
          missionId: 'MISSION-ROBOT-01',
          pathwayId: 'PATH-ROBOTICS',
          title: 'RoboBridge Structural Optimization Challenge',
          completedAt: '2026-09-28T14:30:00Z',
          rating: 4.8,
          reflectionText: 'Found that triangle trusses distribute tension much better than rectangular boxes when load increases.'
        }
      ],
      updatedAt: now
    };

    this.learnerProfiles.set(defaultLearnerId, initialProfile);

    // 2. Initialize Seed Evidence
    const seedEvidence: LearnerEvidence[] = [
      {
        id: 'e1000000-0001-0000-0000-000000000001',
        learnerId: defaultLearnerId,
        competency: 'spatial_reasoning',
        evidenceType: 'diagnostic_response',
        sourceType: 'cat_assessment',
        sourceTitle: 'Middle Stage Diagnostic Assessment #AS-894',
        summary: 'Correctly solved 3D cube face projection and isometric cross-section tasks.',
        observedValue: { theta: 1.45, standardError: 0.28 },
        confidence: 0.94,
        evidenceStrength: 3,
        status: 'accepted',
        visibility: 'guardian',
        observedAt: '2026-09-24T10:15:00Z',
        createdAt: '2026-09-24T10:15:00Z'
      },
      {
        id: 'e1000000-0002-0000-0000-000000000002',
        learnerId: defaultLearnerId,
        competency: 'spatial_reasoning',
        evidenceType: 'project_rubric',
        sourceType: 'project_mission',
        sourceTitle: 'RoboBridge Structural Optimization Challenge',
        summary: 'Submitted load-bearing truss with optimal 4.8x load-to-mass ratio.',
        observedValue: { rubricCriteria: { geometricOptimization: 96, stability: 92 } },
        confidence: 0.92,
        evidenceStrength: 4,
        status: 'accepted',
        visibility: 'guardian',
        observedAt: '2026-09-28T14:30:00Z',
        createdAt: '2026-09-28T14:30:00Z'
      },
      {
        id: 'e1000000-0003-0000-0000-000000000003',
        learnerId: defaultLearnerId,
        competency: 'quantitative_reasoning',
        evidenceType: 'diagnostic_response',
        sourceType: 'cat_assessment',
        sourceTitle: 'Middle Stage Diagnostic Assessment #AS-894',
        summary: 'Diagnosed foundation misconception on variable sign transposition in linear balance equations.',
        observedValue: { theta: -0.15, standardError: 0.42, misconceptionsIdentified: ['MISC_SIGN_INVERSION'] },
        confidence: 0.88,
        evidenceStrength: 3,
        status: 'accepted',
        visibility: 'guardian',
        observedAt: '2026-09-24T10:25:00Z',
        createdAt: '2026-09-24T10:25:00Z'
      },
      {
        id: 'e1000000-0004-0000-0000-000000000004',
        learnerId: defaultLearnerId,
        competency: 'computational_thinking',
        evidenceType: 'teacher_observation',
        sourceType: 'teacher_observation',
        sourceTitle: 'Classroom CT Lab: Sorting Algorithms',
        summary: 'Observed student independently deducing divide-and-conquer strategy for binary search.',
        observedValue: { qualitativeNotes: 'Exceptional pattern decomposition observed during peer programming.' },
        confidence: 0.90,
        evidenceStrength: 4,
        status: 'accepted',
        visibility: 'teacher',
        observedAt: '2026-10-02T11:45:00Z',
        createdAt: '2026-10-02T11:45:00Z'
      }
    ];

    this.evidenceStore.set(defaultLearnerId, seedEvidence);
    initialProfile.recentEvidence = seedEvidence;

    // 3. Initialize Pathways
    this.pathways = [
      {
        id: 'PATH-ROBOTICS',
        code: 'ROBOTICS-01',
        field: 'engineering',
        title: 'Robotics & Autonomous Systems',
        tagline: 'Engineer intelligent electromechanical systems that interact dynamically with the physical world.',
        overview: 'Robotics merges physical kinematics, computer vision, sensor fusion, and real-time embedded systems. Students design autonomous mechanisms, robotic arms, and self-navigating vehicles.',
        growthOutlook: '+28% Projected 10-Year Growth in automation and robotic systems.',
        requirements: [
          { competency: 'spatial_reasoning', minimumLevel: 3.5, importance: 'critical_foundation' },
          { competency: 'quantitative_reasoning', minimumLevel: 3.2, importance: 'critical_foundation' },
          { competency: 'computational_thinking', minimumLevel: 3.0, importance: 'strongly_recommended' },
          { competency: 'scientific_inquiry', minimumLevel: 2.8, importance: 'desirable' }
        ],
        routes: [
          {
            id: 'r1',
            type: 'university_degree',
            title: 'B.Tech Mechatronics & Autonomous Engineering',
            durationYears: 4,
            description: 'Rigorous undergraduate engineering program with hands-on kinematics laboratory work.',
            entryMilestones: ['Physics & Advanced Mathematics Foundations', 'Competitive Entrance Examination']
          },
          {
            id: 'r2',
            type: 'polytechnic_diploma',
            title: 'Polytechnic Diploma in Robotics Automation',
            durationYears: 3,
            description: 'Direct applied hands-on engineering training with industrial PLC certification.',
            entryMilestones: ['Class 10 Science & Math Foundations']
          },
          {
            id: 'r3',
            type: 'project_portfolio',
            title: 'Applied Hardware & Open-Source Portfolio',
            durationYears: 2,
            description: 'Demonstrated ROS (Robot Operating System) contributions and physical robot build logs.',
            entryMilestones: ['3 Verified Project Missions in CREED OS']
          }
        ],
        missions: [
          {
            id: 'MISSION-ROBOT-01',
            pathwayId: 'PATH-ROBOTICS',
            title: 'RoboBridge Structural Optimization Challenge',
            headline: 'Design a lightweight bridge truss carrying 5x its own weight.',
            description: 'Construct an isometric truss structure balancing compressive and tensile load vectors under strict weight limits.',
            durationMinutes: 45,
            difficulty: 'intermediate',
            competenciesTested: ['spatial_reasoning', 'quantitative_reasoning'],
            scenario: 'A supply rover must cross a 14-meter gorge. You are allocated 40 carbon fiber struts.',
            constraints: ['Maximum total mass: 250 kg', 'Deflection under load must not exceed 2 cm'],
            deliverable: 'A completed structural node coordinate plan and load deflection graph.'
          },
          {
            id: 'MISSION-ROBOT-02',
            pathwayId: 'PATH-ROBOTICS',
            title: 'Autonomous Maze Wall-Follower Sensor Tuning',
            headline: 'Tune ultrasonic proximity thresholds for collision-free rover navigation.',
            description: 'Write reactive control logic reacting to real-time distance measurements.',
            durationMinutes: 30,
            difficulty: 'introductory',
            competenciesTested: ['computational_thinking', 'systems_thinking'],
            scenario: 'Rover trapped in an unknown subterranean grid with zero wireless GPS.',
            constraints: ['Halt within 5 cm of wall', 'Avoid cyclical corner trap loops'],
            deliverable: 'Reactive state machine flowchart and sensor threshold constants.'
          }
        ]
      },
      {
        id: 'PATH-AI-DATA',
        code: 'DATA-AI-01',
        field: 'computing_ai',
        title: 'Data Intelligence & Machine Learning',
        tagline: 'Discover hidden patterns in complex multidimensional data to solve critical challenges.',
        overview: 'Data Intelligence combines statistical analysis, algorithmic efficiency, and machine learning models to make sense of satellite imagery, medical sensors, and financial trends.',
        growthOutlook: '+34% Projected 10-Year Global Growth across AI engineering.',
        requirements: [
          { competency: 'computational_thinking', minimumLevel: 3.5, importance: 'critical_foundation' },
          { competency: 'quantitative_reasoning', minimumLevel: 3.4, importance: 'critical_foundation' },
          { competency: 'logical_deduction', minimumLevel: 3.2, importance: 'strongly_recommended' },
          { competency: 'scientific_inquiry', minimumLevel: 3.0, importance: 'desirable' }
        ],
        routes: [
          {
            id: 'r4',
            type: 'university_degree',
            title: 'B.S. / B.Tech Computer Science & Data Science',
            durationYears: 4,
            description: 'Core computer science curriculum with linear algebra and deep learning theory.',
            entryMilestones: ['Mathematics & Algorithmic Thinking']
          },
          {
            id: 'r5',
            type: 'project_portfolio',
            title: 'Kaggle & GitHub Applied Machine Learning',
            durationYears: 2,
            description: 'Public reproducible data analysis notebooks and deployed model endpoints.',
            entryMilestones: ['Verified Data Cleaning & Regression Project Missions']
          }
        ],
        missions: [
          {
            id: 'MISSION-DATA-01',
            pathwayId: 'PATH-AI-DATA',
            title: 'Urban Climate Heat-Island Pattern Discovery',
            headline: 'Isolate microclimate temperature anomalies from 10,000 sensor feeds.',
            description: 'Clean noisy geospatial sensor readings and isolate statistical outliers to determine park cooling footprints.',
            durationMinutes: 35,
            difficulty: 'intermediate',
            competenciesTested: ['computational_thinking', 'scientific_inquiry'],
            scenario: 'A city planning department requires empirical proof of urban canopy cooling effectiveness.',
            constraints: ['Eliminate sensor drift anomalies', 'Provide 95% confidence interval on temperature deltas'],
            deliverable: 'A cleaned anomaly matrix and correlation scatterplot.'
          }
        ]
      },
      {
        id: 'PATH-SPACE-SCIENCE',
        code: 'SPACE-01',
        field: 'natural_sciences',
        title: 'Space Science & Satellite Orbital Mechanics',
        tagline: 'Explore celestial dynamics, orbital trajectories, and interplanetary instrumentation.',
        overview: 'Combines gravitational physics, telemetry communications, optics, and extreme environment materials engineering.',
        growthOutlook: '+22% Growth driven by expanding commercial satellite launches and lunar exploration programs.',
        requirements: [
          { competency: 'scientific_inquiry', minimumLevel: 3.6, importance: 'critical_foundation' },
          { competency: 'quantitative_reasoning', minimumLevel: 3.6, importance: 'critical_foundation' },
          { competency: 'spatial_reasoning', minimumLevel: 3.4, importance: 'strongly_recommended' }
        ],
        routes: [
          {
            id: 'r6',
            type: 'university_degree',
            title: 'B.Tech Aerospace Engineering / B.S. Astrophysics',
            durationYears: 4,
            description: 'Comprehensive curriculum covering aerodynamics, orbital transfers, and propulsion.',
            entryMilestones: ['Advanced Physics & Calculus']
          }
        ],
        missions: [
          {
            id: 'MISSION-SPACE-01',
            pathwayId: 'PATH-SPACE-SCIENCE',
            title: 'Hohmann Orbital Transfer Budget Calculation',
            headline: 'Calculate minimum delta-v propulsion budget to transition from Low Earth Orbit to Geostationary Orbit.',
            description: 'Calculate velocity impulses and fuel burn duration under Newtonian gravitational fields.',
            durationMinutes: 40,
            difficulty: 'stretch',
            competenciesTested: ['quantitative_reasoning', 'scientific_inquiry'],
            scenario: 'A communication satellite must transition to 35,786 km geostationary altitude.',
            constraints: ['Specific impulse limit: 320 seconds', 'Zero atmospheric drag in elliptical transfer'],
            deliverable: 'Delta-V velocity matrix and fuel mass ratio curve.'
          }
        ]
      }
    ];

    // 4. Initialize Class Cohort for Teacher Portal
    this.classCohort = {
      id: 'CLASS-8A',
      name: 'Class 8-A (STEM & Computational Reasoning)',
      grade: 8,
      totalStudents: 24,
      students: [
        {
          id: defaultLearnerId,
          name: 'Learner S-0801',
          overallReadiness: 'Advanced STEM / Foundational Math Gap',
          weakestCompetency: 'quantitative_reasoning',
          weakestScore: 2.8,
          strongestCompetency: 'spatial_reasoning',
          activeGapRemediation: 'Proportional Equations Sprint',
          stemScore: '540 (Mountain)',
          englishScore: '910L (B1+)',
          roboticsScore: '550 (Regional)'
        },
        {
          id: 's2',
          name: 'Learner S-0802',
          overallReadiness: 'High Quantitative / Emerging Spatial',
          weakestCompetency: 'spatial_reasoning',
          weakestScore: 2.5,
          strongestCompetency: 'quantitative_reasoning',
          activeGapRemediation: '3D Orthographic Projection Lab',
          stemScore: '580 (Advanced)',
          englishScore: '860L (B1)',
          roboticsScore: '490 (State)'
        },
        {
          id: 's3',
          name: 'Learner S-0803',
          overallReadiness: 'Strong Critical Thinking / Emerging CT',
          weakestCompetency: 'computational_thinking',
          weakestScore: 2.9,
          strongestCompetency: 'logical_deduction',
          activeGapRemediation: 'Algorithmic Loop Decomposition',
          stemScore: '520 (Proficient)',
          englishScore: '980L (B2)',
          roboticsScore: '510 (Regional)'
        },
        {
          id: 's4',
          name: 'Learner S-0804',
          overallReadiness: 'Balanced Expected Foundation',
          weakestCompetency: 'scientific_inquiry',
          weakestScore: 3.1,
          strongestCompetency: 'quantitative_reasoning',
          activeGapRemediation: 'Independent Variable Isolation',
          stemScore: '500 (Baseline)',
          englishScore: '890L (B1)',
          roboticsScore: '505 (Regional)'
        }
      ],
      misconceptionClusters: [
        {
          clusterName: 'Group Alpha: Proportional Balancing Misconception',
          affectedCompetency: 'quantitative_reasoning',
          studentCount: 7,
          recommendedDifferentiatedActivity: 'Hands-on interactive scale simulation: Variable balance across pans'
        },
        {
          clusterName: 'Group Beta: Conformation Bias in Conditional Logic',
          affectedCompetency: 'logical_deduction',
          studentCount: 9,
          recommendedDifferentiatedActivity: 'Wason 4-card diagnostic counterexample workshop'
        },
        {
          clusterName: 'Group Gamma: 3D Coordinate Plane Mental Rotation',
          affectedCompetency: 'spatial_reasoning',
          studentCount: 5,
          recommendedDifferentiatedActivity: 'Physical isometric block building and camera angle sketching'
        }
      ]
    };

    // 5. Initialize Seed Multi-Domain Global Benchmark Reports for Student
    const stemReport = generateGlobalBenchmarkReport(
      'stem',
      0.65,
      0.28,
      [
        { itemId: 'stem_001', selectedOptionId: 'opt_b', isCorrect: true },
        { itemId: 'stem_002', selectedOptionId: 'opt_c', isCorrect: false, misconceptionTag: 'formula_inversion' },
        { itemId: 'stem_003', selectedOptionId: 'opt_c', isCorrect: true },
        { itemId: 'stem_004', selectedOptionId: 'opt_b', isCorrect: false, misconceptionTag: 'volume_neglect' },
        { itemId: 'stem_005', selectedOptionId: 'opt_a', isCorrect: true },
        { itemId: 'stem_006', selectedOptionId: 'opt_b', isCorrect: true },
        { itemId: 'stem_007', selectedOptionId: 'opt_a', isCorrect: false, misconceptionTag: 'limiting_reagent_blindness' },
        { itemId: 'stem_008', selectedOptionId: 'opt_d', isCorrect: true },
        { itemId: 'stem_009', selectedOptionId: 'opt_a', isCorrect: true },
        { itemId: 'stem_010', selectedOptionId: 'opt_b', isCorrect: true }
      ],
      STEM_BENCHMARK_ITEMS
    );

    const englishReport = generateGlobalBenchmarkReport(
      'english',
      0.52,
      0.31,
      [
        { itemId: 'eng_001', selectedOptionId: 'opt_c', isCorrect: true },
        { itemId: 'eng_002', selectedOptionId: 'opt_a', isCorrect: false, misconceptionTag: 'proximity_agreement' },
        { itemId: 'eng_003', selectedOptionId: 'opt_b', isCorrect: true },
        { itemId: 'eng_004', selectedOptionId: 'opt_c', isCorrect: true },
        { itemId: 'eng_005', selectedOptionId: 'opt_b', isCorrect: false, misconceptionTag: 'literal_idiom' },
        { itemId: 'eng_006', selectedOptionId: 'opt_d', isCorrect: true },
        { itemId: 'eng_007', selectedOptionId: 'opt_a', isCorrect: true },
        { itemId: 'eng_008', selectedOptionId: 'opt_c', isCorrect: false, misconceptionTag: 'correlation_causation' },
        { itemId: 'eng_009', selectedOptionId: 'opt_a', isCorrect: true },
        { itemId: 'eng_010', selectedOptionId: 'opt_c', isCorrect: true }
      ],
      ENGLISH_BENCHMARK_ITEMS
    );

    const roboticsReport = generateGlobalBenchmarkReport(
      'robotics',
      1.15,
      0.24,
      [
        { itemId: 'rob_001', selectedOptionId: 'opt_b', isCorrect: true },
        { itemId: 'rob_002', selectedOptionId: 'opt_c', isCorrect: true },
        { itemId: 'rob_003', selectedOptionId: 'opt_a', isCorrect: false, misconceptionTag: 'sensor_delay_blindness' },
        { itemId: 'rob_004', selectedOptionId: 'opt_b', isCorrect: true },
        { itemId: 'rob_005', selectedOptionId: 'opt_b', isCorrect: false, misconceptionTag: 'bang_bang_hunting' },
        { itemId: 'rob_006', selectedOptionId: 'opt_c', isCorrect: true },
        { itemId: 'rob_007', selectedOptionId: 'opt_a', isCorrect: true },
        { itemId: 'rob_008', selectedOptionId: 'opt_c', isCorrect: true },
        { itemId: 'rob_009', selectedOptionId: 'opt_b', isCorrect: true },
        { itemId: 'rob_010', selectedOptionId: 'opt_c', isCorrect: true }
      ],
      ROBOTICS_BENCHMARK_ITEMS
    );

    this.benchmarkReports.set(defaultLearnerId, [stemReport, englishReport, roboticsReport]);

    // 6. Initialize Seed Differentiated Lesson Plans for Teachers
    this.lessonPlans = [
      {
        id: 'LP-STEM-01',
        title: 'Archimedes Buoyancy & Displaced Fluid Mechanics',
        subject: 'STEM Reasoning',
        targetGrade: 'Class 8 / Middle Stage',
        durationMinutes: 45,
        alignedStandards: ['PISA Science Level 5', 'TIMSS Physics Grade 8', 'NEP 2020 Experiential Science'],
        targetedMisconception: {
          tag: 'volume_neglect',
          label: 'Mass-Weight vs. Displaced Fluid Volume Confusion',
          diagnosis: '7 students in cohort incorrectly believe heavier submerged objects always experience greater buoyant forces regardless of volume.'
        },
        pedagogicalFramework: 'CRA (Concrete-Representational-Abstract)',
        tier1Remediation: {
          tierTitle: 'Tier 1: Tactile Immersion & Physical Overflow Cans',
          studentTarget: 'Students who struggled with Archimedes questions (score < 450 PISA equivalent)',
          scaffoldStrategy: 'Physical water displacement measurement with Eureka overflow cans before any algebraic formula is presented.',
          tactileActivity: 'Submerge equal-volume aluminum and lead cylinders in water. Directly weigh the overflowing water on digital balance scales to prove both displace identical water mass.',
          checkQuestion: 'If an aluminum block and lead block have identical 50 cm³ volume, which one displaces more water when completely submerged?'
        },
        tier2Core: {
          tierTitle: 'Tier 2: Dual-Force Vector Modeling & Free Body Diagrams',
          studentTarget: 'Students on grade level (PISA 450 - 580 equivalent)',
          collaborativeTask: 'Pairs construct scale vector force diagrams balancing downward gravity force (F_g = m*g) against upward buoyant force (F_b = rho * V * g) in varying fluid densities (saltwater vs freshwater vs oil).',
          evidenceCheckpoint: 'Accurately predict apparent weight reduction of a submerged mass in 1.2 g/cm³ brine solution.'
        },
        tier3Extension: {
          tierTitle: 'Tier 3: Variable Ballast Submarine Simulation & Hydrostatic Pressure',
          studentTarget: 'Advanced students (PISA > 580 equivalent)',
          inquiryChallenge: 'Design a closed-loop pneumatic ballast system algorithm that calculates required air volume displacement to achieve neutral buoyancy at 10m depth under varying water temperatures.',
          evaluationRubric: 'Algorithmic efficiency, integration of water compressibility, and explicit temperature-density correction factor.'
        },
        teacherFacilitatorNotes: [
          'Strictly avoid giving the algebraic formula F_b = rho*V*g in the first 15 minutes. Let students observe overflow mass first.',
          'Allow 140-second productive struggle pause before intervening when students ponder why lead feels lighter underwater.',
          'Check off Tier 1 mastery individually before allowing movement to mathematical abstractions.'
        ],
        createdAt: now
      },
      {
        id: 'LP-ENG-01',
        title: 'Syntactic Distance & Modifying Clauses in Academic Prose',
        subject: 'English Literacy',
        targetGrade: 'Class 8 / Middle Stage',
        durationMinutes: 40,
        alignedStandards: ['CEFR B2 Vantage Reading', 'Lexile 1050L Academic Complexity', 'Common Core ELA.L.8.1'],
        targetedMisconception: {
          tag: 'proximity_agreement',
          label: 'Proximity Agreement Error in Complex Sentences',
          diagnosis: '9 students in cohort mistakenly match verb conjugation with the nearest plural noun inside intervening prepositional clauses.'
        },
        pedagogicalFramework: 'PRIMM',
        tier1Remediation: {
          tierTitle: 'Tier 1: Parenthetical Clause Scratch-Out Method',
          studentTarget: 'Students struggling with subject-verb concord across long modifier chains',
          scaffoldStrategy: 'Visual color-coded bracketing: cross out everything between opening preposition and closing modifier to leave bare Subject + Verb skeleton.',
          tactileActivity: 'Physical sentence-strip editing: physically cut out intervening prepositional phrases with scissors, leaving subject directly adjacent to predicate.',
          checkQuestion: 'In "The discovery of ancient Martian lakebeds [suggest / suggests] water flowed", what is the true grammatical subject?'
        },
        tier2Core: {
          tierTitle: 'Tier 2: Sentence Expanding & Inversion Transformations',
          studentTarget: 'Students developing fluency with academic subordinate clauses',
          collaborativeTask: 'Peer editing carousel: students expand simple sentences by inserting prepositional, participial, and appositive modifiers, verifying subject-predicate concord at each expansion step.',
          evidenceCheckpoint: 'Draft 3 complex compound sentences with at least two intervening clauses without concord errors.'
        },
        tier3Extension: {
          tierTitle: 'Tier 3: Rhetorical Voice & Subjunctive Mood in Scientific Synthesis',
          studentTarget: 'Advanced students demonstrating CEFR C1 readiness',
          inquiryChallenge: 'Analyze excerpt from Charles Darwin or Rachel Carson: deconstruct how syntactic inversion and subjunctive clauses heighten rhetorical tension.',
          evaluationRubric: 'Depth of grammatical dissection, identification of auto-antonyms (contranyms), and stylistic replication.'
        },
        teacherFacilitatorNotes: [
          'Emphasize that the ear can deceive when nouns are distant: grammar requires structural parsing, not auditory guessing.',
          'Have students read the stripped sentence aloud without the bracketed prepositional phrase.',
          'Encourage peer verification before teacher review.'
        ],
        createdAt: now
      },
      {
        id: 'LP-ROB-01',
        title: 'Autonomous Closed-Loop Feedback & Proportional Steering',
        subject: 'Autonomous Robotics',
        targetGrade: 'Class 8-9 / Secondary Stage',
        durationMinutes: 60,
        alignedStandards: ['CSTA Level 3A Physical Computing', 'WRO RoboMission Junior Standard', 'IEEE Control Systems Fundamentals'],
        targetedMisconception: {
          tag: 'bang_bang_hunting',
          label: 'Binary On/Off Bang-Bang Hunting vs. Smooth Proportional Attenuation',
          diagnosis: '12 students configured autonomous line follower with discrete if(left) turn_hard_right else turn_hard_left, causing violent oscillations and track de-railing.'
        },
        pedagogicalFramework: 'PRIMM',
        tier1Remediation: {
          tierTitle: 'Tier 1: Live Oscilloscope & Motor Slew-Rate Visualization',
          studentTarget: 'Students with jittery or erratic robot vehicle trajectories',
          scaffoldStrategy: 'PRIMM Predict & Run: have students predict vehicle path with bang-bang control at 80% motor speed, then run live telemetry to see oscillations.',
          tactileActivity: 'Hand-steer a physical miniature vehicle along a wavy track while wearing blinders that only allow hard-left or hard-right steering. Feel the jerkiness compared to proportional steering.',
          checkQuestion: 'Why does increasing robot forward velocity make bang-bang steering oscillate out of control even faster?'
        },
        tier2Core: {
          tierTitle: 'Tier 2: Proportional Error Formula Implementation (Kp Gain Tuning)',
          studentTarget: 'Students implementing closed-loop feedback algorithms',
          collaborativeTask: 'Formulate error = light_sensor_value - target_setpoint, steering_correction = Kp * error. Empirically calibrate Kp from 0.1 to 1.5 in the simulator to find critical damping.',
          evidenceCheckpoint: 'Robot completes 3 laps of standard WRO figure-8 track with zero wheel line crossings.'
        },
        tier3Extension: {
          tierTitle: 'Tier 3: PD Control with Derivative Dampening & Low-Pass Filtering',
          studentTarget: 'Advanced students targeting competitive WRO national division',
          inquiryChallenge: 'Incorporate derivative term Kd * (error - last_error) / dt to predict upcoming sharp hairpin turns and actively brake outer wheel before overshoot occurs.',
          evaluationRubric: 'Telemetry stability curve, absence of limit cycles, and lap time reduction under 8.5 seconds.'
        },
        teacherFacilitatorNotes: [
          'Do not reveal the Kp formula immediately. Let students experience the violent oscillation (Productive Struggle).',
          'Use the live IDE telemetry chart to graph error vs time in real time.',
          'Encourage students to record their Kp trials in a systematic engineering logbook.'
        ],
        createdAt: now
      }
    ];

    // 7. Initialize Seed Pedagogical Guidance Playbooks
    this.playbooks = [
      {
        id: 'PLAY-PRIMM',
        frameworkName: 'PRIMM Pedagogy Framework',
        tagline: 'Predict → Run → Investigate → Modify → Make for Algorithmic & Robotic Thinking',
        domain: 'Robotics',
        corePrinciples: [
          {
            principle: 'Never start from a blank screen',
            explanation: 'Beginners experience cognitive overload when asked to write algorithms from scratch. Providing working baseline code lowers entry barriers.'
          },
          {
            principle: 'Predict before executing',
            explanation: 'Forcing students to predict sensor or variable outputs triggers active mental model construction before code runs.'
          },
          {
            principle: 'Modify incrementally',
            explanation: 'Changing one variable at a time establishes clear cause-and-effect relations in physical systems.'
          }
        ],
        classroomImplementationSteps: [
          {
            step: 1,
            title: 'Predict (5 mins)',
            teacherAction: 'Display 6 lines of sensor loop code on projector. Ask students to write expected robot behavior on individual whiteboard.',
            studentAction: 'Annotate code lines and write deterministic prediction before touching hardware.'
          },
          {
            step: 2,
            title: 'Run (5 mins)',
            teacherAction: 'Trigger hardware execution without modifying parameters.',
            studentAction: 'Observe robot behavior; note discrepancies between prediction and reality.'
          },
          {
            step: 3,
            title: 'Investigate (10 mins)',
            teacherAction: 'Facilitate guided questions: "What line triggered that reverse pivot?"',
            studentAction: 'Add telemetry print statements to trace variable state transitions.'
          },
          {
            step: 4,
            title: 'Modify (15 mins)',
            teacherAction: 'Introduce constraint challenge: "Make it turn 20% tighter without losing traction."',
            studentAction: 'Tweak thresholds and test iteratively on the competition mat.'
          },
          {
            step: 5,
            title: 'Make (25 mins)',
            teacherAction: 'Step back to observer role; log student evidence of autonomous problem-solving.',
            studentAction: 'Apply the mastered pattern to a novel mission obstacle.'
          }
        ],
        misconceptionInterventions: [
          {
            misconception: 'Bang-bang control jitter on line follower',
            whatNotToDo: 'Telling student "Just multiply error by 0.3".',
            recommendedIntervention: 'Have student inspect the oscilloscope wave. Ask: "Is the steering ever driving straight, or is it only 100% left and 100% right?"'
          },
          {
            misconception: 'Blocking delay loops freezing sensor reading',
            whatNotToDo: 'Rewriting code for the student.',
            recommendedIntervention: 'Simulate the loop on paper: "While the robot is sleeping for 500ms, does the distance sensor see the wall coming?"'
          }
        ]
      },
      {
        id: 'PLAY-CRA',
        frameworkName: 'Concrete-Representational-Abstract (CRA)',
        tagline: 'Grounded Physical Modeling before Mathematical Abstraction in STEM',
        domain: 'STEM',
        corePrinciples: [
          {
            principle: 'Concrete Touch First',
            explanation: 'Physical manipulation of objects builds intuitive spatial-physical representations that abstract symbols cannot convey.'
          },
          {
            principle: 'Representational Schematics Second',
            explanation: 'Translating physical observations into diagrams and vectors bridges experiential reality into mathematics.'
          },
          {
            principle: 'Abstract Equations Last',
            explanation: 'Symbolic formulas (F = m*a, rho = m/V) should only be codified after students have observed and diagrammed the phenomenon.'
          }
        ],
        classroomImplementationSteps: [
          {
            step: 1,
            title: 'Concrete Stage (15 mins)',
            teacherAction: 'Distribute physical overflow beakers, brass weights, and digital balances.',
            studentAction: 'Submerge objects, measure displaced fluid mass, record empirical data table.'
          },
          {
            step: 2,
            title: 'Representational Stage (15 mins)',
            teacherAction: 'Guide free-body force diagramming on grid paper.',
            studentAction: 'Draw arrows with lengths proportional to measured forces.'
          },
          {
            step: 3,
            title: 'Abstract Stage (15 mins)',
            teacherAction: 'Introduce algebraic formalization F_b = rho * V * g.',
            studentAction: 'Substitute measured values into equation to verify empirical match.'
          }
        ],
        misconceptionInterventions: [
          {
            misconception: 'Heavier objects always experience greater buoyancy',
            whatNotToDo: 'Writing Archimedes equation on board and pointing to V.',
            recommendedIntervention: 'Submerge identical-volume aluminum and lead blocks. Have student weigh both displaced beakers on the scale.'
          }
        ]
      },
      {
        id: 'PLAY-STRUGGLE',
        frameworkName: 'Productive Struggle Scaffolding Policy',
        tagline: 'Nordic Lagom Guidance: Cultivating Cognitive Tenacity without Learned Helplessness',
        domain: 'Universal',
        corePrinciples: [
          {
            principle: 'The 140-Second Silence Rule',
            explanation: 'When a student gets stuck, teachers must observe silently for at least 140 seconds before offering any cue. Premature intervention robs the student of neural consolidation.'
          },
          {
            principle: 'Socratic Prompting over Solutions',
            explanation: 'Never answer "What should I do?". Respond with "What did the robot telemetry tell you happened at second 3?"'
          },
          {
            principle: 'Normalize Debugging as Core Practice',
            explanation: 'Errors are not defects; they are diagnostic telemetry indicating which hypothesis requires updating.'
          }
        ],
        classroomImplementationSteps: [
          {
            step: 1,
            title: 'Observe & Diagnose (0-140s)',
            teacherAction: 'Stand back, observe student screen and facial cues without speaking.',
            studentAction: 'Reread error log, test hypothesis, inspect inputs.'
          },
          {
            step: 2,
            title: 'Level 1 Cue: Clarify the Goal',
            teacherAction: 'Ask: "What was the exact output you were expecting here?"',
            studentAction: 'State explicit expected vs actual output.'
          },
          {
            step: 3,
            title: 'Level 2 Cue: Narrow the Search Space',
            teacherAction: 'Ask: "Between lines 12 and 24, where is the state being modified?"',
            studentAction: 'Focus attention on specific logic block.'
          }
        ],
        misconceptionInterventions: [
          {
            misconception: '"I am not good at coding/math"',
            whatNotToDo: 'Reassuring with "It is okay, this is hard for everyone".',
            recommendedIntervention: '"Your logic up to step 3 was completely correct. Step 4 is just an unexpected test case. What input caused it?"'
          }
        ]
      }
    ];

    // Initialize Statutory Consent Records under DPDP Act 2023 with verified guardian identity bindings
    this.consentRecords.set('3fa85f64-5717-4562-b3fc-2c963f66afa6', {
      id: 'cst-001',
      learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      guardianId: 'parent_1',
      parentName: 'Guardian G-0801',
      parentContact: '+91 98765 43210',
      verificationChannel: 'DIGILOCKER',
      status: 'VERIFIED_ACTIVE',
      consentVersion: 'v1.2-dpdp-2023',
      purposes: ['COMPETENCY_ASSESSMENT', 'SOCRATIC_MENTORSHIP', 'PATHWAY_NAVIGATION'],
      verifiedAt: '2026-08-14T09:30:00Z',
      expiresAt: '2027-08-14T09:30:00Z',
      immutableAuditHash: 'dpdp_9a7b3c21',
      updatedAt: '2026-08-14T09:30:00Z'
    });
    this.guardianLearnerMap.set('parent_1', new Set(['3fa85f64-5717-4562-b3fc-2c963f66afa6']));

    this.consentRecords.set('9fa11b72-1204-4821-b3fa-110294821102', {
      id: 'cst-002',
      learnerId: '9fa11b72-1204-4821-b3fa-110294821102',
      guardianId: 'parent_2',
      parentName: 'Guardian G-0802',
      parentContact: 'guardian.02@family.org',
      verificationChannel: 'SMS_OTP',
      status: 'VERIFIED_ACTIVE',
      consentVersion: 'v1.2-dpdp-2023',
      purposes: ['COMPETENCY_ASSESSMENT', 'SOCRATIC_MENTORSHIP', 'PATHWAY_NAVIGATION'],
      verifiedAt: '2026-08-16T11:15:00Z',
      expiresAt: '2027-08-16T11:15:00Z',
      immutableAuditHash: 'dpdp_3e8f4a19',
      updatedAt: '2026-08-16T11:15:00Z'
    });
    this.guardianLearnerMap.set('parent_2', new Set(['9fa11b72-1204-4821-b3fa-110294821102']));

    this.consentRecords.set('8ac41d99-3194-4712-a1bb-592817401928', {
      id: 'cst-003',
      learnerId: '8ac41d99-3194-4712-a1bb-592817401928',
      guardianId: 'parent_3',
      parentName: 'Guardian G-0803',
      parentContact: '+91 98112 33445',
      verificationChannel: 'EMAIL_VERIFICATION',
      status: 'VERIFIED_ACTIVE',
      consentVersion: 'v1.2-dpdp-2023',
      purposes: ['COMPETENCY_ASSESSMENT', 'SOCRATIC_MENTORSHIP', 'PATHWAY_NAVIGATION'],
      verifiedAt: '2026-08-18T14:45:00Z',
      expiresAt: '2027-08-18T14:45:00Z',
      immutableAuditHash: 'dpdp_7b2c9e42',
      updatedAt: '2026-08-18T14:45:00Z'
    });
    this.guardianLearnerMap.set('parent_3', new Set(['8ac41d99-3194-4712-a1bb-592817401928']));

    this.consentRecords.set('7cc12e44-5512-4019-9182-192847102948', {
      id: 'cst-004',
      learnerId: '7cc12e44-5512-4019-9182-192847102948',
      guardianId: 'parent_4',
      parentName: 'Guardian G-0804',
      parentContact: '+91 97234 11223',
      verificationChannel: 'SMS_OTP',
      status: 'PENDING_PARENTAL_NOTICE',
      consentVersion: 'v1.2-dpdp-2023',
      purposes: ['COMPETENCY_ASSESSMENT'],
      expiresAt: '2026-10-20T00:00:00Z',
      immutableAuditHash: 'dpdp_pending_notice',
      updatedAt: '2026-10-01T00:00:00Z'
    });
    this.guardianLearnerMap.set('parent_4', new Set(['7cc12e44-5512-4019-9182-192847102948']));
  }

  // --- Profile Operations ---
  hasLearner(id: string): boolean {
    if (!id || typeof id !== 'string') return false;
    const cleanId = id.trim();
    return this.learnerProfiles.has(cleanId) || this.classCohort.students.some(s => s.id === cleanId);
  }

  getLearnerProfile(id: string, authUser?: any): LearnerProfile {
    const existing = this.learnerProfiles.get(id);
    if (existing) {
      if (authUser?.name && authUser.id === existing.userId && existing.fullName === 'Student Learner') {
        existing.fullName = authUser.name;
      }
      return existing;
    }

    if (authUser && authUser.id === id) {
      const now = new Date().toISOString();
      const profile: LearnerProfile = {
        id: authUser.id,
        userId: authUser.id,
        fullName: authUser.name || authUser.email?.split('@')[0] || 'Student Learner',
        age: 13,
        gradeBand: 'Class 8 (Middle Stage)',
        schoolName: 'Affiliated Educational Institution',
        activeFocusCompetency: 'quantitative_reasoning',
        competencies: {
          spatial_reasoning: {
            competency: 'spatial_reasoning',
            title: 'Spatial Reasoning',
            score: 3.5,
            theta: 0.6,
            standardError: 0.35,
            descriptor: 'Proficient',
            confidence: 0.85,
            lastAssessedAt: now
          },
          computational_thinking: {
            competency: 'computational_thinking',
            title: 'Computational Thinking',
            score: 3.2,
            theta: 0.3,
            standardError: 0.4,
            descriptor: 'Expected',
            confidence: 0.8,
            lastAssessedAt: now
          },
          logical_deduction: {
            competency: 'logical_deduction',
            title: 'Logical Deduction',
            score: 3.4,
            theta: 0.5,
            standardError: 0.38,
            descriptor: 'Expected',
            confidence: 0.82,
            lastAssessedAt: now
          },
          scientific_inquiry: {
            competency: 'scientific_inquiry',
            title: 'Scientific Inquiry',
            score: 3.0,
            theta: 0.0,
            standardError: 0.45,
            descriptor: 'Expected',
            confidence: 0.75,
            lastAssessedAt: now
          },
          quantitative_reasoning: {
            competency: 'quantitative_reasoning',
            title: 'Quantitative Reasoning',
            score: 2.8,
            theta: -0.2,
            standardError: 0.42,
            descriptor: 'Developing',
            confidence: 0.85,
            lastAssessedAt: now
          },
          systems_thinking: {
            competency: 'systems_thinking',
            title: 'Systems Thinking',
            score: 3.0,
            theta: 0.0,
            standardError: 0.45,
            descriptor: 'Expected',
            confidence: 0.75,
            lastAssessedAt: now
          },
          creative_problem_solving: {
            competency: 'creative_problem_solving',
            title: 'Creative Problem Solving',
            score: 3.5,
            theta: 0.6,
            standardError: 0.35,
            descriptor: 'Proficient',
            confidence: 0.85,
            lastAssessedAt: now
          },
          metacognition: {
            competency: 'metacognition',
            title: 'Metacognition',
            score: 3.0,
            theta: 0.0,
            standardError: 0.45,
            descriptor: 'Expected',
            confidence: 0.75,
            lastAssessedAt: now
          },
          verbal_reasoning: {
            competency: 'verbal_reasoning',
            title: 'Verbal Reasoning',
            score: 3.2,
            theta: 0.2,
            standardError: 0.42,
            descriptor: 'Expected',
            confidence: 0.78,
            lastAssessedAt: now
          },
          language_literacy: {
            competency: 'language_literacy',
            title: 'Language & Literacy',
            score: 3.3,
            theta: 0.3,
            standardError: 0.40,
            descriptor: 'Expected',
            confidence: 0.80,
            lastAssessedAt: now
          }
        },
        recentEvidence: [],
        savedPathways: ['PATH-ROBOTICS', 'PATH-AI-DATA'],
        mismatchAnalyses: {},
        completedMissions: [],
        updatedAt: now
      };
      this.learnerProfiles.set(id, profile);
      return profile;
    }

    return this.learnerProfiles.get('3fa85f64-5717-4562-b3fc-2c963f66afa6')!;
  }

  updateLearnerCompetency(learnerId: string, competency: CompetencyDomain, theta: number, standardError: number) {
    const profile = this.getLearnerProfile(learnerId);
    if (!profile) return;

    // Convert theta (-3.0 to +3.0) into normalized 1.0 - 5.0 score scale
    // score = 3.0 + (theta * 0.8)
    const normalizedScore = Math.max(1.0, Math.min(5.0, Math.round((3.0 + theta * 0.8) * 10) / 10));
    const confidence = Math.max(0.6, Math.min(0.99, Math.round((1.0 - standardError * 0.6) * 100) / 100));

    let descriptor: 'Developing' | 'Expected' | 'Proficient' | 'Advanced' | 'Mastery' = 'Expected';
    if (normalizedScore >= 4.5) descriptor = 'Mastery';
    else if (normalizedScore >= 4.0) descriptor = 'Advanced';
    else if (normalizedScore >= 3.4) descriptor = 'Proficient';
    else if (normalizedScore >= 2.5) descriptor = 'Expected';
    else descriptor = 'Developing';

    profile.competencies[competency] = {
      competency,
      title: profile.competencies[competency]?.title || competency,
      score: normalizedScore,
      theta: Math.round(theta * 100) / 100,
      standardError: Math.round(standardError * 100) / 100,
      descriptor,
      confidence,
      lastAssessedAt: new Date().toISOString()
    };
    profile.updatedAt = new Date().toISOString();
  }

  // --- Evidence Operations ---
  getLearnerEvidence(learnerId: string): LearnerEvidence[] {
    return this.evidenceStore.get(learnerId) || [];
  }

  getEvidence(learnerId: string): LearnerEvidence[] {
    return this.getLearnerEvidence(learnerId);
  }

  addEvidence(evidence: LearnerEvidence): LearnerEvidence {
    const existing = this.evidenceStore.get(evidence.learnerId) || [];
    const prevHash = (existing[0] as any)?.chainHash || 'GENESIS_EVIDENCE_HASH_0000000000000000';
    const ev = evidence as any;
    const scoreVal = ev.score ?? ev.observedValue?.scoreFraction ?? 1.0;
    const timestampVal = ev.timestamp ?? ev.observedAt ?? Date.now();
    const chainHash = crypto.createHash('sha256')
      .update(`${prevHash}:${ev.learnerId}:${ev.competency}:${scoreVal}:${timestampVal}`)
      .digest('hex');

    const chainedEvidence = { ...evidence, chainHash } as LearnerEvidence;
    existing.unshift(chainedEvidence);
    this.evidenceStore.set(evidence.learnerId, existing);

    const profile = this.learnerProfiles.get(evidence.learnerId);
    if (profile) {
      profile.recentEvidence = existing;
    }
    return chainedEvidence;
  }

  // --- Assessment Operations ---
  getItemBank(): AssessmentItem[] {
    return this.itemBank;
  }

  getItemsByDomain(domain: string): AssessmentItem[] {
    return getBenchmarkItemsByDomain(domain as any);
  }

  getItemById(id: string): AssessmentItem | undefined {
    return this.itemBank.find((i) => i.id === id);
  }

  createAssessmentSession(
    learnerId: string,
    domain: string = 'stem_reasoning',
    mode: 'rapid' | 'benchmark' | 'diagnostic' = 'diagnostic'
  ): AssessmentSession {
    const sessionId = crypto.randomUUID();
    const session: AssessmentSession = {
      id: sessionId,
      learnerId,
      domain,
      mode,
      status: 'in_progress',
      currentTheta: 0.0,
      standardError: 1.0,
      itemsAnswered: 0,
      administeredItemIds: [],
      history: [],
      startedAt: new Date().toISOString()
    };
    this.assessmentSessions.set(sessionId, session);
    return session;
  }

  getAssessmentSession(id: string): AssessmentSession | undefined {
    return this.assessmentSessions.get(id);
  }

  saveAssessmentSession(session: AssessmentSession) {
    this.assessmentSessions.set(session.id, session);
  }

  // --- Pathways Operations ---
  getPathways(): Pathway[] {
    return this.pathways;
  }

  getPathwayById(id: string): Pathway | undefined {
    return this.pathways.find((p) => p.id === id);
  }

  // --- Teacher Cohort ---
  getClassCohort(): ClassCohort {
    return this.classCohort;
  }

  // --- School Administration & DPDP Consent ---
  getSchoolOverview() {
    return {
      schoolId: 'SCH-AFF-01',
      schoolName: 'Affiliated Educational Institution',
      affiliation: 'CBSE & PARAKH National Standards',
      academicYear: '2026–2027',
      totalLearners: 420,
      activeCatSessions: 38,
      dpdpConsentRate: 0.942,
      meanCalibrationIndex: 3.65,
      parentEngagementRate: 0.88,
      activeReferralsCount: 12
    };
  }

  // --- Statutory DPDP Consent & Guardian Authorization Operations ---
  hasActiveConsent(learnerId: string): boolean {
    const record = this.consentRecords.get(learnerId);
    if (!record) return false;
    return isConsentActive(record);
  }

  /**
   * Authoritative identity-to-learner relationship & statutory consent verification.
   * Guarantees that:
   * 1. Authenticated user identity (guardianId) and requested learnerId are non-empty.
   * 2. An authorized guardian-learner relationship exists between this guardian and learner.
   * 3. An active statutory consent record exists for this learner under DPDP Act 2023.
   * 4. The consent record is active (VERIFIED_ACTIVE, not expired, not withdrawn).
   * 5. The consent record is explicitly bound to this authenticated guardian identity (guardianId matches).
   *
   * Note: Administrators, unverified guardians, and cross-guardian requests strictly fail this check.
   */
  isVerifiedGuardianForLearner(guardianId: string, learnerId: string): boolean {
    if (!guardianId || !learnerId) return false;

    // 1. Verify that this guardian identity has an authorized relationship to this learner
    const authorizedLearners = this.guardianLearnerMap.get(guardianId);
    const hasRegisteredRelationship = authorizedLearners ? authorizedLearners.has(learnerId) : false;

    // 2. Query statutory consent record for this learner
    const record = this.consentRecords.get(learnerId);
    if (!record) return false;

    // 3. Verify consent lifecycle is strictly active (not withdrawn, expired, or pending notice)
    if (!isConsentActive(record)) return false;

    // 4. Verify identity-to-consent binding unconditionally:
    // The consent record MUST explicitly identify the guardian (non-empty guardianId)
    // AND must strictly match the authenticated guardian identity
    if (!record.guardianId || record.guardianId !== guardianId) {
      return false;
    }

    // 5. Must also have an active registered guardian-learner relationship
    return hasRegisteredRelationship;
  }

  bindGuardianToLearner(guardianId: string, learnerId: string): void {
    if (!this.guardianLearnerMap.has(guardianId)) {
      this.guardianLearnerMap.set(guardianId, new Set());
    }
    this.guardianLearnerMap.get(guardianId)!.add(learnerId);
  }

  expireConsent(learnerId: string): ConsentRecord | null {
    const existing = this.consentRecords.get(learnerId);
    if (!existing) return null;
    const updated: ConsentRecord = {
      ...existing,
      status: 'EXPIRED',
      expiresAt: new Date(Date.now() - 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.consentRecords.set(learnerId, updated);
    return updated;
  }

  restoreConsent(learnerId: string, guardianId: string = 'parent_1'): ConsentRecord {
    const record: ConsentRecord = {
      id: 'cst-restored-' + learnerId.slice(0, 8),
      learnerId,
      guardianId,
      parentName: 'Guardian Verified',
      parentContact: '+91 98765 43210',
      verificationChannel: 'DIGILOCKER',
      status: 'VERIFIED_ACTIVE',
      consentVersion: 'v1.2-dpdp-2023',
      purposes: ['COMPETENCY_ASSESSMENT', 'SOCRATIC_MENTORSHIP', 'PATHWAY_NAVIGATION'],
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      immutableAuditHash: 'dpdp_restored',
      updatedAt: new Date().toISOString()
    };
    this.consentRecords.set(learnerId, record);
    this.bindGuardianToLearner(guardianId, learnerId);
    return record;
  }

  getConsentRecord(learnerId: string): ConsentRecord | undefined {
    return this.consentRecords.get(learnerId);
  }

  setConsentRecord(record: ConsentRecord): void {
    this.consentRecords.set(record.learnerId, record);
  }

  withdrawConsent(learnerId: string, reason: string = 'Statutory withdrawal'): ConsentRecord | null {
    const existing = this.consentRecords.get(learnerId);
    if (!existing) return null;
    const updated: ConsentRecord = {
      ...existing,
      status: 'WITHDRAWN',
      withdrawnAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.consentRecords.set(learnerId, updated);
    return updated;
  }

  getConsentLedger(): Array<{
    id: string;
    learnerId: string;
    learnerName: string;
    gradeBand: string;
    parentName: string;
    parentContact: string;
    channel: 'DigiLocker' | 'SMS OTP' | 'Email Verification';
    status: 'VERIFIED_ACTIVE' | 'PENDING_NOTICE' | 'WITHDRAWN' | 'EXPIRED';
    consentVersion: string;
    verifiedAt: string;
    expiresAt: string;
    auditHash: string;
  }> {
    const channelDisplay: Record<string, 'DigiLocker' | 'SMS OTP' | 'Email Verification'> = {
      DIGILOCKER: 'DigiLocker',
      SMS_OTP: 'SMS OTP',
      EMAIL_VERIFICATION: 'Email Verification',
      IN_PERSON_SIGNATURE: 'Email Verification'
    };
    const statusDisplay: Record<string, 'VERIFIED_ACTIVE' | 'PENDING_NOTICE' | 'WITHDRAWN' | 'EXPIRED'> = {
      VERIFIED_ACTIVE: 'VERIFIED_ACTIVE',
      NOTICE_SENT: 'PENDING_NOTICE',
      PENDING_PARENTAL_NOTICE: 'PENDING_NOTICE',
      WITHDRAWN: 'WITHDRAWN',
      EXPIRED: 'EXPIRED'
    };

    return Array.from(this.consentRecords.values()).map((r, idx) => ({
      id: r.id,
      learnerId: r.learnerId,
      learnerName: `Learner S-080${idx + 1}`,
      gradeBand: idx < 3 ? 'Class 8-A' : 'Class 8-B',
      parentName: r.parentName,
      parentContact: r.parentContact,
      channel: channelDisplay[r.verificationChannel] || 'SMS OTP',
      status: statusDisplay[r.status] || 'PENDING_NOTICE',
      consentVersion: r.consentVersion,
      verifiedAt: r.verifiedAt || '',
      expiresAt: r.expiresAt,
      auditHash: r.immutableAuditHash
    }));
  }

  getTeacherRoster(): Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    assignedClasses: string[];
    totalStudents: number;
    activeAssessmentsAssigned: number;
    status: 'Active' | 'On Leave';
  }> {
    return [
      {
        id: 'tch-01',
        name: 'Faculty Lead — Mathematics',
        email: 'faculty.math@core-os.app',
        subject: 'STEM Reasoning & Mathematics',
        assignedClasses: ['Class 8-A', 'Class 8-B'],
        totalStudents: 52,
        activeAssessmentsAssigned: 3,
        status: 'Active'
      },
      {
        id: 'tch-02',
        name: 'Faculty Lead — Computational Systems',
        email: 'faculty.computing@core-os.app',
        subject: 'Computational Thinking & Robotics',
        assignedClasses: ['Class 9-A', 'Class 9-B'],
        totalStudents: 56,
        activeAssessmentsAssigned: 2,
        status: 'Active'
      },
      {
        id: 'tch-03',
        name: 'Faculty Lead — Scientific Inquiry',
        email: 'faculty.science@core-os.app',
        subject: 'Scientific Inquiry & Physics',
        assignedClasses: ['Class 10-A'],
        totalStudents: 26,
        activeAssessmentsAssigned: 4,
        status: 'Active'
      },
      {
        id: 'tch-04',
        name: 'Faculty Lead — Foundational Thinking',
        email: 'faculty.logic@core-os.app',
        subject: 'Foundational Logic & Thinking Skills',
        assignedClasses: ['Class 6-A', 'Class 7-A'],
        totalStudents: 48,
        activeAssessmentsAssigned: 1,
        status: 'Active'
      }
    ];
  }

  getSchoolPathwayDistribution() {
    return [
      {
        pathwayId: 'ai-robotics',
        title: 'AI Systems & Robotics Engineering',
        field: 'computing_ai',
        interestedLearners: 94,
        capacityRating: 'High',
        readinessIndex: 3.8
      },
      {
        pathwayId: 'biotech-genomics',
        title: 'Biotechnology & Computational Genomics',
        field: 'natural_sciences',
        interestedLearners: 78,
        capacityRating: 'Balanced',
        readinessIndex: 3.5
      },
      {
        pathwayId: 'clean-energy-systems',
        title: 'Clean Energy & Aerospace Systems',
        field: 'engineering',
        interestedLearners: 65,
        capacityRating: 'Balanced',
        readinessIndex: 3.6
      },
      {
        pathwayId: 'data-economics',
        title: 'Computational Economics & Decision Science',
        field: 'applied_tech',
        interestedLearners: 42,
        capacityRating: 'High',
        readinessIndex: 3.4
      }
    ];
  }

  // --- Multi-Domain Global Benchmark Reports ---
  getBenchmarkReports(learnerId: string): GlobalBenchmarkReport[] {
    return this.benchmarkReports.get(learnerId) || [];
  }

  getBenchmarkReport(learnerId: string, domain?: BenchmarkDomain): GlobalBenchmarkReport | undefined {
    const list = this.getBenchmarkReports(learnerId);
    if (!domain) return list[0];
    return list.find((r) => r.domain === domain);
  }

  saveBenchmarkReport(learnerId: string, report: GlobalBenchmarkReport): void {
    const existing = this.benchmarkReports.get(learnerId) || [];
    const filtered = existing.filter((r) => r.domain !== report.domain);
    filtered.unshift(report);
    this.benchmarkReports.set(learnerId, filtered);
  }

  // --- Teacher Lesson Plan Studio & Guidance Operations ---
  getLessonPlans(): DifferentiatedLessonPlan[] {
    return this.lessonPlans;
  }

  getLessonPlanById(id: string): DifferentiatedLessonPlan | undefined {
    return this.lessonPlans.find((lp) => lp.id === id);
  }

  saveLessonPlan(plan: DifferentiatedLessonPlan): DifferentiatedLessonPlan {
    const existingIndex = this.lessonPlans.findIndex((lp) => lp.id === plan.id);
    if (existingIndex >= 0) {
      this.lessonPlans[existingIndex] = plan;
    } else {
      this.lessonPlans.unshift(plan);
    }
    return plan;
  }

  getTeacherGuidancePlaybooks(): PedagogicalPlaybook[] {
    return this.playbooks;
  }

  // --- STEM & Robotics Applied Missions Operations ---
  getMissions(stage?: string, domain?: string): StemMission[] {
    return this.missions.filter((m) => {
      const matchStage = !stage || stage === 'all' || m.stage === stage;
      const matchDomain = !domain || domain === 'all' || m.domain === domain;
      return matchStage && matchDomain;
    });
  }

  getMissionById(id: string): StemMission | undefined {
    return this.missions.find((m) => m.id === id);
  }

  // Robotics & Visual IDE Workspace Persistence
  private workspaceStore: Map<string, { workspace: any; stage: string; code: string; evaluation: any; updatedAt: string }> = new Map();

  saveWorkspace(key: string, data: { workspace: any; stage: string; code: string; evaluation: any }) {
    const entry = { ...data, updatedAt: new Date().toISOString() };
    this.workspaceStore.set(key, entry);
    return entry;
  }

  getWorkspace(key: string) {
    return this.workspaceStore.get(key) || null;
  }
}

export class PostgresCoreRepository extends LocalCoreRepository {
  /**
   * Executes a database transaction with RLS tenant identity and verified statutory consent gating.
   */
  async withVerifiedConsentTransaction<T>(
    learnerId: string,
    actorSub: string,
    operation: (client: any) => Promise<T>
  ): Promise<T> {
    const pool = getDbPool();
    if (!pool) {
      throw new Error('[PostgresCoreRepository] Database connection pool is not configured.');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // 1. Bind request.jwt.claim.sub for RLS tenant isolation
      await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [actorSub]);

      // 2. Check public.consents status (VERIFIED_ACTIVE / verified)
      const consentCheck = await client.query(
        `SELECT 1 FROM consents 
         WHERE learner_id = $1 
           AND status IN ('verified', 'VERIFIED_ACTIVE')
           AND withdrawn_at IS NULL
         LIMIT 1`,
        [learnerId]
      );

      if (consentCheck.rowCount === 0) {
        const profileCheck = await client.query(
          `SELECT age FROM profiles WHERE id = $1`,
          [learnerId]
        );
        const age = profileCheck.rows[0]?.age;
        if (age === undefined || age === null || age < 18) {
          throw new StatutoryConsentError(
            `Statutory parental consent under DPDP Act 2023 Section 9 missing or not active for minor learner ${learnerId}`
          );
        }
      }

      // 3. Execute payload operation inside transaction
      const result = await operation(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  override addEvidence(evidence: LearnerEvidence, actorSub: string = evidence.learnerId): any {
    const chained = super.addEvidence(evidence);

    if (isCloudDatabaseEnabled()) {
      this.withVerifiedConsentTransaction(evidence.learnerId, actorSub, async (client) => {
        if (!client) return;
        let prevHash = 'GENESIS_EVIDENCE_HASH_0000000000000000';
        const lastRow = await client.query(
          `SELECT observed_value->>'chainHash' as chain_hash FROM learner_evidence WHERE learner_id = $1 ORDER BY observed_at DESC LIMIT 1`,
          [evidence.learnerId]
        );
        if (lastRow.rows[0]?.chain_hash) {
          prevHash = lastRow.rows[0].chain_hash;
        }

        const ev = evidence as any;
        const scoreVal = ev.score ?? ev.observedValue?.scoreFraction ?? 1.0;
        const timestampVal = ev.timestamp ?? ev.observedAt ?? Date.now();
        const chainHash = crypto.createHash('sha256')
          .update(`${prevHash}:${ev.learnerId}:${ev.competency}:${scoreVal}:${timestampVal}`)
          .digest('hex');

        await client.query(
          `INSERT INTO learner_evidence (
            learner_id, competency_id, evidence_type, source_type, source_id, source_title,
            summary, observed_value, confidence, evidence_strength, status, visibility, observed_at
          ) VALUES (
            $1, (SELECT id FROM competencies WHERE code = $2 LIMIT 1),
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()
          )`,
          [
            ev.learnerId,
            ev.competency,
            ev.evidenceType || ev.type || 'applied_simulation',
            ev.sourceType || 'project_mission',
            ev.id || crypto.randomUUID(),
            ev.sourceTitle || ev.title || 'Maker Simulator Artifact',
            ev.summary || ev.claim || 'Competency demonstration',
            JSON.stringify({ ...evidence, chainHash }),
            ev.confidence || 0.9,
            ev.evidenceStrength || ev.level || 4,
            ev.status || 'validated',
            ev.visibility || 'learner_only'
          ]
        );
      }).catch((err) => {
        console.error('[PostgresCoreRepository] Async evidence write error:', err);
      });
    }

    return chained;
  }

  /**
   * Database-backed session reconstruction across process restarts.
   */
  async getAssessmentSessionFromDb(id: string): Promise<AssessmentSession | undefined> {
    const memory = super.getAssessmentSession(id);
    if (memory) return memory;
    const pool = getDbPool();
    if (!pool) return undefined;
    try {
      const res = await pool.query(
        `SELECT * FROM assessment_sessions WHERE id = $1 LIMIT 1`,
        [id]
      );
      const row = res.rows[0];
      if (!row) return undefined;

      const responsesRes = await pool.query(
        `SELECT * FROM assessment_responses WHERE session_id = $1 ORDER BY created_at ASC`,
        [id]
      );

      const history = responsesRes.rows.map((r: any) => ({
        itemId: r.item_id,
        selectedOptionId: r.selected_option_id,
        isCorrect: Boolean(r.is_correct),
        timeSpentSeconds: Number(r.time_spent_seconds || 15),
        thetaAfter: Number(r.theta_after || 0),
        standardErrorAfter: Number(r.standard_error_after || 1),
        misconceptionCode: r.misconception_code || undefined,
        timestamp: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString()
      }));

      const session: AssessmentSession = {
        id: row.id,
        learnerId: row.learner_id,
        domain: row.domain || 'stem_reasoning',
        mode: 'diagnostic',
        status: row.status || 'in_progress',
        currentTheta: Number(row.current_theta || 0),
        standardError: Number(row.standard_error || 1),
        itemsAnswered: Number(row.items_answered || history.length),
        administeredItemIds: row.administered_item_ids || history.map((h: any) => h.itemId),
        history,
        startedAt: row.started_at ? new Date(row.started_at).toISOString() : new Date().toISOString()
      };

      this.saveAssessmentSession(session);
      return session;
    } catch (err: any) {
      console.error('[PostgresCoreRepository] Failed to reconstruct session from database:', err);
      return undefined;
    }
  }

  override createAssessmentSession(
    learnerId: string,
    domain: string = 'stem_reasoning',
    mode: 'rapid' | 'benchmark' | 'diagnostic' = 'diagnostic'
  ): AssessmentSession {
    const session = super.createAssessmentSession(learnerId, domain, mode);

    if (isCloudDatabaseEnabled()) {
      const pool = getDbPool();
      if (pool) {
        pool.query(
          `INSERT INTO assessment_sessions (
            id, learner_id, domain, status, current_theta, standard_error, items_answered, administered_item_ids, started_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
          ON CONFLICT (id) DO NOTHING`,
          [
            session.id,
            session.learnerId,
            session.domain,
            session.status,
            session.currentTheta,
            session.standardError,
            session.itemsAnswered,
            session.administeredItemIds
          ]
        ).catch((err: any) => {
          console.error('[PostgresCoreRepository] Async session creation write error:', err);
        });
      }
    }

    return session;
  }

  override saveAssessmentSession(session: AssessmentSession): void {
    super.saveAssessmentSession(session);

    if (isCloudDatabaseEnabled()) {
      const pool = getDbPool();
      if (pool) {
        const completedAt = session.status === 'completed' ? new Date().toISOString() : null;
        pool.query(
          `UPDATE assessment_sessions
           SET status = $2,
               current_theta = $3,
               standard_error = $4,
               items_answered = $5,
               administered_item_ids = $6,
               completed_at = COALESCE($7, completed_at)
           WHERE id = $1`,
          [
            session.id,
            session.status,
            session.currentTheta,
            session.standardError,
            session.itemsAnswered,
            session.administeredItemIds,
            completedAt
          ]
        ).catch((err: any) => {
          console.error('[PostgresCoreRepository] Async session update write error:', err);
        });

        // Also persist the latest response into assessment_responses table
        const latestHistory = session.history[session.history.length - 1];
        if (latestHistory) {
          pool.query(
            `INSERT INTO assessment_responses (
              session_id, item_id, selected_option_id, is_correct, time_spent_seconds,
              misconception_code, theta_after, standard_error_after, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            ON CONFLICT DO NOTHING`,
            [
              session.id,
              latestHistory.itemId,
              latestHistory.selectedOptionId,
              latestHistory.isCorrect,
              latestHistory.timeSpentSeconds || 15,
              latestHistory.misconceptionCode || null,
              latestHistory.thetaAfter,
              latestHistory.standardErrorAfter
            ]
          ).catch((err: any) => {
            console.error('[PostgresCoreRepository] Async response insert write error:', err);
          });
        }
      }
    }
  }

  override saveBenchmarkReport(learnerId: string, report: GlobalBenchmarkReport): void {
    super.saveBenchmarkReport(learnerId, report);

    if (isCloudDatabaseEnabled()) {
      this.addEvidence({
        id: crypto.randomUUID(),
        learnerId,
        competency: 'quantitative_reasoning',
        evidenceType: 'diagnostic_response',
        sourceType: 'cat_assessment',
        sourceId: `report_${report.domain}_${Date.now()}`,
        sourceTitle: `${report.domainTitle} Diagnostic Benchmark Report`,
        summary: `Standard Scale: ${report.scaleFormatted}. Developmental Tier: ${report.developmentalBand}.`,
        observedValue: {
          theta: report.theta,
          standardError: report.se,
          scoreFraction: report.percentileRank / 100,
          qualitativeNotes: `Domain: ${report.domain}. Scale: ${report.scaleFormatted}. Tier: ${report.developmentalBand}.`
        },
        confidence: 0.95,
        evidenceStrength: 4,
        status: 'validated',
        visibility: 'guardian',
        observedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    }
  }
}

export const coreRepository =
  process.env.DATABASE_MODE === 'memory' || !getDbPool()
    ? new LocalCoreRepository()
    : new PostgresCoreRepository();
