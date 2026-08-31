<script>
  import { t } from '$lib/stores/locale.svelte.js';
  import Icon from '$lib/components/icons/Icon.svelte';

  export let documents = [];
  export let documentTypes = [];
  export let users = [];
  export let currentUserId = null;
  export let isStaff = false;
  export let addAction = '?/addDocument';
  export let deleteAction = '?/deleteDocument';
  export let downloadHrefFor = (doc) => doc.file_path;
  export let confirm;
  export let error = '';
  export let successMessage = '';

  let showAddForm = false;

  $: usersById = new Map(users.map((user) => [Number(user.id_user), user]));
  $: typesById = new Map(documentTypes.map((type) => [Number(type.id_document_type), type]));

  function uploaderName(doc) {
    const user = usersById.get(Number(doc.id_user));
    if (!user) return t('documents.noOwnerInfo');
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || t('documents.noOwnerInfo');
  }

  function typeName(doc) {
    return typesById.get(Number(doc.id_document_type))?.document_type_name || '';
  }

  function canManage(doc) {
    return isStaff || Number(doc.id_user) === Number(currentUserId);
  }

  function handleDeleteSubmit(event) {
    confirm.request(event, {
      title: t('documents.deleteConfirmTitle'),
      message: t('documents.deleteConfirmMessage'),
      confirmText: t('documents.deleteConfirmButton'),
      variant: 'danger'
    });
  }

  function toggleAddForm() {
    showAddForm = !showAddForm;
  }
</script>

<section class="documents-panel">
  <div class="section-title">
    <div>
      <span class="eyebrow small">{t('documents.sectionTitle')}</span>
      <h2>{t('documents.sectionTitle')}</h2>
      <p>{t('documents.sectionDescription')}</p>
    </div>

    <button type="button" class="secondary-link" onclick={toggleAddForm} aria-expanded={showAddForm}>
      {t('documents.addButton')}
    </button>
  </div>

  {#if successMessage}
    <div class="success-box" role="status"><Icon name="check-circle" size={16} /> {successMessage}</div>
  {/if}

  {#if error}
    <div class="error-msg" role="alert"><Icon name="alert-triangle" size={16} /> {error}</div>
  {/if}

  {#if showAddForm}
    <form method="POST" action={addAction} enctype="multipart/form-data" class="add-document-form">
      <div class="field">
        <label for="doc-type">{t('documents.documentTypeLabel')}</label>
        <select id="doc-type" name="id_document_type" required>
          <option value="">{t('documents.selectDocumentType')}</option>
          {#each documentTypes as type}
            <option value={type.id_document_type}>{type.document_type_name}</option>
          {/each}
        </select>
      </div>

      <div class="field">
        <label for="doc-file">{t('documents.fileLabel')}</label>
        <input
          id="doc-file"
          name="file"
          type="file"
          accept="application/pdf"
          required
          aria-describedby="doc-file-hint"
        />
        <small id="doc-file-hint" class="field-hint">{t('documents.fileHint')}</small>
      </div>

      <div class="field full">
        <label for="doc-description">{t('documents.descriptionLabel')}</label>
        <textarea id="doc-description" name="description" rows="3"></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="primary-btn">{t('documents.submitButton')}</button>
      </div>
    </form>
  {/if}

  {#if documents.length > 0}
    <div class="documents-list">
      {#each documents as doc (doc.id_document)}
        <article class="document-card">
          <div class="document-info">
            <strong>{doc.file_name}</strong>
            {#if typeName(doc)}
              <span class="type-badge">{typeName(doc)}</span>
            {/if}
            {#if doc.description}
              <p>{doc.description}</p>
            {/if}
            <span class="uploader">{t('documents.uploadedBy')}: {uploaderName(doc)}</span>
          </div>

          <div class="document-actions">
            <a href={downloadHrefFor(doc)} target="_blank" rel="noopener noreferrer" class="secondary-link">
              <Icon name="download" size={15} />
              {t('documents.viewLink')}
            </a>

            {#if canManage(doc)}
              <form method="POST" action={deleteAction} onsubmit={handleDeleteSubmit}>
                <input type="hidden" name="documentId" value={doc.id_document} />
                <button type="submit" class="danger-link">
                  <Icon name="trash" size={15} />
                  {t('documents.deleteButton')}
                </button>
              </form>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div class="empty-state small">
      <div aria-hidden="true"><Icon name="file-text" size={32} /></div>
      <p>{t('documents.emptyMessage')}</p>
    </div>
  {/if}
</section>

<style>
  .documents-panel {
    margin-top: 1.2rem;
    padding: 1.5rem;
    border-radius: 28px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface);
    box-shadow: var(--sgpa-shadow-md);
  }

  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    margin-bottom: 1.1rem;
    flex-wrap: wrap;
  }

  .eyebrow.small {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 0.55rem;
    padding: 0.34rem 0.72rem;
    border-radius: 999px;
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid rgba(242, 183, 5, 0.28);
  }

  h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-weight: 950;
    letter-spacing: -0.04em;
    font-size: clamp(1.3rem, 3vw, 1.7rem);
  }

  .section-title p {
    margin: 0.35rem 0 0;
    color: var(--sgpa-text-soft);
    line-height: 1.6;
  }

  .secondary-link {
    min-height: 44px;
    padding: 0.7rem 1rem;
    border-radius: 999px;
    font-weight: 950;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    color: var(--sgpa-blue);
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
    cursor: pointer;
    font-size: 0.92rem;
    flex: 0 0 auto;
  }

  .secondary-link:hover {
    background: var(--sgpa-blue-soft);
  }

  .success-box,
  .error-msg {
    margin-bottom: 1rem;
  }

  .add-document-form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    padding: 1.2rem;
    margin-bottom: 1.2rem;
    border-radius: 20px;
    background: var(--sgpa-surface-soft);
    border: 1px solid var(--sgpa-border);
  }

  .field {
    display: grid;
    gap: 0.4rem;
  }

  .field.full {
    grid-column: 1 / -1;
  }

  .field label {
    color: var(--sgpa-blue-dark);
    font-weight: 850;
    font-size: 0.9rem;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    min-height: 44px;
    border: 1px solid var(--sgpa-border);
    border-radius: 14px;
    padding: 0.7rem 0.85rem;
    background: var(--sgpa-surface);
    color: var(--sgpa-text);
    outline: none;
  }

  .field textarea {
    min-height: 80px;
    resize: vertical;
  }

  .field input:focus,
  .field select:focus,
  .field textarea:focus {
    border-color: var(--sgpa-blue);
    box-shadow: 0 0 0 4px rgba(11, 45, 105, 0.1);
  }

  .field-hint {
    color: var(--sgpa-text-soft);
    font-size: 0.8rem;
    line-height: 1.5;
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

  .documents-list {
    display: grid;
    gap: 0.85rem;
  }

  .document-card {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: 18px;
    background: var(--sgpa-bg);
    border: 1px solid var(--sgpa-border);
    flex-wrap: wrap;
  }

  .document-info {
    display: grid;
    gap: 0.3rem;
    min-width: 0;
    flex: 1 1 260px;
  }

  .document-info strong {
    color: var(--sgpa-blue-dark);
    font-weight: 950;
    word-break: break-word;
  }

  .document-info p {
    margin: 0;
    color: var(--sgpa-text-soft);
    line-height: 1.5;
  }

  .uploader {
    color: var(--sgpa-text-soft);
    font-size: 0.82rem;
  }

  .type-badge {
    display: inline-flex;
    width: fit-content;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    font-size: 0.76rem;
    font-weight: 850;
  }

  .document-actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    flex: 0 0 auto;
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

  @media (max-width: 720px) {
    .section-title {
      flex-direction: column;
      align-items: flex-start;
    }

    .add-document-form {
      grid-template-columns: 1fr;
    }

    .document-card {
      flex-direction: column;
      align-items: stretch;
    }

    .document-actions {
      justify-content: flex-start;
    }
  }
</style>
