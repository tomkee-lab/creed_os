# **Strategic Architecture and Implementation Roadmap for Core\_OS: Global STEM Benchmarking and Adaptive Educational Pathways**

The transition of the Core\_OS educational platform from a Minimum Viable Product (MVP) to a production-ready, globally scalable architecture represents a fundamental paradigm shift in learner intelligence. Modern educational ecosystems are systematically moving away from high-stakes, monolithic testing paradigms toward continuous, competency-based assessment frameworks. This transition is evidenced globally by initiatives such as the PARAKH Holistic Progress Card (HPC) under India's National Education Policy (NEP) 2020, which abandons rote evaluation in favor of multi-dimensional competency tracking1.  
To prepare the project for shipping, the platform architecture must seamlessly integrate the "Three Education Stages" (Preparatory, Middle, and Secondary) while offering a robust, adaptive self-assessment diagnostic tool for students and parents4. This diagnostic tool must accurately benchmark students against global peers utilizing verified data from premier international STEM and robotics networks. Furthermore, the platform must adopt advanced, fluid educational routing frameworks, drawing heavily from the architectural logic of Singapore’s Full Subject-Based Banding (Full SBB) system, to guide students through constructive pathway mismatches rather than relying on deterministic exclusion4. The following comprehensive report details the technical, pedagogical, and strategic blueprint required to finalize the Core\_OS architecture and successfully launch the platform into the global market.

## **1\. Architectural Integration of the Three Education Stages**

The Core\_OS platform is explicitly structured to support the developmental continuum of learners spanning ages 8 to 18\. The platform's evidence graph maps directly to modern global educational frameworks, including the OECD Learning Compass 2030 and the newly mandated Central Board of Secondary Education (CBSE) Artificial Intelligence curriculum frameworks for the 2026-2027 academic session5.

### **1.1 The Preparatory Stage (Classes 3 to 5 / Ages 8 to 11\)**

The Preparatory Stage focuses on formative learning, play, discovery, and foundational language literacy4. Within the context of STEM and Artificial Intelligence, the pedagogical consensus explicitly warns against premature exposure to complex programming syntax or heavy screen dependency. Instead, the curriculum focuses on foundational Computational Thinking (CT).  
According to the latest CBSE curriculum frameworks launched via Circular Acad-15/2026, schools are instructed to integrate approximately 50 hours of CT into existing subjects, primarily Mathematics and Environmental Science (The World Around Us)9. The Core\_OS self-assessment module for this cohort evaluates abstraction, pattern recognition, and decomposition. Students are assessed on their ability to visualize three-dimensional shapes from two-dimensional nets, predict spatial rotations, and decode simple repeating number or shape patterns10. The assessment environment captures psychometric evidence through highly visual, low-stress diagnostic items that operate as interactive discovery challenges, fully aligning with the platform's overarching "Calm Intelligence" design philosophy12.

### **1.2 The Middle Stage (Classes 6 to 8 / Ages 11 to 14\)**

The Middle Stage introduces abstract concepts across the sciences, mathematics, humanities, and social sciences4. Cognitively, learners in this bracket possess the executive function required to bridge the gap between abstract computational thinking and applied technological systems.  
The curriculum alignment for Core\_OS at this stage dictates the execution of approximately 100 instructional hours of AI literacy and interdisciplinary projects10. The assessment engine tests learners on foundational AI paradigms, requiring them to differentiate between rule-based automation and genuine artificial intelligence. Students are evaluated on their comprehension of supervised learning, unsupervised learning, and reinforcement learning, alongside critical ethical considerations surrounding data bias, digital footprints, and privacy11. Furthermore, this stage introduces applied robotics contexts, assessing the foundational logic utilized in regional robotics qualifiers. This includes testing an understanding of sensor feedback loops and autonomous navigation logic, which form the bedrock of challenges in the FIRST LEGO League (FLL) or the VEX IQ Robotics Competition (VIQRC)4.

### **1.3 The Secondary Stage (Classes 9 to 12 / Ages 14 to 18\)**

The Secondary Stage emphasizes multidisciplinary study, critical thinking, maximal flexibility in subject choices, and rigorous preparation for post-secondary academic and vocational pathways4. At this developmental juncture, STEM and AI transition from embedded concepts into formal, assessed academic disciplines.  
The Core\_OS evidence engine aligns with advanced technical curricula, such as CBSE Subject Codes 417 (for Classes 9-10) and 843 (for Classes 11-12), testing students on applied Python programming, machine learning algorithm deployment, natural language processing (NLP) fundamentals, and computer vision8. Assessments at this level are highly technical, designed to simulate the real-world engineering constraints mirroring premier international arenas like the FIRST Robotics Competition (FRC) or the World Robot Olympiad (WRO)4. The system transitions into a sophisticated career navigation compass, continuously verifying prerequisite readiness for university admissions or applied polytechnic diploma routes6.

## **2\. Advanced Psychometrics and Computerized Adaptive Testing (CAT)**

To provide a globally benchmarked self-assessment tool that guarantees both precision and psychological safety, the Core\_OS architecture explicitly rejects classical test theory. Classical test theory, which relies on simple percentage scores, fails to account for the varying difficulties of test items and often penalizes students unfairly15. Instead, the platform employs Item Response Theory (IRT), utilizing the 3-Parameter Logistic (3PL) model combined with advanced Computerized Adaptive Testing (CAT) algorithms15.

### **2.1 The 3-Parameter Logistic (3PL) IRT Framework**

In the deterministic scoring engine utilized by Core\_OS, the probability ![][image1] that a learner with a latent ability ![][image2] will correctly answer a specific assessment item ![][image3] is calculated dynamically using the following logistic function:  
![][image4]  
The parameters in this model ensure rigorous evaluation independent of the specific questions asked. The variable ![][image2] represents the learner's latent ability on a standard normal scale, typically normalized across a global reference cohort15. The item discrimination parameter, ![][image5], dictates how effectively the question separates advanced learners from novices by defining the slope of the item response function15. The item difficulty parameter, ![][image6], marks the point on the ability continuum where the probability of a correct response is midway between the guessing floor and absolute certainty15. Finally, the pseudo-guessing parameter, ![][image7], represents the lower asymptote of the curve, accounting for the probability that a learner with very low ability might answer correctly simply by guessing, which is crucial for multiple-choice formatting15.

### **2.2 Expected A Posteriori (EAP) and Time-Weighted Integrations**

When a student initiates a self-assessment session within the Core\_OS application, they are not presented with a static, pre-compiled examination. The CAT engine selects the initial item based on the learner's age bracket and historical competency profile. Following each response, the server instantaneously recalculates the learner's ability utilizing Expected A Posteriori (EAP) numerical quadrature, evaluating the integral over 41 Gauss-Hermite quadrature nodes to ensure computational stability without infinite singularities15.  
The system utilizes the Fisher Information Function to mathematically select the next optimal question, maximizing diagnostic precision at the student's current estimated ability level15. To prevent overexposure of high-information questions—which could compromise the integrity of the item bank—the Sympson-Hetter exposure control algorithm is applied15.  
Furthermore, the architecture integrates modern Time-Weighted Difficulty (TWD-IRT) and Normalized Response Time (NRT-IRT) models. These models incorporate response time (![][image8]) as a multiplicative factor against the ability-difficulty interaction, acknowledging that the time a student spends deliberating on a complex robotics logic puzzle provides distinct cognitive insights beyond mere correctness20. The assessment terminates dynamically when the Standard Error of Measurement (![][image9]) drops below 0.32, or after a maximum constraint of 15 items is reached, preventing cognitive fatigue and preserving the platform's non-anxious environment15.

### **2.4 Neural CAT (NCAT) and Deep Learning Selectors**

Looking beyond traditional algorithms, the production-ready system scaffolds integration for Neural Computerized Adaptive Testing (NCAT). NCAT frames the selection algorithm as a reinforcement learning problem, utilizing deep learning models to predict question selection scores based on complex, non-linear student-question interactions rather than relying solely on handcrafted statistical heuristics18. This hybrid Neural-IRT framework is particularly effective at addressing cold-start challenges for new users entering the platform18.

## **3\. Global STEM, Robotics, and AI Benchmarking Ecosystems**

To accurately benchmark a student's standing against their global peers, Core\_OS integrates empirical performance criteria extracted from the world's premier robotics ecosystems, regional K-12 leagues, and global STEM policy organizations4.

### **3.1 International Robotics Tournaments as Assessment Anchors**

Global robotics competitions provide the ultimate applied task environments. By evaluating the rubrics of these championships, the platform derives Level 4 (Applied Task) and Level 5 (Longitudinal) evidence for the Learner Evidence Graph5.

| Competition Ecosystem | Organizing Entity | Target Age Bracket | Core Benchmarking Focus |
| :---- | :---- | :---- | :---- |
| **FIRST LEGO League (FLL)** | FIRST® | Classes 3–8 | Autonomous programming via LEGO SPIKE Prime, themed field missions, and presentation of a researched innovation project4. |
| **FIRST Tech Challenge (FTC)** | FIRST® | Classes 7–12 | Design and coding of complex robots using Android-based systems and reusable aluminum matrices in an alliance format4. |
| **FIRST Robotics Competition (FRC)** | FIRST® | Classes 9–12 | Industrial-scale engineering (125-pound robots), strict resource constraints, advanced kinematics, and team-based mechanical fabrication4. |
| **VEX IQ (VIQRC)** | REC Foundation | Classes 3–8 | Collaborative teamwork matches and individual driver/coding skills utilizing snap-together plastic frameworks4. |
| **VEX V5 (V5RC)** | REC Foundation | Classes 9–12 | Utilization of metal structural elements and advanced microcontrollers for dynamic 2v2 alliance strategy games4. |
| **World Robot Olympiad (WRO)** | WRO Association | Classes 3–12+ | High academic rigor; the RoboMission track requires teams to fully assemble and program autonomous robots without instructions4. |
| **RoboCup Junior** | RoboCup Federation | Classes 4–12 | Pure AI autonomy encompassing autonomous robotic soccer and disaster-response maze navigation4. |
| **Zero Robotics** | MIT, NASA, CASIS | Classes 6–12 | Space programming where students write code to control real micro-satellites aboard the International Space Station4. |
| **Botball** | KIPR | Classes 6–12 | Pure autonomy focusing exclusively on AI and coding, with no human remote-driving permitted during matches4. |

### **3.2 Domestic Ecosystems and Grassroots Integration**

In emerging technology markets such as India, benchmarking algorithms must account for massive local ecosystems that serve as the primary entry point for millions of students. The India STEM Foundation (ISF) facilitates international pathways like WRO and FLL at the national level, establishing "Robo Siksha Kendra" labs aligned with NEP 2020 tinkering frameworks4.  
Furthermore, massive domestic competitions serve as critical data ingestion points for the Core\_OS platform:

* **TechRadiance World Cup:** Organized in association with E-Cell IIT Delhi, this national championship offers specific competitive tracks in Line Follower robots, Mini Humanoid operation, and intensive Coding Hackathons for students from Class 3 to university level25.  
* **Avishkaar League:** Recognized as Asia's largest robotics and game design challenge, it features complex manual and autonomous hybrid tasks under shifting annual themes (e.g., "Code of Duty" or "MAYDAY"), demanding high levels of strategic stacking and resource harvesting24.  
* **Atal Tinkering Labs (ATL) Marathon:** Orchestrated by NITI Aayog, this initiative fosters grassroots innovation across thousands of Indian schools, requiring students to submit functional prototypes addressing national challenges29.

### **3.3 Organizational Standards and Objective Measurement**

To normalize the diverse datasets generated by disparate competitions, Core\_OS cross-references competencies with standards published by global governmental and non-profit bodies. This includes the UNESCO International Institute for STEM Education (IISTEM) in Shanghai, which promotes collaborative policy research, and STEM Inc in Singapore, which embeds real-world industrial partnerships into applied learning programs4.  
Crucially, the physical performance of robots in these competitions is translated into digital psychometric data using frameworks established by the IEEE Robotics and Automation Society (RAS). Specifically, the Technical Committee on Performance Evaluation and Benchmarking of Robotic and Automation Systems (TC-PEBRAS) provides guidelines for objective measurement22. By analyzing data against NIST task board standards, the platform evaluates both attribute data (pass/fail completion of an autonomous task) and continuous data (time to completion). Utilizing statistical models like the Kolmogorov-Smirnov test and Analysis of Variance (ANOVA), the platform can accurately benchmark whether a student's robotic solution demonstrates statistically significant superiority over a global baseline33.

## **4\. Sample Diagnostic Assessment Items**

To operationalize the self-assessment tool, the platform relies on an expansive item bank mapped to the specific competency frameworks and misconception taxonomies discussed previously15. The following table presents a representative sample of adaptive questions designed to evaluate students across the Three Education Stages, testing their global ranking in STEM, robotics logic, and AI comprehension.

| Stage | Competency Domain | Question Stem | Options & Misconception Codes |
| :---- | :---- | :---- | :---- |
| **Preparatory** (Class 3-5) | Algorithmic Thinking | A robot vacuum must clean a ![][image10] grid. It starts at the bottom-left facing North. It obeys the sequence: \[MOVE FORWARD 2, TURN RIGHT, MOVE FORWARD 1\]. Where does it end up? | **A)** Top-middle (Correct) **B)** Top-left (MISC\_TURN\_OMISSION) **C)** Middle-right (MISC\_DISTANCE\_ERROR) **D)** Bottom-right (MISC\_DIRECTION\_INVERSION) |
| **Preparatory** (Class 3-5) | Pattern Recognition | Observe the gear train: Gear A (10 teeth) turns clockwise, driving Gear B (20 teeth). What is the state of Gear B? | **A)** Counter-clockwise, half speed (Correct) **B)** Clockwise, half speed (MISC\_ROTATION\_INVERSION) **C)** Counter-clockwise, double speed (MISC\_RATIO\_INVERSION) **D)** Clockwise, double speed (MISC\_COMPOUND\_ERROR) |
| **Middle** (Class 6-8) | AI Fundamentals | You want to train an AI to sort recycling from trash on a conveyor belt. You provide it with 5,000 labeled images of plastic bottles and apple cores. What type of machine learning is this? | **A)** Supervised Learning (Correct) **B)** Unsupervised Learning (MISC\_AI\_PARADIGM\_CONFUSION) **C)** Reinforcement Learning (MISC\_AI\_PARADIGM\_CONFUSION) **D)** Procedural Automation (MISC\_AI\_VS\_AUTOMATION) |
| **Middle** (Class 6-8) | Sensor Logic | An autonomous rover uses an ultrasonic sensor to avoid walls. The sensor reads ![][image11]. The motor code executes reverse(2\_sec) then turn\_left(90\_deg). If the rover gets stuck in a corner, what is the logical flaw? | **A)** It assumes the left is always clear (Correct) **B)** The sensor range is too short (MISC\_HARDWARE\_BLAME) **C)** It reversed for too long (MISC\_VARIABLE\_MISJUDGMENT) **D)** The motors lack sufficient torque (MISC\_DOMAIN\_CONFUSION) |
| **Secondary** (Class 9-12) | Kinematics & Physics | A 120-pound FRC robot needs to climb a vertical chain. The lifting winch has a radius of ![][image12]. What is the minimum torque required by the motor to hold the robot stationary, ignoring friction? | **A)** 240 in-lbs (Correct) **B)** 60 in-lbs (MISC\_DIVISION\_INSTEAD\_OF\_MULTIPLICATION) **C)** 120 in-lbs (MISC\_RADIUS\_OMISSION) **D)** 480 in-lbs (MISC\_DIAMETER\_CONFUSION) |
| **Secondary** (Class 9-12) | Computational Vision | When designing a computer vision pipeline using OpenCV to track a yellow WRO game element, why is it preferable to convert the image from BGR color space to HSV before thresholding? | **A)** HSV isolates color hue from lighting intensity (Correct) **B)** BGR requires significantly more RAM (MISC\_RESOURCE\_FALLACY) **C)** HSV automatically detects circular shapes (MISC\_CV\_FUNCTION\_CONFUSION) **D)** Webcams natively capture images in HSV (MISC\_HARDWARE\_NATIVE\_FORMAT) |

## **5\. Pathway Navigation via the Singapore Full SBB Framework**

Traditional guidance platforms present careers as flat catalogs and utilize aptitude tests that permanently label students, leading to severe parental anxiety and the premature foreclosure of viable futures5. Core\_OS fundamentally redesigns this process by modeling career pathways as Directed Acyclic Competency Graphs and employing a Constructive Mismatch Engine6. This architecture is deeply informed by the progressive pedagogical shifts observed in Singapore’s Full Subject-Based Banding (Full SBB) framework4.

### **5.1 Deconstructing Full SBB and the Abolition of Streaming**

Historically, educational systems relied heavily on rigid academic streaming—separating students into deterministic tracks (e.g., Express, Normal Academic, Normal Technical) that dictated the entirety of their academic difficulty level4. Recognizing the stigmatizing and limiting effects of this model, the Singapore Ministry of Education (MOE) completely abolished mid-year examinations and dismantled the 40-year-old streaming system by 20244.  
Under the Full SBB framework, subjects are customized based on individual strengths and offered at three specific tiers of difficulty:

* **G1 (General 1):** The foundational level, broadly equivalent to the former Normal Technical standard4.  
* **G2 (General 2):** The intermediate level, equivalent to the former Normal Academic standard4.  
* **G3 (General 3):** The most demanding academic level, equivalent to the former Express standard4.

### **5.2 PSLE Score Mapping and Initial Placement**

A student's initial G-level banding at the start of Secondary 1 is determined by their performance in the Primary School Leaving Examination (PSLE)4. The PSLE utilizes Achievement Levels (AL) ranging from AL1 (90-100 marks) to AL8 (below 20 marks) for each of the four core subjects. The final PSLE score is the sum of these four ALs, creating a possible range from 4 (the highest possible achievement) to 327.  
The Core\_OS platform incorporates a dynamic mapping engine that simulates this logic to determine initial pathway readiness. The mapping from PSLE scores to Secondary Posting Groups is structured as follows:

| PSLE AL Score Range | Secondary Posting Group | Initial Subject Level Distribution |
| :---- | :---- | :---- |
| **4 to 20** | Posting Group 3 | Most academic subjects are initiated at the highly demanding **G3** level7. |
| **21 to 22** | Option Band (PG 2 or 3\) | The family exercises agency, choosing to start most subjects at either **G2** or **G3** based on the child's readiness36. |
| **23 to 24** | Posting Group 2 | Most academic subjects are initiated at the intermediate **G2** level7. |
| **25** | Option Band (PG 1 or 2\) | The family exercises agency, choosing to start most subjects at either **G1** or **G2**7. |
| **26 to 30**\* | Posting Group 1 | Most subjects are initiated at the foundational **G1** level (\*requires an AL7 or better in both English and Mathematics)7. |

### **5.3 Fluid Movement and the Constructive Mismatch Algorithm**

The paramount innovation of Full SBB—and the core operating principle mirrored in the Core\_OS Mismatch Engine—is **Fluid Movement**. Students are no longer locked into their initial placements. A student placed in Posting Group 2 who demonstrates strong aptitude by scoring an AL5 or better in Mathematics at the PSLE is offered Mathematics at the G3 level from the very first day, even while their other subjects remain at G24. Furthermore, if a student demonstrates consistent improvement during school-based assessments, they can be progressively upgraded to a higher G-level tier mid-stream4.  
When a student utilizes the Core\_OS application and expresses a strong affinity for a demanding pathway such as "Robotics & Autonomous Systems," the system checks their Learner Evidence Graph against the pathway prerequisites. If a foundation gap exists (e.g., the student's Quantitative Reasoning is at Level 2.8, but the pathway requires Level 3.2, resulting in a ![][image13] of ![][image14]), the algorithm explicitly prevents rejection6. Instead, it generates a Constructive Mismatch Plan. It isolates the specific conceptual deficiency, prescribes a targeted 8-week mathematical foundation sprint, and provides "Try-Before-You-Choose" mini-missions to build empirical evidence of the student's grit and capability before permanent decisions are made5.

### **5.4 Simulating Post-Secondary Aggregates (SEC, ELMAB3, ELR2B2)**

To provide comprehensive guidance, the platform must simulate the long-term impact of subject-level choices on post-secondary admissions. By 2027, Singapore will completely replace the separate O-Level and N-Level qualifications with a unified Singapore-Cambridge Secondary Education Certificate (SEC), which will explicitly list the individual G-level at which each subject was examined4.  
The Core\_OS simulation engine accurately models the complex aggregate computations required for advanced education. For admission into Polytechnic diploma courses, the system calculates the ELR2B2 (English Language, 2 Relevant subjects, 2 Best subjects) net aggregate, which requires an aggregate score of 22 points or lower by 202839. For admission into the Institute of Technical Education (ITE) Higher Nitec programs, the engine calculates the ELMAB3 aggregate, requiring a gross score of 19 points or better39.  
Crucially, the system simulates downward grade mapping. If a student wishes to enter an engineering program but is overwhelmed by the rigor of G3 Physics, the simulation demonstrates that dropping to G2 Physics might actually improve their overall aggregate. The system maps G3 grades downward to G2 equivalents for ELMAB3 calculations, empowering students to make data-driven, strategic decisions regarding their academic load without succumbing to the anxiety of a single failing grade39.

## **6\. Affective Computing, AI Teamwork, and Mentorship**

The Core\_OS platform fundamentally redefines the interaction paradigm between Artificial Intelligence and the learner. Rather than functioning as a simplistic chatbot that hallucinates answers to homework, the AI acts as a collaborative teammate and a sophisticated Socratic mentor12.

### **6.1 Multimodal Engagement and Affective Telemetry**

Drawing extensively upon research published in the IEEE Transactions on Affective Computing, the application implements non-intrusive affective assessment protocols to monitor student engagement in real-time45. Engagement is recognized as a multicomponential state comprising behavioral, cognitive, and emotional dimensions46.  
High-stakes testing environments historically trigger severe cognitive load and negative emotional valence (such as anxiety and boredom), variables that strongly correlate with diminished academic performance and high dropout rates46. To counteract this, Core\_OS utilizes the interactive-constructive-active-passive (ICAP) framework46. By analyzing interaction metadata—such as time spent on diagnostic items, cursor velocity, and response latency patterns—the AI dynamically modulates the pacing of the CAT engine20. If the system's telemetry detects sustained negative emotional valence or cognitive fatigue, it autonomously pauses the academic assessment. To restore positive engagement, it pivots to a brief, hands-on physical robotics task or initiates a supportive dialogue, maintaining the psychological safety of the learner46.

### **6.2 The Socratic Voice Mentor and Ethical Governance**

The platform integrates Google Gemini Live WebSockets to power the Socratic Voice Mentor12. When a student encounters a failure point in a Python robotics script, the AI does not simply output the correct syntax. It queries the student's Evidence Graph, identifies their latent ability ![][image2], and utilizes guided inquiry to help the student logically decompose the error themselves, thereby fostering genuine skill acquisition and metacognition10.  
However, affective robotics and deep AI integration carry profound ethical responsibilities. Aligning with the IEEE P7000 series for ethically aligned design, the system is strictly constrained to avoid manipulative "nudging" or emotional deception50. Furthermore, to comply with the stringent requirements of the India Digital Personal Data Protection (DPDP) Act 2023 and COPPA, all voice telemetry is strictly ephemeral. Audio buffers are processed in volatile memory and purged instantaneously, leaving only a sanitized, structured text observation atom in the secure database49.

## **7\. System Architecture and Strict Governance**

To support global scalability, real-time psychometric calculations, and uncompromising privacy regulations, the MVP architecture must be upgraded to a highly resilient, strictly governed production environment.

### **7.1 The Technology Stack and Domain Driven Design**

The platform architecture utilizes a modern, strictly enforced monorepo topology:

* **Frontend Ecosystem:** Built on Svelte 5 and SvelteKit 2, ensuring rapid client hydration and robust offline Progressive Web App (PWA) capabilities, which are essential for classrooms with intermittent internet connectivity49.  
* **State Management:** The usage of Svelte 5 Runes (\$props(), \$state(), \$derived(), \$effect()) is strictly mandated. Any legacy reactivity syntax is aggressively rejected during the continuous integration (CI) pipeline54.  
* **Domain Logic:** Complex orchestrations—such as the CAT scoring algorithms, EAP ability recalculations, and pathway mismatch evaluations—are engineered using the Effect framework. This guarantees type-safe domain error handling and unshakeable transactional integrity across the server49.  
* **Background Orchestration:** The Trigger.dev engine manages durable asynchronous workflows. This includes the batch rendering of comprehensive PDF reports for parents and the overnight recalibration of psychometric item parameters across the global dataset12.  
* **Database Infrastructure:** Supabase (PostgreSQL 16\) serves as the persistent backbone. It leverages pgvector for high-speed AI Retrieval-Augmented Generation (RAG) and ltree extensions to query the deep hierarchical nodes of the competency graphs12.

### **7.2 The WAY 2.0 "Calm Intelligence" Design System**

Educational software is frequently plagued by gamified, consumer-casino UI patterns—such as flashing countdowns and neon drop shadows—that induce severe cognitive distraction. Core\_OS vehemently rejects this approach, enforcing the WAY 2.0 Design System, which marries Nordic Lagom principles with structural disciplines13.  
The UI governance mandates an Architectural Radius System, strictly enforcing 0px (rounded-none) geometries for all diagnostic frames, technical grids, and data tables to preserve a clinical, distraction-free environment13. Surface layering relies entirely on oklch semantic tokens to prevent flat canvas fatigue without resorting to harsh contrasts. Crucially, the platform operates on an Action-First UX philosophy; rather than overwhelming parents and teachers with dense, unprioritized metric dashboards, every interface presents clear context, plain-language translations of the data, and singular, evidence-backed next actions5.

### **7.3 Automated Codebase Governance via Greptile MCP**

To ensure these complex architectural invariants are maintained flawlessly across a distributed engineering team, Core\_OS integrates Greptile via the Model Context Protocol (MCP)54. Greptile indexes the entire monorepo into an AST-aware knowledge graph. During Pull Request reviews, the AI automatically verifies code against hard invariants, guaranteeing:

* Strict adherence to the pnpm package manager49.  
* Verification that all psychometric scoring logic remains entirely deterministic, actively preventing large language models from hallucinating or altering a student's calculated latent ability12.  
* Total compliance with the DPDP Act verifiable consent state machine52.

## **8\. Comprehensive Implementation and Shipping Roadmap**

To successfully pivot the project from its current MVP state to a globally scalable, shipped product, the engineering, psychometric, and pedagogical teams must execute the following structured roadmap.

### **Phase 1: Core Engine Stabilization and Psychometric Calibration (Weeks 1-4)**

The immediate priority is locking down the mathematical core. The 3PL IRT models and EAP estimation logic must be finalized within the Effect domain layer, ensuring sub-250ms response times for the CAT next-item selection15. The psychometric team will calibrate the initial item bank, establishing baseline discrimination and difficulty parameters across the Preparatory, Middle, and Secondary stages. Simultaneously, DevOps will deploy Greptile MCP hooks across all repositories to enforce the Svelte 5 runes and WAY 2.0 design invariants automatically13.

### **Phase 2: Pathway Ontology and Global Benchmarking Integration (Weeks 5-8)**

During this phase, the data engineering team will construct the Directed Acyclic Competency Graphs that represent post-secondary pathways, including Tier 1 university degrees and applied polytechnic apprenticeships6. The logic of the Singapore Full SBB framework will be deeply integrated into the Constructive Mismatch Engine, enabling accurate PSLE AL score mapping to G1/G2/G3 bands and the simulation of ELMAB3 aggregates7. Furthermore, API interfaces will be established to ingest rubric data from external global robotics competitions (such as FIRST, VEX, WRO, and the TechRadiance World Cup), transforming physical competition outcomes into validated Level 4/5 evidence for the Learner Graph4.

### **Phase 3: AI Mentorship, Affective Telemetry, and Content Generation (Weeks 9-12)**

The engineering team will implement the Gemini Live WebSockets architecture to power the Socratic Voice Mentor, ensuring that all audio buffers are ephemeral and purged immediately to comply with privacy laws49. The affective computing telemetry pipeline will be finalized, capturing non-intrusive engagement metrics (response latency, time-on-task) to trigger adaptive pauses and prevent cognitive fatigue during diagnostics46. The curriculum team will simultaneously populate the Diagnostic Misconception Taxonomy, mapping specific incorrect distractors to conceptual errors, enabling the AI mentor to deliver highly targeted Socratic remediation15.

### **Phase 4: Security Audit, DPDP Compliance, and Production Launch (Weeks 13-16)**

The final phase focuses entirely on security, compliance, and deployment. Independent security teams will conduct rigorous penetration testing on the PostgreSQL Row Level Security (RLS) policies and the Verifiable Parental Consent State Machine to ensure absolute adherence to the India DPDP Act and COPPA52. Following successful audits, the platform will initiate its production launch, rolling out the beta version to selected STEM academies and school networks via the enterprise subscription tier, synchronizing rosters via LTI 1.3 and OneRoster integrations5.  
Through the rigorous integration of item response theory, adaptive pathway mapping, global robotics benchmarking, and ethical affective computing, Core\_OS is positioned to fundamentally transform how learner intelligence is measured, interpreted, and utilized globally.

To support the developmental progression of Class 3 to 12 students, we should implement a progressively adapting, fully browser-based IDE architecture within the platform. This ensures compatibility with low-end school computers (like Chromebooks) and eliminates the need for heavyweight offline installations.

Here is how we can structure the K-12 programming harness:

* **Primary School (Classes 3–5):** We can integrate visual, block-based programming engines like Blockly or Scratch. This removes syntax barriers, allowing young learners to focus purely on sequential logic, loops, and basic sensor inputs.  
* **Middle School (Classes 6–8):** A hybrid, dual-pane environment is best for this stage, providing live bidirectional translation between block coding on one side and text-based Python or C++ on the other (similar to platforms like Vittascience or PictoBlox).  
* **Secondary School (Classes 9–12):** We can implement a professional text-based coding environment by embedding the Monaco Editor (the engine that powers VS Code) alongside an Xterm terminal. This strips away the blocks entirely to prepare students for real-world engineering.

**Core Technical Implementation:**

* **In-Browser Execution:** Instead of managing complex server-side code execution, we can integrate Pyodide, which compiles CPython to WebAssembly to run Python code instantly and directly inside the user's browser. For more advanced high school scenarios that require a real filesystem or external packages, we can utilize WebContainers to run a full Node-like stack client-side.  
* **Hardware Connectivity:** To allow our browser-based IDE to communicate with physical robotics kits (like Arduino, ESP32, or LEGO), we can leverage the Web Serial API and Web Bluetooth API. These modern APIs enable direct communication between the web browser and Bluetooth Low Energy (BLE) peripherals or serial ports, bypassing the need for native operating system drivers or downloadable desktop software.

Based on the research, here is the architecture for the K-12 browser-based robotics IDE using strictly open-source and free license software:

* **Execution & Interface:** The open-source `Pyodide` project can be used to run Python instantly within the browser via WebAssembly. For the text-based environment, the MIT-licensed `Monaco Editor` and `Xterm.js` can be combined to provide a professional coding and terminal experience.  
* **ESP32 & ESP8266 Microcontrollers:** We can integrate `esptool-js`, an official utility maintained by Espressif and licensed under Apache 2.0. It uses the Web Serial API to flash firmware directly from Google Chrome or Microsoft Edge without requiring any driver installations.  
* **Arduino Ecosystem:** The MIT-licensed `avrgirl-arduino` library allows the browser to flash compiled `.hex` sketch files directly to Arduino boards using Web Serial.  
* **Micro:bit & ARM Devices:** For CMSIS-DAP compatible devices like the BBC micro:bit, the open-source `dapjs` library can be utilized to flash hardware directly from the browser using WebUSB.  
* **Bluetooth Robotics:** The native Web Bluetooth API can be used to communicate with Bluetooth Low Energy (BLE) peripherals directly, provided the application is hosted in a secure HTTPS context.

# **Creed OS: K-12 Browser-Based Robotics IDE Implementation Guide**

This documentation outlines the integration of an open-source, fully browser-based Integrated Development Environment (IDE) into the Creed OS platform. This architecture eliminates the need for heavyweight desktop software, ensures cross-platform compatibility, and natively supports Chromebooks and other low-end school devices.

## **1\. Core Execution & Editor Architecture**

The coding interface relies entirely on client-side processing, utilizing WebAssembly and open-source web editors to handle code generation and execution securely in the browser.

* **Python Execution Sandbox:** The IDE integrates Pyodide (Version 314.0), which ports CPython to WebAssembly. Pyodide enables instant execution of Python scripts directly in the browser and operates within a Web Worker. This provides a secure sandbox environment with no direct access to the DOM, local storage, or external networks.  
* **Professional Text Editor:** For text-based programming (Middle and High School tiers), the platform embeds the MIT-licensed Monaco Editor to provide professional syntax highlighting and autocomplete capabilities.  
* **Integrated Terminal:** Alongside the Monaco Editor, the IDE utilizes Xterm.js to render an interactive, browser-based terminal for real-time debugging and command execution.

## **2\. Hardware Connectivity & Web APIs**

To communicate with physical robotics kits without requiring users to install native operating system drivers, the Creed OS IDE leverages modern browser hardware APIs.

### **ESP32 and ESP8266 Microcontrollers**

* **Library:** `esptool-js` (Version 0.5.6)  
* **License:** Apache 2.0 (Maintained by Espressif).  
* **Implementation:** This Javascript implementation utilizes the Web Serial API to automatically detect the chip and baud rate. It allows the browser to flash firmware, erase memory, and read chip IDs directly from Google Chrome (89+) or Microsoft Edge (89+).

### **Arduino Ecosystem (Uno, Mega, Nano)**

* **Library:** `avrgirl-arduino`  
* **License:** MIT License.  
* **Implementation:** This library is utilized to interact with Atmel AVR microchips. It enables the browser to flash compiled sketch files (like `.hex` files) directly to Arduino microcontroller boards.

### **BBC micro:bit & ARM Devices (CMSIS-DAP)**

* **Library:** `dapjs`  
* **Implementation:** For devices like the BBC micro:bit, the IDE integrates the `dapjs` JavaScript library, which relies on the WebUSB API to flash firmware and communicate with DAPLink-compatible devices directly through the browser.

### **Bluetooth Low Energy (BLE) Robotics**

* **API:** Native Web Bluetooth API  
* **Implementation:** For wireless robotic peripherals (such as balenaOS-powered Raspberry Pi devices), the IDE uses the Web Bluetooth API to act as a GATT Client. This allows the web app to scan for devices, read attributes, and write commands to the robot's GATT Server.  
* **Security Constraint:** The Web Bluetooth API strictly requires a secure HTTPS context to function.

## **3\. Staged User Interface Logic**

To adapt to the cognitive growth of K-12 students, the IDE UI must dynamically shift based on the student's grade level within Creed OS.

* **Primary School (Classes 3-5):** The UI presents a purely visual, blocks-based canvas (e.g., integrating Blockly). The system abstracts all complex Web Serial/WebUSB APIs, compiling the visual blocks into background scripts that flash to the robot upon clicking "Run."  
* **Middle School (Classes 6-8):** The UI transitions to a dual-pane mode. As students connect blocks on the left, the IDE dynamically generates the equivalent Python syntax via Pyodide in a read-only Monaco Editor on the right, bridging the gap between logic and syntax.  
* **High School (Classes 9-12):** The blocks are completely removed. Students are provided with a full Monaco Editor to write pure Python or C/C++. They must utilize the Xterm.js terminal for debugging and manually initiate firmware flashing workflows to their target microcontrollers.

To implement this browser-based IDE architecture in your SvelteKit 2 project, you will need to leverage Svelte 5's reactivity model (Runes) and handle all WebAssembly and hardware integrations strictly on the client side.

Here is the implementation plan for Creed OS:

**1\. Dependency Management** First, install the required open-source libraries into your SvelteKit environment: `npm install monaco-editor xterm esptool-js avrgirl-arduino dapjs` You will also need to include Pyodide. Since Pyodide relies on downloading WebAssembly binaries, it is generally recommended to fetch it dynamically via CDN on the client side rather than bundling it directly into your SvelteKit server build.

**2\. Managing the Staged UI with Svelte 5 Runes** Use Svelte 5 runes to manage the dynamic interface across the three K-12 stages. Create a centralized state file (e.g., `ide.svelte.js`) using the `$state()` rune to track the active grade tier (Primary, Middle, High), the current code payload, and the hardware connection status. This allows the UI to fluidly transition from a visual blocks canvas to a dual-pane setup, and finally to a full text editor, without losing the student's active code.

**3\. Pyodide Web Worker Integration** Executing Python via WebAssembly can block the main JavaScript thread. To keep the Creed OS interface responsive (Calm Intelligence), Pyodide must be offloaded to a dedicated Web Worker.

* Create a `pyodide.worker.js` file in your `static` directory.  
* Inside the worker, import Pyodide, initialize the runtime, and set up an event listener to receive code from your Svelte components.  
* The worker executes the Python code in its isolated sandbox (which securely restricts DOM and local storage access) and posts the output or runtime errors back to the main UI thread.

**4\. Client-Side Editor and Terminal Initialization** Monaco Editor and Xterm.js interact directly with the DOM and cannot be Server-Side Rendered (SSR) by SvelteKit.

* In your IDE Svelte component, create container `<div>` elements and bind them using `bind:this`.  
* Import the `browser` flag from `$app/environment`.  
* Use the `$effect()` rune to instantiate Monaco and Xterm only when `browser` is true and the component has successfully mounted on the client.

**5\. Hardware API Integration and Security Contexts** Browser security policies require that modern hardware APIs (Web Serial, WebUSB, and Web Bluetooth) are only triggered by explicit user gestures.

* Create distinct action buttons (e.g., "Flash Arduino" or "Connect ESP32") in your Svelte template.  
* Bind these buttons to asynchronous event handlers. Inside the handlers, instantiate your chosen open-source hardware libraries: use `esptool-js` (Apache 2.0) for Web Serial flashing, or `dapjs` for WebUSB ARM/micro:bit connections.  
* For wireless robotics, utilize the native Web Bluetooth API. You must ensure your SvelteKit production server enforces HTTPS, as Web Bluetooth is strictly restricted to secure contexts and will silently fail on standard HTTP connections.

#### **Works cited**

> 1. Holistic Progress Card (HPC), [https\://holistic-progress-card-hpc.vercel.app/](https://holistic-progress-card-hpc.vercel.app/)  
> 2. HOLISTIC PROGRESS CARD FOR FOUNDATIONAL STAGE, [https\://cbseacademic.nic.in/web\_material/Manuals/HPC\_TeacherGuide.pdf](https://cbseacademic.nic.in/web_material/Manuals/HPC_TeacherGuide.pdf)  
> 3. How Is the Holistic Progress Card (HPC) Transforming Student, [https\://www\.luneblaze.com/blogs/How-Is-the-Holistic-Progress-Card-(HPC)-Transforming-Student-Assessment-in-India](https://www.luneblaze.com/blogs/How-Is-the-Holistic-Progress-Card-\(HPC\)-Transforming-Student-Assessment-in-India)  
> 4. API\_SPEC.md  
> 5. PRODUCT\_SPEC.md  
> 6. PATHWAY\_GRAPH.md  
> 7. PSLE AL Score and Posting Groups Explained (2026), [https\://sg.theasianparent.com/secondary-school-posting-from-2024](https://sg.theasianparent.com/secondary-school-posting-from-2024)  
> 8. CBSE AI Curriculum 2026: Class 3 to 12 Explained \- LittleAIMaster, [https\://littleaimaster.com/blog/cbse-ai-curriculum-2026](https://littleaimaster.com/blog/cbse-ai-curriculum-2026)  
> 9. New CBSE AI Curriculum 2026-27: What Parents Need to Know, [https\://scotle.org/blog/cbse-ai-curriculum-2026-27/](https://scotle.org/blog/cbse-ai-curriculum-2026-27/)  
> 10. CBSE Computational Thinking & AI Curriculum 2026–27, [https\://codju.com/blog/cbse-computational-thinking-ai-curriculum-2026-27/](https://codju.com/blog/cbse-computational-thinking-ai-curriculum-2026-27/)  
> 11. CBSE Launches Mandatory CT & AI Curriculum for Classes 3–8, [https\://thinkingjuggernaut.in/blog/cbse-computational-thinking-ai-curriculum-classes-2026-27](https://thinkingjuggernaut.in/blog/cbse-computational-thinking-ai-curriculum-classes-2026-27)  
> 12. CREED\_OS\_AUDIT.md  
> 13. DESIGN\_SYSTEM.md  
> 14. CBSE Proposes New AI Curriculum in Academic Year 2026-27 for, [https\://thestempedia.com/blog/cbse-proposes-new-ai-curriculum-in-academic-year-2026-27-for-class-3-onwards-ncert-to-review/](https://thestempedia.com/blog/cbse-proposes-new-ai-curriculum-in-academic-year-2026-27-for-class-3-onwards-ncert-to-review/)  
> 15. PSYCHOMETRICS\_CAT.md  
> 16. Item Response Theory | Columbia University Mailman School of, [https\://www\.publichealth.columbia.edu/research/population-health-methods/item-response-theory](https://www.publichealth.columbia.edu/research/population-health-methods/item-response-theory)  
> 17. Test Quality Assessment and Adaptive Algorithm Based on IRT Models, [https\://pdfs.semanticscholar.org/b23f/321ad50f8309d34d3206fbd0ad33d64a5379.pdf](https://pdfs.semanticscholar.org/b23f/321ad50f8309d34d3206fbd0ad33d64a5379.pdf)  
> 18. Survey of Computerized Adaptive Testing: A Machine Learning, [https\://www\.semanticscholar.org/paper/Survey-of-Computerized-Adaptive-Testing%3A-A-Machine-Yan-Liu/b3cd932a8d29e8dbeec4f5d4193a1050d0196c0d](https://www.semanticscholar.org/paper/Survey-of-Computerized-Adaptive-Testing%3A-A-Machine-Yan-Liu/b3cd932a8d29e8dbeec4f5d4193a1050d0196c0d)  
> 19. Item Response Theory: a Tutorial \- RPubs, [https\://rpubs.com/fferrero/IRT\_Tutorial](https://rpubs.com/fferrero/IRT_Tutorial)  
> 20. Enhancing Ability Estimation with Time-Sensitive IRT Models in, [https\://www\.mdpi.com/2076-3417/15/13/6999](https://www.mdpi.com/2076-3417/15/13/6999)  
> 21. Neural Computerized Adaptive Testing for Online Education, [http\://staff.ustc.edu.cn/\~qiliuql/files/Publications/Yan-Zhuang-AAAI22.pdf](http://staff.ustc.edu.cn/~qiliuql/files/Publications/Yan-Zhuang-AAAI22.pdf)  
> 22. Activities \- IEEE Robotics and Automation Society Website, [https\://www\.ieee-ras.org/performance-evaluation/activities/](https://www.ieee-ras.org/performance-evaluation/activities/)  
> 23. EVIDENCE\_ENGINE.md  
> 24. What is Aavishkar Robotics IRC League 2025? A Complete Guide, [https\://thestemmakers.com/aavishkar-robotics-irc-league-2025-guide/](https://thestemmakers.com/aavishkar-robotics-irc-league-2025-guide/)  
> 25. Techradiance: Robotics, AI & STEM Lab Setup for Schools, [https\://techradiance.in/](https://techradiance.in/)  
> 26. Students Robotics & Coding Championship 2026-27 \- Techradiance, [https\://techradiance.in/coding-robotics-championship-for-students/](https://techradiance.in/coding-robotics-championship-for-students/)  
> 27. Robotics Championship & Junior World Cup 2027 \- Techradiance, [https\://techradiance.in/robotics-championship/](https://techradiance.in/robotics-championship/)  
> 28. Largest international Robotics, Coding, AI ... \- Avishkaar League 2026, [https\://community.avishkaar.cc/avishkaar-league-2026](https://community.avishkaar.cc/avishkaar-league-2026)  
> 29. ATL Guidelines and Important Information \- AIM, [https\://aim.gov.in/atl-guidelines-and-important-information.php](https://aim.gov.in/atl-guidelines-and-important-information.php)  
> 30. atal tinkering marathon \- AIM, [https\://aim.gov.in/atal-tinkering-marathon.php](https://aim.gov.in/atal-tinkering-marathon.php)  
> 31. Atal Tinkering Labs | ATL | AIM, [https\://aim.gov.in/atl.php](https://aim.gov.in/atl.php)  
> 32. Performance Evaluation and Benchmarking of Robotic and, [https\://tsapps.nist.gov/publication/get\_pdf.cfm?pub\_id=904622](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=904622)  
> 33. Performance Measurement and Benchmarking Robotic Assembly, [https\://www\.nist.gov/document/testmethod-metrics-analysisv3pdf](https://www.nist.gov/document/testmethod-metrics-analysisv3pdf)  
> 34. G2 vs G3 Grading System & Subject Levels: Full SBB Guide, [https\://ancourage.academy/articles/g2-vs-g3-subject-levels-full-sbb-guide](https://ancourage.academy/articles/g2-vs-g3-subject-levels-full-sbb-guide)  
> 35. Understanding the PSLE Scoring System | Beginner's Guide, [https\://www\.unitedlisen.edu.sg/understanding-the-psle-scoring-system/](https://www.unitedlisen.edu.sg/understanding-the-psle-scoring-system/)  
> 36. What Does My Child's Secondary Posting Mean? \- Blue3 Academy, [https\://blue3academy.com/what-does-my-childs-secondary-posting-mean/](https://blue3academy.com/what-does-my-childs-secondary-posting-mean/)  
> 37. What are posting groups \- Singapore \- MOE, [https\://www\.moe.gov.sg/secondary/s1-posting/how-to-choose/what-are-posting-groups](https://www.moe.gov.sg/secondary/s1-posting/how-to-choose/what-are-posting-groups)  
> 38. What you need to know about full subject-based banding \- CNA, [https\://www\.channelnewsasia.com/singapore/full-subject-based-banding-secondary-school-posting-groups-express-normal-streams-3315171](https://www.channelnewsasia.com/singapore/full-subject-based-banding-secondary-school-posting-groups-express-normal-streams-3315171)  
> 39. Curriculum for secondary schools \- Singapore \- MOE, [https\://www\.moe.gov.sg/secondary/schools-offering-full-sbb](https://www.moe.gov.sg/secondary/schools-offering-full-sbb)  
> 40. Secondary Education Certificate (SEC) | Singapore Examinations, [https\://www\.seab.gov.sg/secondary-education-certificate-sec/](https://www.seab.gov.sg/secondary-education-certificate-sec/)  
> 41. SEC 2027 Explained: The Exam Replacing O-Levels, [https\://thesingaporesyllabus.com/blog/sec-2027-replaces-o-level-explained](https://thesingaporesyllabus.com/blog/sec-2027-replaces-o-level-explained)  
> 42. Full Subject Based Banding (SBB) \- Complete Guide | G1 G2 G3, [https\://mathtutor.com.sg/subject-based-banding/](https://mathtutor.com.sg/subject-based-banding/)  
> 43. ELR2B2 Calculator 2026 — Polytechnic Course Match by COP, [https\://sgschoolkaki.com/calculator/elr2b2](https://sgschoolkaki.com/calculator/elr2b2)  
> 44. SECONDARY 1 AND 2 (FSBB COHORTS), [https\://www\.peicaisec.moe.edu.sg/student-development/education-and-career-guidance/ecg-s1-and-s2/](https://www.peicaisec.moe.edu.sg/student-development/education-and-career-guidance/ecg-s1-and-s2/)  
> 45. Past, Present, and Future: A Survey of the Evolution of Affective, [https\://www\.computer.org/csdl/journal/ta/2026/02/10993310/26y4jG3qlMI](https://www.computer.org/csdl/journal/ta/2026/02/10993310/26y4jG3qlMI)  
> 46. Engagement Detection and Its Applications in Learning, [https\://www\.colorado.edu/research/ai-institute/sites/default/files/attached-files/booth\_et\_al.\_-\_2023\_-\_engagement\_detection\_and\_its\_applications\_in\_learn.pdf](https://www.colorado.edu/research/ai-institute/sites/default/files/attached-files/booth_et_al._-_2023_-_engagement_detection_and_its_applications_in_learn.pdf)  
> 47. Automatic engagement estimation in smart education/learning settings, [https\://pmc.ncbi.nlm.nih.gov/articles/PMC9660128/](https://pmc.ncbi.nlm.nih.gov/articles/PMC9660128/)  
> 48. Advancing Emotionally Aware Child–Robot Interaction with ... \- MDPI, [https\://www\.mdpi.com/1424-8220/25/4/1161](https://www.mdpi.com/1424-8220/25/4/1161)  
> 49. ARCHITECTURE.md  
> 50. ETHICALLY ALIGNED DESIGN \- IEEE Standards Association, [http\://standards.ieee.org/wp-content/uploads/import/documents/other/ead\_v2.pdf](http://standards.ieee.org/wp-content/uploads/import/documents/other/ead_v2.pdf)  
> 51. Affective Computing \- IEEE Standards Association, [https\://standards.ieee.org/wp-content/uploads/import/documents/other/ead1e\_affective\_computing.pdf.](https://standards.ieee.org/wp-content/uploads/import/documents/other/ead1e_affective_computing.pdf.)  
> 52. SECURITY\_GOVERNANCE.md  
> 53. MeitY: Digital Personal Data Protection Act, 2023, [https\://www\.meity.gov.in/content/digital-personal-data-protection-act-2023](https://www.meity.gov.in/content/digital-personal-data-protection-act-2023)  
> 54. GREPTILE\_INTEGRATION.md

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAaCAYAAAAjZdWPAAACcElEQVR4Xu2XPWhVQRCFj6gQ8S9WEgwYkmhhRIVARLCMYGMjQiRWVipYWWibJp2FhVWwsTJFijSBFCku2Ijaiq2KiYWoICiooM7J3OXtO2933w0JBuF9cODtzN69c2dnfx7Qo8e2sNt037RLHQX2mu6adqqjG/2mAVFfW4/uMOA504o6Iqbh/hNifw0PvDH74EGumv6YRuo2ddT0obbzd4nPpptqrDljemc6WLcZ5HLLjR2mB6bRyNaI7/DglJOmL6ZHyE/7Hnggh9VR89z0LWpXpq9Rm4yh/I4O+KUM+L06jGF4tt/Cs6/w2Yemc+qoGTf9QLv/KdIJom1GjTkOwR9YUocxafpteobW9MYcMb2Bj6Ewa0/gpcDZCDABqaCZHL6nEdfggTFAZQ3+Ai60FHeQDoDchvuY7RjafomNsDxyY3XAziyNQbGfgg8yL/aY0os4c/RdN12JRBuzqtxDfqw2TsMXxUv4lhV0wzTU6rYO99TjYqvQvshimE0NglmnbVbs5BI6+ydhabDjZXUkYCnwY2Iq5IPmuNyVYvi8LsxA46BfwDvuV0dDKpSDrqJ22ImuRraYxkHzhU06clrPqxFet1zEKTju46gdFiYPtBRh1ouE/fmTOoQLpgPwrOkdobR7cNyF+nd4V+m4Li3q9QEm4McuO/HEO4Z8Bm7Ba1Drk4R9nGMqDIJbJn1T8IMjt3US3ku6JXBDvIKffEo4QFILi3BmeLyXgg0wgdz2toyf8KzOiJ1cRNq+ETgbH+F3kC2Dh88i0mVAWDq5W143wi1vSOybhvXOe3cOLjB+2Kg6GnAWnuVt4Z/+c+nR43/mL7/PhvGfVv8zAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAbCAYAAABFuB6DAAAAyElEQVR4XmNgGLpgIhCfAGJOdAkYYAXiGiBuBOIIIJ4FFcMA/4F4Dh4+GGgD8Xsg1kESAyk8gMRnsATin0DsgSzIAFH4EFlgClRQHEmMESp2AEmM4R9UMAQJ50LFWpHUgQVwYT+YIl6owFKYABCIAPFVIF4OxCwwQUkGiMJymAAQ2ADxbwY0z8EU+iKJgdwFEuNHEmPgAeKvQGyMJAZSNB+JDwcga0DWgYACEN8CYnm4LBLIAeJfDJBAX4cmhwFAThBAFxwF1AUARUYuIrq1OXAAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAcCAYAAACtQ6WLAAAAm0lEQVR4XmNgGAIgGYiV0QVBQByI/wNxA5o4HNgAMTO6IE7ACMRqQOyLLgECPUD8EojvALELsgTIETpQdjkQL2WAmAQGnkDMAcT8QHwCiCNgEiAAkgABSyD+CcSKSHJgIALEV4H4H7oECHgwQCSuM0DsE0KWnM8ACZlWIFZigNgNByAjHwKxJBBfBGIVZMkCBoixr4HYG1lixAMAW/sWLMVTccYAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAaCAYAAABRqrc5AAAA7UlEQVR4XmNgGAWjYIDAcSD+CcR3gHg7EJ8AYm8UFQQASPEhIJYAYlYgng/E/4G4CFkRPnCAAaKBEUnME4ifALEMkhgIgCwpRhMDA5ABv9HEWoF4KxBzoInPAeJ/aGIM4gwQQ5YiiYFsB7nCBUkML5BkwPQ7SDPINmkGiBeFoOKgsNKHiqEAHgaIIb5IYu+hYiAQDcRrgDgdyn4AxA1QORQA0gCKDRAwBeKHUDGQBbuAOAiIaxkgrv4GxJZQtRgAFIBiQMwM5YOcLsyA6nRNIM5B4pMFQAaADHJAEycJgNLHBgaI9ygCoHAaBfQAAKlgJl19gKLRAAAAAElFTkSuQmCC>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAABCklEQVR4XmNgGLlAAIglgTgAiB1QpQgDYSDWAOL/QFyOJkcUUALif0Dsgi5BDGgF4q1AzIEuQQjwAPEBBjKd7McA8e8qIP4GxHeA+CMQeyIrwgVATgZpXgrEfAyQADwFxO+RFeECzxkggYUMFjJADOSG8kF0IUIaAUCKniDxQQr3QMVB4QECRVA+CgCFLkiwCkkMFF0gl2AoRgcgk0GKkAMHFgYwPzMDsQ2URgGMQPybASIJAyCNIGfzA7ErENcwQKJyJZIaOPgLxLMYIAaBou00EMtA5TKBWJ8BEoURUDEMAPK7KpRGByJAPIUBYjjJwIMBEojq6BLEAJBXNgBxAboEsQCU50cBJQAAnqotRUOSIgkAAAAASUVORK5CYII=>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAxklEQVR4XmNgGAWjgETQDcS/gHgHED8A4vcosniAJhB/BWI/KN8byueHq8ABdgHxfyBmgfKFgfg0A8QVMMANxIVIfDj4B8X4QBEDxAIUIA4VXIMuQQyQZIBorkKXQALMQGwDpVEAyJ8gzeVo4qxA3ADEAUBcA8QHgHglkjwcgKLkFhLfCohPAfEeIM4EYn0g/gbEEUhqUADISc5ArIouAQQiQDwFiBnRJYgBHkDsAsTq6BLEAFDC2QDEBegSxAIBdIFRQCIAAHPLHsT7Moc/AAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAaCAYAAABCfffNAAABW0lEQVR4Xu2UTytEYRTGj6LIQiISEjulLCxJkY2dYsfSZyBsWdkpWx9AigUlWctOFrKllJUvQP48T+edOp57p2auOyvzq19z7/M2c973nDvXrMm/5hJ+ww24kjxO2V7InlO27V+rjze4Fe5b4Ql8hWMhn4MfcDVkNdEB1ySbMf8xniIyCR/sd+GaGIejkm2at2VBct7fwG7JC/FkXqRd8lJhq1ikYXD3LPCiC4EWuJQ+I21wWrJcBs2LXOhCgA8A17Wdi/BAslw49C/LDr00uDPukK0akrUKw+Y7VqbgrIZ5cPc8RbV/9BHsMT/tSMo4l910zVYNpOsMXJiAV+bzODQfbL/5MCuswy54a/5WIL1wB3bCa8vOqRDc7aOG5l1417AIPBkLsNA+7AtrfAXxXfdn+DDcw3PztkVYoNos64Yz4hyUT2vQY8/H9hTOw2VZKw227A6e6UKTwvwAo7Q41hTuQOsAAAAASUVORK5CYII=>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAbCAYAAADYtRcLAAADF0lEQVR4Xu2XTchOQRTHj1CUzxKJ8pGUEgtFYmOhUDYoxI5iYcVCLHj0ZicJKylJkthJWVjc2AjFRkkWKCyEUhbk6/w6M+8z77kzz4eXp5eeX/27956Ze2fOzJkzc0VGNgtUD1SzfcG/zjPVJdVk1TUxR/8LRqtOqMaG5/Gq08HeZ6RwT7pbUxvE1uFvM0q1UFWpLqpmBvtR1fRwP1yWqz54YwJ9WKG6q9rsygjX22LrsWt48adql+qY6qtqm5izE5rV5IdYvXZigDy0ccMbEy6oPqp2iw0Czqa8Uw04W0sYiTtSz0zYCZ9Nzg5TxRwohco61UFni9/LjTxO0On0He73J8+wTPVZ6k4X2SvW0RzHVYu8UVkq9g4jnYOQ3uhsONxwtsha1XfVjMSGc372iaBKNc/Zi7yUsnOk4hznVZ/EnIycVG0P9ySLdFCmqZ4Eew7aJxxTcKySoUsC1ou13xHRudwMTfEGsZAkHBH3kYeq1eGemUvfZRAYDN9RYD+j/VuJbaJYUvEzB3yrkvy3apCVCIk0GfBMozl2iNXBmXNBj1TXVWOSeil7pBwdlJGkGqotQUeCjbY8DKiPmiIszq1Sz3Z0Op4WUggJyt+oXoUrzz6BpFCWc462L0u97SgSiIcZI6nkyooQloel+eEvqpVDahiEI+VpSK6RZkjmKDkXQ/ymalxir6TeRqQj55iVVd4YwNHSbETnU9gPY0guVj1NyqDkXEztPrNS1yeYSEfO4cBjbwyQEGjAxzxhhP29s6c0VFecrbTmonNpRxkk6vpvRDpac6T5t94Y2Kk6K/XNkk7QcGmLIBpyG3UpWzKIZOt41KO9U6pD4T5HR9myEuuo/8gcsf8qrp44A35GYZJY6t7nC6S8z7HOWG/zwzPnSmbSD04K+1xpcAd5LrY+OEOS+q+qXogdxeYO1rL/KcriWmunEqzLhjeKzfY31WvVGbFBKhFPKLOcvcaScGWUWNCk/gNSn8k/BUerXMgCG34MzVZ0fbbsJfel9V9BO/grYD2OSNr9z7ViWP9zvaTnf+J9+vT5O/wCnu7BIVOD/ooAAAAASUVORK5CYII=>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAZCAYAAABOxhwiAAABrUlEQVR4Xu2WPS8EURSGXxGJQuIzKiIRfoEoJEqFRCg0FH6AQqcQ3ehVIpGIRqunlE10aAjRqESiVpII53VmOHtzZ+au/RBxn+TN7pxzZ+a5M3dmF4hE/hfrkn3JvKTb6bWKYajDDgIcNiXXZntF8i5ZNbVm0wZ1GDc1OjC53EIHDKbbQ5JHyYWkNxvUZAagDjemRgfWch32oAO60u1RyRN0QjxgET3QiebRLplzix46oA4npkYH1socvliA7pA4dR884ZVkxG1Aewn8vRBKl0oG19cydPCR0yuCgrxrVpC1O6cWQifU4Rzq0Ffd9vOQ5hJht9diReu50jNQh1eoA5daMP3QGTP8Hkp25TmBMaf3E3h+3v1aHD7fo9xpzW0U0GjxUofpNJYN6E7HTr2ITDpJP2uBS4IOdmlYB679KvgK9D29B2mNsy6j3oeTDhXo+Q5NvdCBv1hs8mHIyA70Ipky9Ty24b/CCfx1FzrsQh0WTb0Cdct1mJTcS06h/xM4+Bl6wDIa9QNE6PAGdTiDOixVjfDAE2xBd5qFZ021ADpM4PtP1m84RCKRyF/iA37PXg0pZ7TMAAAAAElFTkSuQmCC>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAAAaCAYAAAC6sc5/AAAFSklEQVR4Xu2aW6itUxTH/0KR+/2ejmvK/XYoSfJAbsUpwsORB5II5fak5AUPFCWpczwIJXkgklgh9wdEStQhJQoRcsll/Bpz+OYZ+1trf3utdQ5nN//1b61vjrnmbfznmGN+e0sNDQ0NDQ0NDQ3/JTYz7mU80bgy2RoaZsLmxnONfxhPSbYXjH8bd03lQ4BoLzdumQ0N/2IP4w/Gz7OhgDXEL/jhWuNXxqPXq7EJ4Cy5iPZJ5Z+V8i1S+RAcZvzReFQ2NOgI45/ytYXjxHWh8SF1G3R/4yflc5PBi/JJzgvsuDWFfF/OYH6kE68at0+2IRgnrovltu1SOZFsXSr7X4Nw+1cunAE7Gd8xXpoNywykFB8bvzFuk2xDMU5cbExsud2fNV9fzR1vGH8zfmr8UD6JZys7E/vC+Lvxgqo8wJH3gfFp40vGO+VHJ58R6mtyYahR9/+c8U3j2ZX9PePr8oi6g/Ej+W5lPOQofSBqYP9OXvf79azS1nIR/GQcyY+laaIqzr5OLqrzk20ajBMXZX2nSS5H4ORjzPcJ47vFzty2Ld/hzcYT5P5+RT7/a4wXGb8u5dQ7XjMAJ9L4nvIFf1Le6G3FzqAeLrYsugDn/uPlO5P7Vp5bMRmE9JQ6UcHaiXX/5BIImbo3FDt17yg2yhHf6aX8TPmu3aXUDSB2nH2evB59sMMRJthXHkmvV5e/rDYeUL4PBQJGnGwO5j0PzCqum8pzzBV/8cyasBanyXPnZ4xvlTqAzY0gWd+d5XVvlW/0aGtJeFudqgNnGL+UOwBcKbfTAXVRdw12LuWry/Mh8ohV3wpxLMl8xkgL++cyUffPeBAplwvqXlXKw4a46kgYu/OxqgwhEcUAERU74gswN6IiG2gxrJBvADbMock2D8wirr4AwAbg9l/jEfmakK4ERlrY/nFy3/G5ZNAYCWENhMHgtirPOAvwWoJcLO9u6tEOXCt3eAY2JpMxpP/47Ouf0E4bdR7CsY3giGp9OFz+m/vli04e+ItcXIthN/nxgbg2FGYRF9GJ76zhJCCukTrfAp5z+1OLi91OY49WZTgOB2aB8P4ljpk+nGp8Xp3Irqhs7A7KcjJPm7l/ohVRK/dPtOG4zotGGCecB2iTkE/dca9LEGQW6VLAuj2gjR+5RnJbHeUBKUiIAhHwnTlOAuKCNUbqF1ff+85FEeKK3AbEMcPCM4k42uIajPMoj2iSQ+6Rcuc+WJVl9dMmbUzqnyOw7p/ndVoobn5PTkBd8gTaxDGRL/aBhc9HwjS42/irfM7Z4bNgnLjIe7HV0QbUt0X8Rh3qTsJSxEVZPlYXReQm9Q/rEEukid3PTo/j6zJ1To/6katQn1xnRXkGOJPohAMOMr5fyvv6JxL19Y8A88JyYQjRkgfSb/Sfdy7jvV2eW50sv23mvzIg7JNS2RBsrNtinB4c6zWof2/1TCTPryb2k887gLBGGnYsZh8NBj9cU75zLQ2x0Cl/YghwVGFDHK9V5RyFdfLIIkfiHEAYIa6XjTdWtqH9c8zliZNfUJ9oxW2Vv4WCY8ozYwXc4ri4RE6FAGnr6vIM7pHPcRYQ3RkPn/VlZggY48HGVfKxIRBEVF9UAG/o16rbzGyw/Iae9aWNS+Ttcrqw/swbH7CJiNyM9Rz5WCPi8zvWcUd5m7eUsvu0MGIOAkfc7uqu0nTG1Z6B1GDnjOuAweWFqHGg8dhcWDCk/73V3R5rsAh9/dIW5Ths3JgpZyHpe55g3Cs1/Rv6xcDakNPepcn/WEA9cqVIYRqWEZpTGxoaGhoaGhoaGhoaGhoaGjY8/gFLpVm1xbI5fgAAAABJRU5ErkJggg==>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAZCAYAAADAHFVeAAABRElEQVR4Xu2UvUoDURCFJxBBSCBgQCPEiIW1hdhZxDoEhGCVTltrrX0DsbSzsMgD2Ilskc42YCEpAuYFArE0Ocd7F+ZO4uaHWAT2wFfMmWXmzt7ZFUm1zsqAO/AILkAuTP/mI3ANNsLUYmKDNxU/gxFoKG/He0NwrPyFxQKXKt4Dn+ALHCj/AZyLm3Jp8cRkU3lN790qbyXqg2/j2WZ5UAZnYMt7nHAXHIKs96qg7nNziffzATpgW9xCVMCPhHfGA7TEHaoNrrxf9B6XaaY4DR8+NT4b2QXhFHz2XsJp6L2oeKr2xRWs2YQkN7MbSi8yXqACeAUnNuGV1OxIedTMZvzeuirmnZBYSc24KFp/NuO7vgEl47+LKxZrJc34p2ARTqYZSFg4qdncd8bENCJxrzEuqGHxeGs1TybuyeTUqVKl+ieNAXWeXmLqPFuZAAAAAElFTkSuQmCC>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAZCAYAAACsGgdbAAAB3ElEQVR4Xu2WSyhEYRiGP7mXWxTZsRRlocjCDimRhYVS1sIWWcvGQhZKScpKyY5iqSxIIqXYWCgbFCUWFi7v6/v/Oef8jZnUmTlnMU89df7LzLzzX74ZkRw5EnzBZbczTpTCb/jkDsQFBjyA76JBm4PD8aAPPsN10ZDzMC8wIwa8wE5YALfECxobCkWDMSBhWIa8T8yIGAbcFi+g5UM0aKPTHwlctUe3UzQ4Q866A1HAgF1up+ht3xUNOuWMZRVuMYMwUDJ6RENeuwPZpE00yF/Y4k4joQU+uJ1JYIFnyHGnvwEOwWLYAZdMfz6cgDPmmbDe1sB+WA17jWlZEa2Na2k8Ew15KvpBhBXhHI7CN7goetEYhr/77bAJ7sNKWGLm8H/BMRyBG6KhU2K38T+e/L5SbzyPCjmEt7DOtBnIcgc3fW2+x4CvzdALvnao8BwPmucjCf4QcIv5ZW5Ea22qkPyfsONrhwpXkStWL965I92iq2OxK8l+4oZkO2PlrRVOwmHRC2DPqhvyUzSkDcZQc+aZZ/UK1pp2qHBbV8WrrbxEY/A1MUNXuMw8F/n67Ury/Fb5+kOHH8CL4qdc9Gymw93ujMJSswcv4KVoTawIzAjC8zstXlnzV4AcGeUH/rZrUt7yPnYAAAAASUVORK5CYII=>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAZCAYAAABHLbxYAAABPElEQVR4Xu2WvUoDQRSFr6AQ8SedloHgMwi2iuILBBs7mzxBQvIUYqFgZ2ubJoXFFHaCnaVFnkAQLCzUnMvMwOSwk2xkB0IyH3wseybs3NydGVYkk1kNduEVvIUtGpuHa/jOYVUcwidYd/d6/XD5POzBPzjigSrYhEN4TvkvHFA2jTWx3UxWaFfsw/cp18k0L8szvJCEhT6Iffg25S8uL4N28xFuSMJCjRQXGssZXc8muF/YQnsyuZZnFnoC70uqR5DHSHFBsTxEu9mmLFmheiwVFWRcXqPco+uyI/bUCJlZ6H/xm2mH8jeXx9A/ZsT+JqaeKJVxBL9hk/JP+EXZgdidPY1kHY0d+DphuElO4Q+8g+tBziQr1KPd0wn67no8OSwN+AovKffwa6/81Xu2xH6M3MAzGstkMpllZgxWc2Hppbfc5QAAAABJRU5ErkJggg==>