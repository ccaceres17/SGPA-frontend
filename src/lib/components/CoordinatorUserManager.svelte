<script>
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  export let users = [];
  export let title = '';
  export let subtitle = '';
  export let moduleLabel = '';
  export let searchPlaceholder = '';
  export let emptyMessage = '';
  export let userType = 'users';

  let search = '';
  let confirmOpen = false;
  let pendingForm = null;
  let allowSubmit = false;

  let modalTitle = '';
  let modalMessage = '';
  let modalDetails = '';
  let modalConfirmText = '';
  let modalVariant = 'warning';

  $: filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      fullName(user),
      user.email,
      user.phone_number,
      user.phone,
      user.is_active ? 'active' : 'inactive',
      user.is_active ? 'enabled' : 'disabled'
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  $: activeCount = users.filter((user) => Boolean(user.is_active)).length;
  $: inactiveCount = users.length - activeCount;

  function fullName(user) {
    return `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || t('ui.unnamedUser');
  }

  function initials(user) {
    const first = String(user?.first_name || '').trim()[0] || '';
    const last = String(user?.last_name || '').trim()[0] || '';

    return `${first}${last}`.toUpperCase() || 'U';
  }

  function openConfirmModal(event, user) {
    if (allowSubmit) {
      allowSubmit = false;
      return;
    }

    event.preventDefault();

    const willEnable = !user.is_active;
    const singularType = userType.endsWith('s') ? userType.slice(0, -1) : userType;

    pendingForm = event.currentTarget;
    modalTitle = willEnable
      ? t('ui.enableQuestion', { type: singularType })
      : t('ui.disableQuestion', { type: singularType });
    modalMessage = willEnable ? t('ui.enableUserMessage') : t('ui.disableUserMessage');
    modalDetails = `${fullName(user)} | ${user.email || t('ui.noEmailRegistered')}`;
    modalConfirmText = willEnable ? t('ui.enableUser') : t('ui.disableUser');
    modalVariant = willEnable ? 'success' : 'danger';
    confirmOpen = true;
  }

  function closeConfirm() {
    confirmOpen = false;
    pendingForm = null;
  }

  function confirmAction() {
    if (!pendingForm) {
      closeConfirm();
      return;
    }

    const formToSubmit = pendingForm;

    confirmOpen = false;
    pendingForm = null;
    allowSubmit = true;

    formToSubmit.requestSubmit();
  }
</script>

<section class="users-shell">
  <header class="main-header">
    <div>
      <span class="eyebrow">{moduleLabel}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>

    <div class="summary-pills">
      <span>{users.length} {t('ui.total')}</span>
      <span>{activeCount} {t('ui.active')}</span>
      <span>{inactiveCount} {t('ui.inactive').toLowerCase()}</span>
    </div>
  </header>

  <section class="toolbar-card">
    <div class="search-wrap">
      <span>⌕</span>
      <input
        bind:value={search}
        type="search"
        placeholder={searchPlaceholder || t('ui.search')}
        aria-label={t('ui.search')}
      />
    </div>
  </section>

  <section class="users-card">
    {#if filteredUsers.length > 0}
      <div class="users-grid">
        {#each filteredUsers as user}
          <article class="user-card" class:inactive={!user.is_active}>
            <div class="user-main">
              <div class="avatar" class:inactive={!user.is_active}>
                {initials(user)}
              </div>

              <div class="user-copy">
                <div class="user-title-row">
                  <h2>{fullName(user)}</h2>

                  <span class="status-pill" class:inactive={!user.is_active}>
                    {user.is_active ? t('ui.activeStatus') : t('ui.inactive')}
                  </span>
                </div>

                <p>{user.email || t('ui.noEmailRegistered')}</p>

                <div class="user-meta">
                  <span><strong>ID:</strong> {user.id_user}</span>
                  <span><strong>{t('ui.phone')}:</strong> {user.phone_number || user.phone || t('ui.notRegistered')}</span>
                </div>
              </div>
            </div>

            <div class="user-actions">
              <form method="POST" action="?/toggleStatus" on:submit={(event) => openConfirmModal(event, user)}>
                <input type="hidden" name="id_user" value={user.id_user} />
                <input type="hidden" name="is_active" value={user.is_active ? 'false' : 'true'} />

                <button
                  type="submit"
                  class:user-enable={!user.is_active}
                  class:user-disable={user.is_active}
                >
                  {user.is_active ? t('ui.disableUser') : t('ui.enableUser')}
                </button>
              </form>
            </div>
          </article>
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <div>📭</div>
        <h2>{emptyMessage || t('ui.noData')}</h2>
        <p>{t('ui.noRecordsMatch')}</p>
      </div>
    {/if}
  </section>
</section>

<ConfirmModal
  open={confirmOpen}
  title={modalTitle}
  message={modalMessage}
  details={modalDetails}
  confirmText={modalConfirmText}
  cancelText={t('ui.cancel')}
  variant={modalVariant}
  onCancel={closeConfirm}
  onConfirm={confirmAction}
/>

<style>
  .users-shell {
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

  .summary-pills {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .summary-pills span {
    padding: 0.5rem 0.85rem;
    border-radius: 999px;
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border: 1px solid var(--sgpa-border);
    font-size: 0.82rem;
    font-weight: 950;
    box-shadow: var(--sgpa-shadow-sm);
  }

  .toolbar-card {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 24px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
  }

  .search-wrap {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: min(100%, 560px);
    min-height: 48px;
    padding: 0 1rem;
    border-radius: 999px;
    background: var(--sgpa-bg);
    border: 1px solid var(--sgpa-border);
  }

  .search-wrap span {
    color: var(--sgpa-blue);
    font-weight: 950;
    font-size: 1.15rem;
  }

  .search-wrap input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: var(--sgpa-blue-dark);
    font-size: 0.96rem;
    font-weight: 750;
  }

  .search-wrap input::placeholder {
    color: var(--sgpa-text-soft);
  }

  .users-card {
    padding: 1.2rem;
    border-radius: 28px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-md);
  }

  .users-grid {
    display: grid;
    gap: 1rem;
  }

  .user-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.2rem;
    padding: 1.15rem;
    border-radius: 24px;
    border: 1px solid var(--sgpa-border);
    border-left: 6px solid var(--sgpa-success, #15803d);
    background: var(--sgpa-surface);
    box-shadow: var(--sgpa-shadow-sm);
  }

  .user-card.inactive {
    border-left-color: var(--sgpa-danger, #dc2626);
    background: var(--sgpa-danger-bg, #fee2e2);
  }

  .user-main {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
  }

  .avatar {
    width: 58px;
    height: 58px;
    border-radius: 18px;
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
    color: #b91c1c;
    border-color: #fecaca;
  }

  .user-copy {
    min-width: 0;
  }

  .user-title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .user-copy h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: 1.25rem;
    font-weight: 950;
    letter-spacing: -0.03em;
  }

  .user-copy p {
    margin: 0.35rem 0 0;
    color: var(--sgpa-text-soft);
    line-height: 1.55;
    word-break: break-word;
  }

  .status-pill {
    display: inline-flex;
    width: fit-content;
    padding: 0.34rem 0.72rem;
    border-radius: 999px;
    color: #166534;
    background: #dcfce7;
    border: 1px solid #bbf7d0;
    font-size: 0.78rem;
    font-weight: 950;
  }

  .status-pill.inactive {
    color: #991b1b;
    background: #fee2e2;
    border-color: #fecaca;
  }

  .user-meta {
    display: flex;
    gap: 0.9rem;
    flex-wrap: wrap;
    margin-top: 0.65rem;
    color: var(--sgpa-text-soft);
    font-size: 0.9rem;
  }

  .user-meta strong {
    color: var(--sgpa-blue-dark);
  }

  .user-actions {
    flex: 0 0 auto;
  }

  .user-actions button {
    min-height: 42px;
    padding: 0.72rem 1rem;
    border-radius: 999px;
    border: none;
    color: #ffffff;
    font-weight: 950;
    cursor: pointer;
  }

  .user-actions button:hover {
    transform: translateY(-1px);
  }

  .user-disable {
    background: var(--sgpa-danger, #dc2626);
  }

  .user-enable {
    background: var(--sgpa-success, #15803d);
  }

  .empty-state {
    padding: 2rem;
    border-radius: 24px;
    background: var(--sgpa-bg);
    border: 1px dashed var(--sgpa-border);
    text-align: center;
  }

  .empty-state div {
    font-size: 2.2rem;
    margin-bottom: 0.75rem;
  }

  .empty-state h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-weight: 950;
  }

  .empty-state p {
    margin: 0.5rem 0 0;
    color: var(--sgpa-text-soft);
  }

  @media (max-width: 780px) {
    .main-header,
    .user-card {
      align-items: flex-start;
      flex-direction: column;
    }

    .summary-pills,
    .user-actions,
    .user-actions form,
    .user-actions button {
      width: 100%;
    }

    .user-main {
      align-items: flex-start;
    }
  }

  @media (max-width: 560px) {
    .users-card {
      padding: 0.8rem;
    }

    .user-main {
      flex-direction: column;
    }
  }
</style>