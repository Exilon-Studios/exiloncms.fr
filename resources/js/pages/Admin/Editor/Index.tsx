import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { trans } from '@/lib/i18n';
import { BlockNoteEditor } from '@/components/editor/BlockNoteEditor';

interface Props {
  locales: string[];
  categories: string[];
  defaultLocale: string;
}

export default function EditorIndex({ locales, categories, defaultLocale }: Props) {
  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.documentation.editor.title')} />
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <BlockNoteEditor
          locales={locales}
          categories={categories}
          defaultLocale={defaultLocale}
        />
      </div>
    </AuthenticatedLayout>
  );
}
