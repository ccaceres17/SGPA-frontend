import { fail } from '@sveltejs/kit';
import {
  getProjectDetails,
  assignTeacherToProject,
  updateProjectStatus,
  getStatuses,
  getProjects,
  ROLE_IDS
} from '$lib/server/project-helpers.js';
import { API_BASE_URL } from '$lib/components/Tokens.js';
import { performListAvailabilityForTeacher } from '$lib/server/teacher-availability-request.js';
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

const MODULE_NAME = 'coordinator';

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

function getCancelledStatusId(statuses = []) {
  const status = statuses.find((item) => {
    const name = String(item.status_name || '').trim().toLowerCase();

    return (
      Number(item.id_status) === 4 ||
      name === 'cancelled' ||
      name === 'canceled' ||
      name === 'cancelado'
    );
  });

  return Number(status?.id_status || 4);
}

function getActiveStatusId(statuses = []) {
  const status = statuses.find((item) => {
    const name = String(item.status_name || '').trim().toLowerCase();

    return Number(item.id_status) === 1 || name === 'active' || name === 'activo';
  });

  return Number(status?.id_status || 1);
}

function filterStatusesForCoordinatorSelector(statuses = []) {
  return statuses.filter((status) => !isCancelledStatus(status.id_status, statuses));
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params, cookies, locals }) {
  const projectId = Number(params.id);
  const locale = getLocaleFromCookies(cookies);
  const currentUserId = locals?.session?.user?.id_user ?? null;

  if (!projectId) {
    return {
      projectId: params.id,
      actionStatuses: [],
      isProjectCancelled: false,
      documents: [],
      documentTypes: [],
      activityEntries: [],
      currentUserId,
      error: 'Invalid project ID.'
    };
  }

  try {
    const details = await getProjectDetails(fetch, MODULE_NAME, projectId, locale);
    const isProjectCancelled = isCancelledStatus(details.project?.id_status, details.statuses);

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

    const projects = await getProjects(fetch, MODULE_NAME).catch(() => []);
    const projectsById = new Map(projects.map((item) => [Number(item.id_project), item]));

    const teachersWithAvailability = await Promise.all(
      details.teachers.map(async (teacher) => {
        const activeProjectCount = details.relations.filter((relation) => {
          if (Number(relation.id_role) !== ROLE_IDS.teacher) return false;
          if (Number(relation.id_user) !== Number(teacher.id_user)) return false;

          const relatedProject = projectsById.get(Number(relation.id_project));
          return relatedProject ? !isCancelledStatus(relatedProject.id_status, details.statuses) : false;
        }).length;

        const availabilityResult = await performListAvailabilityForTeacher(
          fetch,
          API_BASE_URL,
          teacher.id_user
        ).catch(() => null);

        return {
          ...teacher,
          activeProjectCount,
          availability: availabilityResult?.ok ? availabilityResult.data : []
        };
      })
    );

    return {
      ...details,
      teachers: teachersWithAvailability,
      projectId,
      actionStatuses: filterStatusesForCoordinatorSelector(details.statuses),
      isProjectCancelled,
      documents,
      documentTypes,
      activityEntries: attachCommentsToProgress(progressEntries, comments),
      currentUserId
    };
  } catch (error) {
    return {
      projectId,
      actionStatuses: [],
      isProjectCancelled: false,
      documents: [],
      documentTypes: [],
      activityEntries: [],
      currentUserId,
      error: error.message || 'Could not load project details.'
    };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  updateStatus: async ({ request, fetch, params }) => {
    const projectId = Number(params.id);
    const formData = await request.formData();
    const statusId = Number(formData.get('statusId'));

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

    let statuses = [];

    const statusesResult = await applyStatusUpdate(async () => {
      statuses = await getStatuses(fetch, 'coordinator');
    });

    if (!statusesResult.success) {
      return fail(statusesResult.status >= 400 ? statusesResult.status : 500, {
        error: statusesResult.message
      });
    }

    if (isCancelledStatus(statusId, statuses)) {
      return fail(403, {
        error: 'Use the Cancel project button to cancel a project.'
      });
    }

    const result = await applyStatusUpdate(() => updateProjectStatus(fetch, projectId, statusId));

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    return {
      success: true,
      messageKey: 'statusUpdatedSuccess'
    };
  },

  cancelProject: async ({ fetch, params }) => {
    const projectId = Number(params.id);

    if (!projectId) {
      return fail(400, {
        error: 'Invalid project.'
      });
    }

    let statuses = [];

    const statusesResult = await applyStatusUpdate(async () => {
      statuses = await getStatuses(fetch, 'coordinator');
    });

    if (!statusesResult.success) {
      return fail(statusesResult.status >= 400 ? statusesResult.status : 500, {
        error: statusesResult.message
      });
    }

    const cancelledStatusId = getCancelledStatusId(statuses);

    const result = await applyStatusUpdate(() =>
      updateProjectStatus(fetch, projectId, cancelledStatusId)
    );

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    return {
      success: true,
      messageKey: 'cancelledSuccess'
    };
  },

  reactivateProject: async ({ fetch, params }) => {
    const projectId = Number(params.id);

    if (!projectId) {
      return fail(400, {
        error: 'Invalid project.'
      });
    }

    let statuses = [];

    const statusesResult = await applyStatusUpdate(async () => {
      statuses = await getStatuses(fetch, 'coordinator');
    });

    if (!statusesResult.success) {
      return fail(statusesResult.status >= 400 ? statusesResult.status : 500, {
        error: statusesResult.message
      });
    }

    const activeStatusId = getActiveStatusId(statuses);

    const result = await applyStatusUpdate(() =>
      updateProjectStatus(fetch, projectId, activeStatusId)
    );

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    return {
      success: true,
      messageKey: 'reactivatedSuccess'
    };
  },

  assignTeacher: async ({ request, fetch, params }) => {
    const projectId = Number(params.id);
    const formData = await request.formData();
    const teacherId = Number(formData.get('teacherId'));

    if (!projectId) {
      return fail(400, {
        error: 'Invalid project.'
      });
    }

    if (!teacherId) {
      return fail(400, {
        error: 'Select a valid professor.'
      });
    }

    let assignResult;

    const result = await applyStatusUpdate(async () => {
      assignResult = await assignTeacherToProject(fetch, projectId, teacherId);
    });

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    const messageKey = assignResult?.alreadyAssigned
      ? 'teacherAlreadyAssigned'
      : assignResult?.reassigned
        ? 'teacherReassignedSuccess'
        : 'teacherAssignedSuccess';

    return {
      success: true,
      messageKey
    };
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