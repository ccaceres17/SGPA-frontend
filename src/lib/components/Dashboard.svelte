<script>
  import { t } from '$lib/stores/locale.svelte.js';
  import StatusBadge from '$lib/components/StatusBadge.svelte';

  let {
    eyebrow = 'Main panel',
    title = 'SGPA dashboard',
    description = 'Check the main information of the academic project management system.',
    stats = { active: 0, pending: 0, completed: 0, cancelled: 0, other: 0 },
    extraStat = null,
    recentProjects = [],
    error = ''
  } = $props();
</script>

<main class="dashboard-page">
  <section class="dashboard-shell">
    <header class="page-header">
      <span class="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>

    {#if error}
      <div class="error-msg">⚠️ {error}</div>
    {/if}

    <section class="stats-section" aria-label={t('dashboard.stats.heading')}>
      <h2 class="section-heading">{t('dashboard.stats.heading')}</h2>

      <div class="stats-grid">
        <div class="stat-tile">
          <strong>{stats.active}</strong>
          <span>{t('dashboard.stats.activeProjects')}</span>
        </div>

        <div class="stat-tile">
          <strong>{stats.pending}</strong>
          <span>{t('dashboard.stats.pendingProjects')}</span>
        </div>

        <div class="stat-tile">
          <strong>{stats.completed}</strong>
          <span>{t('dashboard.stats.completedProjects')}</span>
        </div>

        {#if extraStat}
          <div class="stat-tile">
            <strong>{extraStat.value}</strong>
            <span>{t(extraStat.labelKey)}</span>
          </div>
        {/if}
      </div>
    </section>

    <section class="recent-section" aria-label={t('dashboard.recentProjects.heading')}>
      <h2 class="section-heading">{t('dashboard.recentProjects.heading')}</h2>

      {#if recentProjects.length > 0}
        <div class="table-wrap">
          <table class="recent-table">
            <thead>
              <tr>
                <th>{t('dashboard.recentProjects.project')}</th>
                <th>{t('dashboard.recentProjects.owner')}</th>
                <th>{t('dashboard.recentProjects.researchGroup')}</th>
                <th>{t('dashboard.recentProjects.status')}</th>
                <th>{t('dashboard.recentProjects.startDate')}</th>
                <th class="action-heading">{t('dashboard.recentProjects.action')}</th>
              </tr>
            </thead>

            <tbody>
              {#each recentProjects as project}
                <tr>
                  <td>{project.project_name}</td>
                  <td>{project.teacherName || t('dashboard.recentProjects.unassigned')}</td>
                  <td>
                    {project.researchGroup?.name ?? t('researchGroups.unknown')}
                    {#if project.researchGroup?.isDemo}
                      <em class="demo-tag">({t('researchGroups.demoLabel')})</em>
                    {/if}
                  </td>
                  <td><StatusBadge category={project.statusCategory} label={project.statusLabel} /></td>
                  <td>{project.startDate || '—'}</td>
                  <td class="action-cell">
                    {#if project.viewHref}
                      <a href={project.viewHref} class="table-action">{t('ui.view')}</a>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="empty-state">{t('dashboard.recentProjects.emptyMessage')}</div>
      {/if}
    </section>
  </section>
</main>

<style>
  .dashboard-page {
    min-height: 80vh;
    padding: 1.75rem 1rem 3rem;
  }

  .dashboard-shell {
    width: min(1180px, 100%);
    margin: 0 auto;
    display: grid;
    gap: 1.5rem;
  }

  .page-header {
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--sgpa-border);
  }

  .eyebrow {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 0.6rem;
    padding: 0.35rem 0.75rem;
    border-radius: 8px;
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .page-header h1 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 900;
    letter-spacing: -0.02em;
  }

  .page-header p {
    max-width: 720px;
    margin: 0.55rem 0 0;
    color: var(--sgpa-text-soft);
    font-size: 1rem;
    line-height: 1.6;
  }

  .section-heading {
    margin: 0 0 0.9rem;
    color: var(--sgpa-blue-dark);
    font-size: 1.05rem;
    font-weight: 900;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.9rem;
  }

  .stat-tile {
    display: grid;
    gap: 0.3rem;
    padding: 1rem;
    border-radius: 12px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
  }

  .stat-tile strong {
    color: var(--sgpa-blue);
    font-size: 1.75rem;
    font-weight: 900;
    line-height: 1;
  }

  .stat-tile span {
    color: var(--sgpa-text-soft);
    font-size: 0.82rem;
    font-weight: 700;
  }

  .table-wrap {
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    border-radius: 12px;
    overflow-x: auto;
  }

  .recent-table {
    width: 100%;
    border-collapse: collapse;
  }

  .recent-table th {
    background: var(--sgpa-surface-soft);
    color: var(--sgpa-blue-dark);
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.8rem;
    font-weight: 800;
    border-bottom: 1px solid var(--sgpa-border);
    white-space: nowrap;
  }

  .recent-table td {
    padding: 0.75rem 1rem;
    color: var(--sgpa-text);
    border-bottom: 1px solid var(--sgpa-border);
    font-size: 0.92rem;
  }

  .recent-table tbody tr:last-child td {
    border-bottom: none;
  }

  .recent-table tbody tr:hover {
    background: var(--sgpa-surface-soft);
  }

  .demo-tag {
    color: var(--sgpa-text-soft);
    font-size: 0.76rem;
    font-style: normal;
  }

  .action-heading,
  .action-cell {
    text-align: right;
  }

  .table-action {
    color: var(--sgpa-link);
    font-weight: 800;
    text-decoration: none;
  }

  .table-action:hover {
    text-decoration: underline;
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--sgpa-text-soft);
    background: var(--sgpa-surface);
    border: 1px dashed var(--sgpa-border-strong);
    border-radius: 12px;
  }

  .error-msg {
    padding: 0.9rem 1rem;
  }

  @media (max-width: 900px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .dashboard-page {
      padding: 1.2rem 0.8rem 2.2rem;
    }
  }
</style>
