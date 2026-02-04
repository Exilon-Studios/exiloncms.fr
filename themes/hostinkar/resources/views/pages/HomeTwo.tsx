/**
 * Home Variant 2 - Modern Split Layout
 * Contemporary design with split content hero and focused CTAs
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

export default function HomeTwo() {
  const { settings, auth } = usePage<PageProps>().props;

  return (
    <>
      <Head title={settings?.name || 'ExilonCMS - Premium Hosting'} />

      {/* Hero Section - Split Layout */}
      <HeroSection variant="split" />

      {/* Features Grid */}
      <section className="py-20">
        <FeaturesSection />
      </section>

      {/* Hosting Plans - Centered */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <HostingPlans />
        </div>
      </section>

      {/* Services with Icons */}
      <section className="py-20">
        <ServicesSection />
      </section>

      {/* Testimonials in Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-dark">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust us with their web hosting needs.
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Plans
              </motion.button>
              <motion.button
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

HomeTwo.layout = (page: React.ReactNode) => (
  <HostinkarLayout variant="two">{page}</HostinkarLayout>
);