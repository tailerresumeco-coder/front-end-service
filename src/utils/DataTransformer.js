/**
 * Transform backend API response to internal resume format
 * Handles nested projects under experience entries
 * FIXED: Safely handles missing/undefined dates to prevent .trim() errors
 * UPDATED: Supports V2 API response with validation data
 */
export function transformBackendResponse(backendData) {
  if (!backendData) {
    throw new Error("Backend data is empty");
  }

  // Check if using new response structure (tailored_resume) or old structure (tailored_content)
  const isNewStructure = backendData.tailored_resume !== undefined;
  
  if (isNewStructure) {
    return transformNewStructure(backendData);
  }

  // Legacy structure handling
  const { basic = {}, ats_score = {}, gap_analysis = {}, tailored_content = {}, _validation = {}, change_summary = {} } = backendData;


  // Extract links from nested structure
  const links = basic.links ?? {};

  // Transform education
  const education = (tailored_content.education ?? []).map(edu => ({
    degree: edu.degree ?? "",
    institution: edu.institution ?? "",
    dates: edu.duration ?? "",
    gpa: edu.gpa ? parseFloat(edu.gpa) : 0
  }));

  // Transform experience with NESTED PROJECTS
  const experience = (tailored_content.experience ?? [])
    .map(exp => {
      // Check if this experience has nested projects array
      if (exp.projects && Array.isArray(exp.projects) && exp.projects.length > 0) {
        // Has nested projects - flatten them into separate experience entries
        // But keep reference to parent for grouping later
        return exp.projects.map(project => ({
          role: exp.role ?? "",
          company: exp.company ?? "",
          location: exp.location ?? "",
          // Use project duration, fall back to parent experience duration
          dates: sanitizeDateString(project.duration ?? exp.duration ?? ""),
          projectName: project.project_name ?? "",
          // Include technologies if available
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
          highlights: Array.isArray(project.responsibilities) ? project.responsibilities : [],
          // Store parent duration for grouping calculation
          _parentDuration: sanitizeDateString(exp.duration ?? "")
        }));
      } else {
        // Old format without nested projects - single project per experience
        return {
          role: exp.role ?? "",
          company: exp.company ?? "",
          location: exp.location ?? "",
          dates: sanitizeDateString(exp.duration ?? ""),
          projectName: exp.project_name ?? "",
          technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
          highlights: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
          _parentDuration: sanitizeDateString(exp.duration ?? "")
        };
      }
    })
    .flat(); // Flatten array in case of nested projects

  // Transform personal projects (highlights array)
  const projects = (tailored_content.projects ?? []).map(proj => ({
    name: proj.project_name ?? "",
    technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
    highlights: Array.isArray(proj.highlights) ? proj.highlights : []
  }));

  // Transform skills
  const skills = transformSkills(tailored_content.skills ?? {});

  // Transform certifications
  const certifications = Array.isArray(tailored_content.certifications) 
    ? tailored_content.certifications 
    : [];

  // Transform internships (similar structure to experience)
  const internships = (tailored_content.internships ?? [])
    .map(intern => ({
      role: intern.role ?? "",
      company: intern.company ?? "",
      location: intern.location ?? "",
      dates: sanitizeDateString(intern.duration ?? intern.dates ?? ""),
      highlights: Array.isArray(intern.responsibilities) ? intern.responsibilities : 
                Array.isArray(intern.highlights) ? intern.highlights : []
    }));

  // Transform awards
  const awards = (tailored_content.awards ?? [])
    .map(award => ({
      title: award.title ?? award.name ?? "",
      issuer: award.issuer ?? award.organization ?? "",
      date: award.date ?? "",
      description: award.description ?? ""
    }));

  // Transform languages
  const languages = (tailored_content.languages ?? [])
    .map(lang => ({
      language: lang.language ?? lang.name ?? "",
      proficiency: lang.proficiency ?? lang.level ?? ""
    }));

  const highlight_keywords = tailored_content.highlight_keywords || [];


  return {
    // Meta - Read-only
    _metadata: {
      atsScoreBefore: ats_score.before_tailoring ?? null,
      atsScoreAfter: ats_score.after_tailoring ?? null,
      atsOverallScore: ats_score.overall_score ?? null,
      atsBreakdown: ats_score.breakdown ?? {},
      atsExplanation: ats_score.score_explanation ?? "",
      keywordAdditions: {
        addedSkills: ats_score.keyword_additions?.added_skills ?? [],
        reasoning: ats_score.keyword_additions?.reasoning ?? ""
      },
      gapAnalysis: {
        missingTechnicalSkills: gap_analysis.missing_technical_skills ?? [],
        missingCertificationsOrEducation: gap_analysis.missing_certifications_or_education ?? [],
        experienceGap: gap_analysis.experience_gap ?? "",
        relatedSkillsFound: gap_analysis.related_skills_found ?? [],
        // New structure fields
        missingCriticalSkills: gap_analysis.missing_critical_skills ?? [],
        missingPreferredSkills: gap_analysis.missing_preferred_skills ?? [],
        presentSkills: gap_analysis.present_skills ?? [],
        transferableSkills: gap_analysis.transferable_skills ?? []
      },
      recommendations: backendData.recommendations ?? {},
      keywordOptimization: backendData.keyword_optimization ?? {},
      nextSteps: backendData.next_steps ?? [],

      // V2 validation data
      validation: {
        inputBulletCount: _validation.input_bullet_count ?? null,
        outputBulletCount: _validation.output_bullet_count ?? null,
        dataIntegrityVerified: _validation.data_integrity_verified ?? true,
        warnings: _validation.warnings ?? []
      },
      // Change tracking for transparency
      changeSummary: {
        totalModifications: change_summary.total_modifications ?? 0,
        summaryChanges: change_summary.summary_changes ?? "",
        experienceModifications: change_summary.experience_modifications ?? [],
        skillsChanges: change_summary.skills_changes ?? [],
        keywordsInjected: change_summary.keywords_injected ?? []
      },
      charecterLength: backendData ? JSON.stringify(backendData).length : 0
    },

    // Editable
    basics: {
      name: basic.name ?? "",
      email: basic.email ?? "",
      phone: basic.phone ?? "",
      location: basic.location ?? "",
      summary: tailored_content.professional_summary ?? "",
      github: links.github ?? "",
      leetcode: links.leetcode ?? "",
      linkedin: links.linkedin ?? "",
      other: links.other ?? ""
    },

    education,
    experience,
    projects,
    skills,
    certifications,
    internships,
    awards,
    languages,
    highlight_keywords

  };
}

/**
 * Transform new backend response structure to internal resume format
 * Handles the new response with tailored_resume, recommendations, keyword_optimization, next_steps
 */
function transformNewStructure(backendData) {
  const { 
    ats_score = {}, 
    gap_analysis = {}, 
    recommendations = {},
    tailored_resume = {},
    keyword_optimization = {},
    next_steps = []
  } = backendData;

  // Extract header info
  const header = tailored_resume.header ?? {};
  
  // Transform technical_skills object to array format
  const skills = transformTechnicalSkills(tailored_resume.technical_skills ?? {});

  // Transform professional_experience with NESTED PROJECTS
  const experience = (tailored_resume.professional_experience ?? [])
    .map(exp => {
      // Check if this experience has nested projects array
      if (exp.projects && Array.isArray(exp.projects) && exp.projects.length > 0) {
        // Has nested projects - flatten them into separate experience entries
        return exp.projects.map(project => ({
          role: exp.title ?? "",
          company: exp.company ?? "",
          location: exp.location ?? "",
          // Use project duration if available, fall back to parent experience duration
          dates: sanitizeDateString(project.duration ?? exp.duration ?? ""),
          projectName: project.name ?? "",
          // Extract technologies from project if available
          technologies: Array.isArray(project.technologies) ? project.technologies : 
                       typeof project.technologies === 'string' ? project.technologies.split(',').map(t => t.trim()) : [],
          highlights: Array.isArray(project.achievements) ? project.achievements : [],
          _parentDuration: sanitizeDateString(exp.duration ?? "")
        }));
      } else {
        // No nested projects - single entry per experience
        return {
          role: exp.title ?? "",
          company: exp.company ?? "",
          location: exp.location ?? "",
          dates: sanitizeDateString(exp.duration ?? ""),
          projectName: "",
          technologies: [],
          highlights: Array.isArray(exp.achievements) ? exp.achievements : [],
          _parentDuration: sanitizeDateString(exp.duration ?? "")
        };
      }
    })
    .flat(); // Flatten array in case of nested projects


  // Transform projects
  const projects = (tailored_resume.projects ?? []).map(proj => ({
    name: proj.name ?? "",
    technologies: Array.isArray(proj.technologies) ? proj.technologies : 
                 typeof proj.technologies === 'string' ? [proj.technologies] : [],
    highlights: Array.isArray(proj.description) ? proj.description : []
  }));

  // Transform education
  const education = (tailored_resume.education ?? []).map(edu => ({
    degree: edu.degree ?? "",
    institution: edu.institution ?? "",
    dates: edu.duration ?? "",
    gpa: edu.gpa ? parseFloat(edu.gpa) : 0
  }));

  // Transform certifications
  const certifications = (tailored_resume.certifications ?? []).map(cert => ({
    name: cert.name ?? "",
    issuing_organization: cert.issuing_organization ?? "",
    date: cert.date ?? ""
  }));

  // Handle awards if present
  const awards = (tailored_resume.awards ?? []).map(award => ({
    title: award.title ?? "",
    issuer: award.organization ?? "",
    date: award.date ?? "",
    description: award.description ?? ""
  }));

  // Handle languages if present
  const languages = (tailored_resume.languages ?? []).map(lang => ({
    language: lang.language ?? "",
    proficiency: lang.proficiency ?? ""
  }));

  // Handle internships if present
  const internships = (tailored_resume.internships ?? []).map(intern => ({
    role: intern.title ?? "",
    company: intern.company ?? "",
    location: intern.location ?? "",
    dates: sanitizeDateString(intern.duration ?? ""),
    highlights: Array.isArray(intern.achievements) ? intern.achievements : []
  }));

  return {
    _metadata: {
      atsScoreBefore: ats_score.before_tailoring ?? null,
      atsScoreAfter: ats_score.after_tailoring ?? null,
      atsOverallScore: ats_score.overall_score ?? null,
      atsBreakdown: ats_score.breakdown ?? {},
      atsExplanation: ats_score.score_explanation ?? "",
      keywordAdditions: {
        addedSkills: keyword_optimization.critical_keywords_added ?? [],
        reasoning: ""
      },
      gapAnalysis: {
        missingTechnicalSkills: gap_analysis.missing_critical_skills ?? [],
        missingCertificationsOrEducation: [],
        experienceGap: "",
        relatedSkillsFound: gap_analysis.transferable_skills ?? [],
        missingCriticalSkills: gap_analysis.missing_critical_skills ?? [],
        missingPreferredSkills: gap_analysis.missing_preferred_skills ?? [],
        presentSkills: gap_analysis.present_skills ?? [],
        transferableSkills: gap_analysis.transferable_skills ?? []
      },
      recommendations: recommendations,
      keywordOptimization: keyword_optimization,
      nextSteps: next_steps,
      validation: {
        inputBulletCount: null,
        outputBulletCount: null,
        dataIntegrityVerified: true,
        warnings: []
      },
      changeSummary: {
        totalModifications: 0,
        summaryChanges: "",
        experienceModifications: [],
        skillsChanges: [],
        keywordsInjected: []
      },
      charecterLength: backendData ? JSON.stringify(backendData).length : 0
    },

    basics: {
      name: header.name ?? "",
      email: header.email ?? "",
      phone: header.phone ?? "",
      location: header.location ?? "",
      summary: tailored_resume.professional_summary ?? "",
      github: header.github ?? "",
      leetcode: "",
      linkedin: header.linkedin ?? "",
      other: ""
    },

    education,
    experience,
    projects,
    skills,
    certifications,
    internships,
    awards,
    languages,
    highlight_keywords: keyword_optimization.critical_keywords_added ?? []
  };
}

/**
 * Transform technical_skills object to array format
 * Input: { "Frontend Technologies": ["React", "HTML"], "Backend Technologies": ["Node.js"] }
 * Output: [{ category: "Frontend Technologies", items: ["React", "HTML"] }, ...]
 */
function transformTechnicalSkills(technicalSkills) {
  if (!technicalSkills || typeof technicalSkills !== 'object') {
    return [];
  }

  return Object.entries(technicalSkills)
    .filter(([category, items]) => Array.isArray(items) && items.length > 0)
    .map(([category, items]) => ({
      category: category,
      items: items
    }));
}

function sanitizeDateString(dateStr) {
  if (!dateStr) return "";
  if (typeof dateStr !== 'string') return String(dateStr);
  return dateStr.trim();
}

/**
 * Transform skills to array of categories
 * Supports both:
 * - NEW format: Array of { category, items }
 * - OLD format: Object with technical_skills, soft_skills, tools_and_languages
 */
function transformSkills(skillsData) {
  // Handle null/undefined
  if (!skillsData) {
    return [];
  }

  // NEW FORMAT: Already an array of { category, items }
  if (Array.isArray(skillsData)) {
    return skillsData
      .filter(skill => skill && skill.category && Array.isArray(skill.items) && skill.items.length > 0)
      .map(skill => ({
        category: skill.category,
        items: skill.items
      }));
  }

  // OLD FORMAT: Object with fixed keys (backward compatibility)
  const legacyCategories = [
    { key: "technical_skills", label: "Technical Skills" },
    { key: "soft_skills", label: "Soft Skills" },
    { key: "tools_and_languages", label: "Tools & Languages" }
  ];

  const skills = legacyCategories
    .map(({ key, label }) => {
      const items = skillsData[key];
      return {
        category: label,
        items: Array.isArray(items) ? items : []
      };
    })
    .filter(skill => skill.items && skill.items.length > 0);

  // Handle auto-added keywords (legacy feature)
  const autoAddedKeywords = skillsData.auto_added_keywords;
  if (Array.isArray(autoAddedKeywords) && autoAddedKeywords.length > 0) {
    skills.push({
      category: "Auto-Added Keywords",
      items: autoAddedKeywords
    });
  }

  // Handle any OTHER dynamic keys in object format
  const knownKeys = ["technical_skills", "soft_skills", "tools_and_languages", "auto_added_keywords"];
  Object.entries(skillsData).forEach(([key, items]) => {
    if (!knownKeys.includes(key) && Array.isArray(items) && items.length > 0) {
      skills.push({
        category: formatCategoryLabel(key),
        items: items
      });
    }
  });

  return skills;
}

/**
 * Format category key to display label
 * e.g., "cloud_devops" -> "Cloud Devops"
 */
function formatCategoryLabel(key) {
  if (!key || typeof key !== 'string') return "Other";
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

/**
 * Validate resume has minimum required fields
 * FIXED: Safely handle potentially undefined values
 */
export function isResumeValid(resume) {
  try {
    const hasBasicInfo = !!(
      resume?.basics?.name &&
      String(resume.basics.name).trim().length > 0 &&
      resume?.basics?.email &&
      String(resume.basics.email).trim().length > 0
    );

    const hasExperience = !!(
      Array.isArray(resume?.experience) &&
      resume.experience.length > 0 &&
      resume.experience.some(exp => exp.role || exp.company)
    );

    const hasProjects = !!(
      Array.isArray(resume?.projects) &&
      resume.projects.length > 0 &&
      resume.projects.some(proj => proj.name && String(proj.name).trim().length > 0)
    );

    return hasBasicInfo && (hasExperience || hasProjects);
  } catch (error) {
    console.error("Error validating resume:", error);
    return false;
  }
}

/**
 * Helper: Get total years of experience from resume
 * Parses date strings and calculates duration
 * FIXED: Better error handling for invalid/missing dates
 */
export function calculateYearsOfExperience(experience) {
  if (!Array.isArray(experience) || experience.length === 0) {
    return 0;
  }

  try {
    const dates = experience
      .map(exp => exp.dates)
      .filter(Boolean) // Filter out empty strings
      .map(dateStr => {
        // FIXED: Safely handle date parsing
        if (!dateStr || typeof dateStr !== 'string') return null;
        
        const parts = dateStr.split('–').map(s => s.trim()).filter(Boolean);
        if (parts.length < 2) return null;

        const start = parseDate(parts[0]);
        const end = parts[1].toLowerCase().includes('present') 
          ? new Date() 
          : parseDate(parts[1]);

        return (start && end) ? { start, end } : null;
      })
      .filter(d => d && d.start && d.end);

    if (dates.length === 0) return 0;

    const earliestStart = new Date(Math.min(...dates.map(d => d.start.getTime())));
    const latestEnd = new Date(Math.max(...dates.map(d => d.end.getTime())));

    const diffMs = latestEnd - earliestStart;
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);

    return Math.round(diffYears * 10) / 10;
  } catch (error) {
    console.error("Error calculating YoE:", error);
    return 0;
  }
}

/**
 * Parse month-year date strings safely
 * FIXED: Better error handling
 */
function parseDate(dateStr) {
  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };

  try {
    if (!dateStr || typeof dateStr !== 'string') return null;

    const parts = dateStr.trim().split(/\s+/);
    if (parts.length !== 2) return null;

    const [monthStr, yearStr] = parts;
    const month = monthMap[monthStr.toLowerCase()];
    const year = parseInt(yearStr);

    if (month === undefined || isNaN(year)) return null;

    return new Date(year, month, 1);
  } catch (error) {
    console.error(`Error parsing date "${dateStr}":`, error);
    return null;
  }
}
