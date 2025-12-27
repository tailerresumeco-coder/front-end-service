import { createContext, useContext, useState } from "react";
import mockResume from "../mockdata/mockdata";


const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(mockResume);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [generatedResume, setGeneratedResume] = useState(null);

  // Later replace mockResume with backend data

  return (
    <ResumeContext.Provider value={{
      resume,
      setResume,
      uploadedResume,
      setUploadedResume,
      jobDescription,
      setJobDescription,
      selectedFormat,
      setSelectedFormat,
      generatedResume,
      setGeneratedResume
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}
