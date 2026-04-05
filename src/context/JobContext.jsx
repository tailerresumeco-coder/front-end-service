import { createContext, useContext, useState, useEffect } from 'react';

const JobContext = createContext(null);

const SAVED_JOBS_KEY = 'tr_savedJobs';

export function JobProvider({ children }) {
  // ── Filters (preserved across /jobs ↔ /jobs/:id navigation) ──────────
  const [filters, setFilters] = useState({ search: '' });
  const [activeTab, setActiveTab] = useState('all');

  // ── Saved jobs — hydrate from localStorage on first render ────────────
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_JOBS_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
  }, [savedJobs]);

  // ── Filter helpers ────────────────────────────────────────────────────
  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const resetFilters = () => setFilters({ search: '' });

  // ── Saved-job helpers ─────────────────────────────────────────────────
  const saveJob = (job) => {
    setSavedJobs((prev) =>
      prev.some((j) => j._id === job._id) ? prev : [...prev, job]
    );
  };

  const unsaveJob = (jobId) => {
    setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
  };

  const isJobSaved = (jobId) => savedJobs.some((j) => j._id === jobId);

  return (
    <JobContext.Provider
      value={{
        filters,
        updateFilters,
        resetFilters,
        activeTab,
        setActiveTab,
        savedJobs,
        saveJob,
        unsaveJob,
        isJobSaved,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobContext);
}
