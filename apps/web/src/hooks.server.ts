import { auth } from '$lib/server/auth';
import { redirect, error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// ---------------------------------------------------------------------------
// Route Protection Manifest
// ---------------------------------------------------------------------------
// Routes listed here are accessible WITHOUT authentication.
// Everything else (all workspace routes, internal APIs) requires a session.
// ---------------------------------------------------------------------------

/** Exact paths that are always public */
const PUBLIC_EXACT: Set<string> = new Set([
  '/',
  '/sitemap.xml',
  '/robots.txt',
  '/favicon.ico'
]);

/** Path prefixes that are always public (no auth required) */
const PUBLIC_PREFIXES: string[] = [
  // Auth flows
  '/login',
  '/signup',
  '/verify',
  '/consent',
  '/passkey',
  '/reset-password',
  // Public consent verification API (statutory DPDP consent submission)
  '/api/v1/consent/verify',
  // Better Auth API (must be fully public)
  '/api/auth',
  // Marketing pages
  '/about',
  '/families',
  '/platform',
  '/pricing',
  '/schools'
];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
}

// ---------------------------------------------------------------------------
// Handle
// ---------------------------------------------------------------------------

export const handle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  // ── 1. Resolve session ────────────────────────────────────────────────────
  try {
    const session = await auth.api.getSession({
      headers: event.request.headers
    });

    if (session) {
      event.locals.session = session.session;
      event.locals.user = session.user;
    } else {
      event.locals.session = null;
      event.locals.user = null;
    }
  } catch (err) {
    console.error(
      `[auth] Session retrieval failure on ${event.request.method} ${pathname}:`,
      err
    );
    event.locals.session = null;
    event.locals.user = null;
  }

  // ── 2. Route protection ────────────────────────────────────────────────────
  // Enforce session requirements:
  // - In production: strictly enforce on all non-public routes (workspace + internal APIs)
  // - Over network / tunnels (non-localhost): enforce to prevent unauthorized remote access
  if (!isPublicRoute(pathname)) {
    const isLocalDev = import.meta.env.DEV && (event.url.hostname === 'localhost' || event.url.hostname === '127.0.0.1');
    const isAuthenticated = !!event.locals.session;

    if (!isAuthenticated && !isLocalDev) {
      // Internal API routes → 401 JSON
      if (pathname.startsWith('/api/')) {
        throw error(401, JSON.stringify({ error: 'Unauthorized', code: 'SESSION_REQUIRED' }));
      }

      // Workspace routes → redirect to login with return path
      const next = encodeURIComponent(pathname + event.url.search);
      throw redirect(303, `/login?next=${next}`);
    }
  }

  return resolve(event);
};
