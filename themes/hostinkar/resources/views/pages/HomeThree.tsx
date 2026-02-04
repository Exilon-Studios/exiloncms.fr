/**
 * Home Variant 3 - Minimal Design with Animations
 * Clean, minimal design focused on performance and speed
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

export default function HomeThree() {
  const { settings, auth } = usePage<PageProps>().props;

  return (
    <>
      <Head title={settings?.name || 'ExilonCMS - Fast Hosting'} />

      {/* Hero Section - Minimal */}
      <HeroSection variant="minimal" />

      {/* Performance Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl font-bold text-blue-600">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-blue-600">&lt;2s</div>
              <div className="text-gray-600">Load Time</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Support</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-blue-600">SSD</div>
              <div className="text-gray-600">Storage</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features - Minimal Cards */}
      <section className="py-20 bg-gray-50">
        <FeaturesSection />
      </section>

      {/* Hosting Plans */}
      <section className="py-20">
        <HostingPlans />
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <ServicesSection />
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <TestimonialCarousel />
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6"
          >
            Experience the Difference
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 mb-8"
          >
            Join our community of happy customers and see why we're the preferred choice for web hosting.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started Today
          </motion.button>
        </div>
      </section>
    </>
  );
}

HomeThree.layout = (page: React.ReactNode) => (
  <HostinkarLayout variant="three">{page}</HostinkarLayout>
);