import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, FileText, Trash2, CheckCircle } from "lucide-react";
import { useJobs } from "../context/JobContext";
import JobCard from "./JobCard";
import ResumePickerModal from "./ResumePickerModal";
import { listMyResumes, activateMyResume, deleteMyResume } from "../services/resumeService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { savedJobs } = useJobs();

  // My Resumes state
  const [resumes, setResumes] = useState([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [activatingId, setActivatingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/login"); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, []);

  const fetchResumes = useCallback(async () => {
    setResumesLoading(true);
    setResumeError("");
    try {
      const res = await listMyResumes();
      setResumes(res.data.resumes || []);
    } catch {
      setResumeError("Could not load resumes.");
    } finally {
      setResumesLoading(false);
    }
  }, []);

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const handleActivate = async (resumeId) => {
    setActivatingId(resumeId);
    setResumeError("");
    try {
      await activateMyResume(resumeId);
      setResumes((prev) =>
        prev.map((r) => ({ ...r, is_active: (r.id || r._id) === resumeId }))
      );
    } catch {
      setResumeError("Could not set active resume.");
    } finally {
      setActivatingId(null);
    }
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm("Delete this resume?")) return;
    setDeletingId(resumeId);
    setResumeError("");
    try {
      await deleteMyResume(resumeId);
      setResumes((prev) => prev.filter((r) => (r.id || r._id) !== resumeId));
    } catch {
      setResumeError("Could not delete resume.");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePickerConfirm = (updatedResume) => {
    setShowPicker(false);
    setResumes((prev) =>
      prev.map((r) => ({ ...r, is_active: (r.id || r._id) === (updatedResume.id || updatedResume._id) }))
    );
  };

  const handleResumeUploaded = (newResume) => {
    setResumes((prev) => [newResume, ...prev]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div>

      {/* ── Profile banner ── */}
      <div className="relative h-48 bg-gradient-to-br from-brand-primary to-brand-secondary flex items-end px-6 sm:px-10 py-5">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-6 bg-black/30 border border-white/20 text-white text-sm px-4 py-2 rounded-lg hover:bg-black/50 transition"
        >
          Logout
        </button>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white text-surface-dark text-3xl font-bold flex items-center justify-center border-4 border-surface-dark shadow-lg">
            {user?.sub?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.sub?.split("@")[0]}</h2>
            <p className="text-slate-200 text-sm">{user?.sub}</p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="flex justify-center gap-6 mt-8 px-4">
        {[
          { value: resumes.length, label: 'Resumes' },
          { value: savedJobs.length, label: 'Saved Jobs' },
        ].map(({ value, label }) => (
          <div key={label} className="bg-surface-dark-mid border border-border-primary px-8 py-5 rounded-xl text-center min-w-[120px]">
            <p className="text-2xl font-bold text-brand-primary">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── My Resumes ── */}
      <div className="mx-auto w-11/12 max-w-4xl mt-10">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h3 className="text-text-primary font-semibold flex items-center gap-2">
            <FileText size={18} className="text-brand-primary" />
            My Resumes
          </h3>
          <button
            onClick={() => setShowPicker(true)}
            className="border border-brand-primary text-brand-primary text-sm px-4 py-2 rounded-lg hover:bg-brand-primary/10 transition"
          >
            + Upload / Change Active
          </button>
        </div>

        {resumeError && (
          <p className="text-red-400 text-sm mb-3">{resumeError}</p>
        )}

        {resumesLoading ? (
          <div className="flex flex-col gap-2.5">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-gradient-to-r from-surface-dark-mid via-surface-dark-light to-surface-dark-mid bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-surface-dark-mid border border-dashed border-surface-dark-light rounded-xl py-14 text-center">
            <p className="text-text-muted text-sm mb-4">No resumes uploaded yet.</p>
            <button
              onClick={() => setShowPicker(true)}
              className="bg-brand-primary text-surface-dark text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-primary-hover transition"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {resumes.map((r) => {
              const rid = r.id || r._id;
              const isActive = r.is_active;
              return (
                <div
                  key={rid}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition ${
                    isActive
                      ? 'border-brand-primary/30 bg-brand-primary/5'
                      : 'border-surface-dark-mid bg-surface-dark-mid'
                  }`}
                >
                  <FileText size={18} className={isActive ? 'text-brand-primary shrink-0' : 'text-slate-500 shrink-0'} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{r.name}</p>
                    <p className="text-xs text-text-muted">{r.file_type?.toUpperCase()} · {formatDate(r.uploaded_at)}</p>
                  </div>

                  {isActive && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-primary/15 text-brand-primary border border-brand-primary/25 whitespace-nowrap flex items-center gap-1">
                      <CheckCircle size={11} />
                      Active
                    </span>
                  )}

                  {!isActive && (
                    <button
                      onClick={() => handleActivate(rid)}
                      disabled={activatingId === rid}
                      className="text-xs border border-surface-dark-light text-text-muted px-3 py-1.5 rounded-lg hover:border-brand-primary hover:text-brand-primary transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {activatingId === rid ? 'Setting…' : 'Set Active'}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rid)}
                    disabled={deletingId === rid}
                    aria-label="Delete resume"
                    className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Saved Jobs ── */}
      <div className="mx-auto w-11/12 max-w-4xl mt-10 mb-16">
        <h3 className="text-text-primary font-semibold flex items-center gap-2 mb-5">
          <Bookmark size={18} className="text-brand-primary" />
          Saved Jobs
        </h3>

        {savedJobs.length === 0 ? (
          <div className="bg-surface-dark-mid border border-dashed border-surface-dark-light rounded-xl py-14 text-center">
            <p className="text-text-muted text-sm mb-4">No saved jobs yet.</p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-brand-primary text-surface-dark text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-primary-hover transition"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Resume picker modal */}
      {showPicker && (
        <ResumePickerModal
          resumes={resumes}
          onConfirm={handlePickerConfirm}
          onSkip={() => setShowPicker(false)}
          onResumeUploaded={handleResumeUploaded}
        />
      )}
    </div>
  );
};

export default Profile;
