import { fetchDocumentForDownload } from '$lib/server/document-helpers.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, params }) {
  const response = await fetchDocumentForDownload(fetch, params.docId);

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'application/pdf',
      'Content-Disposition': response.headers.get('content-disposition') || 'inline'
    }
  });
}
