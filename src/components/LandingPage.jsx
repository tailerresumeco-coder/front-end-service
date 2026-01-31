import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>AI Resume Tailoring Tool - ATS Checker & Parser</title>
        <meta name="description" content="Tailor resumes with AI to match job descriptions. Get ATS scores, parse resumes, and build professional resumes that increase interview chances for job seekers." />
        <link rel="canonical" href="https://tailer-resume.com/" />
        <meta property="og:title" content="AI Resume Tailoring Tool - ATS Checker & Parser" />
        <meta property="og:description" content="Tailor resumes with AI to match job descriptions. Get ATS scores, parse resumes, and build professional resumes that increase interview chances for job seekers." />
        <meta property="og:url" content="https://tailer-resume.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark text-text-primary overflow-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-dot border-2 border-brand-primary flex items-center justify-center">
            <div className="w-3 h-3 bg-brand-primary rounded-dot"></div>
          </div>
          <span className="text-nav font-semibold">Tailer Resume</span>
        </div>
        {/* <div className="flex gap-8 items-center">
          <button className="hover:text-brand-primary transition">Product</button>
          <button className="hover:text-brand-primary transition">Pricing</button>
          <button className="hover:text-brand-primary transition">Login</button>
        </div> */}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 bg-brand-primary rounded-dot"></div>
              <span className="text-badge text-brand-primary font-medium">AI-native resume generation</span>
            </div>

            {/* Heading */}
            <h1 className="text-heading font-bold mb-6 leading-tight">
              Your resume, <span className="text-brand-primary">rewired by</span>
              <br />
              <span className="text-brand-primary">intelligence</span>.
            </h1>

            {/* Description */}
            <p className="text-text-secondary text-body mb-8 leading-relaxed">
              Smarter than templates. Powered by intelligence.
            </p>
            <p className="text-text-muted text-body-small mb-10 leading-relaxed">
              Turn your experience into a living, learning resume. Understands your story, adapts to every role, and keeps improving with every application.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
              <Link to="/generate" className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-button font-semibold hover:shadow-lg hover:shadow-brand-primary/50 transition transform hover:scale-105 inline-block">
                Tailor my Resume
              </Link>
              <Link to="/build" className="px-8 py-3 border border-border-secondary rounded-button font-semibold hover:border-brand-primary hover:text-brand-primary transition flex items-center gap-2 inline-block">
               Buid my Resume<ArrowRight size={18} />
              </Link>
            </div>

          </div>

          {/* Right Side - Animated Background */}
          <div className="relative h-96 flex items-center justify-center">
            {/* Glowing rectangle with particles */}
            <div className="relative w-64 h-80">
              {/* Main rectangle */}
              <div className="absolute inset-0 border border-border-primary rounded-card backdrop-blur-sm bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10"></div>

              {/* Animated particles */}
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot top-20 left-12 animate-pulse"></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot top-12 right-16 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot bottom-24 left-8 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot bottom-16 right-12 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot top-1/3 right-6 animate-pulse" style={{ animationDelay: '0.8s' }}></div>
              <div className="absolute w-2 h-2 bg-brand-primary rounded-dot bottom-1/3 left-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute w-1.5 h-1.5 bg-brand-primary-hover rounded-dot top-1/2 right-8 animate-pulse" style={{ animationDelay: '1.2s' }}></div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-card blur-2xl opacity-50"></div>
            </div>

            {/* Background gradient orbs */}
            <div className="absolute top-10 right-10 w-48 h-48 bg-brand-primary/10 rounded-dot blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-brand-secondary/10 rounded-dot blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border-primary backdrop-blur-sm bg-surface-dark/40 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-nav font-bold text-text-primary mb-4">Tailer Resume</h3>
              <p className="text-text-muted text-body-small leading-relaxed">
                AI-powered resume tailoring for job seekers. Create ATS-friendly resumes that get results.
              </p>
            </div>
            <div>
              <h4 className="text-badge font-semibold text-text-primary mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-text-secondary hover:text-brand-primary transition">Home</Link></li>
                <li><Link to="/generate" className="text-text-secondary hover:text-brand-primary transition">AI Resume Generator</Link></li>
                {/* <li><Link to="/resume-builder" className="text-text-secondary hover:text-brand-primary transition">Resume Builder</Link></li> */}
              </ul>
            </div>
            {/* <div>
              <h4 className="text-badge font-semibold text-text-primary mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="https://tailer-resume.com/sitemap.xml" className="text-text-secondary hover:text-brand-primary transition">Sitemap</a></li>
                <li><a href="https://tailer-resume.com/robots.txt" className="text-text-secondary hover:text-brand-primary transition">Robots.txt</a></li>
              </ul>
            </div> */}
          </div>
          <div className="border-t border-border-primary mt-8 pt-8 text-center">
            <p className="text-text-subtle text-badge">
              © 2026 Tailer Resume. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
