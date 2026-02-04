import { useEffect, useState } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { router } from '@inertiajs/react';

interface DocSearchProps {
  onClose: () => void;
  locale: string;
}

interface SearchResult {
  title: string;
  category: string;
  slug: string;
  category_slug: string;
  snippet: string;
  parent?: string;
}

export default function DocSearch({ onClose, locale }: DocSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results.length > 0) {
        router.visit(results[selectedIndex].href);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onClose]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`/docs/search/${locale}?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, locale]);

  const highlightMatch = (text: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-background border shadow-lg rounded-lg overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <IconSearch className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher dans la documentation..."
            className="flex-1 bg-transparent border-0 outline-none text-lg"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-muted-foreground">
              Recherche en cours...
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Aucun résultat pour "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 text-sm text-muted-foreground">
                {results.length} résultat{results.length > 1 ? 's' : ''}
              </p>

              <div className="flex flex-col gap-1 mt-2">
                {results.map((result, index) => (
                  <a
                    key={index}
                    href={`/docs/${locale}/${result.category_slug}/${result.slug}`}
                    onClick={onClose}
                    className={`
                      p-3 rounded-md transition-colors
                      ${index === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-medium">{highlightMatch(result.title)}</p>

                        <p className="text-sm text-muted-foreground mt-0.5">
                          {result.category}
                          {result.parent && ` > ${result.parent}`}
                        </p>

                        <p
                          className="text-sm text-muted-foreground mt-2 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: highlightMatch(result.snippet) }}
                        />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard shortcuts */}
          {results.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd> naviguer
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd> sélectionner
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">esc</kbd> fermer
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
