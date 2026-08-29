<script>
  import { t } from '$lib/stores/locale.svelte.js';

  export let open = false;
  export let title = '';
  export let message = '';
  export let details = '';
  export let confirmText = '';
  export let cancelText = '';
  export let variant = 'info';
  export let loading = false;
  export let onConfirm = () => {};
  export let onCancel = () => {};

  $: displayTitle = title || t('confirmModal.defaultTitle');
  $: displayMessage = message || t('confirmModal.defaultMessage');
  $: displayConfirmText = confirmText || t('confirmModal.confirm');
  $: displayCancelText = cancelText || t('confirmModal.cancel');

  $: icon =
    variant === 'danger'
      ? '!'
      : variant === 'success'
        ? '✓'
        : variant === 'warning'
          ? '?'
          : 'i';

  $: eyebrow =
    variant === 'danger'
      ? t('confirmModal.eyebrowDanger')
      : variant === 'success'
        ? t('confirmModal.eyebrowSuccess')
        : variant === 'warning'
          ? t('confirmModal.eyebrowWarning')
          : t('confirmModal.eyebrowInfo');

  function closeFromBackdrop(event) {
    if (event.target === event.currentTarget && !loading) {
      onCancel();
    }
  }
</script>

{#if open}
  <div class="modal-backdrop" role="presentation" onclick={closeFromBackdrop}>
    <div
      class="confirm-modal"
      class:danger={variant === 'danger'}
      class:success={variant === 'success'}
      class:warning={variant === 'warning'}
      class:info={variant === 'info'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        class="close-btn"
        aria-label={t('confirmModal.closeModal')}
        onclick={onCancel}
        disabled={loading}
      >
        ×
      </button>

      <div
        class="modal-icon"
        class:danger={variant === 'danger'}
        class:success={variant === 'success'}
        class:warning={variant === 'warning'}
        class:info={variant === 'info'}
      >
        {icon}
      </div>

      <div class="modal-copy">
        <span class="modal-eyebrow">{eyebrow}</span>
        <h2 id="confirm-modal-title">{displayTitle}</h2>
        <p>{displayMessage}</p>

        {#if details}
          <div class="details-box">
            {details}
          </div>
        {/if}
      </div>

      <div class="modal-actions">
        <button
          type="button"
          class="modal-btn cancel"
          onclick={onCancel}
          disabled={loading}
        >
          {displayCancelText}
        </button>

        <button
          type="button"
          class="modal-btn confirm"
          class:danger={variant === 'danger'}
          class:success={variant === 'success'}
          class:warning={variant === 'warning'}
          class:info={variant === 'info'}
          onclick={onConfirm}
          disabled={loading}
        >
          {loading ? t('confirmModal.processing') : displayConfirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    place-items: center;
    padding: 1.25rem;
    background: rgba(5, 15, 35, 0.62);
    animation: fadeIn 0.18s ease both;
  }

  .confirm-modal {
    position: relative;
    width: min(480px, 100%);
    padding: 1.55rem;
    border-radius: 30px;
    background: var(--sgpa-surface-elevated);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-lg);
    color: var(--sgpa-text, #172033);
    animation: modalIn 0.22s ease both;
    overflow: hidden;
  }

  .confirm-modal::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 7px;
    background: var(--sgpa-blue, #0d468d);
  }

  .confirm-modal.danger::before {
    background: var(--sgpa-danger, #dc2626);
  }

  .confirm-modal.success::before {
    background: var(--sgpa-success, #15803d);
  }

  .confirm-modal.warning::before {
    background: var(--sgpa-blue, #0d468d);
  }

  .close-btn {
    position: absolute;
    top: 0.95rem;
    right: 0.95rem;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    color: var(--sgpa-blue-dark, #202f56);
    font-size: 1.4rem;
    line-height: 1;
    font-weight: 850;
    cursor: pointer;
  }

  .close-btn:hover {
    background: rgba(15, 23, 42, 0.14);
  }

  .modal-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    border-radius: 20px;
    margin-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: 950;
    box-shadow: var(--sgpa-shadow-sm, 0 10px 26px rgba(15, 23, 42, 0.08));
  }

  .modal-icon.info,
  .modal-icon.warning {
    background: var(--sgpa-blue-soft, #e8f0ff);
    color: var(--sgpa-blue, #0d468d);
    border: 1px solid rgba(11, 45, 105, 0.14);
  }

  .modal-icon.success {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }

  .modal-icon.danger {
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }

  .modal-copy {
    padding-right: 1.6rem;
  }

  .modal-eyebrow {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 0.45rem;
    padding: 0.34rem 0.72rem;
    border-radius: 999px;
    background: var(--sgpa-yellow-soft, #fff7d6);
    color: var(--sgpa-blue, #0d468d);
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid rgba(242, 183, 5, 0.28);
  }

  h2 {
    margin: 0;
    color: var(--sgpa-blue-dark, #202f56);
    font-size: clamp(1.55rem, 4vw, 2rem);
    line-height: 1.08;
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  p {
    margin: 0.85rem 0 0;
    color: var(--sgpa-text-soft, #64748b);
    line-height: 1.7;
    font-weight: 650;
  }

  .details-box {
    margin-top: 1rem;
    padding: 0.95rem 1rem;
    border-radius: 18px;
    background: var(--sgpa-surface-soft, #f8fafc);
    border: 1px solid var(--sgpa-border, #dbe4f0);
    color: var(--sgpa-blue-dark, #202f56);
    font-weight: 850;
    line-height: 1.55;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin-top: 1.45rem;
  }

  .modal-btn {
    min-height: 44px;
    padding: 0.76rem 1.15rem;
    border-radius: 999px;
    border: none;
    font-weight: 950;
    cursor: pointer;
  }

  .modal-btn:disabled,
  .close-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .modal-btn.cancel {
    background: var(--sgpa-surface);
    color: var(--sgpa-blue, #0d468d);
    border: 1px solid var(--sgpa-border-strong, #c8d7eb);
  }

  .modal-btn.cancel:hover {
    background: var(--sgpa-blue-soft, #e8f0ff);
  }

  .modal-btn.confirm.info,
  .modal-btn.confirm.warning {
    background: var(--sgpa-blue, #0d468d);
    color: #ffffff;
  }

  .modal-btn.confirm.success {
    background: var(--sgpa-success, #15803d);
    color: #ffffff;
  }

  .modal-btn.confirm.danger {
    background: var(--sgpa-danger, #dc2626);
    color: #ffffff;
  }

  .modal-btn:hover {
    transform: translateY(-1px);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 560px) {
    .confirm-modal {
      padding: 1.25rem;
      border-radius: 24px;
    }

    .modal-copy {
      padding-right: 0;
    }

    .modal-actions,
    .modal-btn {
      width: 100%;
    }
  }
</style>