import { createContext, useContext, useState } from "react";
import mockResume from "../mockdata/mockdata";


const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(mockResume); 
  // Later replace mockResume with backend data

  return (
    <ResumeContext.Provider value={{ resume, setResume }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}
