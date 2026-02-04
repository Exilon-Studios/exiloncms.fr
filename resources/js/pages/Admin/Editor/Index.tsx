import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { trans } from '@/lib/i18n';

interface Props {
  locales: string[];
  categories: string[];
  defaultLocale: string;
}

export default function EditorIndex({ locales, categories, defaultLocale }: Props) {
  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.documentation.editor.title')} />
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Documentation Editor</h2>
          <p className="text-muted-foreground mb-6">
            The BlockNote editor requires additional packages to be installed.
          </p>
          <p className="text-sm text-muted-foreground">
            Run: npm install @blocknote/core @blocknote/react
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
