import {
  getProjects,
  getUsers,
  getProjectUsers,
  ROLE_IDS,
  getStatusLabel,
  getUserFullName,
  getStatuses,
  buildProjectCardHtml
} from '$lib/server/project-helpers.js';

function getCurrentStudentId(locals) {
  return Number(locals?.session?.user?.id_user || 0);
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals }) {
  const currentStudentId = getCurrentStudentId(locals);

  if (!currentStudentId) {
    return {
      rows: [],
      totalProjects: 0,
      currentStudentId,
      error: 'Could not identify the logged-in student.'
    };
  }

  try {
    const [projects, users, relations, statuses] = await Promise.all([
      getProjects(fetch, 'students'),
      getUsers(fetch, 'students'),
      getProjectUsers(fetch, 'students'),
      getStatuses(fetch, 'students')
    ]);

    const usersMap = new Map(users.map((user) => [Number(user.id_user), user]));

    const enrolledProjectIds = new Set(
      relations
        .filter(
          (relation) =>
            Number(relation.id_role) === ROLE_IDS.student &&
            Number(relation.id_user) === currentStudentId
        )
        .map((relation) => Number(relation.id_project))
    );

    const teacherByProject = new Map();

    for (const relation of relations) {
      if (Number(relation.id_role) === ROLE_IDS.teacher) {
        teacherByProject.set(Number(relation.id_project), Number(relation.id_user));
      }
    }

    const enrolledProjects = projects.filter((project) =>
      enrolledProjectIds.has(Number(project.id_project))
    );

    const rows = enrolledProjects.map((project) => {
      const teacherId = teacherByProject.get(Number(project.id_project));
      const teacher = teacherId ? usersMap.get(Number(teacherId)) : null;

      return {
        id_project: Number(project.id_project),
        proyecto_card: buildProjectCardHtml({
          project,
          statusLabel: getStatusLabel(project.id_status, statuses),
          teacherName: teacher ? getUserFullName(teacher) : 'Unassigned',
          actionHref: `/students/view_project/${project.id_project}?source=myprojects`,
          actionLabel: 'View project',
          badgeLabel: 'Enrolled project',
          badgeClass: 'joined-badge'
        })
      };
    });

    return {
      rows,
      totalProjects: enrolledProjects.length,
      currentStudentId
    };
  } catch (error) {
    return {
      rows: [],
      totalProjects: 0,
      currentStudentId,
      error: error.message || 'Could not load the student projects.'
    };
  }
}