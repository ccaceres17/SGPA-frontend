import {
  getProjects,
  getUsers,
  getProjectUsers,
  getStatuses,
  getUserFullName,
  ROLE_IDS
} from '$lib/server/project-helpers.js';

const STATUS_FALLBACK = {
  1: 'Active',
  2: 'In Review',
  3: 'Completed',
  4: 'Cancelled',
  5: 'Pending'
};

function getCurrentUserId(locals) {
  return Number(locals?.session?.user?.id_user || 0);
}

function getGeneratedBy(locals, fallbackRole = 'User') {
  const user = locals?.session?.user || {};

  const firstName =
    user.first_name ||
    user.displayName?.split('-')?.[0]?.trim() ||
    user.email?.split('@')?.[0] ||
    'User';

  const role =
    user.roleLabel ||
    user.normalizedRole ||
    user.role ||
    fallbackRole;

  const cleanRole = String(role)
    .replace('students', 'Student')
    .replace('teacher', 'Professor')
    .replace('coordinator', 'Coordinator');

  return `${firstName} - ${cleanRole}`;
}

function getStatusLabel(idStatus, statuses = []) {
  const status = statuses.find((item) => Number(item.id_status) === Number(idStatus));

  if (status?.status_name) {
    return status.status_name;
  }

  return STATUS_FALLBACK[Number(idStatus)] || 'Unknown';
}

function getTeacherForProject(relations = [], usersMap, projectId) {
  const teacherRelation = relations.find(
    (relation) =>
      Number(relation.id_project) === Number(projectId) &&
      Number(relation.id_role) === Number(ROLE_IDS.teacher)
  );

  if (!teacherRelation) return null;

  return usersMap.get(Number(teacherRelation.id_user)) || null;
}

function getStudentsForProject(relations = [], usersMap, projectId) {
  return relations
    .filter(
      (relation) =>
        Number(relation.id_project) === Number(projectId) &&
        Number(relation.id_role) === Number(ROLE_IDS.student)
    )
    .map((relation) => usersMap.get(Number(relation.id_user)))
    .filter(Boolean)
    .map((student) => ({
      id_user: student.id_user,
      name: getUserFullName(student),
      email: student.email || 'No email registered'
    }));
}

function getStudentProjectIds(relations = [], currentUserId) {
  return new Set(
    relations
      .filter(
        (relation) =>
          Number(relation.id_user) === Number(currentUserId) &&
          Number(relation.id_role) === Number(ROLE_IDS.student)
      )
      .map((relation) => Number(relation.id_project))
  );
}

function getTeacherProjectIds(relations = [], currentUserId) {
  return new Set(
    relations
      .filter(
        (relation) =>
          Number(relation.id_user) === Number(currentUserId) &&
          Number(relation.id_role) === Number(ROLE_IDS.teacher)
      )
      .map((relation) => Number(relation.id_project))
  );
}

function filterProjectsByScope(projects = [], relations = [], scope = 'all', currentUserId = 0) {
  if (scope === 'student_mine') {
    const projectIds = getStudentProjectIds(relations, currentUserId);
    return projects.filter((project) => projectIds.has(Number(project.id_project)));
  }

  if (scope === 'teacher_mine') {
    const projectIds = getTeacherProjectIds(relations, currentUserId);
    return projects.filter((project) => projectIds.has(Number(project.id_project)));
  }

  return projects;
}

function buildProjectRows({ projects = [], users = [], relations = [], statuses = [] }) {
  const usersMap = new Map(users.map((user) => [Number(user.id_user), user]));

  return projects
    .map((project) => {
      const projectId = Number(project.id_project);
      const teacher = getTeacherForProject(relations, usersMap, projectId);
      const students = getStudentsForProject(relations, usersMap, projectId);

      return {
        id_project: project.id_project,
        project_name: project.project_name || 'Unnamed project',
        description: project.description || 'No description available.',
        start_date: project.start_date || 'Not defined',
        end_date: project.end_date || 'Not defined',
        status: getStatusLabel(project.id_status, statuses),
        teacher: teacher
          ? {
              id_user: teacher.id_user,
              name: getUserFullName(teacher),
              email: teacher.email || 'No email registered'
            }
          : null,
        students
      };
    })
    .sort((a, b) => Number(a.id_project) - Number(b.id_project));
}

export async function getProjectsReport({
  fetch,
  locals,
  moduleName = 'coordinator',
  scope = 'all',
  title = 'Academic projects report',
  subtitle = 'Project report generated from SGPA.'
}) {
  const currentUserId = getCurrentUserId(locals);

  const [projects, users, relations, statuses] = await Promise.all([
    getProjects(fetch, moduleName),
    getUsers(fetch, moduleName),
    getProjectUsers(fetch, moduleName).catch(() => []),
    getStatuses(fetch, moduleName).catch(() => [])
  ]);

  const filteredProjects = filterProjectsByScope(projects, relations, scope, currentUserId);

  const reportProjects = buildProjectRows({
    projects: filteredProjects,
    users,
    relations,
    statuses
  });

  return {
    title,
    subtitle,
    generatedBy: getGeneratedBy(locals, moduleName),
    generatedAt: new Date().toLocaleString('en-US'),
    totalProjects: reportProjects.length,
    moduleName,
    scope,
    projects: reportProjects
  };
}