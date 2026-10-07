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
const sanitizedApiKey = rawApiKey.replace(/^BETTER_AUTH_API_KEY=+/i, '').trim();

const betterAuthApiKey =
  sanitizedApiKey ||
  'ba_sx2901lbs34pwzujpnmu5n7gfdjf08bq,ba_wa2mt5u0ui89mh5puxri8ewlowkjzbky,ba_duy1mwr0fqra6rg678qf00dbe4f2s6lh';

export const auth = betterAuth({
  appName: 'CREED OS',
  baseURL: env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret: secret || 'creed-os-local-dev-secret-32-chars-entropy-key',
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
