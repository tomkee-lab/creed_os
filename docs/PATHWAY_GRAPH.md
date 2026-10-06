# Core_OS — Pathway Graph & Mismatch Engine Specification

**Document Version:** 1.0.0  
**Status:** Algorithmic Specification  
**Audience:** Guidance Counselors, Product Engineers, Educational Ontologists  

---

## 1. Graph-Based Pathway Ontology

Traditional guidance products present careers as flat catalogs ("Software Engineer: writes code; Average salary: ₹X"). Core_OS models pathways as **Directed Acyclic Competency & Prerequisite Graphs**:

```text
                  [ Pathway: Robotics & Autonomous Systems ]
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
[ Prerequisite Competencies ]                             [ Education Routes ]
 ├── Spatial Reasoning (Req: ≥ L3.5)                       ├── B.Tech Mechatronics (4 yr)
 ├── Quantitative Foundations (Req: ≥ L3.0)                ├── Polytechnic Diploma (3 yr)
 ├── Algorithmic Thinking (Req: ≥ L3.0)                    └── Applied Hardware Apprenticeship
 └── Systems Troubleshooting (Req: ≥ L2.5)
         │
         ▼
[ Foundational Academic Skills ]
 ├── Linear Algebra & Coordinate Geometry
 ├── Basic Newtonian Mechanics (Forces & Torque)
 └── Boolean Logic & State Machines
```

---

## 2. Multi-Route Flexibility

Core_OS explicitly refuses to treat 4-year premier university admissions as the single valid route. Every pathway encapsulates:
1. **Tier 1 Academic Route:** University engineering or science degree (B.Tech, B.S., M.Sc.).
2. **Applied Polytechnic / Vocational Route:** Hands-on diplomas, ITI certificates, industry apprenticeships.
3. **Open-Source / Project Portfolio Route:** Competency badges, GitHub repositories, and verified hardware project demonstrations.

---

## 3. The Pathway Mismatch Engine

### 3.1 The Social Problem It Solves
In Indian and global education, parental aspirations often collide with a child's current demonstrated abilities. A parent demands: *"My child must become an AI/Robotics Engineer."* If an aptitude test says *"Your child lacks math ability; rejected,"* the family rejects the platform in frustration, or forces the student into years of high-pressure coaching without foundational readiness.

### 3.2 The Constructive Mismatch Algorithm
When a learner's current evidence graph $\mathbf{E}_{\text{current}}$ does not satisfy pathway prerequisites $\mathbf{P}_{\text{pathway}}$:

1. **Calculate the Delta ($\Delta$):**
   $$\Delta_{\text{gap}} = \max(0, P_{\text{req}} - E_{\text{observed}})$$
2. **Classify Feasibility:**
   - $\Delta_{\text{gap}} \le 0.5$: Minor gap, remediable in 4–6 weeks.
   - $0.5 < \Delta_{\text{gap}} \le 1.5$: Foundational gap, requires structured 8–12 week intervention.
   - $\Delta_{\text{gap}} > 1.5$: Major foundational gap, requires multi-term developmental bridge.
3. **Formulate Constructive Growth Plan:**
   - **Do NOT reject or close the door.**
   - Highlight the specific conceptual foundation (e.g., "Proportional Reasoning and Algebraic Inversion").
   - Prescribe an **8-Week Foundation Sprint** targeted specifically at the gap.
   - Offer **3 Try-Before-You-Choose Project Challenges** to test passion, grit, and real-world interest before financial or academic commitments.

---

## 4. Pathway Simulation: "What-If" Analysis

Learners and parents can interactively simulate their future map:

```text
Current State:
  - Quantitative Reasoning: Level 2.1 (Developing)
  - Spatial Reasoning:      Level 4.4 (Advanced)
  - Scientific Thinking:    Level 3.2 (Proficient)

Simulation Action: "What happens if I raise Quantitative Reasoning to Level 3.5?"

System Impact:
  - Robotics & Automation:  Readiness jumps from 54% ──► 88% (Unlocked!)
  - Astrophysics Research:  Readiness jumps from 48% ──► 82% (Unlocked!)
  - Computational Science:  Readiness jumps from 51% ──► 85% (Unlocked!)
  - Industrial Architecture: Readiness remains 92% (High stability)
```

This transforms career planning from a fatalistic judgment into a **transparent, motivating roadmap for growth**.
