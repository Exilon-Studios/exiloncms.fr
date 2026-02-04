/**
 * Wion Theme - Service Tabs Component
 * Animated tabbed service showcase
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image?: string;
  price?: string;
  duration?: string;
}

interface ServiceTabsProps {
  services: Service[];
  layout?: 'horizontal' | 'vertical';
  showImages?: boolean;
  animateTabs?: boolean;
  className?: string;
}

export default function ServiceTabs({
  services,
  layout = 'horizontal',
  showImages = true,
  animateTabs = true,
  className = ''
}: ServiceTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    hover: { scale: 1.05 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`service-tabs ${layout} ${className}`}>
      {/* Tab Navigation */}
      <div className={`tabs-nav ${layout === 'vertical' ? 'flex-col' : 'flex-row'} gap-4 mb-8`}>
        {services.map((service, index) => (
          <motion.button
            key={service.id}
            onClick={() => setActiveTab(index)}
            className={`relative px-6 py-4 rounded-lg font-medium transition-all duration-300 ${
              activeTab === index
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            } ${layout === 'vertical' ? 'w-full text-left' : ''}`}
            variants={animateTabs ? tabVariants : undefined}
            initial={animateTabs ? 'hidden' : undefined}
            animate={animateTabs ? (activeTab === index ? 'visible' : 'hidden') : undefined}
            whileHover={animateTabs ? 'hover' : undefined}
            transition={animateTabs ? { duration: 0.3 } : undefined}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeTab === index
                  ? 'bg-white text-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </div>
              <span>{service.title}</span>
              {activeTab === index && (
                <motion.div
                  className="absolute inset-0 bg-blue-600 rounded-lg"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        className={`tab-content ${layout === 'vertical' ? 'mt-8' : ''}`}
      >
        <ServiceContent service={services[activeTab]} showImages={showImages} />
      </motion.div>
    </div>
  );
}

// Service Content Component
function ServiceContent({ service, showImages }: { service: Service; showImages: boolean }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Service Image */}
      {showImages && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl shadow-xl"
        >
          <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-purple-600"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
              <p className="text-sm opacity-90">{service.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Service Details */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {service.description}
          </p>
        </motion.div>

        {/* Service Info */}
        {(service.price || service.duration) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {service.price && (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Starting Price</p>
                <p className="text-xl font-bold text-blue-600">{service.price}</p>
              </div>
            )}
            {service.duration && (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                <p className="text-xl font-bold">{service.duration}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4">What's Included</h3>
          <ul className="space-y-3">
            {service.features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4"
        >
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            Get Started
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// Vertical Service Tabs
export function VerticalServiceTabs({
  services,
  showImages = true,
  animateTabs = true
}: ServiceTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="vertical-service-tabs">
      <div className="grid md:grid-cols-4 gap-0">
        {/* Tab Navigation */}
        <div className="md:border-r dark:border-gray-700">
          <div className="flex flex-col">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveTab(index)}
                className={`relative px-4 py-6 text-left transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeTab === index
                      ? 'bg-white text-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <span className="font-medium">{service.title}</span>
                  {activeTab === index && (
                    <div className="ml-auto">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3 p-8">
          <ServiceContent service={services[activeTab]} showImages={showImages} />
        </div>
      </div>
    </div>
  );
}

// Animated Service Tabs with progress indicator
export function AnimatedServiceTabsWithProgress({
  services,
  className = ''
}: ServiceTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={`animated-service-tabs ${className}`}>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((activeTab + 1) / services.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Step {activeTab + 1} of {services.length}</span>
          <span>{services[activeTab].title}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {services.map((service, index) => (
          <motion.button
            key={service.id}
            onClick={() => setActiveTab(index)}
            className={`relative p-4 rounded-lg font-medium transition-all duration-300 ${
              activeTab === index
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                activeTab === index
                  ? 'bg-white text-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <span className="text-sm">{service.title}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8"
      >
        <ServiceContent service={services[activeTab]} showImages={true} />
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
          disabled={activeTab === 0}
          className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setActiveTab(prev => Math.min(services.length - 1, prev + 1))}
          disabled={activeTab === services.length - 1}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {activeTab === services.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}