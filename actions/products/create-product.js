'use server';
import { auth } from '@/app/auth';
import { nanoid } from 'nanoid';
import { getStore } from '@netlify/blobs';
import { productDao } from '@/backend/dao/dao';
import { revalidatePath } from 'next/cache';

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
  const store = getStore(userId);
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
  const product = {
    pk: nanoid(),
    sk: 'Product',
    name,
    description,
    userId,
    photo: photoKey,
    file: fileKey,
    downloadCount: 0
  };
  const photoBinary = await photo.arrayBuffer();
  const fileBinary = await file.arrayBuffer();
  try {
    await Promise.all([store.set(photoKey, photoBinary), store.set(fileKey, fileBinary)]);
    await productDao.create(product);
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
