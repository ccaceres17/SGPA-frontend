<script>
  import Header from '$lib/components/Header_St.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import DashboardStats from '$lib/components/Projects.svelte';
  import SideBar from '$lib/components/CoordinatorSideBar.svelte';
  import ProjectCardsDataTable from '$lib/components/ProjectCardDatatable.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  export let data;

  $: rows = data?.rows || [];
  $: error = data?.error;

  $: stats = [
    {
      label: t('pages.coordinatorProjects.totalProjects'),
      value: data?.totalProjects || 0,
      icon: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
      bgColor: 'var(--sgpa-blue-soft)',
      color: 'var(--sgpa-blue)'
    },
    {
      label: t('pages.coordinatorProjects.visibleRecords'),
      value: rows.length,
      icon: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>`,
      bgColor: 'var(--sgpa-yellow-soft)',
      color: 'var(--sgpa-warning)'
    }
  ];
</script>

<Header />
<SideBar />

<main>
  <div class="content-wrapper">
    <header class="main-header">
      <div class="header-copy">
        <span class="eyebrow">{t('sidebar.coordinatorModuleLabel')}</span>
        <h1>{t('pages.coordinatorProjects.managementHeading')}</h1>
        <p>{t('pages.coordinatorProjects.managementDescription')}</p>
      </div>

      <div class="header-actions">
        <a class="report-btn" href="/coordinator/projects/report" target="_blank" rel="noopener noreferrer">
          {t('pages.coordinatorProjects.pdfReport')}
        </a>

        <a class="add-btn" href="/coordinator/projects/create">
          {t('pages.coordinatorProjects.addProject')}
        </a>
      </div>
    </header>

    {#if error}
      <div class="error-msg">⚠️ {error}</div>
    {/if}

    <DashboardStats {stats} />

    <section class="list-section">
      <div class="section-title">
        <div>
          <span class="section-kicker">{t('ui.list')}</span>
          <h2>{t('pages.coordinatorProjects.heading')}</h2>
          <p>{t('pages.coordinatorProjects.description')}</p>
        </div>

        <span class="badge">{rows.length} {t('ui.records')}</span>
      </div>

      <ProjectCardsDataTable
        {rows}
        title={t('sidebar.projects')}
        badgeColor="#0d468d"
        emptyMessage={t('pages.coordinatorProjects.emptyMessage')}
        searchPlaceholder={t('pages.coordinatorProjects.searchPlaceholder')}
      />
    </section>
  </div>
</main>

<Footer />

<style>
  main {
    min-height: 80vh;
    padding: 2rem 1rem 3rem;
  }

  .content-wrapper {
    max-width: 1180px;
    margin: 0 auto;
  }

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    margin-bottom: 1.4rem;
    padding: 1.6rem;
    border-radius: 28px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-md);
  }

  .header-actions {
    flex: 0 0 auto;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
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

  .main-header h1 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  .main-header p {
    max-width: 720px;
    margin: 0.7rem 0 0;
    color: var(--sgpa-text-soft);
    line-height: 1.7;
  }

  .report-btn,
  .add-btn {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0.72rem 1.12rem;
    border-radius: 999px;
    font-weight: 950;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    letter-spacing: 0.01em;
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      background 0.22s ease,
      border-color 0.22s ease;
  }

  .report-btn {
    background: var(--sgpa-accent-start);
    color: var(--sgpa-on-accent);
    border: 1px solid rgba(11, 45, 105, 0.22);
    box-shadow: 0 14px 28px rgba(11, 45, 105, 0.18);
  }

  .report-btn::before {
    content: 'PDF';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 24px;
    padding: 0 0.38rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    color: var(--sgpa-on-accent);
    font-size: 0.68rem;
    font-weight: 950;
    letter-spacing: 0.04em;
  }

  .report-btn:hover {
    transform: translateY(-1px);
    background: var(--sgpa-accent-hover);
    border-color: rgba(11, 45, 105, 0.34);
    box-shadow: 0 18px 34px rgba(11, 45, 105, 0.24);
  }

  .add-btn {
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    border: 1px solid rgba(242, 183, 5, 0.38);
    box-shadow: 0 10px 22px rgba(11, 45, 105, 0.08);
  }

  .add-btn::before {
    content: '+';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: var(--sgpa-blue);
    color: var(--sgpa-on-accent);
    font-size: 1rem;
    font-weight: 950;
    line-height: 1;
  }

  .add-btn:hover {
    transform: translateY(-1px);
    background: var(--sgpa-yellow-soft);
    border-color: rgba(242, 183, 5, 0.55);
    box-shadow: 0 14px 28px rgba(11, 45, 105, 0.12);
  }

  .list-section {
    margin-top: 1.25rem;
  }

  .section-title {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .section-kicker {
    display: block;
    margin-bottom: 0.25rem;
    color: var(--sgpa-blue);
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .section-title h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: 1.5rem;
    font-weight: 950;
  }

  .section-title p {
    margin: 0.35rem 0 0;
    color: var(--sgpa-text-soft);
  }

  .badge {
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    border: 1px solid rgba(11, 45, 105, 0.12);
    font-size: 0.84rem;
    font-weight: 950;
  }

  :global(.datatable-table th) {
    display: none;
  }

  :global(.datatable-table td) {
    padding: 0;
    border: none;
    background: transparent;
  }

  :global(.datatable-table tr) {
    display: block;
    margin-bottom: 1.15rem;
  }

  :global(.project-card) {
    background: var(--sgpa-surface);
    border-radius: 24px;
    border: 1px solid var(--sgpa-border);
    border-left: 6px solid var(--sgpa-blue);
    padding: 1.45rem;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    align-items: center;
    box-shadow: var(--sgpa-shadow-sm);
    flex-wrap: wrap;
  }

  :global(.project-card:hover) {
    box-shadow: var(--sgpa-shadow-md);
    border-color: rgba(11, 45, 105, 0.18);
  }

  :global(.project-card__left) {
    display: flex;
    gap: 1.2rem;
    align-items: flex-start;
    flex: 1;
    min-width: 260px;
  }

  :global(.project-card__icon) {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    display: grid;
    place-items: center;
    font-size: 1.8rem;
    flex-shrink: 0;
  }

  :global(.project-card__content h3) {
    margin: 0 0 0.55rem;
    color: var(--sgpa-blue-dark);
    font-size: clamp(1.3rem, 2vw, 1.75rem);
    font-weight: 950;
    letter-spacing: -0.035em;
  }

  :global(.project-card__content p) {
    margin: 0 0 0.85rem;
    color: var(--sgpa-text-soft);
    font-size: 0.97rem;
    line-height: 1.65;
  }

  :global(.project-card__meta) {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    color: var(--sgpa-text-soft);
    font-size: 0.95rem;
    line-height: 1.5;
  }

  :global(.project-card__right) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.neutral-badge) {
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    padding: 0.55rem 0.9rem;
    border-radius: 999px;
    font-weight: 900;
    font-size: 0.84rem;
    display: inline-flex;
    border: 1px solid rgba(11, 45, 105, 0.12);
  }

  @media (max-width: 760px) {
    .main-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .header-actions,
    .report-btn,
    .add-btn {
      width: 100%;
    }

    :global(.project-card) {
      align-items: flex-start;
      flex-direction: column;
    }

    :global(.project-card__left) {
      flex-direction: column;
    }
  }
</style>