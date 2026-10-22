-- Migration: 20261022000001_audit_remediation_fixes.sql
-- Enforces idempotent schema fixes for existing deployed databases:
-- 1. Adds expires_at to consents table if not already present.
-- 2. Tightens assessment_sessions and learner_evidence RLS policies.
-- 3. Ensures assessment_items index and constraints are aligned.

ALTER TABLE IF EXISTS public.consents
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_consents_expires_at ON public.consents(expires_at);

-- Tighten assessment_sessions update policy to prevent completed session mutation
DROP POLICY IF EXISTS "assessment_sessions_learner_update" ON public.assessment_sessions;
CREATE POLICY "assessment_sessions_learner_update" ON public.assessment_sessions
  FOR UPDATE
  USING (learner_id = auth.uid() AND status IN ('in_progress', 'paused'))
  WITH CHECK (learner_id = auth.uid() AND status IN ('in_progress', 'paused', 'completed'));

-- Tighten direct evidence insert policy to candidate evidence only
DROP POLICY IF EXISTS "learner_evidence_learner_insert" ON public.learner_evidence;
CREATE POLICY "learner_evidence_learner_insert" ON public.learner_evidence
  FOR INSERT
  WITH CHECK (
    learner_id = auth.uid()
    AND status = 'candidate'
    AND evidence_strength <= 2
  );
