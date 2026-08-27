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
  assert.equal(result.error, 'Incorrect credentials.');
  assert.ok(!result.error.includes('wrong-password'), 'error message must not echo the password');
});

test('validation errors (422) are reported distinctly from credential errors', async () => {
  const fetchMock = async () => jsonResponse(422, { detail: 'email: field required' });

  const result = await performLogin(fetchMock, BASE_URL, '', 'password123');

  assert.equal(result.ok, false);
  assert.equal(result.status, 422);
  assert.equal(result.error, 'The login request format is not accepted by the API.');
});

test('a network failure is reported without throwing', async () => {
  const fetchMock = async () => {
    throw new TypeError('fetch failed');
  };

  const result = await performLogin(fetchMock, BASE_URL, 'user@example.com', 'password123');

  assert.equal(result.ok, false);
  assert.equal(result.status, 0);
  assert.equal(result.error, 'Could not connect to the server. Please try again.');
});

test('a 5xx server error is reported as a server error', async () => {
  const fetchMock = async () => jsonResponse(500, { detail: 'internal error' });

  const result = await performLogin(fetchMock, BASE_URL, 'user@example.com', 'password123');

  assert.equal(result.ok, false);
  assert.equal(result.error, 'The server had an internal error. Please try again later.');
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

test('classifyLoginError maps status codes to distinct, non-leaking messages', () => {
  assert.equal(classifyLoginError(401, null), 'Incorrect credentials.');
  assert.equal(classifyLoginError(403, null), 'You do not have permission to access the system.');
  assert.equal(classifyLoginError(422, null), 'The login request format is not accepted by the API.');
  assert.equal(classifyLoginError(500, null), 'The server had an internal error. Please try again later.');
  assert.equal(classifyLoginError(0, null), 'Could not connect to the server. Please try again.');
});
