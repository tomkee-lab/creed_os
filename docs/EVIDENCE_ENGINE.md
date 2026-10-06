# Core_OS — Learner Evidence Graph Specification

**Document Version:** 1.0.0  
**Status:** Core Data Architecture  
**Audience:** Data Engineers, Pedagogy Architects, AI Developers  

---

## 1. Architectural Role of Evidence

In conventional education software, student mastery is represented as a static integer or float (`mastery_percentage: 85%`) updated destructively in place. This creates a black box: teachers and parents cannot see *why* the number changed, what context generated it, or how recently it was proven.

Core_OS introduces the **Longitudinal Learner Evidence Graph**. Every competency estimate, strength assertion, or foundation gap is a projection derived from a collection of immutable, verifiable evidence atoms:

```text
       Diagnostic Item Response ──► [ Evidence Atom #104 (L3, Conf 0.85) ]
                                                       │
       Bridge Project Mission   ──► [ Evidence Atom #212 (L4, Conf 0.92) ] ──► Competency: Spatial Reasoning
                                                       │                        (Level 4.2 / High Confidence)
       Teacher Classroom Obs    ──► [ Evidence Atom #305 (L4, Conf 0.88) ]
```

---

## 2. Evidence Database Schema

```sql
create table learner_evidence (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  
  -- Taxonomic classification
  competency_id uuid not null references competencies(id),
  skill_id uuid references skills(id),
  
  -- Evidence provenance & classification
  evidence_type text not null,       -- 'diagnostic_response', 'project_rubric', 'teacher_observation', 'reflection_synthesis'
  source_type text not null,         -- 'cat_assessment', 'project_mission', 'classroom', 'voice_mentor'
  source_id uuid,                    -- Foreign key to assessment_session, project_attempt, etc.
  
  -- The quantitative or qualitative observation payload
  observed_value jsonb not null,     -- e.g. {"theta": 1.42, "se": 0.28, "misconceptions": []}
  
  -- Psychometric strength & statistical confidence
  confidence numeric(5,4) not null,  -- Computed certainty: 0.0000 to 1.0000
  evidence_strength smallint not null check (evidence_strength between 1 and 5),
  
  -- State machine & privacy scoping
  status text not null default 'candidate' 
    check (status in ('candidate', 'validated', 'accepted', 'contested', 'superseded', 'expired')),
  visibility text not null default 'private' 
    check (visibility in ('private', 'learner_only', 'guardian', 'teacher', 'organization_admin')),
    
  observed_at timestamptz not null default now(),
  expires_at timestamptz,            -- Evidence decays over time if not refreshed (e.g. 180 days for foundation skills)
  created_at timestamptz not null default now()
);

create index idx_learner_evidence_query on learner_evidence (learner_id, competency_id, status, observed_at desc);
create index idx_learner_evidence_org on learner_evidence (organization_id);
```

---

## 3. Evidence State Machine

AI-generated reflections or raw observational signals must never jump directly into authoritative learner states without passing through validation gates:

```text
 ┌───────────────┐
 │   Candidate   │ ◄── Emitted by AI observation agent or uncalibrated practice task
 └───────┬───────┘
         │
         ├─── Verified by psychometric scoring engine OR teacher confirmation
         ▼
 ┌───────────────┐
 │   Validated   │ ◄── Fully verified psychometric assessment or teacher rubric
 └───────┬───────┘
         │
         ├─── Aggregated into the longitudinal profile
         ▼
 ┌───────────────┐
 │   Accepted    │ ◄── Active ground truth informing pathway readiness & recommendations
 └───────┬───────┘
         │
         ├─── Replaced by newer, higher-information assessment (or expired)
         ▼
 ┌───────────────┐
 │  Superseded   │ ◄── Archived for longitudinal growth modeling
 └───────────────┘
```

---

## 4. The 5-Level Strength Hierarchy

Every piece of evidence carries an explicit level:

1. **Level 1 (Self-Report):** Expressed student interest ("I enjoy designing 3D models"). Weight = 0.20.
2. **Level 2 (Questionnaire):** Systematic interest/value inventory or preference matrix. Weight = 0.40.
3. **Level 3 (Structured Diagnostic):** Server-evaluated 3PL IRT adaptive assessment under controlled constraints. Weight = 0.80.
4. **Level 4 (Applied Task):** Rubric-graded authentic project mission artifact (e.g., working code, physical design submission, lab analysis). Weight = 0.90.
5. **Level 5 (Longitudinal Evidence):** Demonstrations sustained across multiple months and diverse contexts. Weight = 0.98.

---

## 5. Provenance Queries: Answering "Why?"

Because all evidence is preserved with references, any user persona can inspect the exact provenance of a recommendation:

```text
Question: "Why does Core_OS state that Student Anaya has strong Spatial Reasoning?"

Answer:
  1. Diagnostic Assessment Session #AS-894 (2026-09-12):
     - Correctly solved 4 out of 4 high-difficulty 3D orthographic projection items.
     - Latent θ: +1.85 (SE = 0.29). Evidence Strength: Level 3.
  2. Applied Project Mission "RoboBridge Challenge" (2026-09-24):
     - Submitted truss design with optimal load distribution (Weight ratio: 4.8x).
     - Rubric score: 96/100. Evidence Strength: Level 4.
  3. Teacher Observation by Mr. Sharma (2026-10-01):
     - Logged independent geometric visualization during class challenge.
     - Evidence Strength: Level 4.
```

This transforms career guidance from an inscrutable proprietary algorithm into an open, auditable dialogue with parents and students.
