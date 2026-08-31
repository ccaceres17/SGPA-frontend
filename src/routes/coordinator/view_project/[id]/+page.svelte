<script>
  import Icon from '$lib/components/icons/Icon.svelte';
  import Header from '$lib/components/Header_St.svelte';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import SideBar from '$lib/components/CoordinatorSideBar.svelte';
  import { createConfirmFlow } from '$lib/client/confirmFlow.svelte.js';
  import { t } from '$lib/stores/locale.svelte.js';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import DocumentsPanel from '$lib/components/DocumentsPanel.svelte';
  import ActivityPanel from '$lib/components/ActivityPanel.svelte';

  export let data;
  export let form;

  const confirm = createConfirmFlow();

  function fullName(user) {
    if (!user) return t('reports.unassigned');
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || t('ui.unnamedUser');
  }

  function formatDate(value) {
    if (!value) return t('reports.notDefined');
    return String(value).split('T')[0];
  }

  function formatSlotTime(value) {
    return String(value || '').slice(0, 5);
  }

  $: availabilityDays = t('pages.teacherAvailability.days');

  function handleStatusSubmit(event) {
    const formElement = event.currentTarget;
    const select = formElement.querySelector('select[name="statusId"]');
    const selectedStatus = select?.selectedOptions?.[0]?.textContent?.trim() || t('pages.projectDetail.selectedStatusFallback');

    confirm.request(event, {
      title: t('pages.projectDetail.updateStatusConfirmTitle'),
      message: t('pages.projectDetail.updateStatusConfirmMessage'),
      details: project
        ? `${project.project_name || t('reports.unassigned')} | ${selectedStatus}`
        : selectedStatus,
      confirmText: t('pages.projectDetail.updateStatusButton'),
      variant: 'warning'
    });
  }

  function handleTeacherSubmit(event) {
    const formElement = event.currentTarget;
    const select = formElement.querySelector('select[name="teacherId"]');
    const selectedTeacher = select?.selectedOptions?.[0]?.textContent?.trim() || 'Selected professor';

    confirm.request(event, {
      title: assignedTeacher
        ? t('pages.projectDetail.changeTeacherConfirmTitle')
        : t('pages.projectDetail.assignTeacherConfirmTitle'),
      message: assignedTeacher
        ? t('pages.projectDetail.changeTeacherConfirmMessage')
        : t('pages.projectDetail.assignTeacherConfirmMessage'),
      details: project
        ? `${project.project_name || 'Unnamed project'} | ${selectedTeacher}`
        : selectedTeacher,
      confirmText: assignedTeacher
        ? t('pages.projectDetail.changeTeacherButton')
        : t('pages.projectDetail.assignTeacherButton'),
      variant: 'info'
    });
  }

  function handleCancelSubmit(event) {
    confirm.request(event, {
      title: t('pages.projectDetail.cancelProjectConfirmTitle'),
      message: t('pages.projectDetail.cancelProjectConfirmMessage'),
      details: project?.project_name || '',
      confirmText: t('pages.projectDetail.cancelProjectButton'),
      variant: 'danger'
    });
  }

  function handleReactivateSubmit(event) {
    confirm.request(event, {
      title: t('pages.projectDetail.reactivateConfirmTitle'),
      message: t('pages.projectDetail.reactivateConfirmMessage'),
      details: project?.project_name || '',
      confirmText: t('pages.projectDetail.reactivateButton'),
      variant: 'success'
    });
  }

  $: projectId = data?.projectId;
  $: project = data?.project;
  $: assignedTeacher = data?.assignedTeacher || null;
  $: enrolledStudents = data?.enrolledStudents || [];
  $: teachers = data?.teachers || [];
  $: actionStatuses = data?.actionStatuses || [];
  $: isProjectCancelled = Boolean(data?.isProjectCancelled);
  $: error = form?.error || data?.error || '';
  $: successMessage = form?.messageKey
    ? t(`pages.projectDetail.${form.messageKey}`)
    : form?.message || '';
  $: documents = data?.documents || [];
  $: documentTypes = data?.documentTypes || [];
  $: activityEntries = data?.activityEntries || [];
  $: users = data?.users || [];
  $: currentUserId = data?.currentUserId ?? null;
  $: documentError = form?.documentError || '';
  $: documentSuccessMessage = form?.documentSuccess ? form?.documentMessage : '';
  $: activityError = form?.activityError || '';
  $: activitySuccessMessage = form?.activitySuccess ? form?.activityMessage : '';
</script>

<Header />
<SideBar />

<main>
  <div class="content-wrapper">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/coordinator">{t('sidebar.mainPanel')}</a>
      <span aria-hidden="true">/</span>
      <a href="/coordinator/projects">{t('sidebar.projects')}</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{project?.project_name || t('reports.unassigned')}</span>
    </nav>

    <header class="main-header">
      <div>
        <span class="eyebrow">{t('sidebar.coordinatorModuleLabel')}</span>
        <h1>{t('pages.projectDetail.heading')}</h1>
        <p>{t('pages.projectDetail.description')}</p>
      </div>

      <a href="/coordinator/projects" class="secondary-link">{t('ui.back')}</a>
    </header>

    {#if successMessage}
      <div class="success-box"><Icon name="check-circle" size={16} /> {successMessage}</div>
    {/if}

    {#if error}
      <div class="error-msg"><Icon name="alert-triangle" size={16} /> {error}</div>
    {/if}

    {#if project}
      <div class="detail-layout">
        <section class="project-panel">
          <div class="panel-heading">
            <div class="project-icon"><Icon name="folder" size={26} /></div>
            <div>
              <span class="eyebrow small">{t('pages.projectDetail.infoHeading')}</span>
              <h2>{project.project_name || t('reports.unassigned')}</h2>
              <StatusBadge category={data.statusCategory || 'other'} label={data.statusLabel} />
            </div>
          </div>

          <p class="description">{project.description || t('pages.projectDetail.noDescription')}</p>

          <div class="info-grid">
            <div class="info-item">
              <span>{t('reports.startDate')}</span>
              <strong>{formatDate(project.start_date)}</strong>
            </div>

            <div class="info-item">
              <span>{t('reports.endDate')}</span>
              <strong>{formatDate(project.end_date)}</strong>
            </div>

            <div class="info-item">
              <span>{t('reports.assignedTeacher')}</span>
              <strong>{fullName(assignedTeacher)}</strong>
            </div>

            <div class="info-item">
              <span>{t('pages.projectDetail.enrolledStudentsLabel')}</span>
              <strong>{enrolledStudents.length}</strong>
            </div>

            <div class="info-item">
              <span>{t('reports.projectId')}</span>
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
          <span class="eyebrow small">{t('pages.projectDetail.coordinatorActionsEyebrow')}</span>
          <h2>{t('pages.projectDetail.projectControlsHeading')}</h2>

          {#if isProjectCancelled}
            <div class="action-block">
              <h3>{t('pages.projectDetail.reactivateHeading')}</h3>
              <p>{t('pages.projectDetail.reactivateDescription')}</p>

              <form method="POST" action="?/reactivateProject" on:submit={handleReactivateSubmit}>
                <button type="submit" class="reactivate-btn">{t('pages.projectDetail.reactivateButton')}</button>
              </form>
            </div>
          {:else}
            <div class="action-block">
              <h3>{t('pages.projectDetail.changeStatusHeading')}</h3>
              <p>{t('pages.projectDetail.changeStatusDescription')}</p>

              <form method="POST" action="?/updateStatus" on:submit={handleStatusSubmit}>
                <label for="statusId">{t('pages.projectDetail.projectStatusLabel')}</label>

                <select id="statusId" name="statusId" required>
                  <option value="">{t('pages.projectDetail.selectStatusOption')}</option>
                  {#each actionStatuses as status}
                    <option
                      value={status.id_status}
                      selected={Number(status.id_status) === Number(project.id_status)}
                    >
                      {status.status_name}
                    </option>
                  {/each}
                </select>

                <button type="submit" class="primary-btn">{t('pages.projectDetail.updateStatusButton')}</button>
              </form>
            </div>

            <div class="action-block danger-zone">
              <h3>{t('pages.projectDetail.cancelProjectHeading')}</h3>
              <p>{t('pages.projectDetail.cancelProjectDescription')}</p>

              <form method="POST" action="?/cancelProject" on:submit={handleCancelSubmit}>
                <button type="submit" class="danger-btn">{t('pages.projectDetail.cancelProjectButton')}</button>
              </form>
            </div>
          {/if}

          <div class="action-block">
            <h3>
              {assignedTeacher
                ? t('pages.projectDetail.changeTeacherHeading')
                : t('pages.projectDetail.assignTeacherHeading')}
            </h3>

            {#if assignedTeacher}
              <p>
                {t('pages.projectDetail.currentTeacherLabel')}
                <strong>{fullName(assignedTeacher)}</strong>.
                {t('pages.projectDetail.replaceTeacherNote')}
              </p>
            {:else}
              <p>{t('pages.projectDetail.noTeacherAssigned')}</p>
            {/if}

            <form method="POST" action="?/assignTeacher" on:submit={handleTeacherSubmit}>
              <label for="teacherId">{t('pages.projectDetail.availableTeachers')}</label>

              <select id="teacherId" name="teacherId" required>
                <option value="">{t('pages.projectDetail.selectTeacher')}</option>
                {#each teachers as teacher}
                  <option
                    value={teacher.id_user}
                    selected={assignedTeacher && Number(teacher.id_user) === Number(assignedTeacher.id_user)}
                  >
                    {fullName(teacher)} - {teacher.email}
                  </option>
                {/each}
              </select>

              {#if teachers.length > 0}
                <details class="teacher-availability-list">
                  <summary>{t('pages.projectDetail.availableTeachers')} — {t('sidebar.availability')}</summary>

                  {#each teachers as teacher}
                    <div class="teacher-availability-row">
                      <strong>{fullName(teacher)}</strong>
                      <span>{t('dashboard.stats.activeProjects')}: {teacher.activeProjectCount ?? 0}</span>
                      {#if teacher.availability && teacher.availability.length > 0}
                        <ul>
                          {#each teacher.availability as slot}
                            <li>{availabilityDays[Number(slot.day_of_week)] || slot.day_of_week} {formatSlotTime(slot.start_time)}–{formatSlotTime(slot.end_time)}</li>
                          {/each}
                        </ul>
                      {:else}
                        <span class="no-availability">{t('pages.teacherAvailability.emptyMessage')}</span>
                      {/if}
                    </div>
                  {/each}
                </details>
              {/if}

              <button type="submit" class="primary-btn">
                {assignedTeacher
                  ? t('pages.projectDetail.changeTeacherButton')
                  : t('pages.projectDetail.assignTeacherButton')}
              </button>
            </form>
          </div>
        </aside>
      </div>

      <section class="participants-panel">
        <div class="section-title">
          <div>
            <span class="eyebrow small">{t('pages.projectDetail.participantsEyebrow')}</span>
            <h2>{t('pages.projectDetail.projectTeamHeading')}</h2>
          </div>

          <span class="count-badge">{t('pages.projectDetail.peopleCount', { count: enrolledStudents.length + (assignedTeacher ? 1 : 0) })}</span>
        </div>

        <div class="participant-block">
          <h3>{t('reports.assignedTeacher')}</h3>

          {#if assignedTeacher}
            <article class="participant-card teacher">
              <div class="avatar">T</div>
              <div>
                <strong>{fullName(assignedTeacher)}</strong>
                <span>{assignedTeacher.email || t('ui.noEmailRegistered')}</span>
              </div>
            </article>
          {:else}
            <div class="empty-box">{t('pages.projectDetail.noTeacherAssigned')}</div>
          {/if}
        </div>

        <div class="participant-block">
          <h3>{t('pages.projectDetail.enrolledStudentsLabel')}</h3>

          {#if enrolledStudents.length > 0}
            <div class="students-list">
              {#each enrolledStudents as student}
                <article class="participant-card">
                  <div class="avatar">S</div>
                  <div>
                    <strong>{fullName(student)}</strong>
                    <span>{student.email || t('ui.noEmailRegistered')}</span>
                  </div>
                </article>
              {/each}
            </div>
          {:else}
            <div class="empty-box">{t('pages.projectDetail.noStudentsEnrolledYet')}</div>
          {/if}
        </div>
      </section>

      <DocumentsPanel
        {documents}
        {documentTypes}
        {users}
        {currentUserId}
        isStaff={true}
        confirm={confirm}
        error={documentError}
        successMessage={documentSuccessMessage}
        downloadHrefFor={(doc) => `/coordinator/view_project/${projectId}/documents/${doc.id_document}/download`}
      />

      <ActivityPanel
        progressEntries={activityEntries}
        {users}
        {currentUserId}
        canAddEntry={true}
        isStaff={true}
        confirm={confirm}
        error={activityError}
        successMessage={activitySuccessMessage}
      />
    {:else if !error}
      <section class="empty-state">
        <div><Icon name="inbox" size={32} /></div>
        <h2>{t('pages.projectDetail.projectNotFoundHeading')}</h2>
        <p>{t('pages.projectDetail.projectNotFoundBody')}</p>
      </section>
    {/if}
  </div>
</main>

<ConfirmModal
  open={confirm.state.open}
  title={confirm.state.title}
  message={confirm.state.message}
  details={confirm.state.details}
  confirmText={confirm.state.confirmText}
  cancelText={t('confirmModal.cancel')}
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
  .primary-btn,
  .danger-btn,
  .reactivate-btn {
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

  .danger-btn {
    width: 100%;
    margin-top: 1rem;
    border: none;
    color: var(--sgpa-on-accent);
    background: var(--sgpa-danger, #dc2626);
    cursor: pointer;
  }

  .reactivate-btn {
    width: 100%;
    margin-top: 1rem;
    border: none;
    color: var(--sgpa-on-accent);
    background: var(--sgpa-success, #15803d);
    cursor: pointer;
  }

  .primary-btn:hover,
  .danger-btn:hover,
  .reactivate-btn:hover,
  .secondary-link:hover {
    transform: translateY(-1px);
  }

  .detail-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(310px, 400px);
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

  .action-block {
    margin-top: 1.15rem;
    padding-top: 1.15rem;
    border-top: 1px solid var(--sgpa-border);
  }

  .action-block:first-of-type {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  .danger-zone {
    border-top-color: #fecaca;
  }

  .action-block h3 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: 1rem;
    font-weight: 950;
  }

  .teacher-availability-list {
    margin: 0.75rem 0;
    padding: 0.75rem 0.9rem;
    border-radius: 14px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface-soft);
  }

  .teacher-availability-list summary {
    cursor: pointer;
    font-weight: 850;
    color: var(--sgpa-blue);
  }

  .teacher-availability-row {
    display: grid;
    gap: 0.15rem;
    margin-top: 0.6rem;
    padding-top: 0.6rem;
    border-top: 1px dashed var(--sgpa-border);
    font-size: 0.88rem;
  }

  .teacher-availability-row:first-of-type {
    border-top: none;
    margin-top: 0.5rem;
    padding-top: 0;
  }

  .teacher-availability-row ul {
    margin: 0.2rem 0 0;
    padding-left: 1.1rem;
    color: var(--sgpa-text-soft);
  }

  .no-availability {
    color: var(--sgpa-text-soft);
  }

  label {
    display: block;
    margin: 0.85rem 0 0.4rem;
    color: var(--sgpa-blue-dark);
    font-weight: 950;
    font-size: 0.88rem;
  }

  select {
    width: 100%;
    min-height: 44px;
    border-radius: 14px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
    color: var(--sgpa-blue-dark);
    padding: 0.7rem 0.85rem;
    outline: none;
    font-weight: 750;
  }

  select:focus {
    border-color: var(--sgpa-blue);
    box-shadow: 0 0 0 4px rgba(11, 45, 105, 0.1);
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

  @media (max-width: 980px) {
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