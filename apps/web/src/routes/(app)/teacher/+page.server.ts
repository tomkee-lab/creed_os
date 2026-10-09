import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(303, '/login?next=/teacher');
  }

  const role = (user as any)?.role || (user as any)?.metadata?.role;
  if (!['teacher', 'admin'].includes(role)) {
    throw error(403, 'Forbidden: Educator credential required to access Teacher Copilot');
  }

  return {};
};
