import { fail } from '@sveltejs/kit';
import { API_BASE_URL } from '$lib/components/Tokens.js';
import { performForgotPassword } from '$lib/server/account-lifecycle-request.js';

export const actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const email = String(formData.get('email') || '').trim();

    if (!email) {
      return fail(400, { errorType: 'generic-error' });
    }

    const result = await performForgotPassword(fetch, API_BASE_URL, email);

    // The backend always returns the same response whether or not the
    // email matched an account (anti-enumeration). The frontend adds a
    // second layer of the same guarantee by never branching on response
    // content here — only on transport-level success/failure, which is
    // identical regardless of whether the email exists.
    if (!result.ok) {
      return fail(result.status || 500, { errorType: result.error.type });
    }

    return { success: true };
  }
};
