<script>
  import { base } from '$app/paths';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Carousel from '$lib/components/Carousel.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  const FEATURE_ICONS = ['folder', 'users', 'list', 'book-open'];
  const ROLE_ICONS = ['graduation-cap', 'user-circle', 'users'];

  $: heroSlides = [
    { src: `${base}/images/login-banner.webp`, alt: t('home.hero.carouselAltLogo') },
    { src: `${base}/images/coordinador.png`, alt: t('home.hero.carouselAltCoordinator') },
    { src: `${base}/images/docentes.png`, alt: t('home.hero.carouselAltTeachers') },
    { src: `${base}/images/equipo-academico.png`, alt: t('home.hero.carouselAltTeam') }
  ];
</script>

<svelte:head>
  <title>SGPA | Academic Project Management System</title>
  <meta
    name="description"
    content="SGPA platform for academic project management at Corporación Universitaria Latinoamericana."
  />
</svelte:head>

<div class="page">
  <Header />

  <main id="inicio">
    <section class="hero">
      <div class="hero-grid">
        <div class="hero-inner">
          <span class="eyebrow">{t('home.hero.eyebrow')}</span>
          <h2>{t('home.hero.title')}</h2>
          <p>{t('home.hero.description')}</p>

          <div class="hero-actions">
            <a href="{base}/login" class="primary-btn">{t('home.hero.primaryCta')}</a>
            <a href="#funcionamiento" class="secondary-btn">{t('home.hero.secondaryCta')}</a>
          </div>
        </div>

        <div class="hero-carousel">
          <Carousel slides={heroSlides} />
        </div>
      </div>
    </section>

    <section id="funcionamiento" class="features-section">
      <div class="section-header">
        <span class="section-eyebrow">{t('home.features.eyebrow')}</span>
        <h3>{t('home.features.heading')}</h3>
        <p>{t('home.features.description')}</p>
      </div>

      <div class="features-grid">
        {#each t('home.features.items') as item, index}
          <a href="{base}/login" class="feature-card">
            <div class="card-icon">
              <Icon name={FEATURE_ICONS[index] || 'folder'} size={22} />
            </div>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
            <span class="card-arrow"><Icon name="arrow-right" size={16} /></span>
          </a>
        {/each}
      </div>
    </section>

    <section id="equipo" class="roles-section">
      <div class="section-header">
        <span class="section-eyebrow">{t('home.roles.eyebrow')}</span>
        <h3>{t('home.roles.heading')}</h3>
        <p>{t('home.roles.description')}</p>
      </div>

      <div class="roles-grid">
        {#each t('home.roles.items') as item, index}
          <a href="{base}/login" class="role-card">
            <div class="card-icon">
              <Icon name={ROLE_ICONS[index] || 'user'} size={22} />
            </div>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
            <span class="card-arrow"><Icon name="arrow-right" size={16} /></span>
          </a>
        {/each}
      </div>
    </section>

    <section class="final-cta">
      <h3>{t('home.finalCta.heading')}</h3>
      <a href="{base}/login" class="primary-btn">{t('home.finalCta.button')}</a>
    </section>
  </main>

  <Footer />
</div>

<style>
  .page {
    min-height: 100vh;
    background: var(--sgpa-bg);
  }

  .hero {
    padding: 56px 24px;
    background: var(--sgpa-surface);
    border-bottom: 1px solid var(--sgpa-border);
  }

  .hero-grid {
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    gap: 40px;
  }

  .hero-inner {
    text-align: left;
    min-width: 0;
  }

  .hero-carousel {
    order: 2;
    width: 100%;
    min-width: 0;
  }

  .eyebrow,
  .section-eyebrow {
    display: inline-flex;
    width: fit-content;
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    font-weight: 950;
    font-size: 0.82rem;
    padding: 8px 14px;
    border-radius: 999px;
    margin-bottom: 18px;
    border: 1px solid rgba(247, 184, 6, 0.32);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .hero-inner h2 {
    margin: 0 0 16px;
    font-size: clamp(1.9rem, 3.4vw, 2.75rem);
    line-height: 1.1;
    color: var(--sgpa-blue-dark);
    letter-spacing: -0.03em;
    font-weight: 900;
  }

  .hero-inner p {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--sgpa-text-soft);
    max-width: 560px;
  }

  .hero-actions {
    display: flex;
    justify-content: flex-start;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 26px;
  }

  .primary-btn,
  .secondary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    text-decoration: none;
    padding: 13px 22px;
    border-radius: 999px;
    font-weight: 900;
  }

  .features-section,
  .roles-section {
    max-width: 1180px;
    margin: 0 auto;
    padding: 64px 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 34px;
  }

  .section-header h3 {
    margin: 0 0 12px;
    color: var(--sgpa-blue-dark);
    font-size: clamp(1.6rem, 2.4vw, 2.2rem);
    font-weight: 900;
  }

  .section-header p {
    max-width: 720px;
    margin: 0 auto;
    color: var(--sgpa-text-soft);
    font-size: 1rem;
    line-height: 1.7;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .roles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .feature-card,
  .role-card {
    position: relative;
    display: block;
    background: var(--sgpa-surface);
    border-radius: 18px;
    padding: 24px;
    border: 1px solid var(--sgpa-border);
    text-decoration: none;
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.22s ease;
  }

  .feature-card:hover,
  .role-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--sgpa-shadow-md);
    border-color: rgba(11, 45, 105, 0.18);
  }

  .card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-bottom: 14px;
    border-radius: 14px;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
  }

  .feature-card h4,
  .role-card h4 {
    margin: 0 0 10px;
    color: var(--sgpa-blue);
    font-size: 1.05rem;
    font-weight: 900;
  }

  .feature-card p,
  .role-card p {
    margin: 0;
    color: var(--sgpa-text-soft);
    line-height: 1.65;
    font-size: 0.95rem;
  }

  .card-arrow {
    display: inline-flex;
    margin-top: 14px;
    color: var(--sgpa-blue);
  }

  .final-cta {
    max-width: 760px;
    margin: 0 auto;
    padding: 24px 24px 72px;
    text-align: center;
  }

  .final-cta h3 {
    margin: 0 0 22px;
    color: var(--sgpa-blue-dark);
    font-size: clamp(1.5rem, 2.4vw, 2rem);
    font-weight: 900;
  }

  @media (max-width: 960px) {
    .hero-grid {
      grid-template-columns: 1fr;
    }

    .hero-inner {
      text-align: center;
    }

    .hero-inner p {
      margin: 0 auto;
    }

    .hero-actions {
      justify-content: center;
    }

    .hero-carousel {
      max-width: 480px;
      margin: 0 auto;
    }

    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .roles-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .hero,
    .features-section,
    .roles-section,
    .final-cta {
      padding-inline: 16px;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .hero-actions a {
      width: 100%;
    }
  }
</style>
