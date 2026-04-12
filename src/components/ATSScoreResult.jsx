import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';

export default function ATSScoreResult() {
  const navigate = useNavigate();
  const { atsScoreData } = useResume();

  if (!atsScoreData) {
    return (
      <div className="flex items-center justify-center py-32 px-4">
        <div className="text-center bg-surface-dark-mid border border-border-primary p-10 rounded-2xl max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-border-primary flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">No ATS Score Data</h2>
          <p className="text-text-muted mb-8">Please upload your resume and job description to check your ATS score.</p>
          <button
            onClick={() => navigate('/ats-score')}
            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-8 py-3 rounded-button font-semibold hover:shadow-lg hover:shadow-brand-primary/30 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const {
    ats_score,
    keywords_in_jd,
    existing_keywords_in_resume,
    missing_keywords,
    semantic_mismatch,
    improvement_suggestions,
    eligibility_assessment,
  } = atsScoreData;

  const score       = ats_score?.score || 0;
  const explanation = ats_score?.explanation || '';

  const scoreColor    = score >= 80 ? 'text-green-400'  : score >= 60 ? 'text-yellow-400' : 'text-red-400';
  const progressColor = score >= 80 ? 'bg-green-500'    : score >= 60 ? 'bg-yellow-500'   : 'bg-red-500';

  // Reusable dark card
  const Card = ({ children, className = '' }) => (
    <div className={`bg-surface-dark-mid border border-border-primary rounded-2xl p-6 sm:p-8 mb-6 ${className}`}>
      {children}
    </div>
  );

  // Reusable section heading
  const CardTitle = ({ icon, children }) => (
    <h3 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2">
      <span className="text-brand-primary">{icon}</span>
      {children}
    </h3>
  );

  // Keyword badge
  const Badge = ({ children, color = 'cyan' }) => {
    const colors = {
      cyan:   'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
      purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
      green:  'bg-green-500/15 text-green-400 border-green-500/25',
      red:    'bg-red-500/15 text-red-400 border-red-500/25',
      orange: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
      yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[color]}`}>
        {children}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>ATS Score Analysis | Tailer Resume</title>
        <meta name="description" content="View your ATS compatibility score and get recommendations to improve your resume for specific job descriptions." />
        <link rel="canonical" href="https://tailerresume.com/ats-score-result" />
        <meta name="robots" content="noindex,nofollow" />
        <meta property="og:title" content="ATS Score Analysis | Tailer Resume" />
        <meta property="og:description" content="View your ATS compatibility score and get recommendations to improve your resume for specific job descriptions." />
        <meta property="og:image" content="https://tailerresume.com/tailer-resume-logo-1.svg" />
        <meta property="og:url" content="https://tailerresume.com/ats-score-result" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Page title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">ATS Score Analysis</h1>
          <p className="text-text-muted">See how well your resume matches the job description</p>
        </div>

        {/* Score card */}
        <Card>
          <h2 className="text-xl font-semibold text-text-primary text-center mb-6">Compatibility Score</h2>

          <div className="text-center mb-6">
            <div className={`text-7xl font-bold ${scoreColor} mb-1`}>{score}%</div>
            <p className="text-text-muted text-xs uppercase tracking-widest">Current Score</p>
          </div>

          {explanation && (
            <div className="bg-brand-primary/10 border-l-4 border-brand-primary p-4 rounded-r-lg mb-6 text-left">
              <p className="text-text-secondary italic">"{explanation}"</p>
            </div>
          )}

          <div>
            <div className="flex justify-between text-xs text-text-muted mb-2">
              <span>Match Score</span>
              <span>{score}%</span>
            </div>
            <div className="h-3 bg-surface-dark-light rounded-full overflow-hidden">
              <div
                className={`h-full ${progressColor} transition-all duration-1000 rounded-full`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Eligibility Assessment */}
        {eligibility_assessment && (
          <Card>
            <CardTitle icon="✓">Eligibility Assessment</CardTitle>
            <div className="space-y-4">
              {eligibility_assessment.education && (
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-0.5 text-sm">•</span>
                  <div>
                    <span className="font-medium text-text-primary">Education: </span>
                    <span className="text-text-secondary">{eligibility_assessment.education.status}</span>
                    <p className="text-xs text-text-muted mt-0.5">{eligibility_assessment.education.explanation}</p>
                  </div>
                </div>
              )}
              {eligibility_assessment.experience && (
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-0.5 text-sm">•</span>
                  <div>
                    <span className="font-medium text-text-primary">Experience: </span>
                    <span className="text-text-secondary">{eligibility_assessment.experience.status}</span>
                    <p className="text-xs text-text-muted mt-0.5">{eligibility_assessment.experience.explanation}</p>
                  </div>
                </div>
              )}
              {eligibility_assessment.overall && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="font-medium text-green-400">
                    Overall: {eligibility_assessment.overall.assessment}
                    <span className="text-xs text-green-500/70 ml-2">({eligibility_assessment.overall.confidence_level} confidence)</span>
                  </p>
                  <p className="text-sm text-text-muted mt-1">{eligibility_assessment.overall.reasoning}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Keywords in JD */}
        {keywords_in_jd && (
          <Card>
            <CardTitle icon="📋">Keywords in Job Description</CardTitle>
            {keywords_in_jd.technical_skills?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {keywords_in_jd.technical_skills.map((kw, i) => <Badge key={i} color="cyan">{kw}</Badge>)}
                </div>
              </div>
            )}
            {keywords_in_jd.soft_skills?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {keywords_in_jd.soft_skills.map((kw, i) => <Badge key={i} color="purple">{kw}</Badge>)}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Existing Keywords */}
        {existing_keywords_in_resume && (
          <Card>
            <CardTitle icon="✓">Keywords Found in Your Resume</CardTitle>
            {existing_keywords_in_resume.technical_skills?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {existing_keywords_in_resume.technical_skills.map((kw, i) => <Badge key={i} color="green">✓ {kw}</Badge>)}
                </div>
              </div>
            )}
            {existing_keywords_in_resume.soft_skills?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {existing_keywords_in_resume.soft_skills.map((kw, i) => <Badge key={i} color="green">✓ {kw}</Badge>)}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Missing Keywords */}
        {missing_keywords && (
          <Card>
            <CardTitle icon="⚠">Missing Keywords</CardTitle>
            {missing_keywords.critical?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Critical — High Priority</h4>
                <div className="flex flex-wrap gap-2">
                  {missing_keywords.critical.map((kw, i) => <Badge key={i} color="red">✗ {kw}</Badge>)}
                </div>
              </div>
            )}
            {missing_keywords.important?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">Important — Medium Priority</h4>
                <div className="flex flex-wrap gap-2">
                  {missing_keywords.important.map((kw, i) => <Badge key={i} color="orange">! {kw}</Badge>)}
                </div>
              </div>
            )}
            {missing_keywords.optional?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">Optional — Low Priority</h4>
                <div className="flex flex-wrap gap-2">
                  {missing_keywords.optional.map((kw, i) => <Badge key={i} color="yellow">○ {kw}</Badge>)}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Semantic Mismatch */}
        {semantic_mismatch?.length > 0 && (
          <Card>
            <CardTitle icon="↔">Semantic Mismatches</CardTitle>
            <div className="space-y-3">
              {semantic_mismatch.map((m, i) => (
                <div key={i} className="p-4 bg-yellow-500/8 border border-yellow-500/15 rounded-xl">
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
                    <span className="text-text-secondary">Resume: <span className="font-medium text-text-primary">{m.resume_term}</span></span>
                    <span className="text-text-muted">→</span>
                    <span className="text-text-secondary">JD: <span className="font-medium text-text-primary">{m.jd_term}</span></span>
                  </div>
                  <p className="text-sm text-text-secondary"><span className="font-medium">Suggestion:</span> {m.suggestion}</p>
                  <p className="text-xs text-text-muted mt-1">Impact: {m.impact}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Improvement Suggestions */}
        {improvement_suggestions && (
          <Card>
            <CardTitle icon="💡">Improvement Suggestions</CardTitle>

            {improvement_suggestions.content_additions?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Content Additions</h4>
                <ul className="space-y-2">
                  {improvement_suggestions.content_additions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand-primary mt-0.5 text-sm">•</span>
                      <div>
                        <p className="text-text-secondary text-sm">{item.suggestion}</p>
                        <p className="text-xs text-text-muted">Location: {item.location} · Priority: {item.priority}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {improvement_suggestions.terminology_updates?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Terminology Updates</h4>
                <ul className="space-y-2">
                  {improvement_suggestions.terminology_updates.map((item, i) => (
                    <li key={i} className="p-3 bg-surface-dark-light rounded-lg">
                      <p className="text-sm text-text-muted line-through">{item.current}</p>
                      <p className="text-sm text-green-400 font-medium">{item.suggested}</p>
                      <p className="text-xs text-text-muted mt-1">{item.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {improvement_suggestions.priority_actions?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Priority Actions</h4>
                <ul className="space-y-2">
                  {improvement_suggestions.priority_actions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5 text-sm">{i + 1}.</span>
                      <div>
                        <p className="text-text-secondary text-sm">{item.action}</p>
                        <p className="text-xs text-text-muted">Impact: {item.impact} · Effort: {item.effort}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {improvement_suggestions.formatting?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Formatting Tips</h4>
                <ul className="space-y-1">
                  {improvement_suggestions.formatting.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-text-muted mt-0.5 text-sm">•</span>
                      <p className="text-text-secondary text-sm">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <p className="text-center text-text-muted text-sm mt-4">
          Our AI will optimize your resume to match the job description and improve your ATS score.
        </p>

      </div>
    </>
  );
}
