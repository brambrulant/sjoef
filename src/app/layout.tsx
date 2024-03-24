import React from 'react';
import type { Metadata } from 'next';

import './global.css';
import Providers from './providers.tsx';
import { Navbar } from '@components/Navbar.tsx';

export const metadata: Metadata = {
  title: 'Sjoef',
  description: 'Sjoef app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950">
        <div>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
