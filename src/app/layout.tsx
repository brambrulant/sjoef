import React from 'react';
import type { Metadata } from 'next';
import { LogoutLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import './global.css';
import Providers from './providers.tsx';
import { Navbar } from '@components/Navbar.tsx';

export const metadata: Metadata = {
  title: 'Sjoeffie',
  description: 'sjoefeniering',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = getKindeServerSession();
  return (
    <html lang="en">
      <body className="bg-slate-950">
        <div>
          <Providers>
            {(await isAuthenticated()) && <Navbar />}
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
