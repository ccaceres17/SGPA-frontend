/**
 * Framework-agnostic locale helpers — no SvelteKit/browser imports, so this is
 * usable from both server code (+page.server.js) and client stores.
 */

export const SUPPORTED_LOCALES = ['en', 'es'];
export const DEFAULT_LOCALE = 'en';

export function normalizeLocale(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return SUPPORTED_LOCALES.includes(normalized) ? normalized : DEFAULT_LOCALE;
}

function getByPath(source, key) {
  return key
    .split('.')
    .reduce((node, segment) => (node && typeof node === 'object' ? node[segment] : undefined), source);
}

/** Looks up `key` (dot path) in `messages[locale]`, falling back to DEFAULT_LOCALE, then the key itself. */
export function translate(messages, key, locale) {
  const activeLocale = normalizeLocale(locale);
  const value = getByPath(messages[activeLocale], key);

  if (value !== undefined) return value;

  const fallback = getByPath(messages[DEFAULT_LOCALE], key);
  return fallback !== undefined ? fallback : key;
}

/** Replaces `{token}` placeholders in a translated string with values from `params`. */
export function format(template, params = {}) {
  return String(template).replace(/\{(\w+)\}/g, (match, token) =>
    token in params ? String(params[token]) : match
  );
}
