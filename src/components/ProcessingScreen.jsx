import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { uploadResumeAndJD } from "../services/resumeService";
import { transformBackendResponse, isResumeValid } from "../utils/DataTransformer";

export default function ProcessingScreen() {
  const navigate = useNavigate();
  const { setResume, setGeneratedResume, uploadedResume, jobDescription } = useResume();

  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const apiCalledRef = useRef(false);

  // Immediate redirect if missing data
  useEffect(() => {
    if (!uploadedResume || !jobDescription) {
      console.warn("Missing resume or job description");
      navigate("/");
    }
  }, [uploadedResume, jobDescription, navigate]);

  useEffect(() => {
    if (!uploadedResume || !jobDescription || apiCalledRef.current) return;

    apiCalledRef.current = true;

    let animationInterval;
    let timeoutId;

const startAdaptiveProgress = () => {
  setProgress(0);

  let baseProgress = 0;
  const startTime = Date.now();

  animationInterval = setInterval(() => {
    const elapsedSeconds = (Date.now() - startTime) / 1000;

    // Target curve: reaches ~90% around 70 seconds, but can accelerate if needed
    let targetProgress = 0;

    if (elapsedSeconds < 10) {
      targetProgress = elapsedSeconds * 3;              // 0–30% in first 10s
    } else if (elapsedSeconds < 30) {
      targetProgress = 30 + (elapsedSeconds - 10) * 2;  // 30–70% next 20s
    } else if (elapsedSeconds < 60) {
      targetProgress = 70 + (elapsedSeconds - 30) * 0.6; // Slow to 88%
    } else {
      targetProgress = 88 + (elapsedSeconds - 60) * 0.15; // Crawl to ~92–95%
      if (targetProgress > 92) targetProgress = 92;
    }

    // Smoothly move current progress toward target (feels natural)
    setProgress((prev) => {
      const diff = targetProgress - prev;
      // Move 20% of the way toward target each tick → smooth catching up
      return prev + diff * 0.2;
    });
  }, 500); // Update every 500ms for smoothness
};

    const generateResume = async () => {
      try {
        console.log("📤 Sending request to backend...");
        startAdaptiveProgress();

        // Optional: increase timeout to 90 seconds since processing is long
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 90000);

        const response = await uploadResumeAndJD(uploadedResume, jobDescription, {
          signal: controller.signal,
        });
        console.log("📥 Backend response received",response);

        clearInterval(animationInterval);
        clearTimeout(timeoutId);

        console.log("📥 Backend response received");

        const transformedResume = transformBackendResponse(response.data.data);

        if (!isResumeValid(transformedResume)) {
          console.error("❌ Validation failed", transformedResume);
          setError("Generated resume is incomplete. Please try again.");
          return;
        }

        // Quick final fill to 100%
        setProgress(100);

        setResume(transformedResume);
        setGeneratedResume(transformedResume);

        // Let user see 100% for a moment
        setTimeout(() => {
          navigate("/resume-builder");
        }, 600);

      } catch (err) {
        clearInterval(animationInterval);
        clearTimeout(timeoutId);

        console.error("❌ Processing error:", err);
        setError(
          err.name === "AbortError"
            ? "Processing took too long. Please try again."
            : err.message || "Failed to process resume. Please try again."
        );
      }
    };

    generateResume();

    return () => {
      clearInterval(animationInterval);
      clearTimeout(timeoutId);
    };
  }, [uploadedResume, jobDescription]);

  if (error) {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center bg-white p-10 rounded-xl shadow-xl max-w-md">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Processing Failed</h2>
          <p className="text-gray-700 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate("/generate")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </>
    );   
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Tailoring Your Resume
          </h2>
          <p className="text-lg text-gray-600">
            We're carefully analyzing the job description and optimizing your experience
          </p>
          <p className="text-sm text-gray-500 mt-4">
            This can take 50–90 seconds for the best results. Please wait...
          </p>
        </div>

        {/* Resume Card with Reveal Effect */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 relative overflow-hidden">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>

          {/* Main Progress Bar */}
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-8">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-1000 ease-out flex items-center justify-end pr-4"
              style={{ width: `${progress}%` }}
            >
              <span className="text-white text-sm font-bold">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Simulated Resume Content Lines - Reveal Gradually */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded-full overflow-hidden relative"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gray-300 transition-all duration-1500 ease-out"
                  style={{
                    width: progress > 12 * i ? "100%" : progress > 10 * i ? `${(progress - 10 * i) * 10}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Extra subtle lines for realism */}
          <div className="mt-8 space-y-3 opacity-60">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 bg-gray-100 rounded overflow-hidden relative">
                <div
                  className="absolute inset-y-0 left-0 bg-gray-200 transition-all duration-2000"
                  style={{ width: progress > 30 + i * 15 ? "80%" : "0%" }}
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Advanced AI processing in progress...
        </p>
      </div>
    </div>
  );
}