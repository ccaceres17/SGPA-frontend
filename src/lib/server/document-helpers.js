import { requestJson, requestJsonWithReadFallback, getApiUrl, safeJson } from './project-helpers.js';
import { normalizeDocument, normalizeDocumentType, filterDocumentsByProject } from './document-normalizers.js';
import { formatBackendDetail } from './error-format.js';

export { normalizeDocument, normalizeDocumentType, filterDocumentsByProject };

export async function getDocumentTypes(fetch, moduleName = 'coordinator') {
  const data = await requestJsonWithReadFallback(fetch, 'document-types', moduleName);
  return (Array.isArray(data) ? data : []).map(normalizeDocumentType);
}

export async function getDocumentsForProject(fetch, moduleName, projectId) {
  const data = await requestJsonWithReadFallback(fetch, 'documents', moduleName);
  const normalized = (Array.isArray(data) ? data : []).map(normalizeDocument);
  return filterDocumentsByProject(normalized, projectId);
}

/**
 * Real multipart PDF upload. Deliberately does not go through requestJson —
 * that helper always forces a JSON Content-Type header, which would stop the
 * browser/runtime from setting the multipart boundary the backend needs to
 * parse the file. `formData` must already contain id_project,
 * id_document_type, description, and a `file` entry (a Blob/File).
 */
export async function uploadDocument(fetch, formData) {
  const url = getApiUrl('documents');
  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  const text = await response.text().catch(() => '');
  const data = safeJson(text);

  if (!response.ok) {
    const detail = typeof data === 'string' ? data : formatBackendDetail(data);
    const error = new Error(`Could not upload document. Status ${response.status}. ${detail}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function deleteDocument(fetch, moduleName, documentId) {
  return requestJson(fetch, `documents/${documentId}`, moduleName, { method: 'DELETE' });
}

/**
 * Fetches the raw backend response for a document download. Used by a
 * SvelteKit +server.js proxy route: a plain <a href> can't carry the
 * Authorization header the backend requires, but the SvelteKit-provided
 * `fetch` here gets it attached automatically (hooks.server.js's
 * handleFetch), so the browser only ever talks to our own origin.
 */
export function fetchDocumentForDownload(fetch, documentId) {
  return fetch(getApiUrl(`documents/${documentId}/download`));
}
