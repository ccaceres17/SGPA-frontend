<script>
  import Header from '$lib/components/Header_St.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SideBar from '$lib/components/CoordinatorSideBar.svelte';

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
        <span class="eyebrow">Coordinator module</span>
        <h1>Create project</h1>
        <p>
          Register a new academic project and assign the responsible teacher from the
          initial system form.
        </p>
      </div>

      <a href="/coordinator/projects" class="back-link">
        Back to projects
      </a>
    </header>

    {#if error}
      <div class="error-msg">⚠️ {error}</div>
    {/if}

    {#if form?.success}
      <div class="success-msg">✅ {form.message}</div>
    {/if}

    <section class="form-card">
      <div class="form-intro">
        <span class="form-icon">📘</span>

        <div>
          <h2>Project information</h2>
          <p>
            Fill in the main information. Fields marked with an asterisk are required.
          </p>
        </div>
      </div>

      <form method="POST" class="project-form" onsubmit={handleSubmit}>
        <div class="grid">
          <div class="field full">
            <label for="project_name">Project name *</label>
            <input
              id="project_name"
              name="project_name"
              type="text"
              value={values.project_name || ''}
              placeholder="Example: Academic tracking system"
              required
            />
          </div>

          <div class="field full">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Briefly describe the purpose, scope, or focus of the project"
            >{values.description || ''}</textarea>
          </div>

          <div class="field">
            <label for="start_date">Start date *</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={values.start_date || ''}
              required
            />
          </div>

          <div class="field">
            <label for="end_date">End date</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={values.end_date || ''}
            />
          </div>

          <div class="field">
            <label for="id_status">Status</label>
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
            <label for="id_research_group">Research group</label>
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
            <label for="teacher_id">Assigned teacher *</label>
            <select id="teacher_id" name="teacher_id" required>
              <option value="">Select a teacher</option>

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
          <a href="/coordinator/projects" class="secondary-btn">Cancel</a>

          <button type="submit" class="primary-btn" disabled={submitting}>
            {#if submitting}
              Creating project...
            {:else}
              Create project
            {/if}
          </button>
        </div>
      </form>
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