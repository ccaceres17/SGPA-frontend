/**
 * Backend contract: POST /api/auth/claim-account { token, password },
 * POST /api/auth/forgot-password { email },
 * POST /api/auth/reset-password { token, password }.
 *
 * This module has no SvelteKit-specific imports so it can be exercised
 * directly in tests without going through Vite's module resolution — same
 * convention as src/lib/server/login-request.js.
 */

export function buildClaimAccountUrl(baseUrl) {
  return `${baseUrl}/auth/claim-account`;
}

export function buildForgotPasswordUrl(baseUrl) {
  return `${baseUrl}/auth/forgot-password`;
}

export function buildResetPasswordUrl(baseUrl) {
  return `${baseUrl}/auth/reset-password`;
}

/**
 * Classifies an HTTP failure into a typed, user-facing outcome — mirrors the
 * { type, message } shape used by login-request.js/status-update.js.
 */
export function classifyAccountLifecycleError(status, data) {
  const detail = data?.detail;

  if (detail === 'INVALID_TOKEN') {
    return { type: 'invalid-token', message: 'This link is invalid.' };
  }

  if (detail === 'EXPIRED_TOKEN') {
    return { type: 'expired-token', message: 'This link has expired.' };
  }

  if (detail === 'ALREADY_CLAIMED') {
    return { type: 'already-claimed', message: 'This account has already been activated.' };
  }

  const code = Number(status) || 0;

  if (code >= 500 || code === 0) {
    return {
      type: 'service-unavailable',
      message: 'The service is temporarily unavailable. Please try again shortly.'
    };
  }

  return { type: 'generic-error', message: 'Something went wrong. Please try again.' };
}

async function parseResponseBody(response) {
  const text = await response.text().catch(() => '');

  try {
    return text ? JSON.parse(text) : null;
  } catch (_) {
    return text;
  }
}

async function postJson(fetch, url, body) {
  let response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (_networkError) {
    return { ok: false, status: 0, error: classifyAccountLifecycleError(0, null) };
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    return { ok: false, status: response.status, data, error: classifyAccountLifecycleError(response.status, data) };
  }

  return { ok: true, status: response.status, data };
}

export function performClaimAccount(fetch, baseUrl, token, password) {
  return postJson(fetch, buildClaimAccountUrl(baseUrl), { token, password });
}

export function performForgotPassword(fetch, baseUrl, email) {
  return postJson(fetch, buildForgotPasswordUrl(baseUrl), { email });
}

export function performResetPassword(fetch, baseUrl, token, password) {
  return postJson(fetch, buildResetPasswordUrl(baseUrl), { token, password });
}
