<script>
  import Icon from '$lib/components/icons/Icon.svelte';
  import Header from '$lib/components/Header_St.svelte';
  import DashboardStats from '$lib/components/Projects.svelte';
  import SideBar from '$lib/components/TeacherSideBar.svelte';
  import ProjectCardsDataTable from '$lib/components/ProjectCardDatatable.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  export let data;

  $: rows = data.rows || [];
  $: error = data.error;

  $: stats = [
    {
      label: t('pages.teacherProjects.heading'),
      value: data.totalProjects || 0,
      iconName: 'folder',
      bgColor: 'var(--sgpa-blue-soft)',
      color: 'var(--sgpa-blue)'
    }
  ];
</script>

<Header />
<SideBar />

<main>
  <div class="content-wrapper">
    <header class="main-header">
      <div>
        <span class="eyebrow">{t('sidebar.teacherModuleLabel')}</span>
        <h1>{t('pages.teacherProjects.heading')}</h1>
        <p>{t('pages.teacherProjects.description')}</p>
      </div>

      <div class="header-actions">
        <a class="report-btn" href="/teacher/projects/report" target="_blank" rel="noopener noreferrer">
          {t('pages.teacherProjects.pdfReport')}
        </a>

        <span class="header-label">{t('pages.teacherProjects.headerLabel')}</span>
      </div>
    </header>

    {#if error}
      <div class="error-msg"><Icon name="alert-triangle" size={16} /> {error}</div>
    {/if}

    <DashboardStats {stats} />

    <ProjectCardsDataTable
      {rows}
      title={t('pages.teacherProjects.heading')}
      badgeColor="var(--sgpa-orange)"
      emptyMessage={t('pages.teacherProjects.emptyMessage')}
      searchPlaceholder={t('pages.teacherProjects.searchPlaceholder')}
    />
  </div>
</main>

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

  .report-btn {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0.72rem 1.12rem;
    border-radius: 999px;
    background: var(--sgpa-accent-start);
    color: var(--sgpa-on-accent);
    border: 1px solid rgba(11, 45, 105, 0.22);
    font-weight: 950;
    box-shadow: 0 14px 28px rgba(11, 45, 105, 0.18);
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

  .header-label {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0.72rem 1.08rem;
    border-radius: 999px;
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    border: 1px solid rgba(242, 183, 5, 0.38);
    font-weight: 950;
    box-shadow: 0 10px 22px rgba(11, 45, 105, 0.08);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.01em;
  }

  .error-msg {
    margin: 1rem 0;
  }

  @media (max-width: 760px) {
    .main-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .header-actions,
    .report-btn,
    .header-label {
      width: 100%;
    }
  }
</style>