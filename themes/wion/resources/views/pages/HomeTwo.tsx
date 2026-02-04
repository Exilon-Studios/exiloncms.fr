/**
 * Wion Theme - Home Two Layout
 * Animated portfolio showcase with video backgrounds
 */

import React, { useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
import WionLayout from '@/layouts/WionLayout';
import { Head } from '@inertiajs/react';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image?: string;
  video?: string;
  tags: string[];
}

interface Skill {
  id: number;
  name: string;
  level: number;
  icon: string;
}

interface HomeTwoProps {
  portfolio?: PortfolioItem[];
  skills?: Skill[];
}

export default function HomeTwo({ portfolio = [], skills = [] }: HomeTwoProps) {
  const { settings } = usePage<PageProps>().props as any;

  // Default portfolio items
  const defaultPortfolio: PortfolioItem[] = [
    {
      id: 1,
      title: 'Brand Identity Design',
      category: 'Branding',
      description: 'Complete visual identity system for tech startup',
      tags: ['Branding', 'Logo', 'Guidelines']
    },
    {
      id: 2,
      title: 'E-commerce Platform',
      category: 'Web Design',
      description: 'Modern online shopping experience',
      tags: ['Web', 'UI/UX', 'React']
    },
    {
      id: 3,
      title: 'Mobile Banking App',
      category: 'Mobile Design',
      description: 'Intuitive banking solution for mobile users',
      tags: ['Mobile', 'App', 'Figma']
    },
    {
      id: 4,
      title: 'Corporate Website',
      category: 'Web Design',
      description: 'Professional website for consulting firm',
      tags: ['Web', 'Corporate', 'WordPress']
    },
    {
      id: 5,
      title: 'Social Media Campaign',
      category: 'Marketing',
      description: 'Visual campaign for social media platform',
      tags: ['Marketing', 'Social', 'Animation']
    },
    {
      id: 6,
      title: 'Product Packaging',
      category: 'Print Design',
      description: 'Eco-friendly packaging design for beverage brand',
      tags: ['Print', 'Packaging', 'Sustainability']
    }
  ];

  // Default skills
  const defaultSkills: Skill[] = [
    { id: 1, name: 'UI/UX Design', level: 95, icon: 'palette' },
    { id: 2, name: 'Branding', level: 90, icon: 'wand-2' },
    { id: 3, name: 'Web Development', level: 85, icon: 'code' },
    { id: 4, name: 'Motion Graphics', level: 80, icon: 'video' },
    { id: 5, name: 'Print Design', level: 88, icon: 'printer' },
    { id: 6, name: 'Photography', level: 75, icon: 'camera' }
  ];

  const finalPortfolio = portfolio.length > 0 ? portfolio : defaultPortfolio;
  const finalSkills = skills.length > 0 ? skills : defaultSkills;

  return (
    <WionLayout variant="two">
      <Head title={trans('wion.pages.home.title', 'Home') + ' | Wion'} />

      {/* Hero with Video */}
      <VideoHeroSection />

      {/* Skills Section */}
      <SkillsSection skills={finalSkills} />

      {/* Portfolio Grid */}
      <PortfolioGridSection portfolio={finalPortfolio} />

      {/* Process Section */}
      <ProcessSection />

      {/* Testimonials */}
      <TestimonialsSection />
    </WionLayout>
  );
}

// Video Hero Section Component
function VideoHeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            {trans('wion.video_hero.title', 'Creative Excellence in Motion')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {trans('wion.video_hero.subtitle', 'Bringing your brand to life through stunning visuals')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {trans('wion.video_hero.view_work', 'View Portfolio')}
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              {trans('wion.video_hero.contact', 'Get in Touch')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Play button overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => videoRef.current?.play()}
          className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </section>
  );
}

// Skills Section Component
function SkillsSection({ skills }: { skills: HomeTwoProps['skills'] }) {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.skills.title', 'Our Expertise')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.skills.subtitle', 'Mastering the art of creative design and development')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
          {skills.map((skill, index) => (
            <SkillBar key={skill.id} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Skill Bar Component
function SkillBar({ skill, index }: { skill: HomeTwoProps['skills'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center group"
    >
      <div className="mb-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <div className="w-10 h-10 bg-white rounded-full"></div>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 1.5, delay: 0.3 + index * 0.1 }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{skill.level}%</p>
    </motion.div>
  );
}

// Portfolio Grid Section Component
function PortfolioGridSection({ portfolio }: { portfolio: HomeTwoProps['portfolio'] }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', ...new Set(portfolio.map(item => item.category))];

  const filteredPortfolio = activeCategory === 'all'
    ? portfolio
    : portfolio.filter(item => item.category === activeCategory);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.portfolio.title', 'Portfolio')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.portfolio.subtitle', 'Explore our creative projects across various disciplines')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white dark:bg-gray-900 rounded-lg p-1 shadow">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {category === 'all' ? trans('wion.portfolio.all', 'All') : category}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPortfolio.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Portfolio Card Component
function PortfolioCard({ item, index }: { item: HomeTwoProps['portfolio'][0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Video placeholder */}
      <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-purple-600"></div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {item.category}
            </span>
            <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
          <p className="text-sm opacity-90 mb-4">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Process Section Component
function ProcessSection() {
  const steps = [
    {
      title: trans('wion.process.discover', 'Discover'),
      description: trans('wion.process.discover_desc', 'Understanding your vision and goals'),
      icon: 'search'
    },
    {
      title: trans('wion.process.design', 'Design'),
      description: trans('wion.process.design_desc', 'Creating concepts and prototypes'),
      icon: 'palette'
    },
    {
      title: trans('wion.process.develop', 'Develop'),
      description: trans('wion.process.develop_desc', 'Bringing ideas to life'),
      icon: 'code'
    },
    {
      title: trans('wion.process.launch', 'Launch'),
      description: trans('wion.process.launch_desc', 'Going live and optimizing'),
      icon: 'rocket'
    }
  ];

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.process.title', 'Our Process')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.process.subtitle', 'A streamlined approach to creative excellence')}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ProcessStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Process Step Component
function ProcessStep({ step, index }: { step: { title: string; description: string; icon: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center group"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gray-300 dark:bg-gray-600 hidden md:block"></div>
      </div>
      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
    </motion.div>
  );
}

// Testimonials Section Component
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechCorp',
      content: 'Wion delivered exceptional creative work that exceeded our expectations. Their attention to detail is unmatched.',
      avatar: ''
    },
    {
      name: 'Michael Chen',
      role: 'Founder, StartupXYZ',
      content: 'Professional, creative, and results-driven. Highly recommend their services for any creative project.',
      avatar: ''
    },
    {
      name: 'Emily Davis',
      role: 'Marketing Director, BrandCo',
      content: 'The team at Wion transformed our brand identity. Their creative vision and execution are top-notch.',
      avatar: ''
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.testimonials.title', 'Client Testimonials')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.testimonials.subtitle', 'What our clients say about working with us')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonial Card Component
function TestimonialCard({ testimonial, index }: { testimonial: { name: string; role: string; content: string; avatar: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white font-bold">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="text-lg font-bold">{testimonial.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.content}"</p>
    </motion.div>
  );
}