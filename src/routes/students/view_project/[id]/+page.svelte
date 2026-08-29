<script>
  import Header from '$lib/components/Header_St.svelte';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SideBar from '$lib/components/StudentSideBar.svelte';
  import { createConfirmFlow } from '$lib/client/confirmFlow.svelte.js';
  import { t } from '$lib/stores/locale.svelte.js';
  import StatusBadge from '$lib/components/StatusBadge.svelte';

  export let data;
  export let form;

  const confirm = createConfirmFlow();

  function fullName(user) {
    if (!user) return 'Unassigned';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unnamed user';
  }

  function formatDate(value) {
    if (!value) return 'Not defined';
    return String(value).split('T')[0];
  }

  function confirmEnrollment(event) {
    confirm.request(event, {
      title: 'Enroll in this project?',
      message: 'Your user will be registered as a student participant in this academic project.',
      details: project ? `Project: ${project.project_name || 'Unnamed project'}` : '',
      confirmText: 'Enroll in project',
      variant: 'success'
    });
  }

  $: project = data?.project;
  $: assignedTeacher = data?.assignedTeacher || null;
  $: enrolledStudents = data?.enrolledStudents || [];
  $: error = form?.error || data?.error || '';
  $: successMessage = form?.message || '';
  $: isEnrolled = Boolean(form?.success || data?.isEnrolled);
  $: backHref = data?.source === 'myprojects' ? '/students/myprojects' : '/students/projects';
</script>

<Header />
<SideBar />

<main>
  <div class="content-wrapper">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/students">{t('sidebar.mainPanel')}</a>
      <span aria-hidden="true">/</span>
      <a href={backHref}>{data?.source === 'myprojects' ? t('sidebar.myProjects') : t('sidebar.availableProjects')}</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{project?.project_name || t('reports.unassigned')}</span>
    </nav>

    <header class="main-header">
      <div>
        <span class="eyebrow">Student module</span>
        <h1>Project details</h1>
        <p>Review the project information and enroll only if you are not already registered.</p>
      </div>

      <a href={backHref} class="secondary-link">Back</a>
    </header>

    {#if successMessage}
      <div class="success-box">✅ {successMessage}</div>
    {/if}

    {#if error}
      <div class="error-msg">⚠️ {error}</div>
    {/if}

    {#if project}
      <div class="detail-layout">
        <section class="project-panel">
          <div class="panel-heading">
            <div class="project-icon">📁</div>
            <div>
              <span class="eyebrow small">Project information</span>
              <h2>{project.project_name || 'Unnamed project'}</h2>
              <StatusBadge category={data.statusCategory || 'other'} label={data.statusLabel} />
            </div>
          </div>

          <p class="description">{project.description || 'No description available.'}</p>

          <div class="info-grid">
            <div class="info-item">
              <span>Start date</span>
              <strong>{formatDate(project.start_date)}</strong>
            </div>

            <div class="info-item">
              <span>End date</span>
              <strong>{formatDate(project.end_date)}</strong>
            </div>

            <div class="info-item">
              <span>Teacher</span>
              <strong>{fullName(assignedTeacher)}</strong>
            </div>

            <div class="info-item">
              <span>Enrolled students</span>
              <strong>{enrolledStudents.length}</strong>
            </div>

            <div class="info-item">
              <span>Project ID</span>
              <strong>{project.id_project}</strong>
            </div>

            <div class="info-item">
              <span>{t('researchGroups.label')}</span>
              <strong>
                {data.researchGroup?.name ?? t('researchGroups.unknown')}
                {#if data.researchGroup?.isDemo}
                  <em class="demo-tag">({t('researchGroups.demoLabel')})</em>
                {/if}
              </strong>
            </div>
          </div>
        </section>

        <aside class="actions-panel">
          <span class="eyebrow small">Student action</span>
          <h2>{isEnrolled ? 'Already enrolled' : 'Enrollment available'}</h2>

          {#if isEnrolled}
            <p>You are already enrolled in this project. You cannot enroll twice.</p>
            <a href="/students/myprojects" class="secondary-link full-width">Go to my projects</a>
          {:else}
            <p>You can enroll in this project. Confirm the action before registering your enrollment.</p>

            <form method="POST" action="?/enroll" onsubmit={confirmEnrollment}>
              <button type="submit" class="primary-btn">Enroll in project</button>
            </form>
          {/if}
        </aside>
      </div>

      <section class="participants-panel">
        <div class="section-title">
          <div>
            <span class="eyebrow small">Participants</span>
            <h2>Project team</h2>
          </div>

          <span class="count-badge">{enrolledStudents.length + (assignedTeacher ? 1 : 0)} people</span>
        </div>

        <div class="participant-block">
          <h3>Assigned teacher</h3>

          {#if assignedTeacher}
            <article class="participant-card teacher">
              <div class="avatar">T</div>
              <div>
                <strong>{fullName(assignedTeacher)}</strong>
                <span>{assignedTeacher.email || 'No email registered'}</span>
              </div>
            </article>
          {:else}
            <div class="empty-box">No teacher has been assigned yet.</div>
          {/if}
        </div>

        <div class="participant-block">
          <h3>Enrolled students</h3>

          {#if enrolledStudents.length > 0}
            <div class="students-list">
              {#each enrolledStudents as student}
                <article class="participant-card">
                  <div class="avatar">S</div>
                  <div>
                    <strong>{fullName(student)}</strong>
                    <span>{student.email || 'No email registered'}</span>
                  </div>
                </article>
              {/each}
            </div>
          {:else}
            <div class="empty-box">No students enrolled yet.</div>
          {/if}
        </div>
      </section>
    {:else if !error}
      <section class="empty-state">
        <div>📭</div>
        <h2>Project not found</h2>
        <p>The requested project could not be loaded.</p>
      </section>
    {/if}
  </div>
</main>

<Footer />

<ConfirmModal
  open={confirm.state.open}
  title={confirm.state.title}
  message={confirm.state.message}
  details={confirm.state.details}
  confirmText={confirm.state.confirmText}
  cancelText="Cancel"
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
    max-width: 1180px;
    margin: 0 auto;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.9rem;
    color: var(--sgpa-text-soft);
    font-size: 0.85rem;
    font-weight: 700;
  }

  .breadcrumb a {
    color: var(--sgpa-link);
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .breadcrumb [aria-current='page'] {
    color: var(--sgpa-text);
  }

  .main-header,
  .project-panel,
  .actions-panel,
  .participants-panel,
  .empty-state {
    border-radius: 28px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
    box-shadow: var(--sgpa-shadow-md);
  }

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    margin-bottom: 1.4rem;
    padding: 1.6rem;
    background: var(--sgpa-surface);
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

  .eyebrow.small {
    margin-bottom: 0.55rem;
    font-size: 0.72rem;
  }

  .main-header h1,
  .project-panel h2,
  .actions-panel h2,
  .participants-panel h2,
  .empty-state h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-weight: 950;
    letter-spacing: -0.04em;
  }

  .main-header h1 {
    font-size: clamp(2rem, 4vw, 3rem);
  }

  .main-header p,
  .description,
  .actions-panel p,
  .empty-state p {
    color: var(--sgpa-text-soft);
    line-height: 1.7;
  }

  .main-header p {
    max-width: 720px;
    margin: 0.7rem 0 0;
  }

  .secondary-link,
  .primary-btn {
    min-height: 44px;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    font-weight: 950;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .secondary-link {
    color: var(--sgpa-blue);
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
  }

  .primary-btn {
    width: 100%;
    margin-top: 1rem;
    border: none;
    color: var(--sgpa-on-accent);
    background: var(--sgpa-accent-start);
    cursor: pointer;
  }

  .full-width {
    width: 100%;
    margin-top: 1rem;
  }

  .detail-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
    gap: 1.2rem;
    align-items: start;
  }

  .project-panel,
  .actions-panel,
  .participants-panel,
  .empty-state {
    padding: 1.5rem;
  }

  .panel-heading {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1.1rem;
  }

  .project-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: grid;
    place-items: center;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    font-size: 1.8rem;
    flex-shrink: 0;
  }

  .project-panel h2,
  .actions-panel h2,
  .participants-panel h2 {
    font-size: clamp(1.45rem, 3vw, 2.15rem);
  }

  .count-badge {
    display: inline-flex;
    width: fit-content;
    margin-top: 0.7rem;
    padding: 0.42rem 0.82rem;
    border-radius: 999px;
    color: var(--sgpa-blue);
    background: var(--sgpa-blue-soft);
    border: 1px solid rgba(11, 45, 105, 0.12);
    font-size: 0.82rem;
    font-weight: 950;
  }

  .description {
    margin: 0 0 1.25rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }

  .info-item,
  .empty-box,
  .participant-card {
    border-radius: 18px;
    background: var(--sgpa-bg);
    border: 1px solid var(--sgpa-border);
  }

  .info-item {
    padding: 1rem;
  }

  .info-item span {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--sgpa-text-soft);
    font-size: 0.82rem;
    font-weight: 850;
  }

  .info-item strong {
    display: block;
    color: var(--sgpa-blue-dark);
    font-weight: 950;
    word-break: break-word;
  }

  .demo-tag {
    color: var(--sgpa-text-soft);
    font-size: 0.78rem;
    font-weight: 700;
    font-style: normal;
  }

  .actions-panel {
    position: sticky;
    top: 1rem;
  }

  .participants-panel {
    margin-top: 1.2rem;
  }

  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }

  .participant-block + .participant-block {
    margin-top: 1.25rem;
  }

  .participant-block h3 {
    margin: 0 0 0.8rem;
    color: var(--sgpa-blue-dark);
    font-size: 1rem;
    font-weight: 950;
  }

  .students-list {
    display: grid;
    gap: 0.75rem;
  }

  .participant-card {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.9rem;
  }

  .participant-card.teacher {
    background: var(--sgpa-blue-soft);
    border-color: rgba(11, 45, 105, 0.16);
  }

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: var(--sgpa-blue);
    color: var(--sgpa-on-accent);
    font-weight: 950;
    flex-shrink: 0;
  }

  .participant-card strong {
    display: block;
    color: var(--sgpa-blue-dark);
    font-weight: 950;
  }

  .participant-card span {
    display: block;
    margin-top: 0.2rem;
    color: var(--sgpa-text-soft);
    font-size: 0.88rem;
  }

  .empty-box {
    padding: 0.9rem;
    color: var(--sgpa-text-soft);
    border-style: dashed;
    font-weight: 750;
  }

  .success-box,
  .error-msg {
    margin-bottom: 1rem;
  }

  .empty-state {
    text-align: center;
  }

  .empty-state div {
    font-size: 2.2rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 920px) {
    .detail-layout {
      grid-template-columns: 1fr;
    }

    .actions-panel {
      position: static;
    }
  }

  @media (max-width: 720px) {
    .main-header,
    .panel-heading,
    .section-title {
      align-items: flex-start;
      flex-direction: column;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>