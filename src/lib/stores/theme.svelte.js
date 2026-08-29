const STORAGE_KEY = 'sgpa-theme';

function getSystemPreference() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredTheme() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch (_) {
    return null;
  }
}

/**
 * Shared theme state. The inline script in app.html already sets
 * <html data-theme> before first paint (avoiding a flash); this store keeps
 * Svelte components in sync with that value and lets them change it.
 */
export const themeState = $state({
  current: readStoredTheme() || getSystemPreference()
});

export function applyTheme(theme) {
  themeState.current = theme;

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
      // Storage may be unavailable (private browsing, disabled storage) — the
      // toggle still works for the current page load, it just won't persist.
    }
  }
}

export function toggleTheme() {
  applyTheme(themeState.current === 'dark' ? 'light' : 'dark');
}

/** Sync the store with whatever app.html's inline script already applied. */
export function syncThemeFromDocument() {
  if (typeof document === 'undefined') return;

  const attr = document.documentElement.getAttribute('data-theme');

  if (attr === 'light' || attr === 'dark') {
    themeState.current = attr;
  }
}
