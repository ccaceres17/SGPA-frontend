import { fail } from '@sveltejs/kit';
import {
  getProjectDetails,
  enrollStudentInProject,
  ROLE_IDS
} from '$lib/server/project-helpers.js';
import { applyStatusUpdate } from '$lib/server/status-update.js';
import { getLocaleFromCookies } from '$lib/server/locale.js';
import { getDocumentsForProject, getDocumentTypes, uploadDocument, deleteDocument } from '$lib/server/document-helpers.js';
import {
  getProgressForProject,
  getCommentsForProgressIds,
  attachCommentsToProgress,
  createComment,
  deleteComment
} from '$lib/server/activity-helpers.js';

const MODULE_NAME = 'students';

function getCurrentStudentId(locals) {
  return Number(locals?.session?.user?.id_user || 0);
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params, url, locals, cookies }) {
  const projectId = Number(params.id);
  const source = url.searchParams.get('source') || 'available';
  const currentStudentId = getCurrentStudentId(locals);

  if (!currentStudentId) {
    return {
      error: 'Could not identify the logged-in student.',
      projectId: params.id,
      currentStudentId,
      source
    };
  }

  if (!projectId) {
    return {
      error: 'Invalid project ID.',
      projectId: params.id,
      currentStudentId,
      source
    };
  }

  try {
    const locale = getLocaleFromCookies(cookies);
    const details = await getProjectDetails(fetch, MODULE_NAME, projectId, locale);

    const isEnrolled = details.relations.some(
      (relation) =>
        Number(relation.id_project) === projectId &&
        Number(relation.id_user) === currentStudentId &&
        Number(relation.id_role) === ROLE_IDS.student
    );

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
      ...details,
      projectId,
      source,
      currentStudentId,
      isEnrolled,
      documents,
      documentTypes,
      activityEntries: attachCommentsToProgress(progressEntries, comments)
    };
  } catch (error) {
    return {
      projectId,
      source,
      currentStudentId,
      documents: [],
      documentTypes: [],
      activityEntries: [],
      error: error.message || 'Could not load project details.'
    };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  enroll: async ({ fetch, params, locals }) => {
    const projectId = Number(params.id);
    const currentStudentId = getCurrentStudentId(locals);

    if (!projectId) {
      return fail(400, {
        error: 'Invalid project.'
      });
    }

    if (!currentStudentId) {
      return fail(400, {
        error: 'Could not identify the logged-in student.'
      });
    }

    let enrollResult;

    const result = await applyStatusUpdate(async () => {
      enrollResult = await enrollStudentInProject(fetch, projectId, currentStudentId);
    });

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    return {
      success: true,
      messageKey: enrollResult?.alreadyExists ? 'alreadyEnrolledMessage' : 'enrollmentCompletedSuccess'
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