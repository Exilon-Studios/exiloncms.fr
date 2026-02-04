'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating: number;
  featured?: boolean;
}

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO',
      company: 'Tech Innovations',
      content: 'Working with Vorix has been a game-changer for our business. The attention to detail and creative solutions exceeded our expectations completely.',
      rating: 5,
      featured: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Marketing Director',
      company: 'Global Solutions',
      content: 'The team delivered outstanding results. Our website now generates 3x more leads than before. Highly recommended!',
      rating: 5,
      featured: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      company: 'Startup Hub',
      content: 'Professional, creative, and timely. Vorix transformed our digital presence and helped us stand out in a competitive market.',
      rating: 4,
      featured: false
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Founder',
      company: 'Creative Agency',
      content: 'Excellent communication and exceptional quality. The final product was exactly what we envisioned and more.',
      rating: 5,
      featured: true
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'Operations Manager',
      company: 'E-commerce Plus',
      content: 'The new platform has improved our user experience significantly. Customer satisfaction is at an all-time high.',
      rating: 4,
      featured: false
    }
  ];

  // Filter featured testimonials
  const featuredTestimonials = testimonials.filter(t => t.featured);

  // Auto-rotate featured testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredTestimonials.length]);

  const nextTestimonial = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevTestimonial = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToTestimonial = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Featured Testimonial */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <Quote className="h-8 w-8 text-blue-200" />
            <span className="text-sm uppercase tracking-wide">Featured Review</span>
          </div>

          <motion.div
            key={featuredIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <blockquote className="text-2xl md:text-3xl font-light italic mb-8 leading-relaxed">
              "{featuredTestimonials[featuredIndex]?.content}"
            </blockquote>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {featuredTestimonials[featuredIndex]?.name}
              </h3>
              <p className="text-blue-200">
                {featuredTestimonials[featuredIndex]?.role}, {featuredTestimonials[featuredIndex]?.company}
              </p>
              <div className="flex justify-center space-x-1">
                {renderStars(featuredTestimonials[featuredIndex]?.rating || 5)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* All Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300">
              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <blockquote className="text-sm text-muted-foreground mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToTestimonial(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-primary scale-125' : 'bg-muted'
            }`}
            aria-label={`View testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}