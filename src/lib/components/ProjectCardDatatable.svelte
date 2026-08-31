<script>
  import { t } from '$lib/stores/locale.svelte.js';
  import { matchesProjectSearch } from './project-search.js';

  export let rows = [];
  export let title = '';
  export let badgeColor = 'var(--sgpa-blue)';
  export let emptyMessage = '';
  export let searchPlaceholder = '';

  let search = '';
  let currentPage = 1;
  const pageSize = 10;

  $: filteredRows = rows.filter((row) => matchesProjectSearch(row, search));

  $: totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  $: if (currentPage > totalPages) {
    currentPage = 1;
  }

  $: paginatedRows = filteredRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
  }
</script>

<section class="list-section">
  <div class="section-title">
    <div>
      <span class="section-kicker">{t('ui.list')}</span>
      <h2>{title || t('sidebar.projects')}</h2>
    </div>

    <span class="badge" style={`--badge-color:${badgeColor}`}>
      {filteredRows.length} {t('ui.records')}
    </span>
  </div>

  <div class="table-card">
    <div class="table-toolbar">
      <input
        type="text"
        bind:value={search}
        placeholder={searchPlaceholder || t('ui.search')}
        class="search-input"
        aria-label={searchPlaceholder || t('ui.search')}
      />
    </div>

    <div class="projects-wrapper">
      {#if paginatedRows.length > 0}
        {#each paginatedRows as row}
          <article class="project-row">
            {@html row.proyecto_card}
          </article>
        {/each}
      {:else}
        <div class="empty-row">
          <strong>{t('ui.noResults')}</strong>
          <span>{emptyMessage || t('ui.noData')}</span>
        </div>
      {/if}
    </div>

    <div class="table-footer">
      <span>
        {t('ui.showingOfRecords', { shown: paginatedRows.length, total: filteredRows.length })}
      </span>

      <div class="pagination">
        <button
          type="button"
          onclick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {t('ui.previous')}
        </button>

        <span>{t('ui.pageOf', { current: currentPage, total: totalPages })}</span>

        <button
          type="button"
          onclick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {t('ui.next')}
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  .list-section {
    margin-top: 1.25rem;
  }

  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
    margin: 1.4rem 0 1rem;
    flex-wrap: wrap;
  }

  .section-kicker {
    display: inline-flex;
    margin-bottom: 0.35rem;
    color: var(--sgpa-blue);
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .section-title h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: clamp(1.45rem, 3vw, 2rem);
    font-weight: 950;
    letter-spacing: -0.035em;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 34px;
    padding: 0.45rem 0.95rem;
    border-radius: 999px;
    color: var(--sgpa-on-accent);
    background: var(--badge-color, var(--sgpa-blue));
    font-size: 0.82rem;
    font-weight: 900;
    box-shadow: 0 10px 22px rgba(11, 45, 105, 0.16);
  }

  .table-card {
    overflow: hidden;
    border-radius: 26px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-md);
  }

  .table-toolbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.15rem;
    border-bottom: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface-soft);
  }

  .search-input {
    width: min(480px, 100%);
    min-height: 44px;
    padding: 0.86rem 1rem;
    border: 1px solid var(--sgpa-border);
    border-radius: 999px;
    outline: none;
    color: var(--sgpa-text);
    background: var(--sgpa-surface);
    font-size: 0.96rem;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;
  }

  .search-input:focus {
    border-color: var(--sgpa-yellow);
    background: var(--sgpa-surface);
    box-shadow: var(--sgpa-focus);
  }

  .projects-wrapper {
    display: grid;
    gap: 1rem;
    padding: 1rem;
    background: var(--sgpa-bg);
  }

  .project-row {
    display: block;
  }

  .empty-row {
    display: grid;
    place-items: center;
    gap: 0.35rem;
    min-height: 180px;
    padding: 2rem;
    border: 1px dashed var(--sgpa-border-strong);
    border-radius: 20px;
    color: var(--sgpa-muted);
    text-align: center;
    background: var(--sgpa-surface);
  }

  .empty-row strong {
    color: var(--sgpa-blue-dark);
    font-size: 1.1rem;
  }

  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.15rem;
    border-top: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
    color: var(--sgpa-text-soft);
    flex-wrap: wrap;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    flex-wrap: wrap;
  }

  .pagination button {
    min-height: 38px;
    padding: 0.55rem 0.9rem;
    border-radius: 999px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    font-weight: 850;
    cursor: pointer;
  }

  .pagination button:hover {
    background: var(--sgpa-blue-soft);
  }

  .pagination button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .pagination span {
    color: var(--sgpa-text-soft);
    font-weight: 800;
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
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.22s ease;
  }

  :global(.project-card:hover) {
    transform: translateY(-2px);
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
    font-size: clamp(1.25rem, 2vw, 1.7rem);
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

  :global(.project-card__meta strong) {
    color: var(--sgpa-blue-dark);
  }

  :global(.project-card__right) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.inline-form) {
    margin: 0;
  }

  :global(.action-btn) {
    min-height: 42px;
    padding: 0.72rem 1rem;
    border: none;
    border-radius: 999px;
    background: var(--sgpa-accent-start);
    color: var(--sgpa-on-accent);
    font-weight: 900;
    cursor: pointer;
  }

  :global(.action-btn:hover) {
    background: var(--sgpa-accent-hover);
  }

  :global(.joined-badge),
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

  :global(.joined-badge) {
    background: var(--sgpa-success-bg);
    color: var(--sgpa-success);
    border-color: rgba(21, 128, 61, 0.18);
  }

  @media (max-width: 760px) {
    .table-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .search-input {
      width: 100%;
    }

    .table-footer {
      align-items: stretch;
      flex-direction: column;
    }

    .pagination {
      justify-content: space-between;
    }

    :global(.project-card) {
      align-items: flex-start;
      flex-direction: column;
    }

    :global(.project-card__left) {
      flex-direction: column;
    }

    :global(.project-card__right),
    :global(.inline-form),
    :global(.action-btn) {
      width: 100%;
    }
  }
</style>