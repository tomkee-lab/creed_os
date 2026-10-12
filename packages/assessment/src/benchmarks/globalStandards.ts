import type { AssessmentItem } from '@core-os/domain';

export type BenchmarkDomain = 'stem' | 'english' | 'robotics';

export interface CompetencyStatus {
  name: string;
  scoreRatio: number; // 0.0 - 1.0
  qualitativeStatus: 'Needs Remediation' | 'Developing' | 'Secure' | 'Exceeding';
  evidenceNote: string;
}

export interface IdentifiedMisconceptionSummary {
  tag: string;
  label: string;
  severity: 'mild' | 'moderate' | 'critical';
  frequency: number;
  pedagogicalRemedy: string;
}

export interface RoadmapMilestone {
  week: number;
  title: string;
  focusArea: string;
  pedagogicalObjective: string;
  recommendedActivities: string[];
  primingQuestion: string;
}

export interface GlobalBenchmarkReport {
  domain: BenchmarkDomain;
  domainTitle: string;
  theta: number;
  se: number;
  percentileRank: number; // 1 - 99
  standardScaleScore: number;
  scaleFormatted: string; // e.g. "542 (PISA)", "940L (Lexile)", "580 (RoboScale)"
  scaleName: string;
  internationalTier: string;
  developmentalBand: 'Emergent Explorer' | 'Developing Foundation' | 'Competent Practitioner' | 'Advanced Master';
  globalComparison: {
    oecdAverage: number;
    topDecileThreshold: number;
    learnerScore: number;
    deltaVsGlobalMean: number;
  };
  subCompetencies: CompetencyStatus[];
  identifiedMisconceptions: IdentifiedMisconceptionSummary[];
  actionableRoadmap: RoadmapMilestone[];
  generatedAt: string;
}

/**
 * Standard Normal Cumulative Distribution Function (error function approximation)
 * Produces accurate percentile rank from z-score / theta.
 */
export function normalCdf(z: number): number {
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.31938153 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? 1.0 - p : p;
}

export function calculateInternationalPercentile(theta: number): number {
  const pct = Math.round(normalCdf(theta) * 100);
  return Math.min(99, Math.max(1, pct));
}

export function mapDevelopmentalBand(theta: number): 'Emergent Explorer' | 'Developing Foundation' | 'Competent Practitioner' | 'Advanced Master' {
  if (theta >= 1.5) return 'Advanced Master';
  if (theta >= 0.5) return 'Competent Practitioner';
  if (theta >= -0.5) return 'Developing Foundation';
  return 'Emergent Explorer';
}

/**
 * Maps theta to PISA and TIMSS international benchmarks for STEM
 */
export function mapStemBenchmarks(theta: number) {
  const pisaScore = Math.round(500 + 100 * theta);
  let timssTier = 'Below Low International Benchmark';
  if (pisaScore >= 625) {
    timssTier = 'Advanced International Benchmark (Level 6)';
  } else if (pisaScore >= 550) {
    timssTier = 'High International Benchmark (Level 5)';
  } else if (pisaScore >= 475) {
    timssTier = 'Intermediate International Benchmark (Level 4)';
  } else if (pisaScore >= 400) {
    timssTier = 'Low International Benchmark (Level 3)';
  }

  return {
    scaleScore: pisaScore,
    scaleFormatted: `${pisaScore} PISA Points`,
    scaleName: 'PISA Scientific & Quantitative Literacy Scale',
    tier: timssTier,
    oecdAverage: 500,
    topDecile: 625
  };
}

/**
 * Maps theta to Lexile Framework & CEFR for English
 */
export function mapEnglishBenchmarks(theta: number) {
  const lexile = Math.max(200, Math.round(850 + 250 * theta));
  let cefrTier = 'A1 Breakthrough / Beginner';
  if (theta >= 1.8) {
    cefrTier = 'C1 Effective Operational Proficiency';
  } else if (theta >= 0.8) {
    cefrTier = 'B2 Vantage / Upper Intermediate';
  } else if (theta >= -0.2) {
    cefrTier = 'B1 Threshold / Intermediate';
  } else if (theta >= -1.0) {
    cefrTier = 'A2 Waystage / Elementary';
  }

  return {
    scaleScore: lexile,
    scaleFormatted: `${lexile}L Lexile`,
    scaleName: 'Lexile Framework for Reading & Language',
    tier: cefrTier,
    oecdAverage: 850,
    topDecile: 1150
  };
}

/**
 * Maps theta to CSTA K-12 and WRO competitive standards for Robotics
 */
export function mapRoboticsBenchmarks(theta: number) {
  const roboScale = Math.round(500 + 100 * theta);
  let cstaTier = 'CSTA Level 1A (Elementary Algorithmic Fundamentals)';
  if (theta >= 1.7) {
    cstaTier = 'CSTA Level 3B / WRO Senior (Advanced Real-Time & Distributed Systems)';
  } else if (theta >= 0.8) {
    cstaTier = 'CSTA Level 3A / WRO Junior (Physical Computing & Feedback Loops)';
  } else if (theta >= 0.0) {
    cstaTier = 'CSTA Level 2 (Middle School Control Flow & Subsystems)';
  } else if (theta >= -1.0) {
    cstaTier = 'CSTA Level 1B (Upper Elementary Events & Modularity)';
  }

  return {
    scaleScore: roboScale,
    scaleFormatted: `${roboScale} RoboScale`,
    scaleName: 'CSTA / WRO Physical Computing Index',
    tier: cstaTier,
    oecdAverage: 500,
    topDecile: 620
  };
}

/**
 * Misconception dictionary and pedagogical remedies across domains
 */
export const MISCONCEPTION_PEDAGOGY: Record<string, { label: string; remedy: string; severity: 'mild' | 'moderate' | 'critical' }> = {
  // STEM
  'volume_neglect': {
    label: 'Neglect of Submerged Volume in Buoyant Force',
    remedy: 'Use Concrete-Representational-Abstract (CRA) sequence with displaced water cylinder and graduated beaker before applying Archimedes equation.',
    severity: 'critical'
  },
  'formula_inversion': {
    label: 'Inverse Proportion Variable Transposition',
    remedy: 'Explicit dimensional analysis drill; enforce writing physical units (e.g., kg/m³) on every intermediate algebraic step.',
    severity: 'moderate'
  },
  'heat_temp_confusion': {
    label: 'Thermal Energy vs. Temperature Equivalence',
    remedy: 'Socratic inquiry comparison: sparkler at 1200°C vs. bath tub at 40°C. Which transfers more total thermal energy?',
    severity: 'critical'
  },
  'constant_velocity_requires_force': {
    label: 'Aristotelian Motion Fallacy (Constant Force for Constant Speed)',
    remedy: 'Frictionless air track / space probe simulation to observe Newton First Law in vacuum.',
    severity: 'critical'
  },
  'current_consumed': {
    label: 'Attenuation / Consumption Model of Electric Current',
    remedy: 'Dual ammeter breadboard experiment showing identical current entering and exiting a resistive load.',
    severity: 'moderate'
  },
  'limiting_reagent_blindness': {
    label: 'Equal Mass vs. Mole Ratio Equivalence',
    remedy: 'Visual bicycle assembly metaphor (2 wheels + 1 frame) to ground stoichiometric mole conversions.',
    severity: 'moderate'
  },

  // English
  'proximity_agreement': {
    label: 'Proximity Agreement Error (Intervening Prepositional Phrase)',
    remedy: 'Bracket-the-modifier technique: teach student to mentally scratch prepositional clauses when matching subject to predicate.',
    severity: 'moderate'
  },
  'literal_idiom': {
    label: 'Hyper-Literal Reading of Figurative/Ironical Constructs',
    remedy: 'Contextual nuance mapping: highlight speaker perspective, contrasting adverbs, and rhetorical undercurrents.',
    severity: 'moderate'
  },
  'correlation_causation': {
    label: 'Post Hoc Ergo Propter Hoc Fallacy',
    remedy: 'Counter-example generation exercise: provide confounding variables to dismantle spurious causal claims.',
    severity: 'critical'
  },
  'false_equivalence': {
    label: 'False Equivalence in Argumentative Syllogisms',
    remedy: 'Venn diagram diagramming of categorical premises to test validity of formal deductions.',
    severity: 'critical'
  },
  'contranym_confusion': {
    label: 'Contranym Polarization (Missing Auto-Antonym Context)',
    remedy: 'Paired sentences comparison: juxtapose "sanction" as approval vs penalty within immediate historical texts.',
    severity: 'mild'
  },

  // Robotics
  'bang_bang_hunting': {
    label: 'Overdamping vs. Limit Cycle Oscillation Confusion',
    remedy: 'Live oscilloscope telemetry plotting: contrast high-frequency bang-bang flutter with proportional attenuation curves.',
    severity: 'critical'
  },
  'sensor_delay_blindness': {
    label: 'Zero-Latency Sensor Sampling Assumption',
    remedy: 'Intentional ping-echo latency injection in simulator: observe obstacle overshoot at high velocities.',
    severity: 'moderate'
  },
  'race_condition_blindness': {
    label: 'Asynchronous Shared-Resource Non-Atomic Access',
    remedy: 'Step-through multithread trace with mutex acquire/release visualization to demonstrate race conditions.',
    severity: 'critical'
  },
  'duty_cycle_frequency_confusion': {
    label: 'PWM Frequency vs Duty Cycle Voltage Equivalence',
    remedy: 'Visual PWM square-wave diagramming: demonstrate average DC equivalent voltage vs switching frequency.',
    severity: 'moderate'
  },
  'fsm_deadlock': {
    label: 'Incomplete State Transition Guards / Deadlock',
    remedy: 'State machine transition matrix table with default fallback watchdog timer states.',
    severity: 'critical'
  }
};

/**
 * Synthesizes a comprehensive Global Benchmark Report from item responses and domain theta
 */
export function generateGlobalBenchmarkReport(
  domain: BenchmarkDomain,
  theta: number,
  se: number,
  responses: Array<{
    itemId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    misconceptionTag?: string;
  }>,
  allDomainItems: AssessmentItem[]
): GlobalBenchmarkReport {
  const percentile = calculateInternationalPercentile(theta);
  const devBand = mapDevelopmentalBand(theta);

  // Benchmarking info
  let benchData: {
    scaleScore: number;
    scaleFormatted: string;
    scaleName: string;
    tier: string;
    oecdAverage: number;
    topDecile: number;
  };

  let domainTitle = 'Integrated STEM & Quantitative Literacy';
  if (domain === 'english') {
    domainTitle = 'Global English & Critical Rhetorical Literacy';
    benchData = mapEnglishBenchmarks(theta);
  } else if (domain === 'robotics') {
    domainTitle = 'Autonomous Robotics & Applied Physical Computing';
    benchData = mapRoboticsBenchmarks(theta);
  } else {
    benchData = mapStemBenchmarks(theta);
  }

  // Aggregate sub-competencies
  const competencyMap: Record<string, { total: number; correct: number }> = {};
  for (const item of allDomainItems) {
    const comp = item.competency || 'general_mastery';
    if (!competencyMap[comp]) competencyMap[comp] = { total: 0, correct: 0 };
    competencyMap[comp].total += 1;
  }
  for (const resp of responses) {
    const item = allDomainItems.find(i => i.id === resp.itemId);
    const comp = item?.competency || 'general_mastery';
    if (competencyMap[comp] && resp.isCorrect) {
      competencyMap[comp].correct += 1;
    }
  }

  const subCompetencies: CompetencyStatus[] = Object.entries(competencyMap).map(([compName, stats]) => {
    const ratio = stats.total > 0 ? stats.correct / stats.total : 0.5;
    let status: 'Needs Remediation' | 'Developing' | 'Secure' | 'Exceeding' = 'Developing';
    if (ratio >= 0.85) status = 'Exceeding';
    else if (ratio >= 0.65) status = 'Secure';
    else if (ratio >= 0.4) status = 'Developing';
    else status = 'Needs Remediation';

    const formattedName = compName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      name: formattedName,
      scoreRatio: Math.round(ratio * 100) / 100,
      qualitativeStatus: status,
      evidenceNote: `${stats.correct} of ${stats.total} calibrated diagnostic items resolved accurately.`
    };
  });

  // Aggregate misconceptions
  const miscCount: Record<string, number> = {};
  for (const resp of responses) {
    if (!resp.isCorrect && resp.misconceptionTag) {
      miscCount[resp.misconceptionTag] = (miscCount[resp.misconceptionTag] || 0) + 1;
    }
  }

  const identifiedMisconceptions: IdentifiedMisconceptionSummary[] = Object.entries(miscCount).map(
    ([tag, count]) => {
      const info = MISCONCEPTION_PEDAGOGY[tag] || {
        label: tag.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        remedy: 'Targeted concept clarification and comparative guided inquiry practice.',
        severity: 'moderate' as const
      };
      return {
        tag,
        label: info.label,
        severity: info.severity,
        frequency: count,
        pedagogicalRemedy: info.remedy
      };
    }
  );

  // Generate 4-Week Dynamic Actionable Roadmap
  const actionableRoadmap: RoadmapMilestone[] = generateActionableRoadmap(
    domain,
    devBand,
    identifiedMisconceptions
  );

  return {
    domain,
    domainTitle,
    theta: Math.round(theta * 100) / 100,
    se: Math.round(se * 100) / 100,
    percentileRank: percentile,
    standardScaleScore: benchData.scaleScore,
    scaleFormatted: benchData.scaleFormatted,
    scaleName: benchData.scaleName,
    internationalTier: benchData.tier,
    developmentalBand: devBand,
    globalComparison: {
      oecdAverage: benchData.oecdAverage,
      topDecileThreshold: benchData.topDecile,
      learnerScore: benchData.scaleScore,
      deltaVsGlobalMean: benchData.scaleScore - benchData.oecdAverage
    },
    subCompetencies,
    identifiedMisconceptions,
    actionableRoadmap,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Builds an authentic, pedagogy-backed 4-week roadmap
 */
function generateActionableRoadmap(
  domain: BenchmarkDomain,
  band: 'Emergent Explorer' | 'Developing Foundation' | 'Competent Practitioner' | 'Advanced Master',
  misconceptions: IdentifiedMisconceptionSummary[]
): RoadmapMilestone[] {
  const topRemedy = misconceptions[0]?.pedagogicalRemedy;

  if (domain === 'stem') {
    return [
      {
        week: 1,
        title: 'Concrete Foundations & Observable Physical Phenomena',
        focusArea: 'Buoyancy & Dimensional Kinematics',
        pedagogicalObjective: 'Deconstruct force equilibrium through concrete tactile models before formal symbolic equations.',
        recommendedActivities: [
          'Archimedes Water Displacement Laboratory with graduated cylinders',
          'Free-body diagram breakdown for objects of varying densities',
          topRemedy || 'Dimensional consistency checks across all unit conversions'
        ],
        primingQuestion: 'If an iron anchor floats on liquid mercury, what does that prove about displaced fluid weight?'
      },
      {
        week: 2,
        title: 'Mathematical Modeling & Rate Transformations',
        focusArea: 'Rates of Reaction & Stoichiometric Ratios',
        pedagogicalObjective: 'Bridge pictorial representations into balanced algebraic mass-conservation systems.',
        recommendedActivities: [
          'Mole-to-mass conversion scaffolding using recipe metaphors',
          'Limiting reagent simulation with visual particle counters',
          'Experimental error propagation calculation'
        ],
        primingQuestion: 'When 2 moles of H₂ react with 2 moles of O₂, why does 1 mole of O₂ remain untouched?'
      },
      {
        week: 3,
        title: 'Closed Systems & Equilibrium Dynamics',
        focusArea: 'Thermodynamics & Circuit Impedance',
        pedagogicalObjective: 'Investigate conservation laws in coupled electrical and thermal circuits.',
        recommendedActivities: [
          'Ohmic and non-Ohmic I-V curve plotting with multimeters',
          'Specific heat capacity calorimetry experiment',
          'Kirchhoff current loop verification on multi-branch breadboards'
        ],
        primingQuestion: 'Why does a 100W incandescent bulb draw higher surge current the millisecond it is switched on than after 5 seconds?'
      },
      {
        week: 4,
        title: 'Integrated Problem Solving & International Challenge Formats',
        focusArea: 'TIMSS Level 6 Synthesis & PISA Multi-Step Items',
        pedagogicalObjective: 'Synthesize cross-disciplinary physical principles to evaluate real-world engineering trade-offs.',
        recommendedActivities: [
          'PISA-style climate feedback loop data interpretation',
          'Hydraulic mechanical advantage vs stroke volume conservation challenge',
          'Peer argumentation critique using Claim-Evidence-Reasoning (CER)'
        ],
        primingQuestion: 'How does Pascal principle allow a 10N effort to lift a 10,000N automobile without violating conservation of energy?'
      }
    ];
  }

  if (domain === 'english') {
    return [
      {
        week: 1,
        title: 'Deep Syntactic Mechanics & Clausal Dissection',
        focusArea: 'Subject-Verb Distancing & Subjunctive Nuances',
        pedagogicalObjective: 'Master grammatical concordance across embedded parentheticals and inverted syntax.',
        recommendedActivities: [
          'Modifier-bracketing drills on complex academic prose',
          'Subjunctive contrary-to-fact clause rewriting exercises',
          topRemedy || 'Contextual dictionary deconstruction of contranym pairs'
        ],
        primingQuestion: 'Why must we say "If the scientist were certain" instead of "was certain" when describing an untested hypothesis?'
      },
      {
        week: 2,
        title: 'Rhetorical Strategy & Critical Argumentative Deconstruction',
        focusArea: 'Logical Fallacies & Syllogistic Deduction',
        pedagogicalObjective: 'Identify deductive flaws, false equivalences, and subtle authorial tone modulation.',
        recommendedActivities: [
          'Venn diagram categorical syllogism validation',
          'Spot-the-Fallacy critique in historical editorial columns',
          'Connotation spectrum sorting: arrange 8 synonyms from laudatory to pejorative'
        ],
        primingQuestion: 'How does an author convey sarcasm without employing explicit negation or exclamation markers?'
      },
      {
        week: 3,
        title: 'Lexile Elevation & Advanced Academic Lexicon',
        focusArea: 'Tier 3 Disciplinary Vocabulary (1100L - 1300L)',
        pedagogicalObjective: 'Absorb high-frequency Latinate and Greek morphemes to decode unfamiliar scholarly terminology.',
        recommendedActivities: [
          'Etymological root mapping (e.g. -vor-, -vert-, -spir-, -ten-)',
          'Close-reading excerpt analysis from peer-reviewed scientific journals',
          'Dual-voice comparative essay: translate informal argument into formal academic register'
        ],
        primingQuestion: 'How does knowing the Latin root "transgredi" illuminate the subtle semantic distinction between "transgression" and "deviation"?'
      },
      {
        week: 4,
        title: 'CEFR C1 Synthesis & Independent Critical Commentary',
        focusArea: 'Extended Scholarly Exposition & Thesis Defense',
        pedagogicalObjective: 'Author multifaceted argumentative essays with seamless transitional cohesion.',
        recommendedActivities: [
          'Timed 30-minute synthesis response on contrasting philosophical excerpts',
          'Peer blind rebuttal exercise testing counter-argument resilience',
          'Rhetorical presentation defending an unpopular evidenced position'
        ],
        primingQuestion: 'What distinguishes a genuine concession to an opposing viewpoint from a straw-man rhetorical concession?'
      }
    ];
  }

  // Robotics
  return [
    {
      week: 1,
      title: 'Perception Mechanics & Deterministic Sensor Baselines',
      focusArea: 'Ultrasonic Physics, Optical Debouncing & Sampling Rates',
      pedagogicalObjective: 'Eliminate false sensor assumptions by measuring speed-of-sound attenuation and ambient lux noise.',
      recommendedActivities: [
        'Raw ADC optical threshold calibration against ambient fluorescent flicker',
        'Ultrasonic sonar beam-angle cone mapping with geometric acoustic reflectors',
        topRemedy || 'Hardware debouncing with low-pass RC filters vs software sliding-window filters'
      ],
      primingQuestion: 'Why does an ultrasonic sensor return a false infinite distance when approaching a sound-absorbing foam obstacle at a 45° angle?'
    },
    {
      week: 2,
      title: 'Closed-Loop Control & Dynamics Attenuation',
      focusArea: 'Bang-Bang Flutter vs. Tuned Proportional-Integral Control',
      pedagogicalObjective: 'Transition from naive discrete if/else hunting to smooth linear proportional feedback.',
      recommendedActivities: [
        'PID parameter tuning bench: systematically adjust Kp to eliminate overshoot',
        'Encoder ticks-per-millimeter odometry calibration on high-traction carpet',
        'PWM dead-zone characterization for DC gearmotors'
      ],
      primingQuestion: 'Why does increasing proportional gain Kp eventually induce violent high-frequency oscillation around the setpoint?'
    },
    {
      week: 3,
      title: 'State Machine Architecture & Non-Blocking Concurrency',
      focusArea: 'Finite State Machines, Watchdog Timers & Mutex Locks',
      pedagogicalObjective: 'Construct deterministic state transitions that guarantee zero infinite loop deadlocks.',
      recommendedActivities: [
        'Transition-table matrix authoring with strict state enter/exit triggers',
        'Asynchronous non-blocking ticker loop implementation eliminating delay() commands',
        'Shared encoder buffer race condition resolution with hardware mutexes'
      ],
      primingQuestion: 'What catastrophic failure occurs if an autonomous robot uses a blocking 500ms sleep delay while tracking a line at 1.5 m/s?'
    },
    {
      week: 4,
      title: 'WRO Competition Run Simulation & Optimization',
      focusArea: 'Autonomous Navigation, AprilTag Docking & Trajectory Splining',
      pedagogicalObjective: 'Execute high-precision mission runs conforming to international tournament rules.',
      recommendedActivities: [
        'Multi-checkpoint autonomous navigation run with trajectory variance recording',
        'Camera AprilTag visual odometry docking with 3mm positioning tolerance',
        'Statistical repeatability trial run analysis (Kolmogorov-Smirnov trajectory test)'
      ],
      primingQuestion: 'How does sensor fusion (combining IMU gyro yaw with wheel encoder odometry) cancel out wheel-slip drift during rapid pivot turns?'
    }
  ];
}
