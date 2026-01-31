import React from 'react';

/**
 * ATSScoreCard - Visual display of ATS score improvement
 */
function ATSScoreCard({ before, after, explanation }) {
  const improvement = after - before;
  const hasImprovement = before !== null && after !== null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-xl">📈</span> ATS Score Improvement
      </h3>

      {hasImprovement ? (
        <>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Before: {before}%</span>
                <span>After: {after}%</span>
              </div>
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                {/* Before score bar */}
                <div
                  className="absolute h-full bg-gray-400 rounded-full transition-all"
                  style={{ width: `${before}%` }}
                />
                {/* After score bar (overlay) */}
                <div
                  className="absolute h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all"
                  style={{ width: `${after}%` }}
                />
              </div>
            </div>
            <div className={`text-lg font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {improvement >= 0 ? '+' : ''}{improvement}%
            </div>
          </div>
          {explanation && (
            <p className="text-sm text-gray-600 italic">"{explanation}"</p>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm">ATS score data not available</p>
      )}
    </div>
  );
}

/**
 * ChangeSummaryCard - Display what was modified
 */
function ChangeSummaryCard({ changeSummary }) {
  const { totalModifications, summaryChanges, experienceModifications, skillsChanges } = changeSummary || {};
  const hasChanges = totalModifications > 0 || summaryChanges ||
    (experienceModifications && experienceModifications.length > 0) ||
    (skillsChanges && skillsChanges.length > 0);

  if (!hasChanges) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-xl">✏️</span> What We Changed
        {totalModifications > 0 && (
          <span className="text-sm font-normal text-gray-500">({totalModifications} modifications)</span>
        )}
      </h3>

      <div className="space-y-3">
        {summaryChanges && (
          <div className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">├─</span>
            <div>
              <span className="font-medium text-gray-700">Summary:</span>
              <span className="text-gray-600 ml-1">{summaryChanges}</span>
            </div>
          </div>
        )}

        {experienceModifications && experienceModifications.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">├─</span>
            <div className="flex-1">
              <span className="font-medium text-gray-700">Experience:</span>
              <ul className="mt-1 space-y-1">
                {experienceModifications.map((mod, idx) => (
                  <li key={idx} className="text-sm text-gray-600 ml-4">
                    <span className="font-medium">{mod.company}:</span>
                    <ul className="ml-2">
                      {mod.changes && mod.changes.map((change, cIdx) => (
                        <li key={cIdx} className="text-gray-500">• {change}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {skillsChanges && skillsChanges.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">└─</span>
            <div>
              <span className="font-medium text-gray-700">Skills:</span>
              <ul className="mt-1 ml-4">
                {skillsChanges.map((change, idx) => (
                  <li key={idx} className="text-sm text-gray-500">• {change}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * KeywordsCard - Display injected keywords
 */
function KeywordsCard({ keywords, reasoning }) {
  const hasKeywords = keywords && keywords.length > 0;

  if (!hasKeywords) {
    return null;
  }

  return (
    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-xl">🔑</span> Keywords Injected from JD
      </h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {keywords.map((keyword, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-300"
          >
            {keyword}
          </span>
        ))}
      </div>

      {reasoning && (
        <p className="text-sm text-gray-600 italic">"{reasoning}"</p>
      )}
    </div>
  );
}

/**
 * GapAnalysisCard - Display missing skills and experience gaps
 */
function GapAnalysisCard({ gapAnalysis }) {
  const { missingTechnicalSkills, missingCertificationsOrEducation, experienceGap, relatedSkillsFound } = gapAnalysis || {};

  const hasGaps = (missingTechnicalSkills && missingTechnicalSkills.length > 0) ||
    (missingCertificationsOrEducation && missingCertificationsOrEducation.length > 0) ||
    experienceGap ||
    (relatedSkillsFound && relatedSkillsFound.length > 0);

  if (!hasGaps) {
    return null;
  }

  return (
    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-xl">⚠️</span> Gap Analysis
      </h3>

      <div className="space-y-3">
        {missingTechnicalSkills && missingTechnicalSkills.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">Missing Skills:</span>
            <span className="text-gray-600 ml-1">
              {missingTechnicalSkills.join(', ')}
            </span>
            <span className="text-sm text-orange-600 ml-1">(consider adding if known)</span>
          </div>
        )}

        {missingCertificationsOrEducation && missingCertificationsOrEducation.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">Missing Certifications:</span>
            <span className="text-gray-600 ml-1">
              {missingCertificationsOrEducation.join(', ')}
            </span>
          </div>
        )}

        {experienceGap && (
          <div>
            <span className="font-medium text-gray-700">Experience:</span>
            <span className="text-gray-600 ml-1">{experienceGap}</span>
          </div>
        )}

        {relatedSkillsFound && relatedSkillsFound.length > 0 && (
          <div className="mt-2 pt-2 border-t border-orange-200">
            <span className="font-medium text-green-700">Related skills you have:</span>
            <span className="text-gray-600 ml-1">
              {relatedSkillsFound.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * DataIntegrityCard - Show bullet count verification
 */
function DataIntegrityCard({ validation }) {
  const { inputBulletCount, outputBulletCount, dataIntegrityVerified } = validation || {};
  const hasCounts = inputBulletCount !== null && outputBulletCount !== null;

  return (
    <div className={`rounded-lg p-4 border ${dataIntegrityVerified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-xl">{dataIntegrityVerified ? '✅' : '⚠️'}</span>
        Data Integrity {dataIntegrityVerified ? 'Verified' : 'Warning'}
      </h3>

      {hasCounts ? (
        <div className="text-gray-600">
          <span>Original: <strong>{inputBulletCount}</strong> bullets</span>
          <span className="mx-2">→</span>
          <span>Tailored: <strong>{outputBulletCount}</strong> bullets</span>
          {outputBulletCount >= inputBulletCount && (
            <p className="text-sm text-green-600 mt-1">All your content preserved, only enhanced</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Bullet count data not available</p>
      )}
    </div>
  );
}

/**
 * AIInsightsPanel - Main component displaying all AI insights
 */
export default function AIInsightsPanel({ metadata }) {
  if (!metadata) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No AI insights available. Process a resume to see insights.</p>
      </div>
    );
  }

  const {
    atsScoreBefore,
    atsScoreAfter,
    atsExplanation,
    keywordAdditions,
    gapAnalysis,
    validation,
    changeSummary
  } = metadata;

  return (
    <div className="p-4 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
      {/* ATS Score */}
      <ATSScoreCard
        before={atsScoreBefore}
        after={atsScoreAfter}
        explanation={atsExplanation}
      />

      {/* What Changed */}
      <ChangeSummaryCard changeSummary={changeSummary} />

      {/* Keywords Injected */}
      <KeywordsCard
        keywords={changeSummary?.keywordsInjected || keywordAdditions?.addedSkills}
        reasoning={keywordAdditions?.reasoning}
      />

      {/* Gap Analysis */}
      <GapAnalysisCard gapAnalysis={gapAnalysis} />

      {/* Data Integrity */}
      <DataIntegrityCard validation={validation} />
    </div>
  );
}
