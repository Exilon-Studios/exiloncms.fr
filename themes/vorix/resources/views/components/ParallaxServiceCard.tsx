/**
 * Vorix Theme - Parallax Service Card Component
 * Service card with parallax scrolling effect
 */

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  features?: string[];
  index?: number;
}

export default function ParallaxServiceCard({
  icon,
  title,
  description,
  features = [],
  index = 0
}: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={animationVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer p-8"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon || (
            <div className="w-8 h-8 bg-white rounded-full"></div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-4 relative z-10 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">
        {description}
      </p>

      {/* Features list */}
      <ul className="space-y-3 mb-6 relative z-10">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Read more link */}
      <div className="relative z-10">
        <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
          Learn More
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 dark:bg-blue-900 rounded-full opacity-50"></div>
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-purple-100 dark:bg-purple-900 rounded-full opacity-50"></div>
    </motion.div>
  );
}