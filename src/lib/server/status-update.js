/**
 * Turns an HTTP failure status into a typed, user-facing outcome. Used so a
 * rejected mutation (401/403/404/422/5xx/network) is always reported as a
 * failure and never mistaken for success.
 *
 * No SvelteKit-specific imports, so this can be exercised directly in tests
 * without going through Vite's module resolution.
 */
export function classifyMutationError(status) {
  const code = Number(status) || 0;

  if (code === 401) {
    return { type: 'unauthorized', message: 'Your session has expired. Please log in again.' };
  }

  if (code === 403) {
    return {
      type: 'forbidden',
      message: 'You do not have permission to perform this action.'
    };
  }

  if (code === 404) {
    return { type: 'not-found', message: 'The project or resource was not found.' };
  }

  if (code === 422) {
    return {
      type: 'validation',
      message: 'The status change was rejected because the data was invalid.'
    };
  }

  if (code >= 500) {
    return {
      type: 'server-error',
      message: 'The server had an internal error while updating the status. Please try again later.'
    };
  }

  if (code === 0) {
    return { type: 'network-error', message: 'Could not connect to the server. Please try again.' };
  }

  return { type: 'error', message: `The status update failed with status ${code}.` };
}

/**
 * Runs a mutation and reports its real outcome. `success` is only ever true
 * when `updateFn` resolves without throwing — a caught error (however it's
 * caught) always produces `success: false` with a classified reason, so the
 * caller can never mistake a rejected write for a persisted one.
 */
export async function applyStatusUpdate(updateFn) {
  try {
    await updateFn();
    return { success: true };
  } catch (error) {
    const status = error?.status;
    const { type, message } = classifyMutationError(status);

    return {
      success: false,
      status: status || 0,
      errorType: type,
      message
    };
  }
}
