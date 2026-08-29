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

/**
 * Classifies an HTTP failure into a typed, user-facing outcome — mirrors the
 * { type, message } shape used by src/lib/server/status-update.js. `message`
 * is the English default (also what the test suite asserts); callers that
 * need Spanish look up the localized copy for `type` via
 * src/lib/i18n/messages.js#errors instead of using this string directly.
 */
export function classifyLoginError(status, _data) {
  const code = Number(status) || 0;

  if (code === 400 || code === 401 || code === 422) {
    return { type: 'invalid-credentials', message: 'Unable to sign in with the credentials provided.' };
  }

  if (code === 403) {
    return { type: 'forbidden', message: 'You do not have permission to access the system.' };
  }

  if (code >= 500 || code === 0) {
    return {
      type: 'service-unavailable',
      message: 'The service is temporarily unavailable. Please try again shortly.'
    };
  }

  return { type: 'invalid-credentials', message: 'Unable to sign in with the credentials provided.' };
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
