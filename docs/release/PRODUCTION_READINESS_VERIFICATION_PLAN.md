# CREED OS — Production-Readiness Verification Plan

> **Release Assurance Specification • SvelteKit 2 / Svelte 5 Runes • Supabase • pnpm Workspaces • WAY 2.1**  
> **Target Release:** CREED OS v1.0.0-rc  
> **Current Status:** Verification Plan Prepared; Execution Status is **`NOT YET VERIFIED`**. No repository commands, security attacks, or operational tests are claimed to have run.  
> **Governing Principle:** *Evidence before claim. Deterministic proof before sign-off. Invariant-based security over brittle status codes.*

---

## 1. Executive Summary & Release Decision Framework

This verification plan establishes the definitive, independently reproducible testing, security, and operational evidence criteria required before **CREED OS** can be certified for production deployment. Passing local builds, passing unit tests, and passing component stories represent engineering progress, but **they do not constitute proof of production readiness**.

Under statutory child data protection standards (India DPDP Act 2023) and high-stakes psychometric integrity mandates, all assertions must be verified through:
1. **Adversarial negative testing** across the entire data lifecycle (HTTP, caches, background jobs, storage, exports).
2. **True authorization invariants** evaluated against authenticated PostgREST and application boundaries, supported by falsifiable SQL harnesses with deterministic fixture setup.
3. **Cryptographically traceable build provenance** distinguishing clean install, build execution, and deployed artifact digests.
4. **Multi-run reliability testing** with deterministic test fixtures.
5. **Operational resilience verification** covering migrations, backups, AI fallbacks, and browser sandbox isolation.

### 1.1 The Four Release Decision States

Every gate, sub-check, and final release determination must strictly use one of the following four states:

| Release State | Definition | Operational Governance Rule |
| :--- | :--- | :--- |
| **`PASS — Verified`** | Required checks executed cleanly against the release commit, concrete evidence is preserved in `evidence/release/<release-id>/`, and the result is independently reproducible. | Only assignable when verified logs, outputs, and reviewer sign-offs exist. Any subsequent commit touching the gate's scope invalidates this status. |
| **`PENDING — Not yet verified`** | A check has not yet run, lacks tangible evidence artifacts, or has not been independently reviewed. | **Default initial state for all gates.** `PENDING` is strictly never equivalent to passing. |
| **`FAIL — Release blocked`** | A mandatory check failed, an exploitable vulnerability was identified, or required evidence failed to establish a safety-critical property. | Automatically halts release deployment. Overrides any downstream approvals. |
| **`ACCEPTED RISK — Explicit approval required`** | A non-blocking issue has a documented business impact, technical mitigation, named owner, review/expiry date, and written approval from designated release authority. | **Cannot override a mandatory release blocker.** Requires formal entry in the Release Risk Register. |

### 1.2 Release Acceptance Contract & Release-Blocking Conditions

Production release authorization is strictly forbidden while **any** of the following conditions remains unresolved:

1. **Authorization & Tenant Isolation Failure:** Any unauthorized read, write, or modification of student, family, or teacher data; broken tenant isolation; or Supabase Row-Level Security (RLS) bypass.
2. **Consent Bypass or Tampering:** Statutory DPDP consent controls that can be forged, replayed, or bypassed when accessing protected minor data.
3. **Psychometric Parameter Leakage:** Internal psychometric parameters (Item Response Theory 3PL $a, b, c$, Fisher information, $\theta$, $SE$) or unredacted diagnostic logs exposed in client bundles, public API responses, error traces, or exports.
4. **Deterministic Scoring Override:** Any code path permitting client input or LLM generation to overwrite, invent, or bypass deterministic CAT/IRT assessment scoring in `@core-os/assessment`.
5. **Build Mutation or Unverifiable Provenance:** A production build failing, uncommitted workspace drift, lockfile drift during frozen installation, or a deployed artifact that cannot be traceably linked to the tested commit SHA.
6. **Unmitigated High/Critical Vulnerabilities:** Any known critical or high-severity exploitable dependency or application vulnerability without an approved, defensible mitigation and formal sign-off.
7. **Material Accessibility Barriers:** WCAG 2.1 AA failures or keyboard navigation blocks preventing completion of core student, parent, or educator journeys.
8. **Operational & Sandbox Failures:** Unrehearsed database migrations, unvalidated backup recovery, development feature flags or mock auth leaking into production, or code execution escape from the browser sandbox.
9. **Unaccountable Governance or Missing Legal Sign-off:** Missing DPDP legal assessment by Indian privacy counsel, unresolved P0 findings, or absence of an accountable, named release authority sign-off.

---

## 2. Toolchain Source of Truth & Environment Baseline

All verification activities must derive their toolchain versions from the repository's canonical configuration files:

- **Package Manager:** `pnpm@11.25.0` (as declared in root `package.json` under `"packageManager"`).
- **Node.js Runtime:** `Node.js >= 22.0.0` (as declared in root `package.json` under `"engines.node"` and `.github/workflows/ci.yml` `node-version: 22`).
- **Monorepo Engine:** Turborepo 2.4.4.
- **Frontend Framework:** Svelte 5.57.1 + SvelteKit 2.70.3 + TypeScript 5.7.3.
- **Active SvelteKit Adapter:** `@sveltejs/adapter-auto` (configured in `apps/web/svelte.config.js`). Canonical build output resides in `apps/web/.svelte-kit/output` (or the containerized image produced by the deployment pipeline).
- **Styling & Design Tokens:** Tailwind CSS 4 + WAY 2.1 Master Design System.
- **Database:** PostgreSQL 16 + Supabase (RLS, pgvector, pgcrypto).

---

## 3. Gate 1 — Reproducible Build & Release Provenance

- **Owner:** Release Engineer  
- **Priority:** **P0 (Mandatory Blocker)**  
- **Initial Status:** `PENDING — Not yet verified`  
- **Required Artifact:** `evidence/release/<release-id>/build-provenance.md`

### 3.1 Objective
Establish an unbroken, tamper-evident chain of custody from the approved Git commit SHA to the deployed production artifact, proving that the release was built from a clean checkout using pinned toolchains, a frozen lockfile, and identical CI pipeline steps.

### 3.2 Precision in Reproducibility: Traceable Provenance vs. Binary Reproducibility
The verification plan explicitly distinguishes between **traceable build provenance** and **bit-for-bit binary cross-platform reproducibility**:
1. **Traceable Build Provenance & Artifact Identity (Mandatory Invariant):** The deployed container image or runtime bundle is cryptographically bound to a specific Git commit SHA, runtime toolchain versions, and frozen lockfile hash. Every artifact deployed to staging and production must match the exact SHA-256 digest computed during the release verification build.
2. **Reproducible Dependency Installation:** `pnpm install --frozen-lockfile` executes with zero lockfile drift, resolving identical package versions across all workspace packages from the pinned `packageManager: pnpm@11.25.0`.
3. **Repeatable Build Execution:** All workspace verification commands (`check`, `test`, `lint:css`, `design:audit:test`, `design:audit`, `build-storybook`, `build`) execute cleanly with exit code 0 on the approved commit.
4. **Normalized Artifact Archiving:** Standard tarball digests can vary across environments due to archive timestamps, file ordering, user IDs, and filesystem permissions. To ensure verifiable artifact identity, packaging must use normalized archiving flags (POSIX: `tar --sort=name --mtime='2026-10-12 00:00:00Z' --owner=0 --group=0 --numeric-owner -czf ...` or computing a SHA-256 manifest of all files in `apps/web/.svelte-kit/output`).

### 3.3 The Canonical 7-Step Build-Provenance Procedure
Execute the following procedure strictly from a clean repository checkout in an isolated runner:

```bash
# ── Step 1: Capture Baseline State & Version Manifest ─────────────────────────
git rev-parse HEAD
git status --porcelain
git submodule status

node --version
pnpm --version
git ls-files pnpm-lock.yaml
git diff --exit-code -- pnpm-lock.yaml

# Record platform-appropriate SHA-256 of pnpm-lock.yaml
# POSIX: sha256sum pnpm-lock.yaml | Windows: (Get-FileHash pnpm-lock.yaml -Algorithm SHA256).Hash
sha256sum pnpm-lock.yaml

# ── Step 2: Frozen Installation & Pre-Build Worktree Verification ─────────────
pnpm install --frozen-lockfile

# Verify worktree remained 100% clean following package installation
git status --porcelain

# ── Step 3: Execute Workspace Quality & Build Verification Commands ───────────
pnpm run check
pnpm test
pnpm run lint:css
pnpm run design:audit:test
pnpm run design:audit
pnpm run build-storybook
pnpm run build

# ── Step 4: Recheck Worktree Cleanliness AFTER Build ──────────────────────────
# Ensures build process did not mutate tracked source files, package.json, or lockfiles
git status --porcelain

# ── Step 5: Produce Canonical Deployment Artifact & Record Digest ─────────────
# Package canonical output from .svelte-kit/output (configured by @sveltejs/adapter-auto)
# Using deterministic timestamps and sorted entries to ensure archive consistency:
tar --sort=name --mtime='2026-10-12 00:00:00Z' --owner=0 --group=0 --numeric-owner \
  -czf release-artifact.tar.gz -C apps/web/.svelte-kit/output .

sha256sum release-artifact.tar.gz

# Also generate a deterministic SHA-256 file manifest of all built assets:
find apps/web/.svelte-kit/output -type f -exec sha256sum {} + | sort -k2 > release-files.manifest.sha256
sha256sum release-files.manifest.sha256

# ── Step 6: Bind Artifact Digest to Commit SHA and CI Run ─────────────────────
# Record in evidence/release/<release-id>/build-provenance.md:
# • Commit SHA, Branch, Tag
# • Node.js version, pnpm version, Turbo version
# • pnpm-lock.yaml SHA-256 digest
# • release-artifact.tar.gz SHA-256 digest
# • release-files.manifest.sha256 SHA-256 digest
# • GitHub Actions CI Run URL and Workflow Run ID

# ── Step 7: Staging & Production Deployment Digest Validation ─────────────────
# Verify that the artifact deployed to staging matches the exact digest recorded in Step 5.
# Following staging acceptance, re-verify that the artifact deployed to production
# matches this identical digest prior to directing live user traffic.
```

### 3.4 Pass / Fail Criteria
- **PASS Criteria:** Commit SHA matches tagged release; `git status --porcelain` is completely empty prior to build, after install, and after build (excluding gitignored evidence directories); `pnpm-lock.yaml` is unaltered; frozen installation completes with zero errors; all check/test/audit/build commands return exit code 0; CI run URL reflects identical commit and lockfile hash; deployable artifact digest is recorded and verified post-deployment on staging and production.
- **FAIL Criteria:** Any untracked or modified source files; lockfile drift during install; any check or build failure; mismatch between locally verified commit and CI trigger commit; mismatch between verified build digest and deployed production workload digest.

---

## 4. Gate 2 — Production Authentication, Authorization & Lifecycle Consent

- **Owner:** Security Engineer (Reviewed by Privacy/Legal Counsel)  
- **Priority:** **P0 (Mandatory Blocker)**  
- **Initial Status:** `PENDING — Not yet verified`  
- **Required Artifacts:**  
  - `evidence/release/<release-id>/security/threat-model.md`  
  - `evidence/release/<release-id>/security/auth-matrix.csv`  
  - `evidence/release/<release-id>/security/consent-lifecycle.md`  
  - `evidence/release/<release-id>/security/production-negative-tests.md`

### 4.1 Invariant-Based Security Standard
The verification plan judges security by **security invariants**, not brittle single-status-code expectations:
- **Invariant 1 (Confidentiality):** No unauthorized learner PII, evidence, or scoring data is returned in response bodies or headers.
- **Invariant 2 (Integrity):** No unauthorized mutation, record creation, or state change occurs.
- **Invariant 3 (Contract Adherence):** The response adheres to the documented endpoint contract (e.g. an unauthenticated request may receive HTTP 401, a 303 login redirect, or a 404 that intentionally conceals resource existence).
- **Invariant 4 (Zero Leakage):** Error bodies, headers, and stack traces do not disclose sensitive internal schema, parameters, or learner data.

### 4.2 Three-Tier DPDP Taxonomy: Legal vs. Product Policy vs. Implementation
To eliminate ambiguity between statutory legal obligations and voluntary product policies, the plan formalizes three distinct categories:
- **Tier L (Statutory Legal Obligations):** Under DPDP Act 2023, Sections 7–10 are scheduled to commence on May 13, 2027 (18 months post Nov 13, 2025 commencement notification). Section 9 mandates verifiable parental consent for individuals under 18 years. Formal statutory compliance criteria, rules, exemptions, and statutory child protection mechanisms must be validated and signed off by qualified Indian privacy counsel.
- **Tier P (CREED OS Voluntary Product Policy):** Proactive enforcement of parental consent gating ahead of the statutory deadline; developmental framing (*"Strong foundation"*) replacing deterministic IQ or career fit percentages; voluntary annual re-consent reminders (treated as product policy unless statutory rules require otherwise); restricted psychometric item parameter exposure.
- **Tier M (Technical Enforcement Mechanisms):** Relational tables (`parent_learner_links`, `consents`), SvelteKit server hooks (`hooks.server.ts`), Trigger.dev background worker abort handlers, CDN/Redis cache invalidation, Altcha Proof-of-Work.

### 4.3 Separation of Security Controls
The plan explicitly separates three distinct mechanisms that must not be conflated:
1. **Automated Anti-Abuse & Rate-Limiting:** Altcha Proof-of-Work challenge (`/api/v1/altcha`) and IP/session throttling. (Raises the cost of automated bot attacks; does not verify identity).
2. **Communication Channel Verification:** Cryptographic OTP challenge (`/api/v1/consent/challenge`). (Verifies control over an email or phone number; does not prove legal parental authority).
3. **Statutory Parental Consent (DPDP Section 9):** Legally binding, verified consent by a parent/lawful guardian of a minor under 18. Must establish an authenticated guardian identity, link to the learner in `parent_learner_links`, and record an auditable entry in `consents` with timestamp, verification method, and policy version.

### 4.4 Distributed Revocation Invariants & Storage Architecture
To eliminate race conditions, credential persistence, and security leaks across distributed boundaries:

#### 1. Verifiable Security Invariant (Primary Revocation Invariant)
> **Core Invariant:** Once a consent revocation transaction commits in PostgreSQL, no subsequent protected operation across any service may be authorized using stale consent state. Any in-flight operation must adhere to a deterministic, tested race-resolution policy.

#### 2. Authoritative Consent State & Transaction Boundary
- The authoritative consent state is the `consents` table row in the **PostgreSQL primary database** where `status = 'withdrawn'` and `withdrawn_at` is set.
- All authorization decisions for protected minor operations (session creation, response submission, report downloads, evidence generation) **must read from the primary database** or a local fail-closed cache with TTL $\le 2$ seconds. **Read replicas are strictly prohibited** for authorization checks to prevent replication-lag bypasses.

#### 3. Concurrency Serialization & Race-Resolution Policy
- **Assessment Response Commits (`POST /api/v1/assessments/sessions/[id]/responses`):** The database transaction that updates `assessment_sessions` and inserts `assessment_responses` verifies active consent within the serializable transaction boundary (`WHERE learner_id = $1 AND status = 'verified'`). If a concurrent revocation transaction committed first, the commit affects 0 rows, rolls back, and returns HTTP 403 Forbidden.
- **In-Flight Assessment Item Fetch:** Next item selection re-checks consent before returning items. Revoked status aborts the CAT session immediately.
- **In-Flight Report Downloads:** If revocation commits while a file download is in progress, the active streaming response is terminated immediately by the application server abort handler.

#### 4. Complete Resolution of Storage URLs & Revocation Conflicts
- **Zero Client-Side Signed URLs for Sensitive Data:** Long-lived pre-signed URLs (e.g., 15-minute S3/Supabase tokens) conflict with immediate revocation guarantees because an issued credential remains valid until expiry. Therefore, **pre-signed storage URLs are strictly prohibited for client-facing learner reports, psychometric evaluations, or evidence files**.
- **Private Storage Buckets (`public: false`):** All learner storage buckets (`learner-reports`, `learner-evidence`, `voice-transcripts`) are private. Direct HTTP access via public URLs returns HTTP 403 Forbidden or 404 Not Found from the storage gateway.
- **Authenticated Application Streaming Proxy:** All report downloads and evidence exports are served exclusively through authenticated application endpoints (`GET /api/v1/reports/[id]/download`):
  1. Authenticates caller session and verifies role / parent-child relationship.
  2. Queries the primary PostgreSQL database to verify `consents.status = 'verified'`.
  3. If consent is `withdrawn`, `expired`, or missing, immediately returns HTTP 403 Forbidden.
  4. If authorized, streams the file bytes directly from storage using a short-lived internal server client (or internal backend token capped at $\le 60$ seconds that is never exposed to the client browser).
- **Revocation Guarantee:** Because no client-held credentials exist, consent revocation takes effect immediately on the very next download attempt with zero credential revocation lag.

#### 5. Delayed or Lost Event Bus Fallback
- Event buses (Redis pub/sub, Trigger.dev events) provide fast cache eviction notifications, but are **not the authority for authorization**.
- If the event bus is delayed, partitioned, or unavailable, application server handlers continue to read directly from the primary database (or fail closed with HTTP 503 Service Unavailable if database connectivity is lost). The system never fails open.

#### 6. Active Socratic Voice Streams (Gemini Live API)
- WebSocket connections for interactive voice mentoring enforce a strict heartbeat recheck: every audio chunk submission and at least once every 15 seconds, the server re-validates consent against the primary DB or local Redis cache.
- Upon detecting revocation, the server immediately emits a close frame (WebSocket code 4403), cancels the Gemini Live API session, discards the conversational audio buffer, and deletes active session context.

#### 7. Asynchronous Task Checkpoints (Trigger.dev)
- Background batch jobs (report synthesis, longitudinal aggregations, pathway recommendations) are partitioned into idempotent checkpoints.
- At the start of every step, and immediately before committing any derived records to `learner_evidence`, the worker executes a direct SQL check against `consents` on the primary DB.
- If `status != 'verified'`, the task immediately aborts with status `CANCELLED_CONSENT_WITHDRAWN`, purges partial intermediate artifacts, and commits zero records.

#### 8. Synchronous Termination vs. Bounded Propagation Categorization
| Operation Category | Enforcement Boundary | Bounded SLA | Failure Mode |
| :--- | :--- | :---: | :--- |
| **New API Requests** | SvelteKit server hook / route handler | **Synchronous (0ms)** | Fail-closed (HTTP 403) |
| **Assessment Response Commits** | PostgreSQL primary transaction boundary | **Synchronous (0ms)** | Transaction rollback (HTTP 403) |
| **Report File Downloads** | Authenticated application streaming proxy | **Synchronous (0ms)** | Access denied (HTTP 403) |
| **Active Socratic Voice Streams** | WebSocket frame & 15s heartbeat check | **$\le 1,000$ms** | WebSocket close frame 4403 |
| **Edge & Redis Cache Invalidation** | Event bus publication to Redis / CDN | **$\le 2,000$ms** | Direct DB read fallback |
| **Trigger.dev Background Workers** | Task step entry & pre-commit checkpoint | **$\le 5,000$ms** | Safe job abort & rollback |

### 4.5 Adversarial Security Attack Matrix

| Test ID | Vector / Threat Action | Attack Execution Method | Required Security Result |
| :--- | :--- | :--- | :--- |
| **SEC-01** | **Unauthenticated Access** | Dispatch direct HTTP requests to `/api/v1/*`, `/student/*`, `/parent/*`, `/teacher/*`, `/admin/*` without session. | Protected data is inaccessible; adheres to contract (401 JSON for APIs; 303 Redirect for workspaces; 404 for concealed routes). |
| **SEC-02** | **Role Forgery** | Alter client cookies (`creed_dev_role`) or inject `{ "role": "admin" }` in request body/headers. | Server derives authorization strictly from trusted server session; client claim is ignored; returns 403 Forbidden. |
| **SEC-03** | **Learner IDOR** | Authenticated Student A submits requests replacing `learnerId` or URL UUID with Student B's UUID in `/api/learner/*`. | Server enforces session-to-identity binding; returns 403 Forbidden or 404; Student B records inaccessible. |
| **SEC-04** | **Session Tampering** | Manipulate signature or payload of session cookies; replay expired session tokens. | Cryptographic signature validation fails; invalid credentials rejected (401); no privilege escalation. |
| **SEC-05** | **Dev Auth Rejection in Production** | Post to `/api/auth/dev-switch` against a production build (`pnpm --filter web preview`); send `creed_dev_session=true`. | Endpoint returns HTTP 404 Not Found (disabled via `!import.meta.env.DEV`); server hooks ignore `creed_dev_*` cookies in production. |
| **SEC-06** | **Unverified Minor Processing Gate** | Learner account under 18 attempts assessment start or evidence logging with status `pending` or missing consent record. | Protected processing blocked; redirected to consent notice; assessment session token generation denied. |
| **SEC-07** | **Consent State Forgery** | Client sends forged `status: 'verified'` or calls `/api/v1/consent/verify` without valid OTP/PoW challenge. | Server-side verification strictly verifies cryptographic OTP/signature; unauthorized modification rejected (400/403). |
| **SEC-08** | **Expired Consent Enforcement** | Authenticated user attempts protected minor data processing using a timestamped consent record past its validity date. | Processing blocked; status flagged as `expired`; parental re-verification required. |
| **SEC-09** | **Concurrent Revocation** | Guardian revokes consent while an assessment submission, AI mentor prompt, or report export is in flight. | In-flight request is safely aborted or rejected; subsequent requests blocked; active delegation tokens invalidated; Trigger.dev jobs halted. |
| **SEC-10** | **Parent-Child Relationship IDOR** | Authenticated Parent A crafts request attempting to link or view progress report of Student B (unlinked learner). | Link verification fails; access denied (403/404); no metadata or name disclosure. |
| **SEC-11** | **Teacher Cohort Boundary IDOR** | Educator A from Organization X attempts to view student rosters or assessment data belonging to Educator B in Organization Y. | Strict tenant and class assignment checks enforce isolation; query returns 403 or empty array. |
| **SEC-12** | **Anti-Abuse / Rate-Limit Bypass** | Replay consent OTP challenge requests rapidly using rotated headers/client IPs. | Altcha proof-of-work challenge and rate-limiting middleware throttle requests (429); prevents brute-force OTP extraction. |
| **SEC-13** | **Confused Deputy Attack** | Trusted server endpoint or webhook performs privileged operation using caller-supplied `learnerId` or `organizationId`. | Endpoint validates caller's authority over target entity; refuses operation without explicit authorization. |
| **SEC-14** | **Replay Attack** | Re-submit previously consumed OTP, verification token, or Altcha PoW solution. | Solution is single-use; replay is detected and rejected with 400 Bad Request. |
| **SEC-15** | **Session Privilege Drift** | User role or guardian relationship is modified in database; test existing active session. | Active session reflects updated permissions upon next authorization check or session refresh; does not retain stale privileges. |
| **SEC-16** | **Bulk Access & Indirect Extraction** | Exploit pagination parameters (`limit=10000`), wildcard filters, nested GraphQL/JSON queries, or batch export endpoints. | Bulk endpoints enforce same tenant and learner isolation as single-record endpoints; no unauthorized records returned. |
| **SEC-17** | **Cache & Storage Leakage** | Verify whether responses for Student A are cached in reverse-proxy, CDN, or browser cache and served to Student B. | `Cache-Control: private, no-store, max-age=0` enforced on all protected learner routes; reports served via authenticated proxy. |
| **SEC-18** | **Fail-Closed Resilience** | Simulate outage of identity provider, consent verification service, or relationship lookup DB. | System fails closed: protected minor data operations are denied; never defaults to open access. |

### 4.6 Pass / Fail Criteria
- **PASS Criteria:** All 18 adversarial test cases satisfy their security invariants; production build returns 404 for dev-auth; consent revocation propagates within defined SLAs across all application channels; zero public storage bucket leaks.
- **FAIL Criteria:** Any bypass permitting unauthorized data reads, writes, or role elevation; dev switcher active in production; failure to enforce consent gating; any live download link functional post-revocation.

### 4.7 Master Executable Threat-to-Test Mapping Matrix
Every identified system threat maps directly to an architectural control, an automated test harness, a verifiable evidence artifact, and an accountable owner:

| Threat ID | Threat Description | Architectural Mitigation / Control | Automated Test ID | Required Evidence Artifact | Accountable Owner | Reviewer |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| **THR-01** | Student IDOR on Evidence | Server-side session binding in API & RLS `learner_id = auth.uid()` | `SEC-03`, `RLS-01` | `evidence/release/<id>/security/production-negative-tests.md` | Security Engineer | Security Lead |
| **THR-02** | Role Forgery via Client Claims | Server-authoritative session evaluation (Better Auth + DB role) | `SEC-02` | `evidence/release/<id>/security/production-negative-tests.md` | Security Engineer | Security Lead |
| **THR-03** | Dev Auth Leakage in Production | Tree-shaken dev switcher (`!import.meta.env.DEV`), 404 in production | `SEC-05` | `evidence/release/<id>/security/production-negative-tests.md` | Security Engineer | Engineering Lead |
| **THR-04** | Unverified Minor Data Processing | Statutory consent gate in SvelteKit hooks & CAT session generator | `SEC-06`, `SEC-07` | `evidence/release/<id>/security/consent-lifecycle.md` | Security Engineer | Privacy Counsel |
| **THR-05** | Revocation Race Condition | Serializable PostgreSQL check on `consents` in response commit | `SEC-09` | `evidence/release/<id>/security/consent-lifecycle.md` | Database Engineer | Security Lead |
| **THR-06** | Stale Credential Report Download | Authenticated proxy streaming; zero client signed URLs; private buckets | `SEC-17` | `evidence/release/<id>/security/production-negative-tests.md` | Platform Lead | Security Lead |
| **THR-07** | Cross-Tenant Cohort Leakage | Two-tier RLS checking shared `organization_memberships` | `SEC-11`, `RLS-04` | `evidence/release/<id>/security/rls-test-results.md` | Database Engineer | Security Lead |
| **THR-08** | Bot OTP Flooding / Brute Force | Altcha Proof-of-Work challenge + IP/Session rate limiting | `SEC-12`, `SEC-14` | `evidence/release/<id>/security/auth-matrix.csv` | Security Engineer | Platform Lead |
| **THR-09** | Psychometric Item Parameter Leak | Server-only IRT engine; pre-filtering prompt context; qualitative bands | `PSY-01`, `PSY-03` | `evidence/release/<id>/psychometrics/data-exposure-matrix.md` | Assessment Lead | Product Lead |
| **THR-10** | Deterministic Scoring Tampering | Server-authoritative CAT re-scoring; client score payload ignored | `PSY-02` | `evidence/release/<id>/psychometrics/data-exposure-matrix.md` | Assessment Lead | Assessment Lead |
| **THR-11** | Pyodide Worker Sandbox Escape | Isolated WebWorker, restrictive CSP, 5s CPU watchdog, no DOM/secrets | `OPS-08`, `SANDBOX-01–08` | `evidence/release/<id>/operations/sandbox-isolation.md` | Security Engineer | Security Lead |
| **THR-12** | Database Migration Failure | Additive expand-and-contract migrations; rehearsed forward-fix scripts | `OPS-01`, `DRILL-01` | `evidence/release/<id>/operations/operational-readiness.md` | DevOps Lead | Engineering Lead |
| **THR-13** | AI Provider Outage / Flakiness | Bounded retry with exponential backoff; graceful degraded UI fallback | `OPS-04`, `DRILL-03` | `evidence/release/<id>/operations/operational-readiness.md` | Platform Lead | Product Lead |
| **THR-14** | Unlawful PII Persistence Post-Erasure | Synchronous active record purge; rolling backup retention lifecycle | `OPS-07` | `evidence/release/<id>/operations/operational-readiness.md` | Security Engineer | Privacy Counsel |

---

## 5. Gate 3 — Supabase/PostgreSQL RLS & Tenant Isolation

- **Owner:** Backend / Database Security Engineer  
- **Priority:** **P0 (Mandatory Blocker)**  
- **Initial Status:** `PENDING — Not yet verified`  
- **Required Artifacts:**  
  - `evidence/release/<release-id>/security/rls-test-results.md`  
  - `evidence/release/<release-id>/security/policy-inventory.sql`  
  - Sanitized database query logs & PostgREST execution traces

### 5.1 Dual-Tier Testing Architecture
Testing must not rely solely on simulated PostgreSQL identity (`SET ROLE`, `SET request.jwt.claims`). The plan mandates **two-tier testing**:
1. **Tier 1 (Database Engine Test):** Direct SQL integration tests evaluating PostgreSQL RLS policies against actual foreign keys and relationship tables.
2. **Tier 2 (PostgREST / Application Boundary Test):** Authenticated HTTP integration tests using minted JWTs against the real PostgREST / Supabase API surface to ensure JWT parsing, claim extraction, and header processing function as intended.

### 5.2 Least-Privilege Policy Architecture
The requirement is **least-privilege policy coverage**, not a blanket requirement for four policies on every table:
- **Server-Only Tables** (e.g. `audit_logs` read path, internal psychometric calibration jobs): Have RLS enabled with **zero client policies**; accessible strictly via `service_role` on the server.
- **Append-Only Tables** (e.g. user action telemetry, audit events): Have `INSERT` policies only; client `UPDATE` and `DELETE` are disallowed.
- **Read-Only Reference Tables** (e.g. `competencies`, `skills`, public taxonomy): Have `SELECT` policies only.
- **Mutable Entities** (e.g. `profiles`, `learner_evidence`): Have granular, role-scoped policies for appropriate verbs.

### 5.3 Automated Policy Inventory
Before testing, generate an authoritative policy inventory from the database catalog:

```sql
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled 
FROM pg_tables 
WHERE schemaname = 'public';

SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE schemaname = 'public';

-- Inspect SECURITY DEFINER functions
SELECT 
    proname, 
    prosecdef, 
    prosrc 
FROM pg_proc 
JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid 
WHERE pg_namespace.nspname = 'public' AND prosecdef = true;
```

### 5.4 Executable, Falsifiable SQL Test Harness (With Deterministic RFC 4122 Fixtures)

```sql
BEGIN;

-- ── 1. Setup Deterministic Test Fixtures (RFC 4122 Valid UUIDs) ──────────────
DO $$
DECLARE
  -- Organizations (2 distinct tenants)
  c_org1 UUID := '00000000-0000-0000-0001-000000000001';
  c_org2 UUID := '00000000-0000-0000-0001-000000000002';
  -- Identities (Complete set of actors across both tenants)
  c_student_a UUID := '00000000-0000-0000-0002-000000000001';
  c_student_b UUID := '00000000-0000-0000-0002-000000000002';
  c_parent_a  UUID := '00000000-0000-0000-0003-000000000001';
  c_teacher_1 UUID := '00000000-0000-0000-0004-000000000001';
  c_teacher_2 UUID := '00000000-0000-0000-0004-000000000002';
  c_admin_1   UUID := '00000000-0000-0000-0005-000000000001';
  c_admin_2   UUID := '00000000-0000-0000-0005-000000000002';
  -- Taxonomy & Session Entities
  c_comp_1    UUID := '00000000-0000-0000-0010-000000000001';
  c_sess_a    UUID := '00000000-0000-0000-0020-000000000001';
  c_sess_b    UUID := '00000000-0000-0000-0020-000000000002';
  c_resp_b    UUID := '00000000-0000-0000-0025-000000000002';
  c_forged_ev UUID := '00000000-0000-0000-0030-000000000099';
BEGIN
  -- Insert Organizations (Tenant 1 & Tenant 2)
  INSERT INTO organizations (id, name, slug, type) VALUES
    (c_org1, 'Apex Academy Org 1', 'apex-org-1', 'school'),
    (c_org2, 'Horizon Academy Org 2', 'horizon-org-2', 'school');

  -- Insert Profiles
  INSERT INTO profiles (id, email, full_name, role) VALUES
    (c_student_a, 'student_a@test.local', 'Student A', 'student'),
    (c_student_b, 'student_b@test.local', 'Student B', 'student'),
    (c_parent_a,  'parent_a@test.local',  'Parent A',  'parent'),
    (c_teacher_1, 'teacher_1@test.local', 'Teacher 1', 'teacher'),
    (c_teacher_2, 'teacher_2@test.local', 'Teacher 2', 'teacher'),
    (c_admin_1,   'admin_1@test.local',   'Admin 1',   'institute_admin'),
    (c_admin_2,   'admin_2@test.local',   'Admin 2',   'institute_admin');

  -- Insert Organization Memberships
  INSERT INTO organization_memberships (organization_id, user_id, role) VALUES
    (c_org1, c_student_a, 'student'),
    (c_org1, c_teacher_1, 'teacher'),
    (c_org1, c_admin_1,   'institute_admin'),
    (c_org2, c_student_b, 'student'),
    (c_org2, c_teacher_2, 'teacher'),
    (c_org2, c_admin_2,   'institute_admin');

  -- Insert Parent-Learner Link & Verified Consent for Student A ONLY
  INSERT INTO parent_learner_links (parent_id, learner_id, relationship) VALUES
    (c_parent_a, c_student_a, 'legal_guardian');

  INSERT INTO consents (learner_id, guardian_id, consent_type, status, verification_method, policy_version) VALUES
    (c_student_a, c_parent_a, 'assessment_participation', 'verified', 'otp_challenge', '2026.1');

  -- Insert Competency Taxonomy
  INSERT INTO competencies (id, domain, code, name, description) VALUES
    (c_comp_1, 'stem', 'STEM-01', 'Spatial Reasoning', 'Spatial analysis');

  -- Insert Item for response foreign key
  INSERT INTO assessment_items (id, competency_id, code, prompt, explanation, options, correct_option_id, distractors, irt_a, irt_b, irt_c) VALUES
    ('ITEM-STEM-01', c_comp_1, 'STEM-01-Q1', 'Sample Prompt', 'Sample Explanation', '[{"id": "a", "text": "A"}]', 'a', '[]', 1.20, 0.50, 0.20);

  -- Insert Baseline Evidence
  INSERT INTO learner_evidence (id, learner_id, organization_id, competency_id, evidence_type, source_type, source_title, summary, observed_value, confidence, evidence_strength, visibility) VALUES
    ('00000000-0000-0000-0030-000000000001', c_student_a, c_org1, c_comp_1, 'diagnostic', 'cat_assessment', 'Session A', 'Evidence A', '{"theta": 0.5}', 0.9, 3, 'teacher'),
    ('00000000-0000-0000-0030-000000000002', c_student_b, c_org2, c_comp_1, 'diagnostic', 'cat_assessment', 'Session B', 'Evidence B', '{"theta": 0.8}', 0.9, 3, 'teacher');

  -- Insert Assessment Sessions
  INSERT INTO assessment_sessions (id, learner_id, organization_id, domain, status, current_theta, standard_error) VALUES
    (c_sess_a, c_student_a, c_org1, 'stem', 'in_progress', 0.500, 0.400),
    (c_sess_b, c_student_b, c_org2, 'stem', 'in_progress', 0.800, 0.350);

  -- Insert Assessment Response for Student B
  INSERT INTO assessment_responses (id, session_id, item_id, selected_option_id, is_correct, theta_after, standard_error_after) VALUES
    (c_resp_b, c_sess_b, 'ITEM-STEM-01', 'a', true, 0.800, 0.350);
END $$;

-- ── 2. Positive Controls (Prove Authorized Paths Function Before Negative Tests) ──
-- POS-01: Student A reads own evidence -> Exactly 1 row returned
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}';
SELECT count(*) FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000001';
-- ASSERTION: count = 1.

-- POS-02: Parent A reads linked Student A evidence (verified consent) -> Exactly 1 row returned
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0003-000000000001", "role": "authenticated"}';
SELECT count(*) FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000001';
-- ASSERTION: count = 1.

-- POS-03: Teacher 1 reads Student A evidence (same organization Org 1) -> Exactly 1 row returned
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0004-000000000001", "role": "authenticated"}';
SELECT count(*) FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000001';
-- ASSERTION: count = 1.

-- POS-04: Tenant Admin 1 queries Org 1 memberships -> Exactly 3 rows returned (Student A, Teacher 1, Admin 1)
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0005-000000000001", "role": "authenticated"}';
SELECT count(*) FROM organization_memberships WHERE organization_id = '00000000-0000-0000-0001-000000000001';
-- ASSERTION: count = 3.

-- POS-05: Student A executes verify_assessment_session on own session -> Exactly 1 row returned
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}';
SELECT count(*) FROM verify_assessment_session('00000000-0000-0000-0020-000000000001', '00000000-0000-0000-0002-000000000001');
-- ASSERTION: count = 1.

-- POS-06: Student A reads own profile -> Exactly 1 row returned
SELECT count(*) FROM profiles WHERE id = '00000000-0000-0000-0002-000000000001';
-- ASSERTION: count = 1.

-- ── 3. Negative Controls (Adversarial Tests with Post-Operation State Checks) ──
-- NEG-01: Student A queries Student B evidence -> Invariant: Exactly 0 rows returned
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}';
SELECT count(*) FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000002';
-- ASSERTION: count = 0.

-- NEG-02: Student A attempts to mutate Student B assessment session
UPDATE assessment_sessions 
SET current_theta = 2.500 
WHERE learner_id = '00000000-0000-0000-0002-000000000002';
-- ASSERTION: 0 rows affected OR SQLSTATE 42501 raised.
-- Post-Operation Persisted State Check (as superuser):
RESET ROLE;
SELECT current_theta FROM assessment_sessions WHERE id = '00000000-0000-0000-0020-000000000002';
-- ASSERTION: current_theta is strictly unaltered (remains 0.800).

-- NEG-03: Parent A queries unlinked Student B evidence -> Invariant: Exactly 0 rows returned
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0003-000000000001", "role": "authenticated"}';
SELECT count(*) FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000002';
-- ASSERTION: count = 0.

-- NEG-04: Teacher 1 (Org 1) queries Student B evidence (Org 2) -> Invariant: Exactly 0 rows returned
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0004-000000000001", "role": "authenticated"}';
SELECT count(*) FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000002';
-- ASSERTION: count = 0.

-- NEG-05: Tenant Admin 1 (Org 1) queries Org 2 memberships -> Invariant: Exactly 0 rows returned
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0005-000000000001", "role": "authenticated"}';
SELECT count(*) FROM organization_memberships WHERE organization_id = '00000000-0000-0000-0001-000000000002';
-- ASSERTION: count = 0.

-- NEG-06: Student A attempts to insert forged evidence for Student B
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}';
INSERT INTO learner_evidence (id, learner_id, organization_id, competency_id, evidence_type, source_type, source_title, summary, observed_value, confidence, evidence_strength, visibility)
VALUES ('00000000-0000-0000-0030-000000000099', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0010-000000000001', 'cat_assessment', 'cat_assessment', 'Forged', 'Forged summary', '{}', 0.9, 4, 'teacher');
-- ASSERTION: Error 42501 or 0 rows inserted.
-- Post-Operation Persisted State Check (as superuser):
RESET ROLE;
SELECT count(*) FROM learner_evidence WHERE id = '00000000-0000-0000-0030-000000000099';
-- ASSERTION: count = 0 (record does not exist in database).

-- NEG-07: Anonymous client attempts direct table read on profiles
SET ROLE anon;
SELECT count(*) FROM profiles;
-- ASSERTION: count = 0.

-- NEG-08: Cross-student RPC session verification
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}';
SELECT count(*) FROM verify_assessment_session('00000000-0000-0000-0020-000000000002', '00000000-0000-0000-0002-000000000002');
-- ASSERTION: count = 0.

-- NEG-09: Student A attempts to update Student B profile
UPDATE profiles 
SET full_name = 'Hacked Student B' 
WHERE id = '00000000-0000-0000-0002-000000000002';
-- ASSERTION: 0 rows updated OR SQLSTATE 42501.
-- Post-Operation Persisted State Check (as superuser):
RESET ROLE;
SELECT full_name FROM profiles WHERE id = '00000000-0000-0000-0002-000000000002';
-- ASSERTION: full_name is strictly unaltered (remains 'Student B').

-- NEG-10: Cross-student assessment response read
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}';
SELECT count(*) FROM assessment_responses WHERE id = '00000000-0000-0000-0025-000000000002';
-- ASSERTION: count = 0.

-- NEG-11: Storage bucket path isolation check (storage.objects)
-- If Supabase storage schema exists, verify folder isolation:
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects') THEN
    -- Student A querying Student B private report folder
    PERFORM 1 FROM storage.objects 
    WHERE bucket_id = 'learner-reports' 
      AND name LIKE '00000000-0000-0000-0002-000000000002/%';
    -- ASSERTION: 0 rows accessible.
  END IF;
END $$;

ROLLBACK;
```

### 5.5 Pass / Fail Criteria, Tier 2 PostgREST Suite & Falsifiability Protocol

#### 1. Dual-Tier Acceptance Standard
- **Tier 1 (SQL Harness):** 100% of positive controls return expected rows; 100% of negative controls return 0 rows or throw authorization errors; 100% of post-operation state verifications confirm zero persisted mutation.
- **Tier 2 (PostgREST HTTP Integration Suite):** Run automated tests (`pnpm test:rls:http`) using minted JWTs for each actor against the real PostgREST / Supabase HTTP endpoints. The HTTP responses must match database engine isolation invariants (e.g. `GET /rest/v1/learner_evidence?learner_id=eq.c_student_b` with Student A bearer token returns `[]` empty array with HTTP 200, never data; unauthorized POST/PATCH returns HTTP 403 or 404).

#### 2. Mandatory Falsifiability Verification Protocol
To prove that passing negative tests reflect active policy enforcement rather than empty result sets or flawed queries, the test suite must execute a **deliberate leak falsifiability test**:
1. **Inject Leak Policy:** Apply a temporary deliberately permissive policy in the test transaction:
   ```sql
   CREATE POLICY test_deliberate_leak ON learner_evidence FOR SELECT USING (true);
   ```
2. **Execute Negative Control:** Re-run test `NEG-01` (Student A querying Student B evidence).
3. **Verify Failure:** The test harness **MUST FAIL** (`count = 1 > 0`). If the test still reports passing, the test harness itself is rejected as invalid.
4. **Remove Leak Policy:** Drop the temporary leak policy:
   ```sql
   DROP POLICY test_deliberate_leak ON learner_evidence;
   ```
5. **Re-verify:** Re-run `NEG-01`. Assertion succeeds (`count = 0`).

#### 3. Deterministic Fixture Teardown Script
For non-transactional staging environments where `ROLLBACK` is not utilized, execute the standalone teardown script (`tests/fixtures/cleanup-fixtures.sql`):
```sql
DELETE FROM consents WHERE learner_id IN ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0002-000000000002');
DELETE FROM parent_learner_links WHERE learner_id IN ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0002-000000000002');
DELETE FROM assessment_responses WHERE session_id IN ('00000000-0000-0000-0020-000000000001', '00000000-0000-0000-0020-000000000002');
DELETE FROM assessment_sessions WHERE id IN ('00000000-0000-0000-0020-000000000001', '00000000-0000-0000-0020-000000000002');
DELETE FROM learner_evidence WHERE learner_id IN ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0002-000000000002');
DELETE FROM assessment_items WHERE id = 'ITEM-STEM-01';
DELETE FROM competencies WHERE id = '00000000-0000-0000-0010-000000000001';
DELETE FROM organization_memberships WHERE organization_id IN ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0001-000000000002');
DELETE FROM profiles WHERE id IN (
  '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0002-000000000002',
  '00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0004-000000000001',
  '00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0005-000000000001',
  '00000000-0000-0000-0005-000000000002'
);
DELETE FROM organizations WHERE id IN ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0001-000000000002');
```

---

## 6. Gate 4 — Psychometric Confidentiality & Evidence Integrity

- **Owner:** Assessment & Psychometrics Lead (Reviewed by Security Lead)  
- **Priority:** **P0 (Mandatory Blocker)**  
- **Initial Status:** `PENDING — Not yet verified`  
- **Required Artifacts:**  
  - `evidence/release/<release-id>/psychometrics/data-exposure-matrix.md`  
  - Network inspection logs & sanitized API payload samples  
  - AST scan results & AI model input context audit

### 6.1 Objective
Ensure complete separation between deterministic scoring engines in `@core-os/assessment` (Computerized Adaptive Testing / 3PL Item Response Theory) and client-facing interfaces or generative AI layers. **Raw psychometric parameters must remain server-authoritative and completely confidential.**

### 6.2 Field-Level Data Classification Matrix

| Data Classification Field | Student / Parent Surface | Teacher Surface | Authorized Item Studio | AI System Prompt Context |
| :--- | :--- | :--- | :--- | :--- |
| **Learner Developmental Feedback** | Permitted (qualitative bands) | Permitted (qualitative bands) | Permitted | Permitted (qualitative only) |
| **Evidence Provenance & Rubrics** | Permitted (learning narrative) | Permitted (competency breakdown) | Permitted (full audit trail) | Permitted (anonymized) |
| **Item Response Calibration ($a, b, c$)** | **PROHIBITED** | **PROHIBITED** | Authorized & Audited | **PROHIBITED (Pre-filtered)** |
| **Fisher Information / Item Variance** | **PROHIBITED** | **PROHIBITED** | Authorized & Audited | **PROHIBITED (Pre-filtered)** |
| **Raw Ability Estimates ($\theta, SE$)** | **PROHIBITED** | Restricted (banded score) | Authorized & Audited | **PROHIBITED (Pre-filtered)** |
| **Learner PII & Private Family Notes** | Own/linked records only | Assigned cohort only | Explicitly authorized | **PROHIBITED (Pre-filtered)** |

### 6.3 Audit Methodology & AI Pre-Filtering Rule
1. **Value-Level Tracing:** Do not rely on searching for the string `"theta"` in JavaScript bundles. Trace actual numerical parameters from `assessment_items` ($irt\_a, irt\_b, irt\_c$) and `assessment_sessions` ($current\_theta, standard\_error$) through network serialization, SvelteKit load functions, and client state.
2. **AI Pre-Filtering Invariant:** Sensitive psychometric parameters must be **excluded from the model context before inference occurs**. Never pass raw 3PL item parameters or $\theta$ to the LLM and rely solely on system prompt refusal to prevent leakage.
3. **Deterministic Scoring Override Protection:** Verify that POST `/api/v1/assessments/sessions/[id]/responses` ignores any client-supplied scores, theta values, or answers-to-score mappings, re-evaluating responses strictly via `@core-os/assessment` deterministic algorithms.

### 6.4 Pass / Fail Criteria
- **PASS Criteria:** Zero raw psychometric parameters ($irt\_a, irt\_b, irt\_c$, Fisher info, raw $\theta$, $SE$) in student/parent API payloads, browser bundles, source maps, or AI model prompts; deterministic scoring authoritative on server.
- **FAIL Criteria:** Exposure of item calibration data, ability to inject scores, or LLM-derived psychometric ability classifications.

---

## 7. Gate 5 — Accessibility, Responsive UX & WAY 2.1 Compliance

- **Owner:** Design-System Lead & Accessibility Reviewer  
- **Priority:** **P1 (Material Workflow Barriers are P0 Blockers)**  
- **Initial Status:** `PENDING — Not yet verified`  
- **Required Artifacts:**  
  - `evidence/release/<release-id>/accessibility/accessibility-results.md`  
  - Automated `axe-core` test logs  
  - Responsive viewport screenshots (375px, 768px, 1280px)  
  - Keyboard navigation defect log

### 7.1 Standards Distinction: Agreed Conformance Target vs. Deployment Legal Obligations vs. WAY 2.1
The verification plan explicitly establishes three distinct assessment streams:
1. **Agreed Technical Release Standard (WCAG 2.1 AA):** The binding engineering baseline evaluated across all web surfaces. Release certification requires zero Critical or Serious accessibility violations on all core user journeys.
2. **Jurisdiction-Specific Legal & Contractual Obligations:** The specific statutory accessibility standards applicable to each deployment (e.g. Rights of Persons with Disabilities Act, 2016 in India; Section 508 / ADA Title II in the United States; European Accessibility Act in the EU) must be determined, documented, and formally reviewed by legal counsel for the target deployment. WCAG 2.1 AA serves as the baseline technical evidence supporting these compliance reviews.
3. **WAY 2.1 Design System Internal Preferences:** Strict architectural rules (0/4/8px radius system, 4/8px true spacing rhythm, 44×44px touch targets, OKLCH semantic tokens, anti-AI-slop restraints). These design preferences are verified separately from accessibility and must never compromise WCAG conformance.
4. **Decoupled Visual Regression Stream:** Visual regression testing is maintained as a distinct evidence category from accessibility. It utilizes component-specific baseline screenshots and controlled masking of dynamic regions (`data-testid="dynamic-content"`), relying on human review for meaningful visual changes rather than a noisy universal pixel difference threshold.

### 7.2 Core Journeys Tested
1. **Student Journey:** Login $\rightarrow$ Onboarding $\rightarrow$ Diagnostic Assessment $\rightarrow$ Maker Mission $\rightarrow$ Progress Review.
2. **Parent Journey:** Consent Notification $\rightarrow$ DPDP Verification Flow $\rightarrow$ Linked Child Dashboard $\rightarrow$ Progress Report $\rightarrow$ Consent Revocation.
3. **Teacher Journey:** Roster Overview $\rightarrow$ Class Benchmark Review $\rightarrow$ Lesson Assignment $\rightarrow$ Individual Growth Observation.
4. **Counselor/Admin Journey:** Cohort Analytics $\rightarrow$ Pathway Guidance $\rightarrow$ Institutional Settings.
5. **Item Studio / Console Journey:** Authoring Interface $\rightarrow$ Item Calibration View $\rightarrow$ Parameter Verification.

### 7.3 Specific Interaction & Responsive Checks
- **Keyboard Navigation:** Logical tab order; focus trapped inside active modals; <kbd>Escape</kbd> dismisses dialogs; visible focus indicators with $\ge 3:1$ contrast against background surfaces.
- **Screen Reader Semantics:** Valid ARIA roles, states, and properties; form inputs paired with `<label>`; error messages announced via `aria-live="polite"` or `role="alert"`.
- **Reflow & Mobile Responsiveness:** Content reflows cleanly down to 320px width without horizontal scrollbars, with **explicit documented exceptions** for complex workspace tools (e.g. Monaco code editor in STEM studio, multi-dimensional psychometric matrices in Item Studio).
- **Instant Reduced-Motion Contract:** When `prefers-reduced-motion: reduce` is detected, animations and transitions must be **completely disabled (0ms duration, instant state change)**. The standard WAY 140–280ms animation duration rule is **strictly silenced** whenever reduced-motion is requested.

---

## 8. Gate 6 — Dependency, Supply-Chain & License Evidence (SBOM)

- **Owner:** Engineering Lead (Reviewed by Security & Legal)  
- **Priority:** **P1 (Critical Vulnerabilities or Prohibited Licenses are P0 Blockers)**  
- **Initial Status:** `PENDING — Not yet verified`  
- **Required Artifacts:**  
  - `evidence/release/<release-id>/supply-chain/sbom.cdx.json`  
  - `evidence/release/<release-id>/supply-chain/vulnerability-scan.json`  
  - `evidence/release/<release-id>/supply-chain/scan-metadata.yaml`  
  - `evidence/release/<release-id>/supply-chain/license-review.md`

### 8.1 Execution Procedure & Schema Validation

```bash
# 1. Create target evidence directory
mkdir -p evidence/release/<release-id>/supply-chain

# 2. Record toolchain versions and dependency tree
node --version > evidence/release/<release-id>/supply-chain/scan-metadata.yaml
pnpm --version >> evidence/release/<release-id>/supply-chain/scan-metadata.yaml
pnpm list -r --depth Infinity > evidence/release/<release-id>/supply-chain/dependency-tree.txt

# 3. Automated vulnerability audit (capturing exit code without masking failures)
EXIT_CODE=0
pnpm audit --json > evidence/release/<release-id>/supply-chain/vulnerability-scan.json || EXIT_CODE=$?
echo "audit_exit_code: $EXIT_CODE" >> evidence/release/<release-id>/supply-chain/scan-metadata.yaml

# 4. Generate CycloneDX machine-readable SBOM using strictly pinned toolchain
pnpm dlx @cyclonedx/cdxgen@11.1.7 -o evidence/release/<release-id>/supply-chain/sbom.cdx.json

# 5. Validate generated CycloneDX document against official JSON Schema
pnpm dlx ajv-cli validate \
  -s https://raw.githubusercontent.com/CycloneDX/specification/master/schema/bom-1.5.schema.json \
  -d evidence/release/<release-id>/supply-chain/sbom.cdx.json \
  >> evidence/release/<release-id>/supply-chain/scan-metadata.yaml

# 6. Verify SBOM component coverage against pnpm-lock.yaml
# Confirm all runtime and direct workspace dependencies are indexed
```

### 8.2 Triage & Review Scope
- **Vulnerability Triage:** Differentiate raw severity (CVSS score) from practical exploitability, code reachability in production paths, and vendor patch availability.
- **Four-Tier License Risk Classification:**
  1. *Permissive (Pre-approved):* MIT, Apache-2.0, BSD-2/3-Clause, ISC.
  2. *Weak Copyleft (Reviewed for dynamic linking / isolated workers):* MPL-2.0 (e.g. Pyodide WebWorker), LGPL-2.1/3.0.
  3. *Strong Copyleft (Requires explicit legal review & justification):* GPL-3.0, AGPL-3.0.
  4. *Prohibited (Release Blocker):* SSPL, BSL, Commons Clause, or non-commercial licenses.

---

## 9. Gate 7 — CI Completeness & Test Reliability

- **Owner:** CI / Platform Engineer  
- **Priority:** **P1 (Mandatory Release Gate)**  
- **Initial Status:** `PENDING — Not yet verified`  
- **Required Artifacts:**  
  - `evidence/release/<release-id>/ci/required-gates.md`  
  - CI execution logs & run URLs  
  - `evidence/release/<release-id>/ci/repeated-runs-summary.md`

### 9.1 The 10 Canonical CI Stages
Verify that `.github/workflows/ci.yml` strictly enforces all 10 distinct quality stages:

| Stage # | Stage Name | Canonical Command / Action | Purpose |
| :---: | :--- | :--- | :--- |
| **1** | **Checkout & Toolchain** | `actions/checkout@v4`, `actions/setup-node@v4` (Node 22), Corepack `pnpm@11.25.0` | Pin identical environment baseline |
| **2** | **Monorepo Dependency Freeze** | `pnpm install --frozen-lockfile` | Enforce lockfile immutability |
| **3** | **Monorepo Typecheck** | `pnpm run check` (`turbo run check`) | Type safety across all workspace packages |
| **4** | **Unit & Domain Tests** | `pnpm test` (`turbo run test`) | Vitest domain/AI/assessment unit tests |
| **5** | **CSS & Svelte Stylelint** | `pnpm run lint:css` | CSS syntax & token linting in web app |
| **6** | **Validator Negative Test** | `pnpm run design:audit:test` | Validates audit script catches intentional bugs |
| **7** | **WAY 2.1 Design Audit** | `pnpm run design:audit` | Enforces 0/4/8px radius, OKLCH tokens, 4/8px spacing |
| **8** | **Storybook Build** | `pnpm run build-storybook` | Compiles UI component stories |
| **9** | **Production Build** | `pnpm run build` (`turbo run build`) | Compiles all 5 workspace packages for production |
| **10** | **Playwright E2E Suite** | `pnpm --filter web test:e2e` | End-to-end integration across Chrome & Mobile Chrome |

> **Note on Test Counts:** Test counts from the initial repository audit (55 unit tests, 19 component stories, 104 Playwright tests) represent baseline inventory metrics from that commit. Release acceptance is based on **100% test execution, zero failures, zero skipped tests, and zero flaky retries**, not rigid hardcoded counts.

### 9.2 Branch Protection Invariants on `main`
- All 10 CI stages must be designated as **required status checks** in GitHub repository settings.
- Pull requests must be up to date with `main` before merging.
- Direct pushes and administrator bypasses are strictly disabled.
- Merges require passing status checks and at least one approved code review.

### 9.3 Multi-Run Reliability Procedure & Deterministic Fixtures
To validate the claim of zero flakiness:
1. Execute **5 consecutive full-suite Playwright runs** against a production build preview (`pnpm preview`):
   ```bash
   pnpm --filter web test:e2e
   ```
2. **Deterministic Test Data Policy:** Eliminate random contact numbers or timestamps used to bypass rate limits. Use deterministic, seeded test accounts with isolated tenant namespaces to ensure failures are 100% reproducible.
3. Record duration, retries, worker count, and network timings for each run. Any test requiring retries must be investigated for race conditions.

---

## 10. Gate 9 — Operational Readiness, Resilience & Sandbox Security

- **Owner:** Platform / DevOps Lead (Reviewed by Security Lead)  
- **Priority:** **P0 (Mandatory Operational Blocker)**  
- **Initial Status:** `PENDING — Not yet verified`  
- **Required Artifacts:**  
  - `evidence/release/<release-id>/operations/operational-readiness.md`  
  - `evidence/release/<release-id>/operations/disaster-recovery.log`  
  - `evidence/release/<release-id>/operations/sandbox-isolation.md`  
  - Migration & rollback rehearsal logs

### 10.1 Operational Readiness Checkpoints

| Checkpoint ID | Operational Area | Verification Requirement & Measurable Acceptance Target | Priority |
| :--- | :--- | :--- | :---: |
| **OPS-01** | **Database Migration & Rollback** | Execute forward migrations on clean DB baseline; rehearse additive expand-and-contract forward-fix scripts. Destructive backward rollbacks (`DROP COLUMN/TABLE`) prohibited in production. | **P0** |
| **OPS-02** | **Backup & Disaster Recovery** | Restore snapshot into isolated PostgreSQL sandbox; verify schema consistency and row counts. **Proposed SLO: RPO $\le 1$ hour; RTO $\le 30$ minutes** (validated via rehearsal drill). Key recovery verified via IAM access policies without plaintext disclosure. | **P0** |
| **OPS-03** | **Operational Monitoring & Alerting** | Verify Prometheus/Sentry/Cloudflare alerting for elevated 5xx errors, auth failures, CAT assessment aborts, Trigger.dev job failures, and RLS denial spikes. | **P1** |
| **OPS-04** | **AI Provider Failure Modes** | Simulate Google Gemini / OpenAI timeouts, HTTP 429 rate limits, and malformed outputs. Verify graceful UI degradation **without fabricating assessment scores**. | **P0** |
| **OPS-05** | **Capacity & Load Model** | 50 virtual users executing 60% Read / 25% Assessment / 10% Evidence / 5% Consent verify mix over 5 minutes (60s ramp). Evaluated at end-to-end HTTP boundary. **Target: Reads P95 $\le 400$ms, P99 $\le 800$ms; Scoring P95 $\le 600$ms, P99 $\le 1,200$ms; 0.00% 5xx server errors; $< 0.05\%$ unhandled exceptions.** | **P1** |
| **OPS-06** | **Feature Flags & Defaults** | Audit production environment variables (`.env.production`); ensure dev flags (`CREED_DEV_AUTOLOGIN`, mock auth, debug routes) are strictly disabled. | **P0** |
| **OPS-07** | **Data Retention & Right-to-Erasure** | Verified DPDP account erasure workflow distinguishing active operational records (synchronous purge), derived profiles (synchronous purge), caches ($\le 2$s eviction), and legally justified transaction audit logs. Backups expire via rolling lifecycle retention; restored databases must re-apply deletion manifests. | **P0** |
| **OPS-08** | **Robotics Sandbox Isolation** | In `BrowserIDE.svelte`: Pyodide WebAssembly worker executes with strict watchdogs (5,000ms CPU timeout termination), zero access to DOM/cookies, and cannot access network origins or secrets. | **P0** |

### 10.2 Operational Failure-Recovery Rehearsal Drills
Before production release, each critical failure scenario must be validated through an empirical rehearsal drill:

| Scenario ID | Failure Injection Scenario | Rehearsal Method & Recovery Strategy | Verifiable Acceptance Evidence | Target Objective |
| :---: | :--- | :--- | :--- | :---: |
| **DRILL-01** | Database Migration Failure | Inject syntax/constraint error during migration execution in staging replica. | Schema rolls back cleanly; application executes forward-fix script without data loss or corruption. | Zero data loss; schema consistent |
| **DRILL-02** | Disaster Recovery Restoration | Trigger automated snapshot restore to an isolated PostgreSQL staging instance. | Restore transcript logged; schema checksums and table row counts match pre-restore state. | **RPO $\le 1$ hour; RTO $\le 30$ minutes** |
| **DRILL-03** | AI Provider Outage / Rate Limit | Simulate HTTP 429 and connection timeout on Gemini Live API endpoints. | Socratic mentor falls back to guided rule-based reflection prompts; assessment scores are never fabricated. | Graceful degradation; zero score spoofing |
| **DRILL-04** | Identity / Consent Service Outage | Disconnect PostgreSQL auth or mock network partition on identity provider. | System fails closed: protected learner routes return HTTP 503 / 403; no unauthenticated access granted. | 100% fail-closed enforcement |
| **DRILL-05** | Background Job Worker Failure | Force-kill Trigger.dev worker process mid-execution during batch report generation. | Job checkpoints safely; re-queued worker resumes idempotently without duplicate evidence records. | Idempotent resume; zero duplicates |
| **DRILL-06** | Event Bus / Cache Outage | Terminate Redis cache instance during active learner assessment session. | SvelteKit server routes fall back to direct primary database queries; authorization remains intact. | Zero authorization bypass |
| **DRILL-07** | Production Deployment Regression | Deploy intentional health-check failure build to staging environment. | Container orchestrator detects failed health probes; cancels rollout; traffic routes to previous healthy release. | Zero downtime rollback |

### 10.3 Dedicated Pyodide WebAssembly Sandbox Security Model & Penetration Suite

#### 1. Architectural Security Boundary
The robotics code execution environment in `BrowserIDE.svelte` executes untrusted user Python code inside a dedicated Web Worker (`/workers/pyodide.worker.js`) with WebAssembly. This sandbox is governed by:
- **Restricted Worker Scope:** The worker context has no access to the parent page DOM, `window`, `document`, cookies, `localStorage`, `sessionStorage`, or authentication tokens.
- **Isolated MessageChannel:** Communication occurs strictly via structured cloning over `postMessage`.
- **Restrictive Content Security Policy (CSP):** The deployment environment enforces:
  `script-src 'self' 'wasm-unsafe-eval'; connect-src 'none'; worker-src 'self' blob:;`
- **Minimum Capability Principle:** The worker receives only the synthetic robot sensor inputs required for the coding mission, with zero external system interfaces.

#### 2. Resource Budgets & Quotas
- **CPU Watchdog:** 5,000ms hard execution limit. A timer in the parent page terminates the worker if execution does not complete within the budget.
- **Memory Quota:** Worker process terminated if memory allocation exceeds 128 MB.
- **Output Truncation:** Stdout and stderr streams are throttled and capped at 64 KB total buffer size to prevent browser UI freezing via buffer flood attacks (`print("A" * 1000000)`).
- **Concurrency Cap:** Maximum 1 active worker per browser tab. Starting a new run terminates any existing worker immediately.

#### 3. Sandbox Penetration Attack Matrix

| Test ID | Penetration Vector | Attack Payload / Method | Expected Security Outcome |
| :---: | :--- | :--- | :--- |
| **SANDBOX-01** | Outbound Network Access | Execute `import urllib.request; urllib.request.urlopen("https://evil.local")` or `js.fetch()`. | Request is blocked by CSP / worker network restriction; exception raised; zero network egress. |
| **SANDBOX-02** | DOM / Parent Window Access | Execute `import js; js.document.cookie` or `js.window.location`. | `ReferenceError` or `undefined` returned; worker has zero access to parent DOM or cookies. |
| **SANDBOX-03** | Storage & Token Probing | Attempt to read `js.localStorage`, `js.sessionStorage`, or indexed DB. | Access denied; tokens and session state remain completely unexposed. |
| **SANDBOX-04** | CPU Exhaustion Denial of Service | Execute infinite loop: `while True: pass`. | Parent watchdog fires at 5,000ms; calls `worker.terminate()`; UI displays execution timeout; browser remains responsive. |
| **SANDBOX-05** | Memory Exhaustion Attack | Execute heap exhaustion: `x = ["A"] * (10**9)`. | Out-of-memory exception handled or worker terminated; parent tab heap remains unaffected. |
| **SANDBOX-06** | Buffer Flood Attack | Execute rapid output loop: `while True: print("flood text")`. | Output buffer truncates at 64 KB; stream throttled; parent rendering thread does not crash. |
| **SANDBOX-07** | MessageChannel Fuzzing | Dispatch malformed structured clone payloads and unexpected message types to worker. | Worker validates message format; drops invalid payloads without state corruption or uncaught exceptions. |
| **SANDBOX-08** | Delayed Output Suppression | Rapidly trigger execution, terminate worker, and start new execution. | Any late messages emitted from the terminated worker are dropped; delayed results are never attributed to subsequent executions. |

---

## 11. Gate 8 — Release Governance, Freshness & Sign-Off

- **Owner:** Release Manager  
- **Priority:** **P0 (Mandatory Sign-Off — Final Gate)**  
- **Initial Status:** `PENDING — Not yet verified`  
- **Required Artifacts:**  
  - `evidence/release/<release-id>/risks/risk-register.csv`  
  - `evidence/release/<release-id>/release-decision.md`

### 11.1 Governance Invariants
- **Strict Sequence Precondition:** Gate 8 is the final approval gate, executed **strictly after G1 through G7 and G9 have all completed verification**.
- **Evidence Freshness:** Every `PASS` record must identify the exact commit SHA, timestamp, environment, and reviewer. Any subsequent commit touching the gate's scope invalidates prior passes.
- **Finding Closure Standard:** A finding is not closed simply because a fix was committed; closure requires a reproducible regression test or objective verification output.
- **Distinction Between Blocker and Accepted Risk:**
  - **Release Blocker (Non-Waivable):** Any failure of a P0 security invariant (auth bypass, tenant isolation, DPDP consent bypass, raw IRT parameter exposure, scoring tampering, sandbox escape, critical CVE, or missing legal sign-off). **Mandatory blockers can NEVER be waived as accepted risk.**
  - **Accepted Risk (Formal Waiver):** Only non-critical, non-security, non-statutory defects with documented business justification, technical mitigation, time-bound remediation date, and explicit written approval by the Designated Release Authority in `evidence/release/<release-id>/risks/risk-register.csv`.
- **Evidence Repository Scrubbing:** Verification logs, PostgREST traces, and command outputs must be sanitized before saving to `evidence/release/`. Committing real student PII, production tokens, database passwords, or private encryption keys is strictly prohibited.

### 11.2 RACI Governance Matrix

| Workstream / Gate | Accountable Owner | Required Reviewer(s) | Status |
| :--- | :--- | :--- | :--- |
| **G1: Build Provenance & Artifacts** | Release Engineer | Engineering Lead | `PENDING` |
| **G2: Production Auth & Consent** | Security Engineer | Privacy / Legal Counsel | `PENDING` |
| **G3: Supabase RLS & Isolation** | Database Engineer | Security Reviewer | `PENDING` |
| **G4: Psychometric Confidentiality** | Assessment Lead | Security & Product Leads | `PENDING` |
| **G5: Accessibility & WAY 2.1** | Design-System Lead | Accessibility Reviewer | `PENDING` |
| **G6: SBOM & Licensing** | Engineering Lead | Security & Legal Reviewers | `PENDING` |
| **G7: CI & Test Reliability** | CI / Platform Engineer | Release Engineer | `PENDING` |
| **G9: Operational Readiness & Sandbox** | Platform / DevOps Lead | Security Lead | `PENDING` |
| **G8: Final Release Sign-Off** | **Designated Release Authority** | All Workstream Leads | `PENDING` |

---

## 12. Master P0 Invariant-to-Test Traceability Matrix

| Invariant ID | Security / Safety Invariant | Test ID / Drill ID | Required Evidence Artifact | Accountable Owner | Blocker? |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **INV-SEC-01** | Unauthenticated request confidentiality | `SEC-01` | `evidence/release/<id>/security/auth-matrix.csv` | Security Engineer | **YES** |
| **INV-SEC-02** | Server-authoritative session (No role forgery) | `SEC-02` | `evidence/release/<id>/security/production-negative-tests.md` | Security Engineer | **YES** |
| **INV-SEC-03** | Horizontal tenant & learner isolation (No IDOR) | `SEC-03, 10, 11` | `evidence/release/<id>/security/production-negative-tests.md` | Security Engineer | **YES** |
| **INV-SEC-04** | Complete dev-auth rejection in production | `SEC-05` | `evidence/release/<id>/security/production-negative-tests.md` | Security Engineer | **YES** |
| **INV-SEC-05** | Statutory minor consent gating (DPDP Sec 9) | `SEC-06, 07` | `evidence/release/<id>/security/consent-lifecycle.md` | Security Engineer | **YES** |
| **INV-SEC-06** | Distributed consent revocation propagation | `SEC-09` | `evidence/release/<id>/security/consent-lifecycle.md` | Security Engineer | **YES** |
| **INV-SEC-07** | Zero client signed URLs for sensitive records | `SEC-17` | `evidence/release/<id>/security/production-negative-tests.md` | Platform Lead | **YES** |
| **INV-DB-01** | Dual-tier Supabase RLS isolation (SQL + PostgREST) | `RLS-01–11` | `evidence/release/<id>/security/rls-test-results.md` | Database Engineer | **YES** |
| **INV-PSY-01** | Psychometric confidentiality (zero 3PL / $\theta$ leak) | `PSY-01–04` | `evidence/release/<id>/psychometrics/data-exposure-matrix.md` | Assessment Lead | **YES** |
| **INV-PSY-02** | Server-authoritative deterministic scoring | `PSY-02` | `evidence/release/<id>/psychometrics/data-exposure-matrix.md` | Assessment Lead | **YES** |
| **INV-PSY-03** | AI context pre-filtering (parameters stripped pre-LLM) | `PSY-03` | `evidence/release/<id>/psychometrics/data-exposure-matrix.md` | Assessment Lead | **YES** |
| **INV-OPS-01** | Additive DB migration & rollback rehearsal | `OPS-01, DRILL-01` | `evidence/release/<id>/operations/operational-readiness.md` | DevOps Lead | **YES** |
| **INV-OPS-02** | Backup recovery validation (RPO $\le 1$h / RTO $\le 30$m) | `OPS-02, DRILL-02` | `evidence/release/<id>/operations/disaster-recovery.log` | DevOps Lead | **YES** |
| **INV-OPS-03** | AI provider outage resilience (no score fabrication) | `OPS-04, DRILL-03` | `evidence/release/<id>/operations/operational-readiness.md` | DevOps Lead | **YES** |
| **INV-OPS-04** | WebAssembly Pyodide WebWorker sandbox isolation | `OPS-08, SANDBOX-01–08` | `evidence/release/<id>/operations/sandbox-isolation.md` | Security Engineer | **YES** |
| **INV-GOV-01** | Legal counsel statutory sign-off on DPDP compliance | `G8 Sign-off` | `evidence/release/<id>/release-decision.md` | Privacy Counsel | **YES** |

---

## 13. Evidence Repository Structure & Release-Scoped Manifest Architecture

Scaffolded under [`evidence/release/`](file:///c:/learning/evidence/release/README.md):

```text
evidence/
└── release/
    ├── index.json                        # Append-only master index of all release verification runs
    └── <release-id>/                     # e.g., v1.0.0-rc1 (Release-scoped evidence directory)
        ├── manifest.json                 # Machine-readable release verification manifest
        ├── build-provenance.md           # G1: Commit SHA, toolchains, hashes, CI URL
        ├── command-results/              # Raw terminal execution outputs
        ├── ci/
        │   ├── required-gates.md         # G7: CI pipeline verification
        │   └── repeated-runs-summary.md  # G7: Multi-run E2E stability log
        ├── security/
        │   ├── threat-model.md           # G2: System trust boundaries & threats
        │   ├── auth-matrix.csv           # G2: Endpoint authorization audit
        │   ├── consent-lifecycle.md      # G2: DPDP consent state machine tests
        │   ├── production-negative-tests.md # G2: Adversarial bypass tests
        │   ├── rls-test-results.md       # G3: Database tenant isolation tests
        │   └── policy-inventory.sql      # G3: Catalog of active Supabase policies
        ├── psychometrics/
        │   └── data-exposure-matrix.md   # G4: Parameter leak audit & AST scans
        ├── accessibility/
        │   ├── accessibility-results.md  # G5: axe-core audit & WCAG AA manual log
        │   └── keyboard-defect-log.md    # G5: Focus & tab order verification
        ├── visual-regression/
        │   └── viewports/                # G5: Screenshots (375px, 768px, 1280px)
        ├── supply-chain/
        │   ├── sbom.cdx.json             # G6: Pinned CycloneDX SBOM
        │   ├── vulnerability-scan.json   # G6: pnpm audit output
        │   ├── scan-metadata.yaml        # G6: Scanner exit codes & versions
        │   └── license-review.md         # G6: Open source license evaluation
        ├── operations/
        │   ├── operational-readiness.md  # G9: Migrations, monitoring, load test
        │   ├── sandbox-isolation.md      # G9: Pyodide worker security audit
        │   └── disaster-recovery.log     # G9: Backup restore verification (RPO/RTO)
        ├── risks/
        │   └── risk-register.csv         # G8: Master finding & risk ledger
        └── release-decision.md           # G8: Final sign-off document
```

---

## 14. Recommended Execution Sequence

```text
Stage A: Freeze Baseline & Provenance (G1)
  └── Check out exact commit SHA, verify clean worktree (git status --porcelain), freeze dependencies, record toolchain.
Stage B: Baseline Code Quality & CI Pipeline (G1, G7)
  └── Run frozen install, typechecking, domain unit tests, stylelint, design audits, Storybook, production build, CI audit.
Stage C: Adversarial Security & Database Isolation (G2, G3)
  └── Execute production-mode auth bypass tests, DPDP consent attacks, dual-tier Supabase RLS tests (SQL + PostgREST).
Stage D: Confidentiality, Accessibility & Supply Chain (G4, G5, G6)
  └── Inspect psychometric information flows, run axe-core tests, test reduced motion, generate pinned CycloneDX SBOM.
Stage E: Operational Resilience & Sandbox Security (G9)
  └── Rehearse database migrations & forward-fixes, verify backup restoration, test AI fallbacks, verify Pyodide sandbox isolation.
Stage F: Release Governance Sign-Off (G8)
  └── Reconcile findings in Risk Register, confirm zero P0 blockers, secure accountable release authority signature.
```

---

## 15. Master Verification Tracker

> **Current Overall Status:** **`VERIFICATION PENDING`**  
> *All 9 verification gates awaiting independent execution, evidence collection, and reviewer verification.*

| Gate ID | Gate Name | Accountable Owner | Status | Required Evidence Artifact |
| :--- | :--- | :--- | :---: | :--- |
| **G1** | **Reproducible Build & Provenance** | Release Engineer | `PENDING` | `evidence/release/<release-id>/build-provenance.md` |
| **G2** | **Production Auth & Consent Gating** | Security Engineer | `PENDING` | `evidence/release/<release-id>/security/auth-matrix.csv` |
| **G3** | **Database RLS & Tenant Isolation** | Database Engineer | `PENDING` | `evidence/release/<release-id>/security/rls-test-results.md` |
| **G4** | **Psychometric Confidentiality** | Assessment Lead | `PENDING` | `evidence/release/<release-id>/psychometrics/data-exposure-matrix.md` |
| **G5** | **Accessibility, UX & WAY 2.1** | Design-System Lead | `PENDING` | `evidence/release/<release-id>/accessibility/accessibility-results.md` |
| **G6** | **Supply-Chain SBOM & Licensing** | Engineering Lead | `PENDING` | `evidence/release/<release-id>/supply-chain/sbom.cdx.json` |
| **G7** | **CI Completeness & Test Stability** | CI / Platform Engineer | `PENDING` | `evidence/release/<release-id>/ci/repeated-runs-summary.md` |
| **G9** | **Operational Readiness & Sandbox** | Platform / DevOps Lead | `PENDING` | `evidence/release/<release-id>/operations/operational-readiness.md` |
| **G8** | **Release Governance & Sign-Off** | Release Manager | `PENDING` | `evidence/release/<release-id>/release-decision.md` |

---

## 16. Final Acceptance Rule

CREED OS is certified as **Production Ready** if and only if **every mandatory gate (G1 through G7 and G9) is verified with tangible, independently reproducible evidence in `evidence/release/<release-id>/`**, all release-blocking conditions are cleared, legal counsel provides formal written sign-off on statutory DPDP compliance, and the Designated Release Authority formally signs Gate 8 (`release-decision.md`).

Until then, the canonical product state is **`VERIFICATION PENDING`**.
