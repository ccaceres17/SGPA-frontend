import {
  getProjects,
  getUsers,
  getProjectUsers,
  getStatuses,
  getResearchGroups,
  summarizeProjectsByStatus,
  buildRecentProjectsView,
  ROLE_IDS
} from '$lib/server/project-helpers.js';
import { getLocaleFromCookies } from '$lib/server/locale.js';

const RECENT_PROJECTS_LIMIT = 5;
const EMPTY_STATS = { active: 0, pending: 0, completed: 0, cancelled: 0, other: 0 };

function getCurrentStudentId(locals) {
  return Number(locals?.session?.user?.id_user || 0);
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals, cookies }) {
  const locale = getLocaleFromCookies(cookies);
  const currentStudentId = getCurrentStudentId(locals);

  if (!currentStudentId) {
    return {
      totalProjects: 0,
      totalEnrolled: 0,
      stats: EMPTY_STATS,
      recentProjects: [],
      error: 'Could not identify the logged-in student.'
    };
  }

  try {
    const [projects, users, relations, statuses, researchGroups] = await Promise.all([
      getProjects(fetch, 'students'),
      getUsers(fetch, 'students'),
      getProjectUsers(fetch, 'students').catch(() => []),
      getStatuses(fetch, 'students'),
      getResearchGroups(fetch, 'students')
    ]);

    const enrolledProjectIds = new Set(
      relations
        .filter(
          (relation) =>
            Number(relation.id_role) === ROLE_IDS.student &&
            Number(relation.id_user) === currentStudentId
        )
        .map((relation) => Number(relation.id_project))
    );

    const enrolledProjects = projects.filter((project) =>
      enrolledProjectIds.has(Number(project.id_project))
    );

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
        viewHrefFor: (id) => `/students/view_project/${id}?source=available`
      }
    );

    return {
      totalProjects: projects.length,
      totalEnrolled: enrolledProjects.length,
      stats: summarizeProjectsByStatus(projects, statuses),
      recentProjects
    };
  } catch (error) {
    return {
      totalProjects: 0,
      totalEnrolled: 0,
      stats: EMPTY_STATS,
      recentProjects: [],
      error: error.message || 'Could not load dashboard data.'
    };
  }
}
