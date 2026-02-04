/**
 * Wion Theme - Home Page
 * Creative digital agency theme with particle effects
 */

import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import ParticleBackground from '@/components/wion/ParticleBackground';
import VideoHero from '@/components/wion/VideoHero';
import PortfolioGrid from '@/components/wion/PortfolioGrid';
import ServiceTabs from '@/components/wion/ServiceTabs';
import WionLayout from '@/layouts/WionLayout';

interface HomeProps {
  portfolioItems?: any[];
}

export default function Home({ portfolioItems }: HomeProps) {
  const { settings } = usePage<PageProps>().props as any;

  return (
    <WionLayout>
      <Head title="Home - Wion" />

      {/* Particle Background */}
      <ParticleBackground />

      {/* Video Hero Section */}
      <VideoHero
        title="We Create Digital Experiences"
        subtitle="Award-winning creative agency specialized in branding, design, and development"
        cta="Start a Project"
      />

      {/* Services Section */}
      <ServiceTabs />

      {/* Portfolio Grid */}
      <PortfolioGrid items={portfolioItems} />
    </WionLayout>
  );
}
