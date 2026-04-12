import { createContext, useContext, useState } from "react";

const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [generatedResume, setGeneratedResume] = useState(null);
  const [layoutPreference, setLayoutPreference] = useState("professional");
  const [detectedSectionOrder, setDetectedSectionOrder] = useState(null);
  const [atsScoreData, setATSScoreData] = useState(null);
  const [activeResume, setActiveResume] = useState(null);


  return (
    <ResumeContext.Provider
      value={{
        resume,
        setResume,
        uploadedResume,
        setUploadedResume,
        jobDescription,
        setJobDescription,
        selectedFormat,
        setSelectedFormat,
        generatedResume,
        setGeneratedResume,
        atsScoreData,
        setATSScoreData,
        activeResume,
        setActiveResume,
        layoutPreference,
        setLayoutPreference,
        detectedSectionOrder,
        setDetectedSectionOrder,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}
