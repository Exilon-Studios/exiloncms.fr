/**
 * Wion Theme - Home Three Layout
 * Minimalist creative layout with focus on content
 */

import React from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
import WionLayout from '@/layouts/WionLayout';
import { Head } from '@inertiajs/react';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image?: string;
  tags: string[];
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  image?: string;
}

interface HomeThreeProps {
  services?: Service[];
  projects?: Project[];
  blog?: BlogPost[];
}

export default function HomeThree({ services = [], projects = [], blog = [] }: HomeThreeProps) {
  const { settings } = usePage<PageProps>().props as any;

  // Default services
  const defaultServices: Service[] = [
    {
      id: 1,
      title: trans('wion.services.branding', 'Brand Identity'),
      description: trans('wion.services.branding_desc', 'Building powerful brand stories'),
      icon: 'wand-2',
      features: ['Logo Design', 'Brand Strategy', 'Guidelines']
    },
    {
      id: 2,
      title: trans('wion.services.web', 'Web Design'),
      description: trans('wion.services.web_desc', 'Digital experiences that convert'),
      icon: 'monitor',
      features: ['UI/UX', 'Responsive', 'Performance']
    },
    {
      id: 3,
      title: trans('wion.services.print', 'Print Design'),
      description: trans('wion.services.print_desc', 'Tangible creative solutions'),
      icon: 'printer',
      features: ['Brochures', 'Packaging', 'Stationery']
    }
  ];

  // Default projects
  const defaultProjects: Project[] = [
    {
      id: 1,
      title: 'Tech Startup Branding',
      category: 'Branding',
      description: 'Complete visual identity for innovative tech company',
      tags: ['Identity', 'Logo', 'Guidelines']
    },
    {
      id: 2,
      title: 'E-commerce Platform',
      category: 'Web Design',
      description: 'Modern online shopping experience',
      tags: ['Web', 'UI/UX', 'Shopify']
    },
    {
      id: 3,
      title: 'Restaurant Menu Design',
      category: 'Print',
      description: 'Elegant menu design for fine dining',
      tags: ['Print', 'Menu', 'Typography']
    },
    {
      id: 4,
      title: 'Mobile App UI',
      category: 'App Design',
      description: 'Intuitive interface for fitness tracking app',
      tags: ['App', 'Mobile', 'UI/UX']
    }
  ];

  // Default blog posts
  const defaultBlog: BlogPost[] = [
    {
      id: 1,
      title: 'The Future of Web Design',
      excerpt: 'Exploring emerging trends and technologies shaping the digital landscape',
      date: '2025-01-15',
      author: 'Alex Thompson',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Brand Identity Best Practices',
      excerpt: 'Key principles for creating memorable and effective brand identities',
      date: '2025-01-10',
      author: 'Sarah Miller',
      readTime: '8 min read'
    },
    {
      id: 3,
      title: 'Design Systems for Teams',
      excerpt: 'How to build scalable design systems that work across organizations',
      date: '2025-01-05',
      author: 'Mike Johnson',
      readTime: '6 min read'
    }
  ];

  const finalServices = services.length > 0 ? services : defaultServices;
  const finalProjects = projects.length > 0 ? projects : defaultProjects;
  const finalBlog = blog.length > 0 ? blog : defaultBlog;

  return (
    <WionLayout variant="three">
      <Head title={trans('wion.pages.home.title', 'Home') + ' | Wion'} />

      {/* Minimal Hero */}
      <MinimalHero />

      {/* Services */}
      <MinimalServices services={finalServices} />

      {/* Featured Projects */}
      <FeaturedProjects projects={finalProjects} />

      {/* Blog Section */}
      <BlogSection blog={finalBlog} />

      {/* Stats */}
      <StatsSection />

      {/* CTA */}
      <MinimalCTA />
    </WionLayout>
  );
}

// Minimal Hero Component
function MinimalHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
            {trans('wion.minimal_hero.title', 'Creative Excellence')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
            {trans('wion.minimal_hero.subtitle', 'Design • Development • Branding')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-light hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {trans('wion.minimal_hero.view_work', 'View Work')}
            </button>
            <button className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-light hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              {trans('wion.minimal_hero.contact', 'Contact')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Minimal Services Component
function MinimalServices({ services }: { services: HomeThreeProps['services'] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-4">
            {trans('wion.services.title', 'Services')}
          </h2>
          <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.services.subtitle', 'Creative solutions tailored to your needs')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <MinimalServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Minimal Service Card Component
function MinimalServiceCard({ service, index }: { service: HomeThreeProps['services'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group p-8"
    >
      <h3 className="text-2xl font-light mb-4">{service.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
      <ul className="space-y-2">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center text-sm">
            <div className="w-1 h-1 bg-gray-400 rounded-full mr-3"></div>
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Featured Projects Component
function FeaturedProjects({ projects }: { projects: HomeThreeProps['projects'] }) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-4">
            {trans('wion.projects.title', 'Featured Projects')}
          </h2>
          <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.projects.subtitle', 'Recent work from our portfolio')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Project Card Component
function FeaturedProjectCard({ project, index }: { project: HomeThreeProps['projects'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group"
    >
      <div className="mb-6 aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-lg">
            {project.title}
          </span>
        </div>
      </div>
      <div className="group-hover:opacity-75 transition-opacity">
        <h3 className="text-2xl font-light mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, i) => (
            <span key={i} className="text-sm text-gray-500 dark:text-gray-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Blog Section Component
function BlogSection({ blog }: { blog: HomeThreeProps['blog'] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-4">
            {trans('wion.blog.title', 'Latest Thoughts')}
          </h2>
          <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.blog.subtitle', 'Insights and articles from our team')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blog.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-light hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {trans('wion.blog.view_all', 'View All Posts')}
          </button>
        </div>
      </div>
    </section>
  );
}

// Blog Card Component
function BlogCard({ post, index }: { post: HomeThreeProps['blog'][0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-6 aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden relative">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-lg">
            {post.title}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span className="text-white text-sm">
            {post.readTime}
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-light mb-3 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          {post.excerpt}
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Stats Section Component
function StatsSection() {
  const stats = [
    { value: 150, label: 'Projects Completed' },
    { value: 50, label: 'Happy Clients' },
    { value: 25, label: 'Awards Won' },
    { value: 5, label: 'Years Experience' }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-light mb-2">{stat.value}+</div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Minimal CTA Component
function MinimalCTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            {trans('wion.cta.title', 'Let\'s Work Together')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {trans('wion.cta.subtitle', 'Ready to bring your vision to life?')}
          </p>
          <button className="px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-light hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors">
            {trans('wion.cta.start_project', 'Start Your Project')}
          </button>
        </div>
      </div>
    </section>
  );
}