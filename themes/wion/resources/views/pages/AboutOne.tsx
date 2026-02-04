/**
 * Wion Theme - About One Layout
 * Creative agency about page with team focus
 */

import React from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
import WionLayout from '@/layouts/WionLayout';
import { Head } from '@inertiajs/react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image?: string;
  social: {
    linkedin?: string;
    twitter?: string;
    dribbble?: string;
  };
}

interface Value {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface AboutOneProps {
  team?: TeamMember[];
  values?: Value[];
  stats?: { label: string; value: string }[];
}

export default function AboutOne({ team = [], values = [], stats = [] }: AboutOneProps) {
  const { settings } = usePage<PageProps>().props as any;

  // Default team members
  const defaultTeam: TeamMember[] = [
    {
      id: 1,
      name: 'Alex Thompson',
      role: 'Creative Director',
      bio: 'With over 10 years of experience in creative design, Alex leads our team with vision and passion.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      id: 2,
      name: 'Sarah Miller',
      role: 'Lead Designer',
      bio: 'Sarah brings expertise in UI/UX design and brand strategy to every project she touches.',
      social: { dribbble: '#', twitter: '#' }
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Developer',
      bio: 'Mike transforms designs into reality with his exceptional coding skills and attention to detail.',
      social: { github: '#', linkedin: '#' }
    },
    {
      id: 4,
      name: 'Emily Davis',
      role: 'Project Manager',
      bio: 'Emily ensures every project runs smoothly from concept to completion.',
      social: { linkedin: '#', twitter: '#' }
    }
  ];

  // Default values
  const defaultValues: Value[] = [
    {
      id: 1,
      title: trans('wion.values.excellence', 'Excellence'),
      description: trans('wion.values.excellence_desc', 'We strive for perfection in everything we do'),
      icon: 'award'
    },
    {
      id: 2,
      title: trans('wion.values.innovation', 'Innovation'),
      description: trans('wion.values.innovation_desc', 'Pushing boundaries and thinking outside the box'),
      icon: 'lightbulb'
    },
    {
      id: 3,
      title: trans('wion.values.collaboration', 'Collaboration'),
      description: trans('wion.values.collaboration_desc', 'Working together to achieve remarkable results'),
      icon: 'users'
    },
    {
      id: 4,
      title: trans('wion.values.integrity', 'Integrity'),
      description: trans('wion.values.integrity_desc', 'Honesty and transparency in all our dealings'),
      icon: 'shield-check'
    }
  ];

  // Default stats
  const defaultStats = [
    { label: 'Projects Completed', value: '150+' },
    { label: 'Happy Clients', value: '50+' },
    { label: 'Awards Won', value: '25+' },
    { label: 'Years Experience', value: '5+' }
  ];

  const finalTeam = team.length > 0 ? team : defaultTeam;
  const finalValues = values.length > 0 ? values : defaultValues;
  const finalStats = stats.length > 0 ? stats : defaultStats;

  return (
    <WionLayout variant="one">
      <Head title={trans('wion.pages.about.title', 'About Us') + ' | Wion'} />

      {/* Hero Section */}
      <AboutHero />

      {/* Our Story */}
      <OurStory />

      {/* Team Section */}
      <TeamSection team={finalTeam} />

      {/* Values Section */}
      <ValuesSection values={finalValues} />

      {/* Stats Section */}
      <StatsSection stats={finalStats} />

      {/* Contact CTA */}
      <ContactCTA />
    </WionLayout>
  );
}

// About Hero Component
function AboutHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {trans('wion.about_hero.title', 'About Wion')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {trans('wion.about_hero.subtitle', 'Creative excellence since 2020')}
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">5+</div>
              <div className="text-gray-600 dark:text-gray-300">{trans('wion.about_hero.years', 'Years')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">150+</div>
              <div className="text-gray-600 dark:text-gray-300">{trans('wion.about_hero.projects', 'Projects')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">50+</div>
              <div className="text-gray-600 dark:text-gray-300">{trans('wion.about_hero.clients', 'Clients')}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full opacity-10"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
}

// Our Story Component
function OurStory() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {trans('wion.story.title', 'Our Story')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Founded in 2020, Wion began as a passion project for creative professionals who wanted to break free from traditional agency constraints.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We believe that great design should not only look beautiful but also solve real problems and deliver measurable results.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our team of designers, developers, and strategists work collaboratively to create exceptional digital experiences that make a difference.
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
        </div>
      </div>
    </section>
  );
}

// Team Section Component
function TeamSection({ team }: { team: AboutOneProps['team'] }) {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.team.title', 'Meet Our Team')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.team.subtitle', 'Talented individuals passionate about creativity and excellence')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Team Card Component
function TeamCard({ member, index }: { member: AboutOneProps['team'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center group"
    >
      <div className="relative mb-6">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span className="text-white text-3xl font-bold">
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>

        {/* Social links overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
          <div className="flex gap-3">
            {member.social.linkedin && (
              <a href={member.social.linkedin} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
            {member.social.twitter && (
              <a href={member.social.twitter} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482c-3.498-.175-6.632-1.858-8.716-4.414a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            {member.social.dribbble && (
              <a href={member.social.dribbble} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.074 5.896c-.989.549-2.11.924-3.317 1.096.769-.461 1.358-1.19 1.637-2.06-.72.428-1.519.739-2.37.905-.68-.725-1.649-1.178-2.714-1.178-2.055 0-3.723 1.668-3.723 3.723 0 .29.033.572.095.843-3.097-.155-5.841-1.638-7.676-3.895-.32.55-.502 1.19-.502 1.863 0 1.29.657 2.426 1.656 3.09-.61-.019-1.187-.187-1.69-.467v.047c0 1.803 1.284 3.308 2.986 3.647-.313.085-.643.13-.982.13-.24 0-.473-.023-.7-.066.474 1.477 1.846 2.552 3.47 2.584-.87.682-1.97 1.088-3.164 1.088-.206 0-.408-.012-.607-.035 1.126.723 2.457 1.145 3.887 1.145 4.664 0 7.215-3.865 7.215-7.215 0-.11-.003-.222-.008-.332.495-.357.925-.802 1.264-1.31.461.827.729 1.781.729 2.809 0 1.942-1.006 3.647-2.542 4.647-.917.51-1.979.809-3.124.809-.715 0-1.402-.105-2.05-.301.613 1.916 2.398 3.314 4.506 3.314 2.691 0 4.872-2.181 4.872-4.872 0-.348-.039-.687-.11-1.013.839-.604 1.562-1.36 2.126-2.22z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">{member.name}</h3>
      <p className="text-blue-600 mb-4">{member.role}</p>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{member.bio}</p>
    </motion.div>
  );
}

// Values Section Component
function ValuesSection({ values }: { values: AboutOneProps['values'] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.values.title', 'Our Values')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <ValueCard key={value.id} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Value Card Component
function ValueCard({ value, index }: { value: AboutOneProps['values'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-white rounded-full"></div>
      </div>
      <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
    </motion.div>
  );
}

// Stats Section Component
function StatsSection({ stats }: { stats: AboutOneProps['stats'] }) {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 text-blue-600">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact CTA Component
function ContactCTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {trans('wion.cta.title', 'Ready to Work Together?')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {trans('wion.cta.subtitle', 'Let\'s discuss how we can bring your vision to life')}
          </p>
          <button className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            {trans('wion.cta.get_in_touch', 'Get in Touch')}
          </button>
        </div>
      </div>
    </section>
  );
}