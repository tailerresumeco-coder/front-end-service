import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="border-t border-border-primary bg-surface-dark/40 backdrop-blur-sm py-12"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-nav font-bold text-text-primary mb-4">Tailer Resume</h3>
            <p className="text-text-muted text-body-small leading-relaxed">
              AI-powered resume tailoring for job seekers. Create ATS-friendly resumes that get results.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h4 className="text-badge font-semibold text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/"                       className="text-text-secondary hover:text-brand-primary transition text-badge">Home</Link></li>
              <li><Link to="/tailor-resume"           className="text-text-secondary hover:text-brand-primary transition text-badge">Tailor Resume</Link></li>
              <li><Link to="/jobs"                    className="text-text-secondary hover:text-brand-primary transition text-badge">Jobs</Link></li>
              <li><Link to="/ats-score"               className="text-text-secondary hover:text-brand-primary transition text-badge">Check ATS Score</Link></li>
              <li><Link to="/how-to-tailor-resume"    className="text-text-secondary hover:text-brand-primary transition text-badge">How to Tailor Resume</Link></li>
              <li><Link to="/ats-optimization-guide"  className="text-text-secondary hover:text-brand-primary transition text-badge">ATS Optimization Guide</Link></li>
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h4 className="text-badge font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="https://tailerresume.com/sitemap.xml" className="text-text-secondary hover:text-brand-primary transition text-badge">Sitemap</a></li>
              <li><a href="https://tailerresume.com/robots.txt"  className="text-text-secondary hover:text-brand-primary transition text-badge">Robots.txt</a></li>
            </ul>
          </nav>

        </div>

        <div className="border-t border-border-primary mt-8 pt-8 text-center">
          <p className="text-text-subtle text-badge">© 2026 Tailer Resume. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
