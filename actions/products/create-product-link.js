'use server';
import { auth } from '@/app/auth';
import { nanoid } from 'nanoid';
import { productDao, productLinkDao } from '@/backend/dao/dao';

export async function createProductLink(productId, duration) {
  const session = await auth();
  if (!session) {
    return {
      error: 'Unauthorized'
    };
  }
  const userId = session.user.email;
  const product = await productDao.get(productId, 'Product');
  if (!product) {
    return {
      error: 'Product not found'
    };
  }
  if (product.userId !== userId) {
    return {
      error: 'Unauthorized'
    };
  }
  try {
    const linkId = nanoid();
    const now = new Date();
    const productLink = {
      pk: linkId,
      sk: 'ProductLink',
      productId: product.pk,
      link: `${process.env.BASE_URL}/api/d/${linkId}`,
      createdAt: now.getTime(),
      expiresAt: now.getTime() + duration * 1000,
      expiredAt: Math.floor((now.getTime() + duration * 1000) / 1000)
    };
    await productLinkDao.create(productLink);
    return {
      data: {
        productLink
      }
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to create product link'
    };
  }
}
