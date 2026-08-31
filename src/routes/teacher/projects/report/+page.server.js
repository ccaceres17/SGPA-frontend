import { getProjectsReport } from '$lib/server/report-helpers.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals }) {
  try {
    const report = await getProjectsReport({
      fetch,
      locals,
      moduleName: 'teacher',
      scope: 'all',
      title: 'Professor available projects report',
      subtitle:
        'Report of academic projects visible from the professor module, including project status, assigned professor, and enrolled students.'
    });

    return { report };
  } catch (error) {
    return {
      error: error.message || 'Could not generate professor projects report.',
      report: {
        title: 'Professor available projects report',
        subtitle: 'Report of visible academic projects.',
        projects: []
      }
    };
  }
}