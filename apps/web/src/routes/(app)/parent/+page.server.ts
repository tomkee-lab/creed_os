import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(303, '/login?next=/parent');
  }

  const role = (user as any)?.role || (user as any)?.metadata?.role;
  const hasVerifiedConsent = cookies.get('creed_consent_verified') === 'true';

  if (role === 'parent_pending' && !hasVerifiedConsent) {
    throw redirect(303, '/consent');
  }

  if (!['parent', 'admin'].includes(role) && !(role === 'parent_pending' && hasVerifiedConsent)) {
    throw error(403, 'Forbidden: Verified guardian relationship credential required to access Parent Portal');
  }

  return {};
};
