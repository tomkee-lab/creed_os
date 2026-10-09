import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(303, '/login?next=/parent');
  }

  const role = (user as any)?.role || (user as any)?.metadata?.role;

  if (role === 'parent_pending') {
    throw redirect(303, '/consent');
  }

  if (!['parent', 'admin'].includes(role)) {
    throw error(403, 'Forbidden: Verified guardian relationship credential required to access Parent Portal');
  }

  return {};
};
