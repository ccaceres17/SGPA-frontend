<script>
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import { createConfirmFlow } from '$lib/client/confirmFlow.svelte.js';
  import { t } from '$lib/stores/locale.svelte.js';

  export let users = [];
  export let form = null;
  export let title = '';
  export let subtitle = '';
  export let searchPlaceholder = '';
  export let emptyMessage = '';
  export let userType = 'users';

  let search = '';
  let page = 1;
  const pageSize = 10;

  const confirm = createConfirmFlow();

  function boolValue(value) {
    return value === true || String(value).trim().toLowerCase() === 'true';
  }

  function fullName(user) {
    return `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || t('ui.unnamedUser');
  }

  function initials(user) {
    const first = String(user?.first_name || '').trim()[0] || '';
    const last = String(user?.last_name || '').trim()[0] || '';

    return `${first}${last}`.toUpperCase() || 'U';
  }

  function statusText(user) {
    return user.is_active ? t('ui.activeStatus') : t('ui.inactive');
  }

  function openConfirmModal(event, user) {
    const nextStatus = !user.is_active;
    const singularType = userType.endsWith('s') ? userType.slice(0, -1) : userType;

    confirm.request(event, {
      title: nextStatus
        ? t('ui.enableQuestion', { type: singularType })
        : t('ui.disableQuestion', { type: singularType }),
      message: nextStatus ? t('ui.enableUserMessage') : t('ui.disableUserMessage'),
      details: `${fullName(user)} | ${user.email || t('ui.noEmailRegistered')}`,
      confirmText: nextStatus ? t('ui.enableUser') : t('ui.disableUser'),
      variant: nextStatus ? 'success' : 'danger'
    });
  }

  function resetPage() {
    page = 1;
  }

  $: visualUserId = Number(form?.visualUserId || 0);
  $: hasVisualOverride = Boolean(visualUserId);
  $: visualIsActive = boolValue(form?.visualIsActive);

  $: displayedUsers = users.map((user) => {
    if (hasVisualOverride && Number(user.id_user) === visualUserId) {
      return {
        ...user,
        is_active: visualIsActive
      };
    }

    return user;
  });

  $: filteredUsers = displayedUsers.filter((user) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      fullName(user),
      user.email,
      user.phone_number,
      user.phone,
      statusText(user),
      user.id_user
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  $: totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  $: if (page > totalPages) page = totalPages;

  $: start = (page - 1) * pageSize;
  $: end = start + pageSize;
  $: paginatedUsers = filteredUsers.slice(start, end);

  $: activeCount = displayedUsers.filter((user) => Boolean(user.is_active)).length;
  $: inactiveCount = displayedUsers.length - activeCount;
</script>

<section class="datatable-shell">
  <header class="section-header">
    <div>
      <span class="eyebrow">{t('sidebar.coordinatorModuleLabel')}</span>
      <h1>{title || t('ui.users')}</h1>
      <p>{subtitle}</p>
    </div>

    <div class="stats">
      <span>{displayedUsers.length} {t('ui.total')}</span>
      <span>{activeCount} {t('ui.active')}</span>
      <span>{inactiveCount} {t('ui.inactive').toLowerCase()}</span>
    </div>
  </header>

  <section class="table-card">
    <div class="table-toolbar">
      <div class="search-box">
        <span>⌕</span>
        <input
          bind:value={search}
          on:input={resetPage}
          type="search"
          placeholder={searchPlaceholder || t('ui.search')}
          aria-label={t('ui.search')}
        />
      </div>

      <span class="records-pill">
        {t('ui.showingOfRange', {
          start: filteredUsers.length === 0 ? 0 : start + 1,
          end: Math.min(end, filteredUsers.length),
          total: filteredUsers.length
        })}
      </span>
    </div>

    {#if paginatedUsers.length > 0}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t('ui.name')}</th>
              <th>{t('ui.email')}</th>
              <th>{t('ui.phone')}</th>
              <th>{t('ui.status')}</th>
              <th class="action-heading">{t('ui.actions')}</th>
            </tr>
          </thead>

          <tbody>
            {#each paginatedUsers as user}
              <tr class:inactive-row={!user.is_active}>
                <td>
                  <div class="user-cell">
                    <div class="avatar" class:inactive={!user.is_active}>
                      {initials(user)}
                    </div>

                    <div>
                      <strong>{fullName(user)}</strong>
                      <span>ID: {user.id_user}</span>
                    </div>
                  </div>
                </td>

                <td>{user.email || t('ui.noEmailRegistered')}</td>

                <td>{user.phone_number || user.phone || t('ui.notRegistered')}</td>

                <td>
                  <span class="status-badge" class:inactive={!user.is_active}>
                    {statusText(user)}
                  </span>
                </td>

                <td class="action-cell">
                  <form method="POST" action="?/toggleStatus" on:submit={(event) => openConfirmModal(event, user)}>
                    <input type="hidden" name="id_user" value={user.id_user} />
                    <input type="hidden" name="is_active" value={user.is_active ? 'false' : 'true'} />

                    <button
                      type="submit"
                      class:enable-btn={!user.is_active}
                      class:disable-btn={user.is_active}
                    >
                      {user.is_active ? t('ui.disable') : t('ui.enable')}
                    </button>
                  </form>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <footer class="pagination">
        <span>
          {t('ui.pageOf', { current: page, total: totalPages })}
        </span>

        <div class="pagination-actions">
          <button type="button" on:click={() => (page = Math.max(1, page - 1))} disabled={page === 1}>
            {t('ui.previous')}
          </button>

          <button type="button" on:click={() => (page = Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            {t('ui.next')}
          </button>
        </div>
      </footer>
    {:else}
      <section class="empty-state">
        <div>📭</div>
        <h2>{emptyMessage || t('ui.noData')}</h2>
        <p>{t('ui.noRecordsMatch')}</p>
      </section>
    {/if}
  </section>
</section>

<ConfirmModal
  open={confirm.state.open}
  title={confirm.state.title}
  message={confirm.state.message}
  details={confirm.state.details}
  confirmText={confirm.state.confirmText}
  cancelText={t('ui.cancel')}
  variant={confirm.state.variant}
  loading={confirm.state.loading}
  onCancel={confirm.cancel}
  onConfirm={confirm.confirm}
/>

<style>
  .datatable-shell {
    max-width: 1180px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    margin-bottom: 1.2rem;
    padding: 1.5rem;
    border-radius: 28px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-md);
  }

  .eyebrow {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 0.7rem;
    padding: 0.4rem 0.78rem;
    border-radius: 999px;
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    font-size: 0.76rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid rgba(242, 183, 5, 0.28);
  }

  .section-header h1 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  .section-header p {
    max-width: 720px;
    margin: 0.6rem 0 0;
    color: var(--sgpa-text-soft);
    line-height: 1.65;
  }

  .stats {
    display: flex;
    justify-content: flex-end;
    gap: 0.55rem;
    flex-wrap: wrap;
  }

  .stats span {
    padding: 0.48rem 0.8rem;
    border-radius: 999px;
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border: 1px solid var(--sgpa-border);
    font-size: 0.82rem;
    font-weight: 950;
    box-shadow: var(--sgpa-shadow-sm);
  }

  .table-card {
    overflow: hidden;
    border-radius: 28px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-md);
  }

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: min(100%, 560px);
    min-height: 46px;
    padding: 0 1rem;
    border-radius: 999px;
    background: var(--sgpa-bg);
    border: 1px solid var(--sgpa-border);
  }

  .search-box span {
    color: var(--sgpa-blue);
    font-weight: 950;
    font-size: 1.1rem;
  }

  .search-box input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: var(--sgpa-blue-dark);
    font-size: 0.95rem;
    font-weight: 750;
  }

  .records-pill {
    flex: 0 0 auto;
    padding: 0.48rem 0.85rem;
    border-radius: 999px;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    border: 1px solid rgba(11, 45, 105, 0.12);
    font-weight: 950;
    font-size: 0.82rem;
  }

  .table-wrap {
    width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 860px;
  }

  th {
    padding: 0.95rem 1rem;
    background: var(--sgpa-blue);
    color: #ffffff;
    text-align: left;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  td {
    padding: 0.95rem 1rem;
    border-bottom: 1px solid var(--sgpa-border);
    color: var(--sgpa-text-soft);
    vertical-align: middle;
  }

  tbody tr:hover {
    background: var(--sgpa-blue-soft);
  }

  .inactive-row {
    background: rgba(254, 226, 226, 0.32);
  }

  .user-cell {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    min-width: 240px;
  }

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    border: 1px solid rgba(11, 45, 105, 0.12);
    font-weight: 950;
    flex-shrink: 0;
  }

  .avatar.inactive {
    background: #fee2e2;
    color: #991b1b;
    border-color: #fecaca;
  }

  .user-cell strong {
    display: block;
    color: var(--sgpa-blue-dark);
    font-weight: 950;
  }

  .user-cell span {
    display: block;
    margin-top: 0.18rem;
    color: var(--sgpa-text-soft);
    font-size: 0.82rem;
  }

  .status-badge {
    display: inline-flex;
    width: fit-content;
    padding: 0.38rem 0.75rem;
    border-radius: 999px;
    color: #166534;
    background: #dcfce7;
    border: 1px solid #bbf7d0;
    font-size: 0.8rem;
    font-weight: 950;
  }

  .status-badge.inactive {
    color: #991b1b;
    background: #fee2e2;
    border-color: #fecaca;
  }

  .action-heading,
  .action-cell {
    text-align: right;
  }

  .action-cell button {
    min-height: 38px;
    min-width: 104px;
    padding: 0.62rem 0.9rem;
    border-radius: 999px;
    border: none;
    color: #ffffff;
    font-size: 0.84rem;
    font-weight: 950;
    cursor: pointer;
  }

  .action-cell button:hover {
    transform: translateY(-1px);
  }

  .disable-btn {
    background: var(--sgpa-danger, #dc2626);
  }

  .enable-btn {
    background: var(--sgpa-success, #15803d);
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--sgpa-surface);
  }

  .pagination span {
    color: var(--sgpa-text-soft);
    font-weight: 850;
  }

  .pagination-actions {
    display: flex;
    gap: 0.6rem;
  }

  .pagination-actions button {
    min-height: 38px;
    padding: 0.62rem 0.95rem;
    border-radius: 999px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    font-weight: 950;
    cursor: pointer;
  }

  .pagination-actions button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
  }

  .empty-state div {
    font-size: 2rem;
    margin-bottom: 0.7rem;
  }

  .empty-state h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-weight: 950;
  }

  .empty-state p {
    margin: 0.45rem 0 0;
    color: var(--sgpa-text-soft);
  }

  @media (max-width: 820px) {
    .section-header,
    .table-toolbar,
    .pagination {
      align-items: flex-start;
      flex-direction: column;
    }

    .stats,
    .records-pill,
    .pagination-actions,
    .pagination-actions button {
      width: 100%;
    }

    .pagination-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
</style>