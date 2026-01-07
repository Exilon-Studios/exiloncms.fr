import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { FileText, Save, Loader2, Info } from 'lucide-react';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { trans } from '@/lib/i18n';

interface TermsProps {
  content: string;
}

export default function Terms({ content }: TermsProps) {
  const { data, setData, post, processing, errors } = useForm({
    content: content || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.legal.terms.update'));
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.legal_pages.terms.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                {trans('admin.legal_pages.terms.title')}
              </h1>
              <a
                href="https://docs.exiloncms.fr/legal/cgu"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                title={trans('shop.legal.terms_title')}
              >
                <Info className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
              {trans('admin.legal_pages.terms.description')}
            </p>
          </div>
        </div>

        {/* Editor */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border bg-background">
            <TipTapEditor
              content={data.content}
              onChange={(content) => setData('content', content)}
              placeholder={trans('admin.legal_pages.terms.placeholder')}
              className="min-h-[400px]"
            />
          </div>

          {errors.content && (
            <p className="text-sm text-red-600">{errors.content}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              {trans('admin.legal_pages.terms.cancel')}
            </Button>
            <Button type="submit" disabled={processing} className="gap-2">
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {trans('admin.legal_pages.terms.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {trans('admin.legal_pages.terms.save')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
