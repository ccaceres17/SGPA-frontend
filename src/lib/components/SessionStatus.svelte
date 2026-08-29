<script>
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/state';
  import { onDestroy, onMount } from 'svelte';
  import { t } from '$lib/stores/locale.svelte.js';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LanguageToggle from '$lib/components/LanguageToggle.svelte';

  let remaining = $state(0);
  let timer = null;
  let loggingOut = $state(false);
  let isOpen = $state(false);

  let session = $derived(page.data?.session ?? null);
  let user = $derived(session?.user ?? null);
  let exp = $derived(Number(session?.exp || 0));
  let isWarning = $derived(remaining > 0 && remaining <= 300);

  let userLabel = $derived(user?.displayName || `${user?.first_name || 'User'} - ${user?.roleLabel || 'User'}`);
  let initials = $derived(
    (user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()
  );

  function calculateRemaining() {
    if (!exp) {
      remaining = 0;
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    remaining = Math.max(0, exp - now);

    if (remaining === 0 && session && !loggingOut) {
      logout('expired');
    }
  }

  function formatRemaining(seconds) {
    const total = Math.max(0, Number(seconds) || 0);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    return [hours, minutes, secs]
      .map((value) => String(value).padStart(2, '0'))
      .join(':');
  }

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }

  async function logout(reason = 'manual') {
    if (loggingOut) return;

    loggingOut = true;
    closeMenu();

    try {
      await fetch('/logout', {
        method: 'POST'
      });
    } catch (_) {
      // If the logout request fails, the interface should still leave the private area.
    }

    await invalidateAll();

    const query = reason === 'expired' ? '?reason=expired' : '?logout=1';

    goto(`/login${query}`, {
      replaceState: true
    });
  }

  onMount(() => {
    calculateRemaining();

    timer = setInterval(() => {
      calculateRemaining();
    }, 1000);
  });

  onDestroy(() => {
    if (timer) {
      clearInterval(timer);
    }
  });
</script>

{#if session && user}
  <div class="account-widget">
    <button
      type="button"
      class="account-trigger"
      onclick={toggleMenu}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label={`${t('session.accountLabel')}: ${userLabel}`}
    >
      <span class="avatar" aria-hidden="true">{initials}</span>
    </button>

    {#if isOpen}
      <button
        type="button"
        class="account-overlay"
        aria-label={t('nav.closeMenu')}
        onclick={closeMenu}
      ></button>

      <div class="account-menu" role="menu">
        <div class="account-summary">
          <span class="avatar avatar-lg" aria-hidden="true">{initials}</span>
          <div class="account-summary-text">
            <strong>{userLabel}</strong>
            <small>{user.email}</small>
          </div>
        </div>

        <p class="session-expiry" class:warning={isWarning}>
          {t('session.expiresIn', { time: formatRemaining(remaining) })}
        </p>

        <div class="settings-row">
          <span class="settings-label">{t('settings.title')}</span>
          <div class="settings-controls">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <button
          type="button"
          class="logout-btn"
          onclick={() => logout('manual')}
          disabled={loggingOut}
        >
          {loggingOut ? t('session.loggingOut') : t('session.logout')}
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .account-widget {
    position: relative;
  }

  .account-trigger {
    display: inline-flex;
    width: 42px;
    height: 42px;
    padding: 0;
    border-radius: 999px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
    box-shadow: var(--sgpa-shadow-sm);
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }

  .account-trigger:hover {
    background: var(--sgpa-blue-soft);
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: var(--sgpa-blue);
    color: #ffffff;
    font-weight: 950;
    font-size: 0.82rem;
  }

  .avatar-lg {
    width: 44px;
    height: 44px;
    font-size: 1.05rem;
    flex-shrink: 0;
  }

  .account-overlay {
    position: fixed;
    inset: 0;
    z-index: 35;
    border: none;
    background: transparent;
    cursor: default;
  }

  .account-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 40;
    width: 260px;
    padding: 1rem;
    border-radius: 20px;
    background: var(--sgpa-surface-elevated);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-lg);
    display: grid;
    gap: 0.75rem;
  }

  .account-summary {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    min-width: 0;
  }

  .account-summary-text {
    display: grid;
    min-width: 0;
  }

  .account-summary-text strong {
    color: var(--sgpa-blue-dark);
    font-size: 0.92rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .account-summary-text small {
    color: var(--sgpa-text-soft);
    font-size: 0.78rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .session-expiry {
    margin: 0;
    padding: 0.5rem 0.65rem;
    border-radius: 12px;
    background: var(--sgpa-surface-soft);
    color: var(--sgpa-text-soft);
    font-size: 0.76rem;
    font-weight: 700;
  }

  .session-expiry.warning {
    background: var(--sgpa-warning-bg, #fff7d6);
    color: var(--sgpa-warning, #b7791f);
  }

  .settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    padding-top: 0.6rem;
    border-top: 1px solid var(--sgpa-border);
  }

  .settings-label {
    color: var(--sgpa-text-soft);
    font-size: 0.78rem;
    font-weight: 800;
  }

  .settings-controls {
    display: inline-flex;
    gap: 0.4rem;
  }

  .logout-btn {
    min-height: 40px;
    padding: 0.55rem 0.9rem;
    border-radius: 999px;
    border: none;
    background: var(--sgpa-danger, #dc2626);
    color: #ffffff;
    font-size: 0.85rem;
    font-weight: 950;
    cursor: pointer;
  }

  .logout-btn:hover {
    transform: translateY(-1px);
  }

  .logout-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    .account-menu {
      width: min(280px, calc(100vw - 32px));
    }
  }
</style>
