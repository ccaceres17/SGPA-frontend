<script>
  import Icon from '$lib/components/icons/Icon.svelte';
  import Header from '$lib/components/Header_St.svelte';
  import SideBar from '$lib/components/CoordinatorSideBar.svelte';
  import CoordinatorUsersDataTable from '$lib/components/CoordinatorUsersDataTable.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  export let data;
  export let form;

  $: users = data?.users || [];
  $: error = form?.error || data?.error || '';
  $: successMessage =
    form?.message ||
    (form?.invitationResent
      ? form.emailDelivered
        ? t('ui.invitationResent')
        : t('ui.invitationNotSent')
      : '');
</script>

<Header />
<SideBar />

<main>
  <div class="content-wrapper">
    <section class="report-action-card">
      <div>
        <span class="eyebrow">{t('sidebar.coordinatorModuleLabel')}</span>
        <h2>{t('pages.coordinatorStudents.heading')}</h2>
        <p>{t('pages.coordinatorStudents.description')}</p>
      </div>

      <div class="header-actions">
        <a class="report-btn" href="/coordinator/students/report" target="_blank" rel="noopener noreferrer">
          <Icon name="file-text" size={15} /> {t('pages.coordinatorStudents.pdfReport')}
        </a>

        <span class="header-label">{t('sidebar.students')}</span>
      </div>
    </section>

    {#if successMessage}
      <div class="success-box"><Icon name="check-circle" size={16} /> {successMessage}</div>
    {/if}

    {#if error}
      <div class="error-msg"><Icon name="alert-triangle" size={16} /> {error}</div>
    {/if}

    <CoordinatorUsersDataTable
      {users}
      {form}
      title={t('sidebar.students')}
      subtitle={t('pages.coordinatorStudents.tableSubtitle')}
      searchPlaceholder={t('pages.coordinatorStudents.searchPlaceholder')}
      emptyMessage={t('pages.coordinatorStudents.emptyMessage')}
      userType="students"
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

  .report-action-card {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    flex-wrap: wrap;
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

  .report-action-card h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  .report-action-card p {
    max-width: 720px;
    margin: 0.6rem 0 0;
    color: var(--sgpa-text-soft);
    line-height: 1.65;
  }

  .header-actions {
    flex: 0 0 auto;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .report-btn {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0.72rem 1.08rem;
    border-radius: 999px;
    background: var(--sgpa-accent-start);
    color: var(--sgpa-on-accent);
    border: 1px solid rgba(11, 45, 105, 0.18);
    font-weight: 950;
    box-shadow: 0 12px 24px rgba(11, 45, 105, 0.16);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      background 0.22s ease,
      border-color 0.22s ease;
  }

  .report-btn:hover {
    transform: translateY(-1px);
    background: var(--sgpa-accent-hover);
    box-shadow: 0 16px 30px rgba(11, 45, 105, 0.22);
    border-color: rgba(11, 45, 105, 0.3);
  }

  .header-label {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0.72rem 1.05rem;
    border-radius: 999px;
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    border: 1px solid rgba(242, 183, 5, 0.32);
    font-weight: 950;
    box-shadow: var(--sgpa-shadow-sm);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.01em;
  }

  .success-box,
  .error-msg {
    max-width: 1180px;
    margin: 0 auto 1rem;
  }

  @media (max-width: 760px) {
    .report-action-card {
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