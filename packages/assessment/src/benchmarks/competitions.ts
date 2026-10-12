import type { CompetitionBenchmarkDefinition, CompetitionEcosystemId } from './types.js';

export const GLOBAL_COMPETITION_BENCHMARKS: Record<
  CompetitionEcosystemId,
  CompetitionBenchmarkDefinition
> = {
  fll: {
    id: 'fll',
    name: 'FIRST® LEGO® League (FLL Challenge)',
    organizer: 'FIRST® / LEGO® Education',
    region: 'Global',
    targetStage: 'middle',
    targetClasses: 'Classes 4–8 (Ages 9–14)',
    coreFocus:
      'Autonomous programming via LEGO SPIKE Prime, themed mission field navigation, sensor loops, and empirical project innovation.',
    rubricCriteria: [
      { id: 'fll-autonomy', dimension: 'Autonomous Mission Execution', description: 'Zero human touch navigation on the active challenge mat.', weight: 0.35 },
      { id: 'fll-mechanical', dimension: 'Attachment Modular Reliability', description: 'Quick-swap passive and motorized mechanism repeatability.', weight: 0.25 },
      { id: 'fll-code', dimension: 'Code Architecture & Comments', description: 'Modular subroutines, sensor gyro turn calibration, clear naming.', weight: 0.20 },
      { id: 'fll-core-values', dimension: 'Gracious Professionalism®', description: 'Evidence of team collaboration, discovery, and sportsmanship.', weight: 0.20 }
    ],
    normativeExecutionTimeSec: { mean: 150, stdev: 18, sampleSize: 1200 },
    normativeSuccessRate: 0.72
  },

  ftc: {
    id: 'ftc',
    name: 'FIRST® Tech Challenge (FTC)',
    organizer: 'FIRST®',
    region: 'Global',
    targetStage: 'secondary',
    targetClasses: 'Classes 7–12 (Ages 12–18)',
    coreFocus:
      'Android/REV-based industrial robotics, aluminum structural fabrication, 30s autonomous period with OpenCV object detection, and 2v2 alliance strategy.',
    rubricCriteria: [
      { id: 'ftc-auto', dimension: '30s Autonomous Computer Vision', description: 'TensorFlow/OpenCV detection of game props and trajectory routing.', weight: 0.30 },
      { id: 'ftc-teleop', dimension: 'Driver-Controlled Mechanism Flow', description: 'Dual-intake cycle efficiency, scoring arm kinematics, holding torque.', weight: 0.30 },
      { id: 'ftc-engineering', dimension: 'Engineering Portfolio Rigor', description: 'CAD documentation, iteration log, design decision matrices.', weight: 0.25 },
      { id: 'ftc-connect', dimension: 'STEM Community Outreach', description: 'Mentorship of grassroots teams and industry professional connections.', weight: 0.15 }
    ],
    normativeExecutionTimeSec: { mean: 150, stdev: 12, sampleSize: 850 },
    normativeSuccessRate: 0.65
  },

  frc: {
    id: 'frc',
    name: 'FIRST® Robotics Competition (FRC)',
    organizer: 'FIRST®',
    region: 'Global',
    targetStage: 'secondary',
    targetClasses: 'Classes 9–12 (Ages 14–18)',
    coreFocus:
      '125-pound industrial manufacturing, CAN bus architecture, pneumatic systems, swerve drive kinematics, and high-intensity match alliance coordination.',
    rubricCriteria: [
      { id: 'frc-swerve', dimension: 'Swerve Odometry & Trajectory', description: 'Choreo/PathPlanner motion profiling with closed-loop PIDF control.', weight: 0.35 },
      { id: 'frc-manipulation', dimension: 'High-Speed Intake & Shooter', description: 'Flywheel velocity regulation within 1% error tolerance.', weight: 0.30 },
      { id: 'frc-defense', dimension: 'Structural Rigidity Under Impact', description: 'Finite Element Analysis (FEA) verified aluminum/carbon chassis.', weight: 0.20 },
      { id: 'frc-pit', dimension: 'Rapid Pit Repair & Cycle Logistics', description: 'Turnaround sub-assembly swapping within 12-minute match cycles.', weight: 0.15 }
    ],
    normativeExecutionTimeSec: { mean: 150, stdev: 8, sampleSize: 600 },
    normativeSuccessRate: 0.58
  },

  viqrc: {
    id: 'viqrc',
    name: 'VEX IQ Robotics Competition (VIQRC)',
    organizer: 'Robotics Education & Competition (REC) Foundation',
    region: 'Global',
    targetStage: 'middle',
    targetClasses: 'Classes 3–8 (Ages 8–14)',
    coreFocus:
      'Snap-together composite structures, 60-second Collaborative Teamwork Challenge, and 60-second Autonomous Coding Skills matches.',
    rubricCriteria: [
      { id: 'viq-skills-auto', dimension: 'Autonomous Coding Skills', description: 'Deterministic sensor-guided route scoring with zero driver intervention.', weight: 0.40 },
      { id: 'viq-teamwork', dimension: 'Cooperative Alliance Strategy', description: 'Coordinating simultaneous tasks with randomized team partner.', weight: 0.30 },
      { id: 'viq-mechanisms', dimension: 'Passive Latch & Lift Design', description: 'Gear reductions maximizing torque without stalling smart motors.', weight: 0.30 }
    ],
    normativeExecutionTimeSec: { mean: 60, stdev: 6, sampleSize: 1400 },
    normativeSuccessRate: 0.68
  },

  v5rc: {
    id: 'v5rc',
    name: 'VEX V5 Robotics Competition (V5RC)',
    organizer: 'REC Foundation',
    region: 'Global',
    targetStage: 'secondary',
    targetClasses: 'Classes 9–12 (Ages 14–18)',
    coreFocus:
      'Custom aluminum/steel machining, V5 Cortex microcontrollers with PROS C++/Python, 15s autonomous win-point matches, and 2v2 dynamic zero-sum gameplay.',
    rubricCriteria: [
      { id: 'v5-autowin', dimension: 'Autonomous Win-Point (AWP)', description: 'Precision 15-second multi-element autonomous routine.', weight: 0.35 },
      { id: 'v5-kinematics', dimension: 'Pneumatic Actuation & Drive', description: 'Pressure-regulated cylinder stroke timing and omni-wheel odometry.', weight: 0.35 },
      { id: 'v5-notebook', dimension: 'Design Notebook Rubric Score', description: 'Detailed engineering design lifecycle adhering to REC standards.', weight: 0.30 }
    ],
    normativeExecutionTimeSec: { mean: 120, stdev: 10, sampleSize: 920 },
    normativeSuccessRate: 0.62
  },

  wro: {
    id: 'wro',
    name: 'World Robot Olympiad (WRO RoboMission)',
    organizer: 'WRO Association',
    region: 'Global',
    targetStage: 'middle',
    targetClasses: 'Classes 3–12 (Elementary, Junior, Senior)',
    coreFocus:
      'Strict academic rigor: on-site robot assembly from scratch without manuals, surprise rule modifications on competition morning, and fully autonomous missions.',
    rubricCriteria: [
      { id: 'wro-assembly', dimension: 'On-Site Unassisted Assembly', description: 'Complete mechanical reconstruction within 120-minute timed quarantine.', weight: 0.30 },
      { id: 'wro-surprise', dimension: 'Surprise Rule Algorithmic Adaptation', description: 'Live parameter updates accommodating changed target object colors.', weight: 0.40 },
      { id: 'wro-speed', dimension: 'Time to Max Score Run', description: 'High-speed traversal with sub-millimeter line sensor centering.', weight: 0.30 }
    ],
    normativeExecutionTimeSec: { mean: 120, stdev: 14, sampleSize: 1100 },
    normativeSuccessRate: 0.55
  },

  robocup_jr: {
    id: 'robocup_jr',
    name: 'RoboCup Junior (Soccer & Rescue)',
    organizer: 'RoboCup Federation',
    region: 'Global',
    targetStage: 'secondary',
    targetClasses: 'Classes 4–12 (Ages 10–19)',
    coreFocus:
      'Pure autonomy multi-agent robotic soccer (IR ball tracking, ultrasonic sonar goal positioning) and autonomous Disaster Rescue maze exploration.',
    rubricCriteria: [
      { id: 'rcj-vision', dimension: 'Multi-Sensor Ball & Boundary Fusion', description: 'IR photodiode array or omni-directional camera ball acquisition.', weight: 0.40 },
      { id: 'rcj-rescue-maze', dimension: 'Dead-Reckoning & Maze Solvers', description: 'Wall-following Right-Hand rule and victim thermal signature detection.', weight: 0.35 },
      { id: 'rcj-hardware', dimension: 'Custom PCB & Motor Driver Circuitry', description: 'Custom printed circuit boards and H-bridge PWM motor controls.', weight: 0.25 }
    ],
    normativeExecutionTimeSec: { mean: 180, stdev: 20, sampleSize: 750 },
    normativeSuccessRate: 0.50
  },

  zero_robotics: {
    id: 'zero_robotics',
    name: 'Zero Robotics (SPHERES / Astrobee)',
    organizer: 'MIT / NASA / CASIS',
    region: 'Global',
    targetStage: 'secondary',
    targetClasses: 'Classes 6–12 (Ages 12–18)',
    coreFocus:
      'Microgravity orbital mechanics where student algorithms control Astrobee free-flying robotic satellites aboard the International Space Station (ISS).',
    rubricCriteria: [
      { id: 'zr-thrust', dimension: 'Cold-Gas Fuel Economy & Thruster Budget', description: 'Executing maneuvers while strictly adhering to thruster air budgets.', weight: 0.40 },
      { id: 'zr-quaternion', dimension: '3D Quaternion Attitude Regulation', description: 'Controlling 6-DOF roll, pitch, and yaw without gimbal lock.', weight: 0.35 },
      { id: 'zr-collision', dimension: 'ISS Cabin Keep-Out Zone Avoidance', description: 'Zero penetration of virtual spatial boundaries inside the Kibo module.', weight: 0.25 }
    ],
    normativeExecutionTimeSec: { mean: 90, stdev: 5, sampleSize: 450 },
    normativeSuccessRate: 0.60
  },

  botball: {
    id: 'botball',
    name: 'Botball Educational Robotics',
    organizer: 'KIPR (KISS Institute for Practical Robotics)',
    region: 'Americas',
    targetStage: 'secondary',
    targetClasses: 'Classes 6–12 (Ages 12–18)',
    coreFocus:
      'Pure autonomy without human remote driving, programmed in C/C++/Python, utilizing computer vision, servo arms, and real-time obstacle avoidance.',
    rubricCriteria: [
      { id: 'bot-c-code', dimension: 'C/Python Autonomous Control', description: 'Clean standard library control loops without proprietary bloat.', weight: 0.40 },
      { id: 'bot-servo', dimension: 'Multi-Link Servo Arm Kinematics', description: 'Object harvesting and deposit into designated color zones.', weight: 0.35 },
      { id: 'bot-paper', dimension: 'Technical Documentation & Peer Review', description: 'Scientific reporting of methodology, mechanics, and test trials.', weight: 0.25 }
    ],
    normativeExecutionTimeSec: { mean: 120, stdev: 12, sampleSize: 550 },
    normativeSuccessRate: 0.64
  },

  techradiance: {
    id: 'techradiance',
    name: 'TechRadiance World Cup (IIT Delhi E-Cell)',
    organizer: 'Harbour Press / E-Cell IIT Delhi',
    region: 'India / Regional',
    targetStage: 'middle',
    targetClasses: 'Classes 3–12 & University',
    coreFocus:
      'National championship tracks in Autonomous Line Followers, Mini Humanoid Roborace, and STEM Coding Hackathons across Indian school networks.',
    rubricCriteria: [
      { id: 'tr-pid', dimension: 'High-Speed PID Line Traversal', description: 'Tuning proportional, integral, and derivative gains on 8-sensor arrays.', weight: 0.45 },
      { id: 'tr-lap-time', dimension: 'Track Lap Speed & Zero Penalty', description: 'Completing acute 90° bends and loop-de-loops without track departure.', weight: 0.35 },
      { id: 'tr-inspection', dimension: 'Technical Inspection & Chassis Mass', description: 'Adherence to dimensional bounding box and maximum allowable mass.', weight: 0.20 }
    ],
    normativeExecutionTimeSec: { mean: 45, stdev: 7, sampleSize: 1800 },
    normativeSuccessRate: 0.70
  },

  avishkaar: {
    id: 'avishkaar',
    name: 'Avishkaar League (Asia Robotics & AI Challenge)',
    organizer: 'Avishkaar Ecosystem',
    region: 'Asia-Pacific',
    targetStage: 'middle',
    targetClasses: 'Classes 3–10 (Ages 8–16)',
    coreFocus:
      'Asia’s largest robotics and game design championship featuring shifting annual themes ("Code of Duty", "MAYDAY") with hybrid manual and autonomous challenges.',
    rubricCriteria: [
      { id: 'av-stacking', dimension: 'Strategic Stacking & Resource Harvesting', description: 'Manipulating cubes and scoring elements into elevated silos.', weight: 0.40 },
      { id: 'av-arena-nav', dimension: 'Dynamic Terrain Navigation', description: 'Traversing ramps, bridges, and rumble strips with high clearance chassis.', weight: 0.35 },
      { id: 'av-game-ai', dimension: 'Computational Game Design', description: 'Developing interactive simulations with Pygame or micro:bit.', weight: 0.25 }
    ],
    normativeExecutionTimeSec: { mean: 120, stdev: 15, sampleSize: 2200 },
    normativeSuccessRate: 0.73
  },

  atl_marathon: {
    id: 'atl_marathon',
    name: 'Atal Tinkering Labs (ATL) Marathon',
    organizer: 'Atal Innovation Mission (AIM), NITI Aayog',
    region: 'India / Regional',
    targetStage: 'secondary',
    targetClasses: 'Classes 6–12 (Ages 11–18)',
    coreFocus:
      'Grassroots school innovation challenge under India NEP 2020: functional working prototypes addressing national challenges in AgriTech, Clean Energy, and Health.',
    rubricCriteria: [
      { id: 'atl-problem', dimension: 'Community Problem Identification', description: 'Direct field interviews and validation of authentic local challenges.', weight: 0.30 },
      { id: 'atl-prototype', dimension: 'Working Physical IoT/Robotics Prototype', description: 'Sensor integration with Arduino/ESP32, live telemetry, and actuation.', weight: 0.40 },
      { id: 'atl-scalability', dimension: 'Deployment Feasibility & Cost', description: 'Frugal engineering design enabling affordable community rollout.', weight: 0.30 }
    ],
    normativeExecutionTimeSec: { mean: 180, stdev: 25, sampleSize: 3500 },
    normativeSuccessRate: 0.81
  }
};
