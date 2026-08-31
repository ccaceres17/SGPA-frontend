import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeProgress,
  normalizeComment,
  filterProgressByProject,
  filterCommentsByProgressIds,
  attachCommentsToProgress
} from './activity-normalizers.js';

test('normalizeProgress handles the raw tuple shape returned by SELECT *', () => {
  const entry = normalizeProgress([10, 42, 7, 'Halfway done', '50.00', '2026-02-01T00:00:00']);

  assert.equal(entry.id_progress, 10);
  assert.equal(entry.id_project, 42);
  assert.equal(entry.id_user, 7);
  assert.equal(entry.description, 'Halfway done');
  assert.equal(entry.progress_percentage, 50);
});

test('normalizeProgress handles an already-keyed object shape', () => {
  const entry = normalizeProgress({ id_progress: 1, id_project: 42, progress_percentage: '75' });
  assert.equal(entry.progress_percentage, 75);
});

test('normalizeComment handles the raw tuple shape returned by SELECT *', () => {
  const comment = normalizeComment([100, 10, 7, 'Please strengthen the methodology section.', '2026-08-28T00:00:00']);

  assert.equal(comment.id_comment, 100);
  assert.equal(comment.id_progress, 10);
  assert.equal(comment.id_user, 7);
  assert.equal(comment.content, 'Please strengthen the methodology section.');
});

test('filterProgressByProject keeps only the requested project and sorts newest first', () => {
  const entries = [
    { id_progress: 1, id_project: 42, created_at: '2026-01-01T00:00:00' },
    { id_progress: 2, id_project: 99, created_at: '2026-01-05T00:00:00' },
    { id_progress: 3, id_project: 42, created_at: '2026-01-10T00:00:00' }
  ];

  const filtered = filterProgressByProject(entries, 42);

  assert.deepEqual(
    filtered.map((e) => e.id_progress),
    [3, 1]
  );
});

test('filterCommentsByProgressIds only returns comments for the given progress ids', () => {
  const comments = [
    { id_comment: 1, id_progress: 10 },
    { id_comment: 2, id_progress: 20 },
    { id_comment: 3, id_progress: 30 }
  ];

  const filtered = filterCommentsByProgressIds(comments, [10, 30]);

  assert.deepEqual(
    filtered.map((c) => c.id_comment),
    [1, 3]
  );
});

test('filterCommentsByProgressIds returns nothing when no progress ids are given', () => {
  const comments = [{ id_comment: 1, id_progress: 10 }];
  assert.deepEqual(filterCommentsByProgressIds(comments, []), []);
});

test('attachCommentsToProgress joins each entry with only its own comments', () => {
  const entries = [
    { id_progress: 10, description: 'A' },
    { id_progress: 20, description: 'B' }
  ];
  const comments = [
    { id_comment: 1, id_progress: 10 },
    { id_comment: 2, id_progress: 10 },
    { id_comment: 3, id_progress: 20 }
  ];

  const joined = attachCommentsToProgress(entries, comments);

  assert.equal(joined[0].comments.length, 2);
  assert.equal(joined[1].comments.length, 1);
  assert.equal(joined[1].comments[0].id_comment, 3);
});
