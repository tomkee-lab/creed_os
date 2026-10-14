-- ==============================================================================
-- Migration: 20261014000001_complete_rls_and_consent_hardening.sql
-- Domain: Gate 2 — Supabase PostgreSQL Row Level Security (RLS) & DPDP Act 2023 Consent Hardening
-- Standards: PostgreSQL 16, Supabase RLS, DPDP Act 2023 Statutory Protection
-- ==============================================================================

-- 1. Helper function for verifying active statutory guardian consent
create or replace function public.has_active_guardian_consent(
  p_guardian_id uuid,
  p_learner_id uuid
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from consents c
    join parent_learner_links pll on pll.learner_id = c.learner_id and pll.parent_id = c.guardian_id
    where c.guardian_id = p_guardian_id
      and c.learner_id = p_learner_id
      and c.status = 'verified'
      and (c.withdrawn_at is null)
      and (c.expires_at is null or c.expires_at > now())
  );
$$;

-- 2. Consents Table Policies
-- Guardian can view consents they issued
create policy "Guardians can view consents they granted"
  on consents for select
  using (guardian_id = auth.uid());

-- Learners can view statutory consents governing their own profile
create policy "Learners can view consents for their profile"
  on consents for select
  using (learner_id = auth.uid());

-- Teachers / institute staff can verify consent status for learners in their shared organization
create policy "Staff can check learner consent in shared organization"
  on consents for select
  using (
    exists (
      select 1 from organization_memberships staff_mem
      join organization_memberships learner_mem on learner_mem.organization_id = staff_mem.organization_id
      where staff_mem.user_id = auth.uid()
        and staff_mem.role in ('teacher', 'counselor', 'institute_staff', 'institute_admin')
        and learner_mem.user_id = consents.learner_id
    )
  );

-- 3. Assessment Sessions RLS Policies
-- Learner can view own assessment sessions
create policy "Learners can view own assessment sessions"
  on assessment_sessions for select
  using (learner_id = auth.uid());

-- Verified guardian can view child's assessment sessions (with active statutory consent)
create policy "Verified guardians can view child assessment sessions"
  on assessment_sessions for select
  using (public.has_active_guardian_consent(auth.uid(), assessment_sessions.learner_id));

-- Educators in same organization can view student assessment sessions
create policy "Educators can view cohort assessment sessions"
  on assessment_sessions for select
  using (
    exists (
      select 1 from organization_memberships staff_mem
      where staff_mem.user_id = auth.uid()
        and staff_mem.organization_id = assessment_sessions.organization_id
        and staff_mem.role in ('teacher', 'counselor', 'institute_staff', 'institute_admin')
    )
  );

-- Strict mutation policy: Learners can only update their own in-progress sessions
create policy "Learners can update own in-progress sessions"
  on assessment_sessions for update
  using (
    learner_id = auth.uid()
    and status in ('in_progress', 'paused')
  )
  with check (
    learner_id = auth.uid()
  );

-- 4. Assessment Responses RLS Policies
-- Learner can view own responses
create policy "Learners can view own assessment responses"
  on assessment_responses for select
  using (
    exists (
      select 1 from assessment_sessions s
      where s.id = assessment_responses.session_id
        and s.learner_id = auth.uid()
    )
  );

-- Verified guardians can view child responses
create policy "Guardians can view child assessment responses"
  on assessment_responses for select
  using (
    exists (
      select 1 from assessment_sessions s
      where s.id = assessment_responses.session_id
        and public.has_active_guardian_consent(auth.uid(), s.learner_id)
    )
  );

-- Teachers can view assessment responses in their organization
create policy "Educators can view cohort assessment responses"
  on assessment_responses for select
  using (
    exists (
      select 1 from assessment_sessions s
      join organization_memberships staff_mem on staff_mem.organization_id = s.organization_id
      where s.id = assessment_responses.session_id
        and staff_mem.user_id = auth.uid()
        and staff_mem.role in ('teacher', 'counselor', 'institute_staff', 'institute_admin')
    )
  );

-- Learners can insert responses to their own in-progress sessions
create policy "Learners can submit responses to own in-progress sessions"
  on assessment_responses for insert
  with check (
    exists (
      select 1 from assessment_sessions s
      where s.id = assessment_responses.session_id
        and s.learner_id = auth.uid()
        and s.status = 'in_progress'
    )
  );

-- 5. Audit Logs RLS Policy (Strict Least Privilege)
-- Regular authenticated clients cannot read raw audit logs; server-only via service_role
create policy "Platform administrators can view audit logs"
  on audit_logs for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role = 'platform_admin'
    )
  );

-- Append-only for authenticated actions
create policy "Authenticated users can insert audit logs"
  on audit_logs for insert
  with check (user_id = auth.uid());
