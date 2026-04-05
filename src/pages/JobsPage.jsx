import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Loader2, Check, X, ChevronUp, Bookmark } from 'lucide-react';

import { getJobs } from '../services/jobService';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/JobCard';
import JobSkeletonCard from '../components/JobSkeletonCard';
import JobFilters from '../components/JobFilters';

// ── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'all',        label: 'All Jobs'    },
  { id: 'fulltime',   label: 'Full-Time'   },
  { id: 'contract',   label: 'Contract'    },
  { id: 'internship', label: 'Internship'  },
  { id: 'saved',      label: 'Saved'       },
];

const TAB_JOB_TYPE = {
  all:        '',
  fulltime:   'FULLTIME',
  contract:   'CONTRACTOR',
  internship: 'INTERN',
  saved:      '',
};

const PAGE_SIZE = 20;

// ── Component ────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const { filters, activeTab, setActiveTab, savedJobs } = useJobs();

  // Pagination + list state
  const [jobs, setJobs]         = useState([]);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [hasMore, setHasMore]   = useState(true);
  const [isLoading, setIsLoading] = useState(true);  // true prevents empty-state flash on mount
  const [isInitial, setIsInitial] = useState(true);  // true = first fetch of current filter set
  const [error, setError]       = useState(null);

  // Tracks which page number failed so Retry can re-attempt the correct page
  const failedPageRef = useRef(null);

  // Back-to-top visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Refs
  const sentinelRef   = useRef(null);
  const isFetchingRef = useRef(false);
  // Generation counter prevents stale results from applying after a filter reset
  const genRef = useRef(0);

  // ── Fetch ──────────────────────────────────────────────────────────────

  const fetchJobs = useCallback(
    async (pageNum) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const currentGen = genRef.current;

      try {
        const response = await getJobs(pageNum, PAGE_SIZE, {
          search:  filters.search,
          jobType: TAB_JOB_TYPE[activeTab],
        });

        // Discard if a newer filter set has already started
        if (genRef.current !== currentGen) return;

        const newJobs  = response.data?.data  || [];
        const newTotal = response.data?.total || 0;

        setJobs((prev) => pageNum === 1 ? newJobs : [...prev, ...newJobs]);
        setTotal(newTotal);
        setHasMore(newJobs.length === PAGE_SIZE);
        setPage(pageNum);
      } catch (err) {
        if (genRef.current !== currentGen) return;
        failedPageRef.current = pageNum;
        setError('Failed to load jobs. Please try again.');
      } finally {
        // Gate ALL side-effects by generation — prevents a stale response's
        // finally block from clearing isFetchingRef while a newer fetch is live.
        if (genRef.current === currentGen) {
          setIsLoading(false);
          setIsInitial(false);
          isFetchingRef.current = false;
        }
      }
    },
    [filters.search, activeTab],
  );

  // ── Reset + refetch whenever fetchJobs identity changes (filter/tab changed) ──

  useEffect(() => {
    if (activeTab === 'saved') return; // saved tab is local-only

    genRef.current += 1;       // invalidate any in-flight request
    isFetchingRef.current = false;

    setJobs([]);
    setPage(1);
    setTotal(0);
    setHasMore(true);
    setIsInitial(true);

    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchJobs]);

  // Reset initial state when switching to saved tab
  useEffect(() => {
    if (activeTab === 'saved') {
      setIsInitial(false);
      setIsLoading(false);
    }
  }, [activeTab]);

  // ── Infinite scroll ────────────────────────────────────────────────────

  useEffect(() => {
    if (activeTab === 'saved' || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetchingRef.current) {
          fetchJobs(page + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading, hasMore, page, fetchJobs, activeTab]);

  // ── Back-to-top ────────────────────────────────────────────────────────

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────

  const displayJobs  = activeTab === 'saved' ? savedJobs : jobs;
  const displayTotal = activeTab === 'saved' ? savedJobs.length : total;
  const showSkeleton = isInitial && isLoading && activeTab !== 'saved';

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark">

      {/* ── Header ── */}
      <header className="border-b border-border-primary bg-surface-dark/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-brand-primary font-bold text-lg tracking-tight">
            TailerResume
          </Link>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Briefcase size={15} />
            <span>Job Board</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Page title ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-1">Browse Jobs</h1>
          <p className="text-text-muted text-sm">
            Fresh listings updated every 6 hours · India
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="mb-6">
          <JobFilters />
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 border-b border-border-primary overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-text-muted hover:text-text-secondary'}
              `}
            >
              {tab.label}
              {tab.id === 'saved' && savedJobs.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-dot bg-brand-primary/20 text-brand-primary">
                  {savedJobs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Result count — only rendered when there are results to avoid phantom margin ── */}
        {!isInitial && !error && displayTotal > 0 && (
          <p className="text-text-muted text-sm mb-5">
            {displayTotal.toLocaleString()} job{displayTotal !== 1 ? 's' : ''} found
          </p>
        )}

        {/* ── Skeleton grid ── */}
        {showSkeleton && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobSkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Jobs grid ── */}
        {!showSkeleton && displayJobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!showSkeleton && !isLoading && displayJobs.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {activeTab === 'saved' ? (
              <>
                <Bookmark size={48} className="text-text-muted mb-4 opacity-40" />
                <p className="text-text-primary font-semibold text-lg mb-1">No saved jobs yet</p>
                <p className="text-text-muted text-sm">
                  Bookmark jobs you like and they'll appear here.
                </p>
              </>
            ) : (
              <>
                <Briefcase size={48} className="text-text-muted mb-4 opacity-40" />
                <p className="text-text-primary font-semibold text-lg mb-1">No jobs found</p>
                <p className="text-text-muted text-sm">Try adjusting your search or filters.</p>
              </>
            )}
          </div>
        )}

        {/* ── Infinite scroll sentinel ── */}
        {activeTab !== 'saved' && <div ref={sentinelRef} className="h-4" />}

        {/* ── Loading more indicator ── */}
        {isLoading && !isInitial && (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="text-brand-primary animate-spin" />
            <span className="ml-3 text-text-muted text-sm">Loading more jobs…</span>
          </div>
        )}

        {/* ── All loaded indicator ── */}
        {!hasMore && jobs.length > 0 && !isLoading && activeTab !== 'saved' && (
          <div className="flex items-center justify-center py-8 text-text-muted text-sm">
            <Check size={16} className="mr-2 text-green-400" />
            All jobs loaded
          </div>
        )}

        {/* ── Error state ── */}
        {error && (
          <div className="flex items-center justify-center py-12 text-red-400">
            <X size={18} className="mr-2" />
            {error}
            <button
              onClick={() => {
                const pg = failedPageRef.current ?? 1;
                failedPageRef.current = null;
                // Page-1 failure: reset the list so the retry is a clean initial load
                if (pg === 1) {
                  setJobs([]);
                  setIsInitial(true);
                }
                fetchJobs(pg);
              }}
              className="ml-4 text-brand-primary underline text-sm hover:text-brand-primary-hover"
            >
              Retry
            </button>
          </div>
        )}
      </main>

      {/* ── Back-to-top FAB ── */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-30 p-3 rounded-full
                     bg-brand-primary text-white shadow-lg
                     hover:bg-brand-primary-hover transition-all duration-200"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}
