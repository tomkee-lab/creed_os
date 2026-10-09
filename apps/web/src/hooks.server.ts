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
  // Public consent challenge & verification APIs (statutory DPDP consent submission)
  '/api/v1/consent/challenge',
  '/api/v1/consent/verify',
  // Public Altcha Proof-of-Work challenge API
  '/api/v1/altcha',
  // Better Auth API & Dashboard endpoints (must be fully public)
  '/api/auth',
  '/dash',
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

function getHomeRouteForRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'teacher':
      return '/teacher';
    case 'counselor':
      return '/counselor';
    case 'parent':
      return '/parent';
    case 'parent_pending':
      return '/consent';
    case 'studio':
      return '/studio';
    default:
      return '/student';
  }
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
    } else if (
      import.meta.env.DEV &&
      (event.url.hostname === 'localhost' || event.url.hostname === '127.0.0.1') &&
      event.cookies.get('creed_dev_session') === 'true'
    ) {
      // In local development, support explicit dev persona cookies strictly on loopback
      const rawUser = event.cookies.get('creed_dev_user');
      const devRole = event.cookies.get('creed_dev_role') || 'student';
      let parsedUser = null;
      try {
        if (rawUser) parsedUser = JSON.parse(rawUser);
      } catch {
        // Fallback default
      }

      const roleDefaultNames: Record<string, string> = {
        student: 'Student Learner',
        parent: 'Parent Guardian',
        teacher: 'Lead Educator',
        counselor: 'Academic Counselor',
        admin: 'System Administrator',
        studio: 'Lead Psychometrician'
      };

      const activeUser = parsedUser || {
        id: `usr_${devRole}`,
        name: roleDefaultNames[devRole] || 'System User',
        email: `${devRole}@core-os.app`,
        role: devRole
      };

      event.locals.user = activeUser as any;
      event.locals.session = {
        id: `sess_dev_${devRole}`,
        userId: activeUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      } as any;
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

  // ── 2. Derive effective role ──────────────────────────────────────────────
  const user = event.locals.user;
  const userRole = (user as any)?.role || (user as any)?.metadata?.role || 'student';
  const effectiveRole = userRole;

  // ── 3. Authenticated users visiting login or signup ────────────────────────
  if (event.locals.session && (pathname === '/login' || pathname === '/signup')) {
    const nextParam = event.url.searchParams.get('next');
    if (nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') && !nextParam.startsWith('/\\')) {
      try {
        const dest = new URL(nextParam, event.url.origin);
        if (dest.origin === event.url.origin) {
          throw redirect(303, dest.pathname + dest.search);
        }
      } catch (e) {
        if ((e as any)?.status === 303) throw e;
      }
    }
    throw redirect(303, getHomeRouteForRole(effectiveRole));
  }

  // ── 4. Route protection & RBAC enforcement ─────────────────────────────────
  if (!isPublicRoute(pathname)) {
    // 4a. Authentication check
    if (!event.locals.session) {
      // Internal API routes → 401 JSON
      if (pathname.startsWith('/api/')) {
        throw error(401, JSON.stringify({ error: 'Unauthorized: Active session required', code: 'SESSION_REQUIRED' }));
      }

      // Workspace routes → redirect to login with return path
      const next = encodeURIComponent(pathname + event.url.search);
      throw redirect(303, `/login?next=${next}`);
    }

    // 4b. Role-Based Access Control (RBAC)
    // Pending status checks
    if (effectiveRole === 'parent_pending') {
      if (pathname.startsWith('/parent') || pathname.startsWith('/student')) {
        throw redirect(303, '/consent');
      }
      if (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/teacher') ||
        pathname.startsWith('/counselor') ||
        pathname.startsWith('/studio') ||
        pathname.startsWith('/author')
      ) {
        throw error(403, 'Forbidden: Guardian relationship cannot access staff workspaces');
      }
    }

    if (effectiveRole.endsWith('_pending')) {
      if (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/teacher') ||
        pathname.startsWith('/counselor') ||
        pathname.startsWith('/studio') ||
        pathname.startsWith('/author')
      ) {
        throw error(
          403,
          'Forbidden: Account pending institutional verification. An administrator must approve credentials before accessing workspaces.'
        );
      }
    }

    // Workspace-specific permissions
    if (pathname.startsWith('/admin')) {
      if (effectiveRole !== 'admin') {
        throw error(403, 'Forbidden: Administrative privilege required');
      }
    }

    if (pathname.startsWith('/teacher')) {
      if (!['teacher', 'admin'].includes(effectiveRole)) {
        throw error(403, 'Forbidden: Educator credential required');
      }
    }

    if (pathname.startsWith('/counselor')) {
      if (!['counselor', 'admin'].includes(effectiveRole)) {
        throw error(403, 'Forbidden: Counselor credential required');
      }
    }

    if (pathname.startsWith('/studio') || pathname.startsWith('/author')) {
      if (!['studio', 'admin', 'teacher'].includes(effectiveRole)) {
        throw error(403, 'Forbidden: Item calibration credentials required');
      }
    }

    if (pathname.startsWith('/parent')) {
      if (!['parent', 'admin'].includes(effectiveRole)) {
        throw error(403, 'Forbidden: Guardian relationship credential required');
      }
    }
  }

  return resolve(event);
};
