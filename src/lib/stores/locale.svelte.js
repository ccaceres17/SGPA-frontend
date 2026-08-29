import { messages } from '$lib/i18n/messages.js';
import { DEFAULT_LOCALE, normalizeLocale, translate, format } from '$lib/i18n/locale.js';

const COOKIE_NAME = 'sgpa-locale';

function readStoredLocale() {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? normalizeLocale(decodeURIComponent(match[1])) : null;
}

/**
 * Shared locale state. The inline script in app.html already sets <html lang>
 * from the same cookie before first paint (avoiding a flash); this store
 * keeps Svelte components in sync and lets them change it. Backed by a
 * cookie (not localStorage, unlike theme.svelte.js) so the server can read
 * the same value for SSR'd copy such as login form errors.
 */
export const localeState = $state({
  current: readStoredLocale() || DEFAULT_LOCALE
});

export function applyLocale(locale) {
  const normalized = normalizeLocale(locale);
  localeState.current = normalized;

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', normalized);

    try {
      document.cookie = `${COOKIE_NAME}=${normalized}; path=/; max-age=31536000; samesite=lax`;
    } catch (_) {
      // Cookies may be unavailable (privacy settings) — locale still works for the current load.
    }
  }
}

export function toggleLocale() {
  applyLocale(localeState.current === 'en' ? 'es' : 'en');
}

/** Sync the store with whatever app.html's inline script already applied. */
export function syncLocaleFromDocument() {
  if (typeof document === 'undefined') return;

  const attr = document.documentElement.getAttribute('lang');
  if (attr) {
    localeState.current = normalizeLocale(attr);
  }
}

export function t(key, params) {
  const value = translate(messages, key, localeState.current);
  return params ? format(value, params) : value;
}
