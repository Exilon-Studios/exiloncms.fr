/**
 * Mega Menu Component
 * Advanced navigation menu with dropdown sections
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Shield,
  Globe,
  Database,
  BarChart3,
  Headphones,
  Code,
  Cloud,
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  X
} from 'lucide-react';

interface MenuItem {
  id: number;
  title: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: MenuSection[];
}

interface MenuSection {
  id: number;
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<any>;
  popular?: boolean;
}

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: "Hosting",
      href: "/hosting",
      icon: Server,
      children: [
        {
          id: 11,
          title: "Shared Hosting",
          href: "/hosting/shared",
          description: "Perfect for beginners and small websites",
          icon: Cloud
        },
        {
          id: 12,
          title: "VPS Hosting",
          href: "/hosting/vps",
          description: "Dedicated resources with full control",
          icon: Server,
          popular: true
        },
        {
          id: 13,
          title: "Cloud Hosting",
          href: "/hosting/cloud",
          description: "Scalable cloud solutions",
          icon: Cloud
        },
        {
          id: 14,
          title: "Dedicated Server",
          href: "/hosting/dedicated",
          description: "Maximum performance and control",
          icon: Server
        }
      ]
    },
    {
      id: 2,
      title: "Domains",
      href: "/domains",
      icon: Globe,
      children: [
        {
          id: 21,
          title: "Domain Registration",
          href: "/domains/register",
          description: "Register your perfect domain name",
          icon: Globe,
          popular: true
        },
        {
          id: 22,
          title: "Domain Transfer",
          href: "/domains/transfer",
          description: "Transfer your domain to us",
          icon: Globe
        },
        {
          id: 23,
          title: "Domain Marketplace",
          href: "/domains/marketplace",
          description: "Buy premium domains"
        }
      ]
    },
    {
      id: 3,
      title: "Security",
      href: "/security",
      icon: Shield,
      children: [
        {
          id: 31,
          title: "SSL Certificates",
          href: "/security/ssl",
          description: "Secure your website with SSL",
          icon: Shield
        },
        {
          id: 32,
          title: "DDoS Protection",
          href: "/security/ddos",
          description: "Advanced DDoS mitigation",
          icon: Shield,
          popular: true
        },
        {
          id: 33,
          title: "Web Application Firewall",
          href: "/security/waf",
          description: "Protect your web apps"
        }
      ]
    },
    {
      id: 4,
      title: "Services",
      href: "/services",
      children: [
        {
          id: 41,
          title: "Website Builder",
          href: "/services/website-builder",
          icon: Code
        },
        {
          id: 42,
          title: "Email Hosting",
          href: "/services/email",
          icon: Headphones
        },
        {
          id: 43,
          title: "Backup Services",
          href: "/services/backups",
          icon: Database
        },
        {
          id: 44,
          title: "Analytics",
          href: "/services/analytics",
          icon: BarChart3
        }
      ]
    },
    {
      id: 5,
      title: "Support",
      href: "/support",
      icon: Headphones
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="relative" ref={menuRef}>
      {/* Mobile menu button */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-6">
        {menuItems.map((item) => (
          <div key={item.id} className="group relative">
            <button
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              onMouseEnter={() => {
                setActiveSection(item.title);
                setIsOpen(true);
              }}
              onMouseLeave={() => {
                setActiveSection(null);
                setIsOpen(false);
              }}
            >
              <span>{item.title}</span>
              {item.children && (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Mega menu */}
            {item.children && (
              <AnimatePresence>
                {(isOpen || activeSection === item.title) && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-full left-0 w-[600px] bg-white shadow-2xl rounded-lg border z-50"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-8">
                        {item.children.map((section) => (
                          <div key={section.id}>
                            <div className="flex items-center mb-4">
                              {section.icon && (
                                <section.icon className="w-5 h-5 text-blue-600 mr-2" />
                              )}
                              <h3 className="font-semibold text-lg">{section.title}</h3>
                              {section.popular && (
                                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{section.description}</p>
                            <a
                              href={section.href}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              Learn more →
                            </a>
                          </div>
                        ))}
                      </div>

                      {/* Additional links */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex space-x-4">
                          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            View all hosting plans
                          </a>
                          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            Compare features
                          </a>
                          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            Help center
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}

        {/* Header actions */}
        <div className="flex items-center space-x-4 ml-auto">
          <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
            <User className="w-5 h-5" />
            <span>Account</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 relative">
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          <button className="p-2 text-gray-700 hover:text-blue-600">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <button onClick={() => setIsOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.id}>
                      <button className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          {item.icon && (
                            <item.icon className="w-5 h-5 text-gray-600" />
                          )}
                          <span>{item.title}</span>
                        </div>
                        {item.children && (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {item.children && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((section) => (
                            <a
                              key={section.id}
                              href={section.href}
                              className="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
                            >
                              {section.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="space-y-3">
                    <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Login
                    </button>
                    <button className="w-full p-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}