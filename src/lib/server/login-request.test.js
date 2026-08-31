import { test } from 'node:test';
import assert from 'node:assert/strict';
import { performLogin, buildLoginUrl, buildLoginRequestInit, classifyLoginError } from './login-request.js';

const BASE_URL = 'https://academic-project-management-api.onrender.com/api';

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body)
  };
}

test('login request is sent as a single JSON POST with no fallback attempts', async () => {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse(200, { access_token: 'abc123', user: { id_user: 1, role: 'coordinator' } });
  };

  await performLogin(fetchMock, BASE_URL, 'user@example.com', 'super-secret');

  assert.equal(calls.length, 1, 'expected exactly one request — no query-string or form fallback attempts');

  const { url, init } = calls[0];

  assert.equal(url, `${BASE_URL}/auth/login`);
  assert.equal(init.method, 'POST');
  assert.equal(init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(init.body), { email: 'user@example.com', password: 'super-secret' });
});

test('the password never appears in the request URL', async () => {
  const password = 'correct horse battery staple';
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push(url);
    return jsonResponse(200, { access_token: 'abc123', user: { id_user: 1, role: 'coordinator' } });
  };

  await performLogin(fetchMock, BASE_URL, 'user@example.com', password);

  for (const url of calls) {
    assert.ok(!url.includes(password), `password leaked into URL: ${url}`);
    assert.ok(!url.includes('user@example.com'), `email leaked into URL: ${url}`);
    assert.ok(!url.includes('?'), `login URL should carry no query string, got: ${url}`);
  }
});

test('a successful login returns the parsed token and user payload', async () => {
  const fetchMock = async () =>
    jsonResponse(200, { access_token: 'jwt-token', user: { id_user: 7, role: 'teacher' } });

  const result = await performLogin(fetchMock, BASE_URL, 'teacher@example.com', 'password123');

  assert.equal(result.ok, true);
  assert.equal(result.status, 200);
  assert.equal(result.data.access_token, 'jwt-token');
  assert.equal(result.data.user.id_user, 7);
});

test('invalid credentials (401) are reported as a friendly, non-leaking error', async () => {
  const fetchMock = async () => jsonResponse(401, { detail: 'Unauthorized' });

  const result = await performLogin(fetchMock, BASE_URL, 'user@example.com', 'wrong-password');

  assert.equal(result.ok, false);
  assert.equal(result.status, 401);
  assert.equal(result.error.type, 'invalid-credentials');
  assert.equal(result.error.message, 'Unable to sign in with the credentials provided.');
  assert.ok(!result.error.message.includes('wrong-password'), 'error message must not echo the password');
});

test('validation errors (422) are reported without leaking API/format details', async () => {
  const fetchMock = async () => jsonResponse(422, { detail: 'email: field required' });

  const result = await performLogin(fetchMock, BASE_URL, '', 'password123');

  assert.equal(result.ok, false);
  assert.equal(result.status, 422);
  assert.equal(result.error.type, 'invalid-credentials');
  assert.equal(result.error.message, 'Unable to sign in with the credentials provided.');
  assert.ok(!/api/i.test(result.error.message), 'error message must not mention the API');
});

test('a network failure is reported without throwing', async () => {
  const fetchMock = async () => {
    throw new TypeError('fetch failed');
  };

  const result = await performLogin(fetchMock, BASE_URL, 'user@example.com', 'password123');

  assert.equal(result.ok, false);
  assert.equal(result.status, 0);
  assert.equal(result.error.type, 'service-unavailable');
  assert.equal(
    result.error.message,
    'The service is temporarily unavailable. Please try again shortly.'
  );
});

test('a 5xx server error is reported as a service-unavailable error', async () => {
  const fetchMock = async () => jsonResponse(500, { detail: 'internal error' });

  const result = await performLogin(fetchMock, BASE_URL, 'user@example.com', 'password123');

  assert.equal(result.ok, false);
  assert.equal(result.error.type, 'service-unavailable');
  assert.equal(
    result.error.message,
    'The service is temporarily unavailable. Please try again shortly.'
  );
});

test('buildLoginUrl targets the documented C4 endpoint with no query string', () => {
  assert.equal(buildLoginUrl(BASE_URL), `${BASE_URL}/auth/login`);
});

test('buildLoginRequestInit never includes credentials outside the JSON body', () => {
  const init = buildLoginRequestInit('user@example.com', 'super-secret');

  assert.equal(init.method, 'POST');
  assert.equal(init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(init.body), { email: 'user@example.com', password: 'super-secret' });
  assert.equal(Object.prototype.hasOwnProperty.call(init, 'url'), false);
});

test('classifyLoginError maps status codes to distinct, non-leaking { type, message } outcomes', () => {
  assert.deepEqual(classifyLoginError(401, null), {
    type: 'invalid-credentials',
    message: 'Unable to sign in with the credentials provided.'
  });
  assert.deepEqual(classifyLoginError(403, null), {
    type: 'forbidden',
    message: 'You do not have permission to access the system.'
  });
  assert.deepEqual(classifyLoginError(422, null), {
    type: 'invalid-credentials',
    message: 'Unable to sign in with the credentials provided.'
  });
  assert.deepEqual(classifyLoginError(500, null), {
    type: 'service-unavailable',
    message: 'The service is temporarily unavailable. Please try again shortly.'
  });
  assert.deepEqual(classifyLoginError(0, null), {
    type: 'service-unavailable',
    message: 'The service is temporarily unavailable. Please try again shortly.'
  });
});

test('classifyLoginError distinguishes a never-claimed invited account from a disabled one', () => {
  const notClaimed = classifyLoginError(403, { detail: 'ACCOUNT_NOT_CLAIMED' });
  assert.equal(notClaimed.type, 'account-not-claimed');

  const disabled = classifyLoginError(403, { detail: 'ACCOUNT_DISABLED' });
  assert.equal(disabled.type, 'account-disabled');

  // A plain 403 with no discriminator still falls through to the existing
  // generic forbidden branch, unchanged.
  const genericForbidden = classifyLoginError(403, null);
  assert.equal(genericForbidden.type, 'forbidden');
});

test('a 403 ACCOUNT_NOT_CLAIMED response is classified correctly end-to-end through performLogin', async () => {
  const fetchMock = async () => jsonResponse(403, { detail: 'ACCOUNT_NOT_CLAIMED' });

  const result = await performLogin(fetchMock, BASE_URL, 'invitee@example.com', 'whatever');

  assert.equal(result.ok, false);
  assert.equal(result.error.type, 'account-not-claimed');
});
