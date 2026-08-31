<script>
  import Icon from '$lib/components/icons/Icon.svelte';
  import Header from '$lib/components/Header_St.svelte';
  import SideBar from '$lib/components/TeacherSideBar.svelte';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import { createConfirmFlow } from '$lib/client/confirmFlow.svelte.js';
  import { t } from '$lib/stores/locale.svelte.js';

  export let data;
  export let form;

  const confirm = createConfirmFlow();

  $: slots = data?.slots || [];
  $: loadError = data?.error || '';
  $: days = t('pages.teacherAvailability.days');

  $: errorMessage = form?.errorKey
    ? t(`pages.teacherAvailability.error${form.errorKey.charAt(0).toUpperCase()}${form.errorKey.slice(1)}`)
    : form?.error || '';

  $: successMessage = form?.success ? (form?.deleted ? t('pages.teacherAvailability.slotDeleted') : t('pages.teacherAvailability.slotAdded')) : '';

  function dayName(dayOfWeek) {
    return days[Number(dayOfWeek)] || dayOfWeek;
  }

  function formatTime(value) {
    return String(value || '').slice(0, 5);
  }

  function handleDeleteSubmit(event) {
    confirm.request(event, {
      title: t('pages.teacherAvailability.deleteConfirmTitle'),
      message: t('pages.teacherAvailability.deleteConfirmMessage'),
      confirmText: t('pages.teacherAvailability.deleteConfirmButton'),
      variant: 'danger'
    });
  }
</script>

<Header />
<SideBar />

<main>
  <div class="content-wrapper">
    <header class="main-header">
      <div>
        <span class="eyebrow">{t('sidebar.teacherModuleLabel')}</span>
        <h1>{t('pages.teacherAvailability.heading')}</h1>
        <p>{t('pages.teacherAvailability.description')}</p>
      </div>

      <span class="header-badge">{t('sidebar.availability')}</span>
    </header>

    {#if loadError}
      <div class="error-msg" role="alert"><Icon name="alert-triangle" size={16} /> {loadError}</div>
    {/if}

    {#if successMessage}
      <div class="success-box" role="status"><Icon name="check-circle" size={16} /> {successMessage}</div>
    {/if}

    {#if errorMessage}
      <div class="error-msg" role="alert"><Icon name="alert-triangle" size={16} /> {errorMessage}</div>
    {/if}

    <section class="panel">
      <h2>{t('pages.teacherAvailability.addSlotHeading')}</h2>

      <form method="POST" action="?/addSlot" class="add-slot-form">
        <div class="field">
          <label for="day_of_week">{t('pages.teacherAvailability.dayLabel')}</label>
          <select id="day_of_week" name="day_of_week" required>
            <option value="">{t('pages.teacherAvailability.selectDay')}</option>
            {#each days as day, index}
              <option value={index}>{day}</option>
            {/each}
          </select>
        </div>

        <div class="field">
          <label for="start_time">{t('pages.teacherAvailability.startTimeLabel')}</label>
          <input id="start_time" name="start_time" type="time" required />
        </div>

        <div class="field">
          <label for="end_time">{t('pages.teacherAvailability.endTimeLabel')}</label>
          <input id="end_time" name="end_time" type="time" required />
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-btn">{t('pages.teacherAvailability.addButton')}</button>
        </div>
      </form>
    </section>

    <section class="panel">
      {#if slots.length > 0}
        <div class="slots-list">
          {#each slots as slot (slot.id_availability)}
            <article class="slot-card">
              <div>
                <strong>{dayName(slot.day_of_week)}</strong>
                <span>{formatTime(slot.start_time)} – {formatTime(slot.end_time)}</span>
              </div>

              <form method="POST" action="?/deleteSlot" onsubmit={handleDeleteSubmit}>
                <input type="hidden" name="idAvailability" value={slot.id_availability} />
                <button type="submit" class="danger-link">
                  <Icon name="trash" size={15} />
                  {t('pages.teacherAvailability.deleteButton')}
                </button>
              </form>
            </article>
          {/each}
        </div>
      {:else}
        <div class="empty-state small">
          <div aria-hidden="true"><Icon name="calendar" size={32} /></div>
          <p>{t('pages.teacherAvailability.emptyMessage')}</p>
        </div>
      {/if}
    </section>
  </div>
</main>

<ConfirmModal
  open={confirm.state.open}
  title={confirm.state.title}
  message={confirm.state.message}
  details={confirm.state.details}
  confirmText={confirm.state.confirmText}
  variant={confirm.state.variant}
  loading={confirm.state.loading}
  onCancel={confirm.cancel}
  onConfirm={confirm.confirm}
/>

<style>
  main {
    min-height: 80vh;
    padding: 2rem 1rem 3rem;
  }

  .content-wrapper {
    max-width: 1100px;
    margin: 0 auto;
  }

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    margin-bottom: 1.6rem;
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

  .header-badge {
    flex: 0 0 auto;
    padding: 0.55rem 1rem;
    border-radius: 999px;
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border: 1px solid var(--sgpa-border);
    font-weight: 950;
    box-shadow: var(--sgpa-shadow-sm);
  }

  .success-box,
  .error-msg {
    margin-bottom: 1.5rem;
  }

  .panel {
    margin-top: 1.2rem;
    padding: 1.5rem;
    border-radius: 28px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
    box-shadow: var(--sgpa-shadow-md);
  }

  .panel h2 {
    margin: 0 0 1rem;
    color: var(--sgpa-blue-dark);
    font-weight: 950;
    letter-spacing: -0.04em;
    font-size: clamp(1.3rem, 3vw, 1.7rem);
  }

  .add-slot-form {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    align-items: end;
  }

  .field {
    display: grid;
    gap: 0.4rem;
  }

  .field label {
    color: var(--sgpa-blue-dark);
    font-weight: 850;
    font-size: 0.9rem;
  }

  .field input,
  .field select {
    width: 100%;
    min-height: 44px;
    border: 1px solid var(--sgpa-border);
    border-radius: 14px;
    padding: 0.7rem 0.85rem;
    background: var(--sgpa-surface);
    color: var(--sgpa-text);
    outline: none;
  }

  .field input:focus,
  .field select:focus {
    border-color: var(--sgpa-blue);
    box-shadow: 0 0 0 4px rgba(11, 45, 105, 0.1);
  }

  .form-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
  }

  .primary-btn {
    min-height: 44px;
    padding: 0.75rem 1.15rem;
    border-radius: 999px;
    border: none;
    font-weight: 950;
    color: var(--sgpa-on-accent);
    background: var(--sgpa-accent-start);
    cursor: pointer;
  }

  .slots-list {
    display: grid;
    gap: 0.85rem;
  }

  .slot-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 18px;
    background: var(--sgpa-bg);
    border: 1px solid var(--sgpa-border);
    flex-wrap: wrap;
  }

  .slot-card div {
    display: grid;
    gap: 0.2rem;
  }

  .slot-card strong {
    color: var(--sgpa-blue-dark);
    font-weight: 950;
  }

  .slot-card span {
    color: var(--sgpa-text-soft);
  }

  .danger-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    min-height: 44px;
    padding: 0.7rem 1rem;
    border-radius: 999px;
    font-weight: 950;
    border: 1px solid #fecaca;
    background: #fee2e2;
    color: #b91c1c;
    cursor: pointer;
    font-size: 0.92rem;
  }

  .danger-link:hover {
    background: #fecaca;
  }

  .empty-state.small {
    text-align: center;
    padding: 1.5rem;
    border-radius: 18px;
    border: 1px dashed var(--sgpa-border);
    color: var(--sgpa-text-soft);
  }

  .empty-state.small div {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  .empty-state.small p {
    margin: 0;
  }

  @media (max-width: 760px) {
    .main-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .add-slot-form {
      grid-template-columns: 1fr;
    }

    .slot-card {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
