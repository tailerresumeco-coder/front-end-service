import React, { useState, useRef } from "react";
import { uploadResumeAndJD } from "../services/resumeService";
import * as pdfjsLib from "pdfjs-dist";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function Main() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [jd, setJd] = useState("");
  const [resumeContent, setResumeContent] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const onSend = async () => {
    try {
      const res = await uploadResumeAndJD(text, jd);
      console.log('res is ', res);
      
    } catch (err) {
      console.error(err);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type !== "application/pdf") {
      setStatus("❌ Please upload a PDF file");
      return;
    }

    setStatus("⏳ Processing PDF...");
    setText("");

    try {
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
        // TODO: send PDF to FastAPI OCR endpoint
        return;
      }

      setText(extractedText.trim());
      setStatus("✅ Text extracted successfully");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to process PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark">
      {/* Header */}
      <header className="border-b border-border-primary backdrop-blur-sm bg-surface-dark/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-dot border-2 border-brand-primary flex items-center justify-center">
              <div className="w-6 h-6 rounded-dot bg-brand-primary"></div>
            </div>
            <h1 className="text-nav font-bold text-text-primary">Trailer Resume</h1>
          </div>
          <nav className="flex gap-8">
            <a href="#" className="text-text-secondary hover:text-brand-primary text-badge font-medium transition">Product</a>
            <a href="#" className="text-text-secondary hover:text-brand-primary text-badge font-medium transition">Pricing</a>
            <a href="#" className="text-text-secondary hover:text-brand-primary text-badge font-medium transition">Login</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-2 gap-20 items-center mb-16">
          {/* Left Column - Upload Section */}
          <div>
            {/* Step Label */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-dot bg-brand-primary"></div>
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

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-500/40 rounded-2xl bg-gradient-to-br from-cyan-900/10 to-purple-900/10 hover:border-cyan-400 transition-all duration-300 py-16 px-8 text-center cursor-pointer group backdrop-blur-sm"
            >
              {/* Upload Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/40 group-hover:shadow-cyan-500/60 transition-shadow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
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
              <p className="mt-4 text-badge text-brand-primary font-medium">
                {status}
              </p>
            )}

            {/* Security Notice */}
            <p className="mt-8 text-badge text-text-subtle">
              Your resume is securely processed and never shared.
            </p>
          </div>

          {/* Right Column - Visual */}
          <div className="relative h-96">
            <div className="absolute inset-0 border-2 border-border-primary rounded-card backdrop-blur-3xl bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5"></div>
            {/* Animated dots */}
            <div className="absolute top-12 right-12 w-3 h-3 rounded-dot bg-brand-primary animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-dot bg-brand-secondary animate-pulse delay-75"></div>
            <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-dot bg-brand-primary-hover animate-pulse delay-150"></div>
            <div className="absolute bottom-1/4 left-1/4 w-2.5 h-2.5 rounded-dot bg-brand-secondary-hover animate-pulse delay-100"></div>
          </div>
        </div>

        {/* Job Description Section */}
        <div className="border-t border-cyan-500/20 pt-16">
          <h3 className="text-2xl font-bold text-white mb-6">Paste Job Description</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-3 uppercase tracking-wider">
                Job Description
              </label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste your job description here..."
                className="w-full h-40 bg-gradient-to-br from-cyan-900/10 to-purple-900/10 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-3 uppercase tracking-wider">
                Extracted Resume
              </label>
              <textarea
                value={text}
                readOnly
                className="w-full h-40 bg-gradient-to-br from-cyan-900/10 to-purple-900/10 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 mt-12">
          <button
            onClick={onSend}
            disabled={!text || !jd}
            className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-hover hover:to-brand-secondary-hover disabled:from-surface-dark disabled:to-surface-dark disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-semibold rounded-button transition-all duration-300 shadow-lg hover:shadow-brand-primary/40 disabled:shadow-none"
          >
            Generate my resume
          </button>
          <button className="px-8 py-4 border border-border-secondary hover:border-brand-primary text-text-primary font-semibold rounded-button transition-all duration-300 flex items-center gap-2 hover:bg-brand-primary/10">
            Watch how it works
            <span>→</span>
          </button>
        </div>

        {/* Trust Message */}
        <p className="mt-16 text-text-subtle text-badge">
          Trusted by <span className="text-text-primary font-semibold">millions of successful applications</span> to optimize your next move.
        </p>
      </div>
    </div>
  );
}