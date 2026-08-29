<script>
  import { t } from '$lib/stores/locale.svelte.js';

  export let data;
  export let backHref = '/';
  export let backLabel = '';

  $: report = data?.report || {};
  $: projects = report?.projects || [];
  $: error = data?.error || '';

  function printReport() {
    window.print();
  }
</script>

<svelte:head>
  <title>{report?.title || 'Projects report'} | SGPA</title>
</svelte:head>

<main class="report-page">
  <section class="screen-actions">
    <a href={backHref} class="secondary-link">{backLabel || t('reports.back')}</a>

    <button type="button" class="print-btn" onclick={printReport}>
      {t('reports.downloadPdf')}
    </button>
  </section>

  <article class="report-sheet">
    <header class="report-header">
      <span class="institution">SGPA</span>
      <h1>{report?.title || 'Academic projects report'}</h1>
      <p>{report?.subtitle || 'Project report generated from the SGPA platform.'}</p>
    </header>

    <section class="report-meta">
      <div>
        <span>{t('reports.generatedBy')}</span>
        <strong>{report?.generatedBy || t('reports.systemUser')}</strong>
      </div>

      <div>
        <span>{t('reports.generatedDate')}</span>
        <strong>{report?.generatedAt || t('reports.notDefined')}</strong>
      </div>

      <div>
        <span>{t('reports.totalProjects')}</span>
        <strong>{projects.length}</strong>
      </div>
    </section>

    {#if error}
      <section class="report-error">
        <strong>{t('reports.couldNotGenerate')}</strong>
        <p>{error}</p>
      </section>
    {:else if projects.length > 0}
      <section class="projects-list">
        {#each projects as project, index}
          <article class="project-block">
            <div class="project-number">{index + 1}</div>

            <div class="project-content">
              <div class="project-top">
                <div>
                  <h2>{project.project_name}</h2>
                  <p>{project.description}</p>
                </div>

                <span class="status-pill">{project.status}</span>
              </div>

              <div class="project-grid">
                <div>
                  <span>{t('reports.projectId')}</span>
                  <strong>{project.id_project}</strong>
                </div>

                <div>
                  <span>{t('reports.startDate')}</span>
                  <strong>{project.start_date}</strong>
                </div>

                <div>
                  <span>{t('reports.endDate')}</span>
                  <strong>{project.end_date}</strong>
                </div>

                <div>
                  <span>{t('reports.assignedTeacher')}</span>
                  <strong>{project.teacher?.name || t('reports.unassigned')}</strong>
                </div>
              </div>

              <div class="participants">
                <h3>{t('reports.participants')}</h3>

                <div class="participant-line">
                  <strong>{t('reports.teacherLabel')}</strong>
                  <span>
                    {project.teacher
                      ? `${project.teacher.name} - ${project.teacher.email}`
                      : t('reports.noTeacherAssigned')}
                  </span>
                </div>

                <div class="participant-line students-line">
                  <strong>{t('reports.studentsLabel')}</strong>

                  {#if project.students.length > 0}
                    <ul>
                      {#each project.students as student}
                        <li>{student.name} - {student.email}</li>
                      {/each}
                    </ul>
                  {:else}
                    <span>{t('reports.noStudentsEnrolled')}</span>
                  {/if}
                </div>
              </div>
            </div>
          </article>
        {/each}
      </section>
    {:else}
      <section class="empty-report">
        <h2>{t('reports.noProjectsTitle')}</h2>
        <p>{t('reports.noProjectsDescription')}</p>
      </section>
    {/if}

    <footer class="report-footer">
      <p>{t('reports.footerNote')}</p>
    </footer>
  </article>
</main>

<style>
  .report-page {
    min-height: 100vh;
    padding: 2rem 1rem 3rem;
    background: var(--sgpa-bg);
    color: var(--sgpa-text, #172033);
  }

  .screen-actions {
    width: min(980px, 100%);
    margin: 0 auto 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .secondary-link,
  .print-btn {
    min-height: 44px;
    padding: 0.76rem 1.08rem;
    border-radius: 999px;
    font-weight: 950;
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

  .secondary-link {
    background: var(--sgpa-surface);
    color: var(--sgpa-blue, #0d468d);
    border: 1px solid var(--sgpa-border, #dbe4f0);
    box-shadow: var(--sgpa-shadow-sm, 0 8px 18px rgba(15, 35, 70, 0.08));
  }

  .secondary-link::before {
    content: '←';
    font-size: 0.95rem;
    line-height: 1;
  }

  .print-btn {
    border: 1px solid rgba(11, 45, 105, 0.18);
    color: #ffffff;
    background: var(--sgpa-blue, #0d468d);
    cursor: pointer;
    box-shadow: 0 12px 26px rgba(11, 45, 105, 0.18);
  }

  .print-btn::before {
    content: '📄';
    font-size: 0.95rem;
    line-height: 1;
  }

  .secondary-link:hover {
    transform: translateY(-1px);
    background: var(--sgpa-blue-soft, #e8f0ff);
    border-color: rgba(11, 45, 105, 0.2);
  }

  .print-btn:hover {
    transform: translateY(-1px);
    background: var(--sgpa-blue-dark, #202f56);
    box-shadow: 0 16px 30px rgba(11, 45, 105, 0.24);
  }

  .report-sheet {
    width: min(980px, 100%);
    margin: 0 auto;
    padding: 2rem;
    border-radius: 28px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border, #dbe4f0);
    box-shadow: var(--sgpa-shadow-md, 0 16px 36px rgba(15, 35, 70, 0.1));
  }

  .report-header {
    padding-bottom: 1.2rem;
    border-bottom: 4px solid var(--sgpa-yellow, #f7b806);
  }

  .institution {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 0.6rem;
    padding: 0.38rem 0.75rem;
    border-radius: 999px;
    background: var(--sgpa-yellow-soft, #fff7d6);
    color: var(--sgpa-blue, #0d468d);
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    border: 1px solid rgba(242, 183, 5, 0.3);
  }

  .report-header h1 {
    margin: 0;
    color: var(--sgpa-blue-dark, #202f56);
    font-size: clamp(1.9rem, 4vw, 3rem);
    line-height: 1.05;
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  .report-header p {
    max-width: 700px;
    margin: 0.7rem 0 0;
    color: var(--sgpa-text-soft, #64748b);
    line-height: 1.65;
  }

  .report-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.85rem;
    margin: 1.2rem 0;
  }

  .report-meta div,
  .project-grid div {
    padding: 0.9rem;
    border-radius: 18px;
    background: var(--sgpa-bg, #f6f8fc);
    border: 1px solid var(--sgpa-border, #dbe4f0);
  }

  .report-meta span,
  .project-grid span {
    display: block;
    margin-bottom: 0.28rem;
    color: var(--sgpa-text-soft, #64748b);
    font-size: 0.78rem;
    font-weight: 850;
  }

  .report-meta strong,
  .project-grid strong {
    color: var(--sgpa-blue-dark, #202f56);
    font-weight: 950;
  }

  .projects-list {
    display: grid;
    gap: 1.15rem;
  }

  .project-block {
    display: grid;
    grid-template-columns: 46px 1fr;
    gap: 1rem;
    padding: 1.1rem;
    border-radius: 22px;
    border: 1px solid var(--sgpa-border, #dbe4f0);
    background: var(--sgpa-surface);
    page-break-inside: avoid;
  }

  .project-number {
    width: 42px;
    height: 42px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    color: #ffffff;
    background: var(--sgpa-blue, #0d468d);
    font-weight: 950;
  }

  .project-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 0.9rem;
  }

  .project-top h2 {
    margin: 0;
    color: var(--sgpa-blue-dark, #202f56);
    font-size: 1.35rem;
    font-weight: 950;
  }

  .project-top p {
    margin: 0.35rem 0 0;
    color: var(--sgpa-text-soft, #64748b);
    line-height: 1.6;
  }

  .status-pill {
    display: inline-flex;
    width: fit-content;
    padding: 0.42rem 0.82rem;
    border-radius: 999px;
    background: var(--sgpa-blue-soft, #e8f0ff);
    color: var(--sgpa-blue, #0d468d);
    border: 1px solid rgba(11, 45, 105, 0.12);
    font-size: 0.82rem;
    font-weight: 950;
    flex-shrink: 0;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .participants {
    padding-top: 0.8rem;
    border-top: 1px solid var(--sgpa-border, #dbe4f0);
  }

  .participants h3 {
    margin: 0 0 0.55rem;
    color: var(--sgpa-blue-dark, #202f56);
    font-size: 1rem;
    font-weight: 950;
  }

  .participant-line {
    color: var(--sgpa-text-soft, #64748b);
    line-height: 1.7;
  }

  .participant-line strong {
    color: var(--sgpa-blue-dark, #202f56);
  }

  .students-line ul {
    margin: 0.4rem 0 0;
    padding-left: 1.2rem;
  }

  .students-line li::marker {
    color: var(--sgpa-yellow, #f7b806);
  }

  .empty-report,
  .report-error {
    padding: 2rem;
    border-radius: 22px;
    background: var(--sgpa-bg, #f6f8fc);
    border: 1px dashed var(--sgpa-border, #dbe4f0);
    text-align: center;
  }

  .report-error {
    background: var(--sgpa-danger-bg, #fee2e2);
    color: var(--sgpa-danger, #dc2626);
  }

  .report-footer {
    margin-top: 1.2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--sgpa-border, #dbe4f0);
    color: var(--sgpa-text-soft, #64748b);
    font-size: 0.86rem;
    text-align: center;
  }

  @media (max-width: 820px) {
    .project-top {
      flex-direction: column;
    }

    .report-meta,
    .project-grid {
      grid-template-columns: 1fr;
    }

    .project-block {
      grid-template-columns: 1fr;
    }
  }

  @media print {
    @page {
      size: A4;
      margin: 14mm;
    }

    body {
      background: #ffffff !important;
    }

    .screen-actions {
      display: none !important;
    }

    .report-page {
      padding: 0;
      background: #ffffff !important;
    }

    .report-sheet {
      width: 100%;
      padding: 0;
      border: none;
      border-radius: 0;
      box-shadow: none;
    }

    .project-block {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
</style>