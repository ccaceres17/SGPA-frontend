import {
  getProjects,
  getUsers,
  getProjectUsers,
  getStatuses,
  getResearchGroups,
  ROLE_IDS,
  getStatusLabel,
  getUserFullName,
  getResearchGroupLabel,
  buildProjectCardHtml,
  getTeachers,
  getStudents
} from '$lib/server/project-helpers.js';
import { getLocaleFromCookies } from '$lib/server/locale.js';

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

    const usersMap = new Map(users.map((user) => [Number(user.id_user), user]));
    const teacherByProject = new Map();
    const studentsByProject = new Map();

    for (const relation of relations) {
      if (Number(relation.id_role) === ROLE_IDS.teacher) {
        teacherByProject.set(Number(relation.id_project), Number(relation.id_user));
      } else if (Number(relation.id_role) === ROLE_IDS.student) {
        const projectId = Number(relation.id_project);
        const existing = studentsByProject.get(projectId) || [];
        existing.push(Number(relation.id_user));
        studentsByProject.set(projectId, existing);
      }
    }

    const rows = projects.map((project) => {
      const projectId = Number(project.id_project);
      const teacherId = teacherByProject.get(projectId) || null;
      const teacher = teacherId ? usersMap.get(teacherId) : null;
      const researchGroup = getResearchGroupLabel(project.id_research_group, researchGroups, locale);

      return {
        id_project: projectId,
        id_status: Number(project.id_status) || null,
        id_teacher: teacherId,
        id_research_group: project.id_research_group ? Number(project.id_research_group) : null,
        studentIds: studentsByProject.get(projectId) || [],
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        proyecto_card: buildProjectCardHtml({
          project,
          statusLabel: getStatusLabel(project.id_status, statuses),
          teacherName: teacher ? getUserFullName(teacher) : 'Unassigned',
          actionHref: `/coordinator/view_project/${project.id_project}`,
          actionLabel: 'Manage project',
          badgeLabel: teacher ? 'Professor assigned' : 'Needs professor',
          badgeClass: teacher ? 'joined-badge' : 'neutral-badge'
        })
      };
    });

    return {
      rows,
      totalProjects: projects.length,
      statuses,
      teachers: getTeachers(users),
      students: getStudents(users),
      researchGroups
    };
  } catch (error) {
    return {
      rows: [],
      totalProjects: 0,
      statuses: [],
      teachers: [],
      students: [],
      researchGroups: [],
      error: error.message || 'Could not load projects.'
    };
  }
}
