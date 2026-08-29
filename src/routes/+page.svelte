<script>
  import { base } from '$app/paths';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/stores/locale.svelte.js';
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
      <div class="hero-inner">
        <span class="eyebrow">{t('home.hero.eyebrow')}</span>
        <h2>{t('home.hero.title')}</h2>
        <p>{t('home.hero.description')}</p>

        <div class="hero-actions">
          <a href="{base}/login" class="primary-btn">{t('home.hero.primaryCta')}</a>
          <a href="#funcionamiento" class="secondary-btn">{t('home.hero.secondaryCta')}</a>
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
        {#each t('home.features.items') as item}
          <article class="feature-card">
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </article>
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
        {#each t('home.roles.items') as item}
          <article class="role-card">
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </article>
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

  .hero-inner {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
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

  .hero-inner .eyebrow {
    margin-left: auto;
    margin-right: auto;
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
    margin: 0 auto;
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--sgpa-text-soft);
    max-width: 620px;
  }

  .hero-actions {
    display: flex;
    justify-content: center;
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
    background: var(--sgpa-surface);
    border-radius: 18px;
    padding: 24px;
    border: 1px solid var(--sgpa-border);
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
