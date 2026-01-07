/**
 * Guest Layout - For login, register pages
 * Type-safe, minimal, centered
 */

import { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function GuestLayout({ children }: PropsWithChildren) {
  const { settings } = usePage<PageProps>().props;
  const siteName = settings?.name || 'ExilonCMS';
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="text-4xl font-bold">{siteName}</h1>
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          © {currentYear} {siteName}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
