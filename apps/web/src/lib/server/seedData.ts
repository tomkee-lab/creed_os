import type { CompetencyDomain } from '@core-os/domain';

export interface DifferentiatedLessonPlan {
  id: string;
  authorId?: string;
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
  simulatorType: 'truss' | 'grid_rover' | 'gear_train' | 'sensor_telemetry' | 'obstacle_avoidance' | 'winch_lift' | 'cv_vision' | 'pid_control' | 'planetary_space' | 'smart_grid' | 'gel_electrophoresis';
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
  },
  {
    id: 'smart-grid-balancing',
    title: 'Smart Grid Frequency & Renewable Intermittency Balancing',
    code: 'MISSION-ENERGY-01',
    domain: 'scientific_inquiry',
    domainTitle: 'Clean Energy Systems & Dynamic Grid Statics',
    stage: 'secondary',
    stageLabel: 'Secondary Stage (Classes 9–12)',
    targetGrades: 'Classes 9–12',
    estimatedMinutes: 25,
    difficulty: 'Advanced',
    brief: 'A metropolitan microgrid experiences fluctuating solar generation and industrial demand spikes. Dynamically balance solar output, wind turbines, and utility-scale battery dispatch to keep AC grid frequency locked at 50.00 Hz (±0.05 Hz) without brownouts or transformer overload.',
    pedagogicalObjective: 'Understand dynamic equilibrium, rotational inertia, supply-demand impedance matching, and PISA 2025 systemic clean energy modeling.',
    simulatorType: 'smart_grid',
    alignedStandards: ['OECD PISA 2025 Science (Clean Energy)', 'IEEE TC-PEBRAS Smart Grid', 'CBSE Class 12 Physics Alternating Current'],
    prerequisites: ['Conservation of energy', 'AC frequency fundamentals', 'Rate of change'],
    rubricCriteria: [
      { criterion: 'Grid Frequency Stability', target: '50.00 Hz ± 0.05 Hz continuous', importance: 'Primary' },
      { criterion: 'Renewable Penetration Ratio', target: '≥ 70% total power from solar + wind', importance: 'Mandatory' },
      { criterion: 'Battery Buffer Reserve', target: 'Maintain ≥ 25% reserve capacity', importance: 'Safety Margin' }
    ]
  },
  {
    id: 'dna-gel-electrophoresis',
    title: 'DNA Agarose Gel Electrophoresis & Band Sizing',
    code: 'MISSION-BIO-01',
    domain: 'scientific_inquiry',
    domainTitle: 'Biotechnology & Molecular Diagnostics',
    stage: 'secondary',
    stageLabel: 'Secondary Stage (Classes 9–12)',
    targetGrades: 'Classes 9–12',
    estimatedMinutes: 25,
    difficulty: 'Intermediate',
    brief: 'Isolate and size a 750 base-pair CRISPR-edited DNA fragment against a molecular ladder in an agarose gel matrix. Calibrate gel concentration (0.8%–2.0%) and electrophoretic voltage to resolve overlapping bands without thermal denaturation or band smearing.',
    pedagogicalObjective: 'Synthesize logarithmic molecular migration distance vs. DNA fragment length (bp), electric field strength, and polymer pore sieving.',
    simulatorType: 'gel_electrophoresis',
    alignedStandards: ['CBSE Biotechnology Class 12 Recombinant DNA', 'PISA 2025 Scientific Literacy', 'NGSS HS-LS1-1'],
    prerequisites: ['DNA molecular structure', 'Inverse logarithmic relationships', 'Electric field force'],
    rubricCriteria: [
      { criterion: 'Band Resolution Delta', target: '≥ 15 mm spatial separation from 500bp/1000bp markers', importance: 'Primary' },
      { criterion: 'Agarose Matrix Optimization', target: '1.2% w/v agarose for 750 bp resolution', importance: 'Mandatory' },
      { criterion: 'Thermal Integrity', target: '< 45°C buffer temperature (voltage ≤ 110V)', importance: 'Safety Margin' }
    ]
  }
];
