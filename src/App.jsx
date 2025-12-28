// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import LandingPage from "./components/LandingPage";




export default function App() {
  return (
 <Router>
   <Routes>
     <Route path="/" element={<LandingPage />} />
     <Route path="/generate" element={<Main />} />
     {/* <Route path="/preview" element={<ResumePreview />} />
     <Route path="/resume-builder" element={<ResumeBuilder />} />
     <Route path="/default-template" element={<DefaultTemplate />} /> */}
   </Routes>
 </Router>

   

    
  );
}
