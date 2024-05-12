'use server';
import { auth } from '@/app/auth';
import { nanoid } from 'nanoid';
import { getStore } from '@netlify/blobs';
import { productDao } from '@/backend/dao/dao';
import { revalidatePath } from 'next/cache';
import { BLOB_STORE } from '@/constants';

function getUniqueFileName(fileName) {
  const extension = fileName.split('.').pop();
  return `${nanoid()}.${extension}`;
}

export async function updateProduct(productId, formData) {
  const session = await auth();
  if (!session) {
    return {
      error: 'Unauthorized'
    };
  }
  const userId = session.user.email;
  const currentProduct = await productDao.get(productId, 'Product');
  if (!currentProduct) {
    return {
      error: 'Product not found'
    };
  }
  if (currentProduct.userId !== userId) {
    return {
      error: 'Unauthorized'
    };
  }
  const store = getStore(BLOB_STORE);
  const name = formData.get('name');
  const description = formData.get('description');
  const photo = formData.get('photo');
  const file = formData.get('file');

  try {
    if (name) {
      currentProduct.name = name;
    }
    if (description) {
      currentProduct.description = description;
    }
    if (photo) {
      if (currentProduct.photo) {
        await store.delete(currentProduct.photo);
      }
      const photoKey = getUniqueFileName(photo.name);
      const photoBinary = await photo.arrayBuffer();
      await store.set(photoKey, photoBinary, {
        metadata: { contentType: photo.type, productId, type: 'photo' }
      });
      currentProduct.photo = photoKey;
    }
    if (file) {
      if (currentProduct.file) {
        await store.delete(currentProduct.file);
      }
      const fileKey = getUniqueFileName(file.name);
      const fileBinary = await file.arrayBuffer();
      await store.set(fileKey, fileBinary, {
        metadata: { contentType: file.type, fileName: file.name, productId, type: 'file' }
      });
      currentProduct.file = fileKey;
      currentProduct.fileName = file.name;
    }
    await productDao.update(currentProduct);
    revalidatePath('/dashboard/products');
    return {
      data: {
        currentProduct
      }
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'An error occurred while updating the product'
    };
  }
}
