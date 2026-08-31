import { getCoordinatorUsersReport } from '$lib/server/coordinator-user-report-helpers.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals }) {
  try {
    const report = await getCoordinatorUsersReport({
      fetch,
      locals,
      userType: 'teachers'
    });

    return { report };
  } catch (error) {
    return {
      error: error.message || 'Could not generate professors report.',
      report: {
        title: 'Professors report',
        subtitle: 'Coordinator report of professor accounts.',
        users: []
      }
    };
  }
}