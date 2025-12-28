import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';

export default function ProcessingScreen() {
  const navigate = useNavigate();
  const { uploadedResume, jobDescription, selectedFormat, setGeneratedResume } = useResume();

  useEffect(() => {
    if (!uploadedResume || !jobDescription || !selectedFormat) {
      navigate('/');
      return;
    }

    // Simulate processing
    const timer = setTimeout(() => {
      // Assume generated resume is ready
      setGeneratedResume({ /* mock generated resume */ });
      navigate('/resume');
    }, 2000); // 2 seconds for demo

    return () => clearTimeout(timer);
  }, [navigate, setGeneratedResume, uploadedResume, jobDescription, selectedFormat]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700">Processing your resume...</p>
      </div>
    </div>
  );
}
