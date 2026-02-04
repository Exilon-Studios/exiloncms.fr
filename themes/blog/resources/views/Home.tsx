/**
 * Blog Theme - Home Page
 * Simplified version with only Hero, Articles, Newsletter, and Footer
 */

import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Hero } from '@/components/aceternity/Hero';
import { FeaturedBlogPost, BlogGrid } from '@/components/aceternity/BlogPostCard';
import BlogThemeLayout from '@/layouts/BlogLayout';
import BookACall from '@/components/aceternity/BookACall';
import { Zap } from 'lucide-react';

interface HomeProps {
  message?: string;
  siteName?: string;
  servers?: any[];
  posts?: Post[];
  enabledPlugins?: string[];
}

interface Post {
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

/**
 * Main Blog Theme Home Page - Simplified
 */
export default function BlogThemeHome(props: HomeProps) {
  const { enabledPlugins = [] } = usePage<PageProps>().props as any;
  // Shop plugin is not fully functional, always disable cart
  const isShopEnabled = false;

  // Featured post is the first one, rest go in grid
  const featuredPost = props.posts && props.posts.length > 0 ? props.posts[0] : null;
  const gridPosts = props.posts && props.posts.length > 1 ? props.posts.slice(1) : [];

  return (
    <BlogThemeLayout showCart={false}>
      <Head title="Accueil" />

      {/* Hero Section */}
      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <Hero />
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="w-full max-w-7xl mx-auto px-4 mt-16 relative z-10">
          <FeaturedBlogPost post={featuredPost} />
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Articles récents
          </h2>
          <a
            href="/blog"
            className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 flex items-center gap-1"
          >
            Voir tout
            <Zap className="w-4 h-4" />
          </a>
        </div>
        <BlogGrid posts={gridPosts} />
      </div>

      {/* Newsletter Subscription */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 pb-16">
        <BookACall />
      </div>
    </BlogThemeLayout>
  );
}
