/**
 * Home Variant 1 - Classic Hero with Features
 * Professional hosting layout with hero section and feature highlights
 */

import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { motion } from 'framer-motion';
import HeroSection from '@/components/theme/HeroSection';
import FeaturesSection from '@/components/theme/FeaturesSection';
import HostingPlans from '@/components/theme/HostingPlans';
import TestimonialCarousel from '@/components/theme/TestimonialCarousel';
import ServicesSection from '@/components/theme/ServicesSection';

export default function HomeOne() {
  const { settings, auth } = usePage<PageProps>().props;

  return (
    <>
      <Head title={settings?.name || 'ExilonCMS - Web Hosting'} />

      {/* Hero Section */}
      <HeroSection variant="classic" />

      {/* Features Section */}
      <section className="py-20">
        <FeaturesSection />
      </section>

      {/* Hosting Plans */}
      <section className="py-20 bg-gray-50">
        <HostingPlans />
      </section>

      {/* Services Section */}
      <section className="py-20">
        <ServicesSection />
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <TestimonialCarousel />
      </section>

      {/* Domain Search CTA */}
      <section className="py-20 gradient-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Your Website Journey
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get your perfect domain name today and start building your online presence.
          </p>
          <motion.button
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search Domain
          </motion.button>
        </div>
      </section>
    </>
  );
}

HomeOne.layout = (page: React.ReactNode) => (
  <HostinkarLayout variant="one">{page}</HostinkarLayout>
);