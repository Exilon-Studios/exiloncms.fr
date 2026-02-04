'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
  link?: string;
  gradient?: string;
}

export default function ServiceCard({
  title,
  description,
  features,
  icon,
  link,
  gradient = 'from-blue-500 to-purple-600'
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden"
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-background">
        {/* Gradient border effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/10 to-transparent" />
        </div>

        <CardHeader className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
              {icon}
            </div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
          </div>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-2"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>

          {link && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="ghost"
                className="group w-full justify-between px-0 py-3 h-auto"
                as="a"
                href={link}
              >
                <span>Learn More</span>
                <motion.div
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="ml-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Parallax effect */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, ${gradient}, transparent)`,
        }}
      />
    </motion.div>
  );
}