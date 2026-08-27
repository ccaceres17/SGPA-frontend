<script>
  export let roleName = 'SGPA';
  export let eyebrow = 'Main panel';
  export let title = 'SGPA dashboard';
  export let description = 'Check the main information of the academic project management system.';

  const quickCards = [
    {
      label: 'Academic management',
      text: 'Organize projects, users, and academic processes from one place.'
    },
    {
      label: 'Visual tracking',
      text: 'Review indicators and reports while keeping a clear system structure.'
    },
    {
      label: 'Role-based access',
      text: 'Each module keeps its own navigation, permissions, and workflow.'
    }
  ];
</script>

<main class="dashboard-page">
  <section class="dashboard-shell">
    <div class="hero-card">
      <div class="hero-content">
        <span class="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div class="role-card" aria-label="Active role">
        <span>Active role</span>
        <strong>{roleName}</strong>
      </div>
    </div>

    <section class="quick-grid" aria-label="System overview">
      {#each quickCards as card}
        <article class="quick-card">
          <span class="quick-dot"></span>
          <h2>{card.label}</h2>
          <p>{card.text}</p>
        </article>
      {/each}
    </section>

    <section class="report-card">
      <div class="report-header">
        <div>
          <span class="eyebrow dark">Integrated report</span>
          <h2>System overview</h2>
        </div>

        <span class="report-badge">Power BI</span>
      </div>

      <div class="iframe-wrap">
        <iframe
          title="Academic project management dashboard"
          src="https://app.powerbi.com/reportEmbed?reportId=b94b4a99-28d8-4866-826f-0f59ec21f874&autoAuth=true&ctid=740be6bd-fd36-470e-94d9-0f0c777fadb9"
          frameborder="0"
          allowfullscreen="true"
        ></iframe>
      </div>
    </section>
  </section>
</main>

<style>
  .dashboard-page {
    min-height: 80vh;
    padding: 2rem 1rem 3rem;
    background:
      radial-gradient(circle at top right, rgba(242, 183, 5, 0.12), transparent 22rem),
      linear-gradient(180deg, #ffffff 0%, var(--sgpa-bg) 100%);
  }

  .dashboard-shell {
    width: min(1180px, 100%);
    margin: 0 auto;
  }

  .hero-card {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 1.25rem;
    align-items: stretch;
    padding: clamp(1.4rem, 3vw, 2.4rem);
    border-radius: 28px;
    color: var(--sgpa-text);
    background:
      radial-gradient(circle at top right, rgba(242, 183, 5, 0.18), transparent 18rem),
      linear-gradient(135deg, #ffffff 0%, var(--sgpa-blue-soft) 100%);
    box-shadow: var(--sgpa-shadow-lg);
    border: 1px solid var(--sgpa-border);
  }

  .hero-card::before {
    content: '';
    position: absolute;
    width: 260px;
    height: 260px;
    right: -90px;
    top: -110px;
    border-radius: 999px;
    background: rgba(11, 45, 105, 0.08);
    filter: blur(10px);
  }

  .hero-content,
  .role-card {
    position: relative;
    z-index: 1;
  }

  .eyebrow {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 0.75rem;
    padding: 0.42rem 0.8rem;
    border-radius: 999px;
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid rgba(242, 183, 5, 0.28);
  }

  .eyebrow.dark {
    margin-bottom: 0.45rem;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    border-color: rgba(11, 45, 105, 0.12);
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  .hero-content h1 {
    max-width: 720px;
    color: var(--sgpa-blue-dark);
    font-size: clamp(2rem, 4vw, 3.4rem);
    font-weight: 950;
    letter-spacing: -0.04em;
    line-height: 1.02;
  }

  .hero-content p {
    max-width: 720px;
    margin-top: 1rem;
    color: var(--sgpa-text-soft);
    font-size: 1.03rem;
    line-height: 1.7;
  }

  .role-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 190px;
    padding: 1.25rem;
    border-radius: 22px;
    background: #ffffff;
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
  }

  .role-card span {
    color: var(--sgpa-text-soft);
    font-size: 0.88rem;
    font-weight: 850;
  }

  .role-card strong {
    margin-top: 0.35rem;
    color: var(--sgpa-blue);
    font-size: 1.45rem;
  }

  .quick-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 1.2rem 0;
  }

  .quick-card,
  .report-card {
    background: #ffffff;
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
  }

  .quick-card {
    border-radius: 22px;
    padding: 1.25rem;
  }

  .quick-dot {
    display: inline-flex;
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: var(--sgpa-yellow);
    box-shadow: 0 0 0 6px rgba(242, 183, 5, 0.14);
    margin-bottom: 1rem;
  }

  .quick-card h2 {
    margin-bottom: 0.5rem;
    color: var(--sgpa-blue);
    font-size: 1.05rem;
    font-weight: 950;
  }

  .quick-card p {
    color: var(--sgpa-text-soft);
    line-height: 1.6;
  }

  .report-card {
    border-radius: 26px;
    overflow: hidden;
  }

  .report-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    padding: 1.3rem;
    border-bottom: 1px solid var(--sgpa-border);
  }

  .report-header h2 {
    color: var(--sgpa-blue-dark);
    font-weight: 950;
  }

  .report-badge {
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    color: var(--sgpa-blue);
    background: var(--sgpa-blue-soft);
    font-weight: 900;
  }

  .iframe-wrap {
    background: var(--sgpa-bg);
    padding: 1rem;
  }

  iframe {
    width: 100%;
    min-height: 460px;
    border: 0;
    border-radius: 18px;
    background: #ffffff;
  }

  @media (max-width: 900px) {
    .hero-card,
    .quick-grid {
      grid-template-columns: 1fr;
    }

    iframe {
      min-height: 360px;
    }
  }

  @media (max-width: 640px) {
    .dashboard-page {
      padding: 1.2rem 0.8rem 2.2rem;
    }

    .report-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>