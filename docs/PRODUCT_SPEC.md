# Core_OS — Product Specification & Methodology

**Document Version:** 1.0.0  
**Status:** Product Baseline  
**Audience:** Product Managers, Pedagogy Specialists, Engineers, Educational Partners  

---

## 1. Product Thesis & Positioning

### 1.1 The Fundamental Problem
Modern education forces students into premature, irreversible pathway decisions based on high-stakes, one-time testing or superficial interest questionnaires. 
- Students are labeled with marks rather than competencies.
- Parents experience immense anxiety and default to a narrow set of conventional careers (Medicine, Engineering) due to lack of transparent evidence.
- Teachers face heterogeneous classrooms without granular diagnostic data or differentiated intervention tools.
- EdTech tools either focus exclusively on drill-and-practice rote LMS functions, or offer generic ungrounded AI chat.

### 1.2 The Core_OS Solution
Core_OS is a **Learner Intelligence & Navigation Operating System**. It maintains a persistent, longitudinal evidence graph for each learner, connecting adaptive diagnostic measurement with hands-on project experiments and transparent pathway simulation.

```text
Measure Deeply ──► Learn Personally ──► Explore Boldly ──► Decide with Evidence
```

### 1.3 Core Product Doctrine
1. **Evidence Before Inference:** No competency, strength, or gap is asserted without traceable evidence.
2. **Growth Before Labeling:** Fixed IQ scores, percentile shaming, and permanent ability stamps are forbidden.
3. **Experiments Before Irreversible Decisions:** Students "try before they choose" through applied mini-missions.
4. **AI Assists, Humans Retain Agency:** The platform exposes probabilities, prerequisites, and options; parents, students, and educators make decisions.
5. **No Recommendation Without Provenance:** Every suggestion must reveal its supporting evidence, missing foundation, and confidence level.

---

## 2. Six Primary Personas

| Persona | Key Outcomes & Jobs-to-be-Done | Flagship Experience |
| :--- | :--- | :--- |
| **Student** (Ages 10–16, Gr 5–10) | Discover strengths and foundation gaps without fear; engage in reasoning challenges; explore pathways; try hands-on missions; consult safe Socratic mentor. | *"My Learning & Future Map"* + Adaptive Challenge Arena |
| **Parent / Guardian** | Understand their child's true cognitive and academic profile; replace anxiety with concrete next actions; align on pathway choices without conflict. | *Parent Alignment Workspace* & Plain-Language Growth Reports |
| **Teacher** | Identify class-wide conceptual misconceptions; group learners by prerequisite readiness; assign differentiated activities; log classroom observations. | *Teacher Copilot Heatmap* & Differentiated Intervention Studio |
| **School Counselor** | Review evidence-backed longitudinal student profiles; facilitate informed family guidance sessions; monitor pathway experiments. | *Counselor Multi-Pathway Review Panel* |
| **Institution Admin** | Track cohort-level learning gains; manage rosters (OneRoster/Google Classroom); audit AI usage; verify regulatory compliance. | *Institution Outcomes & Governance Console* |
| **Assessment Author** | Author competency-mapped assessment items; calibrate 3PL IRT parameters; manage misconception taxonomies. | *Psychometric & Item Bank Studio* |

---

## 3. Core Modules

### Module A: The Longitudinal Learner Profile
A dynamic data structure capturing:
- **Academic Foundation Mastery:** Mathematics, Science, Language, Computational Thinking.
- **Cognitive Competencies:** Spatial Reasoning, Quantitative Reasoning, Logical Deduction, Scientific Inquiry, Systems Thinking.
- **Higher-Order Meta-Skills:** Problem Decomposition, Pattern Transfer, Metacognition, Error Recovery, Persistence.
- **Applied Project Evidence:** Artifacts, rubrics, and reflections from completed missions.
- **Pathway Affinities:** Explored domains, prerequisite progress, and trial outcomes.

### Module B: The Adaptive Diagnostic Assessment Engine
- Non-stressful Computerized Adaptive Testing (CAT) built on 3-Parameter Logistic (3PL) Item Response Theory.
- Dynamically selects items that maximize Fisher Information at the learner's estimated ability level ($\theta$).
- Every response diagnoses either correct mastery or specific conceptual misconceptions.

### Module C: The Learner Evidence Graph
A directed graph anchoring every skill assertion to verifiable, time-stamped observations across a 5-level strength ladder.

### Module D: The Pathway Intelligence & Mismatch Engine
- Models careers and educational routes as graph prerequisites, not flat job descriptions.
- **Mismatch Engine:** When a student or parent desires a pathway where prerequisites are developing, the system does NOT reject the goal. Instead, it generates a **Constructive Mismatch Plan**:
  - Highlights specific foundation prerequisites to strengthen.
  - Proposes a targeted 6–8 week intervention sprint.
  - Suggests 2–3 "Try-Before-You-Choose" applied experiments.

### Module E: Try-Before-You-Choose Project Missions
Applied simulation tasks where learners tackle authentic miniature challenges:
- *Robotics:* Structural bridge building under load and budget constraints.
- *Data Science:* Pattern discovery in environmental climate sensor feeds.
- *Software:* Algorithmic puzzle decomposition.
- *Product Design:* Space optimization and human ergonomics planning.

---

## 4. The 5-Level Evidence Strength Ladder

| Level | Evidence Category | Description | Weight / Confidence |
| :---: | :--- | :--- | :---: |
| **L1** | **Self-Report** | "I like astronomy and building models." | Low (0.20) |
| **L2** | **Structured Inventory** | Interest/value questionnaire or preference survey. | Moderate-Low (0.40) |
| **L3** | **Standardized Diagnostic** | Controlled 3PL IRT adaptive assessment responses. | High (0.80) |
| **L4** | **Applied Mission Task** | Project-based simulation, rubric-evaluated artifact. | Very High (0.90) |
| **L5** | **Longitudinal Performance** | Repeated demonstration across tasks and settings over time. | Maximum (0.98) |

Recommendations continuously adapt as learners advance from L1/L2 self-reports to L3/L4/L5 demonstrated evidence.

---

## 5. Educational Framework Alignment

### 5.1 India: NEP 2020 & PARAKH Alignment
- **NEP 2020 5+3+3+4 Structure:** Specifically targets the Middle Stage (Grades 6–8) and Secondary Stage (Grades 9–10) transition.
- **Competency-Based Assessment:** Moves away from rote recall toward application, higher-order reasoning, and holistic progress cards (HPC).
- **CBSE 2026–27 Directives:** Directly integrates Computational Thinking, AI, Skill Education, and multidisciplinary subject selections.
- **APAAR Interoperability:** Architected to link with the Automated Permanent Academic Account Registry for portable learner record exchange.

### 5.2 Global Standards Crosswalk
Core_OS maintains normalized crosswalk tables mapping our core competencies to:
- OECD Learning Compass 2030 (Transversal competencies)
- Australian Curriculum General Capabilities (Critical & Creative Thinking)
- 1EdTech Comprehensive Learner Record (CLR) & CASE (Competencies and Academic Standards Exchange)

---

## 6. Business Model & Subscription Entitlements

| Plan | Target Audience | Key Entitlements | Price Point |
| :--- | :--- | :--- | :--- |
| **Free Explorer** | Individual Learners | Baseline diagnostic, basic profile, 1 pathway experiment, limited AI mentor. | ₹0 |
| **Family Growth** | Parents & Learners (up to 3 children) | Full adaptive diagnostics, longitudinal evidence graph, unlimited pathway explorer, parent alignment workspace, monthly progress reports. | ₹499 / month |
| **Family Pro** | Ambitious STEM Families | Deep psychometric analytics, voice mentor, unlimited project missions, counselor-ready export. | ₹999 / month |
| **School Starter** | Schools & Academies (per learner/yr) | Teacher Copilot, class heatmaps, OneRoster CSV import, differentiated activity recommendations. | ₹250 / learner / yr |
| **School Enterprise** | School Networks | Full LTI 1.3 / Google Classroom sync, custom pathway catalogs, dedicated SLA, custom branded reports. | Custom ACV |

*Strict Policy:* Core_OS will NEVER sell advertisements or monetize children's behavioral data.
