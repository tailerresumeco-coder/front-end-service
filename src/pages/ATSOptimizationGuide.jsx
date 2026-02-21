import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import FAQ from '../components/FAQ';

/**
 * ATS Optimization Guide - Comprehensive guide for ATS-friendly resumes
 * Targets: "ATS optimization", "ATS-friendly resume", "pass ATS screening"
 */
export default function ATSOptimizationGuide() {
  const atsFAQs = [
    {
      question: "What is an ATS-friendly resume format?",
      answer: "An ATS-friendly resume uses simple formatting without tables, graphics, or complex layouts. It includes standard section headings like 'Work Experience' and 'Education', uses common fonts (Arial, Calibri, Times New Roman), and saves in .docx or .pdf formats. The content should include relevant keywords from the job description."
    },
    {
      question: "How do I know if my resume is ATS-compatible?",
      answer: "Test your resume by copying and pasting it into a plain text editor. If the information appears in the correct order and is readable, it's likely ATS-compatible. You can also use online ATS scanners or tools like Tailor Resume that provide ATS compatibility scores."
    },
    {
      question: "What file format is best for ATS?",
      answer: "DOCX is generally the most ATS-friendly format as it preserves formatting while being easily parsed. PDF is also acceptable if it's text-based (not scanned). Avoid image files, HTML, or proprietary formats that ATS systems may not read correctly."
    },
    {
      question: "Should I use a resume template for ATS?",
      answer: "Use simple, clean templates without graphics, tables, or columns. Many modern resume templates with fancy designs are not ATS-friendly. Choose templates with single-column layouts, standard fonts, and clear section headings."
    },
    {
      question: "How many keywords should I include in my resume?",
      answer: "Include relevant keywords naturally throughout your resume. Focus on quality over quantity - use keywords that genuinely reflect your skills and experience. Aim to match 70-80% of the key requirements from the job description without keyword stuffing."
    },
    {
      question: "Do headers and footers work with ATS?",
      answer: "Most ATS systems cannot read content in headers and footers. Keep all important information, including contact details, in the main body of your resume. Avoid placing critical content in headers or footers."
    },
    {
      question: "Can ATS read bullet points?",
      answer: "Yes, standard bullet points (•, -, *) are generally ATS-readable. However, avoid using special characters or custom bullet symbols. Simple, standard bullets work best for ATS compatibility."
    },
    {
      question: "How long should an ATS-optimized resume be?",
      answer: "For most professionals, a 1-2 page resume is ideal. ATS systems don't have page limits, but recruiters prefer concise resumes. Focus on relevant experience from the last 10-15 years and keep content targeted to the specific job."
    }
  ];

  return (
    <>
      <Helmet>
        <title>ATS Resume Optimization Guide 2025 | Pass ATS Screening</title>
        <meta name="description" content="Complete guide to creating ATS-friendly resumes. Learn formatting tips, keyword strategies, and common mistakes to avoid. Increase your chances of passing ATS screening by 3x." />
        <link rel="canonical" href="https://tailerresume.com/ats-optimization-guide" />
        <meta property="og:title" content="ATS Resume Optimization Guide 2025 | Pass ATS Screening" />
        <meta property="og:description" content="Complete guide to creating ATS-friendly resumes. Learn formatting tips, keyword strategies, and common mistakes to avoid." />
        <meta property="og:url" content="https://tailerresume.com/ats-optimization-guide" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://tailerresume.com/tailer-resume-logo-1.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ATS Resume Optimization Guide 2025 | Pass ATS Screening" />
        <meta name="twitter:description" content="Complete guide to creating ATS-friendly resumes. Learn formatting tips and keyword strategies." />
        <meta name="twitter:image" content="https://tailerresume.com/tailer-resume-logo-1.svg" />
        <meta name="article:published_time" content="2025-02-06" />
        <meta name="article:modified_time" content="2025-02-06" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark text-text-primary">
        {/* Skip Navigation */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-primary text-white px-4 py-2 rounded z-50">
          Skip to main content
        </a>

        {/* Header */}
        <header className="border-b border-border-primary backdrop-blur-sm bg-surface-dark/40" role="banner">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-dot border-2 border-brand-primary flex items-center justify-center" aria-hidden="true">
                <div className="w-6 h-6 rounded-dot bg-brand-primary"></div>
              </div>
              <Link to="/" className="text-nav font-bold text-text-primary hover:text-brand-primary transition">Tailer Resume</Link>
            </div>
            <nav aria-label="Main navigation" className="flex gap-8">
              <Link to="/" className="text-text-secondary hover:text-brand-primary text-badge font-medium transition">Home</Link>
              <Link to="/tailor-resume" className="text-text-secondary hover:text-brand-primary text-badge font-medium transition">Tailor Resume</Link>

            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="max-w-7xl mx-auto px-8 py-12" role="main">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-text-muted">
              <li><Link to="/" className="hover:text-brand-primary transition">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-text-primary" aria-current="page">ATS Optimization Guide</li>
            </ol>
          </nav>

          <article itemScope itemType="https://schema.org/Article">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">ATS Guide</span>
                <span className="text-text-muted text-sm">Updated February 6, 2025</span>
              </div>
              <h1 className="text-4xl font-bold text-text-primary mb-4" itemProp="headline">
                ATS Resume Optimization Guide 2025: Pass Applicant Tracking Systems
              </h1>
              <p className="text-text-secondary text-lg leading-relaxed" itemProp="description">
                Master ATS optimization with our comprehensive guide. Learn the exact formatting, keywords, and strategies that help your resume pass automated screening and reach human recruiters.
              </p>
            </header>

            {/* Author Meta */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border-primary" itemProp="author" itemScope itemType="https://schema.org/Organization">
              <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center">
                <span className="text-brand-primary font-bold">TR</span>
              </div>
              <div>
                <p className="font-semibold text-text-primary" itemProp="name">Tailor Resume Team</p>
                <p className="text-text-muted text-sm">ATS Optimization Experts</p>
              </div>
              <meta itemProp="url" content="https://tailerresume.com" />
            </div>

            {/* ANSWER-FIRST SECTION */}
            <section className="mb-12" aria-labelledby="quick-answer-heading">
              <div className="bg-green-500/10 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h2 id="quick-answer-heading" className="text-lg font-semibold text-green-400 mb-3">
                 How to Create an ATS-Friendly Resume
                </h2>
                <p className="text-text-primary text-body leading-relaxed" itemProp="articleBody">
                  <strong>To pass ATS screening:</strong> Use a simple, single-column format with standard fonts (Arial, Calibri). Include exact keywords from the job description in your skills and experience sections. Save as DOCX or text-based PDF. Avoid tables, graphics, headers/footers, and complex formatting. <strong>75% of resumes fail ATS</strong> due to formatting issues - follow this guide to be in the top 25%.
                </p>
              </div>
            </section>

            {/* What is ATS Section */}
            <section className="mb-12" aria-labelledby="what-is-ats-heading">
              <h2 id="what-is-ats-heading" className="text-2xl font-bold text-text-primary mb-6">
                What is an Applicant Tracking System (ATS)?
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                An Applicant Tracking System (ATS) is software used by employers to collect, sort, scan, and rank job applications. <strong>95% of Fortune 500 companies</strong> and <strong>75% of all employers</strong> use ATS systems to filter resumes before they reach human recruiters.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                ATS works by parsing resumes and extracting information like contact details, work experience, education, and skills. It then compares this data against the job description to determine if you're a good match. Resumes that don't meet the criteria are automatically filtered out.
              </p>
              <div className="bg-surface-dark/50 p-6 rounded-xl border border-border-primary">
                <h3 className="font-semibold text-brand-primary mb-3">How ATS Filters Work:</h3>
                <ol className="list-decimal list-inside text-text-secondary space-y-2">
                  <li><strong>Resume Parsing:</strong> ATS extracts text and organizes it into categories</li>
                  <li><strong>Keyword Matching:</strong> System compares your resume against job requirements</li>
                  <li><strong>Ranking:</strong> Candidates are scored based on keyword matches and qualifications</li>
                  <li><strong>Filtering:</strong> Only top-ranked resumes reach human recruiters</li>
                </ol>
              </div>
            </section>

            {/* ATS-Friendly Formatting */}
            <section className="mb-12" aria-labelledby="formatting-heading">
              <h2 id="formatting-heading" className="text-2xl font-bold text-text-primary mb-6">
                ATS-Friendly Resume Formatting
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">✅ DO: ATS-Friendly</h3>
                  <ul className="space-y-2 text-text-secondary text-sm">
                    <li>• Use standard fonts (Arial, Calibri, Times New Roman)</li>
                    <li>• Simple bullet points (•, -, *)</li>
                    <li>• Standard section headings</li>
                    <li>• Single-column layout</li>
                    <li>• Save as DOCX or PDF</li>
                    <li>• 10-12pt font size</li>
                    <li>• Clear contact info in body</li>
                    <li>• Chronological work history</li>
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-red-400 mb-4">❌ DON'T: ATS-Unfriendly</h3>
                  <ul className="space-y-2 text-text-secondary text-sm">
                    <li>• Tables or text boxes</li>
                    <li>• Graphics, images, or charts</li>
                    <li>• Headers and footers</li>
                    <li>• Multi-column layouts</li>
                    <li>• Fancy fonts or symbols</li>
                    <li>• Text in images</li>
                    <li>• Scanned PDFs (image-based)</li>
                    <li>• Complex formatting</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-brand-primary mb-4">Standard Section Headings</h3>
              <p className="text-text-secondary mb-4">Use these ATS-recognized headings:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-surface-dark/30 p-3 rounded text-center text-sm text-text-secondary">Contact Information</div>
                <div className="bg-surface-dark/30 p-3 rounded text-center text-sm text-text-secondary">Professional Summary</div>
                <div className="bg-surface-dark/30 p-3 rounded text-center text-sm text-text-secondary">Work Experience</div>
                <div className="bg-surface-dark/30 p-3 rounded text-center text-sm text-text-secondary">Education</div>
                <div className="bg-surface-dark/30 p-3 rounded text-center text-sm text-text-secondary">Skills</div>
                <div className="bg-surface-dark/30 p-3 rounded text-center text-sm text-text-secondary">Certifications</div>
                <div className="bg-surface-dark/30 p-3 rounded text-center text-sm text-text-secondary">Projects</div>
                <div className="bg-surface-dark/30 p-3 rounded text-center text-sm text-text-secondary">Awards</div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="mb-12 text-center" aria-labelledby="cta-heading">
              <div className="bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 p-8 rounded-2xl border border-brand-primary/30">
                <h2 id="cta-heading" className="text-2xl font-bold text-text-primary mb-4">
                  Get Your ATS Compatibility Score
                </h2>
                <p className="text-text-secondary mb-6">
                  Upload your resume and job description to get an instant ATS optimization report. See exactly how to improve your resume.
                </p>
                <Link 
                  to="/tailor-resume"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-button font-semibold hover:shadow-lg hover:shadow-brand-primary/50 transition transform hover:scale-105"
                >
                  Check My Resume →
                </Link>

              </div>
            </section>

            {/* Related Content */}
            <section className="mb-12" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-xl font-bold text-text-primary mb-4">
                Related Guides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  to="/how-to-tailor-resume"
                  className="p-4 bg-surface-dark/50 rounded-lg border border-border-primary hover:border-brand-primary transition group"
                >
                  <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition">How to Tailor Your Resume</h3>
                  <p className="text-text-muted text-sm mt-1">Step-by-step guide to customizing your resume for any job</p>
                </Link>
                <Link 
                  to="/ats-score"
                  className="p-4 bg-surface-dark/50 rounded-lg border border-border-primary hover:border-brand-primary transition group"
                >
                  <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition">Check ATS Score</h3>
                  <p className="text-text-muted text-sm mt-1">See how well your resume matches job descriptions</p>
                </Link>

              </div>
            </section>
          </article>
        </main>

        {/* FAQ Section */}
        <FAQ title="Frequently Asked Questions About ATS" faqs={atsFAQs} />

        {/* Footer */}
        <footer className="border-t border-border-primary backdrop-blur-sm bg-surface-dark/40 py-12" role="contentinfo">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-nav font-bold text-text-primary mb-4">Tailor Resume</h3>
                <p className="text-text-muted text-body-small leading-relaxed">
                  AI-powered resume tailoring for job seekers. Create ATS-friendly resumes that get results.
                </p>
              </div>
              <nav aria-label="Footer navigation">
                <h4 className="text-badge font-semibold text-text-primary mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-text-secondary hover:text-brand-primary transition">Home</Link></li>
                  <li><Link to="/tailor-resume" className="text-text-secondary hover:text-brand-primary transition">AI Resume Generator</Link></li>

                  <li><Link to="/how-to-tailor-resume" className="text-text-secondary hover:text-brand-primary transition">How to Tailor Resume</Link></li>
                  <li><Link to="/ats-optimization-guide" className="text-text-secondary hover:text-brand-primary transition">ATS Optimization Guide</Link></li>
                </ul>
              </nav>
              <nav aria-label="Resources">
                <h4 className="text-badge font-semibold text-text-primary mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="https://tailerresume.com/sitemap.xml" className="text-text-secondary hover:text-brand-primary transition">Sitemap</a></li>
                  <li><a href="https://tailerresume.com/robots.txt" className="text-text-secondary hover:text-brand-primary transition">Robots.txt</a></li>
                </ul>
              </nav>
            </div>
            <div className="border-t border-border-primary mt-8 pt-8 text-center">
              <p className="text-text-subtle text-badge">
                © 2026 Tailor Resume. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
