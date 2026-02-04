/**
 * Features Section Component
 * Grid of hosting features with icons and descriptions
 */

import { motion } from 'framer-motion';
import {
  Server,
  Shield,
  Zap,
  Globe,
  Database,
  BarChart3,
  Headphones,
  Clock,
  CheckCircle,
  Rocket
} from 'lucide-react';

interface Feature {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      id: 1,
      icon: Server,
      title: "Lightning Fast Servers",
      description: "SSD storage with NVMe technology for blazing fast load times and performance."
    },
    {
      id: 2,
      icon: Shield,
      title: "Advanced Security",
      description: "SSL certificates, firewalls, and DDoS protection to keep your site secure."
    },
    {
      id: 3,
      icon: Zap,
      title: "99.9% Uptime",
      description: "Guaranteed uptime with redundant servers and automatic failover systems."
    },
    {
      id: 4,
      icon: Globe,
      title: "Global CDN",
      description: "Content delivery network for fast loading speeds worldwide."
    },
    {
      id: 5,
      icon: Database,
      title: "Database Optimization",
      description: "Optimized databases with caching for improved performance."
    },
    {
      id: 6,
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time analytics and insights to monitor your website performance."
    },
    {
      id: 7,
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock expert support via chat, email, and phone."
    },
    {
      id: 8,
      icon: Clock,
      title: "Auto Backups",
      description: "Automatic daily backups with easy restoration options."
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
          Why Choose Us?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          We provide everything you need to succeed online with enterprise-grade hosting solutions.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center p-6 hover:shadow-lg transition-shadow"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4"
            >
              <feature.icon className="w-8 h-8" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
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
        <div className="flex items-center justify-center gap-4 mb-8">
          <CheckCircle className="text-green-500" size={24} />
          <CheckCircle className="text-green-500" size={24} />
          <CheckCircle className="text-green-500" size={24} />
          <span className="text-lg font-semibold">Trusted by 50,000+ websites worldwide</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Rocket className="inline-block mr-2" size={20} />
          Get Started Today
        </motion.button>
      </motion.div>
    </section>
  );
}