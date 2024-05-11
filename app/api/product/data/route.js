import { getStore } from '@netlify/blobs';
import { BLOB_STORE } from '@/constants';

export async function GET(request) {
  const store = getStore(BLOB_STORE);
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const { data, metadata } = await store.getWithMetadata(key, {
    type: 'stream'
  });
  if (!data) {
    return new Response(null, {
      status: 404
    });
  }
  return new Response(data, {
    headers: {
      'Content-Type': metadata.contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
