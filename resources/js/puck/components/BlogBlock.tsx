import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Newspaper } from "lucide-react";
import { trans } from '@/lib/i18n';
import { NavLink } from './NavLink';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  published_at: string;
  author: {
    name: string;
  };
}

interface BlogBlockProps {
  title?: string;
  subtitle?: string;
  show_view_all?: boolean;
  posts?: Post[];
  puck?: {
    isEditing?: boolean;
  };
}

export const BlogBlock: React.FC<BlogBlockProps> = (props) => {
  const {
    title = "Dernières nouvelles",
    subtitle = "Actualités",
    show_view_all = true,
    posts = [],
    puck,
  } = props || {};

  const isEditing = puck?.isEditing || false;

  // Extract excerpt from content (first 150 characters)
  const getExcerpt = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section
      className="bg-background"
      style={{
        paddingTop: isEditing ? '40px' : '5rem',
        paddingBottom: isEditing ? '40px' : '5rem',
      }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full">
              {subtitle}
            </span>
            <h2 className={`${isEditing ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold`}>
              {title}
            </h2>
          </div>
          {show_view_all && !isEditing && (
            <NavLink
              href="/posts"
              className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold"
            >
              {trans('messages.blog.view_all')}
              <ArrowRight className="w-5 h-5" />
            </NavLink>
          )}
        </motion.div>

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <div className={`grid gap-8 ${isEditing ? 'grid-cols-1 md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
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
                      <Newspaper className="w-16 h-16 text-primary/50" />
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
                  <NavLink
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                  >
                    {trans('messages.blog.read_more')}
                    <ArrowRight className="w-4 h-4" />
                  </NavLink>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            className="text-center py-16"
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Newspaper className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">{trans('messages.blog.no_posts')}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {trans('messages.blog.no_posts_hint')}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
