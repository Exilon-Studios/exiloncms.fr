import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { trans } from '@/lib/i18n';
import HeroWithSocial from '@/components/HeroWithSocial';
import { PageProps, Server, Post, LandingSettings } from '@/types';

interface HomeProps {
  message?: string;
  siteName?: string;
  server?: Server;
  servers: Server[];
  landingSettings: LandingSettings;
  posts?: Post[];
}

export default function Home({ message, siteName, server, servers, landingSettings, posts = [] }: HomeProps) {
  const { enabledPlugins = [], theme } = usePage<PageProps>().props as any;

  // Check which plugins are enabled
  const isBlogEnabled = enabledPlugins.includes('blog');
  const isShopEnabled = enabledPlugins.includes('shop');

  return (
    <PublicLayout showCart={isShopEnabled}>
      <Head title={trans('messages.pages.title')} />

      {/* Theme-based homepage - each theme can override this */}
      <div className="space-y-12">
        {/* Hero Section */}
        <HeroWithSocial
          siteName={siteName}
          servers={servers}
          showCustomizationNote={false}
        />

        {/* Blog Posts Section - Only shown if Blog plugin is enabled */}
        {isBlogEnabled && posts.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Latest News</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
                  >
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        <a href={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </a>
                      </h3>
                      {(post.excerpt || post.content) && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {post.excerpt || post.content?.substring(0, 150)}
                        </p>
                      )}
                      {post.author && (
                        <div className="text-xs text-muted-foreground">
                          By {post.author.name}
                          {post.published_at && ` • ${new Date(post.published_at).toLocaleDateString()}`}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              {posts.length >= 3 && (
                <div className="mt-8 text-center">
                  <a
                    href="/blog"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                  >
                    View All Posts
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Shop Section - Only shown if Shop plugin is enabled */}
        {isShopEnabled && (
          <section className="py-12 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Visit Our Store</h2>
                <p className="text-muted-foreground">Get exclusive items and ranks</p>
              </div>
              <div className="text-center">
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Browse Shop
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Default Content - Only shown if no plugins with content are enabled */}
        {!isBlogEnabled && !isShopEnabled && (
          <section className="py-12">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to {siteName}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {message || 'Start by installing plugins from the admin panel to add features to your site.'}
              </p>
              <div className="mt-8">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}
