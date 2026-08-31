import { getProjectsReport } from '$lib/server/report-helpers.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals }) {
  try {
    const report = await getProjectsReport({
      fetch,
      locals,
      moduleName: 'coordinator',
      scope: 'all',
      title: 'Coordinator projects report',
      subtitle:
        'General report of academic projects, assigned professors, enrolled students, and current project status.'
    });

    return { report };
  } catch (error) {
    return {
      error: error.message || 'Could not generate coordinator projects report.',
      report: {
        title: 'Coordinator projects report',
        subtitle: 'General report of academic projects.',
        projects: []
      }
    };
  }
}