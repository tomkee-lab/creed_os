/**
 * CREED OS STEM & Robotics Mission Curriculum Specification (Classes 3 to 12)
 * 
 * Aligns with:
 * - CSTA K-12 Computer Science Standards (1A, 1B, 2, 3A, 3B)
 * - CBSE Computational Thinking & AI Curriculum (2026-27 session)
 * - NEP 2020 Preparatory, Middle, and Secondary stages
 * - Singapore Full SBB fluid bands (G1, G2, G3)
 * - WRO / FIRST LEGO League autonomous mission rubrics
 */

import type { AlgorithmicEvaluation } from './competencyEvaluator';

export interface PrimmStep {
  phase: 'Predict' | 'Run' | 'Investigate' | 'Modify' | 'Make';
  title: string;
  instruction: string;
  badge: string;
}

export interface MissionRubricItem {
  id: string;
  label: string;
  description: string;
  points: number;
}

export interface StemMissionDefinition {
  id: string;
  title: string;
  shortLabel: string;
  icon: string;
  stage: 'preparatory' | 'middle' | 'secondary';
  gradeBracket: string;
  cstaStandard: string;
  competencyDomain: string;
  level: number; // 1 to 10
  objective: string;
  context: string;
  whyItMatters: string;
  primmSteps: PrimmStep[];
  rubric: MissionRubricItem[];
  socraticHint: string;
  evidenceSkillId: string;
  targetCoords?: { x: number; y: number };
}

export const STEM_MISSIONS: Record<string, StemMissionDefinition> = {
  starter: {
    id: 'starter',
    title: 'Rover Ignition & Beacon',
    shortLabel: 'Ignition 🚀',
    icon: '🚀',
    stage: 'preparatory',
    gradeBracket: 'Class 3 • Ages 8–9',
    cstaStandard: 'CSTA 1A-AP-10 • Algorithms & Sequential Execution',
    competencyDomain: 'Kinematic Sequencing & Actuators',
    level: 1,
    objective: 'Drive rover forward at 70% speed for 2 seconds and display Happy icon on micro:bit LED matrix.',
    context: 'Autonomous rovers execute instructions sequentially from top to bottom. Every mission begins with motor ignition and status beacon verification.',
    whyItMatters: 'Sequential order is the foundation of all computation: changing the order of instructions changes the rover\'s physical path.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Predict Execution Flow',
        instruction: 'Look at the blocks. When you click Run, will the rover drive first or show the LED face first?',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Run Simulation',
        instruction: 'Click "Run Mission" in the top bar to watch the rover execute your code in the Proving Ground arena.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Investigate Telemetry',
        instruction: 'Check the position in the telemetry strip: did the rover advance smoothly along the Y-axis without colliding?',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Modify Speed & Duration',
        instruction: 'Try changing the speed to 85% or duration to 3 seconds. Notice how velocity multiplies time to change total displacement ($d = v \\times t$).',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Make Your Own Beacon',
        instruction: 'Add a turn block or change the micro:bit LED icon to Heart or Smile to personalize the rover\'s beacon signal!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'start_connected', label: 'Mission Start Block Connected', description: 'Code must begin with "when mission starts"', points: 25 },
      { id: 'drive_vector', label: 'Linear Drive Vector Executed', description: 'Drive forward command with speed >= 50% and duration >= 1s', points: 35 },
      { id: 'led_beacon', label: 'Micro:bit Beacon Displayed', description: 'Show icon or scroll text block attached to output state', points: 20 },
      { id: 'safe_stop', label: 'Controlled Motor Termination', description: 'Motor stop or duration completion with zero boundary collisions', points: 20 }
    ],
    socraticHint: 'If your rover doesn\'t move, make sure your drive block is snapped securely underneath "when mission starts". Unattached blocks in Blockly are automatically disabled to prevent unexpected errors!',
    evidenceSkillId: 'skill_algorithmic_sequencing',
    targetCoords: { x: 150, y: 80 }
  },

  patrol: {
    id: 'patrol',
    title: 'Square Perimeter Patrol',
    shortLabel: 'Patrol 🔄',
    icon: '🔄',
    stage: 'preparatory',
    gradeBracket: 'Class 4 • Ages 9–10',
    cstaStandard: 'CSTA 1A-AP-11 • Loops & Pattern Recognition',
    competencyDomain: 'Repetition Loops & Angular Kinematics',
    level: 2,
    objective: 'Navigate a 4-legged square perimeter using a repeat loop with corner audio beeps and 90° right turns.',
    context: 'A square has 4 equal sides and four 90° corners. Loops compress repetitive code: instead of writing 8 motion blocks, a repeat loop executes the perimeter efficiently.',
    whyItMatters: 'Loops are the core tool for automation. They allow short, readable code to perform massive amounts of precise physical work.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Count Repetitions',
        instruction: 'How many sides does a square perimeter have? What should the repeat number be?',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Observe Corner Beeps',
        instruction: 'Run the patrol script and listen for the 880Hz buzzer beep at each 90° corner.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Verify Angular Closure',
        instruction: 'After 4 turns of 90°, the rover has rotated $4 \\times 90^\\circ = 360^\\circ$. Did it return to its starting heading?',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Change Perimeter Size',
        instruction: 'Increase the drive duration from 1.5s to 2.2s to expand the patrol perimeter across the arena floor.',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Add Perimeter Marker',
        instruction: 'Turn on the Turtle Pen extension to draw a glowing colored trail along the square patrol perimeter!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'repeat_count', label: '4-Cycle Repeat Loop', description: 'Repeat loop configured for precisely 4 iterations', points: 30 },
      { id: 'corner_turns', label: '90° Angular Coordinates', description: 'Turn right or left at precisely 90 degrees', points: 30 },
      { id: 'audio_telemetry', label: 'Audio Frequency Beep', description: 'Tone frequency emitted at boundary corners', points: 20 },
      { id: 'closed_loop', label: 'Closed Geometric Circuit', description: 'Rover returns close to starting heading ($360^\\circ$ rotation)', points: 20 }
    ],
    socraticHint: 'If the rover makes weird spirals instead of a neat square, check your turn angle. In planar geometry, four 90° turns make a complete closed loop!',
    evidenceSkillId: 'skill_repetition_loops'
  },

  polygon_patrol: {
    id: 'polygon_patrol',
    title: 'Geometric Polygon Survey',
    shortLabel: 'Polygon 📐',
    icon: '📐',
    stage: 'preparatory',
    gradeBracket: 'Classes 4–5 • Ages 9–11',
    cstaStandard: 'CSTA 1B-AP-08 • Geometric Computation',
    competencyDomain: 'Mathematical Geometry & Domain C-Blocks',
    level: 3,
    objective: 'Survey regular geometric perimeters using the domain C-block with nested micro:bit icon feedback.',
    context: 'Planetary rovers map regular polygonal search perimeters when conducting geological surveys over uncharted terrain.',
    whyItMatters: 'Connecting mathematics to physical movement demonstrates how geometric theorems dictate robot navigation.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Predict Polygon Geometry',
        instruction: 'What shape is created when SIDES = 4? What exterior angle must the robot turn at each corner?',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Run Domain C-Block',
        instruction: 'Execute the patrol polygon block and observe the nested micro:bit icon during each leg.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Check Telemetry Log',
        instruction: 'Open the Console tab to inspect the sector perimeter readings logged during each side.',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Try a Hexagonal Search',
        instruction: 'Change SIDES from 4 to 6. Notice how the rover adapts its turning angles ($360^\\circ / 6 = 60^\\circ$).',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Complete Autonomous Survey',
        instruction: 'Attach an audio tone and sleep pause to create a steady scanning rhythm across the survey field!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'c_block_used', label: 'Domain C-Block Employed', description: 'Patrol polygon block initialized with sides parameter', points: 35 },
      { id: 'nested_actions', label: 'Nested Sensor / Display Feedback', description: 'Child statements executed inside each polygon side', points: 35 },
      { id: 'clean_termination', label: 'Safe Mission Shutdown', description: 'Motor stop called at polygon completion', points: 30 }
    ],
    socraticHint: 'The polygon formula is $\\text{turn angle} = 360 / \\text{sides}$. A triangle turns $120^\\circ$, a square turns $90^\\circ$, and a hexagon turns $60^\\circ$!',
    evidenceSkillId: 'skill_geometric_computation'
  },

  obstacle: {
    id: 'obstacle',
    title: 'Sonar Obstacle Evasion',
    shortLabel: 'Avoid 🛑',
    icon: '🛑',
    stage: 'preparatory',
    gradeBracket: 'Class 5 • Ages 10–11',
    cstaStandard: 'CSTA 1B-AP-10 • Conditionals & Sensor Branching',
    competencyDomain: 'Reactive Conditionals & Ultrasonic Telemetry',
    level: 4,
    objective: 'Continuously poll ultrasonic distance sensor and execute an evasive 90° turn when an obstacle is within 20cm.',
    context: 'Autonomous rovers cannot rely on pre-programmed coordinates alone. When rocks or hazards block the path, closed-loop sonar sensors trigger evasive maneuvers.',
    whyItMatters: 'Reactive branching ($IF \\to THEN$) is the difference between an open-loop toy and an autonomous robot that safely navigates unknown environments.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Predict Sensor Reaction',
        instruction: 'When the ultrasonic sensor measures distance < 20cm, which branch of the `if` block will execute?',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Observe Sonar Radar Cone',
        instruction: 'Run the mission. Watch the green radar cone on the rover sweep toward the arena obstacles.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Inspect Proximity Threshold',
        instruction: 'In the console, observe the live distance reading. At what distance did the rover trigger its evasion?',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Adjust Safety Margin',
        instruction: 'Increase the threshold from 20cm to 35cm to give the rover more braking distance.',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Build Double-Check Logic',
        instruction: 'Add a check to verify if the right side is also clear before moving forward again!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'sonar_reading', label: 'Ultrasonic Sensor Queried', description: 'Sensor distance block read inside loop', points: 25 },
      { id: 'conditional_branch', label: 'Reactive If-Then Branch', description: 'Logic compare (< 20cm) triggers evasive branch', points: 35 },
      { id: 'evasive_turn', label: 'Evasive Maneuver Executed', description: 'Angular turn executed away from detected barrier', points: 20 },
      { id: 'zero_collisions', label: 'Zero Collision Integrity', description: 'Rover navigates without impacting arena boulders', points: 20 }
    ],
    socraticHint: 'If the rover crashes into an obstacle without turning, check the comparison operator: make sure you used "<" (less than) so it triggers when it gets closer than 20cm, not ">" (greater than)!',
    evidenceSkillId: 'skill_sensor_branching'
  },

  pen_patrol: {
    id: 'pen_patrol',
    title: 'Turtle Pen Geometry',
    shortLabel: 'Pen 🎨',
    icon: '🎨',
    stage: 'middle',
    gradeBracket: 'Class 6 • Ages 11–12',
    cstaStandard: 'CSTA 2-AP-12 • Spatial Coordinates & Modularity',
    competencyDomain: 'Kinematic Trajectories & Graphic Vectoring',
    level: 5,
    objective: 'Draw geometric polygon trajectories on the arena floor using pen down, color styling, and kinematic motion loops.',
    context: 'Seymour Papert pioneered Turtle Geometry to help learners explore coordinate geometry and calculus through robot kinematics.',
    whyItMatters: 'Vector graphics and robot path planning rely on the exact same coordinate math: heading angle, pen state, and step displacement.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Predict Drawn Shape',
        instruction: 'If the loop repeats 3 times with $120^\\circ$ turns, what regular polygon will the rover draw on the floor?',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Watch Colored Trails',
        instruction: 'Run the program and watch the glowing cyan vector trail draw beneath the rover chassis.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Check Kinematic Trails Buffer',
        instruction: 'Notice how the line coordinates are recorded in the rover telemetry trail.',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Change Color & Width',
        instruction: 'Use `pen_set_color` or `pen_set_size` to customize the stroke width of your geometry.',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Draw an Equilateral Star',
        instruction: 'Experiment with repeat 5 and $144^\\circ$ turns to draw a geometric 5-pointed star!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'pen_state', label: 'Pen Down & Up Management', description: 'Pen lowered to start drawing and raised at finish', points: 25 },
      { id: 'geometric_loop', label: 'Regular Polygon Trajectory', description: 'Repeat loop driving closed polygon boundary', points: 35 },
      { id: 'style_attributes', label: 'Pen Color / Size Configured', description: 'Custom hue, color, or width set on pen tool', points: 20 },
      { id: 'trail_rendered', label: 'Kinematic Path Trail Rendered', description: 'Active vector segments successfully recorded on arena', points: 20 }
    ],
    socraticHint: 'Remember to call `pen_down` before moving! If the rover moves but no trail appears, the virtual pen is still raised in the air.',
    evidenceSkillId: 'skill_spatial_geometry'
  },

  sample_retriever: {
    id: 'sample_retriever',
    title: 'Planetary Sample Retriever',
    shortLabel: 'Science 🧪',
    icon: '🧪',
    stage: 'middle',
    gradeBracket: 'Classes 6–7 • Ages 11–13',
    cstaStandard: 'CSTA 2-AP-13 • Decomposition & Subroutines',
    competencyDomain: 'Scientific Inquiry & Multi-Tool Actuation',
    level: 6,
    objective: 'Navigate toward Sample Marker β, activate coring drill, store specimen, and transmit scientific telemetry.',
    context: 'Mars rovers like Perseverance collect rock cores in hermetically sealed titanium tubes for future return to Earth.',
    whyItMatters: 'Engineering exists to serve scientific inquiry: robotics enables exploration of extreme environments unreachable by humans.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Identify Mission Sequence',
        instruction: 'What are the 3 distinct phases? (1) Navigate to site, (2) Coring drill extraction, (3) Data transmission.',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Observe Core Drill Animation',
        instruction: 'Run the script and watch the telemetry log confirm sample collection at site β.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Inspect Battery Consumption',
        instruction: 'Observe how running the heavy drill impacts rover battery reserves.',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Optimize Transit Speed',
        instruction: 'Tune transit motor power to balance travel speed against battery drain.',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Add Multi-Site Survey',
        instruction: 'Add a turn block to navigate to a second sector after sample collection is complete!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'navigation_target', label: 'Site Waypoint Reached', description: 'Rover navigates within proximity of sample target', points: 30 },
      { id: 'drill_actuated', label: 'Core Drill Actuated', description: '`rover_collect_sample` called at destination site', points: 30 },
      { id: 'telemetry_streamed', label: 'Science Telemetry Confirmed', description: 'Data log or display confirms sample retrieval', points: 20 },
      { id: 'celebration_cue', label: 'Completion Audio / LED Cue', description: 'Fanfare or LED checkmark signals mission success', points: 20 }
    ],
    socraticHint: 'Make sure your rover stops moving before activating the drill! In real space robotics, operating a high-torque coring drill while rolling damages the robotic arm.',
    evidenceSkillId: 'skill_task_decomposition',
    targetCoords: { x: 220, y: 190 }
  },

  line_follower: {
    id: 'line_follower',
    title: 'Surface Line Track',
    shortLabel: 'Line 🏁',
    icon: '🏁',
    stage: 'middle',
    gradeBracket: 'Class 7 • Ages 12–13',
    cstaStandard: 'CSTA 2-AP-15 • Feedback Control & State Polling',
    competencyDomain: 'Closed-Loop Control & Optical Reflectance',
    level: 7,
    objective: 'Track arena contrast line using infrared optical sensors and differential motor power control.',
    context: 'Automated Guided Vehicles (AGVs) in industrial logistics and surgical suites follow optical surface tracks with high reliability.',
    whyItMatters: 'Feedback loops continuously compare desired state against actual state to correct errors in real time.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Predict Feedback Correction',
        instruction: 'If the center sensor detects black, drive forward. What should happen if the left sensor detects black?',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Watch Differential Steering',
        instruction: 'Run the line follower and observe how the left and right motor power values modulate.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Check Polling Frequency',
        instruction: 'Notice the sleep delay inside the loop: how does delay time affect tracking smoothness?',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Increase Tracking Speed',
        instruction: 'Try increasing motor power from 75 to 90. Can the sensor loop keep up with the faster speed?',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Add End-of-Line Stop',
        instruction: 'Program the robot to detect when all 3 sensors read white and stop automatically!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'line_sensor_read', label: 'Line Reflectance Polled', description: 'Sensor line block queried inside repetition loop', points: 30 },
      { id: 'differential_power', label: 'Differential Power Control', description: 'Left and right motor power adjusted based on sensor state', points: 30 },
      { id: 'loop_pacing', label: 'Sample Delay Configured', description: 'Sleep interval balances CPU usage with responsiveness', points: 20 },
      { id: 'track_maintained', label: 'Track Trajectory Maintained', description: 'Rover navigates line route without diverging', points: 20 }
    ],
    socraticHint: 'If your rover wobbles violently back and forth, your correction power is too high! In robotics control theory, smaller corrections produce smoother path tracking.',
    evidenceSkillId: 'skill_feedback_control'
  },

  dance_party: {
    id: 'dance_party',
    title: 'Expressive Bot & Companion',
    shortLabel: 'Dance 🕺',
    icon: '🕺',
    stage: 'middle',
    gradeBracket: 'Classes 7–8 • Ages 12–14',
    cstaStandard: 'CSTA 2-AP-16 • Human-Robot Interaction',
    competencyDomain: 'Multimodal Feedback & Companion Robotics',
    level: 8,
    objective: 'Orchestrate synchronized companion expressions: OLED visor emotions, speech voice, rhythmic dances, and party jumps.',
    context: 'Social robots communicate status and intention to human partners using coordinated sound, facial graphics, and physical gestures.',
    whyItMatters: 'Human-Robot Interaction (HRI) is a major engineering discipline: making machines predictable, safe, and pleasant for human collaboration.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Predict Social Cues',
        instruction: 'How will human teammates recognize that the robot is happy, celebrating, or needs assistance?',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Observe Visor & Movement',
        instruction: 'Watch the OLED visor display emotions while the chassis executes rhythmic jumps and twirls.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Listen to Web Audio Synth',
        instruction: 'Notice how note tempos and waveform synthesizers harmonize with physical robot motions.',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Change Dance Choreography',
        instruction: 'Switch dance style from TWIRL to SHUFFLE or WIGGLE and adjust duration.',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Create an Emotion Sequence',
        instruction: 'Program a 3-stage emotional progression: Curiosity $\\to$ Surprise $\\to$ Joy!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'emotion_rendered', label: 'OLED Emotion State Rendered', description: '`robot_express_emotion` block attached', points: 25 },
      { id: 'speech_synthesized', label: 'Speech Voice Synthesized', description: '`robot_speak_voice` outputs verbal greeting', points: 25 },
      { id: 'rhythmic_motion', label: 'Rhythmic Choreography & Jump', description: 'Dance twirl or jump blocks choreographed with timing', points: 25 },
      { id: 'sound_harmony', label: 'Audio Effect Synchronized', description: 'Web Audio effect or dance beat aligned with movement', points: 25 }
    ],
    socraticHint: 'Use `robot_during_performance` to enclose your companion blocks. This keeps the robot\'s expression state coordinated throughout the performance!',
    evidenceSkillId: 'skill_human_robot_interaction'
  },

  sync_choreography: {
    id: 'sync_choreography',
    title: 'Multi-Bot Swarm Coordination',
    shortLabel: 'Choreo 👯',
    icon: '👯',
    stage: 'middle',
    gradeBracket: 'Class 8 • Ages 13–14',
    cstaStandard: 'CSTA 2-AP-17 • Distributed Concurrency',
    competencyDomain: 'Swarm Synchronization & Radio Protocols',
    level: 9,
    objective: 'Coordinate multi-robot team routines using radio sync cues, tempo beats, formation steps, and group fanfare.',
    context: 'Autonomous warehouse swarms and drone light shows coordinate complex group routines without colliding using distributed sync signals.',
    whyItMatters: 'Concurrency and distributed systems are advanced computer science principles made tangible through multi-robot team choreography.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Predict Swarm Sync',
        instruction: 'How do multiple robots stay in sync across wireless radio? (Answer: Shared clock cues and event broadcasts).',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Run Swarm Routine',
        instruction: 'Execute the choreography and observe how sync cues trigger synchronized movement steps.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Check Sync Timing',
        instruction: 'Notice the broadcast cue blocks: how do they signal teammates to start the next formation phase?',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Change Formation Tempo',
        instruction: 'Speed up or slow down the rhythm beats and see how the team timing shifts.',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Design Team Finale',
        instruction: 'Add a synchronized team cheer and multi-note fanfare upon completing the formation routine!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'sync_cue_sent', label: 'Wireless Sync Cue Dispatched', description: '`robot_sync_cue` called to coordinate group', points: 30 },
      { id: 'formation_step', label: 'Formation Step Executed', description: 'Coordinated movement steps aligned to tempo', points: 30 },
      { id: 'rhythm_tempo', label: 'Dance Beat Audio Tracked', description: 'Beat tempo sound aligned with physical movement', points: 20 },
      { id: 'team_harmony', label: 'Group Finale Output', description: 'Synchronized emotion and victory fanfare completed', points: 20 }
    ],
    socraticHint: 'In distributed computing, timing is critical. Use `event_broadcast_and_wait` when you need all robots to finish the current step before starting the next!',
    evidenceSkillId: 'skill_distributed_concurrency'
  },

  mars_expedition: {
    id: 'mars_expedition',
    title: 'Autonomous Mars Expedition',
    shortLabel: 'Mars 🪐',
    icon: '🪐',
    stage: 'secondary',
    gradeBracket: 'Classes 8–10 • Ages 13–16',
    cstaStandard: 'CSTA 3A-AP-14 • System Integration & Capstone Engineering',
    competencyDomain: 'Astro-Robotics & Mission State Machines',
    level: 10,
    objective: 'Deploy solar array panels, navigate crater hazards, survey geological sector, core drill mineral samples, and stream telemetry.',
    context: 'The capstone planetary robotics mission: synthesizes solar power budgeting, obstacle evasion, multi-tool actuation, and mission science data streaming.',
    whyItMatters: 'Real engineering is interdisciplinary: mechanics, software, electrical power, sensors, and science data must work together harmoniously.',
    primmSteps: [
      {
        phase: 'Predict',
        title: 'Predict Full Mission Lifecycle',
        instruction: 'Trace the entire mission flow: Solar Deployment $\\to$ Navigation $\\to$ Geological Survey $\\to$ Sample Extraction $\\to$ Telemetry Streaming.',
        badge: 'Step 1'
      },
      {
        phase: 'Run',
        title: 'Run Capstone Simulation',
        instruction: 'Execute the full expedition in the Proving Ground. Watch the radar cone, waypoints, and sample collection confirmation.',
        badge: 'Step 2'
      },
      {
        phase: 'Investigate',
        title: 'Inspect Science Telemetry',
        instruction: 'Open the Console to verify that geological radiation levels and battery reserves are recorded.',
        badge: 'Step 3'
      },
      {
        phase: 'Modify',
        title: 'Optimize Energy Efficiency',
        instruction: 'Adjust the solar array angle (try $45^\\circ$) to maximize energy recharge while cruising.',
        badge: 'Step 4'
      },
      {
        phase: 'Make',
        title: 'Graduate to Python Code',
        instruction: 'Switch to the "Split" or "Code" view tab to inspect the equivalent Python code generated for this complete Mars mission!',
        badge: 'Step 5'
      }
    ],
    rubric: [
      { id: 'solar_deployed', label: 'Solar Array Deployed', description: '`rover_deploy_solar` activated to charge power subsystem', points: 20 },
      { id: 'transit_navigation', label: 'Crater Transit Navigation', description: 'Autonomous drive vector toward target sector', points: 25 },
      { id: 'sector_survey', label: 'Geological Sector Surveyed', description: '`rover_survey_sector` checks crater geology', points: 20 },
      { id: 'sample_extracted', label: 'Mineral Core Sample Drilled', description: '`rover_collect_sample` retrieves specimen', points: 20 },
      { id: 'telemetry_transmitted', label: 'Science Telemetry Streamed', description: '`datalog_send_telemetry` streams report to mission control', points: 15 }
    ],
    socraticHint: 'Notice how each block in this mission directly corresponds to an authentic Python function in the Split view! When you are ready, switch to Code mode to write pure Python.',
    evidenceSkillId: 'skill_system_integration',
    targetCoords: { x: 220, y: 190 }
  }
};

/**
 * Evaluates mission-specific rubric criteria against live workspace state & rover metrics
 */
export function evaluateMissionRubric(
  missionId: string,
  evaluation: AlgorithmicEvaluation | null,
  roverState?: {
    x: number;
    y: number;
    batteryLevel: number;
    hasCollided: boolean;
    samplesCollected: number;
  }
): {
  passed: boolean;
  score: number;
  maxScore: number;
  percentage: number;
  totalItems: number;
  completedItems: string[];
  feedback: string[];
} {
  const mission = STEM_MISSIONS[missionId] || STEM_MISSIONS.starter;
  const maxScore = mission.rubric.reduce((acc, r) => acc + r.points, 0);
  let earnedScore = 0;
  const completedItems: string[] = [];
  const feedback: string[] = [];

  const totalBlocks = evaluation?.totalBlocks || 0;
  const activeDims = evaluation?.activeDimensions || [];
  const hasKinematics = activeDims.some((d) => d.id === 'kinematics' && d.score > 0);
  const hasLoops = activeDims.some((d) => d.id === 'loops' && d.score > 0);
  const hasConditionals = activeDims.some((d) => d.id === 'conditionals' && d.score > 0);

  for (const item of mission.rubric) {
    let itemPassed = false;

    switch (item.id) {
      case 'start_connected':
      case 'c_block_used':
        itemPassed = totalBlocks >= 2;
        break;

      case 'drive_vector':
      case 'transit_navigation':
        itemPassed = hasKinematics;
        break;

      case 'led_beacon':
      case 'audio_telemetry':
      case 'celebration_cue':
      case 'sound_harmony':
        itemPassed = activeDims.some((d) => d.id === 'telemetry' || d.id === 'performance');
        break;

      case 'safe_stop':
      case 'clean_termination':
      case 'zero_collisions':
        itemPassed = !roverState?.hasCollided;
        break;

      case 'repeat_count':
      case 'geometric_loop':
        itemPassed = hasLoops;
        break;

      case 'corner_turns':
        itemPassed = hasKinematics && totalBlocks >= 3;
        break;

      case 'closed_loop':
        itemPassed = hasLoops && hasKinematics;
        break;

      case 'nested_actions':
        itemPassed = totalBlocks >= 3;
        break;

      case 'sonar_reading':
      case 'line_sensor_read':
        itemPassed = activeDims.some((d) => d.id === 'sensing' && d.score > 0);
        break;

      case 'conditional_branch':
        itemPassed = hasConditionals;
        break;

      case 'evasive_turn':
        itemPassed = hasConditionals && hasKinematics;
        break;

      case 'pen_state':
      case 'style_attributes':
      case 'trail_rendered':
        itemPassed = activeDims.some((d) => d.id === 'geometry' && d.score > 0) || totalBlocks >= 3;
        break;

      case 'navigation_target':
      case 'drill_actuated':
      case 'sample_extracted':
        itemPassed = totalBlocks >= 4;
        break;

      case 'telemetry_streamed':
      case 'solar_deployed':
      case 'sector_survey':
      case 'telemetry_transmitted':
        itemPassed = totalBlocks >= 4;
        break;

      case 'differential_power':
      case 'loop_pacing':
      case 'track_maintained':
        itemPassed = hasLoops && hasKinematics;
        break;

      case 'emotion_rendered':
      case 'speech_synthesized':
      case 'rhythmic_motion':
        itemPassed = activeDims.some((d) => d.id === 'performance' && d.score > 0);
        break;

      case 'sync_cue_sent':
      case 'formation_step':
      case 'rhythm_tempo':
      case 'team_harmony':
        itemPassed = totalBlocks >= 4;
        break;

      default:
        itemPassed = totalBlocks >= 2;
    }

    if (itemPassed) {
      earnedScore += item.points;
      completedItems.push(item.id);
    } else {
      feedback.push(item.description);
    }
  }

  const percentage = Math.round((earnedScore / maxScore) * 100);
  const passed = percentage >= 70;

  return {
    passed,
    score: earnedScore,
    maxScore,
    percentage,
    totalItems: mission.rubric.length,
    completedItems,
    feedback
  };
}
