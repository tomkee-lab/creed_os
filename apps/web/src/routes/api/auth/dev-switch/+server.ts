import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const VALID_DEV_ROLES = ['student', 'parent', 'teacher', 'counselor', 'admin', 'studio'] as const;
type ValidDevRole = typeof VALID_DEV_ROLES[number];

const PERSONA_MAP: Record<ValidDevRole, { name: string; email: string; learnerId?: string }> = {
  student: {
    name: 'Student Learner',
    email: 'learner@core-os.app',
    learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  parent: {
    name: 'Parent Guardian',
    email: 'guardian@core-os.app',
    learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  teacher: {
    name: 'Lead Educator',
    email: 'educator@core-os.app'
  },
  counselor: {
    name: 'Academic Counselor',
    email: 'counselor@core-os.app'
  },
  admin: {
    name: 'System Administrator',
    email: 'admin@core-os.app'
  },
  studio: {
    name: 'Lead Psychometrician',
    email: 'studio@core-os.app'
  }
};

/**
 * Development-only persona switcher.
 * Sets the active dev persona cookie to allow authentic role verification during local development.
 * Disabled completely in production.
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
  if (!import.meta.env.DEV) {
    throw error(404, 'Not found');
  }

  const body = await request.json().catch(() => ({}));
  const requestedRole = (body.role || 'student') as ValidDevRole;

  if (!VALID_DEV_ROLES.includes(requestedRole)) {
    return json({ error: `Invalid role: ${requestedRole}` }, { status: 400 });
  }

  const persona = PERSONA_MAP[requestedRole];

  // Set development persona cookies (httpOnly, path=/)
  cookies.set('creed_dev_session', 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  });

  cookies.set('creed_dev_role', requestedRole, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  });

  cookies.set('creed_dev_user', JSON.stringify({
    id: `usr_${requestedRole}`,
    name: persona.name,
    email: persona.email,
    role: requestedRole,
    learnerId: persona.learnerId
  }), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  });

  // If parent persona, also ensure consent cookie is aligned unless explicitly testing pending consent
  if (requestedRole === 'parent') {
    cookies.set('creed_consent_verified', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60
    });
  }

  return json({
    success: true,
    activeRole: requestedRole,
    persona
  });
};

/**
 * Sign out / clear dev session
 */
export const DELETE: RequestHandler = async ({ cookies }) => {
  if (!import.meta.env.DEV) {
    throw error(404, 'Not found');
  }

  cookies.delete('creed_dev_session', { path: '/' });
  cookies.delete('creed_dev_role', { path: '/' });
  cookies.delete('creed_dev_user', { path: '/' });
  cookies.delete('creed_consent_verified', { path: '/' });

  return json({ success: true });
};
