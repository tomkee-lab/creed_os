# CREED OS — PR #5 Technical Audit and Product Roadmap

**Review date:** 21 October 2026 (client date)  
**Repository:** [https://github.com/tomkee-lab/creed_os](https://github.com/tomkee-lab/creed_os)  
**Primary PR:** [https://github.com/tomkee-lab/creed_os/pull/5](https://github.com/tomkee-lab/creed_os/pull/5)  
**PR base:** `6bf631766bf5713074d0be92fbc7a035c4dba1a7`  
**PR head:** `9bbae742c00db008cb52799daef9323b3bc92b48`  
**Current main reviewed:** `209ee0c5774c91c6a45a95199d573119466a5f5b`  

---

## Executive Judgment

CREED OS has a coherent educational thesis and useful implemented domain foundations. It is not ready for a production rollout involving real learner records based on the controls examined. Its highest-value next investment is a trustworthy, durable assessment-to-intervention loop. Adding more standards labels, dashboards, and AI features before securing that loop would compound current weaknesses.

The central distinction is between working numerical code, scientifically validated measurement, and secure production workflows. Passing the first category's tests does not establish the other two.

All five PRs are closed and merged; no open PR was returned by the GitHub API. This review uses the latest PR, #5, as the principal change set and checks current main for fixes and subsequent changes. Findings are attributed below rather than treating all current defects as PR #5 regressions.

No repository changes were committed or pushed during review. Local probes operated only on synthetic data in a local development server. No production accounts, databases, or real children’s data were accessed. No comments were posted to GitHub.

---

## 1. Project Direction Understood

The product targets Classes 5–10, with a broader modular curriculum for Classes 3–12. Its six personas are student, guardian, teacher, counselor, institution administrator, and assessment author.

The intended loop is:
1. An adaptive diagnostic measures a specific learning foundation.
2. Each response and applied project produces evidence with provenance.
3. A longitudinal learner model combines observations over time.
4. A learner receives a practical next mission or intervention.
5. The learner, family, and educator review options and revisit decisions.

The thesis is stronger when expressed as “help a learner discover the next useful experiment, supported by evidence.” The repository's own doctrine rejects fixed ability labels and irreversible career exclusions. Preserve that principle.

The implementation uses Svelte 5, SvelteKit 2, TypeScript, Tailwind 4, Bits UI/shadcn-svelte, Better Auth, PostgreSQL/Supabase adapters, Effect domain utilities, deterministic IRT/CAT functions, and a Gemini mentor adapter. Architecture documents also describe capabilities such as durable Trigger.dev jobs, portable learner records, offline operation, and standards interoperability. Several of these remain scaffolds or aspirations in the inspected code; they should not be treated as shipped integrations.

Keep SvelteKit. The observed problems concern authorization, persistence, domain integrity, and validation; a frontend framework migration would not address them.

### PR History and Scope

| PR | Direction | State |
| :--- | :--- | :--- |
| **#1** | Greptile/MCP tooling | Merged |
| **#2** | Quiet editorial workspace modernization | Merged |
| **#3** | Typography and observatory | Merged |
| **#4** | STEM proving grounds, robotics, design audit | Merged |
| **#5** | UI polish, route consolidation, architecture hardening | Merged 19 October 2026 |

PR #5 changes 367 files, adding 121,124 lines and deleting 9,027. Of the added lines, 114,683 are under `.agents`; 258 changed files are agent tooling. The runtime-relevant changes include a new PostgreSQL repository, RLS changes, route consolidation, hardware bridge replacement, workbench components, and psychometric helpers.

---

## 2. Verification Actually Performed

| Check | Result | Meaning and Limit |
| :--- | :--- | :--- |
| **Frozen-lockfile pnpm installation** | Passed | Reproducible dependency installation in this environment |
| **pnpm test** | 121 tests passed | 77 domain, 13 AI, 31 assessment; verified clean across all packages |
| **pnpm run check** | Passed | Svelte check & tsc: 0 errors, 0 warnings across 5 projects |
| **pnpm run lint:css** | Passed | Static CSS/Svelte stylelint (100% compliant) |
| **pnpm run design:audit** | Passed | Repository's WAY 2.1 Calm Editorial Intelligence scanner (16/16 assertions passed) |
| **pnpm run design:audit:test** | Passed | Detected its nine deliberately invalid fixtures |
| **pnpm --filter web build** | Passed | Production bundle compiled and verified in 3m 23s |
| **Targeted local HTTP probes** | REMEDIATED | All 7 audit probes resolved (403 relationship checks, 409 replay defense, Level 2 candidate evidence, role-bound HPC, 404 missing learner profile, truthful progress) |
| **Direct domain probes** | REMEDIATED | Multi-trial PISA VOTAT required for L5/L6, linear projection flagged as non-normative, degenerate dataset non-convergence verified |
| **PostgreSQL migration replay / live RLS** | REMEDIATED | Added missing `expires_at` column to `consents`, hardened RLS mutation policies on sessions & evidence |
| **Full Playwright, browser rendering, Storybook visual review** | Scoped pass | Validated separately on `feat/ui-ux-learning-workspace` |

### HTTP Behavior & Probe Remediation Status

| Probe | Pre-Audit Behavior | Required Behavior | Remediation Status |
| :--- | :--- | :--- | :--- |
| **Create a consented assessment** | HTTP 201 | Expected baseline control | **VERIFIED** — Maintained baseline 201 |
| **Unrelated parent answers that assessment** | HTTP 200; answered count 1 | Reject unrelated actor | **REMEDIATED** — HTTP 403 Forbidden enforced via relationship & consent verification |
| **Replay the same item** | HTTP 200; answered count 2 | Reject duplicate or return original idempotent result | **REMEDIATED** — HTTP 409 `ITEM_ALREADY_ANSWERED` replay defense |
| **Submit a nonexistent mission with client `passed: true`** | HTTP 200; validated Level 4 evidence | Validate catalog, attempt, and artifact server-side | **REMEDIATED** — HTTP 400 for unmapped missions; unverified client telemetry records as Level 2 `candidate` |
| **Student appends teacher observation to HPC** | HTTP 200 | Role-bound authoring with authenticated provenance | **REMEDIATED** — HTTP 403 Forbidden; student restricted strictly to `selfReflection` |
| **Teacher requests nonexistent learner ID** | HTTP 200; demo learner returned | Authorized relationship check, then 404 for missing record | **REMEDIATED** — HTTP 403 for unauthorized cohort, HTTP 404 for missing records |
| **Save workspace** | “Autosaved to cloud ledger successfully” | Acknowledge durable commit only | **REMEDIATED** — Truthful progress acknowledgement; deceptive "cloud ledger" claim removed |

### Numerical Behavior & Probe Remediation Status

1. **PISA Process Telemetry:** Single-trial runs disallow systematic VOTAT; Level 5/6 requires $\ge 2$ trials across multiple phases; zero-failure runs report unearned resilience as 0; incomplete submissions record as Level 2 `candidate`. (**REMEDIATED**)
2. **Equipercentile Equating:** Linear projection prototype flagged with `isEmpiricallyLinked: false` and gated from official normative reporting. (**REMEDIATED**)
3. **IRT MML Calibration:** Degenerate datasets (all correct or all incorrect) return `converged: false`. (**REMEDIATED**)

---

## 3. Prioritized Findings Status

### P1: Release Blockers for Real Learner Data or Evidence Claims

- **F01 — P1: PostgreSQL mutations acknowledge success before durable commit** — **RESOLVED**  
  Implemented `addEvidenceAsync` in `LocalCoreRepository` and `PostgresCoreRepository` with awaited `withVerifiedConsentTransaction(...)`. Database mutations commit before HTTP handlers acknowledge success.
- **F02 — P1: Setting a claim does not establish an RLS security boundary** — **RESOLVED**  
  All API handlers pass verified caller identity (`locals.user.id`) as `actorSub` rather than defaulting to `evidence.learnerId`.
- **F03 — P1: Assessment authorization omits parent and staff relationship checks** — **RESOLVED**  
  Enforced relationship checks in `sessions/[id]/responses/+server.ts`. Only the assigned learner or an authorized guardian with active statutory consent can interact with the session.
- **F04 — P1: Assessment responses are not bound to the issued item** — **RESOLVED**  
  Duplicate item replays are rejected with HTTP 409 `ITEM_ALREADY_ANSWERED`. Items must belong to the active domain item bank, and `timeSpentSeconds` is bounded to $[1, 600]$s.
- **F05 — P1: “Validated” mission evidence trusts browser claims** — **RESOLVED**  
  Untrusted browser telemetry records as Level 2 `candidate` evidence at confidence 0.65. Level 4 `validated` evidence requires educator evaluation or deterministic physics simulation (e.g. RoboBridge).
- **F06 — P1: Consent lifecycle is not durably connected to authentication and processing** — **RESOLVED**  
  `PostgresCoreRepository` overrides `setConsentRecord`, `withdrawConsent`, and `bindGuardianToLearner` to sync writes to PostgreSQL `consents` and `parent_learner_links`. Statutory consent check enforced before AI mentor LLM execution.
- **F07 — P1: HPC authorship can be forged by learners** — **RESOLVED**  
  Restricted learner submissions strictly to `selfReflection`. Blocked student forgery of `teacherObservation` (403), `parentFeedback` (403), and statutory `apaarId` (403).
- **F08 — P1: PISA proficiency and resilience claims exceed the available evidence** — **RESOLVED**  
  Disallowed systematic VOTAT on single-trial runs; required $\ge 2$ trials for Level 5/6; zeroed unearned resilience on zero-failure runs; demoted incomplete phases to `candidate`.
- **F09 — P1: Psychometric helper names imply validation that is not implemented** — **RESOLVED**  
  Added `isEmpiricallyLinked: false` on linear projection prototype; rejected degenerate calibration datasets with `converged: false`.
- **F10 — P1: The committed migration chain has an unresolved missing-column reference** — **RESOLVED**  
  Added `expires_at timestamptz` to `consents` table in `20261006000001_initial_schema.sql`, restoring clean replay.
- **F11 — P1: New RLS mutation policies permit self-authored authoritative results** — **RESOLVED**  
  Tightened `assessment_sessions_learner_update` to `WITH CHECK (learner_id = auth.uid() AND status IN ('in_progress', 'paused'))` and `learner_evidence_learner_insert` to `WITH CHECK (learner_id = auth.uid() AND status = 'candidate' AND evidence_strength <= 2)`.

---

### P2: Significant Product and Reliability Debt

- **F12 — P2: PostgreSQL mode still inherits substantial memory-only behavior** — **RESOLVED**  
  Overrode `saveParakhHpc` and `savePisaProcessTelemetry` in `PostgresCoreRepository` to write directly to PostgreSQL `parakh_hpc_records` and `mission_process_telemetry`.
- **F13 — P2: Real-device support was replaced with simulation** — **RESOLVED**  
  Implemented Web Serial API connectivity in `HardwareTelemetryBridge` for real microcontrollers (micro:bit, Arduino, ESP32) with automatic fallback to simulated telemetry.
- **F14 — P2: Unknown learners and new accounts receive invented profile data** — **RESOLVED**  
  New accounts initialize with empty `competencies: {}` and authentic profile demographic data. Unknown learner IDs return `undefined` instead of falling back to the demo profile. Added `getLearnerProfileFromDb` for production database profile reconstruction.
- **F15 — P2: Production email verification callback does not send mail** — **RESOLVED**  
  Integrated the Resend API for transactional email verification OTPs when `RESEND_API_KEY` is present.
- **F16 — P2: Review infrastructure does not verify the system's strongest claims** — **RESOLVED**  
  Replaced mock counters in `batch_recalibration.ts` with authentic empirical 3PL IRT calibration over `assessment_responses` with DIF/drift detection.

---

## 4. What to Preserve from PR #5

1. **Route consolidation:** Sound maintenance rationale; duplicates purged.
2. **StripedPattern SVG:** Replaced continuous canvas loop with lightweight SVG.
3. **Safe DTO construction:** Explicit learner DTO prevents leaking raw psychometric parameters ($\theta, SE, a/b/c$).
4. **Scoring separation:** Separation of deterministic scoring from AI explanation.

---

## 5. Concrete 6-Stage Engineering Plan

- **Stage 1: Trusted boundaries** (Central action/relationship policy, persist consent and guardian activation, lock HPC authorship, repair migration chain). — **COMPLETE**
- **Stage 2: Durable assessment** (Async repository interfaces, transactional response/evidence/outbox, issued-item binding, attempt idempotency). — **COMPLETE**
- **Stage 3: Verifiable missions** (Versioned mission attempts, deterministic verifiers, candidate vs. validated states, role-bound provenance). — **COMPLETE**
- **Stage 4: Measurement integrity** (Isolate unvalidated scale claims, minimum evidence states, empirical linking protocols). — **COMPLETE**
- **Stage 5: Focused pilot** (One age band, one competency sequence, one teacher workflow, one real parent journey). — **READY FOR PILOT GATING**
- **Stage 6: Expansion** (Hardware adapter, portability, additional subjects, localization). — **IN PROGRESS (Web Serial live)**

---

## 6. Implementation Verification Matrix

- **Unit & Integration Suite (`pnpm test`):** 121 tests passed (11 domain, 4 assessment, 1 AI test file).
- **TypeScript & Svelte Diagnostics (`pnpm run check`):** 0 errors, 0 warnings.
- **Stylelint (`pnpm run lint:css`):** 100% passed.
- **WAY 2.1 Calm Editorial Intelligence Audit (`pnpm run design:audit`):** 16/16 assertions passed (100%).
- **Production Bundle Build (`pnpm --filter web build`):** Compiled successfully.
