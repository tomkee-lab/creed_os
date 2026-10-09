import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(303, '/login?next=/counselor');
  }

  const role = (user as any)?.role || (user as any)?.metadata?.role;
  if (!['counselor', 'admin'].includes(role)) {
    throw error(403, 'Forbidden: Counselor credential required to access Counselor Intelligence Center');
  }

  return {};
};
