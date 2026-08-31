import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatBackendDetail } from './error-format.js';

test('string detail passes through unchanged', () => {
  assert.equal(formatBackendDetail({ detail: 'Email already exists' }), 'Email already exists');
});

test('FastAPI validation-error array is joined into a readable string, never [object Object]', () => {
  const data = {
    detail: [
      { loc: ['body', 'email'], msg: 'field required', type: 'value_error.missing' },
      { loc: ['body', 'password'], msg: 'ensure this value has at least 8 characters', type: 'value_error.any_str.min_length' }
    ]
  };

  const result = formatBackendDetail(data);

  assert.equal(result, 'field required; ensure this value has at least 8 characters');
  assert.doesNotMatch(result, /\[object Object\]/);
});

test('a single object with .msg is extracted', () => {
  assert.equal(formatBackendDetail({ detail: { msg: 'Not found' } }), 'Not found');
});

test('a single object with .message is extracted', () => {
  assert.equal(formatBackendDetail({ message: { message: 'Server error' } }), 'Server error');
});

test('falls back to a safe generic string for null/undefined/empty input', () => {
  assert.equal(formatBackendDetail(null), 'The request could not be completed.');
  assert.equal(formatBackendDetail(undefined), 'The request could not be completed.');
  assert.equal(formatBackendDetail({}), 'The request could not be completed.');
});

test('never returns an object or array directly', () => {
  const result = formatBackendDetail({ detail: [{ weird: 'shape', no_msg_field: true }] });
  assert.equal(typeof result, 'string');
  assert.doesNotMatch(result, /\[object Object\]/);
});

test('data.error string fallback is used when detail/message are absent', () => {
  assert.equal(formatBackendDetail({ error: 'Something failed' }), 'Something failed');
});
