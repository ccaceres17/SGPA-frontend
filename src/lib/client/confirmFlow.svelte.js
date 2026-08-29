/**
 * Shared "confirm, then submit a native form" flow used by every
 * confirm-before-mutating action in the app (status updates, cancel/reactivate
 * project, assign teacher, enroll, enable/disable user).
 *
 * The pattern was previously copy-pasted into five separate components, and
 * four of the five copies never set a loading state before re-submitting —
 * the modal closed instantly with no feedback while the request was still in
 * flight. This factory fixes that once, for every caller: the modal stays
 * open and shows its loading state for the whole native form submission
 * (including the page navigation that follows), instead of closing before
 * the mutation has actually happened.
 */
import { t } from '$lib/stores/locale.svelte.js';

export function createConfirmFlow() {
  const state = $state({
    open: false,
    loading: false,
    title: '',
    message: '',
    details: '',
    confirmText: '',
    variant: 'info'
  });

  let pendingForm = null;
  let allowSubmit = false;

  /** Attach to a form's onsubmit: request(event, { title, message, details, confirmText, variant }) */
  function request(event, config = {}) {
    if (allowSubmit) {
      allowSubmit = false;
      return;
    }

    event.preventDefault();

    pendingForm = event.currentTarget;
    state.title = config.title || t('confirmModal.defaultTitle');
    state.message = config.message || t('confirmModal.defaultMessage');
    state.details = config.details || '';
    state.confirmText = config.confirmText || t('confirmModal.confirm');
    state.variant = config.variant || 'info';
    state.open = true;
  }

  function cancel() {
    if (state.loading) return;

    state.open = false;
    pendingForm = null;
  }

  function confirm() {
    if (!pendingForm) {
      cancel();
      return;
    }

    const formToSubmit = pendingForm;

    pendingForm = null;
    allowSubmit = true;
    state.loading = true;

    formToSubmit.requestSubmit();
  }

  return { state, request, cancel, confirm };
}
