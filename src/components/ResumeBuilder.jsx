import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import DynamicForm from './DynamicForm';
import ResumeTemplate from './ResumeTemplate';
import AIInsightsPanel from './AIInsightsPanel';
import BeforeAfterComparison from './BeforeAfterComparison';
import updateByPath from '../utils/UpdateByPath';
import { useNavigate } from 'react-router-dom';
import { downloadPdfApi, getInputResume, storeResumes } from '../services/resumeService';
import FeedbackDialog from '../dialogs/FeedbackDialog';
import { Dialog, Slide } from "@mui/material";

export default function ResumeBuilder() {
  const { resume, setResume, uploadedResume } = useResume();
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const previewRef = useRef();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if ((resume && resume.length === 0) || !resume) {
      navigate("/generate");
      console.warn("No resume data found, redirecting to /generate");
    } else {
      handleStoreResumes();
    }
  }, []);

  const handleStoreResumes = () => {
    const payload = {
      input_resume:  getInputResume(),
      output_resume: previewRef.current.outerHTML.replace('font-weight: bold', 'font-weight: 500px'),
      email: resume?.basics?.email
    }
    storeResumes(payload);
  }

  const downloadPdf = async () => {
    setDownloadLoading(true);
    setShowFeedback(true);
    try {
      const payload = {
        html: previewRef.current.outerHTML.replace('font-weight: bold', 'font-weight: 500px'),   // real resume HTML
        filename: `${resume?.basics?.name || 'Resume'}_Resume.pdf`,
      };

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
      <Dialog
        open={showFeedback}
        onClose={() => setShowFeedback(false)}

        keepMounted
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        }}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <FeedbackDialog
          onSubmit={(data) => console.log(data)}
          onClose={() => setShowFeedback(false)}
          email={resume?.basics?.email}
          name={resume?.basics?.name}
        />
      </Dialog>
      <Helmet>
        <title>AI Resume Builder - Create Professional Resumes</title>
        <meta name="description" content="Build resumes section by section using AI writing assistant. Generate ATS-friendly resumes with live preview, editing tools, and PDF download capabilities." />
        <link rel="canonical" href="https://tailerresume.com/resume-builder" />
        <meta property="og:title" content="AI Resume Builder - Create Professional Resumes" />
        <meta property="og:description" content="Build resumes section by section using AI writing assistant. Generate ATS-friendly resumes with live preview, editing tools, and PDF download capabilities." />
        <meta property="og:url" content="https://tailerresume.com/resume-builder" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark">
        {/* Header */}
        <header className="border-b border-border-primary top-0 z-10">
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
            {/* Left - Form/Insights/Compare */}
            <div className={`${showPreview ? 'hidden lg:block' : 'block'} flex-1`}>
              <div className="bg-white rounded-lg shadow-lg sticky top-20 max-h-[calc(100vh-7rem)] overflow-hidden" style={{ borderRadius: '0px' }}>
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "edit"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    Edit Resume
                  </button>
                  <button
                    onClick={() => setActiveTab("insights")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "insights"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    AI Insights
                  </button>
                  <button
                    onClick={() => setActiveTab("compare")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "compare"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    Before/After
                  </button>
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto max-h-[calc(100vh-11rem)]">
                  {activeTab === "edit" && (
                    <div className="p-3">
                      <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Resume</h2>
                      {resume ? (
                        <DynamicForm data={resume} onChange={handleChange} />
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  )}

                  {activeTab === "insights" && (
                    <AIInsightsPanel metadata={resume?._metadata} />
                  )}

                  {activeTab === "compare" && (
                    <BeforeAfterComparison original={uploadedResume} tailored={resume} />
                  )}
                </div>
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