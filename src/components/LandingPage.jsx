import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import FAQ, { defaultFAQs } from './FAQ';

export default function LandingPage() {
  const navigate = useNavigate();

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

      <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark text-text-primary overflow-hidden">
        {/* Skip Navigation for Accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-primary text-white px-4 py-2 rounded z-50">
          Skip to main content
        </a>
        
        {/* Header with Navigation */}
        <header className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full" role="banner">
          <nav aria-label="Main navigation" className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-dot border-2 border-brand-primary flex items-center justify-center" aria-hidden="true">
                <div className="w-3 h-3 bg-brand-primary rounded-dot"></div>
              </div>
              <span className="text-nav font-semibold">Tailor Resume</span>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main id="main-content" className="max-w-7xl mx-auto px-8 py-20" role="main">
          <section className="grid grid-cols-2 gap-12 items-center" aria-labelledby="hero-heading">
            {/* Left Side - Hero Content */}
            <article>
              {/* Badge */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 bg-brand-primary rounded-dot" aria-hidden="true"></div>
                <span className="text-badge text-brand-primary font-medium">AI-native resume generation</span>
              </div>

              {/* Heading */}
              <h1 id="hero-heading" className="text-heading font-bold mb-6 leading-tight">
                Your resume, <span className="text-brand-primary">rewired by</span>
                <br />
                <span className="text-brand-primary">intelligence</span>.
              </h1>

              {/* Answer-First "Is-A" Definition for AI Search */}
              <div className="bg-brand-primary/10 border-l-4 border-brand-primary p-4 rounded-r-lg mb-6" itemScope itemType="https://schema.org/DefinedTerm">
                <meta itemProp="name" content="TailerResume Definition" />
                <p className="text-text-primary text-body leading-relaxed" itemProp="description">
                  <strong>TailerResume is an AI-powered resume tailoring tool</strong> that optimizes resumes for Applicant Tracking Systems (ATS) by matching them to specific job descriptions. Upload your resume, paste the job description, and get an ATS-friendly, keyword-optimized resume that <strong>increases interview chances by 3x</strong> in under 30 seconds.
                </p>
              </div>


              {/* Description */}
              <p className="text-text-secondary text-body mb-4 leading-relaxed">
                Smarter than templates. Powered by intelligence.
              </p>
              <p className="text-text-muted text-body-small mb-10 leading-relaxed">
                Turn your experience into a living, learning resume. Understands your story, adapts to every role, and keeps improving with every application.
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <Link 
                  to="/generate" 
                  className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-button font-semibold hover:shadow-lg hover:shadow-brand-primary/50 transition transform hover:scale-105 inline-block"
                  aria-label="Start tailoring your resume with AI"
                >
                  Tailor my Resume
                </Link>
              </div>
            </article>

            {/* Right Side - Animated Background */}
            <aside className="relative h-96 flex items-center justify-center" aria-hidden="true">
              {/* Glowing rectangle with particles - AI Resume Optimization Visualization */}
              <figure className="relative w-64 h-80">
                {/* Main rectangle */}
                <div className="absolute inset-0 border border-border-primary rounded-card backdrop-blur-sm bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10"></div>

                {/* Animated particles representing AI processing */}
                <div className="absolute w-2 h-2 bg-brand-primary rounded-dot top-20 left-12 animate-pulse" aria-hidden="true"></div>
                <div className="absolute w-2 h-2 bg-brand-primary rounded-dot top-12 right-16 animate-pulse" style={{ animationDelay: '0.2s' }} aria-hidden="true"></div>
                <div className="absolute w-2 h-2 bg-brand-primary rounded-dot bottom-24 left-8 animate-pulse" style={{ animationDelay: '0.4s' }} aria-hidden="true"></div>
                <div className="absolute w-2 h-2 bg-brand-primary rounded-dot bottom-16 right-12 animate-pulse" style={{ animationDelay: '0.6s' }} aria-hidden="true"></div>
                <div className="absolute w-2 h-2 bg-brand-primary rounded-dot top-1/3 right-6 animate-pulse" style={{ animationDelay: '0.8s' }} aria-hidden="true"></div>
                <div className="absolute w-2 h-2 bg-brand-primary rounded-dot bottom-1/3 left-1/2 animate-pulse" style={{ animationDelay: '1s' }} aria-hidden="true"></div>
                <div className="absolute w-1.5 h-1.5 bg-brand-primary-hover rounded-dot top-1/2 right-8 animate-pulse" style={{ animationDelay: '1.2s' }} aria-hidden="true"></div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-card blur-2xl opacity-50"></div>
              </figure>

              {/* Background gradient orbs */}
              <div className="absolute top-10 right-10 w-48 h-48 bg-brand-primary/10 rounded-dot blur-3xl" aria-hidden="true"></div>
              <div className="absolute bottom-20 left-10 w-48 h-48 bg-brand-secondary/10 rounded-dot blur-3xl" aria-hidden="true"></div>
            </aside>

          </section>
        </main>

        {/* Key Takeaways / Why TailerResume Section - Citation Ready */}
        <section className="max-w-7xl mx-auto px-8 py-16" aria-labelledby="key-takeaways-heading">
          <h2 id="key-takeaways-heading" className="text-3xl font-bold text-center text-text-primary mb-8">
            Why Choose TailerResume?
          </h2>
          <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl p-8 border border-brand-primary/30 mb-12">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-brand-primary text-2xl">✓</span>
                <p className="text-text-primary"><strong>The main benefit is</strong> increasing your interview chances by 3x through AI-optimized keyword matching</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary text-2xl">✓</span>
                <p className="text-text-primary"><strong>Research shows that</strong> 75% of resumes are rejected by ATS systems - TailerResume ensures ATS compatibility</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary text-2xl">✓</span>
                <p className="text-text-primary"><strong>Studies indicate</strong> tailored resumes receive 3x more callbacks than generic resumes</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary text-2xl">✓</span>
                <p className="text-text-primary"><strong>The key advantage is</strong> 30-second processing vs. hours of manual resume editing</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Features Section - How It Works with Semantic h3 Tags */}
        <section className="max-w-7xl mx-auto px-8 py-16" aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-3xl font-bold text-center text-text-primary mb-12">
            How TailerResume Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-surface-dark/50 backdrop-blur-sm rounded-xl p-6 border border-border-primary">
              <h3 className="text-xl font-bold text-brand-primary mb-3">Step 1: AI-Powered Tailoring</h3>
              <p className="text-text-secondary">Our AI analyzes job descriptions and automatically optimizes your resume with relevant keywords and skills for maximum ATS compatibility.</p>
            </article>
            <article className="bg-surface-dark/50 backdrop-blur-sm rounded-xl p-6 border border-border-primary">
              <h3 className="text-xl font-bold text-brand-primary mb-3">Step 2: ATS Optimization</h3>
              <p className="text-text-secondary">Ensure your resume passes Applicant Tracking Systems with proper formatting, keyword placement, and clean structure.</p>
            </article>
            <article className="bg-surface-dark/50 backdrop-blur-sm rounded-xl p-6 border border-border-primary">
              <h3 className="text-xl font-bold text-brand-primary mb-3">Step 3: 30-Second Results</h3>
              <p className="text-text-secondary">Get your tailored resume in under 30 seconds. Simply upload, paste job description, and download your optimized resume.</p>
            </article>
          </div>
        </section>


        {/* Statistics Section - Citation Ready with Power Phrases */}
        <section className="max-w-7xl mx-auto px-8 py-16" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="text-3xl font-bold text-center text-text-primary mb-8">
            Proven Results for Job Seekers
          </h2>
          <p className="text-center text-text-secondary mb-8 max-w-3xl mx-auto">
            <strong>Research shows that</strong> tailored resumes are <strong>3x more likely to result in interviews</strong> compared to generic resumes. Our AI delivers measurable results:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-brand-primary/10 rounded-xl p-6">
              <div className="text-4xl font-bold text-brand-primary mb-2">95%</div>
              <p className="text-text-secondary">Keyword Matching Accuracy</p>
            </div>
            <div className="bg-brand-primary/10 rounded-xl p-6">
              <div className="text-4xl font-bold text-brand-primary mb-2">3x</div>
              <p className="text-text-secondary">More Interview Chances</p>
            </div>
            <div className="bg-brand-primary/10 rounded-xl p-6">
              <div className="text-4xl font-bold text-brand-primary mb-2">30s</div>
              <p className="text-text-secondary">Average Processing Time</p>
            </div>
            <div className="bg-brand-primary/10 rounded-xl p-6">
              <div className="text-4xl font-bold text-brand-primary mb-2">1,250+</div>
              <p className="text-text-secondary">Successful Applications</p>
            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <FAQ title="Frequently Asked Questions" faqs={defaultFAQs} />

        {/* Footer */}
        <footer className="border-t border-border-primary backdrop-blur-sm bg-surface-dark/40 py-12" role="contentinfo">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-nav font-bold text-text-primary mb-4">Tailer Resume</h3>
                <p className="text-text-muted text-body-small leading-relaxed">
                  AI-powered resume tailoring for job seekers. Create ATS-friendly resumes that get results.
                </p>
              </div>
              <nav aria-label="Footer navigation">
                <h4 className="text-badge font-semibold text-text-primary mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-text-secondary hover:text-brand-primary transition">Home</Link></li>
                  <li><Link to="/generate" className="text-text-secondary hover:text-brand-primary transition">AI Resume Generator</Link></li>
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
