import { useState } from 'react';
import { MapPin, Clock, DollarSign, Bookmark, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { timeAgo, formatSalary, JOB_TYPE_BADGE, JOB_TYPE_LABEL } from '../utils/jobUtils';
import TailorModal from './TailorModal';

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const { saveJob, unsaveJob, isJobSaved } = useJobs();
  const saved = isJobSaved(job._id);
  const [showTailorModal, setShowTailorModal] = useState(false);

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    saved ? unsaveJob(job._id) : saveJob(job);
  };

  const salary    = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  const postedAgo = timeAgo(job.posted_at || job.fetched_at);
  const typeKey   = (job.job_type || '').toUpperCase();

  return (
    <div
      className="bg-surface-dark-light border border-border-primary rounded-card p-5
                 hover:border-brand-primary/60 hover:shadow-lg hover:shadow-brand-primary/10
                 transition-all duration-200 flex flex-col"
    >
      {/* Title + save button on same row */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="text-text-primary font-semibold text-base leading-snug line-clamp-2 flex-1">
          {job.title}
        </h3>
        <button
          onClick={handleSaveToggle}
          aria-label={saved ? 'Unsave job' : 'Save job'}
          className="shrink-0 mt-0.5 text-text-muted hover:text-brand-primary transition-colors"
        >
          <Bookmark
            size={18}
            className={saved ? 'fill-brand-primary text-brand-primary' : ''}
          />
        </button>
      </div>

      {/* Company */}
      <p className="text-text-secondary text-sm mb-3 truncate">{job.company}</p>

      {/* Job type + salary badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {typeKey && JOB_TYPE_BADGE[typeKey] && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-button ${JOB_TYPE_BADGE[typeKey]}`}>
            {JOB_TYPE_LABEL[typeKey] || job.job_type}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5
                           rounded-button bg-surface-dark text-text-secondary border border-border-primary">
            <DollarSign size={11} />
            {salary}
          </span>
        )}
      </div>

      {/* Description snippet — shows experience/requirements preview */}
      {job.description && (
        <p className="text-text-muted text-xs leading-relaxed line-clamp-3 mb-3">
          {job.description}
        </p>
      )}

      {/* Location + posted */}
      <div className="flex items-center justify-between text-xs text-text-muted mt-auto mb-4">
        <span className="flex items-center gap-1 truncate">
          <MapPin size={12} />
          {job.location || 'India'}
        </span>
        {postedAgo && (
          <span className="flex items-center gap-1 shrink-0 ml-2">
            <Clock size={12} />
            {postedAgo}
          </span>
        )}
      </div>

      {/* CTA row */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/jobs/${job._id}`)}
          className="flex-1 py-2 rounded-button text-sm font-semibold
                     border border-brand-primary text-brand-primary
                     hover:bg-brand-primary hover:text-white
                     transition-all duration-150"
        >
          View Details
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowTailorModal(true); }}
          aria-label="Tailor resume for this job"
          title="Tailor Resume"
          className="py-2 px-3 rounded-button text-sm font-semibold
                     border border-border-primary text-text-muted
                     hover:border-brand-primary hover:text-brand-primary
                     transition-all duration-150"
        >
          <Wand2 size={15} />
        </button>
      </div>

      {showTailorModal && (
        <TailorModal job={job} onClose={() => setShowTailorModal(false)} />
      )}
    </div>
  );
}
