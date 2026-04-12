import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import FAQ, { defaultFAQs } from './FAQ';

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>How to Tailor Your Resume with AI | Tailer Resume</title>
        <meta name="description" content="Tailor Resume uses AI to optimize your resume for any job in seconds. Match ATS requirements, highlight relevant skills, and increase interview chances by 3x. Free to use." />
        <link rel="canonical" href="https://tailerresume.com/" />
        <meta property="og:title" content="How to Tailor Your Resume with AI | Tailer Resume" />
        <meta property="og:description" content="Tailor your resume for specific jobs using AI. ATS-optimized, keyword-matched, interview-ready in 30 seconds. Free resume tailoring tool." />
        <meta property="og:url" content="https://tailerresume.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://tailerresume.com/tailer-resume-logo-1.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Tailor Your Resume with AI | Tailer Resume" />
        <meta name="twitter:description" content="Tailor your resume for specific jobs using AI. ATS-optimized, keyword-matched, interview-ready in 30 seconds." />
        <meta name="twitter:image" content="https://tailerresume.com/tailer-resume-logo-1.svg" />
      </Helmet>

      {/* Skip Navigation */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-primary text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>

      {/* Hero */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden" role="main">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center" aria-labelledby="hero-heading">

          {/* Left — Hero copy */}
          <article>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 bg-brand-primary rounded-dot" aria-hidden="true"></div>
              <span className="text-badge text-brand-primary font-medium">AI-native resume generation</span>
            </div>

            <h1 id="hero-heading" className="text-heading font-bold mb-6 leading-tight">
              Your resume, <span className="text-brand-primary">rewired by</span>
              <br />
              <span className="text-brand-primary">intelligence</span>.
            </h1>

            <div className="bg-brand-primary/10 border-l-4 border-brand-primary p-4 rounded-r-lg mb-6" itemScope itemType="https://schema.org/DefinedTerm">
              <meta itemProp="name" content="TailerResume Definition" />
              <p className="text-text-primary text-body leading-relaxed" itemProp="description">
                <strong>TailerResume is an AI-powered resume tailoring tool</strong> that optimizes resumes for Applicant Tracking Systems (ATS) by matching them to specific job descriptions. Upload your resume, paste the job description, and get an ATS-friendly, keyword-optimized resume that <strong>increases interview chances by 3x</strong> in under 30 seconds.
              </p>
            </div>

            <p className="text-text-secondary text-body mb-4 leading-relaxed">
              Smarter than templates. Powered by intelligence.
            </p>
            <p className="text-text-muted text-body-small mb-10 leading-relaxed">
              Turn your experience into a living, learning resume. Understands your story, adapts to every role, and keeps improving with every application.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/tailor-resume"
                className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-button font-semibold hover:shadow-lg hover:shadow-brand-primary/50 transition transform hover:scale-105 inline-block text-center"
                aria-label="Start tailoring your resume with AI"
              >
                Tailor my Resume
              </Link>
              <Link
                to="/ats-score"
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-button font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105 inline-block text-center text-white"
                aria-label="Check your resume ATS score"
              >
                Check ATS Score
              </Link>
            </div>
          </article>

          {/* Right — Animated visual */}
          <aside className="relative h-96 flex items-center justify-center" aria-hidden="true">
            <figure className="relative w-64 h-80">
              <div className="absolute inset-0 border border-border-primary rounded-card backdrop-blur-sm bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10"></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot top-20 left-12 animate-pulse"></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot top-12 right-16 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot bottom-24 left-8 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot bottom-16 right-12 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot top-1/3 right-6 animate-pulse" style={{ animationDelay: '0.8s' }}></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot bottom-1/3 left-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute w-1.5 h-1.5 bg-brand-primary-hover rounded-dot top-1/2 right-8 animate-pulse" style={{ animationDelay: '1.2s' }}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-card blur-2xl opacity-50"></div>
            </figure>
            <div className="absolute top-10 right-10 w-48 h-48 bg-brand-primary/10 rounded-dot blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-brand-secondary/10 rounded-dot blur-3xl"></div>
          </aside>

        </section>
      </main>

      {/* Why TailerResume */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16" aria-labelledby="key-takeaways-heading">
        <h2 id="key-takeaways-heading" className="text-3xl font-bold text-center text-text-primary mb-8">
          Why Choose TailerResume?
        </h2>
        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl p-8 border border-brand-primary/30 mb-12">
          <ul className="space-y-4">
            {[
              { bold: 'The main benefit is', rest: 'increasing your interview chances by 3x through AI-optimized keyword matching' },
              { bold: 'Research shows that', rest: '75% of resumes are rejected by ATS systems — TailerResume ensures ATS compatibility' },
              { bold: 'Studies indicate', rest: 'tailored resumes receive 3x more callbacks than generic resumes' },
              { bold: 'The key advantage is', rest: '30-second processing vs. hours of manual resume editing' },
            ].map(({ bold, rest }) => (
              <li key={bold} className="flex items-start gap-3">
                <span className="text-brand-primary text-xl font-bold mt-0.5">✓</span>
                <p className="text-text-primary"><strong>{bold}</strong> {rest}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl font-bold text-center text-text-primary mb-12">
          How TailerResume Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: 'Step 1', title: 'AI-Powered Tailoring', body: 'Our AI analyzes job descriptions and automatically optimizes your resume with relevant keywords and skills for maximum ATS compatibility.' },
            { step: 'Step 2', title: 'ATS Optimization', body: 'Ensure your resume passes Applicant Tracking Systems with proper formatting, keyword placement, and clean structure.' },
            { step: 'Step 3', title: '30-Second Results', body: 'Get your tailored resume in under 30 seconds. Simply upload, paste job description, and download your optimized resume.' },
          ].map(({ step, title, body }) => (
            <article key={step} className="bg-surface-dark/50 backdrop-blur-sm rounded-xl p-6 border border-border-primary">
              <h3 className="text-xl font-bold text-brand-primary mb-3">{step}: {title}</h3>
              <p className="text-text-secondary">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-3xl font-bold text-center text-text-primary mb-8">
          Proven Results for Job Seekers
        </h2>
        <p className="text-center text-text-secondary mb-8 max-w-3xl mx-auto">
          <strong>Research shows that</strong> tailored resumes are <strong>3x more likely to result in interviews</strong> compared to generic resumes.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '95%', label: 'Keyword Matching Accuracy' },
            { value: '3x',  label: 'More Interview Chances' },
            { value: '30s', label: 'Average Processing Time' },
            { value: '1,250+', label: 'Successful Applications' },
          ].map(({ value, label }) => (
            <div key={value} className="bg-brand-primary/10 rounded-xl p-6 border border-border-primary">
              <div className="text-4xl font-bold text-brand-primary mb-2">{value}</div>
              <p className="text-text-secondary text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQ title="Frequently Asked Questions" faqs={defaultFAQs} />
    </>
  );
}
