import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDocument, normalizeDocumentType, filterDocumentsByProject } from './document-normalizers.js';

test('normalizeDocument handles the raw tuple shape returned by SELECT *', () => {
  const doc = normalizeDocument([
    1,
    42,
    7,
    2,
    'Final report.pdf',
    'https://drive.example/abc',
    'Final version',
    '2026-01-01T00:00:00'
  ]);

  assert.equal(doc.id_document, 1);
  assert.equal(doc.id_project, 42);
  assert.equal(doc.id_user, 7);
  assert.equal(doc.id_document_type, 2);
  assert.equal(doc.file_name, 'Final report.pdf');
  assert.equal(doc.file_path, 'https://drive.example/abc');
  assert.equal(doc.description, 'Final version');
});

test('normalizeDocument handles an already-keyed object shape', () => {
  const doc = normalizeDocument({
    id_document: 5,
    id_project: 42,
    file_name: 'Report.pdf',
    file_path: 'https://example.com/report.pdf'
  });

  assert.equal(doc.id_document, 5);
  assert.equal(doc.id_project, 42);
  assert.equal(doc.file_name, 'Report.pdf');
});

test('normalizeDocument defaults missing fields to safe empty values', () => {
  const doc = normalizeDocument({});

  assert.equal(doc.id_document, null);
  assert.equal(doc.file_name, '');
  assert.equal(doc.file_path, '');
});

test('normalizeDocumentType handles both tuple and object shapes', () => {
  const fromTuple = normalizeDocumentType([1, 'Report', 'A written report']);
  assert.equal(fromTuple.id_document_type, 1);
  assert.equal(fromTuple.document_type_name, 'Report');

  const fromObject = normalizeDocumentType({ id_document_type: 2, document_type_name: 'Poster' });
  assert.equal(fromObject.id_document_type, 2);
  assert.equal(fromObject.document_type_name, 'Poster');
});

test('filterDocumentsByProject keeps only the requested project, regardless of id type', () => {
  const documents = [
    { id_document: 1, id_project: 42 },
    { id_document: 2, id_project: 99 },
    { id_document: 3, id_project: '42' }
  ];

  const filtered = filterDocumentsByProject(documents, 42);

  assert.deepEqual(
    filtered.map((d) => d.id_document),
    [1, 3]
  );
});

test('filterDocumentsByProject never leaks another project\'s documents', () => {
  const documents = [
    { id_document: 1, id_project: 10 },
    { id_document: 2, id_project: 20 }
  ];

  const filtered = filterDocumentsByProject(documents, 10);

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id_document, 1);
});
