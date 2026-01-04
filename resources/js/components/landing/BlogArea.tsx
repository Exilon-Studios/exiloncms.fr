import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { Calendar, User, ArrowRight } from "lucide-react";

interface Author {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  published_at: string;
  author: Author;
}

interface Props {
  posts: Post[];
}

export default function BlogArea({ posts }: Props) {
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
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full">
              Actualités
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Dernières <span className="text-primary">nouvelles</span>
            </h2>
          </div>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold"
          >
            Voir tous les articles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
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
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                >
                  Lire la suite
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground">Aucun article publié pour le moment.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
