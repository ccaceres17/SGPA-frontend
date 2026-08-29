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

function getCurrentTeacherId(locals) {
  return Number(locals?.session?.user?.id_user || 0);
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals, cookies }) {
  const locale = getLocaleFromCookies(cookies);
  const currentTeacherId = getCurrentTeacherId(locals);

  if (!currentTeacherId) {
    return {
      totalProjects: 0,
      stats: EMPTY_STATS,
      recentProjects: [],
      error: 'Could not identify the logged-in teacher.'
    };
  }

  try {
    const [projects, users, relations, statuses, researchGroups] = await Promise.all([
      getProjects(fetch, 'teacher'),
      getUsers(fetch, 'teacher'),
      getProjectUsers(fetch, 'teacher').catch(() => []),
      getStatuses(fetch, 'teacher'),
      getResearchGroups(fetch, 'teacher')
    ]);

    const assignedProjectIds = new Set(
      relations
        .filter(
          (relation) =>
            Number(relation.id_role) === ROLE_IDS.teacher &&
            Number(relation.id_user) === currentTeacherId
        )
        .map((relation) => Number(relation.id_project))
    );

    const teacherProjects = projects.filter((project) =>
      assignedProjectIds.has(Number(project.id_project))
    );

    const recentProjects = buildRecentProjectsView(
      [...teacherProjects]
        .sort((a, b) => Number(b.id_project) - Number(a.id_project))
        .slice(0, RECENT_PROJECTS_LIMIT),
      {
        users,
        relations,
        statuses,
        researchGroups,
        locale,
        viewHrefFor: (id) => `/teacher/view_project/${id}`
      }
    );

    return {
      totalProjects: teacherProjects.length,
      stats: summarizeProjectsByStatus(teacherProjects, statuses),
      recentProjects
    };
  } catch (error) {
    return {
      totalProjects: 0,
      stats: EMPTY_STATS,
      recentProjects: [],
      error: error.message || 'Could not load dashboard data.'
    };
  }
}
