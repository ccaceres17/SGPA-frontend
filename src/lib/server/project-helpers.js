import { API_BASE_URL, getAuthHeaders } from '$lib/components/Tokens.js';
import { messages } from '$lib/i18n/messages.js';
import { translate } from '$lib/i18n/locale.js';
import { formatBackendDetail } from './error-format.js';

export const ROLE_IDS = {
  student: 1,
  coordinator: 4,
  teacher: 3
};

/**
 * Server-rendered project-card folder icon. Consumed via {@html} in
 * ProjectCardDatatable.svelte, so it can't be a Svelte <Icon> component —
 * this is the same "folder" path data as src/lib/components/icons/paths.js;
 * keep the two in sync if that icon's geometry ever changes.
 */
export const PROJECT_CARD_ICON_SVG =
  '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6.5a1.5 1.5 0 0 1 1.5-1.5h4.5l2 2.5h8.5A1.5 1.5 0 0 1 21 9v8.5A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z"/></svg>';

const PROJECT_USER_CANDIDATES = [
  'project-users',
  'project_users',
  'project-user',
  'project_user',
  'projectusers'
];

export function getApiUrl(path) {
  if (String(path).startsWith('http')) return path;
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`;
}

export function safeJson(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    return text;
  }
}

export function normalizeDate(dateValue) {
  if (!dateValue) return '';

  const value = String(dateValue).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.split('T')[0];
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/');
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toISOString().split('T')[0];
}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

export function normalizeActiveStatus(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;

  const normalized = String(value ?? '').trim().toLowerCase();

  if (['true', '1', 'activo', 'active', 'yes', 'si', 'sí'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'inactivo', 'inactive', 'no', 'null', 'undefined', ''].includes(normalized)) {
    return false;
  }

  return Boolean(value);
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

export async function requestJson(fetch, path, moduleName = 'coordinator', options = {}) {
  const url = getApiUrl(path);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(moduleName),
      ...(options.headers || {})
    }
  });

  const text = await response.text().catch(() => '');
  const data = safeJson(text);

  if (!response.ok) {
    const detail = typeof data === 'string' ? data : formatBackendDetail(data);

    const error = new Error(`Could not query ${path}. Status ${response.status}. ${detail}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function requestJsonWithReadFallback(fetch, path, moduleName = 'coordinator', options = {}) {
  const modulesToTry = [moduleName];

  if (moduleName !== 'coordinator') {
    modulesToTry.push('coordinator');
  }

  let lastError;

  for (const moduleToTry of modulesToTry) {
    try {
      return await requestJson(fetch, path, moduleToTry, options);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function normalizeProject(project) {
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
      raw: project
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
    raw: project
  };
}

export function normalizeUser(user) {
  if (Array.isArray(user)) {
    return {
      id_user: user[0] ?? null,
      first_name: user[1] ?? '',
      last_name: user[2] ?? '',
      email: user[3] ?? '',
      phone: user[5] ?? user[4] ?? '',
      phone_number: user[5] ?? user[4] ?? '',
      password_hash: user[4] ?? '',
      id_role: user[6] ?? user[5] ?? null,
      is_active: normalizeActiveStatus(user[7] ?? user[6] ?? false),
      created_at: user[8] ?? null,
      claim_expires_at: user[10] ?? null,
      claimed_at: user[11] ?? null,
      raw: user
    };
  }

  return {
    id_user: user?.id_user ?? user?.id ?? null,
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? user?.phone_number ?? '',
    phone_number: user?.phone_number ?? user?.phone ?? '',
    password_hash: user?.password_hash ?? '',
    id_role: user?.id_role ?? user?.role_id ?? null,
    is_active: normalizeActiveStatus(user?.is_active),
    created_at: user?.created_at ?? null,
    claim_expires_at: user?.claim_expires_at ?? null,
    claimed_at: user?.claimed_at ?? null,
    raw: user
  };
}

export function normalizeProjectUser(item) {
  if (Array.isArray(item)) {
    const possibleRole = item[3];
    const possibleDate = item[4];

    const thirdPositionLooksLikeDate =
      typeof possibleRole === 'string' && /^\d{4}-\d{2}-\d{2}/.test(possibleRole);

    return {
      id_project_user: item[0] ?? null,
      id_project: item[1] ?? null,
      id_user: item[2] ?? null,
      assigned_date: thirdPositionLooksLikeDate
        ? normalizeDate(item[3])
        : normalizeDate(item[4]),
      id_role: thirdPositionLooksLikeDate ? item[4] ?? null : item[3] ?? null,
      raw: item
    };
  }

  return {
    id_project_user: item?.id_project_user ?? item?.id ?? null,
    id_project: item?.id_project ?? null,
    id_user: item?.id_user ?? null,
    id_role: item?.id_role ?? null,
    assigned_date: normalizeDate(item?.assigned_date ?? ''),
    raw: item
  };
}

export function normalizeStatus(status) {
  if (Array.isArray(status)) {
    return {
      id_status: status[0] ?? null,
      status_name: status[1] ?? '',
      description: status[2] ?? '',
      raw: status
    };
  }

  return {
    id_status: status?.id_status ?? status?.id ?? null,
    status_name: status?.status_name ?? status?.name ?? status?.label ?? '',
    description: status?.description ?? '',
    raw: status
  };
}

export function normalizeResearchGroup(group) {
  if (Array.isArray(group)) {
    return {
      id_research_group: group[0] ?? null,
      research_group_name: group[1] ?? '',
      raw: group
    };
  }

  return {
    id_research_group: group?.id_research_group ?? group?.id ?? null,
    research_group_name: group?.research_group_name ?? group?.name ?? '',
    raw: group
  };
}

/**
 * Research groups ("Semilleros de Investigación") have a real backend
 * endpoint (GET /research-groups) that returns names, but it may be
 * unreachable for a given role/deployment. On failure this returns `[]`
 * rather than throwing, so callers fall back to demo-labeled names instead
 * of showing raw numeric IDs to end users.
 */
export async function getResearchGroups(fetch, moduleName = 'coordinator') {
  try {
    const data = await requestJsonWithReadFallback(fetch, 'research-groups', moduleName);
    return extractList(data, ['research_groups', 'researchGroups']).map(normalizeResearchGroup);
  } catch (_) {
    return [];
  }
}

/**
 * Resolves a project's research-group ID to a real name from the backend
 * list when available. If the group can't be matched (endpoint unreachable,
 * or the ID isn't in the returned list), falls back to a clearly-labeled
 * demo name — deterministic per ID — rather than ever showing the raw
 * numeric ID to end users.
 */
export function getResearchGroupLabel(idResearchGroup, groups = [], locale = 'en') {
  if (!idResearchGroup) {
    return { name: translate(messages, 'researchGroups.unknown', locale), isDemo: false };
  }

  const match = groups.find(
    (group) => Number(group.id_research_group) === Number(idResearchGroup)
  );

  if (match?.research_group_name) {
    return { name: match.research_group_name, isDemo: false };
  }

  const demoNames = translate(messages, 'researchGroups.demoNames', locale);
  const index = (Number(idResearchGroup) - 1) % demoNames.length;
  const name = demoNames[((index % demoNames.length) + demoNames.length) % demoNames.length];

  return { name, isDemo: true };
}

export function getStatusLabel(idStatus, statuses = []) {
  const status = statuses.find((item) => Number(item.id_status) === Number(idStatus));

  if (status?.status_name) return status.status_name;

  const map = {
    1: 'Active',
    2: 'In Review',
    3: 'Completed',
    4: 'Cancelled',
    5: 'Pending'
  };

  return map[Number(idStatus)] ?? 'Unknown';
}

/**
 * Maps a status name (whatever the backend/fallback labels happen to use,
 * in English or Spanish) to one of a small set of stable categories, so the
 * UI can render a consistent badge and dashboard stat regardless of the
 * exact wording the status list returns.
 */
export function getStatusCategory(idStatus, statuses = []) {
  const label = String(getStatusLabel(idStatus, statuses) || '').toLowerCase();

  if (label.includes('cancel')) return 'cancelled';
  if (label.includes('complet')) return 'completed';
  if (label.includes('review') || label.includes('revis') || label.includes('pend')) {
    return 'pending';
  }
  if (label.includes('activ')) return 'active';

  return 'other';
}

/**
 * Real counts by status category for a role's project list — used to drive
 * dashboard statistics from actual backend data instead of placeholder
 * numbers.
 */
export function summarizeProjectsByStatus(projects = [], statuses = []) {
  const counts = { active: 0, pending: 0, completed: 0, cancelled: 0, other: 0 };

  for (const project of projects) {
    const category = getStatusCategory(project.id_status, statuses);
    counts[category] = (counts[category] ?? 0) + 1;
  }

  return counts;
}

/**
 * Derives a 4-state account-lifecycle status from is_active/claimed_at/
 * claim_expires_at, without any new stored enum: claimed_at IS NOT NULL
 * means the account was claimed (then 'active'/'disabled' per is_active,
 * preserving the pre-existing coordinator enable/disable toggle exactly as
 * it worked before this account-lifecycle feature existed); claimed_at
 * IS NULL means still invited ('pending' if the token hasn't expired yet,
 * 'expired' if it has).
 */
export function getUserLifecycleStatus(user) {
  if (user?.claimed_at) {
    return user.is_active ? 'active' : 'disabled';
  }

  if (user?.claim_expires_at && new Date(user.claim_expires_at) < new Date()) {
    return 'expired';
  }

  return 'pending';
}

export function getUserFullName(user) {
  const fullName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim();
  return fullName || user?.email || 'Unnamed user';
}

export async function getProjects(fetch, moduleName = 'coordinator') {
  const data = await requestJsonWithReadFallback(fetch, 'projects', moduleName);
  return extractList(data, ['projects']).map(normalizeProject);
}

export async function getProjectById(fetch, projectId, moduleName = 'coordinator') {
  try {
    const data = await requestJsonWithReadFallback(fetch, `projects/${projectId}`, moduleName);
    const projectData = Array.isArray(data) && !Array.isArray(data[0]) ? data : data?.project ?? data?.data ?? data;
    return normalizeProject(projectData);
  } catch (error) {
    const projects = await getProjects(fetch, moduleName);
    const project = projects.find((item) => Number(item.id_project) === Number(projectId));

    if (!project) throw error;
    return project;
  }
}

export async function getUsers(fetch, moduleName = 'coordinator') {
  const data = await requestJsonWithReadFallback(fetch, 'users', moduleName);
  return extractList(data, ['users']).map(normalizeUser);
}

export async function getUserById(fetch, userId, moduleName = 'coordinator') {
  const data = await requestJsonWithReadFallback(fetch, `users/${userId}`, moduleName);
  const userData = Array.isArray(data) && !Array.isArray(data[0]) ? data : data?.user ?? data?.data ?? data;
  return normalizeUser(userData);
}

export async function getStatuses(fetch, moduleName = 'coordinator') {
  try {
    const data = await requestJsonWithReadFallback(fetch, 'status', moduleName);
    const statuses = extractList(data, ['statuses', 'status']).map(normalizeStatus);

    if (statuses.length > 0) return statuses;
  } catch (_) {
    // Use safe default labels when the API does not expose status list for the current role.
  }

  return [
    { id_status: 1, status_name: 'Active', description: '' },
    { id_status: 2, status_name: 'Completed', description: '' },
    { id_status: 3, status_name: 'Pending', description: '' }
  ];
}

export async function resolveProjectUserEndpoint(fetch, moduleName = 'coordinator') {
  for (const candidate of PROJECT_USER_CANDIDATES) {
    const url = `${API_BASE_URL}/${candidate}`;

    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(moduleName)
      });

      if (response.ok || [401, 403, 405].includes(response.status)) {
        return url;
      }
    } catch (_) {
      // Continue testing candidates.
    }
  }

  return `${API_BASE_URL}/project-users`;
}

export async function getProjectUsers(fetch, moduleName = 'coordinator') {
  const url = await resolveProjectUserEndpoint(fetch, moduleName);
  const data = await requestJsonWithReadFallback(fetch, url, moduleName);

  return extractList(data, ['project_users', 'projectUsers', 'assignments']).map(normalizeProjectUser);
}

export async function assignUserToProject(fetch, moduleName, payload) {
  const url = await resolveProjectUserEndpoint(fetch, moduleName);
  const modulesToTry = [moduleName];

  if (moduleName !== 'coordinator') {
    modulesToTry.push('coordinator');
  }

  let lastError;

  for (const moduleToTry of modulesToTry) {
    try {
      return await requestJson(fetch, url, moduleToTry, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function reassignProjectUser(fetch, moduleName, idProjectUser, payload) {
  const baseUrl = await resolveProjectUserEndpoint(fetch, moduleName);
  const url = `${baseUrl}/${idProjectUser}`;
  const modulesToTry = [moduleName];

  if (moduleName !== 'coordinator') {
    modulesToTry.push('coordinator');
  }

  let lastError;

  for (const moduleToTry of modulesToTry) {
    try {
      return await requestJson(fetch, url, moduleToTry, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function updateProjectStatus(fetch, projectId, statusId) {
  return requestJson(fetch, `projects/${projectId}/status?id_new_status=${statusId}`, 'coordinator', {
    method: 'PUT'
  });
}

export function findLatestMatchingProject(projects, payload) {
  return (
    projects
      .filter(
        (project) =>
          project.project_name === payload.project_name &&
          project.start_date === payload.start_date &&
          Number(project.created_by) === Number(payload.created_by)
      )
      .sort((a, b) => Number(b.id_project) - Number(a.id_project))[0] ?? null
  );
}


export function getTeachers(users = []) {
  return users.filter((user) => Number(user.id_role) === ROLE_IDS.teacher);
}

export function getStudents(users = []) {
  return users.filter((user) => Number(user.id_role) === ROLE_IDS.student);
}

export function getTeacherRelationForProject(relations = [], projectId) {
  return (
    relations.find(
      (item) =>
        Number(item.id_project) === Number(projectId) && Number(item.id_role) === ROLE_IDS.teacher
    ) ?? null
  );
}

export function getTeacherAssignedToProject(relations = [], users = [], projectId) {
  const relation = getTeacherRelationForProject(relations, projectId);

  if (!relation) return null;

  return users.find((user) => Number(user.id_user) === Number(relation.id_user)) ?? null;
}

export function getStudentsAssignedToProject(relations = [], users = [], projectId) {
  const studentIds = new Set(
    relations
      .filter(
        (item) =>
          Number(item.id_project) === Number(projectId) && Number(item.id_role) === ROLE_IDS.student
      )
      .map((item) => Number(item.id_user))
  );

  return users.filter((user) => studentIds.has(Number(user.id_user)));
}

export function getParticipantsByProject(relations = [], users = [], projectId) {
  const usersMap = new Map(users.map((user) => [Number(user.id_user), user]));

  return relations
    .filter((item) => Number(item.id_project) === Number(projectId))
    .map((relation) => ({
      ...relation,
      user: usersMap.get(Number(relation.id_user)) ?? null
    }))
    .filter((participant) => participant.user);
}

export async function getProjectDetails(fetch, moduleName, projectId, locale = 'en') {
  const [project, users, relations, statuses, researchGroups] = await Promise.all([
    getProjectById(fetch, projectId, moduleName),
    getUsers(fetch, moduleName),
    getProjectUsers(fetch, moduleName).catch(() => []),
    getStatuses(fetch, moduleName),
    getResearchGroups(fetch, moduleName)
  ]);

  const teachers = getTeachers(users);
  const students = getStudents(users);
  const assignedTeacher = getTeacherAssignedToProject(relations, users, projectId);
  const assignedTeacherRelation = getTeacherRelationForProject(relations, projectId);
  const enrolledStudents = getStudentsAssignedToProject(relations, users, projectId);
  const participants = getParticipantsByProject(relations, users, projectId);

  return {
    project,
    users,
    teachers,
    students,
    relations,
    statuses,
    statusLabel: getStatusLabel(project.id_status, statuses),
    statusCategory: getStatusCategory(project.id_status, statuses),
    researchGroup: getResearchGroupLabel(project.id_research_group, researchGroups, locale),
    assignedTeacher,
    assignedTeacherRelation,
    enrolledStudents,
    participants
  };
}

/**
 * Builds the small set of real-data rows the role dashboards show under
 * "Recent projects" — resolves the assigned teacher and research group name
 * for each row so the table never has to show a raw ID. `projects` should
 * already be limited/sorted by the caller (most recent first).
 */
export function buildRecentProjectsView(
  projects = [],
  { users = [], relations = [], statuses = [], researchGroups = [], locale = 'en', viewHrefFor } = {}
) {
  return projects.map((project) => {
    const teacher = getTeacherAssignedToProject(relations, users, project.id_project);

    return {
      id_project: project.id_project,
      project_name: project.project_name || 'Unnamed project',
      teacherName: teacher ? getUserFullName(teacher) : null,
      researchGroup: getResearchGroupLabel(project.id_research_group, researchGroups, locale),
      statusLabel: getStatusLabel(project.id_status, statuses),
      statusCategory: getStatusCategory(project.id_status, statuses),
      startDate: project.start_date || '',
      viewHref: viewHrefFor ? viewHrefFor(project.id_project) : null
    };
  });
}

export async function enrollStudentInProject(fetch, projectId, studentId) {
  const relations = await getProjectUsers(fetch, 'students').catch(() => getProjectUsers(fetch, 'coordinator'));

  const alreadyExists = relations.some(
    (relation) =>
      Number(relation.id_project) === Number(projectId) &&
      Number(relation.id_user) === Number(studentId) &&
      Number(relation.id_role) === ROLE_IDS.student
  );

  if (alreadyExists) {
    return { alreadyExists: true };
  }

  return assignUserToProject(fetch, 'students', {
    id_project: Number(projectId),
    id_user: Number(studentId),
    id_role: ROLE_IDS.student,
    assigned_date: getTodayDate()
  });
}

export async function assignTeacherToProject(fetch, projectId, teacherId) {
  const relations = await getProjectUsers(fetch, 'coordinator').catch(() => []);
  const currentRelation = getTeacherRelationForProject(relations, projectId);

  if (currentRelation) {
    if (Number(currentRelation.id_user) === Number(teacherId)) {
      return { alreadyAssigned: true };
    }

    await reassignProjectUser(fetch, 'coordinator', currentRelation.id_project_user, {
      id_project: Number(projectId),
      id_user: Number(teacherId),
      id_role: ROLE_IDS.teacher,
      assigned_date: currentRelation.assigned_date || getTodayDate()
    });

    return { reassigned: true };
  }

  return assignUserToProject(fetch, 'coordinator', {
    id_project: Number(projectId),
    id_user: Number(teacherId),
    id_role: ROLE_IDS.teacher,
    assigned_date: getTodayDate()
  });
}

export function buildProjectCardHtml({
  project,
  statusLabel = 'Unknown',
  teacherName = 'Unassigned',
  actionHref = '#',
  actionLabel = 'View project',
  badgeLabel = '',
  badgeClass = 'neutral-badge',
  disabled = false
}) {
  const escapeHtml = (value = '') =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const projectName = escapeHtml(project?.project_name ?? 'Unnamed');
  const description = escapeHtml(project?.description ?? 'No description');
  const startDate = escapeHtml(project?.start_date || 'Not defined');
  const endDate = escapeHtml(project?.end_date || 'Not defined');
  const status = escapeHtml(statusLabel);
  const teacher = escapeHtml(teacherName);
  const href = escapeHtml(actionHref);
  const actionText = escapeHtml(actionLabel);
  const badge = escapeHtml(badgeLabel);
  const cssBadgeClass = escapeHtml(badgeClass);

  const action = disabled
    ? `<span class="joined-badge">${actionText}</span>`
    : `<a href="${href}" class="action-btn" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;">${actionText}</a>`;

  return `
    <div class="project-card">
      <div class="project-card__left">
        <div class="project-card__icon">${PROJECT_CARD_ICON_SVG}</div>

        <div class="project-card__content">
          <h3>${projectName}</h3>
          <p>${description}</p>

          <div class="project-card__meta">
            <span><strong>Start date:</strong> ${startDate}</span>
            <span><strong>End date:</strong> ${endDate}</span>
            <span><strong>Status:</strong> ${status}</span>
            <span><strong>Teacher:</strong> ${teacher}</span>
          </div>
        </div>
      </div>

      <div class="project-card__right" style="gap:.75rem;flex-wrap:wrap;">
        ${badge ? `<span class="${cssBadgeClass}">${badge}</span>` : ''}
        ${action}
      </div>
    </div>
  `;
}