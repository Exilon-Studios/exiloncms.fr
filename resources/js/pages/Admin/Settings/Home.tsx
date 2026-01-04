/**
 * Admin Settings - Homepage Configuration
 */

import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutContent,
  AdminLayoutFooter
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HomeSettingsProps extends PageProps {
  settings: {
    home_title: string;
    home_subtitle: string;
    home_description: string;
    home_display_servers: boolean;
    home_display_posts: boolean;
    home_posts_limit: string;
  };
}

export default function HomeSettings({ settings }: HomeSettingsProps) {
  const { data, setData, put, processing, errors } = useForm({
    home_title: settings.home_title,
    home_subtitle: settings.home_subtitle,
    home_description: settings.home_description,
    home_display_servers: settings.home_display_servers,
    home_display_posts: settings.home_display_posts,
    home_posts_limit: settings.home_posts_limit,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.settings.home.update'));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Homepage Settings" />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title="Homepage Settings"
            description="Customize your homepage content and layout"
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">Homepage Content</h3>
            <form onSubmit={handleSubmit} className="space-y-6" id="home-form">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="home_title">Homepage Title</Label>
                <Input
                  id="home_title"
                  type="text"
                  value={data.home_title}
                  onChange={(e) => setData('home_title', e.target.value)}
                  placeholder="Welcome to Our Server"
                />
                {errors.home_title && (
                  <p className="text-sm text-destructive">{errors.home_title}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Main heading displayed on the homepage
                </p>
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label htmlFor="home_subtitle">Homepage Subtitle</Label>
                <Input
                  id="home_subtitle"
                  type="text"
                  value={data.home_subtitle}
                  onChange={(e) => setData('home_subtitle', e.target.value)}
                  placeholder="Join the adventure today!"
                />
                {errors.home_subtitle && (
                  <p className="text-sm text-destructive">{errors.home_subtitle}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Subheading or tagline below the main title
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="home_description">Homepage Description</Label>
                <Textarea
                  id="home_description"
                  value={data.home_description}
                  onChange={(e) => setData('home_description', e.target.value)}
                  placeholder="Describe your server and community..."
                  rows={4}
                />
                {errors.home_description && (
                  <p className="text-sm text-destructive">{errors.home_description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Detailed description shown on the homepage
                </p>
              </div>

              {/* Display Servers */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="home_display_servers"
                    type="checkbox"
                    checked={data.home_display_servers}
                    onChange={(e) => setData('home_display_servers', e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="home_display_servers" className="cursor-pointer">
                    Display Server Status
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Show server status and player counts on the homepage
                </p>
                {errors.home_display_servers && (
                  <p className="text-sm text-destructive ml-6">{errors.home_display_servers}</p>
                )}
              </div>

              {/* Display Posts */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="home_display_posts"
                    type="checkbox"
                    checked={data.home_display_posts}
                    onChange={(e) => setData('home_display_posts', e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="home_display_posts" className="cursor-pointer">
                    Display Recent Posts
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Show latest news and announcements on the homepage
                </p>
                {errors.home_display_posts && (
                  <p className="text-sm text-destructive ml-6">{errors.home_display_posts}</p>
                )}
              </div>

              {/* Posts Limit */}
              {data.home_display_posts && (
                <div className="space-y-2">
                  <Label htmlFor="home_posts_limit">Number of Posts to Display</Label>
                  <Select
                    value={data.home_posts_limit}
                    onValueChange={(value) => setData('home_posts_limit', value)}
                  >
                    <SelectTrigger id="home_posts_limit" className="max-w-xs">
                      <SelectValue placeholder="Select number of posts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 posts</SelectItem>
                      <SelectItem value="5">5 posts</SelectItem>
                      <SelectItem value="10">10 posts</SelectItem>
                      <SelectItem value="15">15 posts</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.home_posts_limit && (
                    <p className="text-sm text-destructive">{errors.home_posts_limit}</p>
                  )}
                </div>
              )}
            </form>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <div></div>
          <Button type="submit" form="home-form" disabled={processing}>
            {processing ? 'Saving...' : 'Save Changes'}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
