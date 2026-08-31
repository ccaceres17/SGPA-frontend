<script>
  import { t } from '$lib/stores/locale.svelte.js';
  import Icon from '$lib/components/icons/Icon.svelte';

  /** @type {'active'|'pending'|'completed'|'cancelled'|'other'} */
  export let category = 'other';
  export let label = '';

  const ICON_BY_CATEGORY = {
    active: 'check-circle',
    pending: 'clock',
    completed: 'check',
    cancelled: 'x-circle',
    other: 'circle'
  };

  $: icon = ICON_BY_CATEGORY[category] || ICON_BY_CATEGORY.other;
  $: displayLabel = label || t(`status.${category}`);
</script>

<span class="status-badge" data-category={category}>
  <span class="status-badge-icon" aria-hidden="true"><Icon name={icon} size={13} strokeWidth={2.5} /></span>
  {displayLabel}
</span>

<style>
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.65rem;
    border-radius: 8px;
    border: 1px solid transparent;
    font-size: 0.8rem;
    font-weight: 800;
    line-height: 1.2;
    white-space: nowrap;
  }

  .status-badge-icon {
    display: inline-flex;
    line-height: 1;
  }

  .status-badge[data-category='active'] {
    background: var(--sgpa-success-bg);
    color: var(--sgpa-success);
    border-color: var(--sgpa-success);
  }

  .status-badge[data-category='pending'] {
    background: var(--sgpa-warning-bg);
    color: var(--sgpa-warning);
    border-color: var(--sgpa-warning);
  }

  .status-badge[data-category='completed'] {
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    border-color: var(--sgpa-blue);
  }

  .status-badge[data-category='cancelled'] {
    background: var(--sgpa-danger-bg);
    color: var(--sgpa-danger);
    border-color: var(--sgpa-danger);
  }

  .status-badge[data-category='other'] {
    background: var(--sgpa-surface-soft);
    color: var(--sgpa-text-soft);
    border-color: var(--sgpa-border-strong);
  }
</style>
