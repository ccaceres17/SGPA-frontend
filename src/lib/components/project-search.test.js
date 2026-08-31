import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesProjectSearch } from './project-search.js';

const row = {
  id_project: 74,
  proyecto_card: '<div class="project-card"><h3>Cybersecurity Research</h3><p>Active</p></div>'
};

test('matches by project ID against the structured row data', () => {
  assert.equal(matchesProjectSearch(row, '74'), true);
});

test('does not match an unrelated numeric term', () => {
  assert.equal(matchesProjectSearch(row, '999'), false);
});

test('matches by project name from the rendered card text', () => {
  assert.equal(matchesProjectSearch(row, 'cybersecurity'), true);
});

test('is case-insensitive', () => {
  assert.equal(matchesProjectSearch(row, 'CYBERSECURITY'), true);
});

test('trims whitespace around the search term', () => {
  assert.equal(matchesProjectSearch(row, '  74  '), true);
});

test('empty search term matches everything', () => {
  assert.equal(matchesProjectSearch(row, ''), true);
  assert.equal(matchesProjectSearch(row, '   '), true);
});

test('does not crash on a row with no id_project', () => {
  const rowWithoutId = { proyecto_card: '<h3>Untitled</h3>' };
  assert.equal(matchesProjectSearch(rowWithoutId, 'untitled'), true);
  assert.equal(matchesProjectSearch(rowWithoutId, '74'), false);
});
