-- Migration: 20261009000001_better_auth_passkey_org_updates.sql
-- Description: Forward idempotent migration aligning Better Auth passkey, session, and invitation schema columns

DO $$
BEGIN
  -- 1. Passkey credentialID rename and aaguid column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'passkey' AND column_name = 'credentialId'
  ) THEN
    ALTER TABLE "passkey" RENAME COLUMN "credentialId" TO "credentialID";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'passkey' AND column_name = 'aaguid'
  ) THEN
    ALTER TABLE "passkey" ADD COLUMN "aaguid" TEXT;
  END IF;

  -- Rename or recreate passkey credential index
  DROP INDEX IF EXISTS "idx_passkey_credentialId";
  CREATE INDEX IF NOT EXISTS "idx_passkey_credentialID" ON "passkey"("credentialID");

  -- 2. Session activeOrganizationId
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'session' AND column_name = 'activeOrganizationId'
  ) THEN
    ALTER TABLE "session" ADD COLUMN "activeOrganizationId" TEXT;
  END IF;

  -- 3. Invitation createdAt
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitation' AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "invitation" ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;
