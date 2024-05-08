'use client';

import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

import Header from '@/components/dashboard/Header';
import SideBar from '@/components/dashboard/SideBar';

const StaticSection = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

          <Header />
        </div>
      </div>
    </>
  );
};

export default StaticSection;
