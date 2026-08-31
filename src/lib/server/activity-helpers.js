import { requestJson, requestJsonWithReadFallback } from './project-helpers.js';
import {
  normalizeProgress,
  normalizeComment,
  filterProgressByProject,
  filterCommentsByProgressIds,
  attachCommentsToProgress
} from './activity-normalizers.js';

export {
  normalizeProgress,
  normalizeComment,
  filterProgressByProject,
  filterCommentsByProgressIds,
  attachCommentsToProgress
};

export async function getProgressForProject(fetch, moduleName, projectId) {
  const data = await requestJsonWithReadFallback(fetch, 'progress', moduleName);
  const normalized = (Array.isArray(data) ? data : []).map(normalizeProgress);
  return filterProgressByProject(normalized, projectId);
}

export async function getCommentsForProgressIds(fetch, moduleName, progressIds = []) {
  const data = await requestJsonWithReadFallback(fetch, 'comments', moduleName);
  const normalized = (Array.isArray(data) ? data : []).map(normalizeComment);
  return filterCommentsByProgressIds(normalized, progressIds);
}

export async function createProgress(fetch, moduleName, payload) {
  return requestJson(fetch, 'progress', moduleName, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function createComment(fetch, moduleName, payload) {
  return requestJson(fetch, 'comments', moduleName, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function deleteComment(fetch, moduleName, commentId) {
  return requestJson(fetch, `comments/${commentId}`, moduleName, { method: 'DELETE' });
}
