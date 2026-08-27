import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyStatusUpdate, classifyMutationError } from './status-update.js';

function httpError(status, message = `Status ${status}`) {
  const error = new Error(message);
  error.status = status;
  return error;
}

test('a successful mutation reports success', async () => {
  let localState = 'Active';

  const result = await applyStatusUpdate(async () => {
    localState = 'In Review'; // simulates the real backend call succeeding
  });

  assert.equal(result.success, true);
  assert.equal(localState, 'In Review');
});

test('a 403 from the backend never produces a success state', async () => {
  const result = await applyStatusUpdate(async () => {
    throw httpError(403, 'Forbidden');
  });

  assert.equal(result.success, false);
  assert.equal(result.status, 403);
  assert.equal(result.errorType, 'forbidden');
  assert.match(result.message, /permission/i);
});

test('a 401 from the backend never produces a success state', async () => {
  const result = await applyStatusUpdate(async () => {
    throw httpError(401, 'Unauthorized');
  });

  assert.equal(result.success, false);
  assert.equal(result.status, 401);
  assert.equal(result.errorType, 'unauthorized');
  assert.match(result.message, /session/i);
});

test('a 404 from the backend is reported as not-found', async () => {
  const result = await applyStatusUpdate(async () => {
    throw httpError(404, 'Not Found');
  });

  assert.equal(result.success, false);
  assert.equal(result.errorType, 'not-found');
});

test('a 422 from the backend is reported as a validation error', async () => {
  const result = await applyStatusUpdate(async () => {
    throw httpError(422, 'Unprocessable Entity');
  });

  assert.equal(result.success, false);
  assert.equal(result.errorType, 'validation');
});

test('a 5xx from the backend is reported as a server error', async () => {
  const result = await applyStatusUpdate(async () => {
    throw httpError(503, 'Service Unavailable');
  });

  assert.equal(result.success, false);
  assert.equal(result.errorType, 'server-error');
});

test('a network failure (no status) is reported as a network error, not success', async () => {
  const result = await applyStatusUpdate(async () => {
    throw new TypeError('fetch failed');
  });

  assert.equal(result.success, false);
  assert.equal(result.status, 0);
  assert.equal(result.errorType, 'network-error');
});

test('a rejected mutation never leaves the caller able to treat it as persisted', async () => {
  // Regression test for the bug found in the health check: the caller used to
  // write a "this succeeded" value into local/cookie state whenever the
  // backend rejected the write. applyStatusUpdate must make that impossible
  // by construction — the caller only ever sees success:false here.
  let uiShowsUpdatedStatus = false;

  const result = await applyStatusUpdate(async () => {
    throw httpError(403, 'Forbidden');
  });

  if (result.success) {
    uiShowsUpdatedStatus = true;
  }

  assert.equal(result.success, false);
  assert.equal(uiShowsUpdatedStatus, false, 'UI state must not be updated when the backend rejected the mutation');
});

test('classifyMutationError maps known statuses to distinct types', () => {
  assert.equal(classifyMutationError(401).type, 'unauthorized');
  assert.equal(classifyMutationError(403).type, 'forbidden');
  assert.equal(classifyMutationError(404).type, 'not-found');
  assert.equal(classifyMutationError(422).type, 'validation');
  assert.equal(classifyMutationError(500).type, 'server-error');
  assert.equal(classifyMutationError(0).type, 'network-error');
});
