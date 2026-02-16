import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';

/**
 * ATSScoreResult - Display ATS score analysis with option to tailor resume
 */
export default function ATSScoreResult() {
  const navigate = useNavigate();
  const { atsScoreData } = useResume();

  // Redirect if no ATS score data
  if (!atsScoreData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center bg-white p-10 rounded-xl shadow-xl max-w-md">
          <div className="text-6xl mb-6">📄</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">No ATS Score Data</h2>
          <p className="text-gray-600 mb-8">Please upload your resume and job description to check your ATS score.</p>
          <button
            onClick={() => navigate("/generate")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Extract data from the response structure
  const {
    ats_score,
    keywords_in_jd,
    existing_keywords_in_resume,
    missing_keywords,
    semantic_mismatch,
    improvement_suggestions,
    eligibility_assessment
  } = atsScoreData;

  const score = ats_score?.score || 0;
  const explanation = ats_score?.explanation || '';

  // Calculate score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Calculate progress bar color
  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleTailorNow = () => {
    navigate("/processing", { state: { mode: 'tailor' } });
  };

  const handleUploadDifferent = () => {
    navigate("/generate");
  };

  return (
    <>
      <Helmet>
        <title>ATS Score Analysis | Tailer Resume</title>
        <meta name="description" content="View your ATS compatibility score and get recommendations to improve your resume for specific job descriptions." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">ATS Score Analysis</h1>
            <p className="text-gray-400 text-lg">
              See how well your resume matches the job description
            </p>
          </div>

          {/* Main Score Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Compatibility Score</h2>
              
              {/* Score Display */}
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
                  {score}%
                </div>
                <p className="text-gray-500 text-sm uppercase tracking-wider">Current Score</p>
              </div>

              {/* Explanation */}
              {explanation && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-left">
                  <p className="text-gray-700 italic">"{explanation}"</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Match Score</span>
                <span>{score}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(score)} transition-all duration-1000`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Eligibility Assessment */}
          {eligibility_assessment && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                Eligibility Assessment
              </h3>
              <div className="space-y-4">
                {eligibility_assessment.education && (
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <div>
                      <span className="font-medium text-gray-700">Education: </span>
                      <span className="text-gray-600">{eligibility_assessment.education.status}</span>
                      <p className="text-sm text-gray-500">{eligibility_assessment.education.explanation}</p>
                    </div>
                  </div>
                )}
                {eligibility_assessment.experience && (
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <div>
                      <span className="font-medium text-gray-700">Experience: </span>
                      <span className="text-gray-600">{eligibility_assessment.experience.status}</span>
                      <p className="text-sm text-gray-500">{eligibility_assessment.experience.explanation}</p>
                    </div>
                  </div>
                )}
                {eligibility_assessment.overall && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">
                      Overall: {eligibility_assessment.overall.assessment} 
                      <span className="text-sm text-green-600 ml-2">({eligibility_assessment.overall.confidence_level} confidence)</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{eligibility_assessment.overall.reasoning}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Keywords in JD */}
          {keywords_in_jd && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Keywords in Job Description
              </h3>
              {keywords_in_jd.technical_skills && keywords_in_jd.technical_skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Technical Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {keywords_in_jd.technical_skills.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {keywords_in_jd.soft_skills && keywords_in_jd.soft_skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Soft Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {keywords_in_jd.soft_skills.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Existing Keywords in Resume */}
          {existing_keywords_in_resume && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Keywords Found in Your Resume
              </h3>
              {existing_keywords_in_resume.technical_skills && existing_keywords_in_resume.technical_skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Technical Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {existing_keywords_in_resume.technical_skills.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        ✓ {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {existing_keywords_in_resume.soft_skills && existing_keywords_in_resume.soft_skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Soft Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {existing_keywords_in_resume.soft_skills.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        ✓ {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Missing Keywords */}
          {missing_keywords && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Missing Keywords
              </h3>
              {missing_keywords.critical && missing_keywords.critical.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-red-700 mb-2">Critical (High Priority):</h4>
                  <div className="flex flex-wrap gap-2">
                    {missing_keywords.critical.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        ✗ {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {missing_keywords.important && missing_keywords.important.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-orange-700 mb-2">Important (Medium Priority):</h4>
                  <div className="flex flex-wrap gap-2">
                    {missing_keywords.important.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        ! {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {missing_keywords.optional && missing_keywords.optional.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-yellow-700 mb-2">Optional (Low Priority):</h4>
                  <div className="flex flex-wrap gap-2">
                    {missing_keywords.optional.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        ○ {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Semantic Mismatch */}
          {semantic_mismatch && semantic_mismatch.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔄</span>
                Semantic Mismatches
              </h3>
              <div className="space-y-4">
                {semantic_mismatch.map((mismatch, idx) => (
                  <div key={idx} className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Resume: <span className="font-medium">{mismatch.resume_term}</span></span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-600">JD: <span className="font-medium">{mismatch.jd_term}</span></span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Suggestion:</span> {mismatch.suggestion}</p>
                    <p className="text-xs text-gray-500">Impact: {mismatch.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Suggestions */}
          {improvement_suggestions && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Improvement Suggestions
              </h3>
              
              {improvement_suggestions.content_additions && improvement_suggestions.content_additions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Content Additions:</h4>
                  <ul className="space-y-2">
                    {improvement_suggestions.content_additions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <div>
                          <p className="text-gray-700">{item.suggestion}</p>
                          <p className="text-xs text-gray-500">Location: {item.location} | Priority: {item.priority}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {improvement_suggestions.terminology_updates && improvement_suggestions.terminology_updates.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Terminology Updates:</h4>
                  <ul className="space-y-2">
                    {improvement_suggestions.terminology_updates.map((item, idx) => (
                      <li key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 line-through">{item.current}</p>
                        <p className="text-sm text-green-700 font-medium">{item.suggested}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {improvement_suggestions.priority_actions && improvement_suggestions.priority_actions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Priority Actions:</h4>
                  <ul className="space-y-2">
                    {improvement_suggestions.priority_actions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1 font-bold">{idx + 1}.</span>
                        <div>
                          <p className="text-gray-700">{item.action}</p>
                          <p className="text-xs text-gray-500">Impact: {item.impact} | Effort: {item.effort}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {improvement_suggestions.formatting && improvement_suggestions.formatting.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Formatting Tips:</h4>
                  <ul className="space-y-1">
                    {improvement_suggestions.formatting.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <p className="text-gray-600 text-sm">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleTailorNow}
              className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-hover hover:to-brand-secondary-hover text-white font-semibold rounded-button transition-all duration-300 shadow-lg hover:shadow-brand-primary/40"
            >
              Tailor Resume Now
            </button>
            <button
              onClick={handleUploadDifferent}
              className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-button transition-all duration-300"
            >
              Upload Different Resume
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-400 text-sm mt-8">
            Our AI will optimize your resume to match the job description and improve your ATS score.
          </p>
        </div>
      </div>
    </>
  );
}
