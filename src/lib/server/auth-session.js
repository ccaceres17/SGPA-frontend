import { dev } from '$app/environment';

export const SESSION_COOKIE = 'sgpa_session';

const ROLE_ALIASES = {
  student: 'students',
  students: 'students',
  estudiante: 'students',

  teacher: 'teacher',
  teachers: 'teacher',
  professor: 'teacher',
  profesor: 'teacher',
  docente: 'teacher',

  coordinator: 'coordinator',
  coordinador: 'coordinator',
  admin: 'coordinator',
  administrator: 'coordinator'
};

export const ROLE_HOME = {
  students: '/students',
  teacher: '/teacher',
  coordinator: '/coordinator'
};

export function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch (_) {
    return fallback;
  }
}

export function decodeJwtPayload(token = '') {
  const parts = String(token).split('.');

  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = Buffer.from(padded, 'base64').toString('utf-8');

    return JSON.parse(json);
  } catch (_) {
    return null;
  }
}

export function normalizeRole(role = '') {
  const normalized = String(role || '').trim().toLowerCase();
  return ROLE_ALIASES[normalized] || normalized;
}

export function getRoleHome(role = '') {
  const normalizedRole = normalizeRole(role);
  return ROLE_HOME[normalizedRole] || '/login';
}

export function getRoleLabel(role = '') {
  const normalizedRole = normalizeRole(role);

  const labels = {
    students: 'Student',
    teacher: 'Professor',
    coordinator: 'Coordinator'
  };

  return labels[normalizedRole] || 'User';
}

export function getSessionExpFromToken(token = '') {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return null;
  }

  const exp = Number(payload.exp);

  if (!Number.isFinite(exp)) {
    return null;
  }

  return exp;
}

export function isExpired(exp) {
  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return Number(exp) <= now;
}

function getFirstNameFromUser(user = {}, tokenPayload = {}) {
  const rawName =
    user.first_name ||
    user.firstname ||
    user.firstName ||
    user.name ||
    user.full_name ||
    user.fullName ||
    tokenPayload.first_name ||
    tokenPayload.firstname ||
    tokenPayload.firstName ||
    tokenPayload.name ||
    tokenPayload.full_name ||
    tokenPayload.fullName ||
    '';

  const cleanedName = String(rawName).trim();

  if (cleanedName) {
    return cleanedName.split(/\s+/)[0];
  }

  const email = user.email || tokenPayload.email || '';

  if (email && String(email).includes('@')) {
    return String(email).split('@')[0];
  }

  return 'User';
}

function getLastNameFromUser(user = {}, tokenPayload = {}) {
  return (
    user.last_name ||
    user.lastname ||
    user.lastName ||
    tokenPayload.last_name ||
    tokenPayload.lastname ||
    tokenPayload.lastName ||
    ''
  );
}

export function buildSession({ accessToken, user }) {
  const tokenPayload = decodeJwtPayload(accessToken);
  const exp = getSessionExpFromToken(accessToken);

  const rawRole =
    user?.role ||
    user?.role_name ||
    user?.id_role ||
    tokenPayload?.role ||
    tokenPayload?.role_name ||
    '';

  const normalizedRole = normalizeRole(rawRole);

  const firstName = getFirstNameFromUser(user, tokenPayload);
  const lastName = getLastNameFromUser(user, tokenPayload);

  return {
    accessToken,
    exp,
    user: {
      id_user: user?.id_user ?? user?.id ?? tokenPayload?.id_user ?? tokenPayload?.sub ?? null,
      email: user?.email ?? tokenPayload?.email ?? '',
      role: rawRole,
      normalizedRole,
      roleLabel: getRoleLabel(normalizedRole),
      first_name: firstName,
      last_name: lastName,
      displayName: `${firstName} - ${getRoleLabel(normalizedRole)}`
    }
  };
}

export function validateSessionShape(session) {
  if (!session?.accessToken) {
    return {
      ok: false,
      error: 'Missing access token.'
    };
  }

  if (!session?.user) {
    return {
      ok: false,
      error: 'Missing user data.'
    };
  }

  if (!session?.user?.normalizedRole) {
    return {
      ok: false,
      error: 'Missing user role.'
    };
  }

  if (!session?.exp) {
    return {
      ok: false,
      error: 'The token does not include an expiration date.'
    };
  }

  if (isExpired(session.exp)) {
    return {
      ok: false,
      error: 'Session expired.'
    };
  }

  return {
    ok: true,
    error: null
  };
}

export function getSessionFromCookies(cookies) {
  const raw = cookies.get(SESSION_COOKIE);

  if (!raw) {
    return null;
  }

  const session = safeJsonParse(raw, null);
  const validation = validateSessionShape(session);

  if (!validation.ok) {
    clearSession(cookies);
    return null;
  }

  return session;
}

export function setSession(cookies, session) {
  const validation = validateSessionShape(session);

  if (!validation.ok) {
    throw new Error(validation.error || 'Invalid session.');
  }

  const now = Math.floor(Date.now() / 1000);
  const maxAge = Math.max(1, Number(session.exp) - now);

  cookies.set(SESSION_COOKIE, JSON.stringify(session), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    maxAge
  });
}

export function clearSession(cookies) {
  cookies.delete(SESSION_COOKIE, {
    path: '/'
  });
}

export function getPublicSession(session) {
  if (!session) return null;

  return {
    exp: session.exp,
    user: {
      id_user: session.user?.id_user ?? null,
      email: session.user?.email ?? '',
      role: session.user?.role ?? '',
      normalizedRole: session.user?.normalizedRole ?? '',
      roleLabel: session.user?.roleLabel ?? getRoleLabel(session.user?.normalizedRole),
      first_name: session.user?.first_name ?? 'User',
      last_name: session.user?.last_name ?? '',
      displayName:
        session.user?.displayName ||
        `${session.user?.first_name || 'User'} - ${getRoleLabel(session.user?.normalizedRole)}`
    }
  };
}

export function isProtectedPath(pathname = '') {
  return (
    pathname.startsWith('/students') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/coordinator')
  );
}

export function getRequiredRoleForPath(pathname = '') {
  if (pathname.startsWith('/students')) return 'students';
  if (pathname.startsWith('/teacher')) return 'teacher';
  if (pathname.startsWith('/coordinator')) return 'coordinator';

  return null;
}

export function createLoginRedirect(pathname = '/', reason = '') {
  const params = new URLSearchParams();

  if (pathname && pathname !== '/login') {
    params.set('next', pathname);
  }

  if (reason) {
    params.set('reason', reason);
  }

  const query = params.toString();

  return query ? `/login?${query}` : '/login';
}