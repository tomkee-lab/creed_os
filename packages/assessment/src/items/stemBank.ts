import type { AssessmentItem } from '@core-os/domain';

export const STEM_BENCHMARK_ITEMS: AssessmentItem[] = [
  // Item 1: Linear Balance Equation (PISA Quantity / TIMSS Algebra)
  {
    id: 'ITEM-STEM-001',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-BALANCE',
    code: 'STEM-001',
    prompt: 'A laboratory balance scale is in equilibrium. The left pan holds 3 identical brass weights and a 4g tare weight. The right pan holds 1 identical brass weight and an 18g calibration mass. What is the mass of one brass weight?',
    explanation: 'Setting up the algebraic balance: 3x + 4 = x + 18. Subtracting x from both sides gives 2x + 4 = 18. Subtracting 4 gives 2x = 14, so x = 7 grams.',
    options: [
      { id: 'opt-a', text: '5.5 grams' },
      { id: 'opt-b', text: '7.0 grams' },
      { id: 'opt-c', text: '11.0 grams' },
      { id: 'opt-d', text: '14.0 grams' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '5.5 grams', misconceptionCode: 'MISC_DIVIDE_SUM', misconceptionDescription: 'Added 4 and 18 and divided by 4 weights.' },
      { id: 'opt-c', text: '11.0 grams', misconceptionCode: 'MISC_FORGOT_SUBTRACT_COEFF', misconceptionDescription: 'Subtracted 4 from 18 but did not divide by the 2x difference.' },
      { id: 'opt-d', text: '14.0 grams', misconceptionCode: 'MISC_LEFT_RIGHT_ISOLATION', misconceptionDescription: 'Subtracted 4 from 18 without isolating the unknown mass.' }
    ],
    irt: { a: 1.25, b: -1.2, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 2: Drone Battery Consumption Rate (TIMSS Applied Arithmetic)
  {
    id: 'ITEM-STEM-002',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-RATES',
    code: 'STEM-002',
    prompt: 'A solar-assisted survey drone consumes battery charge at 3% per minute while climbing vertically and 1.5% per minute while cruising horizontally. If it climbs for 6 minutes and cruises for 14 minutes starting from 100%, what battery percentage remains?',
    explanation: 'Climb consumption = 6 min × 3% = 18%. Cruise consumption = 14 min × 1.5% = 21%. Total consumed = 18% + 21% = 39%. Remaining battery = 100% - 39% = 61%.',
    options: [
      { id: 'opt-a', text: '39%' },
      { id: 'opt-b', text: '58%' },
      { id: 'opt-c', text: '61%' },
      { id: 'opt-d', text: '73%' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '39%', misconceptionCode: 'MISC_REPORTED_CONSUMED', misconceptionDescription: 'Reported total battery consumed rather than remaining capacity.' },
      { id: 'opt-b', text: '58%', misconceptionCode: 'MISC_ROUNDING_OFF_BY_THREE', misconceptionDescription: 'Multiplied total 20 minutes by 2.1% average.' },
      { id: 'opt-d', text: '73%', misconceptionCode: 'MISC_OVERLOOKED_CLIMB_RATE', misconceptionDescription: 'Treated entire flight at the 1.5% cruise consumption rate.' }
    ],
    irt: { a: 1.35, b: -0.7, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 3: Meshed Gear Train Ratio (TIMSS Physics & Kinematics)
  {
    id: 'ITEM-STEM-003',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-GEAR-RATIO',
    code: 'STEM-003',
    prompt: 'A robotic arm actuator has three meshed gears: Drive Gear A (12 teeth), Idler Gear B (24 teeth), and Driven Gear C (36 teeth). If Drive Gear A rotates at 300 RPM clockwise, what is the speed and direction of Gear C?',
    explanation: 'Gear ratio is determined by teeth: Speed C = Speed A × (Teeth A / Teeth C) = 300 × (12 / 36) = 100 RPM. An odd number of external mesh stages (A to B flips direction to CCW, B to C flips direction back to CW) means Gear C rotates in the same clockwise direction as Gear A.',
    options: [
      { id: 'opt-a', text: '100 RPM clockwise' },
      { id: 'opt-b', text: '100 RPM counter-clockwise' },
      { id: 'opt-c', text: '150 RPM clockwise' },
      { id: 'opt-d', text: '900 RPM counter-clockwise' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: '100 RPM counter-clockwise', misconceptionCode: 'MISC_IDLER_DIRECTION_ERROR', misconceptionDescription: 'Ignored the direction reversal introduced by the idler gear.' },
      { id: 'opt-c', text: '150 RPM clockwise', misconceptionCode: 'MISC_GEAR_B_RATIO_ERROR', misconceptionDescription: 'Factored in idler teeth into net gear ratio.' },
      { id: 'opt-d', text: '900 RPM counter-clockwise', misconceptionCode: 'MISC_DIRECT_PROPORTION_ERROR', misconceptionDescription: 'Multiplied teeth ratio rather than dividing.' }
    ],
    irt: { a: 1.45, b: 0.35, c: 0.25 },
    ageBand: [11, 18],
    status: 'calibrated'
  },
  // Item 4: Archimedes Buoyancy & Density (PISA Scientific Literacy)
  {
    id: 'ITEM-STEM-004',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-DENSITY',
    code: 'STEM-004',
    prompt: 'A solid cubic block of unknown alloy measures 5cm × 5cm × 5cm and has a mass of 875g. When fully submerged in fresh water (density = 1.0 g/cm³), what is the buoyant force acting on it? (Use g = 9.8 m/s²)',
    explanation: 'Volume of cube = 5 × 5 × 5 = 125 cm³. By Archimedes\' Principle, buoyant force equals the weight of displaced fluid: Mass of displaced water = 125 cm³ × 1.0 g/cm³ = 125g = 0.125 kg. Force = 0.125 kg × 9.8 m/s² = 1.225 N ≈ 1.23 N.',
    options: [
      { id: 'opt-a', text: '1.23 N' },
      { id: 'opt-b', text: '7.00 N' },
      { id: 'opt-c', text: '8.58 N' },
      { id: 'opt-d', text: '12.25 N' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: '7.00 N', misconceptionCode: 'MISC_DENSITY_VALUE', misconceptionDescription: 'Confused alloy density (7.0 g/cm³) with buoyant force.' },
      { id: 'opt-c', text: '8.58 N', misconceptionCode: 'MISC_OBJECT_WEIGHT', misconceptionDescription: 'Calculated the gravitational weight of the block (0.875 kg × 9.8) instead of buoyant force.' },
      { id: 'opt-d', text: '12.25 N', misconceptionCode: 'MISC_DECIMAL_PLACE_ERROR', misconceptionDescription: 'Metric unit conversion error between grams and kilograms.' }
    ],
    irt: { a: 1.30, b: 0.8, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 5: Kinematic Acceleration & Displacement (PISA Science / TIMSS Physics)
  {
    id: 'ITEM-STEM-005',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-KINEMATICS',
    code: 'STEM-005',
    prompt: 'An electric rover starts from rest and accelerates uniformly across a testing track at 2.5 m/s² for 6.0 seconds, then continues at constant velocity for another 4.0 seconds. What is the total distance traveled?',
    explanation: 'Phase 1 (Acceleration): d1 = 1/2 × a × t² = 0.5 × 2.5 × 36 = 45 m. Final velocity v = a × t = 2.5 × 6 = 15 m/s. Phase 2 (Constant Velocity): d2 = v × t2 = 15 × 4 = 60 m. Total distance = 45m + 60m = 105 meters.',
    options: [
      { id: 'opt-a', text: '75 meters' },
      { id: 'opt-b', text: '90 meters' },
      { id: 'opt-c', text: '105 meters' },
      { id: 'opt-d', text: '150 meters' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '75 meters', misconceptionCode: 'MISC_AVERAGE_VELOCITY', misconceptionDescription: 'Assumed average acceleration over the entire 10 seconds.' },
      { id: 'opt-b', text: '90 meters', misconceptionCode: 'MISC_FORGOT_HALF_FACTOR', misconceptionDescription: 'Omitted 1/2 in the displacement kinematic formula.' },
      { id: 'opt-d', text: '150 meters', misconceptionCode: 'MISC_ASSUMED_CONSTANT_SPEED', misconceptionDescription: 'Multiplied peak speed by total elapsed duration.' }
    ],
    irt: { a: 1.50, b: 0.95, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 6: Photosynthesis & Limiting Reagents (PISA Biology)
  {
    id: 'ITEM-STEM-006',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-BIO-LIMITING',
    code: 'STEM-006',
    prompt: 'In a greenhouse experiment measuring photosynthetic rate, increasing light intensity from 200 to 800 lux increases oxygen output from 12 to 48 mL/hr. However, increasing light from 800 to 1400 lux produces no further increase in oxygen. What is the most plausible scientific conclusion?',
    explanation: 'Beyond 800 lux, light intensity is no longer the limiting factor; carbon dioxide concentration, temperature, or enzyme saturation (rubisco) is now limiting the rate.',
    options: [
      { id: 'opt-a', text: 'Light intensity has damaged the chloroplast thylakoids' },
      { id: 'opt-b', text: 'Light intensity is no longer the rate-limiting factor; another parameter (e.g. CO2 or temperature) is limiting' },
      { id: 'opt-c', text: 'The plants have permanently exhausted their ATP synthesis capacity' },
      { id: 'opt-d', text: 'Photosynthesis has stopped because cellular respiration is now dominant' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Light intensity has damaged the chloroplast thylakoids', misconceptionCode: 'MISC_PHOTODAMAGE_ASSUMPTION', misconceptionDescription: 'Assumed light saturation causes immediate physical damage rather than plateauing.' },
      { id: 'opt-c', text: 'The plants have permanently exhausted their ATP synthesis capacity', misconceptionCode: 'MISC_ATP_EXHAUSTION', misconceptionDescription: 'Confused rate plateau with biological exhaustion.' },
      { id: 'opt-d', text: 'Photosynthesis has stopped because cellular respiration is now dominant', misconceptionCode: 'MISC_RESPIRATION_DOMINANCE', misconceptionDescription: 'Believed oxygen plateau indicates total cessation of photosynthetic activity.' }
    ],
    irt: { a: 1.20, b: -0.2, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 7: Ohm\'s Law & Series-Parallel Resistors (TIMSS Physics)
  {
    id: 'ITEM-STEM-007',
    competency: 'systems_thinking',
    skillId: 'SKILL-STEM-CIRCUITS',
    code: 'STEM-007',
    prompt: 'A 12V DC power supply is connected to a circuit with two resistors in parallel (R1 = 60Ω, R2 = 40Ω) in series with a single resistor R3 = 16Ω. What total current is drawn from the power supply?',
    explanation: 'Parallel resistance: Rp = (60 × 40) / (60 + 40) = 2400 / 100 = 24Ω. Total resistance: Rtotal = Rp + R3 = 24Ω + 16Ω = 40Ω. Current I = V / Rtotal = 12V / 40Ω = 0.30 Amperes.',
    options: [
      { id: 'opt-a', text: '0.10 A' },
      { id: 'opt-b', text: '0.30 A' },
      { id: 'opt-c', text: '0.50 A' },
      { id: 'opt-d', text: '1.20 A' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '0.10 A', misconceptionCode: 'MISC_ALL_SERIES_ASSUMED', misconceptionDescription: 'Added all resistors in series (60 + 40 + 16 = 116Ω).' },
      { id: 'opt-c', text: '0.50 A', misconceptionCode: 'MISC_FORGOT_SERIES_R3', misconceptionDescription: 'Calculated parallel current only without series resistor R3 (12V / 24Ω = 0.5A).' },
      { id: 'opt-d', text: '1.20 A', misconceptionCode: 'MISC_INVERTED_OHMS_LAW', misconceptionDescription: 'Multiplied resistance and voltage rather than dividing.' }
    ],
    irt: { a: 1.40, b: 0.75, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 8: Spatial Orthographic Projections (Spatial Reasoning)
  {
    id: 'ITEM-STEM-008',
    competency: 'spatial_reasoning',
    skillId: 'SKILL-STEM-ORTHOGRAPHIC',
    code: 'STEM-008',
    prompt: 'A 3D mechanical component has a front view showing a square, a side view showing a square, and a top view showing a circle. What is the true 3D solid geometry of this component?',
    explanation: 'A cylinder with height equal to its diameter appears as a circle from the top view and as a square from both the front and side views.',
    options: [
      { id: 'opt-a', text: 'A sphere' },
      { id: 'opt-b', text: 'A cube' },
      { id: 'opt-c', text: 'A cylinder with height equal to diameter' },
      { id: 'opt-d', text: 'A cone with height equal to diameter' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: 'A sphere', misconceptionCode: 'MISC_SPHERE_PROJECTION', misconceptionDescription: 'A sphere produces circular projections from all orthographic viewpoints.' },
      { id: 'opt-b', text: 'A cube', misconceptionCode: 'MISC_CUBE_PROJECTION', misconceptionDescription: 'A cube produces squares from top, front, and side views.' },
      { id: 'opt-d', text: 'A cone with height equal to diameter', misconceptionCode: 'MISC_CONE_PROJECTION', misconceptionDescription: 'A cone produces a triangle from front and side views, not a square.' }
    ],
    irt: { a: 1.30, b: -0.4, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 9: Chemical Stoichiometry & Conservation of Mass (PISA Chemistry)
  {
    id: 'ITEM-STEM-009',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-STOICHIOMETRY',
    code: 'STEM-009',
    prompt: 'When 24.0 grams of methane gas (CH4, molar mass 16 g/mol) combusts completely with excess oxygen (CH4 + 2O2 → CO2 + 2H2O), what mass of water vapor (H2O, molar mass 18 g/mol) is formed?',
    explanation: 'Moles of CH4 = 24g / 16 g/mol = 1.5 moles. The molar ratio of CH4 to H2O is 1 : 2, so moles of H2O = 1.5 × 2 = 3.0 moles. Mass of H2O = 3.0 moles × 18 g/mol = 54.0 grams.',
    options: [
      { id: 'opt-a', text: '27.0 grams' },
      { id: 'opt-b', text: '36.0 grams' },
      { id: 'opt-c', text: '54.0 grams' },
      { id: 'opt-d', text: '72.0 grams' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '27.0 grams', misconceptionCode: 'MISC_ONE_TO_ONE_MOLAR', misconceptionDescription: 'Omitted stoichiometric coefficient 2 for water (1.5 mol × 18g = 27g).' },
      { id: 'opt-b', text: '36.0 grams', misconceptionCode: 'MISC_MOLAR_MASS_ONLY', misconceptionDescription: 'Calculated 2 moles of water without scaling to starting 1.5 moles of methane.' },
      { id: 'opt-d', text: '72.0 grams', misconceptionCode: 'MISC_DOUBLE_FACTOR_ERROR', misconceptionDescription: 'Doubled the molar ratio twice in calculation.' }
    ],
    irt: { a: 1.45, b: 1.1, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 10: Experimental Controls & Scientific Variables (PISA Scientific Inquiry)
  {
    id: 'ITEM-STEM-010',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-VARIABLES',
    code: 'STEM-010',
    prompt: 'A student investigates whether temperature affects enzyme reaction rate. She tests 5 beakers at temperatures from 10°C to 50°C. In each beaker, she adds 5mL enzyme, 10mL starch, and measures glucose produced after 10 minutes. Why must the enzyme volume and reaction time remain identical across all beakers?',
    explanation: 'To isolate temperature as the independent variable, all other parameters that could influence reaction velocity must be held constant as controlled variables to ensure internal validity.',
    options: [
      { id: 'opt-a', text: 'To ensure the temperature remains stable in the room' },
      { id: 'opt-b', text: 'To isolate temperature as the sole independent variable causing differences in glucose yield' },
      { id: 'opt-c', text: 'To ensure the enzyme does not denature before measurements begin' },
      { id: 'opt-d', text: 'Because starch cannot dissolve if volume ratios change' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'To ensure the temperature remains stable in the room', misconceptionCode: 'MISC_CONFUSED_AMBIENT_TEMP', misconceptionDescription: 'Confused controlled experimental variables with ambient conditions.' },
      { id: 'opt-c', text: 'To ensure the enzyme does not denature before measurements begin', misconceptionCode: 'MISC_DENATURATION_CAUSE', misconceptionDescription: 'Denaturation depends on temperature, not equalizing volumes across beakers.' },
      { id: 'opt-d', text: 'Because starch cannot dissolve if volume ratios change', misconceptionCode: 'MISC_SOLUBILITY_CONFUSION', misconceptionDescription: 'Incorrect chemical rationale.' }
    ],
    irt: { a: 1.15, b: -1.0, c: 0.25 },
    ageBand: [10, 15],
    status: 'calibrated'
  },
  // Item 11: Levers & Mechanical Advantage (TIMSS Physics)
  {
    id: 'ITEM-STEM-011',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-LEVERS',
    code: 'STEM-011',
    prompt: 'A class-1 lever has a total length of 3.0 meters. The fulcrum is positioned 0.6 meters from a heavy load weighing 600 N. How much effort force applied at the opposite end is required to balance the load in static equilibrium?',
    explanation: 'Effort arm length = 3.0m - 0.6m = 2.4m. By torque balance: Effort × Effort Arm = Load × Load Arm. Effort × 2.4m = 600N × 0.6m. Effort × 2.4 = 360, so Effort = 360 / 2.4 = 150 N.',
    options: [
      { id: 'opt-a', text: '120 N' },
      { id: 'opt-b', text: '150 N' },
      { id: 'opt-c', text: '200 N' },
      { id: 'opt-d', text: '300 N' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '120 N', misconceptionCode: 'MISC_TOTAL_LENGTH_DIVISOR', misconceptionDescription: 'Divided 360 by total length 3.0m instead of the effort arm 2.4m.' },
      { id: 'opt-c', text: '200 N', misconceptionCode: 'MISC_RATIO_ONE_THIRD', misconceptionDescription: 'Estimated 1/3 load without precise torque equation.' },
      { id: 'opt-d', text: '300 N', misconceptionCode: 'MISC_HALVED_LOAD', misconceptionDescription: 'Assumed fulcrum was midway along the beam.' }
    ],
    irt: { a: 1.35, b: 0.2, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 12: Thermal Heat Transfer & Specific Heat (PISA Science)
  {
    id: 'ITEM-STEM-012',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-THERMODYNAMICS',
    code: 'STEM-012',
    prompt: 'Two identical 200g blocks—Block A made of copper (specific heat = 0.385 J/g°C) and Block B made of aluminum (specific heat = 0.897 J/g°C)—are heated to 100°C and placed in separate containers holding 500g of water at 20°C. Which container reaches a higher final equilibrium temperature, and why?',
    explanation: 'Aluminum has a significantly higher specific heat capacity (0.897 vs 0.385 J/g°C). For the same mass and temperature drop, aluminum releases more thermal energy (Q = m × c × ΔT) into the water, raising the water to a higher final temperature.',
    options: [
      { id: 'opt-a', text: 'Block A (Copper), because copper has higher thermal conductivity' },
      { id: 'opt-b', text: 'Block B (Aluminum), because its higher specific heat means it stores and releases more thermal energy' },
      { id: 'opt-c', text: 'Both reach identical temperatures because both blocks have the same mass and starting temperature' },
      { id: 'opt-d', text: 'Block A (Copper), because its lower specific heat allows heat to escape into water faster' },
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Block A (Copper), because copper has higher thermal conductivity', misconceptionCode: 'MISC_CONDUCTIVITY_VS_CAPACITY', misconceptionDescription: 'Confused rate of heat transfer (conductivity) with total thermal energy stored (heat capacity).' },
      { id: 'opt-c', text: 'Both reach identical temperatures because both blocks have the same mass and starting temperature', misconceptionCode: 'MISC_IGNORED_SPECIFIC_HEAT', misconceptionDescription: 'Believed thermal energy depends solely on mass and temperature regardless of material identity.' },
      { id: 'opt-d', text: 'Block A (Copper), because its lower specific heat allows heat to escape into water faster', misconceptionCode: 'MISC_RATE_VS_EQUILIBRIUM', misconceptionDescription: 'Confused transient cooling speed with equilibrium temperature.' }
    ],
    irt: { a: 1.40, b: 0.6, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 13: Optics & Snell\'s Law (TIMSS Physics)
  {
    id: 'ITEM-STEM-013',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-REFRACTION',
    code: 'STEM-013',
    prompt: 'A light ray in air enters a flat acrylic glass block (index of refraction n = 1.50) at an angle of incidence of 30° to the normal. As the ray enters the glass, what happens to its wave speed and path direction?',
    explanation: 'When transitioning into an optically denser medium (higher refractive index), light slows down (v = c / n). By Snell\'s Law, the light ray bends toward the normal line (angle of refraction < 30°).',
    options: [
      { id: 'opt-a', text: 'Speed decreases and the ray bends toward the normal' },
      { id: 'opt-b', text: 'Speed decreases and the ray bends away from the normal' },
      { id: 'opt-c', text: 'Speed remains constant and the ray bends toward the normal' },
      { id: 'opt-d', text: 'Speed increases and the ray continues in a straight path' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: 'Speed decreases and the ray bends away from the normal', misconceptionCode: 'MISC_AWAY_FROM_NORMAL', misconceptionDescription: 'Incorrectly applied the rule for entering a less dense medium.' },
      { id: 'opt-c', text: 'Speed remains constant and the ray bends toward the normal', misconceptionCode: 'MISC_CONSTANT_LIGHT_SPEED', misconceptionDescription: 'Believed speed of light is invariable across different physical media.' },
      { id: 'opt-d', text: 'Speed increases and the ray continues in a straight path', misconceptionCode: 'MISC_DENSITY_ACCELERATION', misconceptionDescription: 'Assumed light travels faster in dense solid glass.' }
    ],
    irt: { a: 1.25, b: 0.1, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 14: Ecological Food Web Energy Pyramids (PISA Biology)
  {
    id: 'ITEM-STEM-014',
    competency: 'systems_thinking',
    skillId: 'SKILL-STEM-TROPHIC-ENERGY',
    code: 'STEM-014',
    prompt: 'In a grassland ecosystem, primary producers capture 40,000 kJ of solar energy per square meter per year. Following the 10% trophic efficiency rule (Lindeman\'s efficiency), approximately how much energy is transferred to secondary consumers (carnivores that feed on herbivores)?',
    explanation: 'Primary producers: 40,000 kJ. Primary consumers (herbivores): 10% of 40,000 = 4,000 kJ. Secondary consumers: 10% of 4,000 = 400 kJ.',
    options: [
      { id: 'opt-a', text: '40 kJ' },
      { id: 'opt-b', text: '400 kJ' },
      { id: 'opt-c', text: '4,000 kJ' },
      { id: 'opt-d', text: '36,000 kJ' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '40 kJ', misconceptionCode: 'MISC_TERTIARY_CONSUMER', misconceptionDescription: 'Calculated energy reaching tertiary consumers instead of secondary.' },
      { id: 'opt-c', text: '4,000 kJ', misconceptionCode: 'MISC_PRIMARY_CONSUMER', misconceptionDescription: 'Calculated energy of herbivores (primary consumers).' },
      { id: 'opt-d', text: '36,000 kJ', misconceptionCode: 'MISC_COMPLEMENT_PERCENT', misconceptionDescription: 'Subtracted 10% once instead of calculating compounded 10% transfers.' }
    ],
    irt: { a: 1.30, b: -0.6, c: 0.25 },
    ageBand: [10, 15],
    status: 'calibrated'
  },
  // Item 15: Pressure, Force, and Area (Hydraulics) (TIMSS Applied Science)
  {
    id: 'ITEM-STEM-015',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-HYDRAULICS',
    code: 'STEM-015',
    prompt: 'A hydraulic vehicle lift utilizes Pascal\'s principle. An input piston with an area of 20 cm² is connected via fluid to an output lift piston with an area of 500 cm². If a technician applies a force of 150 N onto the input piston, what lifting force is generated at the output piston?',
    explanation: 'Pressure P = F1 / A1 = 150 N / 20 cm² = 7.5 N/cm². The same pressure acts uniformly on the output piston: F2 = P × A2 = 7.5 N/cm² × 500 cm² = 3,750 N.',
    options: [
      { id: 'opt-a', text: '375 N' },
      { id: 'opt-b', text: '1,500 N' },
      { id: 'opt-c', text: '3,750 N' },
      { id: 'opt-d', text: '7,500 N' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '375 N', misconceptionCode: 'MISC_DECIMAL_SCALE_ERROR', misconceptionDescription: 'Calculation magnitude error by a factor of 10.' },
      { id: 'opt-b', text: '1,500 N', misconceptionCode: 'MISC_INVERTED_RATIO_PRODUCT', misconceptionDescription: 'Multiplied input force by 10 instead of area ratio 25.' },
      { id: 'opt-d', text: '7,500 N', misconceptionCode: 'MISC_IGNORED_INPUT_AREA', misconceptionDescription: 'Multiplied force directly by 50 without dividing by input area.' }
    ],
    irt: { a: 1.45, b: 0.45, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 16: Genetic Inheritance & Punnett Squares (PISA Genetics)
  {
    id: 'ITEM-STEM-016',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-GENETICS',
    code: 'STEM-016',
    prompt: 'In pea plants, tall stem (T) is dominant to short stem (t), and purple flower (P) is dominant to white flower (p). Two plants with genotype TtPp are crossed. What fraction of their offspring is expected to exhibit the tall stem with white flowers phenotype?',
    explanation: 'In an independent dihybrid cross (TtPp × TtPp), the probability of tall (T_) is 3/4, and the probability of white flowers (pp) is 1/4. Probability of tall and white = (3/4) × (1/4) = 3/16.',
    options: [
      { id: 'opt-a', text: '1 / 16' },
      { id: 'opt-b', text: '3 / 16' },
      { id: 'opt-c', text: '9 / 16' },
      { id: 'opt-d', text: '1 / 4' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '1 / 16', misconceptionCode: 'MISC_DOUBLE_RECESSIVE', misconceptionDescription: 'Calculated probability of double recessive (short and white, ttpp).' },
      { id: 'opt-c', text: '9 / 16', misconceptionCode: 'MISC_DOUBLE_DOMINANT', misconceptionDescription: 'Calculated probability of double dominant (tall and purple, T_P_).' },
      { id: 'opt-d', text: '1 / 4', misconceptionCode: 'MISC_MONOHYBRID_CONFUSION', misconceptionDescription: 'Applied monohybrid single-gene recessive probability.' }
    ],
    irt: { a: 1.35, b: 0.85, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 17: Gravitational Potential to Kinetic Energy (TIMSS Energy)
  {
    id: 'ITEM-STEM-017',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-CONSERVATION-ENERGY',
    code: 'STEM-017',
    prompt: 'A 4.0 kg roller coaster cart starts from rest at the top of a frictionless track at a height of 20 meters. Assuming zero air resistance and g = 9.8 m/s², what is the cart\'s velocity when it reaches ground level (height = 0m)?',
    explanation: 'By conservation of mechanical energy: mgh = 1/2 m v². The mass cancels out: v² = 2gh = 2 × 9.8 × 20 = 392. v = √392 ≈ 19.8 m/s.',
    options: [
      { id: 'opt-a', text: '14.0 m/s' },
      { id: 'opt-b', text: '19.8 m/s' },
      { id: 'opt-c', text: '28.0 m/s' },
      { id: 'opt-d', text: '39.2 m/s' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '14.0 m/s', misconceptionCode: 'MISC_FORGOT_TWO_FACTOR', misconceptionDescription: 'Omitted factor 2: calculated √(gh) = √196 = 14 m/s.' },
      { id: 'opt-c', text: '28.0 m/s', misconceptionCode: 'MISC_DOUBLED_ROOT', misconceptionDescription: 'Arithmetic estimation error.' },
      { id: 'opt-d', text: '39.2 m/s', misconceptionCode: 'MISC_DIVIDED_BY_TEN', misconceptionDescription: 'Did not take the square root of v².' }
    ],
    irt: { a: 1.45, b: 0.9, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 18: Waves, Frequency, and Wavelength (PISA Physics)
  {
    id: 'ITEM-STEM-018',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-WAVE-EQUATION',
    code: 'STEM-018',
    prompt: 'An oceanographic sensor buoy detects surface water waves with a crest-to-crest wavelength of 15 meters passing every 3.0 seconds. What is the propagation speed of these water waves across the continental shelf?',
    explanation: 'Frequency f = 1 / period = 1 / 3.0 s = 0.333 Hz. Wave speed v = wavelength × frequency = 15 m × (1/3) s⁻¹ = 15 / 3 = 5.0 m/s.',
    options: [
      { id: 'opt-a', text: '0.2 m/s' },
      { id: 'opt-b', text: '5.0 m/s' },
      { id: 'opt-c', text: '18.0 m/s' },
      { id: 'opt-d', text: '45.0 m/s' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '0.2 m/s', misconceptionCode: 'MISC_INVERTED_SPEED_RATIO', misconceptionDescription: 'Divided period by wavelength (3 / 15 = 0.2).' },
      { id: 'opt-c', text: '18.0 m/s', misconceptionCode: 'MISC_ADDED_PARAMETERS', misconceptionDescription: 'Added wavelength and period together.' },
      { id: 'opt-d', text: '45.0 m/s', misconceptionCode: 'MISC_MULTIPLIED_PERIOD', misconceptionDescription: 'Multiplied wavelength by period instead of dividing.' }
    ],
    irt: { a: 1.20, b: -0.8, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 19: Atmospheric Pressure & Altitude (PISA Earth Sciences)
  {
    id: 'ITEM-STEM-019',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-ATMOSPHERE',
    code: 'STEM-019',
    prompt: 'A mountaineering drone climbs from sea level (altitude 0m, atmospheric pressure 101.3 kPa) to an alpine research station at 3,000m. A sealed rigid barometer bottle filled with air at sea level expands slightly. Why does atmospheric pressure decrease with increasing altitude?',
    explanation: 'Atmospheric pressure is caused by the weight of air molecules in the column above the measurement point. At higher altitudes, there are fewer air molecules overhead and air density decreases under lower gravity compression.',
    options: [
      { id: 'opt-a', text: 'Because temperatures drop, causing air molecules to freeze into solid crystals' },
      { id: 'opt-b', text: 'Because there is less mass of air in the column above, and gravity compresses air more densely near Earth\'s surface' },
      { id: 'opt-c', text: 'Because oxygen turns into ozone at higher elevations' },
      { id: 'opt-d', text: 'Because Earth\'s magnetic field repels nitrogen gas away from mountains' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Because temperatures drop, causing air molecules to freeze into solid crystals', misconceptionCode: 'MISC_FREEZING_AIR', misconceptionDescription: 'Confused cold temperature with condensation of air.' },
      { id: 'opt-c', text: 'Because oxygen turns into ozone at higher elevations', misconceptionCode: 'MISC_OZONE_CONFUSION', misconceptionDescription: 'Confused stratospheric ozone layer with tropospheric pressure gradient.' },
      { id: 'opt-d', text: 'Because Earth\'s magnetic field repels nitrogen gas away from mountains', misconceptionCode: 'MISC_MAGNETISM_MYTH', misconceptionDescription: 'Attributed atmospheric dynamics to magnetism rather than gravity and mass.' }
    ],
    irt: { a: 1.15, b: -1.3, c: 0.25 },
    ageBand: [10, 15],
    status: 'calibrated'
  },
  // Item 20: Compound Probability & Independent Events (TIMSS Math)
  {
    id: 'ITEM-STEM-020',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-PROBABILITY',
    code: 'STEM-020',
    prompt: 'An autonomous robotic vision system processes image frames. In any single frame, the probability of detecting an obstacle correctly is 0.90, and the false positive alarm rate is 0.05. If the robot evaluates 3 completely independent consecutive frames, what is the probability that all 3 frames successfully detect the obstacle?',
    explanation: 'For independent events, the joint probability is the product of individual probabilities: P(3 detections) = 0.90 × 0.90 × 0.90 = 0.729.',
    options: [
      { id: 'opt-a', text: '0.300' },
      { id: 'opt-b', text: '0.729' },
      { id: 'opt-c', text: '0.810' },
      { id: 'opt-d', text: '0.900' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '0.300', misconceptionCode: 'MISC_DIVIDED_BY_THREE', misconceptionDescription: 'Divided 0.90 by 3 frames.' },
      { id: 'opt-c', text: '0.810', misconceptionCode: 'MISC_TWO_FRAMES_ONLY', misconceptionDescription: 'Multiplied for 2 frames (0.9 × 0.9) instead of 3 frames.' },
      { id: 'opt-d', text: '0.900', misconceptionCode: 'MISC_INDEPENDENCE_NEGLECT', misconceptionDescription: 'Assumed compound probability equals single event probability.' }
    ],
    irt: { a: 1.40, b: 0.5, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 21: Vector Component Decomposition (TIMSS Math / Physics)
  {
    id: 'ITEM-STEM-021',
    competency: 'spatial_reasoning',
    skillId: 'SKILL-STEM-VECTORS',
    code: 'STEM-021',
    prompt: 'A lunar lander descends with an engine thrust vector of 5,000 N directed at an angle of 30° above the horizontal ground surface. What is the vertical component of the thrust force pushing upward against lunar gravity? (sin 30° = 0.50, cos 30° = 0.866)',
    explanation: 'The vertical component F_vertical = F × sin(θ) = 5,000 N × sin(30°) = 5,000 × 0.50 = 2,500 N.',
    options: [
      { id: 'opt-a', text: '1,500 N' },
      { id: 'opt-b', text: '2,500 N' },
      { id: 'opt-c', text: '4,330 N' },
      { id: 'opt-d', text: '5,000 N' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '1,500 N', misconceptionCode: 'MISC_ARITHMETIC_ESTIMATE', misconceptionDescription: 'Calculation error.' },
      { id: 'opt-c', text: '4,330 N', misconceptionCode: 'MISC_USED_COSINE_FOR_VERTICAL', misconceptionDescription: 'Applied cosine instead of sine for the vertical component (5,000 × 0.866 = 4,330 N).' },
      { id: 'opt-d', text: '5,000 N', misconceptionCode: 'MISC_TOTAL_VECTOR_APPLIED', misconceptionDescription: 'Assumed entire magnitude acts vertically.' }
    ],
    irt: { a: 1.45, b: 0.8, c: 0.25 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 22: Exponential Radioactive Decay (PISA Chemistry / Physics)
  {
    id: 'ITEM-STEM-022',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-RADIOACTIVITY',
    code: 'STEM-022',
    prompt: 'A radioactive isotope used for Mars rover thermoelectric power has a half-life of 28 years. If an initial fuel capsule contains 80 grams of this isotope, how many grams will remain after 84 years of interplanetary operation?',
    explanation: 'Number of half-lives = 84 years / 28 years = 3 half-lives. Remaining mass = 80 × (1/2)³ = 80 × (1/8) = 10 grams.',
    options: [
      { id: 'opt-a', text: '5 grams' },
      { id: 'opt-b', text: '10 grams' },
      { id: 'opt-c', text: '20 grams' },
      { id: 'opt-d', text: '26.7 grams' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '5 grams', misconceptionCode: 'MISC_FOUR_HALF_LIVES', misconceptionDescription: 'Calculated 4 half-lives (80 / 16 = 5g).' },
      { id: 'opt-c', text: '20 grams', misconceptionCode: 'MISC_TWO_HALF_LIVES', misconceptionDescription: 'Calculated 2 half-lives (80 / 4 = 20g).' },
      { id: 'opt-d', text: '26.7 grams', misconceptionCode: 'MISC_LINEAR_DECAY', misconceptionDescription: 'Treated exponential decay as linear reduction (80 / 3 = 26.7g).' }
    ],
    irt: { a: 1.35, b: 0.3, c: 0.25 },
    ageBand: [12, 17],
    status: 'calibrated'
  },
  // Item 23: Mitosis vs. Meiosis Chromosome Count (PISA Biology)
  {
    id: 'ITEM-STEM-023',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-CELL-DIVISION',
    code: 'STEM-023',
    prompt: 'A mammalian species has a diploid somatic cell chromosome number of 2n = 48. After a germ cell undergoes complete meiosis, how many daughter cells are produced, and how many chromosomes does each daughter cell contain?',
    explanation: 'Meiosis involves two successive cell divisions resulting in 4 genetically non-identical haploid (n) gamete daughter cells, each containing half the somatic chromosome number: 48 / 2 = 24 chromosomes.',
    options: [
      { id: 'opt-a', text: '2 daughter cells with 48 chromosomes each' },
      { id: 'opt-b', text: '2 daughter cells with 24 chromosomes each' },
      { id: 'opt-c', text: '4 daughter cells with 24 chromosomes each' },
      { id: 'opt-d', text: '4 daughter cells with 48 chromosomes each' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '2 daughter cells with 48 chromosomes each', misconceptionCode: 'MISC_CONFUSED_WITH_MITOSIS', misconceptionDescription: 'Described mitosis rather than meiosis.' },
      { id: 'opt-b', text: '2 daughter cells with 24 chromosomes each', misconceptionCode: 'MISC_ONE_MEIOTIC_DIVISION', misconceptionDescription: 'Overlooked the second meiotic division.' },
      { id: 'opt-d', text: '4 daughter cells with 48 chromosomes each', misconceptionCode: 'MISC_DIPLOID_MEIOSIS_ERROR', misconceptionDescription: 'Believed meiosis produces diploid cells.' }
    ],
    irt: { a: 1.30, b: 0.1, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 24: Friction Coefficients and Normal Force (TIMSS Physics)
  {
    id: 'ITEM-STEM-024',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-FRICTION',
    code: 'STEM-024',
    prompt: 'A rubber-treaded rover wheel rests on dry concrete. The normal force pushing downward is 200 N. The static friction coefficient is μs = 0.80 and kinetic friction coefficient is μk = 0.60. What minimum horizontal pulling force is required to break static equilibrium and begin rolling the wheel?',
    explanation: 'Static equilibrium breaks when horizontal applied force exceeds maximum static friction: F_static_max = μs × N = 0.80 × 200 N = 160 N. Once moving, kinetic friction is 120 N, but to start motion requires > 160 N.',
    options: [
      { id: 'opt-a', text: '120 N' },
      { id: 'opt-b', text: '160 N' },
      { id: 'opt-c', text: '200 N' },
      { id: 'opt-d', text: '280 N' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: '120 N', misconceptionCode: 'MISC_USED_KINETIC_FRICTION', misconceptionDescription: 'Applied kinetic coefficient μk = 0.60 instead of static μs to initiate motion.' },
      { id: 'opt-c', text: '200 N', misconceptionCode: 'MISC_EQUAL_NORMAL_FORCE', misconceptionDescription: 'Assumed pulling force must equal the vertical normal force.' },
      { id: 'opt-d', text: '280 N', misconceptionCode: 'MISC_SUMMED_COEFFICIENTS', misconceptionDescription: 'Added static and kinetic friction together (0.8 + 0.6 = 1.4 × 200 = 280 N).' }
    ],
    irt: { a: 1.40, b: 0.65, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 25: pH Scale and Logarithmic Ion Concentration (PISA Chemistry)
  {
    id: 'ITEM-STEM-025',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-PH-LOG',
    code: 'STEM-025',
    prompt: 'Water sample A from a mountain stream has a pH of 7.0. Water sample B collected downstream near an industrial runoff pipe has a pH of 4.0. How many times greater is the hydrogen ion concentration [H+] in sample B compared to sample A?',
    explanation: 'The pH scale is logarithmic: pH = -log10[H+]. A change of ΔpH = 7.0 - 4.0 = 3 units represents an increase in [H+] of 10³ = 1,000 times greater.',
    options: [
      { id: 'opt-a', text: '3 times greater' },
      { id: 'opt-b', text: '30 times greater' },
      { id: 'opt-c', text: '100 times greater' },
      { id: 'opt-d', text: '1,000 times greater' }
    ],
    correctOptionId: 'opt-d',
    distractors: [
      { id: 'opt-a', text: '3 times greater', misconceptionCode: 'MISC_LINEAR_PH_SCALE', misconceptionDescription: 'Treated pH as a linear difference (7 - 4 = 3).' },
      { id: 'opt-b', text: '30 times greater', misconceptionCode: 'MISC_MULTIPLIED_BY_TEN', misconceptionDescription: 'Multiplied difference by 10 instead of raising 10 to the 3rd power.' },
      { id: 'opt-c', text: '100 times greater', misconceptionCode: 'MISC_TWO_DECADE_ERROR', misconceptionDescription: 'Counted 2 decades instead of 3 decades of logarithmic difference.' }
    ],
    irt: { a: 1.35, b: 0.4, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 26: Energy Transformations in Hydropower (PISA Systems)
  {
    id: 'ITEM-STEM-026',
    competency: 'systems_thinking',
    skillId: 'SKILL-STEM-ENERGY-TRANSFORM',
    code: 'STEM-026',
    prompt: 'In a hydroelectric power station, water behind a dam flows through penstocks to spin an alternator. Which sequence correctly describes the transformation of energy from reservoir to electrical grid?',
    explanation: 'Water in high reservoir stores Gravitational Potential Energy $\\to$ falls through penstocks converting to Kinetic Energy $\\to$ spins turbine generator converting to Mechanical Energy $\\to$ generator rotor induces Electrical Energy.',
    options: [
      { id: 'opt-a', text: 'Chemical Energy → Thermal Energy → Kinetic Energy → Electrical Energy' },
      { id: 'opt-b', text: 'Gravitational Potential Energy → Kinetic Energy → Mechanical Energy → Electrical Energy' },
      { id: 'opt-c', text: 'Thermal Energy → Elastic Energy → Mechanical Energy → Electrical Energy' },
      { id: 'opt-d', text: 'Nuclear Energy → Kinetic Energy → Thermal Energy → Electrical Energy' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Chemical Energy → Thermal Energy → Kinetic Energy → Electrical Energy', misconceptionCode: 'MISC_COMBUSTION_CONFUSION', misconceptionDescription: 'Described coal-fired thermal plant sequence.' },
      { id: 'opt-c', text: 'Thermal Energy → Elastic Energy → Mechanical Energy → Electrical Energy', misconceptionCode: 'MISC_THERMAL_ELASTIC_ERROR', misconceptionDescription: 'Misidentified reservoir energy storage as elastic/thermal.' },
      { id: 'opt-d', text: 'Nuclear Energy → Kinetic Energy → Thermal Energy → Electrical Energy', misconceptionCode: 'MISC_NUCLEAR_CONFUSION', misconceptionDescription: 'Described nuclear reactor steam turbine sequence.' }
    ],
    irt: { a: 1.20, b: -1.1, c: 0.25 },
    ageBand: [10, 15],
    status: 'calibrated'
  },
  // Item 27: Density of Planetary Crusts (TIMSS Earth Sciences)
  {
    id: 'ITEM-STEM-027',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-GEOLOGICAL-DENSITY',
    code: 'STEM-027',
    prompt: 'Continental crust is primarily composed of granitic rock (density ≈ 2.7 g/cm³), whereas oceanic crust is primarily basaltic rock (density ≈ 3.0 g/cm³). When an oceanic tectonic plate collides with a continental tectonic plate at a convergent boundary, which geological phenomenon occurs and why?',
    explanation: 'The denser oceanic crust (3.0 g/cm³) is forced downward beneath the more buoyant, less dense continental crust (2.7 g/cm³) in a subduction zone, creating deep-sea trenches and volcanic arcs.',
    options: [
      { id: 'opt-a', text: 'The continental crust subducts beneath the oceanic crust because granite is softer' },
      { id: 'opt-b', text: 'The oceanic crust subducts beneath the continental crust because it is denser' },
      { id: 'opt-c', text: 'Both plates crumple upward equally into non-volcanic fold mountains' },
      { id: 'opt-d', text: 'Neither plate moves because oceanic water pressure neutralizes tectonic forces' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The continental crust subducts beneath the oceanic crust because granite is softer', misconceptionCode: 'MISC_HARDNESS_VS_DENSITY', misconceptionDescription: 'Confused mineral hardness with bulk rock density in subduction mechanics.' },
      { id: 'opt-c', text: 'Both plates crumple upward equally into non-volcanic fold mountains', misconceptionCode: 'MISC_CONTINENTAL_COLLISION', misconceptionDescription: 'Described continent-continent collision (e.g. Himalayas) rather than oceanic-continental subduction.' },
      { id: 'opt-d', text: 'Neither plate moves because oceanic water pressure neutralizes tectonic forces', misconceptionCode: 'MISC_WATER_PRESSURE_MYTH', misconceptionDescription: 'Believed surface water pressure counteracts deep mantle convection forces.' }
    ],
    irt: { a: 1.25, b: 0.05, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 28: Doppler Shift in Astronomy & Acoustic Physics (PISA Physics)
  {
    id: 'ITEM-STEM-028',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-DOPPLER',
    code: 'STEM-028',
    prompt: 'An autonomous emergency vehicle emits a siren tone of 800 Hz while traveling at 30 m/s toward a stationary acoustic detector. If sound speed in air is 340 m/s, what frequency is registered by the detector as the vehicle approaches?',
    explanation: 'By the Doppler effect for an approaching source: f_observed = f_source × [v / (v - v_source)] = 800 × [340 / (340 - 30)] = 800 × (340 / 310) ≈ 877 Hz.',
    options: [
      { id: 'opt-a', text: '735 Hz' },
      { id: 'opt-b', text: '800 Hz' },
      { id: 'opt-c', text: '877 Hz' },
      { id: 'opt-d', text: '950 Hz' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: '735 Hz', misconceptionCode: 'MISC_RECEDING_FORMULA', misconceptionDescription: 'Applied receding source formula [340 / (340 + 30)] resulting in lower pitch.' },
      { id: 'opt-b', text: '800 Hz', misconceptionCode: 'MISC_NO_FREQUENCY_CHANGE', misconceptionDescription: 'Ignored the Doppler compression of incoming wavefronts.' },
      { id: 'opt-d', text: '950 Hz', misconceptionCode: 'MISC_OVERESTIMATED_SHIFT', misconceptionDescription: 'Rough estimation error without formula calculation.' }
    ],
    irt: { a: 1.45, b: 1.2, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 29: Inverse Square Law for Radiation & Light (PISA/TIMSS Physics)
  {
    id: 'ITEM-STEM-029',
    competency: 'quantitative_reasoning',
    skillId: 'SKILL-STEM-INVERSE-SQUARE',
    code: 'STEM-029',
    prompt: 'A deep-space probe measures solar radiation flux of 1,360 W/m² at an orbital distance of 1.0 AU from the Sun. When the probe reaches Jupiter\'s orbit at 5.0 AU, what solar radiation flux will its solar panels receive?',
    explanation: 'Radiation intensity follows the inverse-square law with distance r: Intensity ∝ 1 / r². At 5.0 AU: I = 1,360 / (5.0)² = 1,360 / 25 = 54.4 W/m².',
    options: [
      { id: 'opt-a', text: '54.4 W/m²' },
      { id: 'opt-b', text: '272.0 W/m²' },
      { id: 'opt-c', text: '680.0 W/m²' },
      { id: 'opt-d', text: '1,335.0 W/m²' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: '272.0 W/m²', misconceptionCode: 'MISC_LINEAR_INVERSE', misconceptionDescription: 'Divided linearly by 5 instead of squaring the distance (1,360 / 5 = 272).' },
      { id: 'opt-c', text: '680.0 W/m²', misconceptionCode: 'MISC_HALVED_INTENSITY', misconceptionDescription: 'Arbitrarily halved flux without distance calculation.' },
      { id: 'opt-d', text: '1,335.0 W/m²', misconceptionCode: 'MISC_SUBTRACTED_DISTANCE', misconceptionDescription: 'Subtracted 25 from 1,360 instead of dividing.' }
    ],
    irt: { a: 1.40, b: 0.8, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 30: Enzyme Kinetics & Competitive Inhibition (PISA/TIMSS Biochemistry)
  {
    id: 'ITEM-STEM-030',
    competency: 'scientific_inquiry',
    skillId: 'SKILL-STEM-ENZYME-KINETICS',
    code: 'STEM-030',
    prompt: 'In a biochemical assay, a competitive enzyme inhibitor is added to a substrate solution. As substrate concentration [S] is increased to very high levels, what happens to the maximum reaction velocity (Vmax)?',
    explanation: 'A competitive inhibitor binds reversibly to the enzyme active site. At extremely high substrate concentrations, substrate molecules outcompete the inhibitor for active site bindings, allowing the reaction to reach the original uninhibited Vmax (though the Km constant increases).',
    options: [
      { id: 'opt-a', text: 'Vmax drops permanently to zero because enzymes are irreversibly deactivated' },
      { id: 'opt-b', text: 'Vmax is permanently halved regardless of substrate concentration' },
      { id: 'opt-c', text: 'Vmax remains unchanged because high substrate concentration outcompetes the competitive inhibitor' },
      { id: 'opt-d', text: 'Vmax doubles because inhibitor binding catalyzes secondary active sites' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: 'Vmax drops permanently to zero because enzymes are irreversibly deactivated', misconceptionCode: 'MISC_CONFUSED_NONCOMPETITIVE', misconceptionDescription: 'Confused reversible competitive inhibition with irreversible poisoning.' },
      { id: 'opt-b', text: 'Vmax is permanently halved regardless of substrate concentration', misconceptionCode: 'MISC_NONCOMPETITIVE_VMAX_DROP', misconceptionDescription: 'Described non-competitive allosteric inhibition where Vmax is reduced.' },
      { id: 'opt-d', text: 'Vmax doubles because inhibitor binding catalyzes secondary active sites', misconceptionCode: 'MISC_INHIBITOR_AS_CATALYST', misconceptionDescription: 'Believed inhibitors accelerate reaction speed.' }
    ],
    irt: { a: 1.50, b: 1.4, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  }
];
