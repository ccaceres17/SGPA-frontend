import { fail, redirect } from '@sveltejs/kit';
import { API_BASE_URL } from '$lib/components/Tokens.js';
import { performLogin } from '$lib/server/login-request.js';
import {
  buildSession,
  getRoleHome,
  getSessionFromCookies,
  normalizeRole,
  setSession
} from '$lib/server/auth-session.js';

const ROLE_LABELS = {
  students: 'Student',
  teacher: 'Teacher',
  coordinator: 'Coordinator'
};

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

  const reason = url.searchParams.get('reason');
  const logout = url.searchParams.get('logout');

  let notice = '';

  if (reason === 'expired') {
    notice = 'Your session expired. Please log in again.';
  } else if (reason === 'forbidden') {
    notice = 'You do not have permission to access that module.';
  } else if (logout === '1') {
    notice = 'Session closed successfully.';
  }

  return {
    notice
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();

    const email = String(formData.get('email') || formData.get('usuario') || '').trim();
    const password = String(formData.get('password') || '').trim();
    const selectedRole = normalizeSelectedRole(formData.get('role'));

    if (!selectedRole) {
      return fail(400, {
        error: 'Select a valid role.',
        email,
        selectedRole: 'students'
      });
    }

    if (!email || !password) {
      return fail(400, {
        error: 'Enter your email and password.',
        email,
        selectedRole
      });
    }

    const loginResult = await performLogin(fetch, API_BASE_URL, email, password);

    if (!loginResult.ok) {
      return fail(loginResult.status || 500, {
        error: loginResult.error,
        email,
        selectedRole
      });
    }

    const accessToken =
      loginResult.data?.access_token ||
      loginResult.data?.token ||
      loginResult.data?.accessToken;

    const user = loginResult.data?.user;

    if (!accessToken) {
      return fail(500, {
        error: 'The API response did not include an access token.',
        email,
        selectedRole
      });
    }

    if (!user) {
      return fail(500, {
        error: 'The API response did not include user data.',
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
        error: 'The API response did not include a valid user role.',
        email,
        selectedRole
      });
    }

    if (apiRole !== selectedRole) {
      return fail(403, {
        error: `You do not have permission to log in as ${ROLE_LABELS[selectedRole]}.`,
        email,
        selectedRole
      });
    }

    try {
      setSession(cookies, session);
    } catch (error) {
      return fail(500, {
        error: error.message || 'Could not save the session.',
        email,
        selectedRole
      });
    }

    throw redirect(303, getRoleHome(apiRole));
  }
};