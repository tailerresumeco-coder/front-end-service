// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Main from "./components/Main";
import LandingPage from "./components/LandingPage";
import ProcessingScreen from "./components/ProcessingScreen";
import ResumeBuilder from "./components/ResumeBuilder";
import { ResumeProvider } from "./context/ResumeContext";

export default function App() {
  
  return (
    <HelmetProvider>
      <ResumeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generate" element={<Main />} />
            <Route path="/processing" element={<ProcessingScreen />} />

            <Route path="/resume-builder" element={<ResumeBuilder />} />
            {/* <Route path="/preview" element={<ResumePreview />} />
       <Route path="/default-template" element={<DefaultTemplate />} /> */}
          </Routes>
        </Router>
      </ResumeProvider>
    </HelmetProvider>
  );
}
