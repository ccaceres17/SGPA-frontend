import { fail, redirect } from '@sveltejs/kit';
import { API_BASE_URL, getAuthHeaders } from '$lib/components/Tokens.js';
import { getResearchGroups } from '$lib/server/project-helpers.js';
import { getLocaleFromCookies } from '$lib/server/locale.js';
import { translate } from '$lib/i18n/locale.js';
import { messages } from '$lib/i18n/messages.js';

const PROJECT_USER_TEACHER_ROLE_ID = 3;
const DEFAULT_RESEARCH_GROUP_ID = 1;

const DEFAULT_STATUSES = [
  { id: 1, name: 'Active' },
  { id: 2, name: 'In Review' },
  { id: 3, name: 'Completed' },
  { id: 4, name: 'Cancelled' }
];

function getCurrentCoordinatorId(locals) {
  return Number(locals?.session?.user?.id_user || 0);
}

function parseJsonSafe(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

function normalizeDate(dateValue) {
  if (!dateValue) return '';

  const value = String(dateValue).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/');
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toISOString().split('T')[0];
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
      created_by: project[7] ?? null
    };
  }

  return {
    id_project: project?.id_project ?? project?.id ?? null,
    project_name: project?.project_name ?? '',
    description: project?.description ?? '',
    start_date: normalizeDate(project?.start_date),
    end_date: normalizeDate(project?.end_date),
    id_status: project?.id_status ?? null,
    id_research_group: project?.id_research_group ?? null,
    created_by: project?.created_by ?? null
  };
}

function normalizeProjectUser(item) {
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
      id_role: thirdPositionLooksLikeDate ? item[4] ?? null : item[3] ?? null
    };
  }

  return {
    id_project_user: item?.id_project_user ?? item?.id ?? null,
    id_project: item?.id_project ?? null,
    id_user: item?.id_user ?? null,
    id_role: item?.id_role ?? null,
    assigned_date: normalizeDate(item?.assigned_date ?? '')
  };
}

function normalizeUser(user) {
  if (Array.isArray(user)) {
    return {
      id_user: user[0] ?? null,
      first_name: user[1] ?? '',
      last_name: user[2] ?? '',
      email: user[3] ?? '',
      phone: user[4] ?? '',
      id_role: user[6] ?? user[5] ?? null,
      is_active: user[7] ?? true
    };
  }

  return {
    id_user: user?.id_user ?? user?.id ?? null,
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? user?.phone_number ?? '',
    id_role: user?.id_role ?? user?.role_id ?? null,
    is_active: user?.is_active ?? true
  };
}

function getUserFullName(user) {
  return `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'Unnamed user';
}

function extractCreatedProjectId(responseData) {
  if (!responseData) return null;

  if (Array.isArray(responseData)) {
    return normalizeProject(responseData).id_project;
  }

  if (responseData.id_project) return responseData.id_project;
  if (responseData.id) return responseData.id;

  if (responseData.project?.id_project) return responseData.project.id_project;
  if (responseData.project?.id) return responseData.project.id;

  if (responseData.data?.id_project) return responseData.data.id_project;
  if (responseData.data?.id) return responseData.data.id;

  if (responseData.result?.id_project) return responseData.result.id_project;
  if (responseData.result?.id) return responseData.result.id;

  return normalizeProject(responseData?.data ?? responseData ?? {}).id_project;
}

async function apiFetch(fetch, path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`, {
    ...options,
    headers: {
      ...getAuthHeaders('coordinator'),
      ...(options.headers || {})
    }
  });

  const text = await response.text().catch(() => '');
  const data = parseJsonSafe(text);

  if (!response.ok) {
    const backendMessage =
      data?.detail ||
      data?.message ||
      data?.error ||
      text ||
      `Request failed with status ${response.status}.`;

    throw new Error(backendMessage);
  }

  return data;
}

async function getAllUsers(fetch) {
  const data = await apiFetch(fetch, 'users');

  if (Array.isArray(data)) {
    return data.map(normalizeUser);
  }

  if (Array.isArray(data?.users)) {
    return data.users.map(normalizeUser);
  }

  if (Array.isArray(data?.data)) {
    return data.data.map(normalizeUser);
  }

  return [];
}

async function getAllProjects(fetch) {
  const data = await apiFetch(fetch, 'projects');

  if (Array.isArray(data)) {
    return data.map(normalizeProject);
  }

  if (Array.isArray(data?.projects)) {
    return data.projects.map(normalizeProject);
  }

  if (Array.isArray(data?.data)) {
    return data.data.map(normalizeProject);
  }

  return [];
}

async function getAllProjectUsers(fetch) {
  const possibleEndpoints = ['project-users', 'project_users'];
  let lastError = null;

  for (const endpoint of possibleEndpoints) {
    try {
      const data = await apiFetch(fetch, endpoint);

      if (Array.isArray(data)) {
        return data.map(normalizeProjectUser);
      }

      if (Array.isArray(data?.project_users)) {
        return data.project_users.map(normalizeProjectUser);
      }

      if (Array.isArray(data?.projectUsers)) {
        return data.projectUsers.map(normalizeProjectUser);
      }

      if (Array.isArray(data?.data)) {
        return data.data.map(normalizeProjectUser);
      }

      return [];
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Could not load project-user relations.');
}

function findExistingExactProject(projects, payload) {
  return (
    projects
      .filter(
        (project) =>
          String(project.project_name).trim() === String(payload.project_name).trim() &&
          String(project.description || '').trim() === String(payload.description || '').trim() &&
          String(normalizeDate(project.start_date)) === String(normalizeDate(payload.start_date)) &&
          String(normalizeDate(project.end_date || '')) ===
            String(normalizeDate(payload.end_date || '')) &&
          Number(project.id_status) === Number(payload.id_status) &&
          Number(project.created_by) === Number(payload.created_by)
      )
      .sort((a, b) => Number(b.id_project) - Number(a.id_project))[0] ?? null
  );
}

async function relationAlreadyExists(fetch, { id_project, id_user }) {
  try {
    const relations = await getAllProjectUsers(fetch);

    return relations.some(
      (relation) =>
        Number(relation.id_project) === Number(id_project) &&
        Number(relation.id_user) === Number(id_user) &&
        Number(relation.id_role) === PROJECT_USER_TEACHER_ROLE_ID
    );
  } catch (_) {
    return false;
  }
}

async function assignTeacherToProject(fetch, { id_project, id_user, assigned_date }) {
  const payload = {
    id_project: Number(id_project),
    id_user: Number(id_user),
    id_role: PROJECT_USER_TEACHER_ROLE_ID,
    assigned_date: assigned_date || null
  };

  const alreadyExists = await relationAlreadyExists(fetch, payload);

  if (alreadyExists) {
    return true;
  }

  const possibleEndpoints = ['project-users', 'project_users'];
  let lastError = null;

  for (const endpoint of possibleEndpoints) {
    try {
      await apiFetch(fetch, endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return true;
    } catch (error) {
      lastError = error;

      const existsAfterError = await relationAlreadyExists(fetch, payload);

      if (existsAfterError) {
        return true;
      }
    }
  }

  throw lastError || new Error('Could not register the teacher in project-users.');
}

/** @type {import('./$types').PageServerLoad} */
function getResearchGroupOptions(researchGroups, locale) {
  if (researchGroups.length > 0) {
    return researchGroups.map((group) => ({
      id: group.id_research_group,
      name: group.research_group_name,
      isDemo: false
    }));
  }

  const demoNames = translate(messages, 'researchGroups.demoNames', locale);
  const demoLabel = translate(messages, 'researchGroups.demoLabel', locale);

  return demoNames.map((name, index) => ({
    id: index + 1,
    name: `${name} (${demoLabel})`,
    isDemo: true
  }));
}

export async function load({ fetch, locals, cookies }) {
  const currentCoordinatorId = getCurrentCoordinatorId(locals);
  const locale = getLocaleFromCookies(cookies);

  if (!currentCoordinatorId) {
    return {
      teachers: [],
      defaultTeacherId: null,
      defaultResearchGroupId: DEFAULT_RESEARCH_GROUP_ID,
      researchGroupOptions: getResearchGroupOptions([], locale),
      statuses: DEFAULT_STATUSES,
      error: 'Could not identify the logged-in coordinator.'
    };
  }

  try {
    const [users, researchGroups] = await Promise.all([
      getAllUsers(fetch),
      getResearchGroups(fetch, 'coordinator')
    ]);

    const teachers = users
      .filter((user) => Number(user.id_role) === PROJECT_USER_TEACHER_ROLE_ID)
      .map((teacher) => ({
        ...teacher,
        full_name: getUserFullName(teacher)
      }));

    const researchGroupOptions = getResearchGroupOptions(researchGroups, locale);

    return {
      teachers,
      defaultTeacherId: teachers[0]?.id_user ?? null,
      defaultResearchGroupId: researchGroupOptions[0]?.id ?? DEFAULT_RESEARCH_GROUP_ID,
      researchGroupOptions,
      statuses: DEFAULT_STATUSES,
      currentCoordinatorId
    };
  } catch (error) {
    return {
      teachers: [],
      defaultTeacherId: null,
      defaultResearchGroupId: DEFAULT_RESEARCH_GROUP_ID,
      researchGroupOptions: getResearchGroupOptions([], locale),
      statuses: DEFAULT_STATUSES,
      currentCoordinatorId,
      error: error.message || 'Could not load form information.'
    };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch, locals }) => {
    const currentCoordinatorId = getCurrentCoordinatorId(locals);

    if (!currentCoordinatorId) {
      return fail(401, {
        error: 'Could not identify the logged-in coordinator.'
      });
    }

    const formData = await request.formData();

    const teacherRaw = formData.get('teacher_id');
    const researchGroupRaw = formData.get('id_research_group');

    const values = {
      project_name: String(formData.get('project_name') || '').trim(),
      description: String(formData.get('description') || '').trim(),
      start_date: normalizeDate(formData.get('start_date')),
      end_date: normalizeDate(formData.get('end_date')),
      id_status: Number(formData.get('id_status') || 1),
      id_research_group: researchGroupRaw
        ? Number(researchGroupRaw)
        : DEFAULT_RESEARCH_GROUP_ID,
      teacher_id: teacherRaw ? Number(teacherRaw) : null
    };

    if (!values.project_name || !values.start_date || !values.teacher_id) {
      return fail(400, {
        error: 'You must complete the project name, start date, and assigned teacher.',
        values
      });
    }

    const projectPayload = {
      project_name: values.project_name,
      description: values.description || null,
      start_date: values.start_date,
      end_date: values.end_date || null,
      id_status: Number(values.id_status),
      id_research_group: Number(values.id_research_group),
      created_by: currentCoordinatorId
    };

    try {
      const createdProjectResponse = await apiFetch(fetch, 'projects', {
        method: 'POST',
        body: JSON.stringify(projectPayload)
      });

      let createdProjectId = extractCreatedProjectId(createdProjectResponse);

      if (!createdProjectId) {
        const refreshedProjects = await getAllProjects(fetch);
        const latestMatch = findExistingExactProject(refreshedProjects, projectPayload);
        createdProjectId = latestMatch?.id_project ? Number(latestMatch.id_project) : null;
      }

      if (!createdProjectId) {
        return fail(400, {
          error: 'The project was created, but id_project could not be retrieved to assign the teacher.',
          values
        });
      }

      await assignTeacherToProject(fetch, {
        id_project: createdProjectId,
        id_user: Number(values.teacher_id),
        assigned_date: values.start_date
      });

      throw redirect(303, '/coordinator/projects');
    } catch (error) {
      if (error?.status === 303) {
        throw error;
      }

      return fail(500, {
        error: error.message || 'Internal error while creating the project or assigning the teacher.',
        values
      });
    }
  }
};