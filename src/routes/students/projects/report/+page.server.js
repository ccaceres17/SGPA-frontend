import { getProjectsReport } from '$lib/server/report-helpers.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals }) {
  try {
    const report = await getProjectsReport({
      fetch,
      locals,
      moduleName: 'students',
      scope: 'all',
      title: 'Student available projects report',
      subtitle:
        'Report of academic projects available from the student module, including professors and enrolled students.'
    });

    return { report };
  } catch (error) {
    return {
      error: error.message || 'Could not generate available projects report.',
      report: {
        title: 'Student available projects report',
        subtitle: 'Report of available academic projects.',
        projects: []
      }
    };
  }
}