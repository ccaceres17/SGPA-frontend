<script>
  import { t } from '$lib/stores/locale.svelte.js';
  import Icon from '$lib/components/icons/Icon.svelte';

  export let progressEntries = [];
  export let users = [];
  export let currentUserId = null;
  export let canAddEntry = false;
  export let isStaff = false;
  export let addEntryAction = '?/addProgress';
  export let addCommentAction = '?/addComment';
  export let deleteCommentAction = '?/deleteComment';
  export let confirm;
  export let error = '';
  export let successMessage = '';

  let showAddForm = false;

  $: usersById = new Map(users.map((user) => [Number(user.id_user), user]));

  function authorName(idUser) {
    const user = usersById.get(Number(idUser));
    if (!user) return t('documents.noOwnerInfo');
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || t('documents.noOwnerInfo');
  }

  function formatDate(value) {
    if (!value) return '';
    return String(value).split('T')[0];
  }

  function canManageComment(comment) {
    return isStaff || Number(comment.id_user) === Number(currentUserId);
  }

  function toggleAddForm() {
    showAddForm = !showAddForm;
  }

  function handleDeleteCommentSubmit(event) {
    confirm.request(event, {
      title: t('activity.deleteCommentConfirmTitle'),
      message: t('activity.deleteCommentConfirmMessage'),
      confirmText: t('activity.deleteCommentButton'),
      variant: 'danger'
    });
  }
</script>

<section class="activity-panel">
  <div class="section-title">
    <div>
      <span class="eyebrow small">{t('activity.sectionTitle')}</span>
      <h2>{t('activity.sectionTitle')}</h2>
      <p>{t('activity.sectionDescription')}</p>
    </div>

    {#if canAddEntry}
      <button type="button" class="secondary-link" onclick={toggleAddForm} aria-expanded={showAddForm}>
        {t('activity.addEntryButton')}
      </button>
    {/if}
  </div>

  {#if !canAddEntry}
    <p class="restricted-note">{t('activity.restrictedToStaff')}</p>
  {/if}

  {#if successMessage}
    <div class="success-box" role="status"><Icon name="check-circle" size={16} /> {successMessage}</div>
  {/if}

  {#if error}
    <div class="error-msg" role="alert"><Icon name="alert-triangle" size={16} /> {error}</div>
  {/if}

  {#if canAddEntry && showAddForm}
    <form method="POST" action={addEntryAction} class="add-entry-form">
      <div class="field full">
        <label for="progress-description">{t('activity.descriptionLabel')}</label>
        <textarea id="progress-description" name="description" rows="3" required></textarea>
      </div>

      <div class="field">
        <label for="progress-percentage">{t('activity.percentageLabel')}</label>
        <input
          id="progress-percentage"
          name="progress_percentage"
          type="number"
          min="0"
          max="100"
          step="1"
          required
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="primary-btn">{t('activity.submitEntry')}</button>
      </div>
    </form>
  {/if}

  {#if progressEntries.length > 0}
    <div class="activity-list">
      {#each progressEntries as entry (entry.id_progress)}
        <article class="activity-entry">
          <div class="activity-heading">
            <strong>{authorName(entry.id_user)}</strong>
            <span class="activity-date">{t('activity.by')} · {formatDate(entry.created_at)}</span>
          </div>

          <p class="activity-description">{entry.description}</p>

          <div class="progress-row">
            <progress value={entry.progress_percentage} max="100"></progress>
            <span class="progress-value">{entry.progress_percentage}{t('activity.percentageSuffix')}</span>
          </div>

          <div class="comments-block">
            <h3>{t('activity.commentsHeading')}</h3>

            {#if entry.comments && entry.comments.length > 0}
              <ul class="comments-list">
                {#each entry.comments as comment (comment.id_comment)}
                  <li class="comment-item">
                    <div class="comment-meta">
                      <strong>{authorName(comment.id_user)}</strong>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>
                    <p>{comment.content}</p>

                    {#if canManageComment(comment)}
                      <form method="POST" action={deleteCommentAction} onsubmit={handleDeleteCommentSubmit}>
                        <input type="hidden" name="commentId" value={comment.id_comment} />
                        <button type="submit" class="danger-link small">{t('activity.deleteCommentButton')}</button>
                      </form>
                    {/if}
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="comments-empty">{t('activity.commentsEmpty')}</p>
            {/if}

            <form method="POST" action={addCommentAction} class="add-comment-form">
              <input type="hidden" name="id_progress" value={entry.id_progress} />
              <label class="sr-only" for={`comment-${entry.id_progress}`}>{t('activity.addCommentButton')}</label>
              <textarea
                id={`comment-${entry.id_progress}`}
                name="content"
                rows="2"
                placeholder={t('activity.addCommentPlaceholder')}
                required
              ></textarea>
              <button type="submit" class="secondary-link">{t('activity.addCommentButton')}</button>
            </form>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div class="empty-state small">
      <div aria-hidden="true"><Icon name="inbox" size={32} /></div>
      <p>{t('activity.emptyMessage')}</p>
    </div>
  {/if}
</section>

<style>
  .activity-panel {
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

  .restricted-note {
    margin: 0 0 1rem;
    padding: 0.85rem 1rem;
    border-radius: 14px;
    background: var(--sgpa-surface-soft);
    border: 1px solid var(--sgpa-border);
    color: var(--sgpa-text-soft);
    font-size: 0.9rem;
    line-height: 1.5;
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

  .add-entry-form {
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
  .field textarea:focus {
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

  .activity-list {
    display: grid;
    gap: 1rem;
  }

  .activity-entry {
    padding: 1.1rem;
    border-radius: 18px;
    background: var(--sgpa-bg);
    border: 1px solid var(--sgpa-border);
  }

  .activity-heading {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .activity-heading strong {
    color: var(--sgpa-blue-dark);
    font-weight: 950;
  }

  .activity-date {
    color: var(--sgpa-text-soft);
    font-size: 0.82rem;
  }

  .activity-description {
    margin: 0.5rem 0;
    color: var(--sgpa-text);
    line-height: 1.6;
  }

  .progress-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.9rem;
  }

  .progress-row progress {
    flex: 1;
    height: 10px;
    border-radius: 999px;
    accent-color: var(--sgpa-blue);
  }

  .progress-value {
    color: var(--sgpa-blue-dark);
    font-weight: 850;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .comments-block {
    border-top: 1px solid var(--sgpa-border);
    padding-top: 0.9rem;
  }

  .comments-block h3 {
    margin: 0 0 0.6rem;
    color: var(--sgpa-blue-dark);
    font-size: 0.92rem;
    font-weight: 950;
  }

  .comments-empty {
    color: var(--sgpa-text-soft);
    font-size: 0.88rem;
    margin: 0 0 0.75rem;
  }

  .comments-list {
    list-style: none;
    margin: 0 0 0.9rem;
    padding: 0;
    display: grid;
    gap: 0.6rem;
  }

  .comment-item {
    padding: 0.75rem;
    border-radius: 14px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
  }

  .comment-meta {
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .comment-meta strong {
    color: var(--sgpa-blue-dark);
    font-size: 0.88rem;
    font-weight: 900;
  }

  .comment-meta span {
    color: var(--sgpa-text-soft);
    font-size: 0.78rem;
  }

  .comment-item p {
    margin: 0.35rem 0 0.5rem;
    color: var(--sgpa-text);
    line-height: 1.5;
  }

  .danger-link {
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

  .danger-link.small {
    min-height: 36px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .danger-link:hover {
    background: #fecaca;
  }

  .add-comment-form {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .add-comment-form textarea {
    flex: 1;
    min-width: 200px;
    min-height: 44px;
    border: 1px solid var(--sgpa-border);
    border-radius: 14px;
    padding: 0.6rem 0.8rem;
    background: var(--sgpa-surface);
    color: var(--sgpa-text);
    outline: none;
    resize: vertical;
  }

  .add-comment-form textarea:focus {
    border-color: var(--sgpa-blue);
    box-shadow: 0 0 0 4px rgba(11, 45, 105, 0.1);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
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

    .add-entry-form {
      grid-template-columns: 1fr;
    }

    .add-comment-form {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
