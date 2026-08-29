import {
  getProjects,
  getUsers,
  getProjectUsers,
  getStatuses,
  getResearchGroups,
  summarizeProjectsByStatus,
  buildRecentProjectsView,
  getStudents,
  getTeachers
} from '$lib/server/project-helpers.js';
import { getLocaleFromCookies } from '$lib/server/locale.js';

const RECENT_PROJECTS_LIMIT = 5;
const EMPTY_STATS = { active: 0, pending: 0, completed: 0, cancelled: 0, other: 0 };

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, cookies }) {
  const locale = getLocaleFromCookies(cookies);

  try {
    const [projects, users, relations, statuses, researchGroups] = await Promise.all([
      getProjects(fetch, 'coordinator'),
      getUsers(fetch, 'coordinator'),
      getProjectUsers(fetch, 'coordinator').catch(() => []),
      getStatuses(fetch, 'coordinator'),
      getResearchGroups(fetch, 'coordinator')
    ]);

    const recentProjects = buildRecentProjectsView(
      [...projects]
        .sort((a, b) => Number(b.id_project) - Number(a.id_project))
        .slice(0, RECENT_PROJECTS_LIMIT),
      {
        users,
        relations,
        statuses,
        researchGroups,
        locale,
        viewHrefFor: (id) => `/coordinator/view_project/${id}`
      }
    );

    return {
      totalProjects: projects.length,
      totalStudents: getStudents(users).length,
      totalTeachers: getTeachers(users).length,
      totalResearchGroups: researchGroups.length,
      stats: summarizeProjectsByStatus(projects, statuses),
      recentProjects
    };
  } catch (error) {
    return {
      totalProjects: 0,
      totalStudents: 0,
      totalTeachers: 0,
      totalResearchGroups: 0,
      stats: EMPTY_STATS,
      recentProjects: [],
      error: error.message || 'Could not load dashboard data.'
    };
  }
}
