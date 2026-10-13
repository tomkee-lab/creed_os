# Architectural & Regulatory Resolution: Target Learner Audience vs Statutory DPDP Child-Safety Scope

## Status
Approved Specification Harmonization (Amended with Statutory DPDP Under-18 Baseline)

## Date
2026-10-12

---

## 1. Identified Discrepancy & Legal Context

Across repository documentation and strategic roadmaps, two distinct demographic scopes were previously conflated:
1. **Product Target Audience:** Classes 5–10 (Ages 10–16), focusing on Middle and Secondary stages.
2. **Statutory Child Definition:** Section 2(f) of India's Digital Personal Data Protection Act, 2023 (DPDP Act) explicitly defines a **child as any individual who has not completed eighteen (18) years of age**. Section 9 mandates verifiable parental consent prior to processing any personal data of a child, tracking, behavioral monitoring, or targeted advertising.

Conflating the product's primary market focus with the statutory threshold created a potential regulatory risk (e.g., mistakenly assuming students aged 16–17 in Classes 11–12 were exempt from child-data protections).

---

## 2. Harmonized Governance Model

To preserve legal compliance, minor-data protection, and curricular flexibility, CREED OS enforces a **Three-Tier Boundary Architecture**:

### Tier 1: Statutory Child-Safety & Consent Boundary (Under 18 Years)
- **Legal Invariant:** Every learner on the platform who has not completed 18 years of age is governed by the statutory child-safety model regardless of grade or class.
- **Verifiable Parental Consent:** Mandatory state machine (`DRAFT` → `PARENT_INVITED` → `PARENT_CONSENTED` → `ACTIVE`) enforced via Supabase RLS and server-side authorization before persistent personal data processing, psychometric profiling, or external AI recommendations occur.
- **Students Aged 16–17:** Are **strictly protected** under the child-safety model. They are not treated as adult data principals unless statutory exemptions or legal rules explicitly apply.
- **Phased Commencement Schedule:** In accordance with the Government of India's November 13, 2025 commencement notification, Sections 7–10 of the DPDP Act phase in 18 months post-notification (targeted May 2027). CREED OS implements the architectural controls proactively now. Qualified Indian privacy counsel will review the deployment against final published rules and exemptions prior to production launch.

### Tier 2: Product Target Audience & Cognitive Baseline (Classes 5–10 / Ages 10–16)
- **Primary Operational Focus:** Core developmental dashboards, reading levels, Socratic voice mentor conversational pacing, and baseline diagnostic assessments are optimized for students aged 10–16 (Classes 5 through 10).
- **Non-Anxiety Developmental Growth:** Communicates capabilities qualitatively (*"Strong foundation"*, *"Next focus"*) rather than deterministic career tracking or irreversible labels.

### Tier 3: Modular Curriculum Continuum (Classes 3–12 / Ages 8–18)
- Curriculum challenges and STEM maker missions scale across Classes 3–12 via dynamic `gradeBracket` metadata:
  - **Classes 3–5 (Preparatory, Ages 8–11):** Block-based visual challenges, tactile kinematics, iconographic guidance.
  - **Classes 6–8 (Middle, Ages 11–14):** Visual blocks + live Python AST preview, proportional reasoning, Socratic voice dialogue.
  - **Classes 9–10 (Secondary, Ages 14–16):** Monaco text editor, algorithmic decomposition, Olympiad benchmark alignment.
  - **Classes 11–12 (Senior Secondary, Ages 16–18):** Advanced Pyodide simulations, telemetry data analysis, career bridge sprints (under-18 consent still verified).

---

## 3. Implementation Rules
1. **Never conflate market audience with legal status:** In authorization logic and database schemas (`packages/domain/src/consent.ts`), the consent gating condition is `age < 18` or `grade <= 12`, not `age <= 16`.
2. **Dynamic UI Adaptation:** Global layouts must adapt density based on learner `gradeBracket` metadata rather than hardcoding static age assumptions.
