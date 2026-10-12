import type { AssessmentItem } from '@core-os/domain';

export const ROBOTICS_BENCHMARK_ITEMS: AssessmentItem[] = [
  // Item 1: Sequential Execution & Motor Durations (CSTA 1A-AP-10 / Preparatory)
  {
    id: 'ITEM-ROB-001',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-SEQUENCING',
    code: 'ROB-001',
    prompt: 'A mobile rover executes three sequential instructions: 1. "drive forward at 50% for 2s", 2. "turn right 90°", 3. "drive forward at 50% for 2s". Assuming starting position at (0, 0) facing North (positive Y), where does the rover stop?',
    explanation: 'Step 1 drives North 2 units to (0, 2). Step 2 turns 90° right to face East. Step 3 drives East 2 units to (2, 2).',
    options: [
      { id: 'opt-a', text: '(0, 4) facing North' },
      { id: 'opt-b', text: '(2, 2) facing East' },
      { id: 'opt-c', text: '(-2, 2) facing West' },
      { id: 'opt-d', text: '(2, 0) facing South' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '(0, 4) facing North', misconceptionCode: 'MISC_IGNORED_TURN', misconceptionDescription: 'Ignored the 90° right turn and continued driving straight North.' },
      { id: 'opt-c', text: '(-2, 2) facing West', misconceptionCode: 'MISC_INVERTED_TURN_DIRECTION', misconceptionDescription: 'Turned left 90° instead of right 90°.' },
      { id: 'opt-d', text: '(2, 0) facing South', misconceptionCode: 'MISC_REVERSED_Y_COORDINATE', misconceptionDescription: 'Inverted the initial forward displacement.' }
    ],
    irt: { a: 1.15, b: -1.5, c: 0.25 },
    ageBand: [8, 13],
    status: 'calibrated'
  },
  // Item 2: Repeat Loop Invariants & Perimeter Traversal (CSTA 1A-AP-11 / Preparatory)
  {
    id: 'ITEM-ROB-002',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-LOOPS',
    code: 'ROB-002',
    prompt: 'A robot follows this loop: "repeat 4 times: [drive forward 100cm, turn right 90°]". What geometric shape does the rover trace on the floor, and what is its net total angular rotation?',
    explanation: 'Four repetitions of 100cm forward followed by a 90° right turn traces a complete square perimeter. The net angular rotation is 4 × 90° = 360°, returning the rover to its original orientation.',
    options: [
      { id: 'opt-a', text: 'A triangle with 270° total rotation' },
      { id: 'opt-b', text: 'A square with 360° total rotation' },
      { id: 'opt-c', text: 'A straight line of 400cm with 0° rotation' },
      { id: 'opt-d', text: 'An octagon with 720° total rotation' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'A triangle with 270° total rotation', misconceptionCode: 'MISC_TRIANGLE_GEOMETRY', misconceptionDescription: 'Confused 4 sides with a 3-sided triangle.' },
      { id: 'opt-c', text: 'A straight line of 400cm with 0° rotation', misconceptionCode: 'MISC_IGNORED_LOOP_TURNS', misconceptionDescription: 'Summed forward distances while ignoring turns inside loop body.' },
      { id: 'opt-d', text: 'An octagon with 720° total rotation', misconceptionCode: 'MISC_OCTAGON_CONFUSION', misconceptionDescription: 'Doubled the loop count and angle.' }
    ],
    irt: { a: 1.25, b: -1.1, c: 0.25 },
    ageBand: [8, 14],
    status: 'calibrated'
  },
  // Item 3: Ultrasonic Sonar Echo Timing (Physics & Kinematics in Robotics)
  {
    id: 'ITEM-ROB-003',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-ROB-SONAR-PHYSICS',
    code: 'ROB-003',
    prompt: 'An HC-SR04 ultrasonic distance sensor sends an acoustic ping and receives the reflected echo pulse 2.0 milliseconds (0.002 seconds) later. If sound travels at 340 m/s in air, what is the distance from the sensor to the obstacle wall?',
    explanation: 'The sound wave must travel to the obstacle and bounce back (round-trip 2d). Total distance = speed × time = 340 m/s × 0.002 s = 0.68 m = 68 cm. One-way distance to wall = 68 cm / 2 = 34 cm.',
    options: [
      { id: 'opt-a', text: '17 cm' },
      { id: 'opt-b', text: '34 cm' },
      { id: 'opt-c', text: '68 cm' },
      { id: 'opt-d', text: '136 cm' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '17 cm', misconceptionCode: 'MISC_HALVED_TWICE', misconceptionDescription: 'Halved the distance calculation twice.' },
      { id: 'opt-c', text: '68 cm', misconceptionCode: 'MISC_ROUND_TRIP_NEGLECT', misconceptionDescription: 'Forgot to divide round-trip distance by 2 for the one-way distance to the obstacle.' },
      { id: 'opt-d', text: '136 cm', misconceptionCode: 'MISC_DOUBLED_DISTANCE', misconceptionDescription: 'Multiplied the round-trip distance by 2.' }
    ],
    irt: { a: 1.35, b: -0.3, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 4: Conditional Avoidance Branching (CSTA 1B-AP-10 / Middle)
  {
    id: 'ITEM-ROB-004',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-CONDITIONALS',
    code: 'ROB-004',
    prompt: 'Examine this code loop:\n```python\nwhile True:\n    dist = get_sonar_distance()\n    if dist < 20:\n        stop_motors()\n        turn_right(90)\n    else:\n        drive_forward(speed=60)\n```\nThe rover approaches an obstacle starting at 50cm away. What behavior will the rover exhibit?',
    explanation: 'While distance is ≥ 20cm, the `else` branch executes, cruising forward. When distance drops below 20cm, the `if` branch triggers: motors stop, it pivots 90° right, and then continues forward if the new path has dist ≥ 20cm.',
    options: [
      { id: 'opt-a', text: 'It will stop immediately without ever moving forward' },
      { id: 'opt-b', text: 'It will drive forward until it reaches 20cm from the obstacle, turn right 90°, and continue' },
      { id: 'opt-c', text: 'It will crash into the obstacle and then spin continuously' },
      { id: 'opt-d', text: 'It will turn right 90° repeatedly without driving forward' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'It will stop immediately without ever moving forward', misconceptionCode: 'MISC_INITIAL_CONDITION_FALSE', misconceptionDescription: 'Assumed dist < 20 evaluates to true at 50cm.' },
      { id: 'opt-c', text: 'It will crash into the obstacle and then spin continuously', misconceptionCode: 'MISC_LOOP_HALT_MISUNDERSTANDING', misconceptionDescription: 'Believed sensors do not update inside the while loop.' },
      { id: 'opt-d', text: 'It will turn right 90° repeatedly without driving forward', misconceptionCode: 'MISC_BRANCH_EXCLUSIVE_ERROR', misconceptionDescription: 'Thought both if and else execute simultaneously.' }
    ],
    irt: { a: 1.30, b: -0.5, c: 0.25 },
    ageBand: [10, 15],
    status: 'calibrated'
  },
  // Item 5: Differential Drive Kinematics (Wheel Speed Differences) (CSTA 2-AP-12)
  {
    id: 'ITEM-ROB-005',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-DIFFERENTIAL-DRIVE',
    code: 'ROB-005',
    prompt: 'A two-wheeled differential drive rover has left wheel motor set to 80% power and right wheel motor set to 40% power. What kinematic motion trajectory will the rover follow across the ground?',
    explanation: 'When the left wheel rotates faster than the right wheel, the rover executes a smooth arc turn toward the right (toward the slower wheel).',
    options: [
      { id: 'opt-a', text: 'A straight line forward at 60% average speed' },
      { id: 'opt-b', text: 'A curved arc turn curving toward the right' },
      { id: 'opt-c', text: 'A curved arc turn curving toward the left' },
      { id: 'opt-d', text: 'A static spin in place around its central axis' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'A straight line forward at 60% average speed', misconceptionCode: 'MISC_AVERAGED_WHEEL_VECTORS', misconceptionDescription: 'Assumed differing wheel speeds average out into a straight line.' },
      { id: 'opt-c', text: 'A curved arc turn curving toward the left', misconceptionCode: 'MISC_INVERTED_CURVATURE', misconceptionDescription: 'Believed rover curves toward the faster wheel instead of slower.' },
      { id: 'opt-d', text: 'A static spin in place around its central axis', misconceptionCode: 'MISC_CONFUSED_WITH_OPPOSING_POWERS', misconceptionDescription: 'Confused differing forward speeds with opposite polarity rotations (+80% and -80%).' }
    ],
    irt: { a: 1.40, b: 0.1, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 6: Line Follower Sensor Feedback & Bang-Bang Control (CSTA 2-AP-13)
  {
    id: 'ITEM-ROB-006',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-LINE-TRACKING',
    code: 'ROB-006',
    prompt: 'A robot uses two optical reflectance sensors (Left and Right) to follow a black tape line on white flooring. The logic is:\n- Left sees Black, Right sees White → Turn Left\n- Left sees White, Right sees Black → Turn Right\n- Both see White → Drive Forward\nWhat causes this robot to oscillate (wobble/zigzag) noticeably along the track?',
    explanation: 'This "bang-bang" (two-state threshold) control strategy applies sudden, maximum steering corrections with zero proportional damping. The robot continuously overshoots the line center in both directions.',
    options: [
      { id: 'opt-a', text: 'The battery voltage is too low to maintain forward speed' },
      { id: 'opt-b', text: 'Bang-bang threshold switching overcorrects abruptly, causing oscillations without proportional damping' },
      { id: 'opt-c', text: 'The reflectance sensors are blinded by ambient room lighting' },
      { id: 'opt-d', text: 'The black line absorbs too much magnetic flux' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The battery voltage is too low to maintain forward speed', misconceptionCode: 'MISC_POWER_SUPPLY_ATTRIBUTION', misconceptionDescription: 'Attributed control theory oscillation to power sag.' },
      { id: 'opt-c', text: 'The reflectance sensors are blinded by ambient room lighting', misconceptionCode: 'MISC_SENSOR_BLINDNESS_CLAIM', misconceptionDescription: 'Sensors are reading the line; the oscillation is algorithmic.' },
      { id: 'opt-d', text: 'The black line absorbs too much magnetic flux', misconceptionCode: 'MISC_PSEUDOSCIENTIFIC_MAGNETISM', misconceptionDescription: 'Optical infrared reflectance has no relation to magnetism.' }
    ],
    irt: { a: 1.35, b: 0.35, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 7: PID Controller Proportional vs Integral vs Derivative (CSTA 3A-AP-16 / Secondary)
  {
    id: 'ITEM-ROB-007',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-PID-TUNING',
    code: 'ROB-007',
    prompt: 'In a PID feedback steering controller, which term is specifically responsible for eliminating steady-state offset error (accumulated error over elapsed time)?',
    explanation: 'The Integral term (Ki × ∫ e(t) dt) continuously accumulates past steady-state errors over time, boosting control effort until the steady-state offset is driven strictly to zero.',
    options: [
      { id: 'opt-a', text: 'Proportional term (Kp)' },
      { id: 'opt-b', text: 'Integral term (Ki)' },
      { id: 'opt-c', text: 'Derivative term (Kd)' },
      { id: 'opt-d', text: 'Feedforward term (Kf)' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Proportional term (Kp)', misconceptionCode: 'MISC_CONFUSED_P_WITH_I', misconceptionDescription: 'Proportional control alone always leaves a residual steady-state offset error.' },
      { id: 'opt-c', text: 'Derivative term (Kd)', misconceptionCode: 'MISC_CONFUSED_D_WITH_I', misconceptionDescription: 'Derivative control dampens rate of change and reduces overshoot, but cannot eliminate steady-state error.' },
      { id: 'opt-d', text: 'Feedforward term (Kf)', misconceptionCode: 'MISC_FEEDFORWARD_CONFUSION', misconceptionDescription: 'Feedforward anticipates known disturbances, not accumulated past error integration.' }
    ],
    irt: { a: 1.50, b: 1.2, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 8: Pulse Width Modulation (PWM) Duty Cycle (Hardware Microcontrollers)
  {
    id: 'ITEM-ROB-008',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-PWM-ELECTRONICS',
    code: 'ROB-008',
    prompt: 'A microcontroller powers a DC motor driver using a 5V PWM signal with an 8-bit resolution (0 to 255). If software outputs a PWM value of 191, what is the effective average voltage supplied to the motor gate?',
    explanation: 'Duty cycle = 191 / 255 ≈ 0.749 (75%). Average effective voltage = 5V × 0.749 = 3.745V ≈ 3.75 Volts.',
    options: [
      { id: 'opt-a', text: '1.25 V' },
      { id: 'opt-b', text: '2.50 V' },
      { id: 'opt-c', text: '3.75 V' },
      { id: 'opt-d', text: '4.80 V' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '1.25 V', misconceptionCode: 'MISC_INVERTED_DUTY_CYCLE', misconceptionDescription: 'Calculated the LOW time fraction (25% × 5V = 1.25V) instead of HIGH time duty cycle.' },
      { id: 'opt-b', text: '2.50 V', misconceptionCode: 'MISC_ASSUMED_HALF_POWER', misconceptionDescription: 'Assumed 50% duty cycle regardless of register value.' },
      { id: 'opt-d', text: '4.80 V', misconceptionCode: 'MISC_MAX_VOLTAGE_ESTIMATE', misconceptionDescription: 'Approximated near 100% saturation.' }
    ],
    irt: { a: 1.35, b: 0.45, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 9: Finite State Machine (FSM) State Transitions (CSTA 2-AP-10 / Middle)
  {
    id: 'ITEM-ROB-009',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-STATE-MACHINES',
    code: 'ROB-009',
    prompt: 'A robotic vacuum cleaner operates with three distinct states: `IDLE`, `CLEANING`, and `DOCKING`. When in `CLEANING` state, battery level drops below 15%. What state transition should execute immediately according to safe autonomous design?',
    explanation: 'When energy falls below the critical 15% threshold during active cleaning, the robot must immediately transition to `DOCKING` to navigate back to the charging station before total depletion.',
    options: [
      { id: 'opt-a', text: 'Transition to `IDLE` and shut down in the center of the room' },
      { id: 'opt-b', text: 'Transition to `DOCKING` to autonomously navigate back to the charging station' },
      { id: 'opt-c', text: 'Remain in `CLEANING` until battery hits 0% and power fails' },
      { id: 'opt-d', text: 'Reset software microcontroller memory and erase cleaning map' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Transition to `IDLE` and shut down in the center of the room', misconceptionCode: 'MISC_PREMATURE_SHUTDOWN', misconceptionDescription: 'Strands the robot away from its power source.' },
      { id: 'opt-c', text: 'Remain in `CLEANING` until battery hits 0% and power fails', misconceptionCode: 'MISC_EXHAUSTIVE_DEPLETION_RISK', misconceptionDescription: 'Violates safe battery preservation thresholds.' },
      { id: 'opt-d', text: 'Reset software microcontroller memory and erase cleaning map', misconceptionCode: 'MISC_DESTRUCTIVE_RESET', misconceptionDescription: 'Destroys navigation state unnecessarily.' }
    ],
    irt: { a: 1.15, b: -1.2, c: 0.25 },
    ageBand: [9, 14],
    status: 'calibrated'
  },
  // Item 10: Optical Wheel Encoders & Odometer Calculations (WRO / CSTA 2-AP-14)
  {
    id: 'ITEM-ROB-010',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-ROB-ENCODERS',
    code: 'ROB-010',
    prompt: 'A rover wheel has a diameter of 6.0 cm (circumference = π × d ≈ 18.85 cm). The wheel shaft is fitted with a 360-tick optical rotary encoder. If the encoder counts 720 ticks during a straight sprint, how far has the wheel rolled?',
    explanation: 'Number of full rotations = 720 ticks / 360 ticks per rotation = 2.0 full rotations. Distance = 2.0 × circumference = 2.0 × 18.85 cm = 37.7 cm.',
    options: [
      { id: 'opt-a', text: '18.85 cm' },
      { id: 'opt-b', text: '37.70 cm' },
      { id: 'opt-c', text: '75.40 cm' },
      { id: 'opt-d', text: '113.10 cm' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '18.85 cm', misconceptionCode: 'MISC_SINGLE_ROTATION_CALC', misconceptionDescription: 'Calculated displacement for only 1 rotation (360 ticks).' },
      { id: 'opt-c', text: '75.40 cm', misconceptionCode: 'MISC_DOUBLED_ROTATIONS', misconceptionDescription: 'Counted 4 rotations instead of 2.' },
      { id: 'opt-d', text: '113.10 cm', misconceptionCode: 'MISC_TRIPLED_DISPLACEMENT', misconceptionDescription: 'Arithmetic multiplier error.' }
    ],
    irt: { a: 1.30, b: 0.2, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 11: Algorithmic Debugging: Off-by-One Loops (CSTA 2-AP-17)
  {
    id: 'ITEM-ROB-011',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-DEBUG-OFF-BY-ONE',
    code: 'ROB-011',
    prompt: 'A student writes a Python script to deploy 5 research flags at 2-meter intervals along a 8-meter transect (at 0m, 2m, 4m, 6m, 8m):\n```python\nfor i in range(4):\n    drive_forward(2.0)\n    deploy_flag()\n```\nWhy does this script only deploy 4 flags instead of 5?',
    explanation: 'The loop executes 4 times and deploys after moving forward. It misses the initial flag at starting coordinate 0m (or only iterates 4 times). To deploy 5 flags over 4 intervals requires deploying before the loop or looping 5 times.',
    options: [
      { id: 'opt-a', text: 'The rover motor runs out of battery before the loop completes' },
      { id: 'opt-b', text: '`range(4)` executes exactly 4 times; the fencepost problem requires deploying an initial flag at 0m or iterating 5 times' },
      { id: 'opt-c', text: '`deploy_flag()` cannot be called inside a for loop in Python' },
      { id: 'opt-d', text: 'Python for loops only execute odd numbers of iterations' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The rover motor runs out of battery before the loop completes', misconceptionCode: 'MISC_HARDWARE_DEFECT_BLAME', misconceptionDescription: 'Attributed an algorithmic fencepost logic error to battery failure.' },
      { id: 'opt-c', text: '`deploy_flag()` cannot be called inside a for loop in Python', misconceptionCode: 'MISC_IMAGINED_SYNTAX_RESTRICTION', misconceptionDescription: 'Fabricated false syntax rule.' },
      { id: 'opt-d', text: 'Python for loops only execute odd numbers of iterations', misconceptionCode: 'MISC_LOOP_RANGE_MYTH', misconceptionDescription: 'Fabricated iteration parity myth.' }
    ],
    irt: { a: 1.35, b: -0.1, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 12: Concurrency & Race Conditions in Multi-Threaded Robotics (CSTA 3A-AP-16)
  {
    id: 'ITEM-ROB-012',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-CONCURRENCY',
    code: 'ROB-012',
    prompt: 'A robotic control operating system runs two concurrent asynchronous tasks:\n- Task A: Reads sonar every 10ms and writes distance to shared variable `g_distance`\n- Task B: Reads `g_distance` and controls motor steering\nIf Task A is interrupted midway through writing a 16-bit integer, Task B might read half of the old value and half of the new value. What software mechanism prevents this race condition?',
    explanation: 'A Mutex (Mutual Exclusion lock) or atomic memory transaction guarantees that shared memory can only be accessed by one thread at a time, ensuring data integrity across concurrent tasks.',
    options: [
      { id: 'opt-a', text: 'A higher CPU clock frequency' },
      { id: 'opt-b', text: 'A Mutex (Mutual Exclusion lock) ensuring atomic read/write access' },
      { id: 'opt-c', text: 'Connecting a larger motor capacitor' },
      { id: 'opt-d', text: 'Replacing Python with HTML' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'A higher CPU clock frequency', misconceptionCode: 'MISC_CLOCK_SPEED_PANACEA', misconceptionDescription: 'Faster CPU execution does not eliminate asynchronous race conditions.' },
      { id: 'opt-c', text: 'Connecting a larger motor capacitor', misconceptionCode: 'MISC_ELECTRICAL_FIX_FOR_CODE', misconceptionDescription: 'Used electrical hardware filter for a software concurrency bug.' },
      { id: 'opt-d', text: 'Replacing Python with HTML', misconceptionCode: 'MISC_LANGUAGE_CATEGORY_ERROR', misconceptionDescription: 'HTML is a markup language, not a real-time OS concurrency runtime.' }
    ],
    irt: { a: 1.45, b: 1.3, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 13: Time Complexity of Pathfinding Algorithms (CSTA 3B-AP-11)
  {
    id: 'ITEM-ROB-013',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-PATHFINDING-COMPLEXITY',
    code: 'ROB-013',
    prompt: 'An autonomous rover uses the A* (A-Star) search algorithm to find the optimal path across an N × N grid map. Why is A* with an admissible heuristic preferred over unguided Breadth-First Search (BFS)?',
    explanation: 'A* uses a heuristic function (estimating remaining distance to goal) to prioritize expanding nodes in the direction of the target, pruning unpromising search branches and drastically reducing memory and CPU time.',
    options: [
      { id: 'opt-a', text: 'Because BFS requires a quantum computer to calculate arithmetic' },
      { id: 'opt-b', text: 'Because A* guides exploration toward the target using heuristic estimates, dramatically reducing search space while guaranteeing optimality' },
      { id: 'opt-c', text: 'Because A* only works on physical hardware and cannot run in simulation' },
      { id: 'opt-d', text: 'Because BFS always chooses random paths' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Because BFS requires a quantum computer to calculate arithmetic', misconceptionCode: 'MISC_QUANTUM_MYTH', misconceptionDescription: 'BFS runs on standard classical computers.' },
      { id: 'opt-c', text: 'Because A* only works on physical hardware and cannot run in simulation', misconceptionCode: 'MISC_SIMULATION_EXCLUSION', misconceptionDescription: 'Pathfinding is purely algorithmic software.' },
      { id: 'opt-d', text: 'Because BFS always chooses random paths', misconceptionCode: 'MISC_CONFUSED_BFS_WITH_RANDOM_WALK', misconceptionDescription: 'BFS explores systematically in concentric frontiers, not randomly.' }
    ],
    irt: { a: 1.50, b: 1.0, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 14: Digital Logic Gates in Safety Emergency Interlocks (Systems Thinking)
  {
    id: 'ITEM-ROB-014',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-LOGIC-GATES',
    code: 'ROB-014',
    prompt: 'A robotic arm safety interlock must enable motor power (OUTPUT = 1) ONLY IF both the "Safety Guard Closed" sensor (Input A = 1) AND the "Operator Deadman Switch" (Input B = 1) are active, provided the "Emergency Stop" button (Input C = 1 when pressed) is NOT pressed (C = 0). Which boolean expression represents this circuit?',
    explanation: 'Motors require A AND B AND (NOT C): Output = A AND B AND (NOT C).',
    options: [
      { id: 'opt-a', text: 'Output = A OR B OR C' },
      { id: 'opt-b', text: 'Output = A AND B AND (NOT C)' },
      { id: 'opt-c', text: 'Output = (A AND B) OR C' },
      { id: 'opt-d', text: 'Output = NOT (A AND B AND C)' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Output = A OR B OR C', misconceptionCode: 'MISC_ALL_OR_GATES', misconceptionDescription: 'Would trigger motor if E-stop is pressed alone.' },
      { id: 'opt-c', text: 'Output = (A AND B) OR C', misconceptionCode: 'MISC_ESTOP_ACTIVE_HIGH', misconceptionDescription: 'Pressing E-stop would erroneously activate motor.' },
      { id: 'opt-d', text: 'Output = NOT (A AND B AND C)', misconceptionCode: 'MISC_NAND_CONFUSION', misconceptionDescription: 'NAND logic inverts the entire condition.' }
    ],
    irt: { a: 1.30, b: 0.0, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 15: I2C vs SPI Serial Bus Protocols (Robotics Embedded Systems)
  {
    id: 'ITEM-ROB-015',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-COMM-PROTOCOLS',
    code: 'ROB-015',
    prompt: 'An engineer connects 8 different sensors (accelerometers, gyros, thermometers) to a single microcontroller using only 2 shared physical pins (SDA for data, SCL for clock). Which communication protocol enables multiple addressable peripheral devices on this 2-wire bus?',
    explanation: 'I2C (Inter-Integrated Circuit) uses a 2-wire serial bus (SDA and SCL) where every peripheral device is identified by a unique 7-bit or 10-bit address, allowing up to 128 devices on the same two wires.',
    options: [
      { id: 'opt-a', text: 'SPI (Serial Peripheral Interface)' },
      { id: 'opt-b', text: 'I2C (Inter-Integrated Circuit)' },
      { id: 'opt-c', text: 'RS-232 Parallel Bus' },
      { id: 'opt-d', text: 'PWM Pulse Channel' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'SPI (Serial Peripheral Interface)', misconceptionCode: 'MISC_SPI_WIRE_COUNT_ERROR', misconceptionDescription: 'SPI requires 4 wires (MOSI, MISO, SCK, plus dedicated CS lines per slave).' },
      { id: 'opt-c', text: 'RS-232 Parallel Bus', misconceptionCode: 'MISC_RS232_CONFUSION', misconceptionDescription: 'RS-232 is point-to-point and not multi-drop addressed.' },
      { id: 'opt-d', text: 'PWM Pulse Channel', misconceptionCode: 'MISC_PWM_AS_BUS', misconceptionDescription: 'PWM is a duty-cycle modulation technique, not a digital multi-device addressable serial protocol.' }
    ],
    irt: { a: 1.45, b: 0.85, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 16: Sensor Fusion (Kalman Filter Concepts) (CSTA 3B-AP-22)
  {
    id: 'ITEM-ROB-016',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-SENSOR-FUSION',
    code: 'ROB-016',
    prompt: 'A Mars rover estimates its real-time heading orientation using an accelerometer/gyroscope IMU and wheel encoders. The gyro drifts slowly over time, while wheel encoders slip on loose Martian sand dunes. How does sensor fusion (e.g. Complementary or Kalman filtering) achieve accurate position estimation?',
    explanation: 'Sensor fusion combines high-frequency responsiveness from gyro integration with low-frequency drift correction from odometry/visual markers, statistically weighting each source according to its variance.',
    options: [
      { id: 'opt-a', text: 'It ignores the gyro completely and relies only on wheel counts' },
      { id: 'opt-b', text: 'It mathematically combines the noisy complementary data streams, filtering out high-frequency noise and low-frequency drift' },
      { id: 'opt-c', text: 'It shuts down motors whenever any single sensor reports uncertainty' },
      { id: 'opt-d', text: 'It multiplies sensor values until the sum equals 100%' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'It ignores the gyro completely and relies only on wheel counts', misconceptionCode: 'MISC_SINGLE_SENSOR_FALLBACK', misconceptionDescription: 'Ignoring gyro retains slipping wheel errors.' },
      { id: 'opt-c', text: 'It shuts down motors whenever any single sensor reports uncertainty', misconceptionCode: 'MISC_ALL_OR_NOTHING_HALT', misconceptionDescription: 'Robots must navigate in presence of sensor noise.' },
      { id: 'opt-d', text: 'It multiplies sensor values until the sum equals 100%', misconceptionCode: 'MISC_ARITHMETIC_FUSION_MYTH', misconceptionDescription: 'Sensor fusion relies on covariance and Bayesian probability, not simple scalar multiplication.' }
    ],
    irt: { a: 1.50, b: 1.4, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 17: Recursion & Base Cases in Robot Maze Exploration (CSTA 3A-AP-17)
  {
    id: 'ITEM-ROB-017',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-RECURSION',
    code: 'ROB-017',
    prompt: 'A recursive depth-first maze exploration function `solve(x, y)` calls itself on neighboring cells. If the programmer forgets to include a base condition checking whether `(x, y)` has already been visited, what catastrophic runtime error will occur?',
    explanation: 'Without checking visited states, the recursive function calls itself back-and-forth indefinitely between adjacent cells until the execution call stack exhausts available memory and crashes with a Stack Overflow error.',
    options: [
      { id: 'opt-a', text: 'Infinite recursion causing a Stack Overflow crash' },
      { id: 'opt-b', text: 'The rover moves twice as fast through walls' },
      { id: 'opt-c', text: 'The battery charge will physically drain instantly in 0 milliseconds' },
      { id: 'opt-d', text: 'The maze grid shrinks automatically to a 1x1 square' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: 'The rover moves twice as fast through walls', misconceptionCode: 'MISC_PHYSICS_VIOLATION_MYTH', misconceptionDescription: 'Software infinite loops do not confer physical superhuman rover speed.' },
      { id: 'opt-c', text: 'The battery charge will physically drain instantly in 0 milliseconds', misconceptionCode: 'MISC_BATTERY_DRAIN_EXTREME', misconceptionDescription: 'CPU freezes/crashes before chemical battery drain.' },
      { id: 'opt-d', text: 'The maze grid shrinks automatically to a 1x1 square', misconceptionCode: 'MISC_GRID_MUTATION_ERROR', misconceptionDescription: 'Grid memory is unchanged by stack frames.' }
    ],
    irt: { a: 1.35, b: 0.5, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 18: Line Follower Sensor Hysteresis Thresholds (WRO Challenge)
  {
    id: 'ITEM-ROB-018',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-HYSTERESIS',
    code: 'ROB-018',
    prompt: 'In noisy lighting environments, a single reflectance sensor threshold of 500 ADC causes rapid motor chattering between on and off. How does applying "hysteresis" (dual thresholds, e.g. turn ON at > 550, turn OFF at < 450) stabilize the control loop?',
    explanation: 'Hysteresis introduces a deadband zone: minor optical noise fluctuations between 450 and 550 cannot flip the motor state, preventing chattering and ensuring clean switching.',
    options: [
      { id: 'opt-a', text: 'It inverts motor polarity to spin wheels backward' },
      { id: 'opt-b', text: 'It creates a noise deadband preventing rapid oscillatory chattering around the threshold' },
      { id: 'opt-c', text: 'It doubles the voltage supplied to the phototransistor LED' },
      { id: 'opt-d', text: 'It disables the sensor whenever the room lights turn off' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'It inverts motor polarity to spin wheels backward', misconceptionCode: 'MISC_MOTOR_INVERSION_ERROR', misconceptionDescription: 'Hysteresis stabilizes state, does not reverse drive.' },
      { id: 'opt-c', text: 'It doubles the voltage supplied to the phototransistor LED', misconceptionCode: 'MISC_HARDWARE_VOLTAGE_BOOST', misconceptionDescription: 'Hysteresis is a software threshold technique.' },
      { id: 'opt-d', text: 'It disables the sensor whenever the room lights turn off', misconceptionCode: 'MISC_SHUTDOWN_MYTH', misconceptionDescription: 'Sensor continues reading continuous values.' }
    ],
    irt: { a: 1.40, b: 0.9, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 19: Inverse Kinematics in Robotic Manipulator Arms (Secondary Robotics)
  {
    id: 'ITEM-ROB-019',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-ROB-INVERSE-KINEMATICS',
    code: 'ROB-019',
    prompt: 'A 2-link robotic arm must place its end-effector gripper at a target coordinate (X, Y) in 2D space. The process of computing the required shoulder joint angle θ1 and elbow joint angle θ2 to reach that target is called:',
    explanation: 'Forward Kinematics calculates (X, Y) from given joint angles. Inverse Kinematics (IK) solves the opposite, more complex geometric problem: calculating joint angles (θ1, θ2) needed to achieve a target end-effector position (X, Y).',
    options: [
      { id: 'opt-a', text: 'Forward Kinematics' },
      { id: 'opt-b', text: 'Inverse Kinematics' },
      { id: 'opt-c', text: 'Static Balance' },
      { id: 'opt-d', text: 'Rotational Inertia' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Forward Kinematics', misconceptionCode: 'MISC_INVERTED_KINEMATICS_NAME', misconceptionDescription: 'Forward kinematics starts with angles and outputs position.' },
      { id: 'opt-c', text: 'Static Balance', misconceptionCode: 'MISC_EQUILIBRIUM_CONFUSION', misconceptionDescription: 'Static balance refers to center of mass stability, not joint positioning.' },
      { id: 'opt-d', text: 'Rotational Inertia', misconceptionCode: 'MISC_DYNAMICS_CONFUSION', misconceptionDescription: 'Rotational inertia concerns torque and mass distribution.' }
    ],
    irt: { a: 1.35, b: 0.6, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 20: Algorithmic Big-O Complexity of Sorting Sensor Data (CSTA 3B-AP-10)
  {
    id: 'ITEM-ROB-010',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-BIG-O-SORTING',
    code: 'ROB-020',
    prompt: 'A LiDAR sensor delivers 1,000 range measurements per scan. A nested bubble sort algorithm ($O(N^2)$) takes 100 milliseconds to sort these 1,000 values. If the sensor resolution increases to 10,000 range values (10x input size), approximately how long will the $O(N^2)$ bubble sort take to run?',
    explanation: 'In $O(N^2)$ quadratic complexity, multiplying input size N by 10 increases processing time by 10² = 100 times. Time = 100 ms × 100 = 10,000 ms = 10 seconds.',
    options: [
      { id: 'opt-a', text: '1,000 ms (1 second)' },
      { id: 'opt-b', text: '10,000 ms (10 seconds)' },
      { id: 'opt-c', text: '200 ms (0.2 seconds)' },
      { id: 'opt-d', text: '100,000 ms (100 seconds)' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '1,000 ms (1 second)', misconceptionCode: 'MISC_LINEAR_O_N_ASSUMPTION', misconceptionDescription: 'Assumed linear O(N) scaling instead of quadratic O(N²).' },
      { id: 'opt-c', text: '200 ms (0.2 seconds)', misconceptionCode: 'MISC_LOGARITHMIC_SCALING', misconceptionDescription: 'Grossly underestimated polynomial time.' },
      { id: 'opt-d', text: '100,000 ms (100 seconds)', misconceptionCode: 'MISC_CUBIC_SCALING', misconceptionDescription: 'Calculated 10³ = 1000x cubic increase.' }
    ],
    irt: { a: 1.45, b: 1.1, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 21: Dead Reckoning Drift Accumulation (Navigational Robotics)
  {
    id: 'ITEM-ROB-021',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-ROB-DEAD-RECKONING',
    code: 'ROB-021',
    prompt: 'A subterranean exploration rover navigates in a mine without GPS using dead reckoning (encoder distance + gyro heading). If the gyroscope has an uncorrected bias of +1.0° per minute, what will happen to the rover\'s calculated position after 30 minutes of travel?',
    explanation: 'Heading error accumulates linearly over time (30 minutes = +30° heading error). Because distance displacement vectors are multiplied by sin/cos of heading, positional errors compound non-linearly over time, severely diverging from the true physical position.',
    options: [
      { id: 'opt-a', text: 'The position error remains constant at 1 meter' },
      { id: 'opt-b', text: 'The calculated position will severely diverge as cumulative heading error rotates all subsequent translation vectors' },
      { id: 'opt-c', text: 'The position error self-corrects back to zero every 5 minutes' },
      { id: 'opt-d', text: 'The rover stops moving because the gyro shuts off' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The position error remains constant at 1 meter', misconceptionCode: 'MISC_CONSTANT_BIAS_ERROR', misconceptionDescription: 'Believed angular bias produces constant rather than compounding positional error.' },
      { id: 'opt-c', text: 'The position error self-corrects back to zero every 5 minutes', misconceptionCode: 'MISC_SELF_CORRECTING_MYTH', misconceptionDescription: 'Assumed uncalibrated open-loop gyros self-correct.' },
      { id: 'opt-d', text: 'The rover stops moving because the gyro shuts off', misconceptionCode: 'MISC_HARDWARE_HALT_CONFUSION', misconceptionDescription: 'The rover continues driving with corrupted coordinates.' }
    ],
    irt: { a: 1.35, b: 0.3, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 22: Binary Search in Sorted Calibration Tables (Computational Thinking)
  {
    id: 'ITEM-ROB-022',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-BINARY-SEARCH',
    code: 'ROB-022',
    prompt: 'A sensor calibration lookup table contains 1,024 pre-calibrated temperature values sorted in ascending order. When searching for a target resistance using binary search, what is the maximum number of comparisons required in the worst-case scenario?',
    explanation: 'Binary search halves the search space each step: log2(1024) = 10 comparisons.',
    options: [
      { id: 'opt-a', text: '10 comparisons' },
      { id: 'opt-b', text: '32 comparisons' },
      { id: 'opt-c', text: '512 comparisons' },
      { id: 'opt-d', text: '1,024 comparisons' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: '32 comparisons', misconceptionCode: 'MISC_SQUARE_ROOT_ESTIMATE', misconceptionDescription: 'Calculated √1024 = 32 instead of log2(1024).' },
      { id: 'opt-c', text: '512 comparisons', misconceptionCode: 'MISC_HALF_LENGTH_ERROR', misconceptionDescription: 'Calculated 1024 / 2 instead of logarithmic divisions.' },
      { id: 'opt-d', text: '1,024 comparisons', misconceptionCode: 'MISC_LINEAR_SEARCH_WORST_CASE', misconceptionDescription: 'Gave worst-case for unoptimized linear search.' }
    ],
    irt: { a: 1.40, b: 0.7, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 23: Stepper Motor Step Angles & Gear Reduction (Actuators)
  {
    id: 'ITEM-ROB-023',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-ROB-STEPPER-MOTORS',
    code: 'ROB-023',
    prompt: 'A precision robotic wrist utilizes a NEMA-17 stepper motor with a 1.8° step angle (200 steps per full revolution) connected to a 10:1 reduction gearbox. How many motor step pulses are required to rotate the wrist output shaft by exactly 90°?',
    explanation: 'A 90° output turn requires 90° × 10 = 900° of stepper motor shaft rotation. Each step pulse provides 1.8°: Steps = 900° / 1.8° = 500 step pulses.',
    options: [
      { id: 'opt-a', text: '50 steps' },
      { id: 'opt-b', text: '200 steps' },
      { id: 'opt-c', text: '500 steps' },
      { id: 'opt-d', text: '1,000 steps' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '50 steps', misconceptionCode: 'MISC_DIRECT_DRIVE_CALC', misconceptionDescription: 'Calculated steps without multiplying by the 10:1 reduction ratio (90 / 1.8 = 50).' },
      { id: 'opt-b', text: '200 steps', misconceptionCode: 'MISC_ONE_FULL_REVOLUTION', misconceptionDescription: 'Assumed one full motor revolution.' },
      { id: 'opt-d', text: '1,000 steps', misconceptionCode: 'MISC_DOUBLED_RATIO', misconceptionDescription: 'Doubled the gear ratio calculation.' }
    ],
    irt: { a: 1.35, b: 0.4, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 24: Optical Flow vs GPS in Autonomous Drone Hover (Sensors & Avionics)
  {
    id: 'ITEM-ROB-024',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-OPTICAL-FLOW',
    code: 'ROB-024',
    prompt: 'When a quadcopter drone flies indoors inside an enclosed sports arena, GPS signal reception drops to zero satellite locks. Which onboard sensor enables the drone to maintain stationary hovering position over the floor without drifting?',
    explanation: 'A downward-facing optical flow sensor (micro camera measuring ground texture pixel displacement) paired with a downward LiDAR/ultrasonic altitude ranger detects horizontal ground drift and stabilizes hover indoors without GPS.',
    options: [
      { id: 'opt-a', text: 'Downward-facing optical flow camera and rangefinder' },
      { id: 'opt-b', text: 'A barometric altimeter alone' },
      { id: 'opt-c', text: 'An ambient temperature sensor' },
      { id: 'opt-d', text: 'A digital magnetometer compass alone' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: 'A barometric altimeter alone', misconceptionCode: 'MISC_VERTICAL_ONLY_LIMITATION', misconceptionDescription: 'Barometer only measures vertical atmospheric pressure, not horizontal X/Y floor drift.' },
      { id: 'opt-c', text: 'An ambient temperature sensor', misconceptionCode: 'MISC_TEMPERATURE_IRRELEVANCE', misconceptionDescription: 'Temperature cannot detect physical vehicle position.' },
      { id: 'opt-d', text: 'A digital magnetometer compass alone', misconceptionCode: 'MISC_MAGNETOMETER_LIMITATION', misconceptionDescription: 'Magnetometer measures heading orientation, not horizontal linear drift.' }
    ],
    irt: { a: 1.30, b: -0.2, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 25: H-Bridge Motor Direction Control (Robotics Electronics)
  {
    id: 'ITEM-ROB-025',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-H-BRIDGE',
    code: 'ROB-025',
    prompt: 'An H-Bridge circuit uses four transistor switches (Q1, Q2, Q3, Q4) to drive a DC motor forward and reverse. If both high-side and low-side switches on the same vertical leg (e.g. Q1 and Q2) are accidentally turned ON simultaneously, what catastrophic electrical failure occurs?',
    explanation: 'Turning ON both switches on the same leg connects VCC directly to Ground without any motor resistance in between, creating a dead short-circuit called "shoot-through" that destroys the transistors with massive current surge.',
    options: [
      { id: 'opt-a', text: 'The motor spins at double its maximum speed' },
      { id: 'opt-b', text: 'A shoot-through direct short-circuit between power supply and ground, potentially destroying the transistors' },
      { id: 'opt-c', text: 'The motor regenerates electricity and recharges the battery safely' },
      { id: 'opt-d', text: 'The motor quietly halts with zero current draw' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The motor spins at double its maximum speed', misconceptionCode: 'MISC_OVERDRIVE_MYTH', misconceptionDescription: 'Current bypasses the motor entirely.' },
      { id: 'opt-c', text: 'The motor regenerates electricity and recharges the battery safely', misconceptionCode: 'MISC_CONFUSED_WITH_REGEN_BRAKING', misconceptionDescription: 'Regenerative braking routes induced back-EMF, not direct short-circuits.' },
      { id: 'opt-d', text: 'The motor quietly halts with zero current draw', misconceptionCode: 'MISC_ZERO_CURRENT_ERROR', misconceptionDescription: 'Current is astronomically high during a direct short-circuit.' }
    ],
    irt: { a: 1.45, b: 0.95, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 26: Asynchronous Event-Driven Callbacks (CSTA 2-AP-15)
  {
    id: 'ITEM-ROB-026',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-EVENT-DRIVEN',
    code: 'ROB-026',
    prompt: 'A micro:bit script registers an event handler: `button_a.on_pressed(on_button_pressed)`. While the main program is sleeping in a loop, a user presses Button A. What happens in an event-driven software architecture?',
    explanation: 'The physical button press triggers an asynchronous hardware interrupt. The runtime temporarily suspends the sleep cycle and dispatches the callback function `on_button_pressed()` immediately.',
    options: [
      { id: 'opt-a', text: 'The button press is discarded and ignored permanently' },
      { id: 'opt-b', text: 'A hardware interrupt triggers the runtime to dispatch and execute the `on_button_pressed` callback function' },
      { id: 'opt-c', text: 'The entire microcontroller powers off and reboots' },
      { id: 'opt-d', text: 'The button press waits until the user manually restarts the computer' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The button press is discarded and ignored permanently', misconceptionCode: 'MISC_POLLING_ONLY_ASSUMPTION', misconceptionDescription: 'Assumed program can only read inputs if actively polling at that exact millisecond.' },
      { id: 'opt-c', text: 'The entire microcontroller powers off and reboots', misconceptionCode: 'MISC_CRASH_ASSUMPTION', misconceptionDescription: 'Event handlers are designed for normal responsive execution.' },
      { id: 'opt-d', text: 'The button press waits until the user manually restarts the computer', misconceptionCode: 'MISC_STATIC_QUEUE_ERROR', misconceptionDescription: 'Events are handled dynamically in real-time.' }
    ],
    irt: { a: 1.25, b: -0.6, c: 0.25 },
    ageBand: [9, 15],
    status: 'calibrated'
  },
  // Item 27: Center of Gravity (CoG) & Static Tip-Over Angle in Rough Terrains
  {
    id: 'ITEM-ROB-027',
    competency: 'systems_thinking',
    skillId: 'SKILL-ROB-STATIC-STABILITY',
    code: 'ROB-027',
    prompt: 'A planetary exploration rover with a wheelbase width of 40 cm has its center of gravity (CoG) located 30 cm vertically above the ground. To increase the rover\'s resistance to tipping over sideways when climbing steep crater inclines, which mechanical design modification is most effective?',
    explanation: 'Stability against tip-over increases when the center of gravity is lowered closer to ground and the track width is widened, increasing the tipping angle threshold: tan(θ_tip) = (Width / 2) / Height_CoG.',
    options: [
      { id: 'opt-a', text: 'Raise the battery pack to the top mast of the rover' },
      { id: 'opt-b', text: 'Mount the heavy battery pack low between the axles and widen the wheelbase track width' },
      { id: 'opt-c', text: 'Use narrower wheels with smoother rubber treads' },
      { id: 'opt-d', text: 'Install a taller antenna mast made of lead' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Raise the battery pack to the top mast of the rover', misconceptionCode: 'MISC_RAISING_COG_ERROR', misconceptionDescription: 'Raising heavy mass raises the center of gravity, drastically accelerating tip-overs.' },
      { id: 'opt-c', text: 'Use narrower wheels with smoother rubber treads', misconceptionCode: 'MISC_TREAD_IRRELEVANCE', misconceptionDescription: 'Smooth narrow wheels reduce traction and do not alter geometric tip-over angle.' },
      { id: 'opt-d', text: 'Install a taller antenna mast made of lead', misconceptionCode: 'MISC_TOP_HEAVY_DESIGN', misconceptionDescription: 'Adding weight up high severely destabilizes the chassis.' }
    ],
    irt: { a: 1.30, b: -0.35, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 28: MicroPython Memory Constraints & Garbage Collection (Embedded Coding)
  {
    id: 'ITEM-ROB-028',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-EMBEDDED-MEMORY',
    code: 'ROB-028',
    prompt: 'On an ESP32 microcontroller with only 520 KB of RAM running MicroPython, a continuous telemetry logging loop allocates new strings inside an infinite while loop without clearing references. What error will eventually be thrown by the Python runtime?',
    explanation: 'Continuous allocation of dynamic objects without freeing or garbage collecting references exhausts the heap, causing a `MemoryError` (Out of Memory exception).',
    options: [
      { id: 'opt-a', text: '`MemoryError: memory allocation failed`' },
      { id: 'opt-b', text: '`ZeroDivisionError`' },
      { id: 'opt-c', text: '`SyntaxError: unexpected token`' },
      { id: 'opt-d', text: '`TypeError: unsupported operand`' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: '`ZeroDivisionError`', misconceptionCode: 'MISC_ARITHMETIC_ERROR_CONFUSION', misconceptionDescription: 'Division by zero is unrelated to RAM heap exhaustion.' },
      { id: 'opt-c', text: '`SyntaxError: unexpected token`', misconceptionCode: 'MISC_PARSE_TIME_CONFUSION', misconceptionDescription: 'Syntax errors occur at code compilation, not runtime memory exhaustion.' },
      { id: 'opt-d', text: '`TypeError: unsupported operand`', misconceptionCode: 'MISC_TYPE_CHECKING_CONFUSION', misconceptionDescription: 'Type error occurs during invalid operator execution.' }
    ],
    irt: { a: 1.35, b: 0.4, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 29: Inverse Square LiDAR Attenuation in Atmospheric Dust (Sensors)
  {
    id: 'ITEM-ROB-029',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-ROB-LIDAR-SCATTERING',
    code: 'ROB-029',
    prompt: 'A 905nm pulsed laser LiDAR sensor on an autonomous rover operates in clean air with an effective range of 50 meters. During a severe dust storm, airborne particulates scatter optical photons. How does Rayleigh and Mie scattering affect LiDAR measurement capability?',
    explanation: 'Dust particles scatter and absorb both the emitted laser pulse and returning photons, reducing return signal intensity below the receiver photodiode noise floor and creating false ghost obstacle returns.',
    options: [
      { id: 'opt-a', text: 'The LiDAR laser speed increases, allowing measurements up to 500 meters' },
      { id: 'opt-b', text: 'Atmospheric particulate scattering attenuates the laser beam and produces false obstacle echoes from dust clouds' },
      { id: 'opt-c', text: 'The dust converts infrared laser photons into visible green light with zero range loss' },
      { id: 'opt-d', text: 'The laser automatically converts into radio waves' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The LiDAR laser speed increases, allowing measurements up to 500 meters', misconceptionCode: 'MISC_SPEED_INCREASE_MYTH', misconceptionDescription: 'Speed of light does not increase in dust.' },
      { id: 'opt-c', text: 'The dust converts infrared laser photons into visible green light with zero range loss', misconceptionCode: 'MISC_WAVELENGTH_CONVERSION_MYTH', misconceptionDescription: 'Scattering causes signal attenuation, not green laser frequency doubling.' },
      { id: 'opt-d', text: 'The laser automatically converts into radio waves', misconceptionCode: 'MISC_SPECTRUM_CONVERSION_MYTH', misconceptionDescription: 'Photons do not transform into radio waves.' }
    ],
    irt: { a: 1.40, b: 0.8, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 30: Swarm Robotics Consensus & Distributed Leader Election (CSTA 3B-AP-22)
  {
    id: 'ITEM-ROB-030',
    competency: 'computational_thinking',
    skillId: 'SKILL-ROB-SWARM-CONSENSUS',
    code: 'ROB-030',
    prompt: 'In a distributed multi-agent swarm of 20 autonomous rovers exploring an underground cavern without internet or central servers, how do rovers coordinate a single "Leader" bot using the Raft consensus algorithm?',
    explanation: 'Raft consensus operates via randomized election timeouts and peer-to-peer voting messages over ad-hoc local mesh radio. If a follower detects no heartbeat from a leader within its randomized timeout, it transitions to candidate state and requests votes from peers until obtaining a quorum majority.',
    options: [
      { id: 'opt-a', text: 'The tallest rover is hardcoded as permanent leader at the factory' },
      { id: 'opt-b', text: 'Nodes use randomized election timeouts and peer mesh voting messages to achieve majority quorum consensus' },
      { id: 'opt-c', text: 'Every rover assumes it is leader and all 20 rovers broadcast conflicting orders simultaneously' },
      { id: 'opt-d', text: 'Rovers must wait for a human operator in another country to manually click a mouse button' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The tallest rover is hardcoded as permanent leader at the factory', misconceptionCode: 'MISC_PHYSICAL_HIERARCHY_MYTH', misconceptionDescription: 'Robots in decentralized swarms are typically homogeneous.' },
      { id: 'opt-c', text: 'Every rover assumes it is leader and all 20 rovers broadcast conflicting orders simultaneously', misconceptionCode: 'MISC_CHAOTIC_DISORDER_ASSUMPTION', misconceptionDescription: 'Consensus protocols avoid split-brain conflicts.' },
      { id: 'opt-d', text: 'Rovers must wait for a human operator in another country to manually click a mouse button', misconceptionCode: 'MISC_CENTRAL_HUMAN_DEPENDENCY', misconceptionDescription: 'Swarm consensus is fully autonomous without external human intervention.' }
    ],
    irt: { a: 1.50, b: 1.45, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  }
];
