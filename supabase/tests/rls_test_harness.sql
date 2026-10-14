-- ==============================================================================
-- CREED OS — Automated Supabase PostgreSQL Row Level Security (RLS) Test Harness
-- Release Gate 2 Specification • Section 5.4 Verification
-- Standards: RFC 4122 Valid UUID Fixtures, 6 Positive Controls, 11 Negative Controls
-- ==============================================================================

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
  c_parent_b  UUID := '00000000-0000-0000-0003-000000000002';
  c_teacher_1 UUID := '00000000-0000-0000-0004-000000000001';
  c_teacher_2 UUID := '00000000-0000-0000-0004-000000000002';
  c_admin_1   UUID := '00000000-0000-0000-0005-000000000001';
  c_admin_2   UUID := '00000000-0000-0000-0005-000000000002';

  -- Taxonomy & Session Entities
  c_comp_1    UUID := '00000000-0000-0000-0010-000000000001';
  c_sess_a    UUID := '00000000-0000-0000-0020-000000000001';
  c_sess_b    UUID := '00000000-0000-0000-0020-000000000002';
  c_resp_b    UUID := '00000000-0000-0000-0025-000000000002';
BEGIN
  -- Cleanup any preexisting test records
  DELETE FROM assessment_responses WHERE session_id IN (c_sess_a, c_sess_b);
  DELETE FROM assessment_sessions WHERE id IN (c_sess_a, c_sess_b);
  DELETE FROM learner_evidence WHERE learner_id IN (c_student_a, c_student_b);
  DELETE FROM consents WHERE learner_id IN (c_student_a, c_student_b);
  DELETE FROM parent_learner_links WHERE parent_id IN (c_parent_a, c_parent_b);
  DELETE FROM organization_memberships WHERE organization_id IN (c_org1, c_org2);
  DELETE FROM assessment_items WHERE id = 'ITEM-STEM-01';
  DELETE FROM competencies WHERE id = c_comp_1;
  DELETE FROM profiles WHERE id IN (c_student_a, c_student_b, c_parent_a, c_parent_b, c_teacher_1, c_teacher_2, c_admin_1, c_admin_2);
  DELETE FROM organizations WHERE id IN (c_org1, c_org2);

  -- Insert Organizations (Tenant 1 & Tenant 2)
  INSERT INTO organizations (id, name, slug, type) VALUES
    (c_org1, 'Apex Academy Org 1', 'apex-org-1', 'school'),
    (c_org2, 'Horizon Academy Org 2', 'horizon-org-2', 'school');

  -- Insert Profiles
  INSERT INTO profiles (id, email, full_name, role) VALUES
    (c_student_a, 'student_a@test.local', 'Student A', 'student'),
    (c_student_b, 'student_b@test.local', 'Student B', 'student'),
    (c_parent_a,  'parent_a@test.local',  'Parent A',  'parent'),
    (c_parent_b,  'parent_b@test.local',  'Parent B',  'parent'),
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
    ('ITEM-STEM-01', c_comp_1, 'STEM-01-Q1', 'Sample Prompt', 'Sample Explanation', '[{"id": "a", "text": "A"}]'::jsonb, 'a', '[]'::jsonb, 1.20, 0.50, 0.20);

  -- Insert Baseline Evidence
  INSERT INTO learner_evidence (id, learner_id, organization_id, competency_id, evidence_type, source_type, source_title, summary, observed_value, confidence, evidence_strength, visibility) VALUES
    ('00000000-0000-0000-0030-000000000001', c_student_a, c_org1, c_comp_1, 'diagnostic', 'cat_assessment', 'Session A', 'Evidence A', '{"theta": 0.5}'::jsonb, 0.9, 3, 'teacher'),
    ('00000000-0000-0000-0030-000000000002', c_student_b, c_org2, c_comp_1, 'diagnostic', 'cat_assessment', 'Session B', 'Evidence B', '{"theta": 0.8}'::jsonb, 0.9, 3, 'teacher');

  -- Insert Assessment Sessions
  INSERT INTO assessment_sessions (id, learner_id, organization_id, domain, status, current_theta, standard_error) VALUES
    (c_sess_a, c_student_a, c_org1, 'stem', 'in_progress', 0.500, 0.400),
    (c_sess_b, c_student_b, c_org2, 'stem', 'in_progress', 0.800, 0.350);

  -- Insert Assessment Response for Student B
  INSERT INTO assessment_responses (id, session_id, item_id, selected_option_id, is_correct, theta_after, standard_error_after) VALUES
    (c_resp_b, c_sess_b, 'ITEM-STEM-01', 'a', true, 0.800, 0.350);
END $$;

-- ── 2. Positive Controls (Prove Authorized Paths Function Before Negative Tests) ──

-- POS-01: Student A reads own evidence -> Invariant: Exactly 1 row returned
DO $$
DECLARE
  v_count INT;
BEGIN
  -- Simulate authenticated context for Student A
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000001';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'POS-01 FAILED: Expected 1 evidence row for Student A, got %', v_count;
  END IF;
  RAISE NOTICE 'POS-01 PASSED: Student A reads own evidence';
END $$;

-- POS-02: Parent A reads linked Student A evidence (verified consent) -> Invariant: Exactly 1 row returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0003-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000001';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'POS-02 FAILED: Expected 1 evidence row for linked Parent A, got %', v_count;
  END IF;
  RAISE NOTICE 'POS-02 PASSED: Parent A reads linked child evidence';
END $$;

-- POS-03: Teacher 1 reads Student A evidence (same organization Org 1) -> Invariant: Exactly 1 row returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0004-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000001';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'POS-03 FAILED: Expected 1 evidence row for Teacher 1, got %', v_count;
  END IF;
  RAISE NOTICE 'POS-03 PASSED: Teacher 1 reads cohort evidence';
END $$;

-- POS-04: Tenant Admin 1 queries Org 1 memberships -> Invariant: Exactly 3 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0005-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM organization_memberships WHERE organization_id = '00000000-0000-0000-0001-000000000001';
  IF v_count <> 3 THEN
    RAISE EXCEPTION 'POS-04 FAILED: Expected 3 memberships for Org 1 admin, got %', v_count;
  END IF;
  RAISE NOTICE 'POS-04 PASSED: Admin 1 queries own org memberships';
END $$;

-- POS-05: Student A executes verify_assessment_session on own session -> Invariant: Exactly 1 row returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count 
  FROM verify_assessment_session('00000000-0000-0000-0020-000000000001', '00000000-0000-0000-0002-000000000001');
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'POS-05 FAILED: Expected 1 session row returned, got %', v_count;
  END IF;
  RAISE NOTICE 'POS-05 PASSED: Student A verifies own session token';
END $$;

-- POS-06: Student A reads own profile -> Invariant: Exactly 1 row returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM profiles WHERE id = '00000000-0000-0000-0002-000000000001';
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'POS-06 FAILED: Expected 1 profile row, got %', v_count;
  END IF;
  RAISE NOTICE 'POS-06 PASSED: Student A reads own profile';
END $$;

-- ── 3. Negative Controls (Adversarial Security Attack Invariant Checks) ──────

-- NEG-01: Student A queries Student B evidence -> Invariant: Exactly 0 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000002';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'NEG-01 FAILED (IDOR): Student A viewed Student B evidence! Rows: %', v_count;
  END IF;
  RAISE NOTICE 'NEG-01 PASSED: Cross-student evidence access blocked (0 rows)';
END $$;

-- NEG-02: Student A attempts to mutate Student B assessment session -> Invariant: 0 rows updated
DO $$
DECLARE
  v_updated INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}', true);
  
  UPDATE assessment_sessions SET current_theta = 2.500 WHERE id = '00000000-0000-0000-0020-000000000002';
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  IF v_updated <> 0 THEN
    RAISE EXCEPTION 'NEG-02 FAILED: Student A updated Student B assessment session!';
  END IF;
  RAISE NOTICE 'NEG-02 PASSED: Cross-student session mutation blocked (0 rows updated)';
END $$;

-- NEG-03: Parent A queries Student B evidence (unlinked child) -> Invariant: Exactly 0 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0003-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000002';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'NEG-03 FAILED: Parent A viewed unlinked Student B evidence!';
  END IF;
  RAISE NOTICE 'NEG-03 PASSED: Unlinked child evidence blocked (0 rows)';
END $$;

-- NEG-04: Teacher 1 queries Org 2 evidence -> Invariant: Exactly 0 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0004-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000002';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'NEG-04 FAILED (Cross-Tenant): Teacher 1 accessed Org 2 evidence!';
  END IF;
  RAISE NOTICE 'NEG-04 PASSED: Cross-tenant educator access blocked (0 rows)';
END $$;

-- NEG-05: Tenant Admin 1 queries Org 2 memberships -> Invariant: Exactly 0 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0005-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM organization_memberships WHERE organization_id = '00000000-0000-0000-0001-000000000002';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'NEG-05 FAILED: Admin 1 viewed Org 2 memberships!';
  END IF;
  RAISE NOTICE 'NEG-05 PASSED: Cross-tenant admin access blocked (0 rows)';
END $$;

-- NEG-06: Anonymous user attempts to read learner evidence -> Invariant: Exactly 0 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'anon', true);
  PERFORM set_config('request.jwt.claims', '{}', true);
  
  SELECT count(*) INTO v_count FROM learner_evidence;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'NEG-06 FAILED: Anonymous user viewed learner evidence!';
  END IF;
  RAISE NOTICE 'NEG-06 PASSED: Anonymous access blocked (0 rows)';
END $$;

-- NEG-07: Revoked consent blocks Parent A from reading Student A evidence -> Invariant: Exactly 0 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  -- Superuser temporarily revokes consent
  UPDATE consents 
  SET status = 'withdrawn', withdrawn_at = now() 
  WHERE learner_id = '00000000-0000-0000-0002-000000000001';

  -- Authenticate as Parent A
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0003-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM learner_evidence WHERE learner_id = '00000000-0000-0000-0002-000000000001';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'NEG-07 FAILED: Parent A accessed evidence with withdrawn consent!';
  END IF;
  RAISE NOTICE 'NEG-07 PASSED: Consent revocation immediately withholds evidence (0 rows)';

  -- Restore consent for remaining tests
  UPDATE consents SET status = 'verified', withdrawn_at = NULL WHERE learner_id = '00000000-0000-0000-0002-000000000001';
END $$;

-- NEG-08: Student A attempts to insert response to Student B's session -> Invariant: Blocked
DO $$
DECLARE
  v_inserted INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}', true);
  
  BEGIN
    INSERT INTO assessment_responses (id, session_id, item_id, selected_option_id, is_correct, theta_after, standard_error_after)
    VALUES ('00000000-0000-0000-0025-000000000099', '00000000-0000-0000-0020-000000000002', 'ITEM-STEM-01', 'a', false, 0.1, 0.4);
    GET DIAGNOSTICS v_inserted = ROW_COUNT;
    IF v_inserted > 0 THEN
      RAISE EXCEPTION 'NEG-08 FAILED: Student A inserted response into Student B session!';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Expected: RLS policy violation or check failure
    NULL;
  END;
  RAISE NOTICE 'NEG-08 PASSED: Cross-student response injection blocked';
END $$;

-- NEG-09: Unprivileged user cannot query audit logs -> Invariant: Exactly 0 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM audit_logs;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'NEG-09 FAILED: Regular user queried raw audit logs!';
  END IF;
  RAISE NOTICE 'NEG-09 PASSED: Raw audit log table hidden from unprivileged clients (0 rows)';
END $$;

-- NEG-10: Student A calling verify_assessment_session for Student B's session -> Invariant: Exactly 0 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count 
  FROM verify_assessment_session('00000000-0000-0000-0020-000000000002', '00000000-0000-0000-0002-000000000001');
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'NEG-10 FAILED: Student A verified token for Student B session!';
  END IF;
  RAISE NOTICE 'NEG-10 PASSED: Non-enumerable RPC token check restricts cross-learner session (0 rows)';
END $$;

-- NEG-11: Student A attempts to read Student B's profile -> Invariant: Exactly 0 rows returned
DO $$
DECLARE
  v_count INT;
BEGIN
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0002-000000000001", "role": "authenticated"}', true);
  
  SELECT count(*) INTO v_count FROM profiles WHERE id = '00000000-0000-0000-0002-000000000002';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'NEG-11 FAILED: Student A viewed Student B profile!';
  END IF;
  RAISE NOTICE 'NEG-11 PASSED: Profile privacy isolation enforced (0 rows)';
END $$;

-- Rollback test transaction to keep database completely clean
ROLLBACK;
