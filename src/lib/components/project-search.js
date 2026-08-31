/**
 * Pure search-matching logic for the project card list, kept free of
 * Svelte/DOM imports so it can be exercised directly with `node --test`
 * (same convention as document-normalizers.js / activity-normalizers.js).
 */

function stripHtml(html = '') {
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Case-insensitive, whitespace-trimmed match against a project row.
 * Checks the project ID directly against the structured row data first
 * (it's never part of the rendered card text), then falls back to the
 * existing rendered-card text search (name, teacher, status, dates, etc.).
 * An empty/blank term always matches (no filter applied).
 */
export function matchesProjectSearch(row, term) {
  const normalizedTerm = String(term || '').toLowerCase().trim();
  if (!normalizedTerm) return true;

  if (row?.id_project != null && String(row.id_project).toLowerCase().includes(normalizedTerm)) {
    return true;
  }

  return stripHtml(row?.proyecto_card).toLowerCase().includes(normalizedTerm);
}
