/**
 * Blog Index Page
 * Lists all blog posts with pagination
 */

import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import BlogThemeLayout from '@/layouts/BlogLayout';
import { Link } from '@inertiajs/react';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  content?: string;
  published_at?: string;
  author?: {
    name: string;
  };
  category?: {
    name: string;
    slug: string;
  };
}

interface Paginator {
  data: BlogPost[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

interface BlogIndexProps {
  posts: Paginator;
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <BlogThemeLayout showCart={false}>
      <Head title="Blog" />

      {/* Hero Section - simplified for blog listing */}
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos derniers articles, tutoriels et actualités
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-16">
        <div className="mb-8">
          <p className="text-muted-foreground">
            Affichage de {posts.from} à {posts.to} sur {posts.total} articles
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.data.map((post) => (
            <Link
              key={post.id}
              href={route('blog.show', { slug: post.slug })}
              className="group block"
            >
              <article className="h-full bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all">
                {post.featured_image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="text-xs font-medium text-primary mb-2 block">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author?.name}
                    </div>
                    {post.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.published_at).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {posts.last_page > 1 && (
        <div className="w-full max-w-7xl mx-auto px-4 pb-16">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {posts.links.map((link, index) => {
                const isPrevious = link.label === '&laquo; Previous';
                const isNext = link.label === 'Next &raquo;';
                const label = isPrevious ? 'Précédent' : isNext ? 'Suivant' : link.label;

                if (!link.url) {
                  return (
                    <span
                      key={index}
                      className="px-4 py-2 text-muted-foreground cursor-not-allowed"
                    >
                      {label}
                    </span>
                  );
                }

                return (
                  <a
                    key={index}
                    href={link.url}
                    className={`px-4 py-2 rounded-lg ${
                      link.active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    dangerouslySetInnerHTML={{ __html: label }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Abonnez-vous à notre newsletter pour recevoir les derniers articles directement dans votre boîte mail.
          </p>
          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 w-full max-w-md"
            />
            <button className="ml-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </div>

      {/* Feedbacks Section */}
      <div className="w-full">
        <Feedbacks />
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <FAQSection />
      </div>

      {/* Contact */}
      <div className="w-full">
        <Contact />
      </div>
    </BlogThemeLayout>
  );
}
