import { getProjectsReport } from '$lib/server/report-helpers.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals }) {
  try {
    const report = await getProjectsReport({
      fetch,
      locals,
      moduleName: 'teacher',
      scope: 'teacher_mine',
      title: 'Professor assigned projects report',
      subtitle:
        'Report of academic projects assigned to the logged-in professor profile.'
    });

    return { report };
  } catch (error) {
    return {
      error: error.message || 'Could not generate assigned projects report.',
      report: {
        title: 'Professor assigned projects report',
        subtitle: 'Report of assigned academic projects.',
        projects: []
      }
    };
  }
}