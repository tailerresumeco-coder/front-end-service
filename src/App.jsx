// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";

import Main from "./components/Main";
import LandingPage from "./components/LandingPage";
import ProcessingScreen from "./components/ProcessingScreen";
import ResumeBuilder from "./components/ResumeBuilder";
import ATSScoreResult from "./components/ATSScoreResult";
import { ResumeProvider } from "./context/ResumeContext";
import { JobProvider } from "./context/JobContext";
import APIKeysManagement from "./components/APIKeysManagement";
import HowToTailorResume from "./pages/HowToTailorResume";
import ATSOptimizationGuide from "./pages/ATSOptimizationGuide";
import ATSScoreInput from "./components/ATSScoreInput";
import UserManagement from "./components/UserManagement";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";


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
        <JobProvider>
        <Router>
          {/* Analytics Tracker - MUST be inside Router */}
          <AnalyticsTracker />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/processing" element={<ProcessingScreen />} />

            <Route path="/ats-score-result" element={<ATSScoreResult />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/api-keys" element={<APIKeysManagement />} />

            <Route path="/tailor-resume" element={<Main />} />
            <Route path="/ats-score" element={<ATSScoreInput />} />

            <Route path="/how-to-tailor-resume" element={<HowToTailorResume />} />
            <Route path="/ats-optimization-guide" element={<ATSOptimizationGuide />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/jobs"            element={<JobsPage />} />
            <Route path="/jobs/:id"        element={<JobDetailPage />} />
          </Routes>
        </Router>
        </JobProvider>
      </ResumeProvider>
    </HelmetProvider>
  );
}
