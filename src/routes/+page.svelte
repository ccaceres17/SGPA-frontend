<script>
  import { base } from '$app/paths';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  const quickAccess = [
    {
      title: 'Project management',
      description:
        'View, register, and organize academic projects within the SGPA system.',
      action: 'Learn more',
      image: '/images/gestion-proyectos.webp',
      width: 800,
      height: 427
    },
    {
      title: 'Calls',
      description:
        'Access active calls, enrollment processes, and academic tracking.',
      action: 'Explore',
      image: '/images/convocatorias.webp',
      width: 800,
      height: 800
    },
    {
      title: 'Academic tracking',
      description:
        'View the overall status of processes, deliverables, progress, and responsible users.',
      action: 'View',
      image: '/images/seguimiento.webp',
      width: 800,
      height: 534
    }
  ];

  const teamCards = [
    {
      role: 'Coordinator',
      text: 'Main system administrator responsible for overall supervision and process validation.',
      image: '/images/coordinador.png',
      width: 302,
      height: 338
    },
    {
      role: 'Academic team',
      text: 'Support team responsible for tracking, reviewing, and supporting project management.',
      image: '/images/equipo-academico.png',
      width: 400,
      height: 267
    },
    {
      role: 'Teachers',
      text: 'They participate in guiding, evaluating, and supporting academic initiatives.',
      image: '/images/docentes.png',
      width: 400,
      height: 271
    }
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
      <div class="hero-overlay">
        <div class="hero-content">
          <span class="hero-badge">Institutional platform</span>

          <h2>Academic Project Management System</h2>

          <p>
            SGPA is a platform focused on organizing, tracking, and managing
            academic projects within the university environment. Its purpose is to simplify
            the control of processes, responsible users, progress, and relevant information
            in one place.
          </p>

          <div class="hero-actions">
            <a href="{base}/login" class="primary-btn">Enter the system</a>
            <a href="#funcionamiento" class="secondary-btn">Learn more</a>
          </div>
        </div>

        <div class="hero-image-slot">
          <img
            src="/images/login-banner.webp"
            alt="Main SGPA system banner"
            width="1200"
            height="800"
            fetchpriority="high"
          />
        </div>
      </div>
    </section>

    <section id="funcionamiento" class="info-section">
      <div class="section-header">
        <span class="section-eyebrow">How it works</span>
        <h3>How does SGPA work?</h3>
        <p>
          The system is designed to centralize academic management related to
          projects, calls, tracking, and administrative control.
        </p>
      </div>

      <div class="info-grid">
        <article class="info-card">
          <span class="card-number">01</span>
          <h4>Central administration</h4>
          <p>
            The coordinator acts as the main system administrator, supervising processes,
            verifying information, and managing the overall flow of academic projects.
          </p>
        </article>

        <article class="info-card">
          <span class="card-number">02</span>
          <h4>Control and tracking</h4>
          <p>
            SGPA enables traceability of activities, statuses, deliverables, and project progress,
            reducing disorder and improving institutional consultation.
          </p>
        </article>

        <article class="info-card">
          <span class="card-number">03</span>
          <h4>Organized access</h4>
          <p>
            The platform aims to provide clear navigation for academic users,
            administrative users, and those responsible for project-related processes.
          </p>
        </article>
      </div>
    </section>

    <section class="cards-section">
      <div class="section-header">
        <span class="section-eyebrow">Modules</span>
        <h3>Main system areas</h3>
        <p>
          SGPA organizes its main functions into clear modules designed to simplify
          consultation and management of academic information.
        </p>
      </div>

      <div class="cards-grid">
        {#each quickAccess as item}
          <article class="feature-card">
            <div class="feature-image-slot">
              <img
                src={item.image}
                alt={item.title}
                width={item.width}
                height={item.height}
                loading="lazy"
              />
            </div>

            <div class="feature-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <a href="/login">{item.action}</a>
            </div>
          </article>
        {/each}
      </div>
    </section>

    <section id="equipo" class="team-section">
      <div class="section-header">
        <span class="section-eyebrow">Team</span>
        <h3>Coordinator and main team</h3>
        <p>
          This section can be used to introduce the system coordinator and the core team
          responsible for project administration and support.
        </p>
      </div>

      <div class="team-grid">
        {#each teamCards as person}
          <article class="team-card">
            <div class="team-image-slot">
              <img
                src={person.image}
                alt={person.role}
                width={person.width}
                height={person.height}
                loading="lazy"
              />
            </div>

            <div class="team-content">
              <h4>{person.role}</h4>
              <p>{person.text}</p>
            </div>
          </article>
        {/each}
      </div>
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
    position: relative;
    padding: 58px 24px 52px;
    background:
      radial-gradient(circle at top right, rgba(242, 183, 5, 0.16), transparent 24rem),
      linear-gradient(135deg, #ffffff 0%, var(--sgpa-blue-soft) 100%);
    border-bottom: 1px solid var(--sgpa-border);
  }

  .hero-overlay {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 38px;
    align-items: center;
  }

  .hero-content {
    padding: 10px 0;
  }

  .hero-badge,
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
    border: 1px solid rgba(242, 183, 5, 0.32);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .hero-content h2 {
    margin: 0 0 16px;
    font-size: clamp(2.25rem, 4vw, 4rem);
    line-height: 1.05;
    color: var(--sgpa-blue-dark);
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .hero-content p {
    margin: 0;
    font-size: 1.08rem;
    line-height: 1.8;
    color: var(--sgpa-text-soft);
    max-width: 720px;
  }

  .hero-actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 28px;
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

  .hero-image-slot {
    min-height: 420px;
    border-radius: 30px;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-lg);
  }

  .hero-image-slot img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .info-section,
  .cards-section,
  .team-section {
    max-width: 1280px;
    margin: 0 auto;
    padding: 78px 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 38px;
  }

  .section-header h3 {
    margin: 0 0 14px;
    color: var(--sgpa-blue-dark);
    font-size: clamp(1.9rem, 3vw, 3rem);
    font-weight: 950;
  }

  .section-header p {
    max-width: 860px;
    margin: 0 auto;
    color: var(--sgpa-text-soft);
    font-size: 1.03rem;
    line-height: 1.8;
  }

  .info-grid,
  .cards-grid,
  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
  }

  .info-card,
  .feature-card,
  .team-card {
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      border-color 0.25s ease;
  }

  .info-card {
    padding: 28px;
    border-top: 5px solid var(--sgpa-blue);
  }

  .card-number {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 1rem;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    font-weight: 950;
    font-size: 0.78rem;
  }

  .info-card:hover,
  .feature-card:hover,
  .team-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--sgpa-shadow-md);
    border-color: rgba(11, 45, 105, 0.18);
  }

  .info-card h4,
  .feature-content h4,
  .team-content h4 {
    margin: 0 0 14px;
    color: var(--sgpa-blue);
    font-size: 1.2rem;
    font-weight: 900;
  }

  .info-card p,
  .feature-content p,
  .team-content p {
    margin: 0;
    color: var(--sgpa-text-soft);
    line-height: 1.75;
  }

  .feature-image-slot,
  .team-image-slot {
    background: var(--sgpa-blue-soft);
    overflow: hidden;
  }

  .feature-image-slot {
    aspect-ratio: 9 / 8;
  }

  .team-image-slot {
    aspect-ratio: 4 / 3;
  }

  .feature-image-slot img,
  .team-image-slot img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .feature-content,
  .team-content {
    padding: 24px;
  }

  .feature-content {
    text-align: center;
  }

  .feature-content a {
    display: inline-flex;
    margin-top: 18px;
    text-decoration: none;
    font-weight: 900;
    color: var(--sgpa-blue);
    border-bottom: 3px solid var(--sgpa-yellow);
    padding-bottom: 3px;
  }

  .feature-content a:hover {
    color: var(--sgpa-blue-dark);
  }

  @media (max-width: 960px) {
    .hero-overlay,
    .info-grid,
    .cards-grid,
    .team-grid {
      grid-template-columns: 1fr;
    }

    .hero-image-slot {
      min-height: 300px;
    }
  }

  @media (max-width: 640px) {
    .hero,
    .info-section,
    .cards-section,
    .team-section {
      padding-inline: 16px;
    }

    .hero-actions a {
      width: 100%;
    }
  }
</style>