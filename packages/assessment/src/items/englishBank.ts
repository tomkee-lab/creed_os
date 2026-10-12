import type { AssessmentItem } from '@core-os/domain';

export const ENGLISH_BENCHMARK_ITEMS: AssessmentItem[] = [
  // Item 1: Context Clues & Domain Vocabulary (CEFR A2 / Lexile 450L)
  {
    id: 'ITEM-ENG-001',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-CONTEXT-VOCAB',
    code: 'ENG-001',
    prompt: 'Read the sentence: "The arid desert landscape had not received rainfall for over twenty months, leaving the riverbeds cracked and desiccated." Based on the context clues, what does "arid" most nearly mean?',
    explanation: '"Arid" describes an extremely dry, parched environment having little or no rain. The clues "had not received rainfall for over twenty months" and "riverbeds cracked and desiccated" confirm dryness.',
    options: [
      { id: 'opt-a', text: 'Extremely dry and barren' },
      { id: 'opt-b', text: 'Freezing and stormy' },
      { id: 'opt-c', text: 'Lush and overgrown' },
      { id: 'opt-d', text: 'Mountainous and rocky' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: 'Freezing and stormy', misconceptionCode: 'MISC_CONFUSED_WEATHER_EXTREME', misconceptionDescription: 'Associated desert hardship with freezing cold.' },
      { id: 'opt-c', text: 'Lush and overgrown', misconceptionCode: 'MISC_ANTONYM_SELECTION', misconceptionDescription: 'Selected an antonym rather than the true meaning.' },
      { id: 'opt-d', text: 'Mountainous and rocky', misconceptionCode: 'MISC_INCIDENTAL_ASSOCIATION', misconceptionDescription: 'Focused on landforms rather than precipitation.' }
    ],
    irt: { a: 1.15, b: -1.4, c: 0.25 },
    ageBand: [9, 14],
    status: 'calibrated'
  },
  // Item 2: Subject-Verb Agreement with Intervening Prepositional Phrases (CEFR B1 / Lexile 650L)
  {
    id: 'ITEM-ENG-002',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-SYNTAX-AGREEMENT',
    code: 'ENG-002',
    prompt: 'Choose the sentence that demonstrates correct standard English subject-verb agreement:',
    explanation: 'The subject is "collection" (singular noun). The intervening prepositional phrase "of rare geological minerals" does not alter the number of the subject. Therefore, the singular verb "was" is required: "The collection of rare geological minerals was curated..."',
    options: [
      { id: 'opt-a', text: 'The collection of rare geological minerals were curated by the university museum.' },
      { id: 'opt-b', text: 'The collection of rare geological minerals was curated by the university museum.' },
      { id: 'opt-c', text: 'The collection of rare geological minerals have been curated by the university museum.' },
      { id: 'opt-d', text: 'The collection of rare geological minerals are curated by the university museum.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The collection of rare geological minerals were curated by the university museum.', misconceptionCode: 'MISC_PROXIMITY_AGREEMENT_ERROR', misconceptionDescription: 'Erroneously matched verb to nearest plural noun "minerals" instead of subject "collection".' },
      { id: 'opt-c', text: 'The collection of rare geological minerals have been curated by the university museum.', misconceptionCode: 'MISC_PLURAL_AUXILIARY_ERROR', misconceptionDescription: 'Used plural auxiliary "have" with singular collective noun.' },
      { id: 'opt-d', text: 'The collection of rare geological minerals are curated by the university museum.', misconceptionCode: 'MISC_PRESENT_PLURAL_ERROR', misconceptionDescription: 'Selected present plural verb with singular head noun.' }
    ],
    irt: { a: 1.30, b: -0.8, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 3: Implicit Meaning & Character Motivation Inference (CEFR B1 / Lexile 750L)
  {
    id: 'ITEM-ENG-003',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-TEXT-INFERENCE',
    code: 'ENG-003',
    prompt: 'Read the excerpt: "Marcus checked his watch for the fourth time in two minutes, pacing the tiled foyer. He smoothed the creases of his jacket, rehearsed his opening greeting in a low whisper, and wiped his palms against his slacks." What does the author primarily convey about Marcus\'s emotional state?',
    explanation: 'Marcus\'s physical behaviors—frequent checking of time, pacing, rehearsing speech aloud, and sweating palms—are classic contextual indicators of anxiety and nervous anticipation.',
    options: [
      { id: 'opt-a', text: 'He is bored and resentful of having to wait.' },
      { id: 'opt-b', text: 'He is deeply anxious and rehearsing for a high-stakes encounter.' },
      { id: 'opt-c', text: 'He is arrogant and checking his reflection with pride.' },
      { id: 'opt-d', text: 'He is exhausted from physical exertion.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'He is bored and resentful of having to wait.', misconceptionCode: 'MISC_MISINTERPRETED_PACING', misconceptionDescription: 'Interpreted pacing as restlessness/boredom rather than acute nervous anxiety.' },
      { id: 'opt-c', text: 'He is arrogant and checking his reflection with pride.', misconceptionCode: 'MISC_MISREAD_GROOMING', misconceptionDescription: 'Misread smoothing creases as vanity rather than nervous self-checking.' },
      { id: 'opt-d', text: 'He is exhausted from physical exertion.', misconceptionCode: 'MISC_LITERAL_PALM_SWEAT', misconceptionDescription: 'Interpreted sweaty palms as athletic fatigue rather than psychological nervousness.' }
    ],
    irt: { a: 1.25, b: -0.4, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 4: Identifying Author\'s Rhetorical Tone (CEFR B2 / Lexile 900L)
  {
    id: 'ITEM-ENG-004',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-RHETORICAL-TONE',
    code: 'ENG-004',
    prompt: 'Read the passage: "To suggest that urban sprawl consumes no vital agricultural soil is to look upon a paved forest and celebrate its sudden tidiness. We trade ancient topsoil that fed civilizations for parking bays that stand vacant six days a week." Which word best characterizes the author\'s tone?',
    explanation: 'The author uses sharp irony and contrast ("paved forest", "celebrate its sudden tidiness", trading ancient soil for vacant parking) to satirize and criticize urban sprawl, establishing a biting, critical tone.',
    options: [
      { id: 'opt-a', text: 'Objective and indifferent' },
      { id: 'opt-b', text: 'Sardonic and critical' },
      { id: 'opt-c', text: 'Whimsical and lighthearted' },
      { id: 'opt-d', text: 'Nostalgic and celebratory' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Objective and indifferent', misconceptionCode: 'MISC_TONE_BLINDNESS', misconceptionDescription: 'Failed to detect strong emotive and satirical rhetoric.' },
      { id: 'opt-c', text: 'Whimsical and lighthearted', misconceptionCode: 'MISC_SURFACE_IRONY_MISREAD', misconceptionDescription: 'Mistook metaphorical phrasing for playfulness.' },
      { id: 'opt-d', text: 'Nostalgic and celebratory', misconceptionCode: 'MISC_PARTIAL_WORD_BIAS', misconceptionDescription: 'Triggered by the word "celebrate" without noticing its sarcastic context.' }
    ],
    irt: { a: 1.40, b: 0.3, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 5: Parallel Structure in Sentence Syntax (CEFR B2 / Lexile 850L)
  {
    id: 'ITEM-ENG-005',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-PARALLELISM',
    code: 'ENG-005',
    prompt: 'Identify the sentence that correctly employs grammatical parallel structure:',
    explanation: 'Parallel structure requires equal grammatical forms in lists. "to analyze telemetry, to calibrate sensor arrays, and to deploy parachute dampers" balances three infinitive verb phrases.',
    options: [
      { id: 'opt-a', text: 'The flight engineer was trained to analyze telemetry, calibrating sensor arrays, and deployment of parachutes.' },
      { id: 'opt-b', text: 'The flight engineer was trained to analyze telemetry, to calibrate sensor arrays, and to deploy parachute dampers.' },
      { id: 'opt-c', text: 'The flight engineer was trained for analyzing telemetry, to calibrate sensor arrays, and parachute deployment.' },
      { id: 'opt-d', text: 'The flight engineer was trained to analyze telemetry, calibrated sensors, and then deploying dampers.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The flight engineer was trained to analyze telemetry, calibrating sensor arrays, and deployment of parachutes.', misconceptionCode: 'MISC_MIXED_GERUND_INFINITIVE', misconceptionDescription: 'Mixed infinitive, gerund, and noun phrase in parallel series.' },
      { id: 'opt-c', text: 'The flight engineer was trained for analyzing telemetry, to calibrate sensor arrays, and parachute deployment.', misconceptionCode: 'MISC_FAULTY_PARALLEL_SERIES', misconceptionDescription: 'Shifted grammatical categories midway through list.' },
      { id: 'opt-d', text: 'The flight engineer was trained to analyze telemetry, calibrated sensors, and then deploying dampers.', misconceptionCode: 'MISC_TENSE_SHIFT_INCONSISTENCY', misconceptionDescription: 'Shifted verb tenses (infinitive, past, present participle).' }
    ],
    irt: { a: 1.35, b: 0.15, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 6: Identifying Logical Fallacies (Ad Hominem vs Straw Man) (CEFR B2 / Lexile 950L)
  {
    id: 'ITEM-ENG-006',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-LOGICAL-FALLACIES',
    code: 'ENG-006',
    prompt: 'In a civic debate, Speaker A argues: "We should allocate 15% of the transit budget to expand protected bicycle lanes." Speaker B responds: "My opponent wants to abolish all automobile travel and force every family to pedal ten miles in winter blizzards." Which logical fallacy does Speaker B commit?',
    explanation: 'A Straw Man fallacy occurs when an opponent\'s original argument is exaggerated, oversimplified, or completely distorted into an extreme caricature that is much easier to attack than the actual proposal.',
    options: [
      { id: 'opt-a', text: 'Ad Hominem (personal insult attack)' },
      { id: 'opt-b', text: 'Straw Man (distorting the opponent\'s argument into an extreme position)' },
      { id: 'opt-c', text: 'False Equivalence (treating two unequal situations as identical)' },
      { id: 'opt-d', text: 'Post Hoc Ergo Propter Hoc (assuming false chronological causation)' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Ad Hominem (personal insult attack)', misconceptionCode: 'MISC_CONFUSED_FALLACY_TYPES', misconceptionDescription: 'Believed any opposing argument is ad hominem regardless of whether personal character was attacked.' },
      { id: 'opt-c', text: 'False Equivalence (treating two unequal situations as identical)', misconceptionCode: 'MISC_EQUIVALENCE_ERROR', misconceptionDescription: 'Confused distortion with false balance.' },
      { id: 'opt-d', text: 'Post Hoc Ergo Propter Hoc (assuming false chronological causation)', misconceptionCode: 'MISC_CAUSALITY_CONFUSION', misconceptionDescription: 'Assumed time sequence was being debated.' }
    ],
    irt: { a: 1.45, b: 0.7, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 7: Figurative Language & Metaphorical Tenor (CEFR B1 / Lexile 700L)
  {
    id: 'ITEM-ENG-007',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-FIGURATIVE-LANGUAGE',
    code: 'ENG-007',
    prompt: 'In the sentence: "The ancient oak tree stood as a steadfast sentinel over the slumbering valley," what type of figurative device is used, and what does it emphasize?',
    explanation: 'Calling the tree a "steadfast sentinel" (guard/watchman) without "like" or "as" is a direct metaphor that personifies the oak as an enduring, protective guardian watching over the quiet valley.',
    options: [
      { id: 'opt-a', text: 'Simile, emphasizing the tree\'s rapid growth' },
      { id: 'opt-b', text: 'Hyperbole, emphasizing that the tree cannot be destroyed' },
      { id: 'opt-c', text: 'Metaphor with personification, emphasizing the tree\'s protective and enduring presence' },
      { id: 'opt-d', text: 'Onomatopoeia, emphasizing the sound of rustling wind' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: 'Simile, emphasizing the tree\'s rapid growth', misconceptionCode: 'MISC_SIMILE_CONFUSION', misconceptionDescription: 'Misidentified metaphor as a simile because the word "as" appeared elsewhere in syntax.' },
      { id: 'opt-b', text: 'Hyperbole, emphasizing that the tree cannot be destroyed', misconceptionCode: 'MISC_HYPERBOLE_MISREAD', misconceptionDescription: 'Confused figurative guardianship with literal invulnerability.' },
      { id: 'opt-d', text: 'Onomatopoeia, emphasizing the sound of rustling wind', misconceptionCode: 'MISC_SOUND_DEVICE_MISREAD', misconceptionDescription: 'Confused sensory imagery with sound mimicry words.' }
    ],
    irt: { a: 1.20, b: -0.6, c: 0.25 },
    ageBand: [10, 15],
    status: 'calibrated'
  },
  // Item 8: Semicolons & Conjunctive Adverbs (CEFR B2 / Lexile 900L)
  {
    id: 'ITEM-ENG-008',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-PUNCTUATION-SYNTAX',
    code: 'ENG-008',
    prompt: 'Choose the sentence punctuated correctly according to formal conventions for joining two independent clauses with a conjunctive adverb:',
    explanation: 'When linking two independent clauses with a conjunctive adverb (e.g. "consequently", "however", "therefore"), the convention is a semicolon before the adverb and a comma immediately following it: [Independent clause]; [adverb], [Independent clause].',
    options: [
      { id: 'opt-a', text: 'The atmospheric storm disrupted telecommunication satellites; consequently, the planetary mission rover entered defensive sleep mode.' },
      { id: 'opt-b', text: 'The atmospheric storm disrupted telecommunication satellites, consequently, the planetary mission rover entered defensive sleep mode.' },
      { id: 'opt-c', text: 'The atmospheric storm disrupted telecommunication satellites consequently; the planetary mission rover entered defensive sleep mode.' },
      { id: 'opt-d', text: 'The atmospheric storm disrupted telecommunication satellites; consequently the planetary mission rover entered defensive sleep mode.' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: 'The atmospheric storm disrupted telecommunication satellites, consequently, the planetary mission rover entered defensive sleep mode.', misconceptionCode: 'MISC_COMMA_SPLICE_ERROR', misconceptionDescription: 'Created an ungrammatical comma splice by joining independent clauses with a simple comma.' },
      { id: 'opt-c', text: 'The atmospheric storm disrupted telecommunication satellites consequently; the planetary mission rover entered defensive sleep mode.', misconceptionCode: 'MISC_MISPLACED_SEMICOLON', misconceptionDescription: 'Placed semicolon after the conjunctive adverb rather than before.' },
      { id: 'opt-d', text: 'The atmospheric storm disrupted telecommunication satellites; consequently the planetary mission rover entered defensive sleep mode.', misconceptionCode: 'MISC_OMITTED_FOLLOWING_COMMA', misconceptionDescription: 'Omitted the necessary comma isolating the conjunctive adverb.' }
    ],
    irt: { a: 1.35, b: 0.45, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 9: Textual Cohesion & Transitional Logic (CEFR B1 / Lexile 800L)
  {
    id: 'ITEM-ENG-009',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-TEXT-COHESION',
    code: 'ENG-009',
    prompt: 'Read the paragraph: "Autonomous electric vehicles promise significant reductions in tailpipe carbon emissions. [_____], their widespread adoption requires vast overhauls of localized power distribution grids and sustainable lithium extraction policies." Which transitional phrase best connects these two sentences logically?',
    explanation: 'The second sentence introduces a counter-balancing qualification and major infrastructure obstacle to the promise stated in the first sentence. "Nevertheless" denotes contrast and concession.',
    options: [
      { id: 'opt-a', text: 'Furthermore' },
      { id: 'opt-b', text: 'Nevertheless' },
      { id: 'opt-c', text: 'Similarly' },
      { id: 'opt-d', text: 'In other words' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Furthermore', misconceptionCode: 'MISC_ADDITION_INSTEAD_OF_CONTRAST', misconceptionDescription: 'Treated a contrasting condition as a reinforcing addition.' },
      { id: 'opt-c', text: 'Similarly', misconceptionCode: 'MISC_COMPARISON_CONFUSION', misconceptionDescription: 'Treated an obstacle as an analogous similarity.' },
      { id: 'opt-d', text: 'In other words', misconceptionCode: 'MISC_RESTATEMENT_CONFUSION', misconceptionDescription: 'Treated a distinct operational challenge as a linguistic restatement.' }
    ],
    irt: { a: 1.25, b: -0.2, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 10: Nuanced Connotation & Diction (CEFR C1 / Lexile 1100L)
  {
    id: 'ITEM-ENG-010',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-CONNOTATION',
    code: 'ENG-010',
    prompt: 'Consider these words that share the denotation of "frugal or careful with money": thrifty, miserly, parsimonious, economical. Which word conveys the most intensely negative connotation of excessive greed and unwillingness to spend even for essentials?',
    explanation: '"Miserly" carries a deeply negative connotation denoting selfish hoarding and cruelty toward others or oneself, whereas "economical" and "thrifty" convey positive prudence, and "parsimonious" can be neutral/formal.',
    options: [
      { id: 'opt-a', text: 'Economical' },
      { id: 'opt-b', text: 'Thrifty' },
      { id: 'opt-c', text: 'Miserly' },
      { id: 'opt-d', text: 'Provident' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: 'Economical', misconceptionCode: 'MISC_POSITIVE_CONNOTATION_BIAS', misconceptionDescription: 'Selected a word with positive, rational connotation.' },
      { id: 'opt-b', text: 'Thrifty', misconceptionCode: 'MISC_CONFUSED_VIRTUE_WITH_VICE', misconceptionDescription: 'Thrifty indicates praiseworthy practical management.' },
      { id: 'opt-d', text: 'Provident', misconceptionCode: 'MISC_VOCABULARY_UNFAMILIARITY', misconceptionDescription: 'Provident denotes wise forethought for the future, not stingy greed.' }
    ],
    irt: { a: 1.45, b: 1.1, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 11: Active vs. Passive Voice Rhetorical Impact (CEFR B2 / Lexile 900L)
  {
    id: 'ITEM-ENG-011',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-ACTIVE-PASSIVE',
    code: 'ENG-011',
    prompt: 'Read the official communique: "Significant procedural errors were committed during the launch sequence review." Why would an organizational spokesperson deliberately select this passive construction over an active voice alternative?',
    explanation: 'Passive voice ("errors were committed") grammatically obscures and omits the agent (who made the mistakes), deflecting individual culpability and accountability.',
    options: [
      { id: 'opt-a', text: 'To clearly identify and punish the specific engineers responsible' },
      { id: 'opt-b', text: 'To deflect personal responsibility by concealing the agent who made the errors' },
      { id: 'opt-c', text: 'Because active voice is forbidden in formal legal announcements' },
      { id: 'opt-d', text: 'To indicate that the launch was entirely flawless' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'To clearly identify and punish the specific engineers responsible', misconceptionCode: 'MISC_INVERTED_RHETORICAL_GOAL', misconceptionDescription: 'Believed passive construction highlights personal actors.' },
      { id: 'opt-c', text: 'Because active voice is forbidden in formal legal announcements', misconceptionCode: 'MISC_FALSE_GRAMMAR_RULE', misconceptionDescription: 'Believed active voice is illegal in official prose.' },
      { id: 'opt-d', text: 'To indicate that the launch was entirely flawless', misconceptionCode: 'MISC_CONTRADICTORY_READING', misconceptionDescription: 'Completely contradicted the admission of errors.' }
    ],
    irt: { a: 1.30, b: 0.2, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 12: Evaluating Argumentative Evidence Validity (CEFR B2 / Lexile 1000L)
  {
    id: 'ITEM-ENG-012',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-EVIDENCE-EVAL',
    code: 'ENG-012',
    prompt: 'An author claims: "Installing interactive smartboards in primary classrooms fundamentally boosts mathematical problem-solving skills across all socioeconomic groups." Which piece of evidence provides the strongest and most methodologically sound support for this claim?',
    explanation: 'Methodological rigor requires peer-reviewed longitudinal studies comparing treatment and control cohorts across representative demographic populations, rather than vendor claims or individual anecdotes.',
    options: [
      { id: 'opt-a', text: 'A testimonial quote from an educational technology sales executive celebrating record hardware deliveries' },
      { id: 'opt-b', text: 'A peer-reviewed, five-year randomized controlled trial of 120 diverse schools demonstrating sustained gains in mathematical reasoning relative to control groups' },
      { id: 'opt-c', text: 'An opinion post on social media by a parent whose child enjoyed a classroom math game' },
      { id: 'opt-d', text: 'A survey showing that 85% of teachers find the screen displays bright and aesthetically pleasing' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'A testimonial quote from an educational technology sales executive celebrating record hardware deliveries', misconceptionCode: 'MISC_COMMERCIAL_BIAS_BLINDNESS', misconceptionDescription: 'Mistook commercial corporate sales metrics for objective pedagogical efficacy.' },
      { id: 'opt-c', text: 'An opinion post on social media by a parent whose child enjoyed a classroom math game', misconceptionCode: 'MISC_ANECDOTAL_AS_EMPIRICAL', misconceptionDescription: 'Accepted isolated anecdotal testimony as empirical proof.' },
      { id: 'opt-d', text: 'A survey showing that 85% of teachers find the screen displays bright and aesthetically pleasing', misconceptionCode: 'MISC_IRRELEVANT_ATTRIBUTION', misconceptionDescription: 'Confused cosmetic display brightness with cognitive math acquisition.' }
    ],
    irt: { a: 1.40, b: 0.6, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 13: Dangling and Misplaced Modifiers (CEFR B1 / Lexile 750L)
  {
    id: 'ITEM-ENG-013',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-DANGLING-MODIFIERS',
    code: 'ENG-013',
    prompt: 'Which sentence avoids a dangling or misplaced modifier?',
    explanation: 'In option C, the introductory participial modifier "Hoping to avoid traffic" is immediately followed by the logical subject "Elena" who is doing the hoping. Options A, B, and D illogically suggest the alarm clock or GPS was hoping.',
    options: [
      { id: 'opt-a', text: 'Hoping to avoid traffic, the alarm clock was set for five in the morning by Elena.' },
      { id: 'opt-b', text: 'Hoping to avoid traffic, a shortcut was recommended by the vehicle\'s GPS system.' },
      { id: 'opt-c', text: 'Hoping to avoid traffic, Elena set her alarm clock for five in the morning.' },
      { id: 'opt-d', text: 'Hoping to avoid traffic, the subway schedule was scrutinized by the commuters.' }
    ],
    correctOptionId: 'opt-c',
    distractors: [
      { id: 'opt-a', text: 'Hoping to avoid traffic, the alarm clock was set for five in the morning by Elena.', misconceptionCode: 'MISC_DANGLING_PARTICIPLE_ALARM', misconceptionDescription: 'Attributed human intentionality to inanimate alarm clock.' },
      { id: 'opt-b', text: 'Hoping to avoid traffic, a shortcut was recommended by the vehicle\'s GPS system.', misconceptionCode: 'MISC_DANGLING_PARTICIPLE_GPS', misconceptionDescription: 'Modifier incorrectly attaches to "shortcut".' },
      { id: 'opt-d', text: 'Hoping to avoid traffic, the subway schedule was scrutinized by the commuters.', misconceptionCode: 'MISC_MODIFIER_ATTACHED_TO_SCHEDULE', misconceptionDescription: 'Modifier attaches to "subway schedule" instead of "commuters".' }
    ],
    irt: { a: 1.35, b: 0.25, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 14: Central Theme vs. Plot Summary (CEFR B1 / Lexile 800L)
  {
    id: 'ITEM-ENG-014',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-THEME-EXTRACTION',
    code: 'ENG-014',
    prompt: 'In a novella, an inventor creates an automated companion that predicts every human desire before it is spoken. Over time, community members lose their ability to communicate with each other and become emotionally isolated. Which statement best articulates the deeper thematic message of the work?',
    explanation: 'A theme is an abstract philosophical commentary on human nature or society, not merely a recap of plot events. The theme centers on how algorithmic convenience can erode genuine interpersonal vulnerability.',
    options: [
      { id: 'opt-a', text: 'Inventions must always be equipped with emergency battery power supplies' },
      { id: 'opt-b', text: 'Unrestrained technological convenience may inadvertently erode authentic human intimacy and empathy' },
      { id: 'opt-c', text: 'Robots are capable of processing natural language queries faster than humans' },
      { id: 'opt-d', text: 'Inventors should charge higher subscription prices for automated tools' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Inventions must always be equipped with emergency battery power supplies', misconceptionCode: 'MISC_SURFACE_HARDWARE_LITERAL', misconceptionDescription: 'Confused mechanical logistics with literary theme.' },
      { id: 'opt-c', text: 'Robots are capable of processing natural language queries faster than humans', misconceptionCode: 'MISC_PLOT_FACT_AS_THEME', misconceptionDescription: 'Treated an expositional plot detail as the narrative theme.' },
      { id: 'opt-d', text: 'Inventors should charge higher subscription prices for automated tools', misconceptionCode: 'MISC_COMMERCIAL_DISTORTION', misconceptionDescription: 'Imposed an unrelated economic takeaway.' }
    ],
    irt: { a: 1.25, b: -0.1, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 15: Synonymous Register & Formality Shift (CEFR B2 / Lexile 950L)
  {
    id: 'ITEM-ENG-015',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-LINGUISTIC-REGISTER',
    code: 'ENG-015',
    prompt: 'In an academic research thesis, which revision replaces the informal phrase "got rid of all the bad data points" with the most appropriate scholarly register?',
    explanation: '"Systematically excluded aberrant outliers" represents precise, standardized academic diction fitting a formal scientific methodology section.',
    options: [
      { id: 'opt-a', text: 'threw out the junk records that looked weird' },
      { id: 'opt-b', text: 'systematically excluded aberrant statistical outliers' },
      { id: 'opt-c', text: 'dumped all the confusing numbers in the trash' },
      { id: 'opt-d', text: 'deleted data points that didn\'t make any sense' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'threw out the junk records that looked weird', misconceptionCode: 'MISC_COLLOQUIAL_REGISTER', misconceptionDescription: 'Retained informal conversational register.' },
      { id: 'opt-c', text: 'dumped all the confusing numbers in the trash', misconceptionCode: 'MISC_SLANG_REGISTER', misconceptionDescription: 'Used hyperbolic colloquial language.' },
      { id: 'opt-d', text: 'deleted data points that didn\'t make any sense', misconceptionCode: 'MISC_VAGUE_CASUAL_DICTION', misconceptionDescription: 'Used imprecise subjective terms ("didn\'t make sense").' }
    ],
    irt: { a: 1.20, b: -0.5, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 16: Irony Analysis (Dramatic, Situational, Verbal) (CEFR B2 / Lexile 900L)
  {
    id: 'ITEM-ENG-016',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-IRONY-TYPES',
    code: 'ENG-016',
    prompt: 'A high-security cyber defense corporation spends ten million dollars constructing the world\'s most impregnable biometric server vault. On opening day, the facility is rendered completely inaccessible because the chief architect accidentally locked the only master keycard inside the vault. Which specific form of irony is demonstrated?',
    explanation: 'Situational irony occurs when the actual outcome of an action or event is the exact reverse of what is reasonably expected based on purpose and intention.',
    options: [
      { id: 'opt-a', text: 'Dramatic irony' },
      { id: 'opt-b', text: 'Situational irony' },
      { id: 'opt-c', text: 'Verbal irony' },
      { id: 'opt-d', text: 'Cosmic fate' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Dramatic irony', misconceptionCode: 'MISC_CONFUSED_WITH_DRAMATIC_IRONY', misconceptionDescription: 'Dramatic irony requires the audience knowing a truth that characters do not know.' },
      { id: 'opt-c', text: 'Verbal irony', misconceptionCode: 'MISC_CONFUSED_WITH_SARCASM', misconceptionDescription: 'Verbal irony requires someone stating the opposite of what they mean.' },
      { id: 'opt-d', text: 'Cosmic fate', misconceptionCode: 'MISC_NON_LITERARY_LABEL', misconceptionDescription: 'Applied colloquial superstition rather than literary terminology.' }
    ],
    irt: { a: 1.35, b: 0.1, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 17: Complex Sentence Structure (Subordinating Conjunctions) (CEFR B1 / Lexile 750L)
  {
    id: 'ITEM-ENG-017',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-COMPLEX-SENTENCES',
    code: 'ENG-017',
    prompt: 'Which sentence correctly structures an introductory dependent clause with standard punctuation?',
    explanation: 'An introductory dependent clause starting with a subordinating conjunction ("Although...") must be followed by a comma before the independent clause: "Although the experimental rover sustained minor telemetry glitches, it completed its planetary transit."',
    options: [
      { id: 'opt-a', text: 'Although the experimental rover sustained minor telemetry glitches it completed its planetary transit.' },
      { id: 'opt-b', text: 'Although the experimental rover sustained minor telemetry glitches, it completed its planetary transit.' },
      { id: 'opt-c', text: 'Although the experimental rover sustained minor telemetry glitches; it completed its planetary transit.' },
      { id: 'opt-d', text: 'Although, the experimental rover sustained minor telemetry glitches it completed its planetary transit.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Although the experimental rover sustained minor telemetry glitches it completed its planetary transit.', misconceptionCode: 'MISC_RUN_ON_DEPENDENT', misconceptionDescription: 'Omitted the necessary separating comma between clauses.' },
      { id: 'opt-c', text: 'Although the experimental rover sustained minor telemetry glitches; it completed its planetary transit.', misconceptionCode: 'MISC_SEMICOLON_ON_FRAGMENT', misconceptionDescription: 'Used a semicolon after a dependent fragment instead of two independent clauses.' },
      { id: 'opt-d', text: 'Although, the experimental rover sustained minor telemetry glitches it completed its planetary transit.', misconceptionCode: 'MISC_ISOLATED_CONJUNCTION_COMMA', misconceptionDescription: 'Incorrectly placed comma directly after the subordinating conjunction.' }
    ],
    irt: { a: 1.30, b: -0.7, c: 0.25 },
    ageBand: [10, 15],
    status: 'calibrated'
  },
  // Item 18: Evaluating Counterarguments in Persuasive Writing (CEFR B2 / Lexile 1050L)
  {
    id: 'ITEM-ENG-018',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-COUNTERARGUMENTS',
    code: 'ENG-018',
    prompt: 'An editorial advocates for replacing all paper textbooks with digital tablets in public high schools. To maintain rhetorical credibility, which counterargument must the author most directly acknowledge and refute?',
    explanation: 'A formidable counterargument targets the most substantial objection: equitable device and broadband access for disadvantaged households and cognitive fatigue/distraction from screen time.',
    options: [
      { id: 'opt-a', text: 'Some students prefer the smell of aged paper and leather bookbindings.' },
      { id: 'opt-b', text: 'Digital hardware imposes significant initial capital costs, requires sustained IT infrastructure, and may disadvantage low-income students lacking home broadband.' },
      { id: 'opt-c', text: 'Lockers will become empty and therefore waste hallway square footage.' },
      { id: 'opt-d', text: 'Backpacks will become too lightweight, reducing daily student calorie burn.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Some students prefer the smell of aged paper and leather bookbindings.', misconceptionCode: 'MISC_TRIVIAL_PREFERENCE', misconceptionDescription: 'Addressed sentimental nostalgia rather than systemic policy barriers.' },
      { id: 'opt-c', text: 'Lockers will become empty and therefore waste hallway square footage.', misconceptionCode: 'MISC_PERIPHERAL_CONCERN', misconceptionDescription: 'Focused on minor facility logistics.' },
      { id: 'opt-d', text: 'Backpacks will become too lightweight, reducing daily student calorie burn.', misconceptionCode: 'MISC_ABSURD_OBJECTION', misconceptionDescription: 'Pitted a facetious objection against serious policy.' }
    ],
    irt: { a: 1.40, b: 0.5, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 19: Unpacking Euphemisms in Bureaucratic Rhetoric (CEFR B2 / Lexile 1000L)
  {
    id: 'ITEM-ENG-019',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-EUPHEMISMS',
    code: 'ENG-019',
    prompt: 'A corporate press release states: "Following a strategic workforce rationalization, our company is rightsizing its regional branch operations." What action is the corporation actually describing behind this euphemistic phrasing?',
    explanation: '"Workforce rationalization" and "rightsizing" are standard bureaucratic euphemisms designed to soften the negative public impact of mass employee layoffs and branch closures.',
    options: [
      { id: 'opt-a', text: 'Expanding into new international markets' },
      { id: 'opt-b', text: 'Terminating employees and shutting down regional facilities' },
      { id: 'opt-c', text: 'Increasing salaries and bonuses for regional staff' },
      { id: 'opt-d', text: 'Renovating the physical architectural dimensions of office buildings' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Expanding into new international markets', misconceptionCode: 'MISC_EXPANSION_MISREAD', misconceptionDescription: 'Assumed "strategic" implies corporate growth.' },
      { id: 'opt-c', text: 'Increasing salaries and bonuses for regional staff', misconceptionCode: 'MISC_CONTRADICTORY_INFERENCE', misconceptionDescription: 'Misread "rationalization" as an employee reward.' },
      { id: 'opt-d', text: 'Renovating the physical architectural dimensions of office buildings', misconceptionCode: 'MISC_LITERAL_SIZING_ERROR', misconceptionDescription: 'Interpreted "rightsizing" literally as physical architecture alterations.' }
    ],
    irt: { a: 1.35, b: 0.35, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 20: Pronoun-Antecedent Clarity & Ambiguity (CEFR B1 / Lexile 750L)
  {
    id: 'ITEM-ENG-020',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-PRONOUN-AMBIGUITY',
    code: 'ENG-020',
    prompt: 'Read the sentence: "When Dr. Chen presented the research paper to Professor Vance, she noticed an erroneous equation in the methodology section." Why is this sentence grammatically ambiguous?',
    explanation: 'The pronoun "she" has two possible female singular antecedents ("Dr. Chen" or "Professor Vance"), making it impossible for the reader to determine who noticed the error without clarifying rephrasing.',
    options: [
      { id: 'opt-a', text: 'The verb "presented" is in the wrong tense' },
      { id: 'opt-b', text: 'The pronoun "she" could refer to either Dr. Chen or Professor Vance' },
      { id: 'opt-c', text: 'The preposition "to" should be replaced with "toward"' },
      { id: 'opt-d', text: 'The word "erroneous" cannot modify an equation' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'The verb "presented" is in the wrong tense', misconceptionCode: 'MISC_IMAGINED_TENSE_FAULT', misconceptionDescription: 'Wrongly challenged standard simple past tense.' },
      { id: 'opt-c', text: 'The preposition "to" should be replaced with "toward"', misconceptionCode: 'MISC_PREPOSITION_CHURN', misconceptionDescription: 'Unnecessary prepositional substitution.' },
      { id: 'opt-d', text: 'The word "erroneous" cannot modify an equation', misconceptionCode: 'MISC_VOCABULARY_MISUNDERSTANDING', misconceptionDescription: 'Erroneous is an exact modifier for a mathematical error.' }
    ],
    irt: { a: 1.25, b: -0.45, c: 0.25 },
    ageBand: [10, 16],
    status: 'calibrated'
  },
  // Item 21: Analyzing Synecdoche and Metonymy (CEFR C1 / Lexile 1150L)
  {
    id: 'ITEM-ENG-021',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-METONYMY',
    code: 'ENG-021',
    prompt: 'In the journalistic headline: "The White House announced a landmark treaty today, but Wall Street reacted with profound skepticism," which rhetorical device is used in the references to "The White House" and "Wall Street"?',
    explanation: 'Metonymy replaces the name of a thing with the name of something closely associated with it: "The White House" stands for the US Executive administration, and "Wall Street" stands for the financial markets.',
    options: [
      { id: 'opt-a', text: 'Metonymy' },
      { id: 'opt-b', text: 'Oxymoron' },
      { id: 'opt-c', text: 'Alliteration' },
      { id: 'opt-d', text: 'Euphemism' }
    ],
    correctOptionId: 'opt-a',
    distractors: [
      { id: 'opt-b', text: 'Oxymoron', misconceptionCode: 'MISC_OXYMORON_CONFUSION', misconceptionDescription: 'An oxymoron requires contradictory terms juxtaposed together (e.g. deafening silence).' },
      { id: 'opt-c', text: 'Alliteration', misconceptionCode: 'MISC_SOUND_SCHEME_ERROR', misconceptionDescription: 'Alliteration is repetition of initial consonant sounds.' },
      { id: 'opt-d', text: 'Euphemism', misconceptionCode: 'MISC_EUPHEMISM_MISAPPLIED', misconceptionDescription: 'These are associative geopolitical metonyms, not polite softenings of taboo concepts.' }
    ],
    irt: { a: 1.45, b: 0.95, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 22: Identifying the Subjunctive Mood (CEFR B2 / Lexile 900L)
  {
    id: 'ITEM-ENG-022',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-SUBJUNCTIVE-MOOD',
    code: 'ENG-022',
    prompt: 'Which sentence correctly uses the subjunctive mood to express a condition contrary to fact?',
    explanation: 'In formal English, the past subjunctive of "to be" uses "were" for all subjects when expressing hypothetical, impossible, or contrary-to-fact conditions: "If she were the director..." (not "If she was").',
    options: [
      { id: 'opt-a', text: 'If she was the director, she would approve the orbital launch timeline immediately.' },
      { id: 'opt-b', text: 'If she were the director, she would approve the orbital launch timeline immediately.' },
      { id: 'opt-c', text: 'If she is the director, she will approve the orbital launch timeline immediately.' },
      { id: 'opt-d', text: 'If she will be the director, she approves the orbital launch timeline immediately.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'If she was the director, she would approve the orbital launch timeline immediately.', misconceptionCode: 'MISC_COLLOQUIAL_WAS_SUBJUNCTIVE', misconceptionDescription: 'Accepted colloquial indicative "was" instead of formal hypothetical subjunctive "were".' },
      { id: 'opt-c', text: 'If she is the director, she will approve the orbital launch timeline immediately.', misconceptionCode: 'MISC_INDICATIVE_REAL_CONDITION', misconceptionDescription: 'Described an open real condition rather than contrary-to-fact subjunctive.' },
      { id: 'opt-d', text: 'If she will be the director, she approves the orbital launch timeline immediately.', misconceptionCode: 'MISC_FUTURE_MODAL_IN_PROTASIS', misconceptionDescription: 'Ungrammatically placed future modal "will" in condition clause.' }
    ],
    irt: { a: 1.40, b: 0.7, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 23: Text Structure: Cause-and-Effect vs Problem-Solution (CEFR B1 / Lexile 800L)
  {
    id: 'ITEM-ENG-023',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-TEXT-STRUCTURE',
    code: 'ENG-023',
    prompt: 'An informational text details how urban heat islands trap warmth due to asphalt absorption, then introduces rooftop gardens and reflective ceramic pavement as viable urban planning countermeasures. What is the overarching organizational structure of this text?',
    explanation: 'The text first frames a systemic challenge (heat absorption) and immediately proposes deliberate civic interventions to mitigate it, embodying a Problem-and-Solution organizational design.',
    options: [
      { id: 'opt-a', text: 'Chronological sequence' },
      { id: 'opt-b', text: 'Problem and Solution' },
      { id: 'opt-c', text: 'Compare and Contrast' },
      { id: 'opt-d', text: 'Narrative flash-forward' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Chronological sequence', misconceptionCode: 'MISC_CHRONOLOGICAL_MISREAD', misconceptionDescription: 'No timeline or chronological historical progression was established.' },
      { id: 'opt-c', text: 'Compare and Contrast', misconceptionCode: 'MISC_COMPARE_CONTRAST_MISAPPLIED', misconceptionDescription: 'The focus is addressing an obstacle, not contrasting equal opposing ideas.' },
      { id: 'opt-d', text: 'Narrative flash-forward', misconceptionCode: 'MISC_FICTION_DEVICE_CONFUSION', misconceptionDescription: 'Applied a narrative fiction concept to informational prose.' }
    ],
    irt: { a: 1.20, b: -0.85, c: 0.25 },
    ageBand: [10, 15],
    status: 'calibrated'
  },
  // Item 24: Synthesizing Disparate Perspectives (CEFR B2 / Lexile 1050L)
  {
    id: 'ITEM-ENG-024',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-PERSPECTIVE-SYNTHESIS',
    code: 'ENG-024',
    prompt: 'Historian A attributes the collapse of the Bronze Age civilizations primarily to catastrophic climate drought and agricultural failure. Historian B argues it was caused by marauding Sea People raids and disrupted maritime tin trade routes. What is the most balanced synthesis of these historical arguments?',
    explanation: 'A nuanced academic synthesis avoids binary either/or thinking and recognizes that environmental drought likely destabilized agricultural foundations, making societies vulnerable to subsequent invasions and trade collapse.',
    options: [
      { id: 'opt-a', text: 'Historian A is completely incorrect because naval battles were documented on temple walls.' },
      { id: 'opt-b', text: 'The Bronze Age collapse likely resulted from a multi-causal compounding crisis, where environmental stressors destabilized societal resilience, exacerbating vulnerability to external invasions.' },
      { id: 'opt-c', text: 'Neither drought nor invasions occurred; historians fabricated both theories.' },
      { id: 'opt-d', text: 'The two theories are identical and use different vocabulary to describe the exact same event.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Historian A is completely incorrect because naval battles were documented on temple walls.', misconceptionCode: 'MISC_BINARY_ABSOLUTE_DISMISSAL', misconceptionDescription: 'Adopted an unscientific single-cause rejection.' },
      { id: 'opt-c', text: 'Neither drought nor invasions occurred; historians fabricated both theories.', misconceptionCode: 'MISC_HISTORICAL_NIHILISM', misconceptionDescription: 'Dismissed scholarly historical discourse entirely.' },
      { id: 'opt-d', text: 'The two theories are identical and use different vocabulary to describe the exact same event.', misconceptionCode: 'MISC_FALSE_EQUIVALENCE_THEORIES', misconceptionDescription: 'Conflated climate drought with naval maritime warfare.' }
    ],
    irt: { a: 1.40, b: 0.55, c: 0.25 },
    ageBand: [12, 18],
    status: 'calibrated'
  },
  // Item 25: Vocabulary in Context (Polysemy: "Sanction") (CEFR C1 / Lexile 1200L)
  {
    id: 'ITEM-ENG-025',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-CONTRANYMS',
    code: 'ENG-025',
    prompt: 'The English word "sanction" is an auto-antonym (contranym). Read: "The ethics committee voted to sanction the experimental trial after verifying that all safety protocols adhered to international law." In this specific context, what does "sanction" mean?',
    explanation: 'Depending on context, "sanction" can mean either "to penalize/prohibit" or "to formally approve/authorize". In this context of verifying adherence to safety protocols, it means to grant official authorization.',
    options: [
      { id: 'opt-a', text: 'To impose economic penalties against' },
      { id: 'opt-b', text: 'To formally approve and give official permission for' },
      { id: 'opt-c', text: 'To indefinitely postpone and bury' },
      { id: 'opt-d', text: 'To audit for financial corruption' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'To impose economic penalties against', misconceptionCode: 'MISC_OPPOSITE_MEANING_SELECTION', misconceptionDescription: 'Selected the penalize/punish meaning of the contranym rather than approve.' },
      { id: 'opt-c', text: 'To indefinitely postpone and bury', misconceptionCode: 'MISC_CONFUSED_WITH_TABLE', misconceptionDescription: 'Confused sanction with tabling a motion.' },
      { id: 'opt-d', text: 'To audit for financial corruption', misconceptionCode: 'MISC_INCIDENTAL_ASSOCIATION', misconceptionDescription: 'Associated ethics committee with financial auditing.' }
    ],
    irt: { a: 1.45, b: 1.25, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 26: Evaluating Rhetorical Appeals (Ethos, Pathos, Logos) (CEFR B2 / Lexile 950L)
  {
    id: 'ITEM-ENG-026',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-RHETORICAL-APPEALS',
    code: 'ENG-026',
    prompt: 'A climate scientist delivers a public lecture: "Over thirty-eight peer-reviewed ice core datasets compiled across Antarctica confirm atmospheric carbon dioxide levels have accelerated by 42% since the pre-industrial era, matching our thermodynamic models." Which primary rhetorical appeal does the speaker utilize?',
    explanation: 'Logos appeals to logic, empirical data, objective statistical measurements, and rational deductive evidence.',
    options: [
      { id: 'opt-a', text: 'Pathos (appeal to emotion and fear)' },
      { id: 'opt-b', text: 'Logos (appeal to empirical logic, data, and verifiable evidence)' },
      { id: 'opt-c', text: 'Kairos (pure reliance on opportune timing without facts)' },
      { id: 'opt-d', text: 'Mythos (appeal to traditional folk legends)' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Pathos (appeal to emotion and fear)', misconceptionCode: 'MISC_CONFUSED_WITH_PATHOS', misconceptionDescription: 'Assumed discussing climate is automatically an emotional appeal regardless of data.' },
      { id: 'opt-c', text: 'Kairos (pure reliance on opportune timing without facts)', misconceptionCode: 'MISC_KAIROS_CONFUSION', misconceptionDescription: 'Confused scientific evidence with rhetorical timing.' },
      { id: 'opt-d', text: 'Mythos (appeal to traditional folk legends)', misconceptionCode: 'MISC_MYTHOS_MISREAD', misconceptionDescription: 'Ignored scientific datasets and models.' }
    ],
    irt: { a: 1.30, b: -0.15, c: 0.25 },
    ageBand: [11, 17],
    status: 'calibrated'
  },
  // Item 27: Distinguishing Fact from Opinion & Informed Judgment (CEFR B1 / Lexile 750L)
  {
    id: 'ITEM-ENG-027',
    competency: 'language_literacy',
    skillId: 'SKILL-ENG-FACT-VS-OPINION',
    code: 'ENG-027',
    prompt: 'Which statement represents an objectively verifiable factual statement rather than a value judgment or subjective opinion?',
    explanation: 'The speed of light in vacuum is an empirically verifiable physical constant measured under universal SI standards, whereas "greatest", "most entertaining", and "unfair" express subjective value judgments.',
    options: [
      { id: 'opt-a', text: 'Classical symphonic music is undeniably the greatest artistic achievement of European history.' },
      { id: 'opt-b', text: 'The speed of light in a vacuum is approximately 299,792 kilometers per second.' },
      { id: 'opt-c', text: 'Documentaries about deep-sea creatures are far more entertaining than science fiction films.' },
      { id: 'opt-d', text: 'High school graduation examinations are inherently unfair to creative thinkers.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Classical symphonic music is undeniably the greatest artistic achievement of European history.', misconceptionCode: 'MISC_VALUE_JUDGMENT_AS_FACT', misconceptionDescription: 'Mistook emphatic language ("undeniably") for objective empirical fact.' },
      { id: 'opt-c', text: 'Documentaries about deep-sea creatures are far more entertaining than science fiction films.', misconceptionCode: 'MISC_PREFERENCE_AS_FACT', misconceptionDescription: 'Treated personal subjective entertainment preference as fact.' },
      { id: 'opt-d', text: 'High school graduation examinations are inherently unfair to creative thinkers.', misconceptionCode: 'MISC_OPINION_AS_FACT', misconceptionDescription: 'Treated philosophical complaint as an empirical truth.' }
    ],
    irt: { a: 1.25, b: -0.9, c: 0.25 },
    ageBand: [10, 15],
    status: 'calibrated'
  },
  // Item 28: Complex Punctuation (Em-Dashes for Emphasis) (CEFR B2 / Lexile 900L)
  {
    id: 'ITEM-ENG-028',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-DASH-PUNCTUATION',
    code: 'ENG-028',
    prompt: 'What is the primary rhetorical purpose of using paired em-dashes (—) in the sentence: "The rover\'s backup navigation engine—an untested assembly of surplus micro-thrusters—ignited on the second command"?',
    explanation: 'Em-dashes set off an abrupt, emphatic parenthetical interruption or non-restrictive appositive with greater dramatic emphasis than mild commas or detached parentheses.',
    options: [
      { id: 'opt-a', text: 'To indicate that words have been deleted from a historical quotation' },
      { id: 'opt-b', text: 'To emphasize an abrupt, informative descriptive interruption inside the clause' },
      { id: 'opt-c', text: 'To show that the speaker was interrupted by an incoming phone call' },
      { id: 'opt-d', text: 'To connect two independent sentences that share zero conceptual relation' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'To indicate that words have been deleted from a historical quotation', misconceptionCode: 'MISC_CONFUSED_WITH_ELLIPSIS', misconceptionDescription: 'Confused em-dashes with ellipsis marks (...).' },
      { id: 'opt-c', text: 'To show that the speaker was interrupted by an incoming phone call', misconceptionCode: 'MISC_LITERAL_INTERRUPTION', misconceptionDescription: 'Interpreted literary punctuation as a literal telecommunication disruption.' },
      { id: 'opt-d', text: 'To connect two independent sentences that share zero conceptual relation', misconceptionCode: 'MISC_INCORRECT_GRAMMAR_PURPOSE', misconceptionDescription: 'Dashes cannot arbitrarily join unrelated sentences.' }
    ],
    irt: { a: 1.30, b: 0.05, c: 0.25 },
    ageBand: [11, 16],
    status: 'calibrated'
  },
  // Item 29: Decoding Irony & Satirical Sarcasm in Editorial Columns (CEFR C1 / Lexile 1250L)
  {
    id: 'ITEM-ENG-029',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-SATIRE-DECODING',
    code: 'ENG-029',
    prompt: 'In a satire essay criticizing excessive consumer smartphone upgrades, the author writes: "Surely, humanity cannot possibly survive another quarter without titanium chamfered edges and eighteen additional camera filters." What underlying critique does the author express?',
    explanation: 'The hyperbolic assertion that human survival hinges on cosmetic smartphone features uses verbal irony to mock the triviality and consumer manipulation of annual gadget upgrade cycles.',
    options: [
      { id: 'opt-a', text: 'Human biological evolution requires titanium tools to survive climate shifts.' },
      { id: 'opt-b', text: 'Annual smartphone hardware upgrades are largely trivial cosmetic marketing gimmicks rather than vital necessities.' },
      { id: 'opt-c', text: 'Smartphones currently possess too few camera lenses to accurately document nature.' },
      { id: 'opt-d', text: 'The author is genuinely terrified of older telephone models.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Human biological evolution requires titanium tools to survive climate shifts.', misconceptionCode: 'MISC_LITERAL_READING_OF_SARCASM', misconceptionDescription: 'Interpreted hyperbolic sarcasm literally.' },
      { id: 'opt-c', text: 'Smartphones currently possess too few camera lenses to accurately document nature.', misconceptionCode: 'MISC_SURFACE_POLARITY_INVERSION', misconceptionDescription: 'Missed the satirical critique of excessive camera lenses.' },
      { id: 'opt-d', text: 'The author is genuinely terrified of older telephone models.', misconceptionCode: 'MISC_EMOTIONAL_LITERALISM', misconceptionDescription: 'Interpreted rhetorical mock-panic as real emotional distress.' }
    ],
    irt: { a: 1.50, b: 1.3, c: 0.20 },
    ageBand: [13, 18],
    status: 'calibrated'
  },
  // Item 30: Evaluating Deductive Syllogisms & Soundness (CEFR C1 / Lexile 1200L)
  {
    id: 'ITEM-ENG-030',
    competency: 'verbal_reasoning',
    skillId: 'SKILL-ENG-SYLLOGISMS',
    code: 'ENG-030',
    prompt: 'Analyze this deductive argument: "Premise 1: All birds possess feathers. Premise 2: A bat possesses wings. Conclusion: Therefore, a bat is a bird." What is the fundamental logical flaw in this argument?',
    explanation: 'The argument commits the fallacy of the undistributed middle (affirming the consequent through a false attribute): possessing wings was never stated as an exclusive property of birds, and bats possess wings without feathers.',
    options: [
      { id: 'opt-a', text: 'Premise 1 is factually false because penguins do not have feathers.' },
      { id: 'opt-b', text: 'The conclusion is invalid because Premise 1 mentions feathers, while Premise 2 mentions wings; wings were never established as exclusive to birds.' },
      { id: 'opt-c', text: 'The argument is logically sound and valid in formal philosophical deduction.' },
      { id: 'opt-d', text: 'Premise 2 is false because bats are reptiles.' }
    ],
    correctOptionId: 'opt-b',
    distractors: [
      { id: 'opt-a', text: 'Premise 1 is factually false because penguins do not have feathers.', misconceptionCode: 'MISC_BIOLOGICAL_MISCONCEPTION', misconceptionDescription: 'Penguins are birds and indeed possess dense insulating feathers.' },
      { id: 'opt-c', text: 'The argument is logically sound and valid in formal philosophical deduction.', misconceptionCode: 'MISC_FALSE_VALIDITY_ERROR', misconceptionDescription: 'Failed to spot the term mismatch between feathers and wings.' },
      { id: 'opt-d', text: 'Premise 2 is false because bats are reptiles.', misconceptionCode: 'MISC_ANIMAL_CLASSIFICATION_ERROR', misconceptionDescription: 'Bats are mammals, not reptiles.' }
    ],
    irt: { a: 1.45, b: 1.15, c: 0.20 },
    ageBand: [12, 18],
    status: 'calibrated'
  }
];
