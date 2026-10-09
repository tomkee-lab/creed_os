import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(303, '/login?next=/student');
  }

  const role = (user as any)?.role || (user as any)?.metadata?.role;
  const hasVerifiedConsent = cookies.get('creed_consent_verified') === 'true';

  if (role === 'parent_pending' && !hasVerifiedConsent) {
    throw redirect(303, '/consent');
  }

  return {};
};
