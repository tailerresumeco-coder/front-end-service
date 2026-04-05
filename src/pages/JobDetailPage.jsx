import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Briefcase, Clock, DollarSign,
  ExternalLink, Bookmark, Loader2, X, Building2,
} from 'lucide-react';

import { getJobById } from '../services/jobService';
import { useJobs } from '../context/JobContext';
import { timeAgo, formatSalary, JOB_TYPE_BADGE, JOB_TYPE_LABEL } from '../utils/jobUtils';

// ── Component ────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { saveJob, unsaveJob, isJobSaved } = useJobs();


  const [job, setJob]           = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getJobById(id);
        if (!cancelled) setJob(response.data?.data || null);
      } catch (err) {
        if (!cancelled) {
          setError('Job not found or no longer available.');
          // Auto-remove stale saved job when the backend returns 404 (TTL expired)
          if (err?.response?.status === 404) {
            unsaveJob(id);
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchJob();
    return () => { cancelled = true; };
  }, [id]);

  // ── Loading ──

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark
                      flex items-center justify-center">
        <Loader2 size={32} className="text-brand-primary animate-spin" />
      </div>
    );
  }

  // ── Error ──

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark
                      flex flex-col items-center justify-center text-center px-6">
        <X size={48} className="text-red-400 mb-4 opacity-60" />
        <p className="text-text-primary font-semibold text-lg mb-2">{error || 'Job not found'}</p>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 text-brand-primary underline text-sm hover:text-brand-primary-hover"
        >
          ← Back to Jobs
        </button>
      </div>
    );
  }

  // ── Derived ──

  const saved      = isJobSaved(job._id);
  const typeKey    = (job.job_type || '').toUpperCase();
  const salary     = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  const postedAgo  = timeAgo(job.posted_at || job.fetched_at);

  const handleSaveToggle = () => saved ? unsaveJob(job._id) : saveJob(job);

  // ── Render ──

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark">

      {/* ── Sticky header ── */}
      <header className="border-b border-border-primary bg-surface-dark/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>
          <Link to="/" className="text-brand-primary font-bold text-sm tracking-tight">
            TailerResume
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* ── Job card ── */}
        <div className="bg-surface-dark-light border border-border-primary rounded-card p-8">

          {/* ── Top row: save ── */}
          <div className="flex items-start justify-end mb-6">
            <button
              onClick={handleSaveToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-button text-sm font-semibold
                         border transition-colors
                         border-border-primary text-text-muted hover:border-brand-primary hover:text-brand-primary"
            >
              <Bookmark
                size={15}
                className={saved ? 'fill-brand-primary text-brand-primary' : ''}
              />
              {saved ? 'Saved' : 'Save Job'}
            </button>
          </div>

          {/* ── Title + company ── */}
          <h1 className="text-2xl font-bold text-text-primary mb-2 leading-snug">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 text-text-secondary mb-6">
            <Building2 size={16} className="shrink-0" />
            <span className="font-medium">{job.company}</span>
          </div>

          {/* ── Meta badges ── */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Location */}
            <span className="flex items-center gap-1.5 text-sm text-text-secondary
                             px-3 py-1.5 rounded-button bg-surface-dark border border-border-primary">
              <MapPin size={14} />
              {job.location || 'India'}
            </span>

            {/* Job type */}
            {typeKey && JOB_TYPE_BADGE[typeKey] && (
              <span className={`flex items-center gap-1.5 text-sm font-semibold
                               px-3 py-1.5 rounded-button ${JOB_TYPE_BADGE[typeKey]}`}>
                <Briefcase size={14} />
                {JOB_TYPE_LABEL[typeKey] || job.job_type}
              </span>
            )}

            {/* Salary */}
            {salary && (
              <span className="flex items-center gap-1.5 text-sm text-text-secondary
                               px-3 py-1.5 rounded-button bg-surface-dark border border-border-primary">
                <DollarSign size={14} />
                {salary}
              </span>
            )}

            {/* Posted */}
            {postedAgo && (
              <span className="flex items-center gap-1.5 text-sm text-text-muted
                               px-3 py-1.5 rounded-button bg-surface-dark border border-border-primary">
                <Clock size={14} />
                Posted {postedAgo}
              </span>
            )}
          </div>

          {/* ── Apply button ── */}
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-button font-semibold
                       bg-brand-primary text-white hover:bg-brand-primary-hover
                       transition-colors duration-150 mb-8"
          >
            Apply Now
            <ExternalLink size={16} />
          </a>

          {/* ── Divider ── */}
          <div className="border-t border-border-primary mb-8" />

          {/* ── Description ── */}
          {job.description ? (
            <div>
              <h2 className="text-text-primary font-semibold text-base mb-4">Job Description</h2>
              <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>
          ) : (
            <p className="text-text-muted text-sm">No description available.</p>
          )}
        </div>

        {/* ── Bottom apply CTA ── */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Jobs
          </button>
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button text-sm font-semibold
                       bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
          >
            Apply Now <ExternalLink size={14} />
          </a>
        </div>
      </main>
    </div>
  );
}
