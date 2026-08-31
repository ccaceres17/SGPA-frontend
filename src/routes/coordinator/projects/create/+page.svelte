<script>
  import Icon from '$lib/components/icons/Icon.svelte';
  import Header from '$lib/components/Header_St.svelte';
  import SideBar from '$lib/components/CoordinatorSideBar.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  export let data;
  export let form;

  let submitting = false;

  $: teachers = data?.teachers || [];
  $: statuses = data?.statuses || [];
  $: researchGroupOptions = data?.researchGroupOptions || [];
  $: error = form?.error || data?.error;
  $: values = form?.values || {};

  function handleSubmit() {
    submitting = true;
  }
</script>

<Header />
<SideBar />

<main>
  <div class="content-wrapper">
    <header class="main-header">
      <div class="header-copy">
        <span class="eyebrow">{t('sidebar.coordinatorModuleLabel')}</span>
        <h1>{t('pages.createProject.heading')}</h1>
        <p>{t('pages.createProject.description')}</p>
      </div>

      <a href="/coordinator/projects" class="back-link">
        {t('pages.createProject.backToProjects')}
      </a>
    </header>

    {#if error}
      <div class="error-msg"><Icon name="alert-triangle" size={16} /> {error}</div>
    {/if}

    {#if form?.success}
      <div class="success-msg"><Icon name="check-circle" size={16} /> {form.message}</div>
    {/if}

    <section class="form-card">
      <div class="form-intro">
        <span class="form-icon"><Icon name="book-open" size={22} /></span>

        <div>
          <h2>{t('pages.createProject.formIntroHeading')}</h2>
          <p>{t('pages.createProject.formIntroDescription')}</p>
        </div>
      </div>

      <form method="POST" class="project-form" onsubmit={handleSubmit}>
        <div class="grid">
          <div class="field full">
            <label for="project_name">{t('pages.createProject.projectNameLabel')}</label>
            <input
              id="project_name"
              name="project_name"
              type="text"
              value={values.project_name || ''}
              placeholder={t('pages.createProject.projectNamePlaceholder')}
              required
            />
          </div>

          <div class="field full">
            <label for="description">{t('pages.createProject.descriptionLabel')}</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder={t('pages.createProject.descriptionPlaceholder')}
            >{values.description || ''}</textarea>
          </div>

          <div class="field">
            <label for="start_date">{t('pages.createProject.startDateLabel')}</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={values.start_date || ''}
              required
            />
          </div>

          <div class="field">
            <label for="end_date">{t('pages.createProject.endDateLabel')}</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={values.end_date || ''}
            />
          </div>

          <div class="field">
            <label for="id_status">{t('pages.createProject.statusLabel')}</label>
            <select id="id_status" name="id_status">
              {#each statuses as status}
                <option
                  value={status.id}
                  selected={String(values.id_status || '1') === String(status.id)}
                >
                  {status.name}
                </option>
              {/each}
            </select>
          </div>

          <div class="field">
            <label for="id_research_group">{t('pages.createProject.researchGroupLabel')}</label>
            <select id="id_research_group" name="id_research_group">
              {#each researchGroupOptions as group}
                <option
                  value={group.id}
                  selected={String(values.id_research_group || data.defaultResearchGroupId) === String(group.id)}
                >
                  {group.name}
                </option>
              {/each}
            </select>
          </div>

          <div class="field full">
            <label for="teacher_id">{t('pages.createProject.assignedTeacherLabel')}</label>
            <select id="teacher_id" name="teacher_id" required>
              <option value="">{t('pages.createProject.selectTeacherOption')}</option>

              {#each teachers as teacher}
                <option
                  value={teacher.id_user}
                  selected={String(values.teacher_id || '') === String(teacher.id_user)}
                >
                  {teacher.first_name} {teacher.last_name} - {teacher.email}
                </option>
              {/each}
            </select>
          </div>
        </div>

        <div class="actions">
          <a href="/coordinator/projects" class="secondary-btn">{t('pages.createProject.cancelButton')}</a>

          <button type="submit" class="primary-btn" disabled={submitting}>
            {#if submitting}
              {t('pages.createProject.creatingButton')}
            {:else}
              {t('pages.createProject.createButton')}
            {/if}
          </button>
        </div>
      </form>
    </section>
  </div>
</main>

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

  .back-link {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border: 1px solid var(--sgpa-border);
    text-decoration: none;
    font-weight: 950;
    box-shadow: var(--sgpa-shadow-sm);
  }

  .back-link:hover {
    background: var(--sgpa-blue-soft);
  }

  .error-msg,
  .success-msg {
    margin-bottom: 1rem;
  }

  .form-card {
    background: var(--sgpa-surface);
    border-radius: 28px;
    box-shadow: var(--sgpa-shadow-md);
    padding: clamp(1.2rem, 3vw, 2rem);
    border: 1px solid var(--sgpa-border);
    border-top: 6px solid var(--sgpa-blue);
  }

  .form-intro {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid var(--sgpa-border);
  }

  .form-icon {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    flex: 0 0 auto;
    border-radius: 18px;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    font-size: 1.4rem;
  }

  .form-intro h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: 1.45rem;
    font-weight: 950;
  }

  .form-intro p {
    margin: 0.35rem 0 0;
    color: var(--sgpa-text-soft);
    line-height: 1.6;
  }

  .project-form {
    display: grid;
    gap: 1.5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .field {
    display: grid;
    gap: 0.45rem;
  }

  .field.full {
    grid-column: 1 / -1;
  }

  label {
    color: var(--sgpa-blue-dark);
    font-weight: 850;
    font-size: 0.95rem;
  }

  input,
  textarea,
  select {
    width: 100%;
    border: 1px solid var(--sgpa-border);
    border-radius: 14px;
    padding: 0.85rem 1rem;
    color: var(--sgpa-text);
    background: var(--sgpa-surface);
    outline: none;
  }

  textarea {
    resize: vertical;
    min-height: 140px;
    line-height: 1.6;
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: var(--sgpa-yellow);
    box-shadow: var(--sgpa-focus);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
    flex-wrap: wrap;
    border-top: 1px solid var(--sgpa-border);
    padding-top: 1.3rem;
  }

  .primary-btn,
  .secondary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    padding: 0.8rem 1.2rem;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 950;
    cursor: pointer;
  }

  .primary-btn {
    border: none;
  }

  .secondary-btn {
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border: 1px solid var(--sgpa-border-strong);
  }

  .secondary-btn:hover {
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue-dark);
  }

  .primary-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  @media (max-width: 780px) {
    .main-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .actions {
      justify-content: stretch;
    }

    .primary-btn,
    .secondary-btn {
      width: 100%;
    }
  }

  @media (max-width: 560px) {
    .form-intro {
      flex-direction: column;
    }
  }
</style>