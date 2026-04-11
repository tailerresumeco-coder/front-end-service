import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Main site layout — dark gradient bg + sticky Navbar + Footer.
 * Auth pages (Login, Signup), ProcessingScreen, and ResumeBuilder
 * are excluded and manage their own structure.
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark text-text-primary flex flex-col">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
