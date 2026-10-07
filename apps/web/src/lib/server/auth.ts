import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { dash } from '@better-auth/infra';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

const isProduction = process.env.NODE_ENV === 'production';
const secret = process.env.BETTER_AUTH_SECRET;

if (isProduction && !secret) {
  throw new Error('FATAL: BETTER_AUTH_SECRET must be configured in production environments.');
}

export const auth = betterAuth({
  appName: 'CREED OS',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret: secret || 'creed-os-local-dev-secret-32-chars-entropy-key',
  database: process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
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
    'http://localhost:4173'
  ],
  plugins: [
    organization(),
    passkey(),
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY
    }),
    sveltekitCookies(getRequestEvent)
  ]
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
