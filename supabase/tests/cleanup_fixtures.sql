-- Standalone Fixture Cleanup Script
-- Cleans up any test fixtures from rls_test_harness if run outside a transaction block
DO $$
DECLARE
  c_org1 UUID := '00000000-0000-0000-0001-000000000001';
  c_org2 UUID := '00000000-0000-0000-0001-000000000002';
  c_student_a UUID := '00000000-0000-0000-0002-000000000001';
  c_student_b UUID := '00000000-0000-0000-0002-000000000002';
  c_parent_a  UUID := '00000000-0000-0000-0003-000000000001';
  c_parent_b  UUID := '00000000-0000-0000-0003-000000000002';
  c_teacher_1 UUID := '00000000-0000-0000-0004-000000000001';
  c_teacher_2 UUID := '00000000-0000-0000-0004-000000000002';
  c_admin_1   UUID := '00000000-0000-0000-0005-000000000001';
  c_admin_2   UUID := '00000000-0000-0000-0005-000000000002';
  c_comp_1    UUID := '00000000-0000-0000-0010-000000000001';
  c_sess_a    UUID := '00000000-0000-0000-0020-000000000001';
  c_sess_b    UUID := '00000000-0000-0000-0020-000000000002';
BEGIN
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
END $$;
