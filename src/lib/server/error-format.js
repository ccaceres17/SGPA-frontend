/**
 * Turns a parsed backend JSON error body into a safe, human-readable
 * string — never the raw object/array itself.
 *
 * FastAPI validation failures return `detail` as an ARRAY of
 * `{msg, loc, type}` objects, not a string. Every prior implementation of
 * this exact chain (`data?.detail || data?.message || data?.error || ...`)
 * picked that truthy array and let it flow into a template literal or
 * `new Error(...)`, which implicitly stringifies it via `Array.prototype
 * .toString()` -> each element's own `toString()` -> "[object Object]".
 * This function is the single place that shape is handled correctly.
 *
 * No SvelteKit imports — usable from both server and client code, and
 * testable directly with `node --test`.
 */
export function formatBackendDetail(data) {
  const detail = data?.detail ?? data?.message ?? data?.error;

  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const parts = detail
      .map((entry) => {
        if (typeof entry === 'string') return entry;
        return entry?.msg || entry?.message || null;
      })
      .filter(Boolean);

    if (parts.length) return parts.join('; ');
  }

  if (detail && typeof detail === 'object') {
    if (typeof detail.msg === 'string' && detail.msg) return detail.msg;
    if (typeof detail.message === 'string' && detail.message) return detail.message;
  }

  return 'The request could not be completed.';
}
