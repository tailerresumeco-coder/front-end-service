import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Wand2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { tailorFromJob } from '../services/resumeService';
import { useResume } from '../context/ResumeContext';
import { transformBackendResponse, isResumeValid } from '../utils/DataTransformer';

const LOADING_MESSAGES = [
  'Reading your resume…',
  'Analyzing job requirements…',
  'Matching your experience…',
  'Optimizing for ATS keywords…',
  'Tailoring your bullet points…',
  'Finalizing your resume…',
];

function parseErrorDetail(detail = '') {
  const d = detail.toLowerCase();
  if (d.includes('no active resume'))   return 'No active resume found. Please upload and activate a resume from your Profile first.';
  if (d.includes('no description'))     return 'This job has no description to tailor against.';
  if (d.includes('too long'))           return 'Your resume or job description is too long. Try a shorter resume (max 2 pages).';
  if (d.includes('too many requests'))  return 'Too many requests. Please wait a moment and try again.';
  return detail || 'Something went wrong. Please try again.';
}

export default function TailorModal({ job, onClose }) {
  const navigate = useNavigate();
  const { setResume, setGeneratedResume } = useResume();

  const [status, setStatus]     = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const [attempt, setAttempt]   = useState(0);         // incrementing triggers a retry
  const tailoredDataRef         = useRef(null);

  // Rotate loading messages every 4 s while loading
  useEffect(() => {
    if (status !== 'loading') return;
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length), 4000);
    return () => clearInterval(id);
  }, [status]);

  // Run tailoring (re-runs on retry via `attempt`)
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setMsgIndex(0);

    const run = async () => {
      try {
        const res = await tailorFromJob(job._id);
        if (cancelled) return;

        const payload = res.data;

        // Backend returns {status:"error"} as HTTP 200 for LLM-level errors
        if (payload.status === 'error') {
          setErrorMsg(payload.message || 'AI processing failed. Please try again.');
          setStatus('error');
          return;
        }

        const transformed = transformBackendResponse(payload.data);
        if (!isResumeValid(transformed)) {
          setErrorMsg('Generated resume appears incomplete. Please try again.');
          setStatus('error');
          return;
        }

        tailoredDataRef.current = transformed;
        setStatus('success');
      } catch (err) {
        if (cancelled) return;
        const detail = err?.response?.data?.detail || err.message || '';
        setErrorMsg(parseErrorDetail(detail));
        setStatus('error');
      }
    };

    run();
    return () => { cancelled = true; };
  }, [attempt, job._id]);

  const handleRetry = () => setAttempt((a) => a + 1);

  const handleViewResume = () => {
    setResume(tailoredDataRef.current);
    setGeneratedResume(tailoredDataRef.current);
    onClose();
    navigate('/resume-builder');
  };

  // Backdrop click closes only when not loading
  const handleBackdrop = (e) => {
    if (status === 'loading') return;
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4
                 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-md bg-surface-dark-light border border-border-primary
                      rounded-card shadow-2xl shadow-black/50 p-8">

        {/* Close button — hidden while loading */}
        {status !== 'loading' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}

        {/* ── Loading ── */}
        {status === 'loading' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-brand-primary/10 border border-brand-primary/30
                            flex items-center justify-center mb-6">
              <Wand2 size={24} className="text-brand-primary animate-pulse" />
            </div>

            <h2 className="text-text-primary font-bold text-lg mb-1">Tailoring Your Resume</h2>
            <p className="text-text-secondary text-sm font-medium truncate max-w-xs mb-1">{job.title}</p>
            <p className="text-text-muted text-xs mb-8">{job.company}</p>

            <Loader2 size={28} className="text-brand-primary animate-spin mb-5" />

            <p className="text-text-secondary text-sm min-h-[1.25rem]">{LOADING_MESSAGES[msgIndex]}</p>
            <p className="text-text-muted text-xs mt-3">This usually takes 15–30 seconds</p>
          </div>
        )}

        {/* ── Success ── */}
        {status === 'success' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30
                            flex items-center justify-center mb-6">
              <CheckCircle size={26} className="text-green-400" />
            </div>

            <h2 className="text-text-primary font-bold text-lg mb-2">Resume Tailored!</h2>
            <p className="text-text-secondary text-sm mb-8 leading-relaxed">
              Your resume has been optimized for{' '}
              <span className="text-text-primary font-medium">{job.title}</span>
              {job.company ? ` at ${job.company}` : ''}.
            </p>

            <button
              onClick={handleViewResume}
              className="w-full py-3 rounded-button font-semibold text-sm
                         bg-brand-primary text-white hover:bg-brand-primary-hover
                         transition-colors duration-150 mb-3"
            >
              View &amp; Download Resume
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-button text-sm font-medium
                         border border-border-primary text-text-muted
                         hover:border-brand-primary hover:text-brand-primary
                         transition-colors duration-150"
            >
              Close
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30
                            flex items-center justify-center mb-6">
              <AlertCircle size={26} className="text-red-400" />
            </div>

            <h2 className="text-text-primary font-bold text-lg mb-2">Tailoring Failed</h2>
            <p className="text-text-muted text-sm mb-8 leading-relaxed">{errorMsg}</p>

            <button
              onClick={handleRetry}
              className="w-full py-3 rounded-button font-semibold text-sm
                         bg-brand-primary text-white hover:bg-brand-primary-hover
                         transition-colors duration-150 mb-3"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-button text-sm font-medium
                         border border-border-primary text-text-muted
                         hover:border-brand-primary hover:text-brand-primary
                         transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
