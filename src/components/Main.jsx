import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { storeInputResume, myResumesLists } from "../services/resumeService";
import * as pdfjsLib from "pdfjs-dist";
import { useResume } from "../context/ResumeContext";
import { useNavigate, useLocation } from "react-router-dom";
import mammoth from "mammoth";
import HowToGuide, { resumeTailoringSteps } from "./HowToGuide";
import FormatPickerModal from "./FormatPickerModal";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function Main() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [jd, setJd] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64File, setBase64File] = useState(null);
  const fileInputRef = useRef(null);
  const { setUploadedResume, setJobDescription, setLayoutPreference, setDetectedSectionOrder, setResumeName, setResumeId } = useResume();
  const [jdError, setJdError] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [allMyResumes, setAllMyResumes] = useState([]);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const sessionError = location.state?.error || null;

  const SECTION_DEFS = [
    { key: 'skills', patterns: ['skills', 'technical skills', 'core competencies', 'competencies', 'expertise'] },
    { key: 'experience', patterns: ['experience', 'work experience', 'professional experience', 'employment history', 'work history'] },
    { key: 'education', patterns: ['education', 'academic background', 'qualifications', 'academics'] },
    { key: 'projects', patterns: ['projects', 'personal projects', 'key projects', 'side projects'] },
    { key: 'internships', patterns: ['internships', 'internship'] },
    { key: 'certifications', patterns: ['certifications', 'certification', 'certificates', 'licenses & certifications'] },
    { key: 'awards', patterns: ['awards', 'honors', 'achievements', 'recognition', 'accomplishments'] },
    { key: 'languages', patterns: ['languages', 'language proficiency', 'linguistic skills'] },
  ];

  const DEFAULT_ORDER = ['skills', 'experience', 'projects', 'education', 'internships', 'certifications', 'awards', 'languages'];

  const detectSectionOrder = (rawText) => {
    const lines = rawText.toLowerCase().split('\n');
    const found = [];

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      SECTION_DEFS.forEach(({ key, patterns }) => {
        if (found.find(f => f.key === key)) return;
        if (patterns.some(p => trimmed === p || trimmed.startsWith(p + ' ') || trimmed.startsWith(p + ':'))) {
          found.push({ key, idx: lineIdx });
        }
      });
    });

    found.sort((a, b) => a.idx - b.idx);
    const detectedKeys = found.map(f => f.key);
    const remaining = DEFAULT_ORDER.filter(k => !detectedKeys.includes(k));
    return [...detectedKeys, ...remaining];
  };

  const onSend = () => {
    const error = validateJD(jd);
    if (error) {
      setJdError(error);
      return;
    }
    setShowFormatPicker(true);
  };

  useEffect(() => {
    const fetchResumes = async () => {
      const data = await myResumesLists();
      setAllMyResumes(data?.data?.resumes || []);
    };

    fetchResumes();
  }, []);

  useEffect(() => {
    if (allMyResumes.length > 0) {
      setSelectedResume(prev => prev || allMyResumes[0]);
      setResumeId(allMyResumes[0].id);
    }
  }, [allMyResumes]);

  const handleFormatSelect = (format) => {
    const resumeData = base64File || text;
    setLayoutPreference(format);
    if (format === 'adaptive') {
      setDetectedSectionOrder(detectSectionOrder(text));
    } else {
      setDetectedSectionOrder(null);
    }
    setUploadedResume(resumeData);
    setJobDescription(jd);
    storeInputResume(selectedFile);
    setShowFormatPicker(false);
    setResumeName(selectedFile.name);
    navigate("/processing", { state: { mode: 'tailor' } });
  };

  useEffect(() => {
    if (selectedFile) {
      setResumeName(selectedFile.name);
      setResumeId(null);
    } else {
      setResumeName(selectedResume?.name || '');
    }
  }, [selectedFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const scrollToPasteJd = () => {
    const element = document.getElementById("paste-jd");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      // Simulate file input change
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const validateJD = (value) => {

    if (!value.trim()) {
      return "Job description cannot be empty";
    }

    if (value === '###') {
      return false;
    }

    if (value.trim().length < 100) {
      return "Job description is not valid";
    }

    const keywords = [
      "responsibilities",
      "requirements",
      "qualifications",
      "skills",
      "experience",
      "job description",
      "about the role",
      "what we're looking for",
      "you will",
      "you are",
      "your role"
    ];

    const lowerValue = value.toLowerCase();

    const hasKeyword = keywords.some(keyword => lowerValue.includes(keyword));

    if (!hasKeyword) {
      return "Job description seems incomplete. Please include responsibilities, skills, or experience.";
    }

    return "";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setStatus("❌ File too large. Maximum size is 10 MB.");
      return;
    }

    setSelectedFile(file);

    setStatus("⏳ Processing Resume...");
    setText("");

    try {
      // Convert file to base64 for API calls
      const base64 = await fileToBase64(file);
      setBase64File(base64);

      if (file.type === "application/pdf") {


        const pdf = await pdfjsLib.getDocument(
          URL.createObjectURL(file)
        ).promise;

        let extractedText = "";
        let hasText = false;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const hyperLinks = await page.getAnnotations();

          const hyperlinksMap = {};
          hyperLinks.forEach((hyperlink) => {
            if (hyperlinksMap.length === 0 || !hyperlinksMap[hyperlink.overlaidText]) {
              hyperlinksMap[hyperlink.overlaidText] = hyperlink.url;
            }
          });

          content.items.forEach((item) => {
            if (hyperlinksMap[item.str]) {
              item.str = `${item.str}HASHYPERLINK${hyperlinksMap[item.str]}`;
            }
          });

          if (content.items.length > 0) {
            hasText = true;
          }

          content.items.forEach((item) => {
            extractedText += item.str + " ";
          });
        }

        if (!hasText) {
          setStatus("⚠️ Scanned PDF detected. Send to OCR (FastAPI).");
          return;
        }

        setText(extractedText.trim());
        setStatus("✅ Resume scanned successfully");
        scrollToPasteJd();
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();

        const result = await mammoth.extractRawText({ arrayBuffer });

        if (!result.value.trim()) {
          setStatus("❌ Could not extract text from DOCX");
          return;
        }

        setText(result.value.trim());
        setStatus("✅ DOCX Resume scanned successfully");
        scrollToPasteJd();
      } else {
        setStatus("❌ Unsupported file format");
      }
    } catch (err) {
      setStatus("❌ Failed to process Resume");
    }

  };

  return (
    <>
      <Helmet>
        <title>How to Tailor Your Resume for ATS | Upload & Optimize</title>
        <meta name="description" content="Upload your resume and job description to get an ATS-optimized, tailored resume in 30 seconds. AI-powered keyword matching and formatting for maximum interview chances." />
        <link rel="canonical" href="https://tailerresume.com/tailor-resume" />

        <meta property="og:title" content="How to Tailor Your Resume for ATS | Upload & Optimize" />
        <meta property="og:description" content="Upload your resume and job description to get an ATS-optimized, tailored resume in 30 seconds. AI-powered keyword matching." />
        <meta property="og:url" content="https://tailerresume.com/tailor-resume" />

        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://tailerresume.com/tailer-resume-logo-1.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Tailor Your Resume for ATS | Upload & Optimize" />
        <meta name="twitter:description" content="Upload your resume and job description to get an ATS-optimized, tailored resume in 30 seconds." />
        <meta name="twitter:image" content="https://tailerresume.com/tailer-resume-logo-1.svg" />
      </Helmet>
      <>
        {showFormatPicker && (
          <FormatPickerModal
            onSelect={handleFormatSelect}
            onClose={() => setShowFormatPicker(false)}
          />
        )}

        {/* Skip Navigation */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-primary text-white px-4 py-2 rounded z-50">
          Skip to main content
        </a>

        {/* Main Content */}
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20" role="main">
          {/* Session Error Banner */}
          {sessionError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-400 px-5 py-4 rounded-xl text-sm" role="alert">
              {sessionError}
            </div>
          )}

          {/* Answer-First Section */}
          <section className="mb-12" aria-labelledby="quick-answer-heading">
            <div className="bg-brand-primary/10 border-l-4 border-brand-primary p-6 rounded-r-lg">
              <p className="text-text-primary text-body leading-relaxed">
                Upload your resume (PDF or DOCX), paste the job description, and our AI will tailor your resume with optimized keywords and ATS-friendly formatting in under 30 seconds. Increase your interview chances by matching exactly what employers are looking for.
              </p>
            </div>
          </section>

          <section className="gap-20 items-center mb-16" aria-labelledby="upload-section-heading">
            <h2 id="upload-section-heading" className="sr-only">Resume Upload</h2>
            {/* Left Column - Upload Section */}
            <div>
              {/* Step Label */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-dot bg-brand-primary" aria-hidden="true"></div>
                <p className="text-badge font-medium text-brand-primary uppercase tracking-widest">
                  AI-native resume generation
                </p>
              </div>

              {/* Main Heading */}
              <h2 className="text-heading font-bold text-text-primary mb-6 leading-tight">
                Upload your resume to<br />
                <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                  begin
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-body text-text-muted mb-12 leading-relaxed">
                We'll tailor it for your next job using neural intelligence.
              </p>
              <div className="flex gap-4 justify-evenly">
                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-cyan-500/40 rounded-2xl bg-gradient-to-br from-cyan-900/10 to-purple-900/10 hover:border-cyan-400 transition-all duration-300 py-16 px-8 text-center cursor-pointer group backdrop-blur-sm"
                  role="button"
                  tabIndex={0}
                  aria-label="Upload resume file"
                >
                  {/* Upload Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/40 group-hover:shadow-cyan-500/60 transition-shadow">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-white font-semibold text-xl mb-2">
                    Drag & drop your resume here
                  </p>
                  <p className="text-gray-400 text-base mb-6">
                    or click to browse files
                  </p>

                  <p className="text-gray-500 text-sm uppercase tracking-wider">
                    Supported formats: PDF, DOCX · Max 10 MB
                  </p>
                </div>
                {allMyResumes.length > 0 &&

                  <div className="space-y-3 overflow-y-auto" style={{
                    maxHeight: "24rem",
                    overflowY: "auto",
                    scrollbarWidth: "none",       // Firefox
                    msOverflowStyle: "none"       // IE/Edge
                  }}>
                    {allMyResumes.map((resume) => {
                      const isSelected = selectedResume?._id === resume._id;

                      return (
                        <div
                          key={resume._id}
                          onClick={() => {setSelectedResume(resume); setResumeId(resume._id);}}
                          className={`p-4 rounded-xl cursor-pointer border transition-all duration-200
                          ${isSelected
                              ? "border-cyan-400 bg-cyan-500/10 shadow-md shadow-cyan-500/20"
                              : "border-gray-700 hover:border-cyan-500/40"
                            }`}
                        >
                          <p className="text-white font-medium truncate">
                            {resume.resume_name}
                          </p>

                          <p className="text-gray-400 text-sm">
                            {new Date(resume.created_on + "Z").toLocaleDateString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                }
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                aria-label="File upload input"
              />

              {/* Selected File Display */}
              {selectedFile && (
                <div className="mt-6">
                  <p className="text-badge text-text-secondary">
                    Selected file: <span className="text-brand-primary font-semibold">{selectedFile.name}</span>
                  </p>
                </div>
              )}

              {/* Status Message */}
              {status && (
                <p className="mt-4 text-badge text-brand-primary font-medium" role="status" aria-live="polite">
                  {status}
                </p>
              )}

              {/* Security Notice */}
              <p className="mt-8 text-badge text-text-subtle">
                Your resume is securely processed and never shared.
              </p>
            </div>
          </section>

          {/* Job Description Section */}
          <section className="border-t border-cyan-500/20 pt-16" aria-labelledby="jd-section-heading" id="paste-jd">
            <h2 id="jd-section-heading" className="text-2xl font-bold text-white mb-6">Paste Job Description</h2>
            <div className=" gap-8">
              <label htmlFor="job-description" className="sr-only">Job Description</label>
              <textarea
                style={{ color: 'black' }}
                id="job-description"
                value={jd}
                onChange={(e) => {
                  const value = e.target.value;
                  setJd(value);
                  setJdError(validateJD(value));
                }}
                placeholder="Paste your job description here..."
                className={`w-full h-40 bg-gradient-to-br from-cyan-900/10 to-purple-900/10 
                  border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none
                  transition-all backdrop-blur-sm
                  ${jdError ? "border-red-500" : "border-border-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"}`}
                aria-describedby={jdError ? "jd-error" : undefined}
              />
              {jdError && (
                <p id="jd-error" className="text-red-400 text-sm mt-2" role="alert">{jdError}</p>
              )}
            </div>
          </section>

          {/* Action Buttons */}
          <section className="flex gap-6 mt-12" aria-label="Action buttons">
            <button
              onClick={onSend}
              disabled={!text || !jd || jdError}
              className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-hover hover:to-brand-secondary-hover disabled:from-surface-dark disabled:to-surface-dark disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-semibold rounded-button transition-all duration-300 shadow-lg hover:shadow-brand-primary/40 disabled:shadow-none"
              aria-label="Generate tailored resume"
            >
              Generate my resume
            </button>
          </section>

          {/* Trust Message */}
          <p className="mt-16 text-text-subtle text-badge">
            Trusted by <span className="text-text-primary font-semibold">millions of successful applications</span> to optimize your next move.
          </p>
        </main>

        {/* HowTo Guide Section */}
        <HowToGuide
          name="How to Tailor Your Resume for Any Job"
          description="Follow these simple steps to get an optimized, ATS-friendly resume"
          totalTime="PT5M"
          steps={resumeTailoringSteps}
        />
      </>
    </>
  );
}
