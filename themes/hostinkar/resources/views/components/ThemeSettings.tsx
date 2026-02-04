/**
 * Theme Settings Component
 * Configuration panel for choosing home page variants and enabling/disabling sections
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  Eye,
  Home,
  Palette,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface ThemeSettings {
  homeVariant: 'one' | 'two' | 'three' | 'four';
  showFeatures: boolean;
  showTestimonials: boolean;
  showServices: boolean;
  showDomainSearch: boolean;
  darkTheme: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface VariantOption {
  value: 'one' | 'two' | 'three' | 'four';
  name: string;
  description: string;
}

const variantOptions: VariantOption[] = [
  {
    value: 'one',
    name: 'Classic Hero',
    description: 'Traditional hero section with feature highlights'
  },
  {
    value: 'two',
    name: 'Modern Split',
    description: 'Contemporary split layout with focused CTAs'
  },
  {
    value: 'three',
    name: 'Minimal Design',
    description: 'Clean, minimal design focused on performance'
  },
  {
    value: 'four',
    name: 'Enterprise Focus',
    description: 'Professional layout for business clients'
  }
];

export default function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<ThemeSettings>({
    homeVariant: 'one',
    showFeatures: true,
    showTestimonials: true,
    showServices: true,
    showDomainSearch: true,
    darkTheme: true,
    primaryColor: '#0066FF',
    secondaryColor: '#00D4FF',
    accentColor: '#00FF94'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('hostinkar-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000));

    localStorage.setItem('hostinkar-settings', JSON.stringify(settings));

    // Apply dark theme
    document.documentElement.classList.toggle('dark', settings.darkTheme);

    setIsLoading(false);
    alert('Settings saved successfully!');
  };

  const resetToDefaults = () => {
    setSettings({
      homeVariant: 'one',
      showFeatures: true,
      showTestimonials: true,
      showServices: true,
      showDomainSearch: true,
      darkTheme: true,
      primaryColor: '#0066FF',
      secondaryColor: '#00D4FF',
      accentColor: '#00FF94'
    });
  };

  const toggleSection = (section: keyof Omit<ThemeSettings, 'homeVariant' | 'darkTheme' | 'primaryColor' | 'secondaryColor' | 'accentColor'>) => {
    setSettings(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* Settings Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Settings Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Settings className="mr-2" />
                    Theme Settings
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Home Variant Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Home className="mr-2" />
                    Home Page Variant
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {variantOptions.map((variant) => (
                      <button
                        key={variant.value}
                        onClick={() => setSettings(prev => ({ ...prev, homeVariant: variant.value }))}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          settings.homeVariant === variant.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-sm font-medium mb-1">{variant.name}</div>
                          <div className="text-xs text-gray-600">{variant.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section Toggles */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Eye className="mr-2" />
                    Sections
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Features Section</span>
                      <button
                        onClick={() => toggleSection('showFeatures')}
                        className={`p-2 rounded-lg transition-colors ${
                          settings.showFeatures ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {settings.showFeatures ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Testimonials</span>
                      <button
                        onClick={() => toggleSection('showTestimonials')}
                        className={`p-2 rounded-lg transition-colors ${
                          settings.showTestimonials ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {settings.showTestimonials ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Services Section</span>
                      <button
                        onClick={() => toggleSection('showServices')}
                        className={`p-2 rounded-lg transition-colors ${
                          settings.showServices ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {settings.showServices ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Domain Search</span>
                      <button
                        onClick={() => toggleSection('showDomainSearch')}
                        className={`p-2 rounded-lg transition-colors ${
                          settings.showDomainSearch ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {settings.showDomainSearch ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Theme Colors */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Palette className="mr-2" />
                    Colors
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Primary Color</span>
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Secondary Color</span>
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Accent Color</span>
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Dark Mode Toggle */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Dark Mode</h3>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, darkTheme: !prev.darkTheme }))}
                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                      settings.darkTheme ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200'
                    }`}
                  >
                    {settings.darkTheme ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5 inline mr-2" />
                    {isLoading ? 'Saving...' : 'Save Settings'}
                  </button>
                  <button
                    onClick={resetToDefaults}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}