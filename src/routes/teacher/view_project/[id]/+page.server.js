import { fail } from '@sveltejs/kit';
import {
  getProjects,
  getUsers,
  getProjectUsers,
  getStatuses,
  ROLE_IDS,
  getStatusLabel,
  getStatusCategory,
  updateProjectStatus,
  getResearchGroups,
  getResearchGroupLabel
} from '$lib/server/project-helpers.js';
import { applyStatusUpdate } from '$lib/server/status-update.js';
import { getLocaleFromCookies } from '$lib/server/locale.js';
import { getDocumentsForProject, getDocumentTypes, uploadDocument, deleteDocument } from '$lib/server/document-helpers.js';
import {
  getProgressForProject,
  getCommentsForProgressIds,
  attachCommentsToProgress,
  createProgress,
  createComment,
  deleteComment
} from '$lib/server/activity-helpers.js';

const MODULE_NAME = 'teacher';

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
      error: 'Could not identify the logged-in professor.'
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

  const locale = getLocaleFromCookies(cookies);

  try {
    const [projects, users, relations, statuses, researchGroups] = await Promise.all([
      getProjects(fetch, 'teacher'),
      getUsers(fetch, 'teacher'),
      getProjectUsers(fetch, 'teacher').catch(() => []),
      getStatuses(fetch, 'teacher'),
      getResearchGroups(fetch, 'teacher')
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

    const [documents, documentTypes, progressEntries] = await Promise.all([
      getDocumentsForProject(fetch, MODULE_NAME, projectId).catch(() => []),
      getDocumentTypes(fetch, MODULE_NAME).catch(() => []),
      getProgressForProject(fetch, MODULE_NAME, projectId).catch(() => [])
    ]);

    const comments = await getCommentsForProgressIds(
      fetch,
      MODULE_NAME,
      progressEntries.map((entry) => entry.id_progress)
    ).catch(() => []);

    return {
      projectId,
      project,
      users,
      currentTeacherId,
      assignedTeacher,
      enrolledStudents,
      statuses,
      teacherStatuses: filterStatusesForTeacher(statuses),
      statusLabel: getStatusLabel(project.id_status, statuses),
      statusCategory: getStatusCategory(project.id_status, statuses),
      researchGroup: getResearchGroupLabel(project.id_research_group, researchGroups, locale),
      isAssignedToCurrentTeacher,
      isProjectCancelled,
      documents,
      documentTypes,
      activityEntries: attachCommentsToProgress(progressEntries, comments)
    };
  } catch (error) {
    return {
      projectId,
      currentTeacherId,
      statuses: [],
      teacherStatuses: [],
      isProjectCancelled: false,
      documents: [],
      documentTypes: [],
      activityEntries: [],
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
        error: 'Could not identify the logged-in professor.'
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
          error: 'You can only update the status of projects assigned to your professor profile.'
        });
      }

      if (isCancelledStatus(originalProject.id_status, statuses)) {
        return fail(403, {
          error: 'This project is cancelled. Only the coordinator can reactivate or manage cancelled projects.'
        });
      }

      if (isCancelledStatus(statusId, statuses)) {
        return fail(403, {
          error: 'Professors cannot cancel projects. Only the coordinator can cancel a project.'
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
        error: error.message || 'Could not update project status. Please try again.'
      });
    }
  },

  addDocument: async ({ request, fetch, params }) => {
    const projectId = Number(params.id);
    const formData = await request.formData();

    const idDocumentType = Number(formData.get('id_document_type'));
    const description = String(formData.get('description') || '').trim();
    const file = formData.get('file');

    if (!projectId || !idDocumentType) {
      return fail(400, { documentError: 'All required document fields must be filled in.' });
    }

    if (!(file instanceof File) || file.size === 0) {
      return fail(400, { documentError: 'Select a PDF file to upload.' });
    }

    const uploadData = new FormData();
    uploadData.set('id_project', String(projectId));
    uploadData.set('id_document_type', String(idDocumentType));
    uploadData.set('description', description);
    uploadData.set('file', file, file.name);

    const result = await applyStatusUpdate(() => uploadDocument(fetch, uploadData));

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, { documentError: result.message });
    }

    return { documentSuccess: true, documentMessage: 'Document uploaded successfully.' };
  },

  deleteDocument: async ({ request, fetch }) => {
    const formData = await request.formData();
    const documentId = Number(formData.get('documentId'));

    if (!documentId) {
      return fail(400, { documentError: 'Invalid document.' });
    }

    const result = await applyStatusUpdate(() => deleteDocument(fetch, MODULE_NAME, documentId));

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, { documentError: result.message });
    }

    return { documentSuccess: true, documentMessage: 'Document link deleted successfully.' };
  },

  addProgress: async ({ request, fetch, params }) => {
    const projectId = Number(params.id);
    const formData = await request.formData();

    const payload = {
      id_project: projectId,
      description: String(formData.get('description') || '').trim(),
      progress_percentage: Number(formData.get('progress_percentage'))
    };

    if (!projectId || !payload.description || Number.isNaN(payload.progress_percentage)) {
      return fail(400, { activityError: 'Description and percentage are required.' });
    }

    const result = await applyStatusUpdate(() => createProgress(fetch, MODULE_NAME, payload));

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, { activityError: result.message });
    }

    return { activitySuccess: true, activityMessage: 'Progress update added successfully.' };
  },

  addComment: async ({ request, fetch }) => {
    const formData = await request.formData();

    const payload = {
      id_progress: Number(formData.get('id_progress')),
      content: String(formData.get('content') || '').trim()
    };

    if (!payload.id_progress || !payload.content) {
      return fail(400, { activityError: 'A comment cannot be empty.' });
    }

    const result = await applyStatusUpdate(() => createComment(fetch, MODULE_NAME, payload));

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, { activityError: result.message });
    }

    return { activitySuccess: true, activityMessage: 'Comment added successfully.' };
  },

  deleteComment: async ({ request, fetch }) => {
    const formData = await request.formData();
    const commentId = Number(formData.get('commentId'));

    if (!commentId) {
      return fail(400, { activityError: 'Invalid comment.' });
    }

    const result = await applyStatusUpdate(() => deleteComment(fetch, MODULE_NAME, commentId));

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, { activityError: result.message });
    }

    return { activitySuccess: true, activityMessage: 'Comment deleted successfully.' };
  }
};