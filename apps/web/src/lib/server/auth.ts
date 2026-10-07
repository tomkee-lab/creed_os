import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { dash } from '@better-auth/infra';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

import { env } from '$env/dynamic/private';

const isProduction = process.env.NODE_ENV === 'production';
const secret = env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET;

if (isProduction && !secret) {
  throw new Error('FATAL: BETTER_AUTH_SECRET must be configured in production environments.');
}

const rawApiKey = (env.BETTER_AUTH_API_KEY || process.env.BETTER_AUTH_API_KEY || '').trim();
// Strip accidental prefix duplication (e.g. 'BETTER_AUTH_API_KEY=ba_...')
const betterAuthApiKey = rawApiKey.replace(/^BETTER_AUTH_API_KEY=+/i, '').trim();

if (!betterAuthApiKey) {
  console.warn('[auth] BETTER_AUTH_API_KEY is not set — Better Auth dashboard monitoring will be disabled.');
}

export const auth = betterAuth({
  appName: 'CREED OS',
  baseURL: env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'http://localhost:5173',
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
  database: (env.DATABASE_URL || process.env.DATABASE_URL)
    ? {
        connectionString: (env.DATABASE_URL || process.env.DATABASE_URL)!,
        provider: 'postgres'
      }
    : undefined,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  trustedOrigins: [
    'https://dash.better-auth.com',
    'http://localhost:5173',
    'http://localhost:4173',
    'https://locally-departmental-marathon-gbp.trycloudflare.com',
    'https://real-taxes-try.loca.lt'
  ],
  plugins: [
    organization(),
    passkey(),
    dash({
      apiKey: betterAuthApiKey
    }),
    sveltekitCookies(getRequestEvent)
  ]
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
