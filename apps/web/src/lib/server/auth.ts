import { betterAuth } from 'better-auth';
import { organization, emailOTP } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { dash } from '@better-auth/infra';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

import { env } from '$env/dynamic/private';
import pg from 'pg';
const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const secret = env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET;

const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL;
let dbPool: pg.Pool | undefined = undefined;

if (databaseUrl) {
  dbPool = new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5000,
    max: 10
  });
  // Prevent unhandled error events on idle clients from crashing Node process
  dbPool.on('error', (err) => {
    console.warn('[auth:db] Postgres pool idle client warning:', err.message);
  });
}

if (isProduction && !secret) {
  throw new Error('FATAL: BETTER_AUTH_SECRET must be configured in production environments.');
}

const rawApiKey = (env.BETTER_AUTH_API_KEY || process.env.BETTER_AUTH_API_KEY || '').trim();
// Strip accidental prefix duplication (e.g. 'BETTER_AUTH_API_KEY=ba_...')
const betterAuthApiKey = rawApiKey.replace(/^BETTER_AUTH_API_KEY=+/i, '').trim();

if (betterAuthApiKey) {
  process.env.BETTER_AUTH_API_KEY = betterAuthApiKey;
}
if (!process.env.BETTER_AUTH_SECRET && secret) {
  process.env.BETTER_AUTH_SECRET = secret;
}

if (!betterAuthApiKey) {
  console.warn('[auth] BETTER_AUTH_API_KEY is not set — Better Auth dashboard monitoring will be disabled.');
} else {
  console.info('[auth] Active Better Auth API key ends with:', betterAuthApiKey.slice(-6));
  console.info('[auth] Configured Base URL:', env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'default localhost');
}

/**
 * Server-authoritative role assignment allowlist.
 * Maps the client's self-declared role hint to a safe internal role.
 * Any unrecognized value is demoted to 'student'.
 *
 * - 'admin' is NOT in this map — clients can never self-assign admin.
 * - 'school' → 'institution_pending' (requires admin approval).
 * - 'student' is the fallback / default.
 */
const ROLE_SIGNUP_MAP: Record<string, string> = {
  parent:    'parent',
  teacher:   'teacher',
  counselor: 'counselor',
  school:    'institution_pending'
};

const rawBaseUrl = (env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'http://localhost:5173').trim();
const cleanBaseUrl = rawBaseUrl.replace(/\/api\/auth\/?$/i, '').replace(/\/+$/, '') || 'http://localhost:5173';
process.env.BETTER_AUTH_URL = cleanBaseUrl;

export const auth = betterAuth({
  appName: 'CREED OS',
  baseURL: cleanBaseUrl,
  secret: secret || 'creed-os-local-dev-secret-32-chars-entropy-key',
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'student',
        input: true
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Server-authoritative role enforcement (DPDP Act relationship-scoped access):
          // Public registrants cannot self-grant immediate staff or guardian access.
          // Staff and institutions require administrative verification; guardians require verified consent.
          const rawRole = (user as Record<string, unknown>).role as string | undefined;
          const assignedRole =
            rawRole === 'school' || rawRole === 'institution_pending'
              ? 'institution_pending'
            : rawRole === 'teacher' || rawRole === 'teacher_pending'
              ? 'teacher_pending'
            : rawRole === 'counselor' || rawRole === 'counselor_pending'
              ? 'counselor_pending'
            : rawRole === 'parent' || rawRole === 'parent_pending'
              ? 'parent_pending'
            : rawRole === 'student'
              ? 'student'
            : 'student';

          return {
            data: {
              ...user,
              role: assignedRole
            }
          };
        }
      }
    }
  },
  database: dbPool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  trustedOrigins: [
    'https://dash.better-auth.com',
    'http://localhost:5173',
    'http://localhost:4173',
    'https://fibre-paid-manga-pills.trycloudflare.com',
    'https://decorating-forests-accommodation-seeker.trycloudflare.com',
    'https://locally-departmental-marathon-gbp.trycloudflare.com',
    'https://real-taxes-try.loca.lt',
    ...(env.BETTER_AUTH_URL ? [env.BETTER_AUTH_URL] : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [])
  ],
  plugins: [
    organization(),
    passkey(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[BetterAuth:emailOTP] Dispatched verification OTP for ${email} (type: ${type}): ${otp}`);
      }
    }),
    dash({
      apiKey: betterAuthApiKey
    }),
    sveltekitCookies(getRequestEvent)
  ]
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
