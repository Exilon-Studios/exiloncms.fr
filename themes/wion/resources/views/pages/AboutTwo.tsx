/**
 * Wion Theme - About Two Layout
 * Mission-focused about page with timeline
 */

import React from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
import WionLayout from '@/layouts\WionLayout';
import { Head } from '@inertiajs/react';

interface Milestone {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  year: string;
}

interface AboutTwoProps {
  milestones?: Milestone[];
  services?: Service[];
  achievements?: Achievement[];
}

export default function AboutTwo({ milestones = [], services = [], achievements = [] }: AboutTwoProps) {
  const { settings } = usePage<PageProps>().props as any;

  // Default milestones
  const defaultMilestones: Milestone[] = [
    {
      id: 1,
      year: '2020',
      title: trans('wion.milestones.founded', 'Founded'),
      description: trans('wion.milestones.founded_desc', 'Wion was established with a vision for creative excellence'),
      icon: 'flag'
    },
    {
      id: 2,
      year: '2021',
      title: trans('wion.milestones.first_project', 'First Major Project'),
      description: trans('wion.milestones.first_project_desc', 'Completed our first brand identity project for a tech startup'),
      icon: 'rocket'
    },
    {
      id: 3,
      year: '2022',
      title: trans('wion.milestones.expansion', 'Team Expansion'),
      description: trans('wion.milestones.expansion_desc', 'Grew our team with talented designers and developers'),
      icon: 'users'
    },
    {
      id: 4,
      year: '2023',
      title: trans('wion.milestones.awards', 'Industry Recognition'),
      description: trans('wion.milestones.awards_desc', 'Won multiple design awards for innovative projects'),
      icon: 'award'
    },
    {
      id: 5,
      year: '2024',
      title: trans('wion.milestones.growth', 'Rapid Growth'),
      description: trans('wion.milestones.growth_desc', 'Expanded our client base and project portfolio'),
      icon: 'trending-up'
    },
    {
      id: 6,
      year: '2025',
      title: trans('wion.milestones.innovation', 'Continuous Innovation'),
      description: trans('wion.milestones.innovation_desc', 'Leading the way in creative digital solutions'),
      icon: 'lightbulb'
    }
  ];

  // Default services
  const defaultServices: Service[] = [
    {
      id: 1,
      title: trans('wion.services.branding', 'Brand Strategy'),
      description: trans('wion.services.branding_desc', 'Building powerful brand identities and strategies'),
      icon: 'wand-2'
    },
    {
      id: 2,
      title: trans('wion.services.web', 'Web Design'),
      description: trans('wion.services.web_desc', 'Creating stunning and functional websites'),
      icon: 'monitor'
    },
    {
      id: 3,
      title: trans('wion.services.motion', 'Motion Graphics'),
      description: trans('wion.services.motion_desc', 'Bringing ideas to life with animation'),
      icon: 'video'
    },
    {
      id: 4,
      title: trans('wion.services.print', 'Print Design'),
      description: trans('wion.services.print_desc', 'Elegant print solutions for physical media'),
      icon: 'printer'
    }
  ];

  // Default achievements
  const defaultAchievements: Achievement[] = [
    {
      id: 1,
      title: trans('wion.achievements.design_award', 'Design Excellence Award'),
      description: trans('wion.achievements.design_award_desc', 'Recognized for innovative branding work'),
      year: '2023'
    },
    {
      id: 2,
      title: trans('wion.achievements.client_satisfaction', '100% Client Satisfaction'),
      description: trans('wion.achievements.client_satisfaction_desc', 'Maintained perfect satisfaction rating for 2 years'),
      year: '2024'
    },
    {
      id: 3,
      title: trans('wion.achievements.project_count', '150+ Projects Completed'),
      description: trans('wion.achievements.project_count_desc', 'Successfully delivered diverse projects across industries'),
      year: '2025'
    }
  ];

  const finalMilestones = milestones.length > 0 ? milestones : defaultMilestones;
  finalMilestones.reverse(); // Reverse to show newest first

  const finalServices = services.length > 0 ? services : defaultServices;
  const finalAchievements = achievements.length > 0 ? achievements : defaultAchievements;

  return (
    <WionLayout variant="two">
      <Head title={trans('wion.pages.about.title', 'About Us') + ' | Wion'} />

      {/* Hero with Video Background */}
      <AboutVideoHero />

      {/* Mission Statement */}
      <MissionStatement />

      {/* Timeline Section */}
      <TimelineSection milestones={finalMilestones} />

      {/* Services Section */}
      <AboutServices services={finalServices} />

      {/* Achievements Section */}
      <AchievementsSection achievements={finalAchievements} />

      {/* Team Showcase */}
      <TeamShowcase />

      {/* Contact CTA */}
      <ContactCTATwo />
    </WionLayout>
  );
}

// About Video Hero Component
function AboutVideoHero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {trans('wion.video_about.title', 'Our Story')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {trans('wion.video_about.subtitle', 'From concept to creation, we bring ideas to life')}
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {trans('wion.video_about.watch_video', 'Watch Our Story')}
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              {trans('wion.video_about.learn_more', 'Learn More')}
            </button>
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

// Mission Statement Component
function MissionStatement() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {trans('wion.mission.title', 'Our Mission')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          >
            {trans('wion.mission.description', 'We believe in the power of creativity to transform businesses and connect people. Our mission is to create exceptional digital experiences that not only look beautiful but also deliver meaningful results for our clients.')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">Creative</div>
              <div className="text-gray-600 dark:text-gray-300">{trans('wion.mission.creative', 'Design')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">Strategic</div>
              <div className="text-gray-600 dark:text-gray-300">{trans('wion.mission.strategic', 'Planning')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">Results</div>
              <div className="text-gray-600 dark:text-gray-300">{trans('wion.mission.results', 'Driven')}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Timeline Section Component
function TimelineSection({ milestones }: { milestones: AboutTwoProps['milestones'] }) {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.timeline.title', 'Our Journey')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.timeline.subtitle', 'Key milestones that shaped our agency')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300 dark:bg-gray-600"></div>

            {/* Timeline items */}
            {milestones.map((milestone, index) => (
              <TimelineItem key={milestone.id} milestone={milestone} index={index} isEven={index % 2 === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Timeline Item Component
function TimelineItem({ milestone, index, isEven }: { milestone: AboutTwoProps['milestones'][0]; index: number; isEven: boolean }) {
  const isLeft = isEven;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative mb-12 flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Timeline dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full z-10"></div>

      {/* Content */}
      <div className={`w-5/12 ${isLeft ? 'mr-auto pr-8 text-right' : 'ml-auto pl-8'}`}>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium">
              {milestone.year}
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-4">{milestone.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// About Services Component
function AboutServices({ services }: { services: AboutTwoProps['services'] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.services.title', 'What We Do')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.services.subtitle', 'Comprehensive creative solutions for modern businesses')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <AboutServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// About Service Card Component
function AboutServiceCard({ service, index }: { service: AboutTwoProps['services'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
    </motion.div>
  );
}

// Achievements Section Component
function AchievementsSection({ achievements }: { achievements: AboutTwoProps['achievements'] }) {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.achievements.title', 'Our Achievements')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.achievements.subtitle', 'Recognition for our commitment to excellence')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Achievement Card Component
function AchievementCard({ achievement, index }: { achievement: AboutTwoProps['achievements'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="mb-4">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium">
          {achievement.year}
        </span>
      </div>
      <h3 className="text-2xl font-bold mb-4">{achievement.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
    </motion.div>
  );
}

// Team Showcase Component
function TeamShowcase() {
  const teamMembers = [
    { name: 'Alex Thompson', role: 'Creative Director' },
    { name: 'Sarah Miller', role: 'Lead Designer' },
    { name: 'Mike Johnson', role: 'Developer' },
    { name: 'Emily Davis', role: 'Project Manager' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {trans('wion.team.title', 'Meet the Team')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {trans('wion.team.subtitle', 'Passionate individuals dedicated to creative excellence')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-blue-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact CTA Two Component
function ContactCTATwo() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {trans('wion.cta.title', 'Let\'s Create Something Amazing Together')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            {trans('wion.cta.subtitle', 'Ready to start your next project? Get in touch with our team')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              {trans('wion.cta.start_project', 'Start Your Project')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}