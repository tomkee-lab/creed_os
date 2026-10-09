import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(303, '/login?next=/student');
  }

  const role = (user as any)?.role || (user as any)?.metadata?.role;

  if (role === 'parent_pending') {
    throw redirect(303, '/consent');
  }

  return {};
};
