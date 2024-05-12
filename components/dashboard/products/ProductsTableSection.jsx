'use client';
import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import dayjs from '@/common/dayjs';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { CheckIcon, LinkIcon, PencilSquareIcon, TrashIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import CreateProductDialog from './CreateProductDialog';
import SimpleDialog from '@/components/simple-dialog';
import CreateShortLinkDialog from './CreateShortLinkDialog';
import DeleteProduct from './DeleteProduct';
import UpdateProductDialog from './UpdateProductDialog';

const ProductsTableSection = ({ products }) => {
  const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false);
  const [showSimpleDialog, setShowSimpleDialog] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [showCreateShortLinkDialog, setShowCreateShortLinkDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [showDeleteProductDialog, setShowDeleteProductDialog] = useState(false);
  const [showUpdateProductDialog, setShowUpdateProductDialog] = useState(false);

  const showDialogWithMessage = (title, message, closeText = 'Close') => {
    setDialogInfo({
      icon: <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />,
      title: title,
      children: message,
      closeText: closeText
    });
    setShowSimpleDialog(true);
  };

  const showCreateShortLinkDialogForProduct = (product) => {
    setSelectedProduct(product);
    setShowCreateShortLinkDialog(true);
  };

  const showDeleteProductDialogForProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteProductDialog(true);
  };

  const showUpdateProductDialogForProduct = (product) => {
    setSelectedProduct(product);
    setShowUpdateProductDialog(true);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Products</h1>
            <p className="mt-2 text-sm text-gray-700">All the amazing products in your account are here.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => setCreateProductDialogOpen(true)}
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Product
            </button>
          </div>
        </div>
        <div className="-mx-4 mt-8 sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Description
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Download
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  File
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Created At
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product) => (
                <tr key={product.pk}>
                  <td className="w-full max-w-0 py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    <div className="flex items-center">
                      <div className="h-11 w-11 flex-shrink-0">
                        {product.image ? (
                          <Image className="h-11 w-11 rounded-full" width={44} height={44} src={product.image} alt="" />
                        ) : (
                          <span className="w11 flex h-11 shrink-0 items-center justify-center rounded-full bg-gray-500 text-[0.625rem] font-medium text-gray-200 group-hover:text-white">
                            {product.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-2 text-sm text-gray-500 lg:table-cell">{product.description}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{product.downloadCount}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <a href={product.downloadLink} target="_blank" rel="noreferrer">
                        {product.fileName}
                      </a>
                    </span>
                    <button
                      type="button"
                      className="border-none bg-none p-3"
                      onClick={() => {
                        navigator.clipboard.writeText(product.downloadLink);
                        showDialogWithMessage('Well Done', `Link for ${[product.name]} copied to clipboard`);
                      }}
                    >
                      <ClipboardIcon className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </td>
                  <td className="hidden px-3 py-2 text-sm text-gray-500 lg:table-cell">
                    {dayjs(product.createdAt).format('L LT')}
                  </td>
                  <td className="py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Menu as="div" className="relative">
                      <Menu.Button className="-m-1.5 flex items-center p-1.5">
                        <span className="sr-only">Open product menu</span>
                        <span className="lg:flex lg:items-center">
                          <button
                            type="button"
                            className="rounded bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                          >
                            Action <span className="sr-only">for {product.name}</span>
                          </button>
                        </span>
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => showCreateShortLinkDialogForProduct(product)}
                                className={clsx(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'group flex w-full items-center border-none px-4 py-2 text-sm'
                                )}
                              >
                                <LinkIcon
                                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                                Create short-live link
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => showUpdateProductDialogForProduct(product)}
                                className={clsx(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'group flex w-full items-center border-none px-4 py-2 text-sm'
                                )}
                              >
                                <PencilSquareIcon
                                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                                Update Product
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  showDeleteProductDialogForProduct(product);
                                }}
                                className={clsx(
                                  active ? 'bg-gray-100 text-red-900' : 'text-red-700',
                                  'group flex w-full items-center border-none px-4 py-2 text-sm'
                                )}
                              >
                                <TrashIcon
                                  className="mr-3 h-5 w-5 text-red-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                                Delete Product
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateProductDialog open={createProductDialogOpen} setOpen={setCreateProductDialogOpen} />
      <SimpleDialog open={showSimpleDialog} setOpen={setShowSimpleDialog} {...dialogInfo} />
      <CreateShortLinkDialog
        open={showCreateShortLinkDialog}
        setOpen={setShowCreateShortLinkDialog}
        product={selectedProduct}
      />
      <UpdateProductDialog
        open={showUpdateProductDialog}
        setOpen={setShowUpdateProductDialog}
        product={selectedProduct}
      />
      <DeleteProduct open={showDeleteProductDialog} setOpen={setShowDeleteProductDialog} product={selectedProduct} />
    </>
  );
};

export default ProductsTableSection;
