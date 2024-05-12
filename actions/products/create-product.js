'use server';
import { auth } from '@/app/auth';
import { nanoid } from 'nanoid';
import { getStore } from '@netlify/blobs';
import { productDao, userDao } from '@/backend/dao/dao';
import { revalidatePath } from 'next/cache';
import { BLOB_STORE } from '@/constants';

function getUniqueFileName(fileName) {
  const extension = fileName.split('.').pop();
  return `${nanoid()}.${extension}`;
}

export async function createProduct(formData) {
  const session = await auth();
  if (!session) {
    return {
      error: 'Unauthorized'
    };
  }
  const userId = session.user.email;
  const user = await userDao.get(userId, 'User');
  const store = getStore(BLOB_STORE);
  const name = formData.get('name');
  const description = formData.get('description');
  const photo = formData.get('photo');
  const file = formData.get('file');
  if (!name) {
    return {
      error: 'Product name is required'
    };
  }
  if (!file) {
    return {
      error: 'Product file is required'
    };
  }
  const photoKey = photo ? getUniqueFileName(photo.name) : undefined;
  const fileKey = getUniqueFileName(file.name);
  const productId = nanoid();
  const product = {
    pk: productId,
    sk: 'Product',
    name,
    description,
    userId,
    photo: photoKey,
    file: fileKey,
    fileName: file.name,
    downloadCount: 0
  };
  const photoBinary = await photo.arrayBuffer();
  const fileBinary = await file.arrayBuffer();
  try {
    await Promise.all([
      store.set(photoKey, photoBinary, {
        metadata: { contentType: photo.type, productId, type: 'photo' }
      }),
      store.set(fileKey, fileBinary, {
        metadata: { contentType: file.type, fileName: file.name, productId, type: 'file' }
      })
    ]);
    await Promise.all([
      productDao.create(product),
      userDao.update({
        pk: userId,
        sk: 'User',
        productCount: user.productCount + 1
      })
    ]);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/products');
    return {
      data: {
        product
      }
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'An error occurred while creating the product'
    };
  }
}
