'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBox({
  placeholder = 'جست‌وجو...',
  onSearch,
  className,
  autoFocus = false,
}: SearchBoxProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={className}
    >
      <div className="fancy-search-shell">
        <Search className="fancy-search-icon right-4" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label={placeholder}
          className="fancy-search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="fancy-search-action left-4"
            aria-label="پاک کردن جست‌وجو"
            data-no-specular
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.form>
  );
}
