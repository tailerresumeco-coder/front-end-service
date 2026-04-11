import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',              label: 'Home'   },
  { to: '/tailor-resume', label: 'Tailor' },
  { to: '/jobs',          label: 'Jobs'   },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => pathname === to;

  const linkClass = (to) =>
    `text-badge font-medium transition ${
      isActive(to) ? 'text-brand-primary' : 'text-text-secondary hover:text-brand-primary'
    }`;

  return (
    <header
      className="border-b border-border-primary backdrop-blur-sm bg-surface-dark/40 sticky top-0 z-30"
      role="banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-dot border-2 border-brand-primary flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-3 h-3 bg-brand-primary rounded-dot" />
          </div>
          <span className="text-nav font-bold text-text-primary">Tailer Resume</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={linkClass(to)}>{label}</Link>
          ))}
        </nav>

        {/* Right — profile + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="w-9 h-9 rounded-full border border-cyan-400/40 flex items-center justify-center bg-white/5 hover:bg-white/10 transition"
            aria-label="Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-cyan-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-border-primary bg-surface-dark/95 backdrop-blur-sm px-4 py-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive(to)
                  ? 'text-brand-primary bg-brand-primary/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
