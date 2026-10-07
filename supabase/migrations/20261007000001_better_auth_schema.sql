-- Better Auth PostgreSQL Schema Migration
-- Defines authentication, session management, WebAuthn passkeys, and organization tenant tables
-- with custom 'role' field support for CREED OS persona access governance

-- 1. Core User table (matches Better Auth schema + role additionalField)
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  "image" TEXT,
  "role" TEXT NOT NULL DEFAULT 'student',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "user"("role");

-- 2. Sessions table
CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMP NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_session_token" ON "session"("token");
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session"("userId");

-- 3. Accounts table (for email/password, OAuth credentials)
CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account"("userId");

-- 4. Verification tokens (for email verification, password reset)
CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_verification_identifier" ON "verification"("identifier");

-- 5. Passkey table (for WebAuthn credentials)
CREATE TABLE IF NOT EXISTS "passkey" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "publicKey" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "credentialId" TEXT NOT NULL UNIQUE,
  "counter" INTEGER NOT NULL DEFAULT 0,
  "deviceType" TEXT NOT NULL,
  "backedUp" BOOLEAN NOT NULL DEFAULT FALSE,
  "transports" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_passkey_userId" ON "passkey"("userId");
CREATE INDEX IF NOT EXISTS "idx_passkey_credentialId" ON "passkey"("credentialId");

-- 6. Organization plugin tables
CREATE TABLE IF NOT EXISTS "organization" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "logo" TEXT,
  "metadata" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "member" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "role" TEXT NOT NULL DEFAULT 'member',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_member_organizationId" ON "member"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_member_userId" ON "member"("userId");

CREATE TABLE IF NOT EXISTS "invitation" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "expiresAt" TIMESTAMP NOT NULL,
  "inviterId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

-- 7. Row Level Security (RLS) Policies for Better Auth Tables
-- Enforces DPDP Act relationship-scoped access across student identities, sessions, and memberships
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "passkey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "member" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invitation" ENABLE ROW LEVEL SECURITY;

-- 7.0 Security Definer Membership Helpers (Prevents Recursive Policy Evaluation)
CREATE OR REPLACE FUNCTION get_user_tenant_org_ids(p_user_id text)
RETURNS SETOF text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT "organizationId" FROM "member" WHERE "userId" = p_user_id;
$$;

CREATE OR REPLACE FUNCTION is_org_staff_or_admin(p_user_id text, p_org_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "member"
    WHERE "userId" = p_user_id
      AND "organizationId" = p_org_id
      AND "role" IN ('admin', 'educator', 'counselor', 'teacher', 'owner')
  );
$$;

CREATE OR REPLACE FUNCTION is_educator_for_student_cohort(p_staff_user_id text, p_student_user_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "member" staff_mem
    JOIN "member" student_mem ON student_mem."organizationId" = staff_mem."organizationId"
    WHERE staff_mem."userId" = p_staff_user_id
      AND staff_mem."role" IN ('admin', 'educator', 'counselor', 'teacher', 'owner')
      AND student_mem."userId" = p_student_user_id
  );
$$;

-- 7.1 "user" Table Policies (Student Identity and Relationship-Scoped Access)
CREATE POLICY "user_select_self" ON "user"
  FOR SELECT
  USING (auth.uid()::text = "id");

CREATE POLICY "user_update_self" ON "user"
  FOR UPDATE
  USING (auth.uid()::text = "id");

CREATE POLICY "user_parent_select_child" ON "user"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_learner_links pll
      JOIN consents c ON c.learner_id = pll.learner_id AND c.guardian_id = pll.parent_id
      WHERE pll.parent_id = auth.uid()
        AND pll.learner_id::text = "user"."id"
        AND c.status = 'verified'
    )
  );

CREATE POLICY "user_educator_select_cohort" ON "user"
  FOR SELECT
  USING (
    is_educator_for_student_cohort(auth.uid()::text, "user"."id")
  );

CREATE POLICY "user_service_role_all" ON "user"
  FOR ALL
  USING (auth.role() = 'service_role');

-- 7.2 "session", "account", and "passkey" Policies (Strictly User-Owned)
CREATE POLICY "session_owner_access" ON "session"
  FOR ALL
  USING (auth.uid()::text = "userId" OR auth.role() = 'service_role');

CREATE POLICY "account_owner_access" ON "account"
  FOR ALL
  USING (auth.uid()::text = "userId" OR auth.role() = 'service_role');

CREATE POLICY "passkey_owner_access" ON "passkey"
  FOR ALL
  USING (auth.uid()::text = "userId" OR auth.role() = 'service_role');

-- 7.3 "verification" Policy (Service Role Only for Security Tokens)
CREATE POLICY "verification_service_role" ON "verification"
  FOR ALL
  USING (auth.role() = 'service_role');

-- 7.4 "organization", "member", and "invitation" Policies (Tenant Isolation without Recursion)
CREATE POLICY "org_member_view" ON "organization"
  FOR SELECT
  USING (
    "id" IN (SELECT get_user_tenant_org_ids(auth.uid()::text))
    OR auth.role() = 'service_role'
  );

CREATE POLICY "member_organization_view" ON "member"
  FOR SELECT
  USING (
    "userId" = auth.uid()::text
    OR "organizationId" IN (SELECT get_user_tenant_org_ids(auth.uid()::text))
    OR auth.role() = 'service_role'
  );

CREATE POLICY "invitation_admin_access" ON "invitation"
  FOR ALL
  USING (
    is_org_staff_or_admin(auth.uid()::text, "organizationId")
    OR auth.role() = 'service_role'
  );
