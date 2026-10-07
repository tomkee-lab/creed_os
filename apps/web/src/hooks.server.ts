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
    console.error(`[auth] Session retrieval failure on ${event.request.method} ${event.url.pathname}:`, err);
    event.locals.session = null;
    event.locals.user = null;
  }

  return resolve(event);
};
