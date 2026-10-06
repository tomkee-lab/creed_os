import type { AssessmentItem } from '@core-os/domain';

export const CALIBRATED_ITEM_BANK: AssessmentItem[] = [
  // --- QUANTITATIVE REASONING ---
  {
    id: 'ITEM-QR-001',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-QR-BALANCE',
    code: 'QR-001',
    prompt: 'A balance scale is in equilibrium. The left pan holds 3 identical metal spheres. The right pan holds 1 identical metal sphere and an 18-gram weight. What is the mass of one sphere?',
    explanation: 'Setting up the balance equation: 3x = x + 18. Subtracting x from both sides gives 2x = 18, so x = 9 grams.',
    options: [
      { id: 'opt-a', text: '6 grams' },
      { id: 'opt-b', text: '9 grams' },
      { id: 'opt-c', text: '12 grams' },
      { id: 'opt-d', text: '18 grams' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '6 grams', misconceptionCode: 'MISC_DIVIDED_BY_THREE', misconceptionDescription: 'Divided 18 by 3 spheres instead of balancing both pans.' },
      { id: 'opt-c', text: '12 grams', misconceptionCode: 'MISC_SUBTRACTED_ONE', misconceptionDescription: 'Subtracted 1 from 18 and subtracted 5 incorrectly.' },
      { id: 'opt-d', text: '18 grams', misconceptionCode: 'MISC_IGNORED_OPPOSING_SPHERE', misconceptionDescription: 'Assumed spheres balanced out directly without equation reduction.' }
    ],
    irt: { a: 1.25, b: -0.65, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  {
    id: 'ITEM-QR-002',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-QR-RATE',
    code: 'QR-002',
    prompt: 'A solar-powered drone consumes battery at a rate of 4% per minute in hover mode and 7% per minute in forward flight. If it hovers for 5 minutes and then flies forward for 8 minutes, how much battery capacity has been consumed?',
    explanation: 'Hover: 5 min × 4%/min = 20%. Forward flight: 8 min × 7%/min = 56%. Total consumption = 20% + 56% = 76%.',
    options: [
      { id: 'opt-a', text: '68%' },
      { id: 'opt-b', text: '72%' },
      { id: 'opt-c', text: '76%' },
      { id: 'opt-d', text: '83%' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '68%', misconceptionCode: 'MISC_ARITHMETIC_SUM', misconceptionDescription: 'Calculation error in combining linear terms.' },
      { id: 'opt-b', text: '72%', misconceptionCode: 'MISC_MULTIPLIED_RATES', misconceptionDescription: 'Multiplied total time by average rate without proportional weighting.' },
      { id: 'opt-d', text: '83%', misconceptionCode: 'MISC_ADD_CONSTANTS', misconceptionDescription: 'Added rates together before multiplying by total minutes.' }
    ],
    irt: { a: 1.35, b: 0.15, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  {
    id: 'ITEM-QR-003',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-QR-RATIO',
    code: 'QR-003',
    prompt: 'A gear train has three meshed gears: Gear A (12 teeth), Gear B (24 teeth), and Gear C (36 teeth). If Gear A completes 18 full rotations, how many rotations does Gear C complete?',
    explanation: 'The ratio between Gear A and Gear C is inversely proportional to their teeth count: Rotations(C) = Rotations(A) × (Teeth A / Teeth C) = 18 × (12 / 36) = 18 × (1/3) = 6 rotations.',
    options: [
      { id: 'opt-a', text: '6 rotations' },
      { id: 'opt-b', text: '9 rotations' },
      { id: 'opt-c', text: '12 rotations' },
      { id: 'opt-d', text: '54 rotations' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: '9 rotations', misconceptionCode: 'MISC_MIDDLE_GEAR_DIVIDE', misconceptionDescription: 'Used middle Gear B ratio (18 * 12/24) without accounting for final gear.' },
      { id: 'opt-c', text: '12 rotations', misconceptionCode: 'MISC_ARITHMETIC_SUBTRACTION', misconceptionDescription: 'Subtracted gear ratio constant.' },
      { id: 'opt-d', text: '54 rotations', misconceptionCode: 'MISC_DIRECT_PROPORTION_ERROR', misconceptionDescription: 'Treated teeth ratio as direct proportion instead of inverse.' }
    ],
    irt: { a: 1.55, b: 0.85, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },

  // --- SPATIAL REASONING ---
  {
    id: 'ITEM-SR-001',
    competency: 'spatial_reasoning',
    skillId: 'SKILL-SR-ROTATION',
    code: 'SR-001',
    prompt: 'Imagine an L-shaped polyomino lying flat on a table. If it is rotated 90° clockwise and then flipped horizontally (reflection across vertical axis), which side is the longer leg now pointing towards if it initially pointed North?',
    explanation: 'Initial leg points North. Rotating 90° clockwise makes it point East. Reflecting across the vertical axis flips East to West.',
    options: [
      { id: 'opt-a', text: 'North' },
      { id: 'opt-b', text: 'South' },
      { id: 'opt-c', text: 'East' },
      { id: 'opt-d', text: 'West' }
    ],
    correctOptionId: 'opt-d',
    distractors: [
      { id: 'opt-a', text: 'North', misconceptionCode: 'MISC_INVERSION_CANCEL', misconceptionDescription: 'Assumed reflection canceled rotation.' },
      { id: 'opt-b', text: 'South', misconceptionCode: 'MISC_180_DEGREE_CONFUSION', misconceptionDescription: 'Confused 90° rotation and horizontal flip with a 180° rotation.' },
      { id: 'opt-c', text: 'East', misconceptionCode: 'MISC_MISSED_REFLECTION', misconceptionDescription: 'Performed rotation but omitted the horizontal reflection.' }
    ],
    irt: { a: 1.40, b: 0.20, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  {
    id: 'ITEM-SR-002',
    competency: 'spatial_reasoning',
    skillId: 'SKILL-SR-ISOMETRIC',
    code: 'SR-002',
    prompt: 'A 3x3x3 solid wooden cube made of 27 identical unit cubes is painted blue on all 6 exterior faces. It is then disassembled into individual unit cubes. How many unit cubes have paint on EXACTLY two faces?',
    explanation: 'Cubes with paint on exactly 2 faces are located along the edges of the 3x3x3 cube, excluding the 8 corners. A cube has 12 edges. Along each edge of length 3, the middle cube has 2 painted faces. 12 edges × 1 = 12 unit cubes.',
    options: [
      { id: 'opt-a', text: '6 cubes' },
      { id: 'opt-b', text: '8 cubes' },
      { id: 'opt-c', text: '12 cubes' },
      { id: 'opt-d', text: '16 cubes' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '6 cubes', misconceptionCode: 'MISC_FACE_CENTERS', misconceptionDescription: 'Counted the 6 single-painted face centers.' },
      { id: 'opt-b', text: '8 cubes', misconceptionCode: 'MISC_CORNER_CUBES', misconceptionDescription: 'Counted the 8 corner cubes (which have 3 faces painted).' },
      { id: 'opt-d', text: '16 cubes', misconceptionCode: 'MISC_EDGE_OVERCOUNT', misconceptionDescription: 'Included corner intersections twice in the edge count.' }
    ],
    irt: { a: 1.65, b: 0.95, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  {
    id: 'ITEM-SR-003',
    competency: 'spatial_reasoning',
    skillId: 'SKILL-SR-CROSS_SECTION',
    code: 'SR-003',
    prompt: 'A regular solid cone is sliced by a flat planar cut that passes through its vertex and perpendicular to its circular base. What 2D geometric shape is revealed on the cross-section?',
    explanation: 'A planar cross-section passing directly through the apex (vertex) and perpendicular to the base produces an isosceles triangle.',
    options: [
      { id: 'opt-a', text: 'Circle' },
      { id: 'opt-b', text: 'Parabola' },
      { id: 'opt-c', text: 'Isosceles Triangle' },
      { id: 'opt-d', text: 'Ellipse' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: 'Circle', misconceptionCode: 'MISC_PARALLEL_CUT', misconceptionDescription: 'Confused perpendicular vertex cut with cut parallel to base.' },
      { id: 'opt-b', text: 'Parabola', misconceptionCode: 'MISC_CONIC_SECTION', misconceptionDescription: 'Recalled parabola as conic section without noting cut passes through vertex.' },
      { id: 'opt-d', text: 'Ellipse', misconceptionCode: 'MISC_ANGLED_CUT', misconceptionDescription: 'Confused with an angled cut through the lateral surface.' }
    ],
    irt: { a: 1.15, b: -0.40, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },

  // --- LOGICAL DEDUCTION ---
  {
    id: 'ITEM-LOG-001',
    competency: 'logical_deduction',
    skillId: 'SKILL-LOG-SYLLOGISM',
    code: 'LOG-001',
    prompt: 'Given the premises:\n1. All rovers equipped with LIDAR can navigate dense fog.\n2. Vehicle Z cannot navigate dense fog.\nWhich conclusion is validly deduced?',
    explanation: 'By Modus Tollens: If P (has LIDAR) then Q (can navigate fog). Not Q (cannot navigate fog). Therefore, Not P (Vehicle Z is not equipped with LIDAR).',
    options: [
      { id: 'opt-a', text: 'Vehicle Z is not a rover' },
      { id: 'opt-b', text: 'Vehicle Z is not equipped with LIDAR' },
      { id: 'opt-c', text: 'Vehicle Z has damaged navigation software' },
      { id: 'opt-d', text: 'Some rovers with LIDAR cannot navigate fog' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Vehicle Z is not a rover', misconceptionCode: 'MISC_UNWARRANTED_GENERALIZATION', misconceptionDescription: 'Assumed Vehicle Z could not be a rover at all.' },
      { id: 'opt-c', text: 'Vehicle Z has damaged navigation software', misconceptionCode: 'MISC_SPECULATIVE_ADDITION', misconceptionDescription: 'Introduced external real-world assumption not in premise.' },
      { id: 'opt-d', text: 'Some rovers with LIDAR cannot navigate fog', misconceptionCode: 'MISC_PREMISE_CONTRADICTION', misconceptionDescription: 'Directly contradicted premise 1.' }
    ],
    irt: { a: 1.30, b: -0.25, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  {
    id: 'ITEM-LOG-002',
    competency: 'logical_deduction',
    skillId: 'SKILL-LOG-CONDITIONAL',
    code: 'LOG-002',
    prompt: 'Four diagnostic sensor cards lie on a table. Each card has a subsystem letter on one side and an alert code (even or odd number) on the other. Rule: "If a card has an \'M\' (Motor) on one side, it MUST have an even alert code on the other."\nVisible faces: [M] [P] [4] [7].\nWhich cards MUST you flip to definitively test if the rule holds true?',
    explanation: 'Wason Selection Task: To verify "If P then Q", you must test P (to see if Q holds) and Not-Q (to ensure P does not appear). P = [M]. Not-Q (odd number) = [7]. Flipping [4] is unnecessary because non-M subsystems can have even numbers. Flip [M] and [7].',
    options: [
      { id: 'opt-a', text: '[M] only' },
      { id: 'opt-b', text: '[M] and [4]' },
      { id: 'opt-c', text: '[M] and [7]' },
      { id: 'opt-d', text: 'All four cards' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '[M] only', misconceptionCode: 'MISC_INCOMPLETE_VERIFICATION', misconceptionDescription: 'Checked forward condition but forgot counterexample check.' },
      { id: 'opt-b', text: '[M] and [4]', misconceptionCode: 'MISC_CONFIRMATION_BIAS', misconceptionDescription: 'Classic Wason confirmation bias: flipped the matching consequent [4] which cannot falsify the rule.' },
      { id: 'opt-d', text: 'All four cards', misconceptionCode: 'MISC_EXHAUSTIVE_FLIP', misconceptionDescription: 'Failed to recognize irrelevant cards [P].' }
    ],
    irt: { a: 1.70, b: 1.45, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },

  // --- SCIENTIFIC INQUIRY ---
  {
    id: 'ITEM-SCI-001',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-SCI-VARIABLES',
    code: 'SCI-001',
    prompt: 'A student wants to investigate how salinity affects the boiling temperature of water. She prepares 4 beakers with different salt concentrations. To ensure a scientifically valid experiment, which set of factors MUST remain constant across all 4 beakers?',
    explanation: 'In a controlled single-variable experiment, the independent variable (salt concentration) changes. The dependent variable (boiling point) is measured. All confounding variables (volume of water, heat source intensity, atmospheric pressure/beaker shape) must remain strictly controlled.',
    options: [
      { id: 'opt-a', text: 'Salt concentration and beaker volume' },
      { id: 'opt-b', text: 'Water volume, heating power, and ambient air pressure' },
      { id: 'opt-c', text: 'Boiling time and salt concentration' },
      { id: 'opt-d', text: 'Final boiling temperature and heat source' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Salt concentration and beaker volume', misconceptionCode: 'MISC_CONFUSED_INDEPENDENT_VARIABLE', misconceptionDescription: 'Included the independent variable (salt) in controlled list.' },
      { id: 'opt-c', text: 'Boiling time and salt concentration', misconceptionCode: 'MISC_OUTCOME_RESTRICTION', misconceptionDescription: 'Attempted to fix the outcome variable.' },
      { id: 'opt-d', text: 'Final boiling temperature and heat source', misconceptionCode: 'MISC_DEPENDENT_AS_CONTROL', misconceptionDescription: 'Treated the dependent variable (boiling temperature) as a constant.' }
    ],
    irt: { a: 1.20, b: -0.50, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  {
    id: 'ITEM-SCI-002',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-SCI-DATA_INFERENCE',
    code: 'SCI-002',
    prompt: 'A solar cell experiment measures output power at three temperatures: 25°C = 50mW, 40°C = 44mW, 55°C = 38mW. Which hypothesis is most strongly supported by this empirical data?',
    explanation: 'As temperature increases from 25°C to 55°C, power output decreases linearly (rate: -0.4 mW/°C). This supports the hypothesis that photovoltaic cell efficiency is inversely related to cell operating temperature.',
    options: [
      { id: 'opt-a', text: 'Solar cell efficiency increases as temperature rises' },
      { id: 'opt-b', text: 'Photovoltaic power output decreases as temperature increases' },
      { id: 'opt-c', text: 'Temperature has no effect on power below 60°C' },
      { id: 'opt-d', text: 'Power generation depends entirely on sunlight angle, not heat' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Solar cell efficiency increases as temperature rises', misconceptionCode: 'MISC_INVERTED_TREND', misconceptionDescription: 'Read the numerical trend in reverse.' },
      { id: 'opt-c', text: 'Temperature has no effect on power below 60°C', misconceptionCode: 'MISC_IGNORED_GRADIENT', misconceptionDescription: 'Ignored the observable steady 6mW drops.' },
      { id: 'opt-d', text: 'Power generation depends entirely on sunlight angle, not heat', misconceptionCode: 'MISC_UNTESTED_HYPOTHESIS', misconceptionDescription: 'Introduced an untested variable (sunlight angle).' }
    ],
    irt: { a: 1.35, b: 0.05, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },

  // --- COMPUTATIONAL THINKING ---
  {
    id: 'ITEM-CT-001',
    competency: 'computational_thinking',
    skillId: 'SKILL-CT-LOOP_TRACE',
    code: 'CT-001',
    prompt: 'Trace the algorithmic snippet:\n```\nval = 1\nfor i from 1 to 4:\n  val = (val * 2) + 1\n```\nWhat is the value of `val` after the loop terminates?',
    explanation: 'Iteration 1: val = (1 * 2) + 1 = 3.\nIteration 2: val = (3 * 2) + 1 = 7.\nIteration 3: val = (7 * 2) + 1 = 15.\nIteration 4: val = (15 * 2) + 1 = 31.',
    options: [
      { id: 'opt-a', text: '15' },
      { id: 'opt-b', text: '23' },
      { id: 'opt-c', text: '31' },
      { id: 'opt-d', text: '63' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '15', misconceptionCode: 'MISC_OFF_BY_ONE_STOP', misconceptionDescription: 'Halted after 3 iterations instead of 4 (off-by-one error).' },
      { id: 'opt-b', text: '23', misconceptionCode: 'MISC_ARITHMETIC_FAILURE', misconceptionDescription: 'Multiplied incorrectly at step 3.' },
      { id: 'opt-d', text: '63', misconceptionCode: 'MISC_OFF_BY_ONE_EXTRA', misconceptionDescription: 'Executed an extra 5th loop iteration.' }
    ],
    irt: { a: 1.45, b: 0.35, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  {
    id: 'ITEM-CT-002',
    competency: 'computational_thinking',
    skillId: 'SKILL-CT-DECOMPOSITION',
    code: 'CT-002',
    prompt: 'An autonomous rover is navigating an unknown maze. To guarantee it can systematically explore and find an exit in any 2D maze without closed loops, which classic computational rule should it follow?',
    explanation: 'The Wall Follower (Right-Hand Rule or Left-Hand Rule) guarantees reaching an exit in simply connected (loop-free) mazes by keeping one hand in continuous contact with the wall.',
    options: [
      { id: 'opt-a', text: 'Always choose the direction with the longest unobstructed view' },
      { id: 'opt-b', text: 'Maintain continuous contact with the right wall at every junction' },
      { id: 'opt-c', text: 'Alternate turning left and right at every intersection' },
      { id: 'opt-d', text: 'Move randomly whenever an obstacle is encountered' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Always choose the direction with the longest unobstructed view', misconceptionCode: 'MISC_GREEDY_HEURISTIC_FAILURE', misconceptionDescription: 'Greedy heuristic can become trapped in dead ends.' },
      { id: 'opt-c', text: 'Alternate turning left and right at every intersection', misconceptionCode: 'MISC_CYLICAL_OSCILLATION', misconceptionDescription: 'Can lead to infinite cyclical oscillations between adjacent corridors.' },
      { id: 'opt-d', text: 'Move randomly whenever an obstacle is encountered', misconceptionCode: 'MISC_NON_DETERMINISTIC_RANDOM', misconceptionDescription: 'Brownian random walk is non-deterministic and inefficient.' }
    ],
    irt: { a: 1.25, b: -0.10, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  }
];
