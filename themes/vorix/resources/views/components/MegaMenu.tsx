'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Service, About, Blog, Contact, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface MegaMenuItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: MegaMenuItem[];
  preview?: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
}

const menuItems: MegaMenuItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: <Home className="h-4 w-4" />,
    preview: {
      title: 'Homepage Preview',
      description: 'Beautiful homepage with hero section and call-to-action',
      image: '/images/home-preview.jpg',
      link: '/'
    }
  },
  {
    title: 'Services',
    href: '/services',
    icon: <Service className="h-4 w-4" />,
    preview: {
      title: 'Our Services',
      description: 'Professional services tailored to your needs',
      image: '/images/services-preview.jpg',
      link: '/services'
    },
    children: [
      {
        title: 'Web Design',
        href: '/services/web-design',
        preview: {
          title: 'Web Design',
          description: 'Modern and responsive web design solutions',
          image: '/images/web-design.jpg',
          link: '/services/web-design'
        }
      },
      {
        title: 'Development',
        href: '/services/development',
        preview: {
          title: 'Development',
          description: 'Custom web application development',
          image: '/images/development.jpg',
          link: '/services/development'
        }
      },
      {
        title: 'SEO',
        href: '/services/seo',
        preview: {
          title: 'SEO Services',
          description: 'Search engine optimization to boost your visibility',
          image: '/images/seo.jpg',
          link: '/services/seo'
        }
      }
    ]
  },
  {
    title: 'About',
    href: '/about',
    icon: <About className="h-4 w-4" />,
    preview: {
      title: 'About Us',
      description: 'Learn more about our company and team',
      image: '/images/about-preview.jpg',
      link: '/about'
    }
  },
  {
    title: 'Blog',
    href: '/blog',
    icon: <Blog className="h-4 w-4" />,
    preview: {
      title: 'Blog',
      description: 'Latest news and industry insights',
      image: '/images/blog-preview.jpg',
      link: '/blog'
    }
  },
  {
    title: 'Contact',
    href: '/contact',
    icon: <Contact className="h-4 w-4" />,
    preview: {
      title: 'Contact Us',
      description: 'Get in touch with our team',
      image: '/images/contact-preview.jpg',
      link: '/contact'
    }
  }
];

export default function MegaMenu() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleMouseEnter = (title: string) => {
    setOpenItem(title);
  };

  const handleMouseLeave = () => {
    setOpenItem(null);
  };

  const isItemOpen = (title: string) => openItem === title;

  return (
    <nav className="relative">
      <ul className="flex space-x-6">
        {menuItems.map((item) => (
          <li
            key={item.title}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.title)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={item.href}
              className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
            >
              {item.icon}
              <span>{item.title}</span>
              {item.children && <ChevronDown className="h-3 w-3 ml-1" />}
            </Link>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
              {isItemOpen(item.title) && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-[600px] bg-background border rounded-lg shadow-lg mt-2 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Main Preview */}
                    {item.preview && (
                      <div className="mb-6 cursor-pointer group" onClick={() => window.open(item.preview?.link, '_blank')}>
                        <div className="relative overflow-hidden rounded-lg">
                          <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20" />
                        </div>
                        <h3 className="mt-2 font-semibold">{item.preview.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.preview.description}</p>
                      </div>
                    )}

                    {/* Sub-items */}
                    {item.children && (
                      <div className="grid grid-cols-2 gap-4">
                        {item.children.map((child) => (
                          <div key={child.title} className="p-4 rounded-lg hover:bg-muted/50 transition-colors">
                            <Link
                              href={child.href}
                              className="block"
                            >
                              <h4 className="font-medium mb-1">{child.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {child.preview?.description || 'Click to learn more about our services'}
                              </p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Call to Action */}
                    <div className="mt-6 pt-4 border-t">
                      <Link
                        href="/contact"
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        Start Your Project
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </nav>
  );
}