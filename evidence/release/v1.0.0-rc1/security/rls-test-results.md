# CREED OS — Supabase PostgreSQL Row Level Security (RLS) Test Evidence
**Release ID:** `v1.0.0-rc1`  
**Test Harness Script:** [`supabase/tests/rls_test_harness.sql`](file:///c:/learning/supabase/tests/rls_test_harness.sql)  
**Database Engine:** PostgreSQL 16.0 (Supabase RLS enabled across all sensitive tables)  
**Status:** **`PASS — Verified`**

---

## 1. Positive Controls Summary (Proving Authorized Paths Function)

| Control ID | Evaluated Authorization Path | Invariant Expected | Measured Result | Status |
|---|---|---|:---:|:---:|
| **POS-01** | Student A reads own evidence | Exactly 1 row returned | 1 row returned | **PASS** |
| **POS-02** | Parent A reads linked Student A evidence (verified consent) | Exactly 1 row returned | 1 row returned | **PASS** |
| **POS-03** | Teacher 1 reads Student A evidence (same organization Org 1) | Exactly 1 row returned | 1 row returned | **PASS** |
| **POS-04** | Tenant Admin 1 queries Org 1 memberships | Exactly 3 rows returned | 3 rows returned | **PASS** |
| **POS-05** | Student A executes `verify_assessment_session` on own session | Exactly 1 row returned | 1 row returned | **PASS** |
| **POS-06** | Student A reads own profile | Exactly 1 row returned | 1 row returned | **PASS** |

---

## 2. Negative Controls Summary (Adversarial Security Attack Invariants)

| Control ID | Threat Vector Tested | Invariant Expected | Measured Result | Status |
|---|---|---|:---:|:---:|
| **NEG-01** | Student A queries Student B evidence | Exactly 0 rows returned | 0 rows returned | **PASS** |
| **NEG-02** | Student A attempts to mutate Student B assessment session | Exactly 0 rows updated | 0 rows updated | **PASS** |
| **NEG-03** | Parent A queries Student B evidence (unlinked child) | Exactly 0 rows returned | 0 rows returned | **PASS** |
| **NEG-04** | Teacher 1 queries Org 2 evidence (cross-tenant) | Exactly 0 rows returned | 0 rows returned | **PASS** |
| **NEG-05** | Tenant Admin 1 queries Org 2 memberships | Exactly 0 rows returned | 0 rows returned | **PASS** |
| **NEG-06** | Anonymous unauthenticated user attempts to read evidence | Exactly 0 rows returned | 0 rows returned | **PASS** |
| **NEG-07** | Revoked consent blocks Parent A from reading Student A evidence | Exactly 0 rows returned | 0 rows returned | **PASS** |
| **NEG-08** | Student A attempts to insert response to Student B session | Blocked with policy check | 0 rows inserted | **PASS** |
| **NEG-09** | Regular authenticated user attempts to query raw audit logs | Exactly 0 rows returned | 0 rows returned | **PASS** |
| **NEG-10** | Student A calls `verify_assessment_session` for Student B | Exactly 0 rows returned | 0 rows returned | **PASS** |
| **NEG-11** | Student A attempts to read Student B's profile | Exactly 0 rows returned | 0 rows returned | **PASS** |

---

## 3. Database Catalog Policy Coverage
- `profiles`: RLS enabled (own profile read/update)
- `organization_memberships`: RLS enabled (same-tenant read)
- `parent_learner_links`: RLS enabled (parent and learner read)
- `consents`: RLS enabled (guardian, learner, and shared-org staff read)
- `assessment_sessions`: RLS enabled (learner, verified guardian, cohort staff)
- `assessment_responses`: RLS enabled (learner, verified guardian, cohort staff)
- `learner_evidence`: RLS enabled (learner, verified guardian with active consent, cohort teacher)
- `audit_logs`: RLS enabled (platform admin read, append-only user insert)
