import { fail } from '@sveltejs/kit';
import {
  getProjects,
  getUsers,
  getProjectUsers,
  getStatuses,
  ROLE_IDS,
  getStatusLabel,
  updateProjectStatus
} from '$lib/server/project-helpers.js';
import { applyStatusUpdate } from '$lib/server/status-update.js';

// Cookie name used by a previous implementation that faked a "successful"
// status update in the browser when the backend actually rejected it. It is
// cleared defensively so a browser that still holds one never shows a status
// that the backend never persisted.
const LEGACY_STATUS_OVERRIDE_COOKIE = 'sgpa_teacher_project_status_overrides_v1';

function getCurrentTeacherId(locals) {
  return Number(locals?.session?.user?.id_user || 0);
}

function getStudentsAssignedToProject(relations = [], users = [], projectId) {
  const studentIds = new Set(
    relations
      .filter(
        (relation) =>
          Number(relation.id_project) === Number(projectId) &&
          Number(relation.id_role) === ROLE_IDS.student
      )
      .map((relation) => Number(relation.id_user))
  );

  return users.filter((user) => studentIds.has(Number(user.id_user)));
}

function getTeacherAssignedToProject(relations = [], users = [], projectId) {
  const relation = relations.find(
    (item) =>
      Number(item.id_project) === Number(projectId) &&
      Number(item.id_role) === ROLE_IDS.teacher
  );

  if (!relation) return null;

  return users.find((user) => Number(user.id_user) === Number(relation.id_user)) ?? null;
}

function isCancelledStatus(statusId, statuses = []) {
  const selectedStatus = statuses.find(
    (status) => Number(status.id_status) === Number(statusId)
  );

  const name = String(selectedStatus?.status_name || '').trim().toLowerCase();

  return (
    Number(statusId) === 4 ||
    name === 'cancelled' ||
    name === 'canceled' ||
    name === 'cancelado'
  );
}

function filterStatusesForTeacher(statuses = []) {
  return statuses.filter((status) => !isCancelledStatus(status.id_status, statuses));
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params, locals, cookies }) {
  cookies.delete(LEGACY_STATUS_OVERRIDE_COOKIE, { path: '/' });

  const projectId = Number(params.id);
  const currentTeacherId = getCurrentTeacherId(locals);

  if (!currentTeacherId) {
    return {
      projectId: params.id,
      currentTeacherId,
      statuses: [],
      teacherStatuses: [],
      isProjectCancelled: false,
      error: 'Could not identify the logged-in teacher.'
    };
  }

  if (!projectId) {
    return {
      projectId: params.id,
      currentTeacherId,
      statuses: [],
      teacherStatuses: [],
      isProjectCancelled: false,
      error: 'Invalid project ID.'
    };
  }

  try {
    const [projects, users, relations, statuses] = await Promise.all([
      getProjects(fetch, 'teacher'),
      getUsers(fetch, 'teacher'),
      getProjectUsers(fetch, 'teacher').catch(() => []),
      getStatuses(fetch, 'teacher')
    ]);

    const originalProject =
      projects.find((item) => Number(item.id_project) === projectId) ?? null;

    if (!originalProject) {
      return {
        projectId,
        currentTeacherId,
        statuses,
        teacherStatuses: filterStatusesForTeacher(statuses),
        isProjectCancelled: false,
        error: 'Project not found.'
      };
    }

    const project = originalProject;

    const assignedTeacher = getTeacherAssignedToProject(relations, users, projectId);
    const enrolledStudents = getStudentsAssignedToProject(relations, users, projectId);

    const isAssignedToCurrentTeacher = relations.some(
      (relation) =>
        Number(relation.id_project) === projectId &&
        Number(relation.id_user) === currentTeacherId &&
        Number(relation.id_role) === ROLE_IDS.teacher
    );

    const isProjectCancelled = isCancelledStatus(project.id_status, statuses);

    return {
      projectId,
      project,
      currentTeacherId,
      assignedTeacher,
      enrolledStudents,
      statuses,
      teacherStatuses: filterStatusesForTeacher(statuses),
      statusLabel: getStatusLabel(project.id_status, statuses),
      isAssignedToCurrentTeacher,
      isProjectCancelled
    };
  } catch (error) {
    return {
      projectId,
      currentTeacherId,
      statuses: [],
      teacherStatuses: [],
      isProjectCancelled: false,
      error: error.message || 'Could not load project details.'
    };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  updateStatus: async ({ request, fetch, params, locals, cookies }) => {
    const projectId = Number(params.id);
    const currentTeacherId = getCurrentTeacherId(locals);
    const formData = await request.formData();
    const statusId = Number(formData.get('statusId'));

    cookies.delete(LEGACY_STATUS_OVERRIDE_COOKIE, { path: '/' });

    if (!currentTeacherId) {
      return fail(400, {
        error: 'Could not identify the logged-in teacher.'
      });
    }

    if (!projectId) {
      return fail(400, {
        error: 'Invalid project.'
      });
    }

    if (!statusId) {
      return fail(400, {
        error: 'Select a valid status.'
      });
    }

    try {
      const [projects, relations, statuses] = await Promise.all([
        getProjects(fetch, 'teacher'),
        getProjectUsers(fetch, 'teacher').catch(() => []),
        getStatuses(fetch, 'teacher')
      ]);

      const originalProject =
        projects.find((item) => Number(item.id_project) === projectId) ?? null;

      if (!originalProject) {
        return fail(404, {
          error: 'Project not found.'
        });
      }

      const isAssignedToCurrentTeacher = relations.some(
        (relation) =>
          Number(relation.id_project) === projectId &&
          Number(relation.id_user) === currentTeacherId &&
          Number(relation.id_role) === ROLE_IDS.teacher
      );

      if (!isAssignedToCurrentTeacher) {
        return fail(403, {
          error: 'You can only update the status of projects assigned to your teacher profile.'
        });
      }

      if (isCancelledStatus(originalProject.id_status, statuses)) {
        return fail(403, {
          error: 'This project is cancelled. Only the coordinator can reactivate or manage cancelled projects.'
        });
      }

      if (isCancelledStatus(statusId, statuses)) {
        return fail(403, {
          error: 'Teachers cannot cancel projects. Only the coordinator can cancel a project.'
        });
      }

      if (Number(originalProject.id_status) === Number(statusId)) {
        return {
          success: true,
          message: 'This status is already assigned to the project.'
        };
      }

      const result = await applyStatusUpdate(() => updateProjectStatus(fetch, projectId, statusId));

      if (!result.success) {
        return fail(result.status >= 400 ? result.status : 500, {
          error: result.message
        });
      }

      return {
        success: true,
        message: 'Project status updated successfully.'
      };
    } catch (error) {
      return fail(500, {
        error:
          error.message ||
          'Could not update project status. The backend may only allow coordinators to perform this action.'
      });
    }
  }
};