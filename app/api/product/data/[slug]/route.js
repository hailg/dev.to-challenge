import { getStore } from '@netlify/blobs';
import { BLOB_STORE } from '@/constants';
import { productDao, userDao } from '@/backend/dao/dao';

export async function GET(request, { params }) {
  const slug = params.slug;
  if (!slug) {
    return new Response(null, {
      status: 400
    });
  }
  const product = await productDao.get(slug, 'Product');
  if (!product) {
    return new Response(null, {
      status: 404
    });
  }
  const store = getStore(BLOB_STORE);
  const blob = await store.getWithMetadata(product.file, {
    type: 'stream'
  });
  if (!blob) {
    return new Response(null, {
      status: 404
    });
  }
  const user = await userDao.get(product.userId, 'User');
  await Promise.all([
    productDao.update({
      pk: product.pk,
      sk: product.sk,
      downloadCount: product.downloadCount + 1
    }),
    userDao.update({
      pk: user.pk,
      sk: user.sk,
      totalDownloadCount: user.totalDownloadCount + 1
    })
  ]);
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
