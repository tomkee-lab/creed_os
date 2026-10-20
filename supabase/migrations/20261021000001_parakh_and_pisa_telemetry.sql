-- ==============================================================================
-- Migration: 20261021000001_parakh_and_pisa_telemetry.sql
-- Description: National Education Policy (NEP 2020) PARAKH 360-Degree HPC, APAAR Registry & OECD PISA 2025 Telemetry
-- Alignment: DPDP Act 2023 Statutory Minor Protection, PARAKH NCERT Standards, OECD LDW Process Metrics
-- ==============================================================================

-- 1. Add APAAR ID (12-digit numeric identifier) to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS apaar_id text CHECK (apaar_id IS NULL OR apaar_id ~ '^[0-9]{12}$');

CREATE INDEX IF NOT EXISTS idx_profiles_apaar_id ON public.profiles(apaar_id) WHERE apaar_id IS NOT NULL;

-- 2. PARAKH 360-Degree Holistic Progress Card Table
CREATE TABLE IF NOT EXISTS public.parakh_hpc_records (
  id text PRIMARY KEY,
  learner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stage text NOT NULL CHECK (stage IN ('foundational', 'preparatory', 'middle', 'secondary')),
  academic_session text NOT NULL DEFAULT '2026–2027',
  apaar_id text CHECK (apaar_id IS NULL OR apaar_id ~ '^[0-9]{12}$'),
  self_reflections jsonb NOT NULL DEFAULT '[]'::jsonb,
  peer_evaluations jsonb NOT NULL DEFAULT '[]'::jsonb,
  teacher_observations jsonb NOT NULL DEFAULT '[]'::jsonb,
  parent_feedback jsonb NOT NULL DEFAULT '[]'::jsonb,
  cognitive_development jsonb NOT NULL DEFAULT '{}'::jsonb,
  socio_emotional_development jsonb NOT NULL DEFAULT '{}'::jsonb,
  aesthetic_applied_development jsonb NOT NULL DEFAULT '{}'::jsonb,
  overall_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parakh_hpc_learner_id ON public.parakh_hpc_records(learner_id);

-- 3. OECD PISA 2025 Process Telemetry & SRL Metrics Table
CREATE TABLE IF NOT EXISTS public.mission_process_telemetry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id text NOT NULL,
  completed_phases text[] NOT NULL DEFAULT ARRAY[]::text[],
  total_duration_ms integer NOT NULL DEFAULT 0,
  total_trials integer NOT NULL DEFAULT 0,
  systematic_votat_ratio double precision NOT NULL DEFAULT 0.0,
  avg_hypothesis_latency_ms integer NOT NULL DEFAULT 0,
  strategy_shift_detected boolean NOT NULL DEFAULT false,
  efficiency_ratio double precision NOT NULL DEFAULT 0.0,
  resilience_index text NOT NULL CHECK (resilience_index IN ('High', 'Moderate', 'Developing')),
  inferred_pisa_level smallint NOT NULL CHECK (inferred_pisa_level BETWEEN 1 AND 6),
  level_rationale text NOT NULL,
  raw_events jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mission_telemetry_learner_mission ON public.mission_process_telemetry(learner_id, mission_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.parakh_hpc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_process_telemetry ENABLE ROW LEVEL SECURITY;

-- PARAKH HPC Policies
-- 1. Learner can view own HPC
CREATE POLICY parakh_hpc_learner_select ON public.parakh_hpc_records
  FOR SELECT
  TO authenticated
  USING (learner_id = auth.uid());

-- 2. Verified parent with active consent can view child HPC
CREATE POLICY parakh_hpc_parent_select ON public.parakh_hpc_records
  FOR SELECT
  TO authenticated
  USING (public.has_active_guardian_consent(auth.uid(), learner_id));

-- 3. Teachers & Counselors within the same organization can view student HPC
CREATE POLICY parakh_hpc_staff_select ON public.parakh_hpc_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_memberships om_staff
      JOIN public.organization_memberships om_student ON om_staff.organization_id = om_student.organization_id
      WHERE om_staff.user_id = auth.uid()
        AND om_student.user_id = parakh_hpc_records.learner_id
        AND om_staff.role IN ('teacher', 'counselor', 'institute_admin', 'institute_staff')
    )
  );

-- 4. Learner can update own self_reflections
CREATE POLICY parakh_hpc_learner_update ON public.parakh_hpc_records
  FOR UPDATE
  TO authenticated
  USING (learner_id = auth.uid())
  WITH CHECK (learner_id = auth.uid());

-- PISA Telemetry Policies
-- 1. Learner can view own process telemetry
CREATE POLICY pisa_telemetry_learner_select ON public.mission_process_telemetry
  FOR SELECT
  TO authenticated
  USING (learner_id = auth.uid());

-- 2. Verified parent with active consent can view child telemetry
CREATE POLICY pisa_telemetry_parent_select ON public.mission_process_telemetry
  FOR SELECT
  TO authenticated
  USING (public.has_active_guardian_consent(auth.uid(), learner_id));

-- 3. Teachers within the same organization can view telemetry
CREATE POLICY pisa_telemetry_staff_select ON public.mission_process_telemetry
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_memberships om_staff
      JOIN public.organization_memberships om_student ON om_staff.organization_id = om_student.organization_id
      WHERE om_staff.user_id = auth.uid()
        AND om_student.user_id = mission_process_telemetry.learner_id
        AND om_staff.role IN ('teacher', 'counselor', 'institute_admin', 'institute_staff')
    )
  );

-- 4. Learner can insert own simulation telemetry
CREATE POLICY pisa_telemetry_learner_insert ON public.mission_process_telemetry
  FOR INSERT
  TO authenticated
  WITH CHECK (learner_id = auth.uid());
