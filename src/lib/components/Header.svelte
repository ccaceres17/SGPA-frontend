<script>
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LanguageToggle from '$lib/components/LanguageToggle.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  let isMenuOpen = $state(false);

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<header class="site-header">
  <div class="top-bar"></div>

  <div class="header-container">
    <a href="/" class="brand" aria-label="SGPA — {t('nav.home')}">
      <div class="logo-slot" aria-hidden="true">
        <img src="/images/logo-cul.webp" alt="" width="400" height="169" />
      </div>

      <div class="brand-text">
        <span class="brand-title">SGPA</span>
        <p>{t('header.tagline')}</p>
      </div>
    </a>

    <nav class="main-nav desktop-nav" aria-label={t('nav.menuLabel')}>
      <a href="#inicio" class="active">{t('nav.home')}</a>
      <a href="#funcionamiento">{t('nav.howItWorks')}</a>
      <a href="#equipo">{t('nav.team')}</a>

      <span class="utility-cluster">
        <LanguageToggle />
        <ThemeToggle />
      </span>

      <a href="/login" class="login-btn">{t('nav.login')}</a>
    </nav>

    <button
      type="button"
      class="menu-toggle"
      onclick={toggleMenu}
      aria-expanded={isMenuOpen}
      aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
    >
      <span class="hamburger" class:open={isMenuOpen} aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>
  </div>

  {#if isMenuOpen}
    <button
      type="button"
      class="mobile-overlay"
      aria-label={t('nav.closeMenu')}
      onclick={closeMenu}
    ></button>

    <nav class="mobile-nav" aria-label={t('nav.menuLabel')}>
      <a href="#inicio" onclick={closeMenu}>{t('nav.home')}</a>
      <a href="#funcionamiento" onclick={closeMenu}>{t('nav.howItWorks')}</a>
      <a href="#equipo" onclick={closeMenu}>{t('nav.team')}</a>

      <div class="mobile-utility">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <a href="/login" class="login-btn" onclick={closeMenu}>{t('nav.login')}</a>
    </nav>
  {/if}
</header>

<style>
  .top-bar {
    height: 7px;
    background: var(--sgpa-blue-dark);
  }

  .site-header {
    position: sticky;
    top: 0;
    z-index: 30;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--sgpa-border);
  }

  .header-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
    text-decoration: none;
    min-width: 0;
  }

  .logo-slot {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    overflow: hidden;
    /* Intentionally always white: the logo art is designed for a light
       tile and would lose contrast on a dark surface in dark mode. */
    background: #ffffff;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
  }

  .logo-slot img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .brand-title {
    display: block;
    color: var(--sgpa-blue);
    font-size: 1.35rem;
    line-height: 1;
    font-weight: 950;
    letter-spacing: 0.01em;
  }

  .brand-text p {
    margin: 6px 0 0;
    color: var(--sgpa-text-soft);
    font-size: 0.82rem;
    font-weight: 650;
    white-space: nowrap;
  }

  .main-nav {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .main-nav a {
    text-decoration: none;
    color: var(--sgpa-text-soft);
    font-size: 0.95rem;
    font-weight: 800;
    position: relative;
    transition: color 0.22s ease;
    padding: 8px 0;
  }

  .main-nav a:hover,
  .main-nav a.active {
    color: var(--sgpa-link);
  }

  .main-nav a.active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 3px;
    background: var(--sgpa-yellow);
    border-radius: 999px;
  }

  .utility-cluster {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .login-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 10px 18px !important;
    background: var(--sgpa-accent-start);
    color: #ffffff !important;
    border-radius: 999px;
    font-weight: 900 !important;
  }

  .login-btn:hover {
    transform: translateY(-1px);
  }

  .menu-toggle {
    display: none;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .hamburger {
    display: grid;
    gap: 5px;
  }

  .hamburger span {
    width: 20px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transition: transform 0.22s ease, opacity 0.22s ease;
  }

  .hamburger.open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .hamburger.open span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 35;
    border: none;
    background: rgba(15, 35, 70, 0.32);
    cursor: pointer;
  }

  .mobile-nav {
    position: fixed;
    inset: 0 0 0 auto;
    z-index: 40;
    width: min(320px, 84vw);
    height: 100vh;
    background: var(--sgpa-surface);
    border-left: 1px solid var(--sgpa-border);
    box-shadow: -18px 0 44px rgba(15, 35, 70, 0.16);
    padding: 84px 24px 24px;
    display: grid;
    gap: 4px;
    align-content: start;
    overflow-y: auto;
  }

  .mobile-nav a {
    text-decoration: none;
    color: var(--sgpa-text);
    font-weight: 800;
    padding: 12px 4px;
    border-bottom: 1px solid var(--sgpa-border);
  }

  .mobile-nav .login-btn {
    margin-top: 12px;
    border-bottom: none;
    text-align: center;
  }

  .mobile-utility {
    display: flex;
    gap: 10px;
    padding: 14px 4px;
    border-bottom: 1px solid var(--sgpa-border);
  }

  @media (max-width: 860px) {
    .desktop-nav {
      display: none;
    }

    .menu-toggle {
      display: inline-flex;
    }
  }

  @media (max-width: 480px) {
    .brand-text p {
      display: none;
    }
  }
</style>
