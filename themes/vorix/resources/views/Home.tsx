/**
 * Vorix Theme - Home Page
 * Modern digital agency theme with light/dark mode
 */

import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import VorixLayout from '@/layouts/VorixLayout';
import HeroCarousel from '@/components/vorix/HeroCarousel';
import ServiceCard from '@/components/vorix/ServiceCard';
import TestimonialSlider from '@/components/vorix/TestimonialSlider';
import AnimatedCounter from '@/components/vorix/AnimatedCounter';

interface HomeProps {
  siteName?: string;
  services?: any[];
  stats?: { value: number; suffix?: string; label: string }[];
}

export default function Home({ services, stats }: HomeProps) {
  const { settings } = usePage<PageProps>().props as any;

  const defaultServices = [
    { id: 1, title: 'Web Development', icon: 'Code', description: 'Modern websites with cutting-edge technology' },
    { id: 2, title: 'UI/UX Design', icon: 'Palette', description: 'Beautiful and intuitive user interfaces' },
    { id: 3, title: 'SEO Optimization', icon: 'TrendingUp', description: 'Rank higher on search engines' },
    { id: 4, title: 'Brand Strategy', icon: 'Target', description: 'Build a strong brand identity' },
  ];

  const defaultStats = [
    { value: 150, suffix: '+', label: 'Projects Completed' },
    { value: 50, suffix: '+', label: 'Happy Clients' },
    { value: 5, suffix: '', label: 'Years Experience' },
    { value: 25, suffix: '+', label: 'Team Members' },
  ];

  return (
    <VorixLayout>
      <Head title="Home - Vorix" />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Services Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground">What we can do for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(services || defaultServices).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {(stats || defaultStats).map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSlider />
    </VorixLayout>
  );
}
