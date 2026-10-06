-- Core_OS Production PostgreSQL 16 Initial Schema
-- Supports multi-tenancy, competency graphs, CAT psychometrics, evidence provenance, and DPDP Act consent

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Identity & Profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('student', 'parent', 'teacher', 'counselor', 'institute_staff', 'institute_admin', 'platform_admin')),
  age smallint,
  grade_band text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Organizations & Memberships
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null check (type in ('school', 'coaching_institute', 'academy', 'district')),
  framework_preference text default 'PARAKH',
  created_at timestamptz not null default now()
);

create table if not exists organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- 3. Parent-Child Relationship & Verified Consent (DPDP Act)
create table if not exists parent_learner_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references profiles(id) on delete cascade,
  learner_id uuid not null references profiles(id) on delete cascade,
  relationship text not null check (relationship in ('father', 'mother', 'legal_guardian')),
  created_at timestamptz not null default now(),
  unique (parent_id, learner_id)
);

create table if not exists consents (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  guardian_id uuid not null references profiles(id),
  consent_type text not null check (consent_type in ('account_creation', 'assessment_participation', 'voice_mentor', 'institution_sharing')),
  status text not null default 'pending' check (status in ('pending', 'verified', 'withdrawn', 'expired')),
  verification_method text not null,
  ip_address inet,
  policy_version text not null,
  verified_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now()
);

-- 4. Competencies & Prerequisite Taxonomy
create table if not exists competencies (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  code text unique not null,
  name text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  competency_id uuid not null references competencies(id) on delete cascade,
  code text unique not null,
  title text not null,
  description text not null,
  difficulty_baseline numeric(4,2) default 0.00
);

create table if not exists skill_prerequisites (
  skill_id uuid not null references skills(id) on delete cascade,
  prerequisite_skill_id uuid not null references skills(id) on delete cascade,
  strength text not null check (strength in ('mandatory', 'recommended', 'extension')),
  primary key (skill_id, prerequisite_skill_id)
);

-- 5. Assessment Item Pool & 3PL IRT Parameters
create table if not exists assessment_items (
  id text primary key,
  competency_id uuid not null references competencies(id),
  skill_id uuid references skills(id),
  code text not null,
  prompt text not null,
  stimulus_url text,
  explanation text not null,
  options jsonb not null,            -- [{"id": "opt-a", "text": "..."}]
  correct_option_id text not null,
  distractors jsonb not null,        -- [{"id": "opt-a", "misconceptionCode": "..."}]
  
  -- IRT parameters strictly unexposed to client
  irt_a numeric(4,2) not null,       -- discrimination
  irt_b numeric(4,2) not null,       -- difficulty
  irt_c numeric(4,2) not null,       -- guessing
  
  status text not null default 'calibrated' check (status in ('calibrated', 'experimental', 'retired')),
  created_at timestamptz not null default now()
);

-- 6. Assessment Sessions & Responses
create table if not exists assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  organization_id uuid references organizations(id),
  domain text not null default 'stem_reasoning',
  status text not null default 'initialized' check (status in ('initialized', 'in_progress', 'completed', 'paused', 'abandoned')),
  current_theta numeric(5,3) not null default 0.000,
  standard_error numeric(5,3) not null default 1.000,
  items_answered smallint not null default 0,
  administered_item_ids text[] default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists assessment_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references assessment_sessions(id) on delete cascade,
  item_id text not null references assessment_items(id),
  selected_option_id text not null,
  is_correct boolean not null,
  time_spent_seconds numeric(6,2),
  misconception_code text,
  theta_after numeric(5,3) not null,
  standard_error_after numeric(5,3) not null,
  created_at timestamptz not null default now()
);

-- 7. Learner Longitudinal Evidence Graph
create table if not exists learner_evidence (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  organization_id uuid references organizations(id),
  competency_id uuid not null references competencies(id),
  skill_id uuid references skills(id),
  evidence_type text not null,
  source_type text not null check (source_type in ('cat_assessment', 'project_mission', 'teacher_observation', 'voice_reflection', 'self_report', 'inventory_survey')),
  source_id text,
  source_title text not null,
  summary text not null,
  observed_value jsonb not null,
  confidence numeric(5,4) not null check (confidence between 0 and 1),
  evidence_strength smallint not null check (evidence_strength between 1 and 5),
  status text not null default 'candidate' check (status in ('candidate', 'validated', 'accepted', 'contested', 'superseded', 'expired')),
  visibility text not null default 'private' check (visibility in ('private', 'learner_only', 'guardian', 'teacher', 'organization_admin')),
  observed_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- 8. Pathways & Mismatch Missions
create table if not exists pathways (
  id text primary key,
  code text unique not null,
  title text not null,
  field text not null,
  tagline text not null,
  overview text not null,
  growth_outlook text not null,
  requirements jsonb not null,       -- [{"competency": "spatial_reasoning", "minimumLevel": 3.5}]
  routes jsonb not null,             -- [{"type": "university_degree", "title": "B.Tech Mechatronics"}]
  missions jsonb not null,           -- [{"missionId": "...", "title": "RoboBridge Challenge"}]
  created_at timestamptz not null default now()
);

-- 9. Transactional Outbox & Audit Logs
create table if not exists outbox_events (
  id uuid primary key default gen_random_uuid(),
  aggregate_type text not null,
  aggregate_id text not null,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  organization_id uuid references organizations(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  details jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);
