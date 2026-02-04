/**
 * Domain Search Component
 * Interactive domain search with availability checking
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, X, DollarSign } from 'lucide-react';

export default function DomainSearch() {
  const [domain, setDomain] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedTLD, setSelectedTLD] = useState('.com');

  const tlds = [
    { name: '.com', price: 12.99 },
    { name: '.net', price: 12.99 },
    { name: '.org', price: 12.99 },
    { name: '.io', price: 39.99 },
    { name: '.ai', price: 49.99 },
    { name: '.app', price: 19.99 },
    { name: '.store', price: 29.99 },
    { name: '.shop', price: 29.99 }
  ];

  const checkDomain = () => {
    if (!domain) return;

    setSearching(true);

    // Simulate API call
    setTimeout(() => {
      const available = Math.random() > 0.5;
      setResults({
        domain: `${domain}${selectedTLD}`,
        available,
        price: tlds.find(tld => tld.name === selectedTLD)?.price || 12.99
      });
      setSearching(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkDomain();
    }
  };

  const handleTLDSelect = (tld: string) => {
    setSelectedTLD(tld);
    if (results) {
      checkDomain();
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Find Your Perfect Domain</h2>
          <p className="text-xl text-gray-600">Check availability and secure your online identity.</p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your domain name"
                  className="domain-search-input w-full text-lg pr-12"
                />
                <button
                  onClick={checkDomain}
                  disabled={searching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {searching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* TLD Selector */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Choose your domain extension:</p>
            <div className="flex flex-wrap gap-2">
              {tlds.map((tld) => (
                <button
                  key={tld.name}
                  onClick={() => handleTLDSelect(tld.name)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedTLD === tld.name
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {tld.name} <DollarSign size={14} className="inline ml-1" />{tld.price}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-lg border ${
                results.available ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {results.available ? (
                    <Check className="w-6 h-6 text-green-600 mr-2" />
                  ) : (
                    <X className="w-6 h-6 text-red-600 mr-2" />
                  )}
                  <span className="text-lg font-semibold">
                    {results.available ? 'Domain Available!' : 'Domain Taken'}
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  ${results.price}
                </span>
              </div>
              <div className="text-2xl font-bold mb-4">
                {results.domain}
              </div>
              {results.available ? (
                <div className="flex gap-4">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Register Now
                  </button>
                  <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Add to Cart
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Try these available alternatives:</p>
                  <div className="flex flex-wrap gap-2">
                    {['get', 'my', 'the', 'best'].map((prefix) => (
                      <button
                        key={prefix}
                        onClick={() => setDomain(`${prefix}${domain}`)}
                        className="border border-gray-300 px-4 py-2 rounded hover:border-blue-400 transition-colors"
                      >
                        {prefix}{results.domain}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold mb-1">Instant Setup</h3>
            <p className="text-sm text-gray-600">Your domain is ready immediately after registration</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Free Privacy</h3>
            <p className="text-sm text-gray-600">Domain privacy protection included free</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📧</div>
            <h3 className="font-semibold mb-1">Email Forwarding</h3>
            <p className="text-sm text-gray-600">Professional email@yourdomain.com</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}