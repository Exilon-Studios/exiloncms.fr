import { Head } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Page } from '@/types';

interface Props {
  page: Page;
}

export default function PageShow({ page }: Props) {
  return (
    <GuestLayout>
      <Head title={page.title} />

      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {page.title}
              </h1>
              {page.description && (
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                  {page.description}
                </p>
              )}
            </header>

            <div
              className="mt-8 text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
        </div>
      </div>
    </GuestLayout>
  );
}
