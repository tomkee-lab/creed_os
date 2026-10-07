import { auth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
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
    // In dev / uninitialized states, gracefully default to null session
    event.locals.session = null;
    event.locals.user = null;
  }

  return resolve(event);
};
