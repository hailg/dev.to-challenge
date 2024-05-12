import { getStore } from '@netlify/blobs';
import { BLOB_STORE } from '@/constants';

export async function GET(request, { params }) {
  const slug = params.slug;
  if (!slug) {
    return new Response(null, {
      status: 400
    });
  }
  const store = getStore(BLOB_STORE);
  const blob = await store.getWithMetadata(slug, {
    type: 'stream'
  });
  if (!blob) {
    return new Response(null, {
      status: 404
    });
  }
  const { data, metadata } = blob;
  return new Response(data, {
    headers: {
      'Content-Type': metadata.contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
