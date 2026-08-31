import { fail } from '@sveltejs/kit';
import { API_BASE_URL } from '$lib/components/Tokens.js';
import { performClaimAccount } from '$lib/server/account-lifecycle-request.js';

/**
 * The token is intentionally never returned from load(): SvelteKit
 * serializes load() data into the page's hydration payload, so returning
 * the token would put it in the page source for no benefit — the form
 * action below reads it directly from `params`, server-side only.
 */
export async function load() {
  return {};
}

export const actions = {
  default: async ({ request, fetch, params }) => {
    const formData = await request.formData();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (!password || !confirmPassword) {
      return fail(400, { errorType: 'missing-fields' });
    }

    if (password !== confirmPassword) {
      return fail(400, { errorType: 'password-mismatch' });
    }

    const result = await performClaimAccount(fetch, API_BASE_URL, params.token, password);

    if (!result.ok) {
      return fail(result.status || 500, { errorType: result.error.type });
    }

    return { success: true };
  }
};
