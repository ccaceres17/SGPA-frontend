<script>
  import { onMount, tick } from 'svelte';
  import 'simple-datatables/dist/style.css';
  import { t, localeState } from '$lib/stores/locale.svelte.js';

  export let columns = [];
  export let rows = [];
  export let emptyMessage = '';
  export let tableId = 'sgpa-table';
  export let searchable = true;
  export let perPage = 10;
  export let perPageSelect = [10, 20, 30, 50];
  export let searchPlaceholder = '';

  let tableElement;
  let datatable;
  let mounted = false;

  async function initTable() {
    if (!mounted) return;

    await tick();

    const { DataTable } = await import('simple-datatables');

    if (datatable) {
      datatable.destroy();
      datatable = null;
    }

    if (tableElement && rows.length > 0) {
      datatable = new DataTable(tableElement, {
        searchable,
        perPage,
        perPageSelect,
        fixedHeight: false,
        labels: {
          placeholder: searchPlaceholder || t('ui.search'),
          perPage: t('ui.recordsPerPage'),
          noRows: t('ui.noRecordsFound'),
          info: t('ui.showingRecords')
        }
      });
    }
  }

  onMount(async () => {
    mounted = true;
    await initTable();

    return () => {
      if (datatable) {
        datatable.destroy();
      }
    };
  });

  // Re-initializes on row changes and also on locale changes. Locale changes
  // so the underlying (non-Svelte) DataTable's own chrome — search
  // placeholder, pagination labels — picks up translated text when the user
  // toggles language. Row changes so a caller-side filter (Phase 5 search
  // dropdowns) actually takes effect: simple-datatables takes over the DOM
  // on init, so Svelte's {#each rows} alone can't update it afterward — the
  // table must be torn down and rebuilt with the new row set.
  $: if (mounted) {
    void rows;
    void localeState.current;
    initTable();
  }
</script>

<div class="datatable-card">
  <slot name="filters" />

  {#if rows.length > 0}
    <table bind:this={tableElement} id={tableId} class="sgpa-datatable">
      <thead>
        <tr>
          {#each columns as column}
            <th>{column.label}</th>
          {/each}
        </tr>
      </thead>

      <tbody>
        {#each rows as row}
          <tr>
            {#each columns as column}
              <td>
                {#if column.html}
                  {@html row[column.key] ?? ''}
                {:else}
                  {row[column.key] ?? '-'}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="empty-state">{emptyMessage || t('ui.noData')}</div>
  {/if}
</div>

<style>
  .datatable-card {
    background: var(--sgpa-surface);
    border-radius: 24px;
    box-shadow: var(--sgpa-shadow-md);
    overflow: hidden;
    padding: 1rem;
    border: 1px solid var(--sgpa-border);
  }

  .sgpa-datatable {
    width: 100%;
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--sgpa-muted);
    border: 1px dashed var(--sgpa-border-strong);
    border-radius: 18px;
    background: var(--sgpa-surface-soft);
    font-weight: 800;
  }

  :global(.datatable-top) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  :global(.datatable-search) {
    margin: 0;
  }

  :global(.datatable-input) {
    width: 100%;
    min-width: 280px;
    max-width: 420px;
    padding: 0.85rem 1rem;
    border: 1px solid var(--sgpa-border);
    border-radius: 999px;
    outline: none;
    font-size: 0.98rem;
    background: var(--sgpa-surface);
    color: var(--sgpa-text);
  }

  :global(.datatable-input:focus) {
    border-color: var(--sgpa-yellow);
    box-shadow: var(--sgpa-focus);
  }

  :global(.datatable-selector) {
    border: 1px solid var(--sgpa-border);
    border-radius: 12px;
    padding: 0.65rem 0.8rem;
    font-size: 0.95rem;
    background: var(--sgpa-surface);
    color: var(--sgpa-text);
  }

  :global(.datatable-bottom) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  :global(.datatable-info) {
    color: var(--sgpa-text-soft);
    font-size: 0.95rem;
    font-weight: 700;
  }

  :global(.datatable-pagination ul) {
    display: flex;
    gap: 0.4rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  :global(.datatable-pagination li a) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 38px;
    height: 38px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--sgpa-border);
    text-decoration: none;
    color: var(--sgpa-blue);
    background: var(--sgpa-surface);
    font-weight: 850;
  }

  :global(.datatable-pagination li.active a) {
    background: var(--sgpa-blue);
    color: #ffffff;
    border-color: var(--sgpa-blue);
  }

  :global(.datatable-pagination li.disabled a) {
    opacity: 0.45;
    cursor: not-allowed;
  }

  :global(.datatable-table) {
    width: 100%;
    border-collapse: collapse;
  }

  :global(.datatable-table th) {
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue-dark);
    padding: 1rem;
    text-align: left;
    font-weight: 950;
    border-bottom: 1px solid var(--sgpa-border);
  }

  :global(.datatable-table td) {
    padding: 1rem;
    border-bottom: 1px solid var(--sgpa-border);
    color: var(--sgpa-text-soft);
    vertical-align: top;
  }

  :global(.datatable-table tbody tr:hover) {
    background: var(--sgpa-surface-soft);
  }
</style>