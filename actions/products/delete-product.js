'use server';
import { auth } from '@/app/auth';
import { productDao, userDao } from '@/backend/dao/dao';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(productId) {
  const session = await auth();
  if (!session) {
    return {
      error: 'Unauthorized'
    };
  }
  const userId = session.user.email;
  const user = await userDao.get(userId, 'User');
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
    const newProductCount = Math.max(0, user.stats.productCount - 1);
    await Promise.all([
      productDao.delete(productId, 'Product'),
      userDao.update({
        pk: userId,
        sk: 'User',
        productCount: newProductCount
      })
    ]);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/products');
    return {
      data: {
        result: true
      }
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to delete product'
    };
  }
}
