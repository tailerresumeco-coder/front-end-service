import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { uploadResumeAndJDLegacy, checkATSScore } from "../services/resumeService";


import { transformBackendResponse, isResumeValid } from "../utils/DataTransformer";


export default function ProcessingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setResume, setGeneratedResume, uploadedResume, jobDescription, setATSScoreData } = useResume();


  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const apiCalledRef = useRef(false);
  
  // Get mode from navigation state (default to 'tailor')
  const mode = location.state?.mode || 'tailor';

  // Immediate redirect if missing data


  useEffect(() => {
    if (!uploadedResume || !jobDescription) {
      navigate("/tailor-resume", {
        state: { error: "Session expired. Please upload your resume again." }
      });
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

        let response;
        
        if (mode === 'ats-check') {
          // Call ATS score check API
          response = await checkATSScore(uploadedResume, jobDescription, {
            signal: controller.signal,
          });
          
          clearInterval(animationInterval);
          clearTimeout(timeoutId);
          
          // Store ATS score data in context
          setATSScoreData(response.data.data);
          
          // Quick final fill to 100%
          setProgress(100);
          
          // Navigate to ATS score result screen
          setTimeout(() => {
            navigate("/ats-score-result");
          }, 600);
        } else {
          // Call full tailor API (existing behavior)
          response = await uploadResumeAndJDLegacy(uploadedResume, jobDescription, {
            signal: controller.signal,
          });

          clearInterval(animationInterval);
          clearTimeout(timeoutId);

          const transformedResume = transformBackendResponse(response.data.data);

          if (!isResumeValid(transformedResume)) {
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
        }




      } catch (err) {
        clearInterval(animationInterval);
        clearTimeout(timeoutId);

        console.error("❌ Processing error:", err);
        setError(
          err.name === "AbortError"
            ? "Processing took too long. Please try again."
            : "Something went wrong. Please try again."
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
        <Helmet><meta name="robots" content="noindex,nofollow" /></Helmet>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark px-4">
          <div className="text-center bg-surface-dark-mid border border-border-primary p-10 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">Processing Failed</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">{error}</p>
            <button
              onClick={() => navigate(mode === 'ats-check' ? '/ats-score' : '/tailor-resume')}
              className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-8 py-3 rounded-button font-semibold hover:shadow-lg hover:shadow-brand-primary/30 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark px-4">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              {mode === 'ats-check' ? 'Analyzing Your Resume' : 'Tailoring Your Resume'}
            </h2>
            <p className="text-text-secondary">
              We're carefully analyzing the job description and optimizing your experience
            </p>
            <p className="text-text-muted text-sm mt-3">
              This can take 15–30 seconds for the best results. Please wait…
            </p>
          </div>

          {/* Card */}
          <div className="bg-surface-dark-mid border border-border-primary rounded-2xl p-8 sm:p-10 relative overflow-hidden">

            {/* Skeleton header */}
            <div className="text-center mb-8">
              <div className="h-10 bg-surface-dark-light rounded-lg w-64 mx-auto mb-3 animate-pulse"></div>
              <div className="h-4 bg-surface-dark-light rounded w-48 mx-auto animate-pulse"></div>
            </div>

            {/* Progress bar */}
            <div className="relative h-5 bg-surface-dark-light rounded-full overflow-hidden mb-8">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-1000 ease-out flex items-center justify-end pr-3 rounded-full"
                style={{ width: `${progress}%` }}
              >
                <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Animated resume lines */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-3.5 bg-surface-dark-light rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-surface-dark rounded-full transition-all duration-[1500ms] ease-out"
                    style={{ width: progress > 12 * i ? '100%' : progress > 10 * i ? `${(progress - 10 * i) * 10}%` : '0%' }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 opacity-50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-2.5 bg-surface-dark-light rounded overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-surface-dark transition-all duration-[2000ms]"
                    style={{ width: progress > 30 + i * 15 ? '80%' : '0%' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-text-muted text-sm mt-6">
            Advanced AI processing in progress…
          </p>
        </div>
      </div>
    </>
  );
}
