import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ExternalLink, ArrowLeft, Loader2, Globe } from 'lucide-react';
import { useOptions } from '../utils/optionsContext';
import clsx from 'clsx';
import theme from '../styles/theming.module.css';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { options } = useOptions();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const barStyle = {
    backgroundColor: options.barColor || '#09121e',
  };

  // Get the initial query from navigation state
  const initialQuery = location.state?.url || '';

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    setInputValue(query);

    try {
      // Check if it's a URL
      const isUrl = /^https?:\/\//i.test(query.trim()) || 
                    /^[\w-]+\.[\w.-]+/i.test(query.trim());
      
      if (isUrl) {
        // Open URL directly in new tab
        const url = query.startsWith('http') ? query : `https://${query}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setLoading(false);
        return;
      }

      // Perform search
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('No se pudieron obtener los resultados. Intenta de nuevo.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
      setLoading(false);
    }
  }, [initialQuery, performSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      performSearch(inputValue.trim());
    }
  };

  const handleResultClick = (url) => {
    // Open in new tab since we can't proxy without backend
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: options.bgColor || '#111827' }}>
      {/* Search bar header */}
      <header 
        className="sticky top-0 z-50 px-4 py-3 shadow-lg"
        style={barStyle}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1">
            <div 
              className={clsx(
                'flex items-center gap-3 px-4 h-12 rounded-full',
                theme[`searchBarColor`],
                theme[`theme-${options.theme || 'default'}`],
              )}
            >
              <Search size={18} className="shrink-0 opacity-60" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar o escribir URL..."
                className="flex-1 bg-transparent outline-none text-base"
                autoComplete="off"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Results area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={40} className="animate-spin text-blue-500" />
            <p className="text-gray-400">Buscando resultados...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <Globe size={48} className="mx-auto mb-4 text-gray-500" />
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => performSearch(searchQuery)}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && results.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 text-lg">
              No se encontraron resultados para "{searchQuery}"
            </p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-400 mb-6">
              Mostrando {results.length} resultados para "{searchQuery}"
            </p>
            
            {results.map((result, index) => (
              <article
                key={index}
                className="group cursor-pointer p-4 rounded-xl hover:bg-white/5 transition-all duration-200"
                onClick={() => handleResultClick(result.url)}
              >
                <div className="flex items-start gap-4">
                  {/* Favicon */}
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                    {result.favicon ? (
                      <img 
                        src={result.favicon} 
                        alt=""
                        className="w-6 h-6"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <Globe 
                      size={20} 
                      className="text-gray-400"
                      style={{ display: result.favicon ? 'none' : 'block' }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Domain */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-400 truncate">
                        {result.domain}
                      </span>
                      <ExternalLink size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-medium text-blue-400 group-hover:text-blue-300 group-hover:underline transition-colors line-clamp-2">
                      {result.title}
                    </h3>
                    
                    {/* Snippet */}
                    {result.snippet && (
                      <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                        {result.snippet}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !searchQuery && (
          <div className="text-center py-20">
            <Search size={64} className="mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-semibold mb-2">Busca lo que quieras</h2>
            <p className="text-gray-400">
              Escribe en la barra de busqueda para encontrar paginas web
            </p>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>Los resultados se abren en una nueva pestana</p>
      </footer>
    </div>
  );
}
