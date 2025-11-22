// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import { ResumeProvider } from "./context/ResumeContext";
import ResumeBuilder from "./components/ResumeBuilder";




export default function App() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
}
