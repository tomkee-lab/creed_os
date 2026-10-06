-- Core_OS Row Level Security (RLS) Policies & Non-Enumerable RPC Functions

-- Enable RLS across all sensitive tables
alter table profiles enable row level security;
alter table organization_memberships enable row level security;
alter table parent_learner_links enable row level security;
alter table consents enable row level security;
alter table assessment_sessions enable row level security;
alter table assessment_responses enable row level security;
alter table learner_evidence enable row level security;
alter table audit_logs enable row level security;

-- 1. Profiles Policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- 2. Organization Isolation Policies
create policy "Members can view memberships in their organization"
  on organization_memberships for select
  using (
    organization_id in (
      select organization_id from organization_memberships where user_id = auth.uid()
    )
  );

-- 3. Parent-Child Relationship Gating
create policy "Parents can view linked children"
  on parent_learner_links for select
  using (parent_id = auth.uid());

create policy "Learners can view linked parents"
  on parent_learner_links for select
  using (learner_id = auth.uid());

-- 4. Evidence Access Policies
create policy "Learner can view own evidence"
  on learner_evidence for select
  using (learner_id = auth.uid());

create policy "Verified parent can view child evidence"
  on learner_evidence for select
  using (
    exists (
      select 1 from parent_learner_links pll
      join consents c on c.learner_id = pll.learner_id and c.guardian_id = pll.parent_id
      where pll.parent_id = auth.uid()
        and pll.learner_id = learner_evidence.learner_id
        and c.status = 'verified'
    )
  );

create policy "Teacher can view class member evidence"
  on learner_evidence for select
  using (
    visibility in ('teacher', 'organization_admin')
    and exists (
      select 1 from organization_memberships teacher_mem
      join organization_memberships student_mem on student_mem.organization_id = teacher_mem.organization_id
      where teacher_mem.user_id = auth.uid()
        and teacher_mem.role in ('teacher', 'institute_staff', 'institute_admin')
        and student_mem.user_id = learner_evidence.learner_id
    )
  );

-- 5. Non-Enumerable Stored Procedure for Verifying Assessment Token
create or replace function verify_assessment_session(
  p_session_id uuid,
  p_user_id uuid
)
returns table (
  session_id uuid,
  learner_id uuid,
  status text,
  current_theta numeric,
  standard_error numeric
)
language plpgsql
security definer
as $$
begin
  return query
  select s.id, s.learner_id, s.status, s.current_theta, s.standard_error
  from assessment_sessions s
  where s.id = p_session_id
    and s.learner_id = p_user_id;
end;
$$;
