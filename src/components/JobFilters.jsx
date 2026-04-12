import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useJobs } from '../context/JobContext';

export default function JobFilters() {
  const { filters, updateFilters, resetFilters } = useJobs();

  // Local search state — debounced before pushing to context
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debounceRef = useRef(null);

  // Clean up any pending debounce timer on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // Sync if context is reset externally (e.g. "Clear all")
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilters({ search: value });
    }, 400);
  };

  const clearSearch = () => {
    setLocalSearch('');
    clearTimeout(debounceRef.current);
    updateFilters({ search: '' });
  };

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          onChange={handleSearchChange}
          placeholder="Search jobs by title, company, or location…"
          className="w-full pl-9 pr-9 py-2.5 bg-surface-dark border border-border-primary
                     rounded-button text-text-primary placeholder-text-muted text-sm
                     focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
                     transition-all"
        />
        {localSearch && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Active search chip */}
      {filters.search && (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-dot
                       bg-brand-primary/20 text-brand-primary border border-brand-primary/30"
          >
            "{filters.search}"
            <button onClick={clearSearch} className="hover:text-white transition-colors">
              <X size={11} />
            </button>
          </span>
          <button
            onClick={() => { resetFilters(); setLocalSearch(''); }}
            className="text-xs text-text-muted hover:text-text-primary underline transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
