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

  const highlight_keywords = tailored_content.highlight_keywords || [];

  return {
    // Meta - Read-only
    _metadata: {
      atsScoreBefore: ats_score.before_tailoring ?? null,
      atsScoreAfter: ats_score.after_tailoring ?? null,
      atsExplanation: ats_score.score_explanation ?? "",
      keywordAdditions: {
        addedSkills: ats_score.keyword_additions?.added_skills ?? [],
        reasoning: ats_score.keyword_additions?.reasoning ?? ""
      },
      gapAnalysis: {
        missingTechnicalSkills: gap_analysis.missing_technical_skills ?? [],
        missingCertificationsOrEducation: gap_analysis.missing_certifications_or_education ?? [],
        experienceGap: gap_analysis.experience_gap ?? "",
        relatedSkillsFound: gap_analysis.related_skills_found ?? []
      },
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
    highlight_keywords
  };
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