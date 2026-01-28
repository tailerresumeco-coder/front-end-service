import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useResume } from '../context/ResumeContext';
import DynamicForm from './DynamicForm';
import ResumeTemplate from './ResumeTemplate';
import updateByPath from '../utils/UpdateByPath';
import { useNavigate } from 'react-router-dom';
import { downloadPdfApi } from '../services/resumeService';

export default function ResumeBuilder() {
  const { resume, setResume } = useResume();
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef();
  const [downloadLoading, setDownloadLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if ((resume && resume.length === 0) || !resume) {
      navigate("/generate");
    }
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${resume?.basics?.name || 'Resume'}_Resume`,
  });

  const downloadPdf = async () => {
    setDownloadLoading(true);
    try {
      const payload = {
        html: previewRef.current.outerHTML.replace('font-weight: bold', 'font-weight: 500px'),   // real resume HTML
        filename: `${resume?.basics?.name || 'Resume'}_Resume.pdf`,
      };

      console.log('payload ', payload);
      

      const res = await downloadPdfApi(payload);

      // Create downloadable file
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = payload.filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleChange = (path, value) => {
    const updated = updateByPath(resume, path, value);
    setResume(updated);
  };

  return (
    <>
      <Helmet>
        <title>AI Resume Builder - Create Professional Resumes</title>
        <meta name="description" content="Build resumes section by section using AI writing assistant. Generate ATS-friendly resumes with live preview, editing tools, and PDF download capabilities." />
        <link rel="canonical" href="https://tailer-resume.com/resume-builder" />
        <meta property="og:title" content="AI Resume Builder - Create Professional Resumes" />
        <meta property="og:description" content="Build resumes section by section using AI writing assistant. Generate ATS-friendly resumes with live preview, editing tools, and PDF download capabilities." />
        <meta property="og:url" content="https://tailer-resume.com/resume-builder" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark">
      {/* Header */}
      <header className="border-b border-border-primary backdrop-blur-sm bg-surface-dark/40 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-text-secondary hover:text-brand-primary transition">← Home</Link>
            <h1 className="text-nav font-bold text-text-primary">Resume Builder</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden bg-brand-primary text-text-primary px-4 py-2 rounded-button hover:bg-brand-primary-hover transition"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={downloadPdf}
              disabled={!resume || downloadLoading}
              className="bg-brand-secondary text-text-primary px-4 py-2 rounded-button hover:bg-brand-secondary-hover transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {
                  downloadLoading ? (
                    <span>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 4H0c0 3.46 7.78 8 12v9.59zm3.59 3.59L3 21.35l1.45-1.45zm2.82-8.38a8.59 8.59 0 011.41 0zm3.59 3.59l1.45 1.45L21.35 3l1.45 1.45z"></path>
                      </svg>
                    </span>
                  ) : (
                    <span className='flex items-center justify-center gap-2'>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Download</span>
                    </span>
                  )
                }
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto">
        <div className="flex gap-3">
          {/* Left - Form */}
          <div className={`${showPreview ? 'hidden lg:block' : 'block'} flex-1`}>
            <div className="bg-white rounded-lg shadow-lg p-3 sticky top-20 max-h-[calc(100vh-7rem)] overflow-y-auto" style={{ borderRadius: '0px' }}>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Resume</h2>
              {resume ? (
                <DynamicForm data={resume} onChange={handleChange} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          {/* Right - Preview */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'} flex-2`}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-20 max-h-[calc(100vh-7rem)] overflow-y-auto whitespace-normal break-words" style={{ width: '800px', borderRadius: '0px', padding: '40px' }}>
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
    </>
  );
}