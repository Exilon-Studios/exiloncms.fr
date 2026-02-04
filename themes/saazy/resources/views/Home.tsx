/**
 * Saazy Theme - Home Page
 *
 * Modern theme with Framer Motion animations
 */

import { Head } from '@inertiajs/react';

interface HomeProps {
  siteName?: string;
  message?: string;
  server?: any;
  servers?: any[];
}

export default function SaazyThemeHome({ siteName, message, servers = [] }: HomeProps) {
  const primaryServer = servers?.[0];

  return (
    <>
      <Head title="Home" />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 tracking-tight">
              <span className="block">{siteName || 'Saazy'}</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-purple-100">
              {message || 'A modern experience for your community'}
            </p>

            {primaryServer && (
              <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
                <span className={`w-3 h-3 rounded-full ${primaryServer.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className="text-white font-medium">
                  {primaryServer.isOnline ? 'Server Online' : 'Server Offline'}
                </span>
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={primaryServer?.join_url || '#'}
                className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:bg-purple-50 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/shop"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose Us?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Built with love and cutting-edge technology
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized for speed' },
                { icon: '🎨', title: 'Beautiful Design', desc: 'Modern and clean UI' },
                { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security' },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of happy users
            </p>
            <a
              href="/register"
              className="inline-block px-10 py-4 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-purple-50 transition-colors"
            >
              Create Account
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
