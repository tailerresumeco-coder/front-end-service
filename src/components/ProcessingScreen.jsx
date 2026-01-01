import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { uploadResumeAndJD } from "../services/resumeService";
import { transformBackendResponse, isResumeValid } from "../utils/DataTransformer";

export default function ProcessingScreen() {
  const navigate = useNavigate();
  const { setResume, setGeneratedResume, uploadedResume, jobDescription } = useResume();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if data is missing
    if (!uploadedResume || !jobDescription) {
      console.warn("Missing resume or job description");
      navigate("/");
      return;
    }

    const generateResume = async () => {
      try {
        console.log("📤 Sending to backend...");
        
        const response = await uploadResumeAndJD(
          uploadedResume,
          jobDescription
        );

        console.log("📥 Backend response:", response.data);

        // Transform backend response to internal schema
        const transformedResume = transformBackendResponse(response.data.response);

        console.log("✅ Transformed resume:", transformedResume);

        // Validate
        if (!isResumeValid(transformedResume)) {
          console.error("❌ Validation failed. Resume object:", transformedResume);
          setError("Resume validation failed. Missing required fields.");
          return;
        }

        console.log("✔️ Validation passed!");

        // Store in context
        setResume(transformedResume);
        setGeneratedResume(transformedResume);

        // Navigate to builder
        navigate("/resume-builder");
      } catch (err) {
        console.error("❌ Resume generation error:", err);
        setError(err.message || "Failed to generate resume");
      }
    };

    generateResume();
  }, [uploadedResume, jobDescription, navigate, setResume, setGeneratedResume]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Processing Resume</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <p className="mt-4 text-lg text-gray-700">
          Processing your resume...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This may take a few seconds
        </p>
      </div>
    </div>
  );
}