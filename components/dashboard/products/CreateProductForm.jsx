'use client';

import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useDropzone } from 'react-dropzone';
import { createProduct } from '@/actions/products/create-product';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const CreateProductForm = ({ onClose }) => {
  const { register, handleSubmit, reset } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productPhoto, setProductPhoto] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const photoDropZone = useDropzone({
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    accept: { 'image/*': [] },
    onDropAccepted: (files, e) => {
      if (files.length > 0) {
        setProductPhoto(files[0]);
      }
    }
  });

  const productDropZone = useDropzone({
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    onDropAccepted: (files, e) => {
      if (files.length > 0) {
        setProductFile(files[0]);
      }
    }
  });

  const productPhotoStyle = useMemo(
    () => ({
      ...baseStyle,
      ...(photoDropZone.isFocused ? focusedStyle : {}),
      ...(photoDropZone.isDragAccept ? acceptStyle : {}),
      ...(photoDropZone.isDragReject ? rejectStyle : {})
    }),
    [photoDropZone.isFocused, photoDropZone.isDragAccept, photoDropZone.isDragReject]
  );

  const productFileStyle = useMemo(
    () => ({
      ...baseStyle,
      ...(productDropZone.isFocused ? focusedStyle : {}),
      ...(productDropZone.isDragAccept ? acceptStyle : {}),
      ...(productDropZone.isDragReject ? rejectStyle : {})
    }),
    [productDropZone.isFocused, productDropZone.isDragAccept, productDropZone.isDragReject]
  );

  const onSubmit = async (data) => {
    if (!productFile) {
      setErrorMessage('Please select a product file.');
      return;
    }
    if (!data.name) {
      setErrorMessage('Please enter a product name.');
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('file', productFile);
    formData.append('photo', productPhoto);
    try {
      const result = await createProduct(formData);
      if (!result) {
        setErrorMessage('An error occurred while creating the product. Please try again.');
      }
      if (result.error) {
        setErrorMessage(result.error);
      }
      reset();
      setProductPhoto(null);
      setProductFile(null);
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while creating the product. Please try again.');
    }
    setIsSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && (
        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="col-span-full">
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            Product Name
          </label>
          <div className="mt-2">
            <div className="block w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
              <input
                type="text"
                autoComplete="given-name"
                autoCorrect="false"
                inputMode="text"
                autoCapitalize="words"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="My Cool Product"
                {...register('name')}
              />
            </div>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
            Product Description
          </label>
          <div className="mt-2">
            <textarea
              rows={2}
              autoCapitalize="sentences"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={''}
              placeholder="Say something about your product..."
              {...register('description')}
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
            Product Photo
          </label>
          <div className="mt-2 flex items-center justify-center gap-x-3">
            <div {...photoDropZone.getRootProps({ style: productPhotoStyle })}>
              <input {...photoDropZone.getInputProps()} />
              <p>
                {productPhoto ? productPhoto.name : "Drag 'n' drop a product photo here, or click to select a photo"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900">
            Product File
          </label>
          <div className="mt-2 flex items-center justify-center gap-x-3">
            <div {...productDropZone.getRootProps({ style: productFileStyle })}>
              <input {...productDropZone.getInputProps()} />
              <p>{productFile ? productFile.name : "Drag 'n' drop a product file here, or click to select a file"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
          aria-disabled={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Product...' : 'Create Product'}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          onClick={() => {
            reset();
            setProductFile(null);
            setProductPhoto(null);
            if (onClose) {
              onClose();
            }
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateProductForm;
