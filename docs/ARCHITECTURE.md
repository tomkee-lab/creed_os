# Core_OS — Architecture Specification

**Document Version:** 1.0.0  
**Status:** Production Baseline  
**Codename:** Core_OS (Learner Intelligence & Navigation Platform)  
**Primary Stack:** Svelte 5 + SvelteKit 2 + TypeScript + Tailwind CSS 4 + Bits UI / WAY Design System + Supabase/PostgreSQL + Effect + Trigger.dev + Google ADK / Gemini API

---

## 1. Executive Architecture Overview

Core_OS is an **AI-Native Learner Intelligence, Assessment, Learning & Pathway Navigation Platform**. It shifts the fundamental paradigm from static testing and one-off career quizzes to a continuous, longitudinal evidence and decision system:

```text
       ┌────────────────────────┐
       │   Diagnostic Item      │
       └───────────┬────────────┘
                   │ Response & Telemetry
                   ▼
       ┌────────────────────────┐
       │  Deterministic Scoring │ ◄── Server-authoritative 3PL IRT & CAT
       └───────────┬────────────┘
                   │ Ability Update (θ, SE)
                   ▼
       ┌────────────────────────┐
       │  Evidence Graph Engine │ ◄── 5-Level Strength Ladder
       └───────────┬────────────┘
                   │ Provenance & Confidence
                   ▼
       ┌────────────────────────┐
       │ Longitudinal Learner   │ ◄── Dynamic Competency Graph
       │         Model          │
       └───────────┬────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌──────────────────┐ ┌──────────────────┐
│ Targeted         │ │ Pathway Mismatch │
│ Interventions    │ │ & Simulation     │
└────────┬─────────┘ └────────┬─────────┘
         │                    │
         └─────────┬──────────┘
                   ▼
       ┌────────────────────────┐
       │ Try-Before-You-Choose  │ ◄── Applied Project Missions
       │      Experiments       │
       └───────────┬────────────┘
                   │ Real-world Evidence
                   ▼
       ┌────────────────────────┐
       │ Human Triad Decision   │ ◄── Student + Parent + Teacher
       └───────────┬────────────┘
                   │ Reassessment Loop
                   ↺
```

---

## 2. Core Architectural Pillars

### 2.1 The Principle of Separation of Authority
To eliminate safety, hallucination, and psychometric validity risks, the platform strictly separates three authorities:

1. **Deterministic System (Authoritative Ground Truth):**
   - Item Response Theory (IRT) calculations, Expected A Posteriori (EAP) ability estimates ($\theta$), Computerized Adaptive Testing (CAT) next-item selection.
   - Row Level Security (RLS), multi-tenant access control, parent consent states, and audit trails.
   - Pathway prerequisite verification and mismatch detection algorithms.
   - *Rule:* The LLM is NEVER asked "What score should this learner receive?" or "Can this learner become an engineer?".

2. **AI System (Intelligent Interaction Layer):**
   - Natural language explanations of psychometric datums, formative hints, and Socratic dialogues.
   - Project mission briefing generation and rubric interpretation.
   - Extraction of candidate structured observations from freeform student reflection.
   - Synthesizing plain-language summaries for parents and grouping heuristics for teachers.
   - *Rule:* AI recommendations are proposed as `candidate` states until validated by rules or human review.

3. **Human Authority (Sovereign Decision-Making):**
   - Students choose their learning journeys and project experiments.
   - Parents review alignment and approve data sharing.
   - Teachers adapt class activities, override AI suggestions, and record authoritative classroom observations.

---

## 3. High-Level System Topology

```text
                               Core_OS Platform
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
     Student Portal             Parent Portal            Teacher Portal
 (Ages 10-16 / Gr 5-10)    (Alignment & Progress)   (Copilot & Differentiated)
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      ▼
                        SvelteKit 2 + Svelte 5 (SSR / PWA)
                        WAY Design System (Bits UI + OKLCH)
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
   Client State (Runes)                               Server Endpoints (/api/v1)
   TanStack Query / Table                             Effect Application Layer
            │                                                   │
            └─────────────────────────┬─────────────────────────┘
                                      ▼
                             Domain Services Layer
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
     Assessment Engine         Evidence Engine           Pathway Engine
   (3PL IRT / CAT Engine)    (5-Level Provenance)     (Mismatch & Simulation)
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
  Database & Security           AI Services & Voice            Background Jobs
 Supabase PostgreSQL 16      Google ADK / Gemini API          Trigger.dev Engine
 - Row Level Security (RLS)   - Gemini 1.5 Pro / Flash        - Async Report Gen
 - pgvector (RAG / Skills)    - Gemini Live WebSockets        - Batch Psychometrics
 - ltree (Competency Trees)   - Socratic Dialogue Engine      - Ingestion & Sync
 - Transactional Outbox       - Zero Audio Retention Policy   - Notification Queues
```

---

## 4. Multi-Tenant Architecture & Data Scoping

Core_OS is multi-tenant by design across educational ecosystems:
- **Schools & School Networks:** Classes, sections, curricula, teacher assignments.
- **Coaching & STEM Academies:** Batches, skill accelerators, custom pathway catalogs.
- **Independent Families:** Direct B2C accounts with parent-guardian governance.

### 4.1 Global Learner Ownership
A student is not the exclusive property of an individual school. The learner profile (`profiles`) is owned by the student/guardian, while academic cohorts and evidence submissions are linked through scoped `organization_memberships` and explicit `consents`.

```text
Organization (School A)          Organization (Academy B)
         │                                  │
         └──► Membership ◄─── Learner ───► Membership ◄──┘
                                 │
                                 ├── Guardian Link (Parent)
                                 └── Portable Learner Evidence Graph
```

### 4.2 Row Level Security (RLS) Enforcement
- Every tenant table carries `organization_id` or `learner_id`.
- Policies evaluate Postgres session claims (`auth.uid()`, `request.jwt.claims`).
- Parent access is **relationship-gated** via `parent_learner_links` and requires `consent_status = 'verified'`.
- Token enumeration attacks are mitigated by executing sensitive token verifications inside `SECURITY DEFINER` stored procedures.

---

## 5. Domain Engine & Effect Architecture

Complex business workflows in Core_OS are orchestrated using **Effect** to ensure type-safe domain error handling, deterministic concurrency, retries, and transactional integrity:

```text
Assessment Submission Endpoint
              │
              ▼
   Effect.gen(function* () {
       // 1. Authenticate & fetch session
       const session = yield* AssessmentRepo.getSession(sessionId);
       
       // 2. Score response deterministically
       const isCorrect = yield* ScoringEngine.evaluate(item, response);
       
       // 3. Update psychometric ability via 3PL IRT & EAP
       const newTheta = yield* CatEngine.estimateThetaEAP(session.history, response);
       
       // 4. Generate structured evidence record
       const evidence = yield* EvidenceRepo.createEvidence({
           learnerId: session.learnerId,
           skillId: item.skillId,
           strength: 3, // Controlled Diagnostic Assessment
           observedValue: { theta: newTheta.estimate, error: newTheta.standardError }
       });
       
       // 5. Select next maximum information item (CAT)
       const nextItem = yield* CatEngine.selectNextItem(session.blueprint, newTheta);
       
       // 6. Persist transactional outbox event
       yield* OutboxRepo.publish("assessment.item_answered", { ... });
       
       return { isCorrect, nextItem, abilitySummary: newTheta };
   })
```

---

## 6. Asynchronous Jobs & Trigger.dev

Long-running workflows are decoupled from HTTP request cycles:
- **PDF Report Generation:** Batch rendering of comprehensive learner outcome reports for parents and schools.
- **Psychometric Recalibration:** Overnight batch calibration of item difficulty ($b$), discrimination ($a$), and pseudo-guessing ($c$) parameters.
- **Integration Syncing:** LTI 1.3 / OneRoster 1.2 roster synchronization.
- **AI Observation Pipeline:** Deep extraction of qualitative metacognitive evidence from project mission submissions.

---

## 7. Performance SLOs & Degradation Strategy

| Operation | Target p95 | Fallback / Mitigation |
| :--- | :--- | :--- |
| Public Static Pages | < 300 ms | Edge CDN caching via Vercel |
| Student Dashboard Hydration | < 800 ms | SvelteKit server loaders + TanStack Query cache |
| Adaptive CAT Next-Item Serving | < 250 ms | In-memory item bank indices + server-side EAP lookup |
| Socratic AI First-Token Response | < 1,200 ms | Streaming SSE + local heuristic dialogue engine fallback |
| Offline Diagnostic Progress | 0 ms (Local) | PWA Service Worker + IndexedDB response queue |

---

## 8. Development & Packaging Standards

- **Package Management:** `pnpm` exclusively. Any invocation of `npm` or `yarn` is prohibited and rejected in CI.
- **Monorepo Topology:** Turborepo manages parallel builds and typechecking across `apps/web` and `packages/*`.
- **Zero-Dependency Local Execution:** All core services provide dual-mode adapters: direct Supabase Postgres connection or high-fidelity in-memory repository with comprehensive seed data.
