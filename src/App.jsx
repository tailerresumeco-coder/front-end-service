// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";

import Main from "./components/Main";
import LandingPage from "./components/LandingPage";
import ProcessingScreen from "./components/ProcessingScreen";
import ResumeBuilder from "./components/ResumeBuilder";
import { ResumeProvider } from "./context/ResumeContext";
import APIKeysManagement from "./components/APIKeysManagement";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <ResumeProvider>
        <Router>
          {/* 👇 MUST be inside Router */}
          <AnalyticsTracker />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generate" element={<Main />} />
            <Route path="/processing" element={<ProcessingScreen />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/api-keys" element={<APIKeysManagement />} />
          </Routes>
        </Router>
      </ResumeProvider>
    </HelmetProvider>
  );
}
