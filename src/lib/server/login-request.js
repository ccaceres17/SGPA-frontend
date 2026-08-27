/**
 * Backend contract (C4): POST /api/auth/login, Content-Type: application/json,
 * body { email, password }. No query-string or form-encoded fallbacks.
 *
 * This module has no SvelteKit-specific imports so it can be exercised directly
 * in tests without going through Vite's module resolution.
 */

export function buildLoginUrl(baseUrl) {
  return `${baseUrl}/auth/login`;
}

export function buildLoginRequestInit(email, password) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ email, password })
  };
}

export function classifyLoginError(status, data) {
  const detail =
    typeof data === 'string'
      ? data
      : data?.detail || data?.message || data?.error || '';

  const code = Number(status) || 0;

  if (code === 400 || code === 401) return 'Incorrect credentials.';
  if (code === 403) return 'You do not have permission to access the system.';
  if (code === 422) return 'The login request format is not accepted by the API.';
  if (code >= 500) return 'The server had an internal error. Please try again later.';
  if (code === 0) return 'Could not connect to the server. Please try again.';

  return detail ? String(detail) : 'Could not complete login. Please try again.';
}

async function parseResponseBody(response) {
  const text = await response.text().catch(() => '');

  try {
    return text ? JSON.parse(text) : null;
  } catch (_) {
    return text;
  }
}

/**
 * Performs the single, documented login request. Never falls back to
 * query-string or form-encoded credentials.
 */
export async function performLogin(fetch, baseUrl, email, password) {
  const url = buildLoginUrl(baseUrl);
  const init = buildLoginRequestInit(email, password);

  let response;

  try {
    response = await fetch(url, init);
  } catch (_networkError) {
    return {
      ok: false,
      status: 0,
      error: classifyLoginError(0, null)
    };
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data,
      error: classifyLoginError(response.status, data)
    };
  }

  return {
    ok: true,
    status: response.status,
    data
  };
}
