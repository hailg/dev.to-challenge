'use client';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const userNavigation = [{ name: 'Sign out', href: '#', onclick: () => signOut() }];

const Header = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <form className="relative flex flex-1" action="#" method="GET"></form>
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

        {/* Profile dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="-m-1.5 flex items-center p-1.5">
            <span className="sr-only">Open user menu</span>
            <Image className="h-8 w-8 rounded-full bg-gray-50" width={32} height={32} src={user?.image} alt="" />
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                {user?.name}
              </span>
              <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
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
            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <a
                      href={item.href}
                      className={clsx(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}
                      onClick={item.onclick}
                    >
                      {item.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
