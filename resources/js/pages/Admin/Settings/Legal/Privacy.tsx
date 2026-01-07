import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Shield, Save, Loader2, Info } from 'lucide-react';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { trans } from '@/lib/i18n';

interface PrivacyProps {
  content: string;
}

export default function Privacy({ content }: PrivacyProps) {
  const { data, setData, post, processing, errors } = useForm({
    content: content || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.legal.privacy.update'));
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.legal_pages.privacy.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                {trans('admin.legal_pages.privacy.title')}
              </h1>
              <a
                href="https://docs.exiloncms.fr/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                title={trans('shop.legal.privacy_title')}
              >
                <Info className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
              {trans('admin.legal_pages.privacy.description')}
            </p>
          </div>
        </div>

        {/* Editor */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border bg-background">
            <TipTapEditor
              content={data.content}
              onChange={(content) => setData('content', content)}
              placeholder={trans('admin.legal_pages.privacy.placeholder')}
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
              {trans('admin.legal_pages.privacy.cancel')}
            </Button>
            <Button type="submit" disabled={processing} className="gap-2">
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {trans('admin.legal_pages.privacy.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {trans('admin.legal_pages.privacy.save')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
