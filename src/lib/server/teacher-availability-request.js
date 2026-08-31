/**
 * Backend contract: POST /api/teacher-availability { day_of_week, start_time,
 * end_time }, GET /api/teacher-availability/me, GET /api/teacher-availability/{id_user},
 * DELETE /api/teacher-availability/{id_availability}.
 *
 * This module has no SvelteKit-specific imports so it can be exercised
 * directly in tests without going through Vite's module resolution — same
 * convention as account-lifecycle-request.js. The Authorization header is
 * attached automatically by hooks.server.js's handleFetch for any request
 * whose URL starts with API_BASE_URL, so callers only need to pass the
 * SvelteKit-provided `fetch`.
 */

export function buildCreateAvailabilityUrl(baseUrl) {
  return `${baseUrl}/teacher-availability`;
}

export function buildOwnAvailabilityUrl(baseUrl) {
  return `${baseUrl}/teacher-availability/me`;
}

export function buildAvailabilityForTeacherUrl(baseUrl, idUser) {
  return `${baseUrl}/teacher-availability/${idUser}`;
}

export function buildDeleteAvailabilityUrl(baseUrl, idAvailability) {
  return `${baseUrl}/teacher-availability/${idAvailability}`;
}

async function parseResponseBody(response) {
  const text = await response.text().catch(() => '');

  try {
    return text ? JSON.parse(text) : null;
  } catch (_) {
    return text;
  }
}

async function sendRequest(fetch, url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {})
      }
    });
  } catch (_networkError) {
    return { ok: false, status: 0, data: null };
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    return { ok: false, status: response.status, data };
  }

  return { ok: true, status: response.status, data };
}

export function performCreateAvailability(fetch, baseUrl, slot) {
  return sendRequest(fetch, buildCreateAvailabilityUrl(baseUrl), {
    method: 'POST',
    body: JSON.stringify(slot)
  });
}

export function performListOwnAvailability(fetch, baseUrl) {
  return sendRequest(fetch, buildOwnAvailabilityUrl(baseUrl));
}

export function performListAvailabilityForTeacher(fetch, baseUrl, idUser) {
  return sendRequest(fetch, buildAvailabilityForTeacherUrl(baseUrl, idUser));
}

export function performDeleteAvailability(fetch, baseUrl, idAvailability) {
  return sendRequest(fetch, buildDeleteAvailabilityUrl(baseUrl, idAvailability), {
    method: 'DELETE'
  });
}
