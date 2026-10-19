-- ==============================================================================
-- Migration: 20261018000001_database_audit_hardening.sql
-- Description: Complete RLS Policies, Foreign Key Performance Indexes, and Security Definer Hardening
-- Alignment: CREED OS DPDP Act 2023 Statutory Minor Protection & Multi-Tenant Role Isolation
-- ==============================================================================

-- 1. Helper function for verifying active statutory guardian consent
CREATE OR REPLACE FUNCTION public.has_active_guardian_consent(
  p_guardian_id text,
  p_learner_id text
)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.consents c
    JOIN public.parent_learner_links pll ON pll.learner_id = c.learner_id AND pll.parent_id = c.guardian_id
    WHERE c.guardian_id = p_guardian_id
      AND c.learner_id = p_learner_id
      AND c.status = 'verified'
      AND (c.withdrawn_at IS NULL)
  );
$$;

-- 2. Harden mutable search_path on public functions
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (NEW.id, NEW.name, NEW.email, COALESCE(NEW.role, 'student'))
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.match_skills(query_embedding vector, match_threshold double precision, match_count integer)
RETURNS TABLE(id text, competency_id text, code text, title text, description text, similarity double precision)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT
    skills.id,
    skills.competency_id,
    skills.code,
    skills.title,
    skills.description,
    1 - (skills.embedding <=> query_embedding) AS similarity
  FROM skills
  WHERE 1 - (skills.embedding <=> query_embedding) > match_threshold
  ORDER BY skills.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 3. Restrict RPC Execution on Internal Security Definer Functions
REVOKE EXECUTE ON FUNCTION public.get_user_tenant_org_ids(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_educator_for_student_cohort(text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_org_staff_or_admin(text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_active_guardian_consent(text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated, public;

GRANT EXECUTE ON FUNCTION public.get_user_tenant_org_ids(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_educator_for_student_cohort(text, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_org_staff_or_admin(text, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_active_guardian_consent(text, text) TO authenticated, service_role;

-- 4. Create Covering Indexes on Foreign Keys (Performance Advisor Remediation)
CREATE INDEX IF NOT EXISTS idx_assessment_items_competency_id ON public.assessment_items(competency_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_item_id ON public.assessment_responses(item_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_session_id ON public.assessment_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_learner_id ON public.assessment_sessions(learner_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_organization_id ON public.assessment_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_consents_guardian_id ON public.consents(guardian_id);
CREATE INDEX IF NOT EXISTS idx_consents_learner_id ON public.consents(learner_id);
CREATE INDEX IF NOT EXISTS idx_invitation_inviterId ON public.invitation("inviterId");
CREATE INDEX IF NOT EXISTS idx_invitation_organizationId ON public.invitation("organizationId");
CREATE INDEX IF NOT EXISTS idx_learner_evidence_competency_id ON public.learner_evidence(competency_id);
CREATE INDEX IF NOT EXISTS idx_learner_evidence_learner_id ON public.learner_evidence(learner_id);
CREATE INDEX IF NOT EXISTS idx_learner_evidence_organization_id ON public.learner_evidence(organization_id);
CREATE INDEX IF NOT EXISTS idx_parent_learner_links_learner_id ON public.parent_learner_links(learner_id);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_skill_prerequisites_prereq_id ON public.skill_prerequisites(prerequisite_skill_id);
CREATE INDEX IF NOT EXISTS idx_skills_competency_id ON public.skills(competency_id);

-- 5. RLS Policies: Public Educational Taxonomy (Curriculum)
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read skill prerequisites" ON public.skill_prerequisites;
CREATE POLICY "Public read skill prerequisites" ON public.skill_prerequisites
  FOR SELECT USING (true);

-- 6. RLS Policies: Profiles
DROP POLICY IF EXISTS "profiles_select_self" ON public.profiles;
CREATE POLICY "profiles_select_self" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid())::text)
  WITH CHECK (id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "profiles_educator_select_cohort" ON public.profiles;
CREATE POLICY "profiles_educator_select_cohort" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_educator_for_student_cohort((SELECT auth.uid())::text, id));

DROP POLICY IF EXISTS "profiles_guardian_select_child" ON public.profiles;
CREATE POLICY "profiles_guardian_select_child" ON public.profiles
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.parent_learner_links pll
    WHERE pll.parent_id = (SELECT auth.uid())::text AND pll.learner_id = profiles.id
  ));

DROP POLICY IF EXISTS "profiles_service_role" ON public.profiles;
CREATE POLICY "profiles_service_role" ON public.profiles
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 7. RLS Policies: Parent Learner Links
DROP POLICY IF EXISTS "parent_learner_links_parent_select" ON public.parent_learner_links;
CREATE POLICY "parent_learner_links_parent_select" ON public.parent_learner_links
  FOR SELECT TO authenticated
  USING (parent_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "parent_learner_links_learner_select" ON public.parent_learner_links;
CREATE POLICY "parent_learner_links_learner_select" ON public.parent_learner_links
  FOR SELECT TO authenticated
  USING (learner_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "parent_learner_links_service_role" ON public.parent_learner_links;
CREATE POLICY "parent_learner_links_service_role" ON public.parent_learner_links
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 8. RLS Policies: Consents (DPDP Act Statutory Verifications)
DROP POLICY IF EXISTS "consents_guardian_select" ON public.consents;
CREATE POLICY "consents_guardian_select" ON public.consents
  FOR SELECT TO authenticated
  USING (guardian_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "consents_learner_select" ON public.consents;
CREATE POLICY "consents_learner_select" ON public.consents
  FOR SELECT TO authenticated
  USING (learner_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "consents_staff_select" ON public.consents;
CREATE POLICY "consents_staff_select" ON public.consents
  FOR SELECT TO authenticated
  USING (public.is_educator_for_student_cohort((SELECT auth.uid())::text, consents.learner_id));

DROP POLICY IF EXISTS "consents_guardian_insert" ON public.consents;
CREATE POLICY "consents_guardian_insert" ON public.consents
  FOR INSERT TO authenticated
  WITH CHECK (guardian_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "consents_guardian_update" ON public.consents;
CREATE POLICY "consents_guardian_update" ON public.consents
  FOR UPDATE TO authenticated
  USING (guardian_id = (SELECT auth.uid())::text)
  WITH CHECK (guardian_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "consents_service_role" ON public.consents;
CREATE POLICY "consents_service_role" ON public.consents
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 9. RLS Policies: Assessment Sessions
DROP POLICY IF EXISTS "assessment_sessions_learner_select" ON public.assessment_sessions;
CREATE POLICY "assessment_sessions_learner_select" ON public.assessment_sessions
  FOR SELECT TO authenticated
  USING (learner_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "assessment_sessions_guardian_select" ON public.assessment_sessions;
CREATE POLICY "assessment_sessions_guardian_select" ON public.assessment_sessions
  FOR SELECT TO authenticated
  USING (public.has_active_guardian_consent((SELECT auth.uid())::text, learner_id));

DROP POLICY IF EXISTS "assessment_sessions_educator_select" ON public.assessment_sessions;
CREATE POLICY "assessment_sessions_educator_select" ON public.assessment_sessions
  FOR SELECT TO authenticated
  USING (public.is_educator_for_student_cohort((SELECT auth.uid())::text, learner_id));

DROP POLICY IF EXISTS "assessment_sessions_learner_insert" ON public.assessment_sessions;
CREATE POLICY "assessment_sessions_learner_insert" ON public.assessment_sessions
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "assessment_sessions_learner_update" ON public.assessment_sessions;
CREATE POLICY "assessment_sessions_learner_update" ON public.assessment_sessions
  FOR UPDATE TO authenticated
  USING (learner_id = (SELECT auth.uid())::text AND status IN ('initialized', 'in_progress', 'paused'))
  WITH CHECK (learner_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "assessment_sessions_service_role" ON public.assessment_sessions;
CREATE POLICY "assessment_sessions_service_role" ON public.assessment_sessions
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 10. RLS Policies: Assessment Responses
DROP POLICY IF EXISTS "assessment_responses_learner_select" ON public.assessment_responses;
CREATE POLICY "assessment_responses_learner_select" ON public.assessment_responses
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.assessment_sessions s
    WHERE s.id = assessment_responses.session_id AND s.learner_id = (SELECT auth.uid())::text
  ));

DROP POLICY IF EXISTS "assessment_responses_guardian_select" ON public.assessment_responses;
CREATE POLICY "assessment_responses_guardian_select" ON public.assessment_responses
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.assessment_sessions s
    WHERE s.id = assessment_responses.session_id AND public.has_active_guardian_consent((SELECT auth.uid())::text, s.learner_id)
  ));

DROP POLICY IF EXISTS "assessment_responses_educator_select" ON public.assessment_responses;
CREATE POLICY "assessment_responses_educator_select" ON public.assessment_responses
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.assessment_sessions s
    WHERE s.id = assessment_responses.session_id AND public.is_educator_for_student_cohort((SELECT auth.uid())::text, s.learner_id)
  ));

DROP POLICY IF EXISTS "assessment_responses_learner_insert" ON public.assessment_responses;
CREATE POLICY "assessment_responses_learner_insert" ON public.assessment_responses
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.assessment_sessions s
    WHERE s.id = assessment_responses.session_id AND s.learner_id = (SELECT auth.uid())::text AND s.status = 'in_progress'
  ));

DROP POLICY IF EXISTS "assessment_responses_service_role" ON public.assessment_responses;
CREATE POLICY "assessment_responses_service_role" ON public.assessment_responses
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 11. RLS Policies: Learner Evidence
DROP POLICY IF EXISTS "learner_evidence_learner_select" ON public.learner_evidence;
CREATE POLICY "learner_evidence_learner_select" ON public.learner_evidence
  FOR SELECT TO authenticated
  USING (learner_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "learner_evidence_guardian_select" ON public.learner_evidence;
CREATE POLICY "learner_evidence_guardian_select" ON public.learner_evidence
  FOR SELECT TO authenticated
  USING (
    public.has_active_guardian_consent((SELECT auth.uid())::text, learner_id)
    AND visibility IN ('guardian', 'organization_admin', 'teacher')
  );

DROP POLICY IF EXISTS "learner_evidence_educator_select" ON public.learner_evidence;
CREATE POLICY "learner_evidence_educator_select" ON public.learner_evidence
  FOR SELECT TO authenticated
  USING (
    public.is_educator_for_student_cohort((SELECT auth.uid())::text, learner_id)
    AND visibility IN ('teacher', 'organization_admin')
  );

DROP POLICY IF EXISTS "learner_evidence_learner_insert" ON public.learner_evidence;
CREATE POLICY "learner_evidence_learner_insert" ON public.learner_evidence
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "learner_evidence_service_role" ON public.learner_evidence;
CREATE POLICY "learner_evidence_service_role" ON public.learner_evidence
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 12. RLS Policies: Audit Logs
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;
CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (actor_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS "audit_logs_admin_select" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_select" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = (SELECT auth.uid())::text AND p.role IN ('admin', 'platform_admin')
  ));

DROP POLICY IF EXISTS "audit_logs_service_role" ON public.audit_logs;
CREATE POLICY "audit_logs_service_role" ON public.audit_logs
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);
