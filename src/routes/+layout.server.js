import { getPublicSession } from '$lib/server/auth-session.js';
import { getLocaleFromCookies } from '$lib/server/locale.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, cookies }) {
  return {
    session: getPublicSession(locals.session),
    locale: getLocaleFromCookies(cookies)
  };
}
