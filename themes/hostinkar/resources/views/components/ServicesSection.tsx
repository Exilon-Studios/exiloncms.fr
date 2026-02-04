/**
 * Services Section Component
 * Showcasing additional hosting services and features
 */

import { motion } from 'framer-motion';
import {
  Server,
  Shield,
  Database,
  Globe,
  BarChart3,
  Headphones,
  Code,
  Cloud
} from 'lucide-react';

interface Service {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  features: string[];
  cta: string;
}

export default function ServicesSection() {
  const services: Service[] = [
    {
      id: 1,
      icon: Cloud,
      title: "Cloud Hosting",
      description: "Scalable cloud hosting solutions for growing businesses",
      features: [
        "Auto-scaling resources",
        "99.99% uptime guarantee",
        "Global CDN",
        "24/7 monitoring"
      ],
      cta: "Learn More"
    },
    {
      id: 2,
      icon: Server,
      title: "VPS Hosting",
      description: "Virtual private servers for dedicated resources",
      features: [
        "Full root access",
        "SSD storage",
        "Dedicated IP",
        "Custom software"
      ],
      cta: "View Plans"
    },
    {
      id: 3,
      icon: Shield,
      title: "Security Suite",
      description: "Advanced security features for your website",
      features: [
        "SSL certificates",
        "DDoS protection",
        "Malware scanning",
        "Backups"
      ],
      cta: "Security Details"
    },
    {
      id: 4,
      icon: Database,
      title: "Database Management",
      description: "Optimized database hosting with advanced features",
      features: [
        "MySQL & PostgreSQL",
        "Automated backups",
        "Performance monitoring",
        "Easy migration"
      ],
      cta: "Database Options"
    },
    {
      id: 5,
      icon: BarChart3,
      title: "Analytics Pro",
      description: "Advanced analytics and reporting",
      features: [
        "Real-time traffic",
        "Conversion tracking",
        "Custom reports",
        "SEO insights"
      ],
      cta: "Analytics Demo"
    },
    {
      id: 6,
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock expert support",
      features: [
        "Live chat",
        "Phone support",
        "Ticket system",
        "Video tutorials"
      ],
      cta: "Contact Support"
    }
  ];

  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4"
        >
          Our Complete Service Suite
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          We offer a comprehensive range of hosting services to meet all your needs.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <service.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <ul className="mb-6 space-y-2">
              {service.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ x: 5 }}
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              {service.cta}
              <svg className="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
          <p className="mb-6">We specialize in creating custom hosting solutions tailored to your specific business needs.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Request a Quote
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}