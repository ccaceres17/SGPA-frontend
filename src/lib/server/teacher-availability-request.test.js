import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  performCreateAvailability,
  performListOwnAvailability,
  performListAvailabilityForTeacher,
  performDeleteAvailability,
  buildCreateAvailabilityUrl,
  buildOwnAvailabilityUrl,
  buildAvailabilityForTeacherUrl,
  buildDeleteAvailabilityUrl
} from './teacher-availability-request.js';

const BASE_URL = 'https://academic-project-management-api.onrender.com/api';

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body)
  };
}

test('URL builders target the documented endpoints', () => {
  assert.equal(buildCreateAvailabilityUrl(BASE_URL), `${BASE_URL}/teacher-availability`);
  assert.equal(buildOwnAvailabilityUrl(BASE_URL), `${BASE_URL}/teacher-availability/me`);
  assert.equal(buildAvailabilityForTeacherUrl(BASE_URL, 7), `${BASE_URL}/teacher-availability/7`);
  assert.equal(buildDeleteAvailabilityUrl(BASE_URL, 3), `${BASE_URL}/teacher-availability/3`);
});

test('performCreateAvailability posts the slot as JSON', async () => {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse(200, { result: 'Availability slot created', id_availability: 1 });
  };

  const slot = { day_of_week: 0, start_time: '08:00:00', end_time: '12:00:00' };
  const result = await performCreateAvailability(fetchMock, BASE_URL, slot);

  assert.equal(result.ok, true);
  assert.equal(calls[0].url, `${BASE_URL}/teacher-availability`);
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].init.body), slot);
});

test('performListOwnAvailability issues a GET to /teacher-availability/me', async () => {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse(200, []);
  };

  await performListOwnAvailability(fetchMock, BASE_URL);

  assert.equal(calls[0].url, `${BASE_URL}/teacher-availability/me`);
});

test('performListAvailabilityForTeacher targets the given teacher id', async () => {
  const calls = [];
  const fetchMock = async (url) => {
    calls.push(url);
    return jsonResponse(200, []);
  };

  await performListAvailabilityForTeacher(fetchMock, BASE_URL, 42);

  assert.equal(calls[0], `${BASE_URL}/teacher-availability/42`);
});

test('performDeleteAvailability issues a DELETE to the slot id', async () => {
  const calls = [];
  const fetchMock = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse(200, { result: 'Availability slot deleted' });
  };

  const result = await performDeleteAvailability(fetchMock, BASE_URL, 5);

  assert.equal(result.ok, true);
  assert.equal(calls[0].url, `${BASE_URL}/teacher-availability/5`);
  assert.equal(calls[0].init.method, 'DELETE');
});

test('a non-ok response is reported without throwing', async () => {
  const fetchMock = async () => jsonResponse(409, { detail: 'This slot overlaps with an existing availability slot' });

  const result = await performCreateAvailability(fetchMock, BASE_URL, {
    day_of_week: 0,
    start_time: '08:00:00',
    end_time: '12:00:00'
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 409);
});

test('a network failure is reported without throwing', async () => {
  const fetchMock = async () => {
    throw new Error('network down');
  };

  const result = await performListOwnAvailability(fetchMock, BASE_URL);

  assert.equal(result.ok, false);
  assert.equal(result.status, 0);
});
