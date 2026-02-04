/**
 * Hostinkar Theme - Home Page
 * Web hosting theme with modern design and animations
 */

import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import HeroSection from '@/components/hostinkar/HeroSection';
import HostingPlans from '@/components/hostinkar/HostingPlans';
import FeaturesSection from '@/components/hostinkar/FeaturesSection';
import TestimonialCarousel from '@/components/hostinkar/TestimonialCarousel';
import DomainSearch from '@/components/hostinkar/DomainSearch';
import HostinkarLayout from '@/layouts/HostinkarLayout';

interface HomeProps {
  siteName?: string;
  description?: string;
  plans?: any[];
}

export default function Home({ siteName, description, plans }: HomeProps) {
  const { settings } = usePage<PageProps>().props as any;

  const defaultPlans = [
    {
      id: 1,
      name: 'Starter',
      price: 3.99,
      period: 'month',
      features: ['1 Website', '10GB SSD Storage', 'Free SSL Certificate', '24/7 Support'],
      featured: false,
    },
    {
      id: 2,
      name: 'Professional',
      price: 9.99,
      period: 'month',
      features: ['5 Websites', '50GB SSD Storage', 'Free Domain', 'Priority Support', 'Daily Backups'],
      featured: true,
    },
    {
      id: 3,
      name: 'Business',
      price: 19.99,
      period: 'month',
      features: ['Unlimited Websites', '200GB SSD Storage', 'Free Domain', 'Phone Support', 'Hourly Backups', 'CDN Included'],
      featured: false,
    },
  ];

  return (
    <HostinkarLayout>
      <Head title="Home - Hosting" />

      {/* Hero Section */}
      <HeroSection
        title="Fast & Reliable Web Hosting"
        subtitle="Launch your website in minutes with our powerful hosting solutions"
        ctaText="Get Started"
      />

      {/* Domain Search */}
      <DomainSearch />

      {/* Hosting Plans */}
      <HostingPlans plans={plans || defaultPlans} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials */}
      <TestimonialCarousel />
    </HostinkarLayout>
  );
}
