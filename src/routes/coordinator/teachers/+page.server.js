import { fail } from '@sveltejs/kit';
import { API_BASE_URL, getAuthHeaders } from '$lib/components/Tokens.js';
import { getUsers, ROLE_IDS } from '$lib/server/project-helpers.js';
import { applyStatusUpdate } from '$lib/server/status-update.js';

function toBool(value) {
  return value === true || String(value).trim().toLowerCase() === 'true';
}

function normalizeActiveStatus(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;

  const normalized = String(value ?? '').trim().toLowerCase();

  if (['true', '1', 'active', 'enabled', 'activo', 'si', 'sí', 'yes'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'inactive', 'disabled', 'inactivo', 'no', '', 'null', 'undefined'].includes(normalized)) {
    return false;
  }

  return Boolean(value);
}

function getApiUrl(path) {
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`;
}

async function apiRequest(fetch, path, method, payload) {
  const response = await fetch(getApiUrl(path), {
    method,
    headers: {
      ...getAuthHeaders('coordinator'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text().catch(() => '');
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = text;
  }

  if (!response.ok) {
    const detail =
      typeof data === 'string'
        ? data
        : data?.detail || data?.message || data?.error || JSON.stringify(data);

    const error = new Error(`Status ${response.status}. ${detail}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function buildFullPayload(user, isActive) {
  const payload = {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || user.phone_number || '',
    phone_number: user.phone_number || user.phone || '',
    id_role: Number(user.id_role || ROLE_IDS.teacher),
    is_active: Boolean(isActive)
  };

  if (user.password_hash) {
    payload.password_hash = user.password_hash;
  }

  return payload;
}

/**
 * Tries PATCH first, then falls back to a full PUT if the API does not
 * support partial updates. If both attempts fail, this throws — it never
 * swallows the failure, so the caller (and applyStatusUpdate) can never
 * mistake a rejected mutation for a persisted one.
 */
async function persistUserStatus(fetch, userId, isActive) {
  try {
    await apiRequest(fetch, `users/${userId}`, 'PATCH', {
      is_active: Boolean(isActive)
    });

    return;
  } catch (_patchError) {
    // Fall through to the PUT fallback below.
  }

  const users = await getUsers(fetch, 'coordinator');
  const user = users.find((item) => Number(item.id_user) === Number(userId));

  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  await apiRequest(fetch, `users/${userId}`, 'PUT', buildFullPayload(user, isActive));
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const users = await getUsers(fetch, 'coordinator');

    const teachers = users
      .filter((user) => Number(user.id_role) === ROLE_IDS.teacher)
      .map((user) => ({
        ...user,
        is_active: normalizeActiveStatus(user.is_active)
      }))
      .sort((a, b) =>
        `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
      );

    return {
      users: teachers,
      totalUsers: teachers.length
    };
  } catch (error) {
    return {
      users: [],
      totalUsers: 0,
      error: error.message || 'Could not load teachers.'
    };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  toggleStatus: async ({ request, fetch }) => {
    const formData = await request.formData();
    const userId = Number(formData.get('id_user'));
    const isActive = toBool(formData.get('is_active'));

    if (!userId) {
      return fail(400, {
        error: 'Invalid user.'
      });
    }

    const result = await applyStatusUpdate(() => persistUserStatus(fetch, userId, isActive));

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    return {
      success: true,
      visualUserId: userId,
      visualIsActive: isActive,
      message: isActive ? 'Teacher enabled successfully.' : 'Teacher disabled successfully.'
    };
  }
};