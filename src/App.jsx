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
import Layout from "./components/Layout";
import APIKeysManagement from "./components/APIKeysManagement";
import HowToTailorResume from "./pages/HowToTailorResume";
import ATSOptimizationGuide from "./pages/ATSOptimizationGuide";
import ATSScoreInput from "./components/ATSScoreInput";
import UserManagement from "./components/UserManagement";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
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

// Wrap a page in the shared Layout
function L({ page: Page }) {
  return <Layout><Page /></Layout>;
}

export default function App() {
  return (
    <HelmetProvider>
      <ResumeProvider>
        <JobProvider>
          <Router>
            <AnalyticsTracker />

            <Routes>
              {/* ── Auth — no layout ── */}
              <Route path="/sign-up"  element={<Signup />} />
              <Route path="/login"    element={<Login />} />

              {/* ── Tool flows — no layout (full-screen) ── */}
              <Route path="/processing"    element={<ProcessingScreen />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />

              {/* ── Content pages — wrapped in Layout ── */}
              <Route path="/"                      element={<L page={LandingPage} />} />
              <Route path="/tailor-resume"          element={<L page={Main} />} />
              <Route path="/ats-score"              element={<L page={ATSScoreInput} />} />
              <Route path="/ats-score-result"       element={<L page={ATSScoreResult} />} />
              <Route path="/how-to-tailor-resume"   element={<L page={HowToTailorResume} />} />
              <Route path="/ats-optimization-guide" element={<L page={ATSOptimizationGuide} />} />
              <Route path="/api-keys"               element={<L page={APIKeysManagement} />} />
              <Route path="/user-management"        element={<L page={UserManagement} />} />
              <Route path="/profile"                element={<L page={Profile} />} />
              <Route path="/jobs"                   element={<L page={JobsPage} />} />
              <Route path="/jobs/:id"               element={<L page={JobDetailPage} />} />
            </Routes>
          </Router>
        </JobProvider>
      </ResumeProvider>
    </HelmetProvider>
  );
}
