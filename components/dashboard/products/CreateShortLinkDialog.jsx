'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { parse } from 'path';

const CreateShortLinkDialog = ({ open, setOpen, product }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    console.log(data);
    try {
      parseInt(data.duration);
    } catch (error) {
      setErrorMessage('Invalid duration. Please enter a valid integer number.');
      return;
    }
    let duration = parseInt(data.duration);
    if (duration < 0) {
      setErrorMessage('Invalid duration. Please enter a valid integer number.');
      return;
    }
    let unit = data.unit;
    if (unit === 'Hour') {
      duration = duration * 3600;
    } else if (unit === 'Day') {
      duration = duration * 86400;
    }
    if (duration > 180 * 86400) {
      setErrorMessage('Invalid duration. Please enter a duration less than 180 days.');
      return;
    }
    setIsSubmitting(true);
    try {
      // const result = await createShortLink(data);
      // if (!result) {
      //   setErrorMessage('An error occurred while creating the short link. Please try again.');
      // }
      // if (result.error) {
      //   setErrorMessage(result.error);
      // }
      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while creating the short link. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="mx-auto flex items-center justify-center font-display font-semibold text-gray-900">
                  CREATE LINK
                </div>
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
                  <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                      <label htmlFor="duration" className="block text-sm font-medium leading-6 text-gray-900">
                        Expires After:
                      </label>
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          {...register('duration')}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <label htmlFor="unit" className="sr-only">
                            Duration Unit
                          </label>
                          <select
                            className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            {...register('unit')}
                          >
                            <option>Second</option>
                            <option>Hour</option>
                            <option>Day</option>
                          </select>
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
                      {isSubmitting ? 'Creating Link...' : 'Create Link'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => {
                        reset();
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateShortLinkDialog;
