import { auth } from '@/app/auth';
import { SessionProvider } from 'next-auth/react';

import StaticSection from '@/components/dashboard/StaticSection';
import { redirect } from 'next/navigation';

export default async function RootLayout({ children }) {
  const session = await auth();
  if (!session) {
    console.log('No session, redirecting to /');
    redirect('/');
  }
  return (
    <SessionProvider>
      <div>
        <StaticSection />
        <div className="lg:pl-72">
          <main>
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
