<script>
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LanguageToggle from '$lib/components/LanguageToggle.svelte';
  import { t } from '$lib/stores/locale.svelte.js';
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

    <nav class="main-nav" aria-label={t('nav.menuLabel')}>
      <LanguageToggle />
      <ThemeToggle />
      <a href="/" class="home-btn">{t('nav.home')}</a>
    </nav>
  </div>
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
    padding: 14px 24px;
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
    gap: 12px;
    flex-wrap: wrap;
  }

  .home-btn {
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

  .home-btn:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 720px) {
    .header-container {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 480px) {
    .brand-text p {
      display: none;
    }
  }
</style>