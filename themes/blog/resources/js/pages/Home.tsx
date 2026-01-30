/**
 * Blog Theme - Home Page Override
 *
 * This demonstrates how themes can override core CMS pages.
 * Following DRY principles with reusable components.
 */

import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

// ============================================================
// TYPES
// ============================================================

interface HomeProps {
  message?: string;
  siteName?: string;
  server?: Server;
  servers?: Server[];
  landingSettings?: any;
  posts?: Post[];
}

interface Server {
  isOnline?: boolean;
  onlinePlayers?: number;
  maxPlayers?: number;
  join_url?: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  published_at?: string;
  author?: {
    name: string;
  };
}

// ============================================================
// COMPONENTS
// ============================================================

/**
 * Server status indicator component
 */
function ServerStatus({ server }: { server?: Server }) {
  if (!server) return null;

  return (
    <div className="flex justify-center">
      <div className="rounded-lg bg-white/80 px-6 py-3 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Server Status:{' '}
          <StatusIndicator isOnline={server.isOnline} />
          {server.isOnline && server.onlinePlayers !== undefined && server.maxPlayers !== undefined && (
            <span className="ml-2 text-gray-500">
              ({server.onlinePlayers}/{server.maxPlayers} players)
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

/**
 * Status indicator with color coding
 */
function StatusIndicator({ isOnline }: { isOnline?: boolean }) {
  return (
    <span className={`font-semibold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
      {isOnline ? 'Online' : 'Offline'}
    </span>
  );
}

/**
 * Call-to-action buttons
 */
function CallToActions({
  hasShop,
  servers
}: {
  hasShop: boolean;
  servers: Server[]
}) {
  const joinUrl = servers?.[0]?.join_url || '#';

  return (
    <div className="flex items-center justify-center gap-x-6">
      {hasShop && (
        <CTAButton href="/shop" variant="blue">
          Browse Shop
        </CTAButton>
      )}
      <CTAButton href={joinUrl} variant="indigo">
        Join Now
      </CTAButton>
    </div>
  );
}

/**
 * Reusable CTA button component
 */
function CTAButton({
  href,
  children,
  variant = 'blue'
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'blue' | 'indigo';
}) {
  const variants = {
    blue: 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600',
    indigo: 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600',
  };

  return (
    <a
      href={href}
      className={`rounded-md px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]}`}
    >
      {children}
    </a>
  );
}

/**
 * Blog posts grid section
 */
function BlogPostsSection({ posts }: { posts: Post[] }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Latest News"
          description="Stay updated with our latest announcements and articles"
        />

        <PostsGrid posts={posts} />

        {posts.length > 0 && <ViewAllButton />}
      </div>
    </section>
  );
}

/**
 * Section header component
 */
function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

/**
 * Posts grid layout
 */
function PostsGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

/**
 * Individual post card
 */
function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
      {post.featured_image && <PostImage image={post.featured_image} title={post.title} />}
      <PostContent post={post} />
    </article>
  );
}

/**
 * Post featured image
 */
function PostImage({ image, title }: { image: string; title: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden">
      <img src={image} alt={title} className="h-full w-full object-cover" />
    </div>
  );
}

/**
 * Post content section
 */
function PostContent({ post }: { post: Post }) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        <PostLink slug={post.slug} title={post.title} />
      </h3>
      {post.excerpt && (
        <p className="mt-2 flex-1 text-gray-600 dark:text-gray-400">
          {post.excerpt}
        </p>
      )}
      <PostMeta post={post} />
    </div>
  );
}

/**
 * Post link with hover effect
 */
function PostLink({ slug, title }: { slug: string; title: string }) {
  return (
    <a
      href={`/blog/${slug}`}
      className="hover:text-blue-600 dark:hover:text-blue-400"
    >
      {title}
    </a>
  );
}

/**
 * Post metadata (author, date)
 */
function PostMeta({ post }: { post: Post }) {
  return (
    <div className="mt-4 flex items-center text-sm text-gray-500">
      {post.author && <span>{post.author.name}</span>}
      {post.published_at && (
        <span className="ml-4">
          {formatDate(post.published_at)}
        </span>
      )}
    </div>
  );
}

/**
 * Format date consistently
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

/**
 * View all button for blog section
 */
function ViewAllButton() {
  return (
    <div className="mt-8 text-center">
      <CTAButton href="/blog" variant="blue">
        View All Posts
      </CTAButton>
    </div>
  );
}

/**
 * Features section for when no blog posts exist
 */
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'text-blue-600',
      title: 'Lightning Fast',
      description: 'Built on Laravel 12 and React 19 for optimal performance',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      color: 'text-indigo-600',
      title: 'Fully Customizable',
      description: 'Themes and plugins let you create exactly what you need',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      color: 'text-purple-600',
      title: 'Extensible',
      description: 'Plugin architecture allows unlimited functionality',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Everything You Need"
          description="Built with modern technologies and best practices"
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(feature => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Feature card component
 */
function FeatureCard({
  icon,
  color,
  title,
  description
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className={color}>{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

/**
 * Hero section with gradient background
 */
function Hero({
  siteName,
  message,
  server,
  servers,
  hasShop,
}: {
  siteName?: string;
  message?: string;
  server?: Server;
  servers?: Server[];
  hasShop: boolean;
}) {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {siteName || 'ExilonCMS'}
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {message || 'A modern CMS built with Laravel, React, and Inertia.js'}
          </p>

          {server && <ServerStatus server={server} />}

          <CallToActions hasShop={hasShop} servers={servers || []} />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

/**
 * Blog Theme Home Page
 *
 * This overrides the core Home page with blog-themed styling and layout.
 * Demonstrates theme page override system with DRY, clean code.
 */
export default function BlogThemeHome({
  message,
  siteName,
  server,
  servers = [],
  landingSettings,
  posts = [],
}: HomeProps) {
  const { enabledPlugins = [] } = usePage<PageProps>().props as any;

  const isBlogEnabled = enabledPlugins.includes('blog');
  const isShopEnabled = enabledPlugins.includes('shop');

  return (
    <>
      <Head title="Home - Blog Theme" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Hero
          siteName={siteName}
          message={message}
          server={server}
          servers={servers}
          hasShop={isShopEnabled}
        />

        {/* Conditional sections based on enabled plugins */}
        {isBlogEnabled && posts.length > 0 ? (
          <BlogPostsSection posts={posts} />
        ) : (
          <FeaturesSection />
        )}
      </div>
    </>
  );
}
