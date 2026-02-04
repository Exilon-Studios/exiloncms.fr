/**
 * Wion Theme - Portfolio Page
 * Creative portfolio with filtering and project showcases
 */

import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
import WionLayout from '@/layouts\WionLayout';
import { Head } from '@inertiajs/react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image?: string;
  tags: string[];
  featured: boolean;
  date: string;
  client?: string;
  link?: string;
}

interface PortfolioProps {
  projects?: Project[];
  categories?: string[];
}

export default function Portfolio({ projects = [], categories = [] }: PortfolioProps) {
  const { settings } = usePage<PageProps>().props as any;

  // Default projects
  const defaultProjects: Project[] = [
    {
      id: 1,
      title: 'Tech Startup Branding',
      category: 'Branding',
      description: 'Complete visual identity design for innovative technology company',
      tags: ['Identity', 'Logo', 'Guidelines'],
      featured: true,
      date: '2024-12-01',
      client: 'TechCorp Inc.'
    },
    {
      id: 2,
      title: 'E-commerce Platform',
      category: 'Web Design',
      description: 'Modern online shopping experience with seamless user interface',
      tags: ['Web', 'UI/UX', 'Shopify'],
      featured: true,
      date: '2024-11-15',
      client: 'FashionForward'
    },
    {
      id: 3,
      title: 'Mobile Banking App',
      category: 'App Design',
      description: 'Intuitive banking solution for modern mobile users',
      tags: ['Mobile', 'App', 'Figma'],
      featured: false,
      date: '2024-10-20',
      client: 'BankSecure'
    },
    {
      id: 4,
      title: 'Restaurant Branding',
      category: 'Branding',
      description: 'Elegant brand identity for fine dining establishment',
      tags: ['Identity', 'Print', 'Logo'],
      featured: false,
      date: '2024-09-10',
      client: 'Gourmet Dining'
    },
    {
      id: 5,
      title: 'Corporate Website',
      category: 'Web Design',
      description: 'Professional website for consulting firm',
      tags: ['Web', 'Corporate', 'WordPress'],
      featured: true,
      date: '2024-08-05',
      client: 'Business Solutions Inc.'
    },
    {
      id: 6,
      title: 'Social Media Campaign',
      category: 'Marketing',
      description: 'Visual campaign for social media platform launch',
      tags: ['Marketing', 'Social', 'Animation'],
      featured: false,
      date: '2024-07-22',
      client: 'Social Connect'
    },
    {
      id: 7,
      title: 'Product Packaging',
      category: 'Print Design',
      description: 'Eco-friendly packaging design for beverage brand',
      tags: ['Print', 'Packaging', 'Sustainability'],
      featured: false,
      date: '2024-06-18',
      client: 'Green Beverages'
    },
    {
      id: 8,
      title: 'Fitness App UI',
      category: 'App Design',
      description: 'Clean interface for health and fitness tracking application',
      tags: ['App', 'Mobile', 'UI/UX'],
      featured: true,
      date: '2024-05-12',
      client: 'FitLife Studios'
    }
  ];

  // Default categories
  const defaultCategories = ['All', 'Branding', 'Web Design', 'App Design', 'Marketing', 'Print Design'];

  const finalProjects = projects.length > 0 ? projects : defaultProjects;
  const finalCategories = categories.length > 0 ? categories : defaultCategories;

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Filter projects
  const filteredProjects = finalProjects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesFeatured = !showFeaturedOnly || project.featured;
    return matchesCategory && matchesFeatured;
  });

  // Separate featured and regular projects
  const featuredProjects = filteredProjects.filter(project => project.featured);
  const regularProjects = filteredProjects.filter(project => !project.featured);

  return (
    <WionLayout variant="one">
      <Head title={trans('wion.pages.portfolio.title', 'Portfolio') + ' | Wion'} />

      {/* Hero Section */}
      <PortfolioHero />

      {/* Filter Section */}
      <PortfolioFilter
        categories={finalCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showFeaturedOnly={showFeaturedOnly}
        onFeaturedToggle={setShowFeaturedOnly}
      />

      {/* Featured Projects */}
      {selectedCategory === 'All' && featuredProjects.length > 0 && (
        <FeaturedProjectsSection projects={featuredProjects} />
      )}

      {/* Projects Grid */}
      <ProjectsGrid projects={regularProjects} />

      {/* Load More */}
      {regularProjects.length > 0 && (
        <LoadMoreSection />
      )}

      {/* Contact CTA */}
      <PortfolioContactCTA />
    </WionLayout>
  );
}

// Portfolio Hero Component
function PortfolioHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full opacity-10"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 bg-purple-500 rounded-full opacity-10"
          animate={{
            x: [0, -70, 70, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.8, 1.3, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 rounded-full opacity-10"
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.3, 0.7, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {trans('wion.portfolio.hero.title', 'Portfolio')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {trans('wion.portfolio.hero.subtitle', 'Explore our creative projects and design solutions')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              {trans('wion.portfolio.hero.view_all', 'View All Projects')}
            </button>
            <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {trans('wion.portfolio.hero.get_quote', 'Get a Quote')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Portfolio Filter Component
function PortfolioFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  showFeaturedOnly,
  onFeaturedToggle
}: {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  showFeaturedOnly: boolean;
  onFeaturedToggle: () => void;
}) {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800 sticky top-16 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onFeaturedToggle}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showFeaturedOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Featured Only
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured Projects Section Component
function FeaturedProjectsSection({ projects }: { projects: PortfolioProps['projects'] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.portfolio.featured.title', 'Featured Projects')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.portfolio.featured.subtitle', 'Our most impressive and impactful work')}
          </p>
        </div>

        <div className="space-y-16">
          {projects.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Project Card Component
function FeaturedProjectCard({ project, index }: { project: PortfolioProps['projects'][0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="grid md:grid-cols-2 gap-8 items-center group"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-purple-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm text-white mb-2">
              {project.category}
            </span>
            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div>
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            {project.client}
          </span>
          <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {project.description}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Project Details</h4>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>📅 {new Date(project.date).toLocaleDateString()}</span>
            <span>🏷️ {project.category}</span>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Technologies Used</h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            View Project
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Case Study
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Projects Grid Component
function ProjectsGrid({ projects }: { projects: PortfolioProps['projects'] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.portfolio.grid.title', 'All Projects')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Project Card Component
function ProjectCard({ project, index }: { project: PortfolioProps['projects'][0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600"></div>

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          <div className="text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-2 py-1 bg-yellow-500 text-xs font-bold rounded-full">
                  Featured
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-sm opacity-90">{project.description}</p>
          </div>
        </motion.div>

        {/* Quick view button */}
        <motion.button
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

// Load More Section Component
function LoadMoreSection() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading more projects
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="py-12">
      <div className="text-center">
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : trans('wion.portfolio.load_more', 'Load More Projects')}
        </button>
      </div>
    </section>
  );
}

// Portfolio Contact CTA Component
function PortfolioContactCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {trans('wion.portfolio.cta.title', 'Inspired by Our Work?')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            {trans('wion.portfolio.cta.subtitle', 'Let\'s create something amazing together for your next project')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              {trans('wion.portfolio.cta.start_project', 'Start Your Project')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}