import { fail } from '@sveltejs/kit';
import { API_BASE_URL } from '$lib/components/Tokens.js';
import {
  performCreateAvailability,
  performListOwnAvailability,
  performDeleteAvailability
} from '$lib/server/teacher-availability-request.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const result = await performListOwnAvailability(fetch, API_BASE_URL);

  if (!result.ok) {
    return { slots: [], error: 'Could not load your availability.' };
  }

  const slots = Array.isArray(result.data) ? result.data : [];
  return { slots: [...slots].sort((a, b) => a.day_of_week - b.day_of_week || String(a.start_time).localeCompare(String(b.start_time))) };
}

/** @type {import('./$types').Actions} */
export const actions = {
  addSlot: async ({ request, fetch }) => {
    const formData = await request.formData();
    const day_of_week = Number(formData.get('day_of_week'));
    const start_time = String(formData.get('start_time') || '');
    const end_time = String(formData.get('end_time') || '');

    if (Number.isNaN(day_of_week) || day_of_week < 0 || day_of_week > 6) {
      return fail(400, { error: 'Select a valid day.' });
    }

    if (!start_time || !end_time) {
      return fail(400, { error: 'Start and end time are required.' });
    }

    if (start_time >= end_time) {
      return fail(422, { error: 'The start time must be before the end time.' });
    }

    const result = await performCreateAvailability(fetch, API_BASE_URL, {
      day_of_week,
      start_time: `${start_time}:00`,
      end_time: `${end_time}:00`
    });

    if (!result.ok) {
      const errorKey =
        result.status === 409
          ? 'overlap'
          : result.status === 422
            ? 'invalid'
            : 'generic';

      return fail(result.status || 500, { errorKey });
    }

    return { success: true };
  },

  deleteSlot: async ({ request, fetch }) => {
    const formData = await request.formData();
    const idAvailability = Number(formData.get('idAvailability'));

    if (!idAvailability) {
      return fail(400, { error: 'Invalid availability slot.' });
    }

    const result = await performDeleteAvailability(fetch, API_BASE_URL, idAvailability);

    if (!result.ok) {
      return fail(result.status || 500, { error: 'Could not delete this slot.' });
    }

    return { success: true, deleted: true };
  }
};
