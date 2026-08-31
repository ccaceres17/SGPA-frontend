/**
 * Pure normalization/filtering logic for documents, kept free of SvelteKit
 * imports (no $lib/$env) so it can be exercised directly with `node --test`,
 * the same way status-update.js and login-request.js are.
 */

export function normalizeDocumentType(type) {
  if (Array.isArray(type)) {
    return {
      id_document_type: type[0] ?? null,
      document_type_name: type[1] ?? '',
      description: type[2] ?? '',
      raw: type
    };
  }

  return {
    id_document_type: type?.id_document_type ?? type?.id ?? null,
    document_type_name: type?.document_type_name ?? type?.name ?? '',
    description: type?.description ?? '',
    raw: type
  };
}

export function normalizeDocument(doc) {
  if (Array.isArray(doc)) {
    return {
      id_document: doc[0] ?? null,
      id_project: doc[1] ?? null,
      id_user: doc[2] ?? null,
      id_document_type: doc[3] ?? null,
      file_name: doc[4] ?? '',
      file_path: doc[5] ?? '',
      description: doc[6] ?? '',
      uploaded_at: doc[7] ?? null,
      raw: doc
    };
  }

  return {
    id_document: doc?.id_document ?? doc?.id ?? null,
    id_project: doc?.id_project ?? null,
    id_user: doc?.id_user ?? null,
    id_document_type: doc?.id_document_type ?? null,
    file_name: doc?.file_name ?? '',
    file_path: doc?.file_path ?? '',
    description: doc?.description ?? '',
    uploaded_at: doc?.uploaded_at ?? null,
    raw: doc
  };
}

/**
 * The backend has no `?id_project` filter on `GET /documents` — it returns
 * every document system-wide. This filter is applied server-side, inside
 * the load()-calling helper, so only one project's documents are ever
 * serialized into the page's data and sent to the browser.
 */
export function filterDocumentsByProject(documents, projectId) {
  return documents.filter((doc) => Number(doc.id_project) === Number(projectId));
}
