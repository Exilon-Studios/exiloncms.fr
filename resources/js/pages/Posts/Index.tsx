/**
 * Posts Index - List all published posts
 */

import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { trans } from '@/lib/i18n';
import { Post } from '@/types';

interface PostsIndexProps {
  posts: Post[];
  search?: string;
}

export default function PostsIndex({ posts, search }: PostsIndexProps) {
  const getExcerpt = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <AppLayout>
      <Head title="Actualités" />

      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full">
              Actualités
            </span>
            <h1 className="text-4xl md:text-5xl font-bold">
              Dernières <span className="text-primary">nouvelles</span>
            </h1>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Aucun article publié pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-4xl text-primary/50">📰</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author.name}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm mb-4">
                      {getExcerpt(post.content)}
                    </p>

                    {/* Read More Link */}
                    <Link
                      href={`/news/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                    >
                      Lire la suite
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
