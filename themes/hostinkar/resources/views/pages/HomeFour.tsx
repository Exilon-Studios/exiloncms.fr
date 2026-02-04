/**
 * Home Variant 4 - Enterprise Focus
 * Professional layout for business and enterprise clients
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

export default function HomeFour() {
  const { settings, auth } = usePage<PageProps>().props;

  return (
    <>
      <Head title={settings?.name || 'ExilonCMS - Enterprise Hosting'} />

      {/* Hero Section - Enterprise */}
      <HeroSection variant="enterprise" />

      {/* Enterprise Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Enterprise Solutions?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for businesses that demand reliability, security, and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">99.99% Uptime SLA</h3>
              <p className="text-gray-600">Industry-leading uptime guarantee with financial compensation for any downtime.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-gray-600">Advanced security features including DDoS protection, SSL, and firewalls.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Priority Support</h3>
              <p className="text-gray-600">Dedicated support team with guaranteed response times for enterprise clients.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <FeaturesSection />
      </section>

      {/* Enterprise Hosting Plans */}
      <section className="py-20 bg-gray-50">
        <HostingPlans />
      </section>

      {/* Services */}
      <section className="py-20">
        <ServicesSection />
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <TestimonialCarousel />
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
              Transform Your Business with Premium Hosting
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Partner with us to scale your online presence with enterprise-grade hosting solutions.
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

HomeFour.layout = (page: React.ReactNode) => (
  <HostinkarLayout variant="four">{page}</HostinkarLayout>
);