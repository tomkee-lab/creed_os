import { betterAuth } from 'better-auth';
import { organization, emailOTP } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { dash } from '@better-auth/infra';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { getRequestEvent } from '$app/server';

import { env } from '$env/dynamic/private';
import pg from 'pg';
const { Pool } = pg;

const isBuilding = Boolean(building || process.env.BUILDING === 'true' || process.env.npm_lifecycle_event === 'build');
const isProduction = process.env.NODE_ENV === 'production';
const secret = env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET;

// Deterministic fallback secret used only during Vite SSR bundle generation; never in runtime production.
const BUILD_TIME_AUTH_SECRET = 'ci-build-synthetic-better-auth-secret-32-chars';
const effectiveSecret = secret || (isBuilding || !isProduction ? BUILD_TIME_AUTH_SECRET : undefined);

const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL;
let dbPool: pg.Pool | undefined = undefined;

if (!isBuilding && databaseUrl) {
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

if (!isBuilding && isProduction && !secret) {
  throw new Error('FATAL: BETTER_AUTH_SECRET must be configured in production environments.');
}

const rawApiKey = (env.BETTER_AUTH_API_KEY || process.env.BETTER_AUTH_API_KEY || '').trim();
// Strip accidental prefix duplication (e.g. 'BETTER_AUTH_API_KEY=ba_...')
const betterAuthApiKey = rawApiKey.replace(/^BETTER_AUTH_API_KEY=+/i, '').trim();

if (betterAuthApiKey) {
  process.env.BETTER_AUTH_API_KEY = betterAuthApiKey;
}
if (!process.env.BETTER_AUTH_SECRET && effectiveSecret) {
  process.env.BETTER_AUTH_SECRET = effectiveSecret;
}

if (!isBuilding) {
  if (!betterAuthApiKey) {
    console.warn('[auth] BETTER_AUTH_API_KEY is not set: Better Auth dashboard monitoring will be disabled.');
  } else {
    console.info('[auth] Active Better Auth API key ends with:', betterAuthApiKey.slice(-6));
    console.info('[auth] Configured Base URL:', env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'default localhost');
  }
}

/**
 * Server-authoritative role assignment allowlist.
 * Maps the client's self-declared role hint to a safe internal role.
 * Any unrecognized value is demoted to 'student'.
 *
 * - 'admin' is NOT in this map: clients can never self-assign admin.
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

          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const userId = user.id && uuidRegex.test(user.id) ? user.id : crypto.randomUUID();

          return {
            data: {
              ...user,
              id: userId,
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
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        const maskedEmail = email.replace(/(?<=^.).(?=.*@)/g, '*');
        if (import.meta.env.DEV || process.env.NODE_ENV !== 'production') {
          console.log(`[BetterAuth:emailOTP:DEV] Verification OTP for ${email} (${type}): ${otp}`);
        } else {
          console.log(`[BetterAuth:emailOTP] Dispatched verification OTP for ${maskedEmail} (type: ${type})`);
        }

        const resendKey = process.env.RESEND_API_KEY;
        const smtpHost = process.env.SMTP_HOST;
        if (resendKey) {
          try {
            const res = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${resendKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: process.env.EMAIL_FROM || (isProduction ? 'CREED OS <notifications@creed-os.org>' : 'CREED OS <onboarding@resend.dev>'),
                to: email,
                subject: 'Your CREED OS Verification Code',
                html: `<p>Your verification code for CREED OS is: <strong>${otp}</strong>.</p><p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>`
              })
            });
            if (!res.ok) {
              const errBody = await res.text();
              console.error(`[BetterAuth:emailOTP] Resend API error (${res.status}):`, errBody);
              if (process.env.NODE_ENV === 'production') {
                throw new Error(`Failed to deliver OTP verification email: Resend returned HTTP ${res.status}`);
              }
            }
          } catch (err) {
            console.error('[BetterAuth:emailOTP] Failed to dispatch email via Resend:', err);
            if (process.env.NODE_ENV === 'production') {
              throw err;
            }
          }
        } else if (!import.meta.env.DEV && process.env.NODE_ENV === 'production' && !smtpHost) {
          console.error('[BetterAuth:emailOTP] Transactional email provider unconfigured in production.');
          throw new Error('Email delivery unavailable: RESEND_API_KEY or SMTP_HOST required in production.');
        } else if (!import.meta.env.DEV && !smtpHost) {
          console.warn('[BetterAuth:emailOTP] Transactional email provider unconfigured outside DEV.');
        }
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
