import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResume } from '../context/ResumeContext';
import DynamicForm from './DynamicForm';
import ResumeTemplate from './ResumeTemplate';
import updateByPath from '../utils/UpdateByPath';

export default function ResumeBuilder() {
  const { resume, setResume } = useResume();
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${resume?.basics?.name || 'Resume'}_Resume`,
  });

  const handleChange = (path, value) => {
    const updated = updateByPath(resume, path, value);
    setResume(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark">
      {/* Header */}
      <header className="border-b border-border-primary backdrop-blur-sm bg-surface-dark/40 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-nav font-bold text-text-primary">Resume Builder</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden bg-brand-primary text-text-primary px-4 py-2 rounded-button hover:bg-brand-primary-hover transition"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handlePrint}
              disabled={!resume}
              className="bg-brand-secondary text-text-primary px-4 py-2 rounded-button hover:bg-brand-secondary-hover transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Form */}
          <div className={`${showPreview ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Resume</h2>
              {resume ? (
                <DynamicForm data={resume} onChange={handleChange} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          {/* Right - Preview */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-20 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold">
                Live Preview
              </div>
              {resume ? (
                <ResumeTemplate ref={previewRef} resume={resume} />
              ) : (
                <p className="p-4">Loading preview...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}