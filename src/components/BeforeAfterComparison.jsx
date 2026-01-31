import React, { useState, useMemo } from 'react';

/**
 * Extract text content from resume for comparison
 */
function extractResumeText(resume) {
  if (!resume) return { summary: '', experience: [], skills: [], projects: [] };

  const summary = resume.basics?.summary || resume.professional_summary || '';

  const experience = (resume.experience || []).map(exp => ({
    role: exp.role || '',
    company: exp.company || '',
    projectName: exp.projectName || exp.project_name || '',
    highlights: exp.highlights || exp.responsibilities || []
  }));

  const skills = (resume.skills || []).map(cat => ({
    category: cat.category || '',
    items: cat.items || []
  }));

  const projects = (resume.projects || []).map(proj => ({
    name: proj.name || proj.project_name || '',
    highlights: proj.highlights || []
  }));

  return { summary, experience, skills, projects };
}

/**
 * SectionComparison - Compare a single section stacked
 */
function SectionComparison({ title, original, tailored, type }) {
  if (!original && !tailored) return null;

  const renderContent = (content) => {
    if (type === 'text') {
      return <p className="text-sm text-gray-700 whitespace-pre-wrap">{content || '(empty)'}</p>;
    }
    if (type === 'list') {
      if (!content || content.length === 0) return <p className="text-sm text-gray-400 italic">(empty)</p>;
      return (
        <ul className="text-sm text-gray-700 space-y-1">
          {content.map((item, idx) => (
            <li key={idx} className="pl-2 border-l-2 border-gray-200">• {item}</li>
          ))}
        </ul>
      );
    }
    if (type === 'skills') {
      if (!content || content.length === 0) return <p className="text-sm text-gray-400 italic">(empty)</p>;
      return (
        <div className="space-y-2">
          {content.map((cat, idx) => (
            <div key={idx}>
              <span className="font-medium text-gray-700">{cat.category}:</span>
              <span className="text-sm text-gray-600 ml-1">{cat.items?.join(', ')}</span>
            </div>
          ))}
        </div>
      );
    }
    return <p className="text-sm text-gray-700">{String(content)}</p>;
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <div className="flex flex-col gap-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-xs font-medium text-gray-600 mb-1">ORIGINAL</div>
          {renderContent(original)}
        </div>
        <div className="bg-green-50 p-3 rounded">
          <div className="text-xs font-medium text-green-700 mb-1">TAILORED</div>
          {renderContent(tailored)}
        </div>
      </div>
    </div>
  );
}

/**
 * ExperienceComparison - Compare experience entries
 */
function ExperienceComparison({ originalExp, tailoredExp }) {
  // Match experiences by company + role - only show original experiences
  const matchedPairs = useMemo(() => {
    const pairs = [];

    (originalExp || []).forEach(orig => {
      // Find matching tailored entry
      const matchIdx = (tailoredExp || []).findIndex(t =>
        t.company === orig.company &&
        t.role === orig.role
      );

      if (matchIdx >= 0) {
        pairs.push({ original: orig, tailored: tailoredExp[matchIdx] });
      } else {
        pairs.push({ original: orig, tailored: null });
      }
    });

    return pairs;
  }, [originalExp, tailoredExp]);

  if (matchedPairs.length === 0) return null;

  return (
    <div className="space-y-4">
      {matchedPairs.map((pair, idx) => {
        const exp = pair.original || pair.tailored;
        const title = `${exp.role} at ${exp.company}${exp.projectName ? ` - ${exp.projectName}` : ''}`;

        return (
          <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
            <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs font-medium text-gray-600 mb-1">ORIGINAL</div>
                {pair.original?.highlights?.length > 0 ? (
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pair.original.highlights.map((h, i) => (
                      <li key={i} className="pl-2 border-l-2 border-gray-200">• {h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">(not in original)</p>
                )}
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-xs font-medium text-green-700 mb-1">TAILORED</div>
                {pair.tailored?.highlights?.length > 0 ? (
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pair.tailored.highlights.map((h, i) => (
                      <li key={i} className="pl-2 border-l-2 border-green-200">• {h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">(removed)</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * ProjectsComparison - Compare project entries
 */
function ProjectsComparison({ originalProjects, tailoredProjects }) {
  const matchedPairs = useMemo(() => {
    const pairs = [];

    (originalProjects || []).forEach(orig => {
      const matchIdx = (tailoredProjects || []).findIndex(t =>
        t.name === orig.name
      );

      if (matchIdx >= 0) {
        pairs.push({ original: orig, tailored: tailoredProjects[matchIdx] });
      } else {
        pairs.push({ original: orig, tailored: null });
      }
    });

    return pairs;
  }, [originalProjects, tailoredProjects]);

  if (matchedPairs.length === 0) return null;

  return (
    <div className="space-y-4">
      {matchedPairs.map((pair, idx) => {
        const proj = pair.original || pair.tailored;
        return (
          <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
            <h4 className="font-semibold text-gray-800 mb-2">{proj.name}</h4>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs font-medium text-gray-600 mb-1">ORIGINAL</div>
                {pair.original?.highlights?.length > 0 ? (
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pair.original.highlights.map((h, i) => (
                      <li key={i} className="pl-2 border-l-2 border-gray-200">• {h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">(not in original)</p>
                )}
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-xs font-medium text-green-700 mb-1">TAILORED</div>
                {pair.tailored?.highlights?.length > 0 ? (
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pair.tailored.highlights.map((h, i) => (
                      <li key={i} className="pl-2 border-l-2 border-green-200">• {h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">(removed)</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * BeforeAfterComparison - Main comparison component
 */
export default function BeforeAfterComparison({ original, tailored }) {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    experience: true,
    skills: true,
    projects: true
  });

  const originalData = useMemo(() => extractResumeText(original), [original]);
  const tailoredData = useMemo(() => extractResumeText(tailored), [tailored]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!original && !tailored) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No comparison data available. Upload and process a resume first.</p>
      </div>
    );
  }

  if (!original) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Original resume not available for comparison.</p>
        <p className="text-sm mt-2">The original resume data was not preserved during upload.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">

      {/* Sections */}
      <div className="space-y-6">
        {/* Summary Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('summary')}
            className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-semibold text-gray-800">Professional Summary</span>
            <span className="text-gray-400">{expandedSections.summary ? '▼' : '▶'}</span>
          </button>
          {expandedSections.summary && (
            <div className="p-4">
              <SectionComparison
                title=""
                original={originalData.summary}
                tailored={tailoredData.summary}
                type="text"
              />
            </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('experience')}
            className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-semibold text-gray-800">Experience</span>
            <span className="text-gray-400">{expandedSections.experience ? '▼' : '▶'}</span>
          </button>
          {expandedSections.experience && (
            <div className="p-4">
              <ExperienceComparison
                originalExp={originalData.experience}
                tailoredExp={tailoredData.experience}
              />
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('skills')}
            className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-semibold text-gray-800">Skills</span>
            <span className="text-gray-400">{expandedSections.skills ? '▼' : '▶'}</span>
          </button>
          {expandedSections.skills && (
            <div className="p-4">
              <SectionComparison
                title=""
                original={originalData.skills}
                tailored={tailoredData.skills}
                type="skills"
              />
            </div>
          )}
        </div>

        {/* Projects Section */}
        {(originalData.projects.length > 0 || tailoredData.projects.length > 0) && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('projects')}
              className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="font-semibold text-gray-800">Projects</span>
              <span className="text-gray-400">{expandedSections.projects ? '▼' : '▶'}</span>
            </button>
            {expandedSections.projects && (
              <div className="p-4">
                <ProjectsComparison
                  originalProjects={originalData.projects}
                  tailoredProjects={tailoredData.projects}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
