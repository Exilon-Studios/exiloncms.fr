/**
 * Admin Images Index - Manage uploaded images
 */

import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Image } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Trash2, Image as ImageIcon, Download } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface ImagesIndexProps extends PageProps {
  images: Image[];
}

export default function ImagesIndex({ images }: ImagesIndexProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUploading(true);

    router.post(route('admin.images.store'), formData, {
      onFinish: () => {
        setUploading(false);
        e.currentTarget.reset();
      },
    });
  };

  const deleteImage = (imageId: number) => {
    if (confirm(trans('admin.images.index.confirm_delete'))) {
      router.delete(route('admin.images.destroy', imageId));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.images.index.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.images.index.title')}
            description={trans('admin.images.index.description', { count: images.length })}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Upload Form */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">{trans('admin.images.index.upload_heading')}</h3>
              <form onSubmit={handleUpload} className="flex gap-2">
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  disabled={uploading}
                  className="flex-1"
                />
                <Button type="submit" disabled={uploading}>
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? trans('admin.images.index.uploading') : trans('admin.images.index.upload_button')}
                </Button>
              </form>
            </div>

            {/* Images Grid */}
            {images.length === 0 ? (
              <div className="border border-border rounded-lg p-12 bg-card text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{trans('admin.images.index.no_images')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="border border-border rounded-lg overflow-hidden bg-card"
                  >
                    {/* Image Preview */}
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Image Info */}
                    <div className="p-4">
                      <p className="text-sm font-medium text-card-foreground truncate mb-1">
                        {image.name}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {formatFileSize(image.size)} • {image.mime_type}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <a
                          href={image.url}
                          download={image.name}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-3 w-3 mr-1" />
                            {trans('admin.images.index.download')}
                          </Button>
                        </a>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteImage(image.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Copy URL */}
                      <div className="mt-2">
                        <Input
                          type="text"
                          value={image.url}
                          readOnly
                          onClick={(e) => {
                            e.currentTarget.select();
                            navigator.clipboard.writeText(image.url);
                          }}
                          className="text-xs font-mono cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
