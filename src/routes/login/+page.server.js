import { fail, redirect } from '@sveltejs/kit';
import { API_BASE_URL } from '$lib/components/Tokens.js';
import { performLogin } from '$lib/server/login-request.js';
import { getLocaleFromCookies } from '$lib/server/locale.js';
import { translate } from '$lib/i18n/locale.js';
import { messages } from '$lib/i18n/messages.js';
import {
  buildSession,
  getRoleHome,
  getSessionFromCookies,
  normalizeRole,
  setSession
} from '$lib/server/auth-session.js';

function normalizeSelectedRole(role = '') {
  const normalized = normalizeRole(role);

  if (normalized === 'students') return 'students';
  if (normalized === 'teacher') return 'teacher';
  if (normalized === 'coordinator') return 'coordinator';

  return '';
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, url }) {
  const session = getSessionFromCookies(cookies);

  if (session) {
    throw redirect(303, getRoleHome(session.user.normalizedRole));
  }

  const locale = getLocaleFromCookies(cookies);
  const reason = url.searchParams.get('reason');
  const logout = url.searchParams.get('logout');

  let notice = '';

  if (reason === 'expired') {
    notice = translate(messages, 'notices.sessionExpired', locale);
  } else if (reason === 'forbidden') {
    notice = translate(messages, 'notices.forbiddenModule', locale);
  } else if (logout === '1') {
    notice = translate(messages, 'notices.loggedOut', locale);
  }

  return {
    notice
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const locale = getLocaleFromCookies(cookies);
    const t = (key) => translate(messages, key, locale);

    const formData = await request.formData();

    const email = String(formData.get('email') || formData.get('usuario') || '').trim();
    const password = String(formData.get('password') || '').trim();
    const selectedRole = normalizeSelectedRole(formData.get('role'));

    if (!selectedRole) {
      return fail(400, {
        error: t('errors.missingRole'),
        email,
        selectedRole: 'students'
      });
    }

    if (!email || !password) {
      return fail(400, {
        error: t('errors.missingFields'),
        email,
        selectedRole
      });
    }

    const loginResult = await performLogin(fetch, API_BASE_URL, email, password);

    if (!loginResult.ok) {
      const ERROR_KEY_BY_TYPE = {
        forbidden: 'errors.forbidden',
        'service-unavailable': 'errors.serviceUnavailable'
      };

      const errorKey = ERROR_KEY_BY_TYPE[loginResult.error?.type] || 'errors.invalidCredentials';

      return fail(loginResult.status || 500, {
        error: t(errorKey),
        email,
        selectedRole
      });
    }

    const accessToken =
      loginResult.data?.access_token ||
      loginResult.data?.token ||
      loginResult.data?.accessToken;

    const user = loginResult.data?.user;

    if (!accessToken || !user) {
      return fail(500, {
        error: t('errors.genericFailure'),
        email,
        selectedRole
      });
    }

    const session = buildSession({
      accessToken,
      user
    });

    const apiRole = normalizeRole(session.user.normalizedRole || session.user.role);

    if (!apiRole) {
      return fail(500, {
        error: t('errors.missingRoleInfo'),
        email,
        selectedRole
      });
    }

    if (apiRole !== selectedRole) {
      return fail(403, {
        error: t('errors.roleMismatch'),
        email,
        selectedRole
      });
    }

    try {
      setSession(cookies, session);
    } catch (_error) {
      return fail(500, {
        error: t('errors.sessionSaveFailed'),
        email,
        selectedRole
      });
    }

    throw redirect(303, getRoleHome(apiRole));
  }
};
