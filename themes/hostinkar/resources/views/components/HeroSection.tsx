/**
 * Hero Section Component
 * Four variants for different home page layouts
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  variant: 'classic' | 'split' | 'minimal' | 'enterprise';
}

export default function HeroSection({ variant }: HeroSectionProps) {
  const commonProps = {
    title: "Premium Web Hosting Solutions",
    subtitle: "Reliable, fast, and secure hosting for websites of all sizes",
    primaryCta: "Get Started",
    secondaryCta: "View Plans",
    primaryUrl: "#plans",
    secondaryUrl: "#plans",
  };

  switch (variant) {
    case 'classic':
      return (
        <section className="py-20 gradient-dark text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {commonProps.title}
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-gray-300 mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {commonProps.subtitle}
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    {commonProps.primaryCta}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                    {commonProps.secondaryCta}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      );

    case 'split':
      return (
        <section className="py-24 md:py-32 gradient-dark text-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  {commonProps.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8">
                  {commonProps.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      {commonProps.primaryCta}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                      {commonProps.secondaryCta}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-blue-500 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-4">99.9%</div>
                    <div className="text-gray-600 mb-6">Uptime Guarantee</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      );

    case 'minimal':
      return (
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-8">
                Performance First
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                {commonProps.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12">
                {commonProps.subtitle}
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    {commonProps.primaryCta}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="lg">
                    {commonProps.secondaryCta}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      );

    case 'enterprise':
      return (
        <section className="py-24 md:py-32 gradient-dark text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-8">
                  Enterprise Solutions
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  {commonProps.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
                  {commonProps.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                      {commonProps.primaryCta}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                      {commonProps.secondaryCta}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">🏢</div>
                <p className="text-sm text-gray-400">Enterprise</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">🛡️</div>
                <p className="text-sm text-gray-400">Secure</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">⚡</div>
                <p className="text-sm text-gray-400">Fast</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">24/7</div>
                <p className="text-sm text-gray-400">Support</p>
              </motion.div>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}