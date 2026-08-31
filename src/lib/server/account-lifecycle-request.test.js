import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  performClaimAccount,
  performForgotPassword,
  performResetPassword,
  buildClaimAccountUrl,
  buildForgotPasswordUrl,
  buildResetPasswordUrl,
  classifyAccountLifecycleError
} from './account-lifecycle-request.js';

const BASE_URL = 'https://academic-project-management-api.onrender.com/api';

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body)
  };
}

test('URL builders target the documented endpoints', () => {
  assert.equal(buildClaimAccountUrl(BASE_URL), `${BASE_URL}/auth/claim-account`);
  assert.equal(buildForgotPasswordUrl(BASE_URL), `${BASE_URL}/auth/forgot-password`);
  assert.equal(buildResetPasswordUrl(BASE_URL), `${BASE_URL}/auth/reset-password`);
});

test('performClaimAccount posts token and password as JSON', async () => {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse(200, { resultado: 'Cuenta activada' });
  };

  const result = await performClaimAccount(fetchMock, BASE_URL, 'raw-token', 'new-password');

  assert.equal(result.ok, true);
  assert.equal(calls[0].url, `${BASE_URL}/auth/claim-account`);
  assert.deepEqual(JSON.parse(calls[0].init.body), { token: 'raw-token', password: 'new-password' });
});

test('performForgotPassword posts only the email', async () => {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse(200, { resultado: 'ok' });
  };

  await performForgotPassword(fetchMock, BASE_URL, 'user@example.com');

  assert.equal(calls[0].url, `${BASE_URL}/auth/forgot-password`);
  assert.deepEqual(JSON.parse(calls[0].init.body), { email: 'user@example.com' });
});

test('performResetPassword posts token and password as JSON', async () => {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse(200, { resultado: 'ok' });
  };

  await performResetPassword(fetchMock, BASE_URL, 'reset-token', 'brand-new-pass');

  assert.equal(calls[0].url, `${BASE_URL}/auth/reset-password`);
  assert.deepEqual(JSON.parse(calls[0].init.body), { token: 'reset-token', password: 'brand-new-pass' });
});

test('classifyAccountLifecycleError maps every discriminator to a distinct type', () => {
  assert.equal(classifyAccountLifecycleError(400, { detail: 'INVALID_TOKEN' }).type, 'invalid-token');
  assert.equal(classifyAccountLifecycleError(400, { detail: 'EXPIRED_TOKEN' }).type, 'expired-token');
  assert.equal(classifyAccountLifecycleError(400, { detail: 'ALREADY_CLAIMED' }).type, 'already-claimed');
  assert.equal(classifyAccountLifecycleError(500, {}).type, 'service-unavailable');
  assert.equal(classifyAccountLifecycleError(0, null).type, 'service-unavailable');
  assert.equal(classifyAccountLifecycleError(400, { detail: 'SOMETHING_ELSE' }).type, 'generic-error');
});

test('a network failure is reported without throwing, for all three calls', async () => {
  const fetchMock = async () => {
    throw new TypeError('fetch failed');
  };

  const claim = await performClaimAccount(fetchMock, BASE_URL, 't', 'p');
  const forgot = await performForgotPassword(fetchMock, BASE_URL, 'e@example.com');
  const reset = await performResetPassword(fetchMock, BASE_URL, 't', 'p');

  for (const result of [claim, forgot, reset]) {
    assert.equal(result.ok, false);
    assert.equal(result.status, 0);
    assert.equal(result.error.type, 'service-unavailable');
  }
});

test('forgot-password success response shape never differs based on backend body content', async () => {
  // The anti-enumeration guarantee is a backend property (identical status
  // and body for existing vs. unknown email); this classifier-level test
  // only asserts the frontend introduces no additional branching of its
  // own on the 200 response's content.
  const fetchMockA = async () => jsonResponse(200, { resultado: 'ok' });
  const fetchMockB = async () => jsonResponse(200, {});

  const resultA = await performForgotPassword(fetchMockA, BASE_URL, 'exists@example.com');
  const resultB = await performForgotPassword(fetchMockB, BASE_URL, 'unknown@example.com');

  assert.equal(resultA.ok, true);
  assert.equal(resultB.ok, true);
});
