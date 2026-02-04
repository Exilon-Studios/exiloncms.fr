/**
 * Wion Theme - About Three Layout
 * Minimalist about page with focus on story
 */

import React from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
import WionLayout from '@/layouts\WionLayout';
import { Head } from '@inertiajs/react';

interface Quote {
  id: number;
  text: string;
  author: string;
  role: string;
}

interface Principle {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface AboutThreeProps {
  quote?: Quote;
  principles?: Principle[];
}

export default function AboutThree({ quote = {}, principles = [] }: AboutThreeProps) {
  const { settings } = usePage<PageProps>().props as any;

  // Default quote
  const defaultQuote: Quote = {
    id: 1,
    text: trans('wion.quote.text', 'Great design is not just what it looks like and feels like. Great design is how it works.'),
    author: 'Steve Jobs',
    role: 'Apple Inc.'
  };

  // Default principles
  const defaultPrinciples: Principle[] = [
    {
      id: 1,
      title: trans('wion.principles.user_first', 'User First'),
      description: trans('wion.principles.user_first_desc', 'Every decision starts with the user experience'),
      icon: 'user'
    },
    {
      id: 2,
      title: trans('wion.principles.simplicity', 'Simplicity'),
      description: trans('wion.principles.simplicity_desc', 'Less is more in design and execution'),
      icon: 'minus'
    },
    {
      id: 3,
      title: trans('wion.principles.innovation', 'Innovation'),
      description: trans('wion.principles.innovation_desc', 'Pushing boundaries to create something new'),
      icon: 'lightbulb'
    },
    {
      id: 4,
      title: trans('wion.principles.collaboration', 'Collaboration'),
      description: trans('wion.principles.collaboration_desc', 'Working together for exceptional results'),
      icon: 'users'
    }
  ];

  const finalQuote = quote.text ? quote : defaultQuote;
  const finalPrinciples = principles.length > 0 ? principles : defaultPrinciples;

  return (
    <WionLayout variant="three">
      <Head title={trans('wion.pages.about.title', 'About Us') + ' | Wion'} />

      {/* Minimal Hero */}
      <MinimalAboutHero />

      {/* Story Section */}
      <StorySection />

      {/* Quote Section */}
      <QuoteSection quote={finalQuote} />

      {/* Principles Section */}
      <PrinciplesSection principles={finalPrinciples} />

      {/* Team Minimal */}
      <MinimalTeam />

      {/* Contact */}
      <MinimalContact />
    </WionLayout>
  );
}

// Minimal About Hero Component
function MinimalAboutHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
            {trans('wion.minimal_about.title', 'About Wion')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {trans('wion.minimal_about.subtitle', 'Design • Development • Branding')}
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-light">5+</div>
              <div className="text-gray-600 dark:text-gray-300">Years</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light">150+</div>
              <div className="text-gray-600 dark:text-gray-300">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Clients</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Story Section Component
function StorySection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4">
              {trans('wion.story.title', 'Our Story')}
            </h2>
            <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-8"></div>
          </div>

          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-2xl font-light mb-4">2020</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Wion was founded on the belief that great design should be accessible to everyone. We started as a small team of passionate designers and developers.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg"></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className="text-2xl font-light mb-4">Present</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Today, we're a full-service creative agency working with clients around the world. Our focus remains on creating exceptional digital experiences.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Quote Section Component
function QuoteSection({ quote }: { quote: AboutThreeProps['quote'] }) {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-light italic mb-8 text-gray-700 dark:text-gray-300"
          >
            "{quote.text}"
          </motion.blockquote>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xl font-semibold mb-2">{quote.author}</p>
            <p className="text-gray-600 dark:text-gray-400">{quote.role}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Principles Section Component
function PrinciplesSection({ principles }: { principles: AboutThreeProps['principles'] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-4">
            {trans('wion.principles.title', 'Our Principles')}
          </h2>
          <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-8"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {principles.map((principle, index) => (
            <PrincipleCard key={principle.id} principle={principle} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Principle Card Component
function PrincipleCard({ principle, index }: { principle: AboutThreeProps['principles'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center p-8"
    >
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>
      <h3 className="text-2xl font-light mb-4">{principle.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{principle.description}</p>
    </motion.div>
  );
}

// Minimal Team Component
function MinimalTeam() {
  const team = [
    { name: 'Alex Thompson', role: 'Creative Director' },
    { name: 'Sarah Miller', role: 'Lead Designer' },
    { name: 'Mike Johnson', role: 'Developer' }
  ];

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-4">
            {trans('wion.team.title', 'Team')}
          </h2>
          <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-8"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-400 text-3xl font-light">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-xl font-light mb-2">{member.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Minimal Contact Component
function MinimalContact() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            {trans('wion.contact.title', 'Get in Touch')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {trans('wion.contact.subtitle', 'Ready to start your project? Let\'s talk.')}
          </p>
          <button className="px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-light hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
            {trans('wion.contact.contact', 'Contact Us')}
          </button>
        </div>
      </div>
    </section>
  );
}