import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { dash, sentinel } from '@better-auth/infra';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

const apiKey = process.env.BETTER_AUTH_API_KEY;
const infraPlugins = [];
if (apiKey) {
  infraPlugins.push(dash({ apiKey }));
  infraPlugins.push(sentinel());
}

export const auth = betterAuth({
  appName: 'CREED OS',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret: process.env.BETTER_AUTH_SECRET || 'creed-os-local-dev-secret-32-chars-entropy-key',
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
  plugins: [
    organization(),
    ...infraPlugins,
    sveltekitCookies(getRequestEvent)
  ]
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
