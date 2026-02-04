'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Users, Award, TrendingUp } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import ServiceCard from '@/components/ServiceCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import TestimonialSlider from '@/components/TestimonialSlider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomeOne() {
  const services = [
    {
      title: 'Web Design',
      description: 'Beautiful, responsive websites that captivate your audience',
      features: [
        'Mobile-first design',
        'Fast loading speeds',
        'SEO optimized',
        'User-friendly interface'
      ],
      icon: <Users className="h-6 w-6" />,
      link: '/services/web-design'
    },
    {
      title: 'Development',
      description: 'Custom web applications tailored to your business needs',
      features: [
        'Scalable architecture',
        'Modern frameworks',
        'Clean code',
        'Maintenance support'
      ],
      icon: <Award className="h-6 w-6" />,
      link: '/services/development'
    },
    {
      title: 'Digital Marketing',
      description: 'Strategies to grow your online presence and reach',
      features: [
        'SEO optimization',
        'Social media marketing',
        'Content strategy',
        'Analytics & reporting'
      ],
      icon: <TrendingUp className="h-6 w-6" />,
      link: '/services/marketing'
    }
  ];

  const features = [
    {
      title: 'Fast & Reliable',
      description: 'Lightning-fast loading times with 99.9% uptime guarantee',
      icon: '⚡'
    },
    {
      title: 'Secure & Scalable',
      description: 'Enterprise-level security and seamless scaling for growth',
      icon: '🔒'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock technical support from our expert team',
      icon: '🛟'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <HeroCarousel />

        {/* Quick Stats */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <div className="text-center">
                <AnimatedCounter value={150} suffix="+" />
                <p className="text-sm mt-2 text-white/80">Happy Clients</p>
              </div>
              <div className="text-center">
                <AnimatedCounter value={500} suffix="+" />
                <p className="text-sm mt-2 text-white/80">Projects Completed</p>
              </div>
              <div className="text-center">
                <AnimatedCounter value={50} suffix="+" />
                <p className="text-sm mt-2 text-white/80">Team Members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              Our Services
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive digital solutions to help your business thrive in the online world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  icon={service.icon}
                  link={service.link}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-6">Why Choose Vorix?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We stand out from the competition with our commitment to excellence, innovation, and client satisfaction.
              </p>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">🚀</span>
                      <span>Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Load Time</span>
                        <span className="font-semibold">0.8s</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '95%' }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">📱</span>
                      <span>Mobile Score</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Performance</span>
                        <span className="font-semibold">98/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '98%' }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">⭐</span>
                      <span>SEO Score</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Optimization</span>
                        <span className="font-semibold">92/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              What Our Clients Say
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from businesses we've helped succeed.
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help your business grow with cutting-edge digital solutions.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4"
              as="a"
              href="/contact"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}