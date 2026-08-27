import { fail } from '@sveltejs/kit';
import { API_BASE_URL, getAuthHeaders } from '$lib/components/Tokens.js';

const USERS_ENDPOINT = `${API_BASE_URL}/users`;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();

		const first_name = formData.get('first_name')?.toString().trim() || '';
		const last_name = formData.get('last_name')?.toString().trim() || '';
		const email = formData.get('email')?.toString().trim() || '';
		const phone = formData.get('phone')?.toString().trim() || '';
		const password = formData.get('password')?.toString().trim() || '';
		const id_role = Number(formData.get('id_role'));
		const is_active = formData.get('is_active') === 'on';

		const values = {
			first_name,
			last_name,
			email,
			phone,
			id_role,
			is_active
		};

		if (!first_name || !last_name || !email || !phone || !password || !id_role) {
			return fail(400, {
				success: false,
				error: 'All fields are required.',
				values
			});
		}

		if (![1, 3].includes(id_role)) {
			return fail(400, {
				success: false,
				error: 'The selected role is not valid. Only Student or Teacher is allowed.',
				values
			});
		}

		const payload = {
			first_name,
			last_name,
			email,
			password_hash: password,
			phone,
			id_role,
			is_active
		};

		try {
			const response = await fetch(USERS_ENDPOINT, {
				method: 'POST',
				headers: getAuthHeaders("coordinator"),
				body: JSON.stringify(payload)
			});

			const rawText = await response.text();

			let result = null;

			try {
				result = rawText ? JSON.parse(rawText) : null;
			} catch {
				result = { raw: rawText };
			}

			if (response.status === 401) {
				return fail(401, {
					success: false,
					error: 'Unauthorized. The coordinator token expired or is not valid.',
					values
				});
			}

			if (!response.ok) {
				return fail(400, {
					success: false,
					error:
						result?.message ||
						result?.error ||
						result?.detail ||
						result?.raw ||
						`La API devolvió error ${response.status}.`,
					values
				});
			}

			return {
				success: true,
				message: 'User created successfully.',
				createdUser: result
			};
		} catch (error) {
			return fail(400, {
				success: false,
				error: 'The server connection or processing failed.',
				values
			});
		}
	}
};