import { useState, useRef } from 'react';
import { Plus, FileText, Upload } from 'lucide-react';
import { uploadMyResume, activateMyResume } from '../services/resumeService';
import { useResume } from '../context/ResumeContext';
import './ResumePickerModal.css';

/**
 * ResumePickerModal
 *
 * Props:
 *   resumes    — array of resume objects from GET /my-resumes
 *   onConfirm  — called with the confirmed active resume object
 *   onSkip     — called when user skips (optional); if null, no skip button shown
 *   onResumeUploaded — called with newly uploaded resume so parent can refresh list
 */
export default function ResumePickerModal({ resumes, onConfirm, onSkip, onResumeUploaded }) {
  const { setActiveResume } = useResume();

  // Find pre-selected: the currently active one, or the first in list
  const initialSelected = resumes.find((r) => r.is_active)?.id || resumes[0]?.id || null;
  const [selectedId, setSelectedId] = useState(initialSelected);

  // Upload form state
  const [uploadOpen, setUploadOpen] = useState(resumes.length === 0);
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleFileChange = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      setError('Only PDF and DOCX files are supported.');
      return;
    }
    setError('');
    setUploadFile(file);
    if (!uploadName) setUploadName(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadName.trim()) {
      setError('Please provide a name and select a file.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const res = await uploadMyResume(uploadFile, uploadName.trim());
      const newResume = res.data;
      onResumeUploaded(newResume);
      setSelectedId(newResume.id);
      setUploadFile(null);
      setUploadName('');
      setUploadOpen(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    setError('');

    // If the selected resume is already active, skip the API call
    const alreadyActive = resumes.find((r) => (r.id || r._id) === selectedId)?.is_active;
    if (alreadyActive) {
      const resume = resumes.find((r) => (r.id || r._id) === selectedId);
      setActiveResume(resume);
      onConfirm(resume);
      return;
    }

    setConfirming(true);
    try {
      const res = await activateMyResume(selectedId);
      setActiveResume(res.data);
      onConfirm(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not set active resume. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const allResumes = resumes; // parent keeps list fresh via onResumeUploaded

  return (
    <div className="rpm-overlay">
      <div className="rpm-card">

        {/* Header */}
        <div className="rpm-header">
          <h2>Select Your Base Resume</h2>
          <p>
            {allResumes.length === 0
              ? 'Upload a resume to get started.'
              : 'Choose the resume you want to use as your base.'}
          </p>
          <div className="rpm-divider" />
        </div>

        {/* Body */}
        <div className="rpm-body">

          {/* Existing resumes */}
          {allResumes.length > 0 && (
            <div>
              <p className="rpm-section-label">Your Resumes</p>
              <div className="rpm-resume-list">
                {allResumes.map((r) => (
                  <div
                    key={r.id || r._id}
                    className={`rpm-resume-row ${selectedId === (r.id || r._id) ? 'selected' : ''}`}
                    onClick={() => setSelectedId(r.id || r._id)}
                  >
                    <div className="rpm-radio">
                      {selectedId === (r.id || r._id) && <div className="rpm-radio-dot" />}
                    </div>

                    <FileText size={16} color="#64748b" style={{ flexShrink: 0 }} />

                    <div className="rpm-resume-info">
                      <div className="rpm-resume-name">{r.name}</div>
                      <div className="rpm-resume-meta">
                        {r.file_type?.toUpperCase()} · Uploaded {formatDate(r.uploaded_at)}
                      </div>
                    </div>

                    {r.is_active && <span className="rpm-active-badge">Active</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload section */}
          <div className={`rpm-upload-section ${uploadOpen ? 'open' : ''}`}>
            <button
              className="rpm-upload-toggle"
              onClick={() => setUploadOpen((v) => !v)}
            >
              <Plus size={16} />
              {uploadOpen ? 'Cancel upload' : 'Upload a new resume'}
            </button>

            {uploadOpen && (
              <div className="rpm-upload-fields">
                <input
                  className="rpm-input"
                  type="text"
                  placeholder="Resume name (e.g. Backend Role)"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                />

                <div
                  className={`rpm-file-zone ${dragOver ? 'dragover' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {uploadFile ? (
                    <p className="rpm-file-selected">
                      <Upload size={13} style={{ display: 'inline', marginRight: 6 }} />
                      {uploadFile.name}
                    </p>
                  ) : (
                    <p>
                      <span>Click to browse</span> or drag & drop<br />PDF or DOCX
                    </p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </div>

                <button
                  className="rpm-upload-btn"
                  onClick={handleUpload}
                  disabled={uploading || !uploadFile || !uploadName.trim()}
                >
                  {uploading && <span className="rpm-spinner" />}
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>
            )}
          </div>

          {error && <p className="rpm-error">{error}</p>}
        </div>

        {/* Footer */}
        <div className="rpm-footer">
          {onSkip && (
            <button className="rpm-skip-btn" onClick={onSkip}>
              Skip for now
            </button>
          )}
          <button
            className="rpm-confirm-btn"
            onClick={handleConfirm}
            disabled={!selectedId || confirming}
          >
            {confirming && <span className="rpm-spinner" />}
            {confirming ? 'Saving…' : 'Confirm & Continue'}
          </button>
        </div>

      </div>
    </div>
  );
}
