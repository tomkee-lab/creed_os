import type {
  LearnerProfile,
  LearnerEvidence,
  Pathway,
  AssessmentSession,
  AssessmentItem,
  CompetencyDomain
} from '@core-os/domain';
import { CALIBRATED_ITEM_BANK } from '@core-os/assessment';

export interface TeacherStudentSummary {
  id: string;
  name: string;
  overallReadiness: string;
  weakestCompetency: CompetencyDomain;
  weakestScore: number;
  strongestCompetency: CompetencyDomain;
  activeGapRemediation: string;
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
          activeGapRemediation: 'Proportional Equations Sprint'
        },
        {
          id: 's2',
          name: 'Learner S-0802',
          overallReadiness: 'High Quantitative / Emerging Spatial',
          weakestCompetency: 'spatial_reasoning',
          weakestScore: 2.5,
          strongestCompetency: 'quantitative_reasoning',
          activeGapRemediation: '3D Orthographic Projection Lab'
        },
        {
          id: 's3',
          name: 'Learner S-0803',
          overallReadiness: 'Strong Critical Thinking / Emerging CT',
          weakestCompetency: 'computational_thinking',
          weakestScore: 2.9,
          strongestCompetency: 'logical_deduction',
          activeGapRemediation: 'Algorithmic Loop Decomposition'
        },
        {
          id: 's4',
          name: 'Learner S-0804',
          overallReadiness: 'Balanced Expected Foundation',
          weakestCompetency: 'scientific_inquiry',
          weakestScore: 3.1,
          strongestCompetency: 'quantitative_reasoning',
          activeGapRemediation: 'Independent Variable Isolation'
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
  }

  // --- Profile Operations ---
  getLearnerProfile(id: string, authUser?: any): LearnerProfile {
    const existing = this.learnerProfiles.get(id);
    if (existing) {
      if (authUser?.name && existing.fullName === 'Student Learner') {
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

  addEvidence(evidence: LearnerEvidence) {
    const existing = this.evidenceStore.get(evidence.learnerId) || [];
    existing.unshift(evidence);
    this.evidenceStore.set(evidence.learnerId, existing);

    const profile = this.learnerProfiles.get(evidence.learnerId);
    if (profile) {
      profile.recentEvidence = existing;
    }
  }

  // --- Assessment Operations ---
  getItemBank(): AssessmentItem[] {
    return this.itemBank;
  }

  getItemById(id: string): AssessmentItem | undefined {
    return this.itemBank.find((i) => i.id === id);
  }

  createAssessmentSession(learnerId: string, domain: string = 'stem_reasoning'): AssessmentSession {
    const sessionId = crypto.randomUUID();
    const session: AssessmentSession = {
      id: sessionId,
      learnerId,
      domain,
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
    return [
      {
        id: 'cst-001',
        learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        learnerName: 'Learner S-0801',
        gradeBand: 'Class 8-A',
        parentName: 'Guardian G-0801',
        parentContact: '+91 98765 43210',
        channel: 'DigiLocker',
        status: 'VERIFIED_ACTIVE',
        consentVersion: 'v1.2-dpdp-2023',
        verifiedAt: '2026-08-14T09:30:00Z',
        expiresAt: '2027-08-14T09:30:00Z',
        auditHash: 'dpdp_9a7b3c21'
      },
      {
        id: 'cst-002',
        learnerId: '9fa11b72-1204-4821-b3fa-110294821102',
        learnerName: 'Learner S-0802',
        gradeBand: 'Class 8-A',
        parentName: 'Guardian G-0802',
        parentContact: 'guardian.02@family.org',
        channel: 'SMS OTP',
        status: 'VERIFIED_ACTIVE',
        consentVersion: 'v1.2-dpdp-2023',
        verifiedAt: '2026-08-16T11:15:00Z',
        expiresAt: '2027-08-16T11:15:00Z',
        auditHash: 'dpdp_3e8f4a19'
      },
      {
        id: 'cst-003',
        learnerId: '8ac41d99-3194-4712-a1bb-592817401928',
        learnerName: 'Learner S-0803',
        gradeBand: 'Class 8-A',
        parentName: 'Guardian G-0803',
        parentContact: '+91 98112 33445',
        channel: 'Email Verification',
        status: 'VERIFIED_ACTIVE',
        consentVersion: 'v1.2-dpdp-2023',
        verifiedAt: '2026-08-18T14:45:00Z',
        expiresAt: '2027-08-18T14:45:00Z',
        auditHash: 'dpdp_7b2c9e42'
      },
      {
        id: 'cst-004',
        learnerId: '7cc12e44-5512-4019-9182-192847102948',
        learnerName: 'Learner S-0804',
        gradeBand: 'Class 8-B',
        parentName: 'Guardian G-0804',
        parentContact: '+91 97234 11223',
        channel: 'SMS OTP',
        status: 'PENDING_NOTICE',
        consentVersion: 'v1.2-dpdp-2023',
        verifiedAt: '',
        expiresAt: '2026-10-20T00:00:00Z',
        auditHash: 'dpdp_pending_notice'
      }
    ];
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
}

export const coreRepository = new LocalCoreRepository();
