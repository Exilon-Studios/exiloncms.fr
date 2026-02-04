/**
 * Wion Theme - Home One Layout
 * Modern creative agency homepage with particle effects
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

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image?: string;
}

interface HomeOneProps {
  services?: Service[];
  team?: TeamMember[];
}

export default function HomeOne({ services = [], team = [] }: HomeOneProps) {
  const { settings } = usePage<PageProps>().props as any;

  // Default services
  const defaultServices: Service[] = [
    {
      id: 1,
      title: trans('wion.services.branding', 'Branding'),
      description: trans('wion.services.branding_desc', 'Building powerful brand identities'),
      icon: 'wand-2',
      features: ['Logo Design', 'Brand Strategy', 'Guidelines']
    },
    {
      id: 2,
      title: trans('wion.services.web', 'Web Design'),
      description: trans('wion.services.web_desc', 'Creating stunning web experiences'),
      icon: 'monitor',
      features: ['UI/UX Design', 'Web Development', 'Performance']
    },
    {
      id: 3,
      title: trans('wion.services.motion', 'Motion Graphics'),
      description: trans('wion.services.motion_desc', 'Dynamic animations and videos'),
      icon: 'video',
      features: ['2D Animation', '3D Rendering', 'Video Production']
    }
  ];

  // Default team
  const defaultTeam: TeamMember[] = [
    {
      id: 1,
      name: 'Alex Thompson',
      role: 'Creative Director',
      image: ''
    },
    {
      id: 2,
      name: 'Sarah Miller',
      role: 'Lead Designer',
      image: ''
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Developer',
      image: ''
    }
  ];

  const finalServices = services.length > 0 ? services : defaultServices;
  const finalTeam = team.length > 0 ? team : defaultTeam;

  return (
    <WionLayout variant="one">
      <Head title={trans('wion.pages.home.title', 'Home') + ' | Wion'} />

      {/* Hero Section */}
      <HeroSection />

      {/* Services Grid */}
      <ServicesSection services={finalServices} />

      {/* Team Section */}
      <TeamSection team={finalTeam} />

      {/* Portfolio Preview */}
      <PortfolioPreview />

      {/* CTA Section */}
      <CTASection />
    </WionLayout>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-20"></div>

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
            {trans('wion.hero.title', 'Creative Excellence')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
            {trans('wion.hero.subtitle', 'We craft digital experiences that inspire and engage')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              {trans('wion.hero.start_project', 'Start a Project')}
            </button>
            <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {trans('wion.hero.view_work', 'View Work')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

// Services Section Component
function ServicesSection({ services }: { services: HomeOneProps['services'] }) {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.services.title', 'Our Services')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.services.subtitle', 'Comprehensive creative solutions for modern businesses')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Service Card Component
function ServiceCard({ service, index }: { service: HomeOneProps['services'][0]; index: number }) {
  const delay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
      className="group relative p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-4 relative z-10 group-hover:text-blue-600 transition-colors">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-2 mb-6 relative z-10">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button className="relative z-10 inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
        {trans('wion.services.learn_more', 'Learn More')}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 dark:bg-blue-900 rounded-full opacity-50"></div>
    </motion.div>
  );
}

// Team Section Component
function TeamSection({ team }: { team: HomeOneProps['team'] }) {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.team.title', 'Meet Our Team')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.team.subtitle', 'Talented individuals passionate about creativity')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Team Card Component
function TeamCard({ member, index }: { member: HomeOneProps['team'][0]; index: number }) {
  const delay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
      className="group text-center p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Avatar */}
      <div className="relative mb-6">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span className="text-white text-3xl font-bold">
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>

        {/* Social links overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Info */}
      <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
      <p className="text-lg text-blue-600 mb-4">{member.role}</p>
      <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
        {trans('wion.team.view_profile', 'View Profile')}
      </button>
    </motion.div>
  );
}

// Portfolio Preview Component
function PortfolioPreview() {
  const projects = [
    { id: 1, title: 'Brand Identity', category: 'Branding' },
    { id: 2, title: 'Web Design', category: 'Web' },
    { id: 3, title: 'Mobile App', category: 'App' },
    { id: 4, title: 'Print Design', category: 'Print' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.portfolio.title', 'Recent Work')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.portfolio.subtitle', 'Explore our latest creative projects')}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
            >
              {/* Image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600"></div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                  <p className="text-sm opacity-90">{project.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {trans('wion.portfolio.view_all', 'View All Projects')}
          </button>
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {trans('wion.cta.title', 'Ready to Create Something Amazing?')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            {trans('wion.cta.subtitle', 'Let's bring your vision to life with creative excellence')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              {trans('wion.cta.start_project', 'Start Your Project')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}