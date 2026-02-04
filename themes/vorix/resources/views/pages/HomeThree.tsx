'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code, Palette, BarChart3, Globe, Users, Sparkles, Lightbulb, Zap } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import TestimonialSlider from '@/components/TestimonialSlider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomeThree() {
  const services = [
    {
      title: 'Web Development',
      description: 'Building robust, scalable web applications with modern frameworks',
      features: [
        'React & Next.js',
        'Node.js & Express',
        'Database Design',
        'API Development'
      ],
      icon: <Code className="h-6 w-6" />,
      link: '/services/development'
    },
    {
      title: 'UI/UX Design',
      description: 'Creating intuitive and engaging user experiences',
      features: [
        'User Research',
        'Wireframing',
        'Prototyping',
        'Design Systems'
      ],
      icon: <Palette className="h-6 w-6" />,
      link: '/services/design'
    },
    {
      title: 'Digital Marketing',
      description: 'Driving growth through data-driven marketing strategies',
      features: [
        'SEO Optimization',
        'Social Media Marketing',
        'Content Strategy',
        'Performance Analytics'
      ],
      icon: <BarChart3 className="h-6 w-6" />,
      link: '/services/marketing'
    }
  ];

  const innovations = [
    {
      title: 'AI-Powered Solutions',
      description: 'Leveraging artificial intelligence to automate processes and gain insights',
      icon: '🤖',
      features: ['Chatbots', 'Predictive Analytics', 'Automation', 'Personalization']
    },
    {
      title: 'Cloud-Native Architecture',
      description: 'Building applications that scale seamlessly in the cloud',
      icon: '☁️',
      features: ['Microservices', 'Containerization', 'DevOps', 'Security']
    },
    {
      title: 'Progressive Web Apps',
      description: 'Web apps that deliver native-like experiences on any device',
      icon: '📱',
      features: ['Offline Support', 'Push Notifications', 'Fast Loading', 'Cross-Platform']
    },
    {
      title: 'Blockchain Integration',
      description: 'Secure, transparent solutions powered by blockchain technology',
      icon: '🔗',
      features: ['Smart Contracts', 'NFTs', 'DeFi', 'Supply Chain']
    }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We constantly push the boundaries of what\'s possible',
      icon: <Sparkles className="h-8 w-8" />
    },
    {
      title: 'Excellence',
      description: 'Every project is delivered with the highest quality standards',
      icon: <Lightbulb className="h-8 w-8" />
    },
    {
      title: 'Speed',
      description: 'Rapid development without compromising quality',
      icon: <Zap className="h-8 w-8" />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Interactive Elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              Creative
              <br />
              Technology
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              We build innovative digital solutions that transform businesses and create meaningful experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4"
                as="a"
                href="/portfolio"
              >
                View Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
                as="a"
                href="/contact"
              >
                Start a Project
              </Button>
            </div>
          </motion.div>

          {/* Interactive Stats */}
          <motion.div
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="text-center">
              <AnimatedCounter value={100} suffix="+" className="text-3xl" />
              <p className="text-white/70 text-sm">Success Rate</p>
            </div>
            <div className="text-center">
              <AnimatedCounter value={24} suffix="h" className="text-3xl" />
              <p className="text-white/70 text-sm">Support</p>
            </div>
            <div className="text-center">
              <AnimatedCounter value={50} suffix="+" className="text-3xl" />
              <p className="text-white/70 text-sm">Team</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold mb-6"
            >
              Innovation at Work
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technologies that give your business a competitive edge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {innovations.map((innovation, index) => (
              <motion.div
                key={innovation.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-4">{innovation.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{innovation.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{innovation.description}</p>
                <ul className="space-y-1">
                  {innovation.features.slice(0, 2).map((feature, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center">
                      <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold mb-6"
            >
              Our Values
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-8 rounded-lg border hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="mb-4 text-primary">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold mb-6"
            >
              Our Services
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions tailored to your unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  icon={service.icon}
                  link={service.link}
                  gradient="from-purple-500 to-pink-600"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold mb-6"
            >
              Our Process
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A streamlined approach to delivering exceptional results
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20"></div>

            <div className="space-y-12">
              {[
                { title: 'Ideation', description: 'Brainstorming and planning', icon: '💡' },
                { title: 'Design', description: 'Creating visual concepts', icon: '🎨' },
                { title: 'Development', description: 'Building the solution', icon: '🚀' },
                { title: 'Testing', description: 'Ensuring quality', icon: '✅' },
                { title: 'Launch', description: 'Going live', icon: '🎯' }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center z-10">
                    <span className="text-xl">{step.icon}</span>
                  </div>

                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-card p-6 rounded-lg border">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold mb-6"
            >
              Technology Stack
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern technologies that power our solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'AWS', 'Docker'].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="bg-card p-4 rounded-lg border text-center cursor-pointer"
              >
                <span className="font-medium">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold mb-6"
            >
              Client Success
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 md:p-16 text-center"
          >
            <h2 className="text-5xl font-bold text-white mb-6">Ready to Innovate?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's create something extraordinary together. Contact us to discuss your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4"
                as="a"
                href="/contact"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
                as="a"
                href="/about"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}