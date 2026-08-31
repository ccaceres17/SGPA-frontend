/**
 * Pure normalization/filtering logic for progress entries ("Activity") and
 * their comments, kept free of SvelteKit imports (no $lib/$env) so it can be
 * exercised directly with `node --test`, the same way status-update.js and
 * login-request.js are.
 */

export function normalizeProgress(item) {
  if (Array.isArray(item)) {
    return {
      id_progress: item[0] ?? null,
      id_project: item[1] ?? null,
      id_user: item[2] ?? null,
      description: item[3] ?? '',
      progress_percentage: Number(item[4] ?? 0),
      created_at: item[5] ?? null,
      raw: item
    };
  }

  return {
    id_progress: item?.id_progress ?? item?.id ?? null,
    id_project: item?.id_project ?? null,
    id_user: item?.id_user ?? null,
    description: item?.description ?? '',
    progress_percentage: Number(item?.progress_percentage ?? 0),
    created_at: item?.created_at ?? null,
    raw: item
  };
}

export function normalizeComment(item) {
  if (Array.isArray(item)) {
    return {
      id_comment: item[0] ?? null,
      id_progress: item[1] ?? null,
      id_user: item[2] ?? null,
      content: item[3] ?? '',
      created_at: item[4] ?? null,
      raw: item
    };
  }

  return {
    id_comment: item?.id_comment ?? item?.id ?? null,
    id_progress: item?.id_progress ?? null,
    id_user: item?.id_user ?? null,
    content: item?.content ?? '',
    created_at: item?.created_at ?? null,
    raw: item
  };
}

/**
 * The backend has no `?id_project` filter on `GET /progress` — it returns
 * every progress entry system-wide. Filtered here, before the caller
 * serializes anything into `load()`'s return value.
 */
export function filterProgressByProject(progressEntries, projectId) {
  return progressEntries
    .filter((entry) => Number(entry.id_project) === Number(projectId))
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

/**
 * The backend has no `?id_progress` filter on `GET /comments` either —
 * filtered here against the set of progress-entry ids that belong to this
 * project, so a project never sees another project's comments.
 */
export function filterCommentsByProgressIds(comments, progressIds = []) {
  const idSet = new Set(progressIds.map(Number));
  return comments.filter((comment) => idSet.has(Number(comment.id_progress)));
}

export function attachCommentsToProgress(progressEntries, comments) {
  return progressEntries.map((entry) => ({
    ...entry,
    comments: comments.filter((comment) => Number(comment.id_progress) === Number(entry.id_progress))
  }));
}
