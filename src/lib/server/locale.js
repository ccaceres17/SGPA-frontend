import { normalizeLocale } from '$lib/i18n/locale.js';

export const LOCALE_COOKIE = 'sgpa-locale';

/** Server-side counterpart of src/lib/stores/locale.svelte.js — same cookie, same default. */
export function getLocaleFromCookies(cookies) {
  return normalizeLocale(cookies.get(LOCALE_COOKIE));
}
