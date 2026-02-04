/**
 * Hosting Plans Component
 * Pricing table with multiple tiers and featured plan highlighting
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Plan {
  id: number;
  name: string;
  price: number;
  period: string;
  featured: boolean;
  features: string[];
  cta: string;
}

export default function HostingPlans() {
  const plans: Plan[] = [
    {
      id: 1,
      name: "Starter",
      price: 4.99,
      period: "/month",
      featured: false,
      features: [
        "1 Website",
        "10 GB SSD Storage",
        "Free SSL Certificate",
        "24/7 Support",
        "1 Email Account",
        "Daily Backups"
      ],
      cta: "Get Started"
    },
    {
      id: 2,
      name: "Professional",
      price: 9.99,
      period: "/month",
      featured: true,
      features: [
        "5 Websites",
        "50 GB SSD Storage",
        "Free SSL Certificate",
        "Priority Support",
        "5 Email Accounts",
        "Daily Backups",
        "Free CDN",
        "Advanced Analytics"
      ],
      cta: "Choose Plan"
    },
    {
      id: 3,
      name: "Business",
      price: 19.99,
      period: "/month",
      featured: false,
      features: [
        "Unlimited Websites",
        "200 GB SSD Storage",
        "Free SSL Certificate",
        "24/7 Phone Support",
        "Unlimited Email",
        "Daily Backups",
        "Free CDN",
        "Advanced Analytics",
        "White Glove Service",
        "Custom Server"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="text-center mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-4"
      >
        Choose Your Plan
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
      >
        All plans include core features. Upgrade as your business grows.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative ${plan.featured ? 'scale-105 z-10' : ''}`}
          >
            <div className={`card-modern ${plan.featured ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: featureIndex * 0.05 }}
                      className="flex items-center"
                    >
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className={`w-full ${plan.featured ? 'bg-blue-600 hover:bg-blue-700' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                    variant={plan.featured ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <Button variant="link" className="text-blue-600 hover:text-blue-700">
          Need custom solution? <span className="font-semibold">Contact Sales</span>
        </Button>
      </motion.div>
    </div>
  );
}