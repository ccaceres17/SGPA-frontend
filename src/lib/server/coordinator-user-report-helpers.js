import { API_BASE_URL, getAuthHeaders } from '$lib/components/Tokens.js';
import { formatBackendDetail } from './error-format.js';

const FALLBACK_ROLE_IDS = {
  student: 1,
  teacher: 3,
  coordinator: 4
};

const REPORT_CONFIG = {
  teachers: {
    targetRole: 'teacher',
    title: 'Professors report',
    subtitle:
      'Coordinator report of professor accounts, account status, and assigned academic projects.',
    emptyMessage: 'No professors found.',
    projectRelationLabel: 'Assigned projects',
    singularLabel: 'Professor',
    pluralLabel: 'Professors',
    extraColumnLabel: 'Role'
  },
  students: {
    targetRole: 'student',
    title: 'Students report',
    subtitle:
      'Coordinator report of student accounts, account status, semester, and enrolled academic projects.',
    emptyMessage: 'No students found.',
    projectRelationLabel: 'Enrolled projects',
    singularLabel: 'Student',
    pluralLabel: 'Students',
    extraColumnLabel: 'Semester'
  }
};

const STATUS_FALLBACK = {
  1: 'Active',
  2: 'In Review',
  3: 'Completed',
  4: 'Cancelled',
  5: 'Pending'
};

function getApiUrl(path) {
  if (String(path).startsWith('http')) return path;
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`;
}

function parseJsonSafe(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    return text;
  }
}

function extractList(data, keys = []) {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.rows)) return data.rows;

  return [];
}

async function requestJson(fetch, path) {
  const response = await fetch(getApiUrl(path), {
    method: 'GET',
    headers: {
      ...getAuthHeaders('coordinator')
    }
  });

  const text = await response.text().catch(() => '');
  const data = parseJsonSafe(text);

  if (!response.ok) {
    const detail = typeof data === 'string' ? data : formatBackendDetail(data);

    throw new Error(`Could not load ${path}. Status ${response.status}. ${detail}`);
  }

  return data;
}

function normalizeDate(value) {
  if (!value) return 'Not defined';

  const raw = String(value).trim();

  if (!raw) return 'Not defined';
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) return raw.split('T')[0];

  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) return raw;

  return parsed.toISOString().split('T')[0];
}

function normalizeActiveStatus(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;

  const normalized = String(value ?? '').trim().toLowerCase();

  if (['true', '1', 'active', 'enabled', 'activo', 'si', 'sí', 'yes'].includes(normalized)) {
    return true;
  }

  if (
    ['false', '0', 'inactive', 'disabled', 'inactivo', 'no', '', 'null', 'undefined'].includes(
      normalized
    )
  ) {
    return false;
  }

  return Boolean(value);
}

function normalizeRole(role) {
  if (Array.isArray(role)) {
    return {
      id_role: role[0] ?? null,
      role_name: role[1] ?? '',
      description: role[2] ?? ''
    };
  }

  return {
    id_role: role?.id_role ?? role?.id ?? role?.role_id ?? null,
    role_name: role?.role_name ?? role?.name ?? '',
    description: role?.description ?? ''
  };
}

function normalizeRoleName(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replaceAll('á', 'a')
    .replaceAll('é', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('ú', 'u');
}

function buildRoleIds(roles = []) {
  const roleIds = {
    ...FALLBACK_ROLE_IDS
  };

  for (const role of roles) {
    const id = Number(role.id_role);
    const name = normalizeRoleName(role.role_name);

    if (!id) continue;

    if (['student', 'students', 'estudiante', 'estudiantes'].includes(name)) {
      roleIds.student = id;
    }

    if (['teacher', 'teachers', 'professor', 'professors', 'docente', 'docentes'].includes(name)) {
      roleIds.teacher = id;
    }

    if (['coordinator', 'coordinador', 'coordinators', 'coordinadores'].includes(name)) {
      roleIds.coordinator = id;
    }
  }

  return roleIds;
}

function normalizeUser(user) {
  if (Array.isArray(user)) {
    return {
      id_user: user[0] ?? null,
      first_name: user[1] ?? '',
      last_name: user[2] ?? '',
      email: user[3] ?? '',
      password_hash: user[4] ?? '',
      phone: user[5] ?? '',
      phone_number: user[5] ?? '',
      id_role: user[6] ?? null,
      is_active: normalizeActiveStatus(user[7]),
      created_at: normalizeDate(user[8])
    };
  }

  return {
    id_user: user?.id_user ?? user?.id ?? null,
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    email: user?.email ?? '',
    password_hash: user?.password_hash ?? '',
    phone: user?.phone ?? user?.phone_number ?? '',
    phone_number: user?.phone_number ?? user?.phone ?? '',
    id_role: user?.id_role ?? user?.role_id ?? null,
    is_active: normalizeActiveStatus(user?.is_active),
    created_at: normalizeDate(user?.created_at)
  };
}

function normalizeStudent(student) {
  if (Array.isArray(student)) {
    return {
      id_user: student[0] ?? null,
      semester: student[1] ?? null
    };
  }

  return {
    id_user: student?.id_user ?? student?.id ?? null,
    semester: student?.semester ?? null
  };
}

function normalizeProject(project) {
  if (Array.isArray(project)) {
    return {
      id_project: project[0] ?? null,
      project_name: project[1] ?? '',
      description: project[2] ?? '',
      start_date: normalizeDate(project[3]),
      end_date: normalizeDate(project[4]),
      id_status: project[5] ?? null,
      id_research_group: project[6] ?? null,
      created_by: project[7] ?? null,
      created_at: normalizeDate(project[8])
    };
  }

  return {
    id_project: project?.id_project ?? project?.id ?? null,
    project_name: project?.project_name ?? project?.name ?? project?.title ?? '',
    description: project?.description ?? '',
    start_date: normalizeDate(project?.start_date),
    end_date: normalizeDate(project?.end_date),
    id_status: project?.id_status ?? project?.status_id ?? null,
    id_research_group: project?.id_research_group ?? null,
    created_by: project?.created_by ?? null,
    created_at: normalizeDate(project?.created_at)
  };
}

function normalizeProjectUser(item) {
  if (Array.isArray(item)) {
    return {
      id_project_user: item[0] ?? null,
      id_project: item[1] ?? null,
      id_user: item[2] ?? null,
      id_role: item[3] ?? null,
      assigned_date: normalizeDate(item[4])
    };
  }

  return {
    id_project_user: item?.id_project_user ?? item?.id ?? null,
    id_project: item?.id_project ?? null,
    id_user: item?.id_user ?? null,
    id_role: item?.id_role ?? null,
    assigned_date: normalizeDate(item?.assigned_date)
  };
}

function normalizeStatus(status) {
  if (Array.isArray(status)) {
    return {
      id_status: status[0] ?? null,
      status_name: status[1] ?? '',
      description: status[2] ?? ''
    };
  }

  return {
    id_status: status?.id_status ?? status?.id ?? status?.status_id ?? null,
    status_name: status?.status_name ?? status?.name ?? status?.label ?? '',
    description: status?.description ?? ''
  };
}

function fullName(user) {
  return `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'Unnamed user';
}

function getCurrentUserLabel(locals) {
  const user = locals?.session?.user || {};

  const firstName =
    user.first_name ||
    user.displayName?.split('-')?.[0]?.trim() ||
    user.email?.split('@')?.[0] ||
    'User';

  const role = user.roleLabel || user.normalizedRole || user.role || 'Coordinator';

  const cleanRole = String(role)
    .replace('coordinator', 'Coordinator')
    .replace('teacher', 'Professor')
    .replace('students', 'Student')
    .replace('student', 'Student');

  return `${firstName} - ${cleanRole}`;
}

function getStatusLabel(idStatus, statusesMap) {
  const normalizedId = Number(idStatus);

  return statusesMap.get(normalizedId) || STATUS_FALLBACK[normalizedId] || 'Unknown';
}

async function getUsers(fetch) {
  const data = await requestJson(fetch, 'users');
  return extractList(data, ['users']).map(normalizeUser);
}

async function getStudents(fetch) {
  const data = await requestJson(fetch, 'students');
  return extractList(data, ['students']).map(normalizeStudent);
}

async function getProjects(fetch) {
  const data = await requestJson(fetch, 'projects');
  return extractList(data, ['projects']).map(normalizeProject);
}

async function getProjectUsers(fetch) {
  const data = await requestJson(fetch, 'project-users');
  return extractList(data, ['project_users', 'projectUsers', 'assignments']).map(normalizeProjectUser);
}

async function getRoles(fetch) {
  const data = await requestJson(fetch, 'roles');
  return extractList(data, ['roles']).map(normalizeRole);
}

async function getStatuses(fetch) {
  const data = await requestJson(fetch, 'status');
  return extractList(data, ['status', 'statuses', 'project_status']).map(normalizeStatus);
}

function getProjectsForUser({ userId, roleId, relations = [], projectsMap, statusesMap }) {
  return relations
    .filter(
      (relation) =>
        Number(relation.id_user) === Number(userId) &&
        Number(relation.id_role) === Number(roleId)
    )
    .map((relation) => {
      const project = projectsMap.get(Number(relation.id_project));

      if (!project) return null;

      return {
        id_project: project.id_project,
        project_name: project.project_name || 'Unnamed project',
        description: project.description || 'No description available.',
        start_date: project.start_date || 'Not defined',
        end_date: project.end_date || 'Not defined',
        status: getStatusLabel(project.id_status, statusesMap),
        assigned_date: relation.assigned_date || 'Not defined'
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(a.id_project) - Number(b.id_project));
}

function buildUsersReportRows({
  users = [],
  students = [],
  projects = [],
  relations = [],
  statuses = [],
  userType = 'students',
  roleIds
}) {
  const config = REPORT_CONFIG[userType] || REPORT_CONFIG.students;
  const targetRoleId = roleIds[config.targetRole] || FALLBACK_ROLE_IDS[config.targetRole];

  const studentsMap = new Map(students.map((student) => [Number(student.id_user), student]));

  const projectsMap = new Map(projects.map((project) => [Number(project.id_project), project]));

  const statusesMap = new Map(
    statuses
      .filter((status) => status.id_status !== null && status.id_status !== undefined)
      .map((status) => [Number(status.id_status), status.status_name])
  );

  return users
    .filter((user) => Number(user.id_role) === Number(targetRoleId))
    .map((user) => {
      const relatedProjects = getProjectsForUser({
        userId: user.id_user,
        roleId: targetRoleId,
        relations,
        projectsMap,
        statusesMap
      });

      const studentAcademicData = studentsMap.get(Number(user.id_user));
      const isActive = normalizeActiveStatus(user.is_active);

      return {
        id_user: user.id_user,
        full_name: fullName(user),
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || 'No email registered',
        phone: user.phone || user.phone_number || 'No phone registered',
        is_active: isActive,
        statusLabel: isActive ? 'Active' : 'Inactive',
        created_at: user.created_at || 'Not defined',
        extraValue:
          userType === 'students'
            ? studentAcademicData?.semester
              ? `Semester ${studentAcademicData.semester}`
              : 'Not registered'
            : 'Professor',
        relatedProjects,
        totalProjects: relatedProjects.length
      };
    })
    .sort((a, b) => a.full_name.localeCompare(b.full_name));
}

export async function getCoordinatorUsersReport({ fetch, locals, userType = 'students' }) {
  const config = REPORT_CONFIG[userType] || REPORT_CONFIG.students;

  const [roles, users, students, projects, relations, statuses] = await Promise.all([
    getRoles(fetch).catch(() => []),
    getUsers(fetch),
    userType === 'students' ? getStudents(fetch).catch(() => []) : Promise.resolve([]),
    getProjects(fetch).catch(() => []),
    getProjectUsers(fetch).catch(() => []),
    getStatuses(fetch).catch(() => [])
  ]);

  const roleIds = buildRoleIds(roles);

  const rows = buildUsersReportRows({
    users,
    students,
    projects,
    relations,
    statuses,
    userType,
    roleIds
  });

  return {
    title: config.title,
    subtitle: config.subtitle,
    emptyMessage: config.emptyMessage,
    projectRelationLabel: config.projectRelationLabel,
    singularLabel: config.singularLabel,
    pluralLabel: config.pluralLabel,
    extraColumnLabel: config.extraColumnLabel,
    generatedBy: getCurrentUserLabel(locals),
    generatedAt: new Date().toLocaleString('en-US'),
    totalUsers: rows.length,
    users: rows
  };
}