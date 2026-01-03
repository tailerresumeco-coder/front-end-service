/**
 * Transform backend API response to internal resume format
 * Handles optional fields gracefully
 * 
 * Backend Response Structure:
 * {
 *   basic: { name, phone, email, links: { github, leetcode, linkedin, other } },
 *   ats_score: { before_tailoring, after_tailoring, score_explanation },
 *   gap_analysis: { missing_technical_skills, missing_certifications_or_education, experience_gap },
 *   tailored_content: { 
 *     professional_summary, 
 *     experience: [{ role, company, location, duration, project_name, responsibilities }],
 *     education: [{ institution, degree, duration, gpa }],
 *     skills: { technical_skills, soft_skills, tools_and_languages },
 *     projects: [{ project_name, description, technologies }],
 *     certifications: []
 *   }
 * }
 */
export function transformBackendResponse(backendData) {
  if (!backendData) {
    throw new Error("Backend data is empty");
  }

  const { basic = {}, ats_score = {}, gap_analysis = {}, tailored_content = {} } = backendData;

  // Extract links from nested structure
  const links = basic.links ?? {};

  // Transform education - now from tailored_content
  const education = (tailored_content.education ?? []).map(edu => ({
    degree: edu.degree ?? "",
    institution: edu.institution ?? "",
    dates: edu.duration ?? "",
    gpa: edu.gpa ? parseFloat(edu.gpa) : 0
  }));

  // Transform experience - includes project_name and responsibilities
  const experience = (tailored_content.experience ?? []).map(exp => ({
    role: exp.role ?? "",
    company: exp.company ?? "",
    location: exp.location ?? "",
    dates: exp.duration ?? "",
    projectName: exp.project_name ?? "", // NEW: Track project name
    highlights: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
  }));

  // Transform projects - description is now an array
  const projects = (tailored_content.projects ?? []).map(proj => ({
    name: proj.project_name ?? "",
    technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
    description: Array.isArray(proj.description) ? proj.description.join(" ") : (proj.description ?? ""),
    highlights: Array.isArray(proj.description) ? proj.description : []
  }));

  // Transform skills - new structure with technical_skills, soft_skills, tools_and_languages
  const skills = transformSkills(tailored_content.skills ?? {});

  // Transform certifications
  const certifications = Array.isArray(tailored_content.certifications) 
    ? tailored_content.certifications 
    : [];

  return {
    // Meta - Read-only
    _metadata: {
      atsScoreBefore: ats_score.before_tailoring ?? null,
      atsScoreAfter: ats_score.after_tailoring ?? null,
      atsExplanation: ats_score.score_explanation ?? "",
      gapAnalysis: {
        missingTechnicalSkills: gap_analysis.missing_technical_skills ?? [],
        missingCertificationsOrEducation: gap_analysis.missing_certifications_or_education ?? [],
        experienceGap: gap_analysis.experience_gap ?? ""
      }
    },

    // Editable
    basics: {
      name: basic.name ?? "",
      email: basic.email ?? "",
      phone: basic.phone ?? "",
      location: "", // Not in basic anymore
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
    certifications
  };
}

/**
 * Transform skills object to array of categories
 * New structure: technical_skills, soft_skills, tools_and_languages
 */
function transformSkills(skillsObj) {
  const skillCategories = [
    {
      key: "technical_skills",
      label: "Technical Skills"
    },
    {
      key: "soft_skills",
      label: "Soft Skills"
    },
    {
      key: "tools_and_languages",
      label: "Tools & Languages"
    }
  ];

  return skillCategories
    .map(({ key, label }) => {
      const items = skillsObj[key];
      return {
        category: label,
        items: Array.isArray(items) ? items : []
      };
    })
    .filter(skill => skill.items && skill.items.length > 0); // Hide empty skill groups
}

/**
 * Validate resume has minimum required fields
 * 
 * Minimum requirements:
 * - basics.name
 * - basics.email
 * - At least one experience entry OR one project
 */
export function isResumeValid(resume) {
  const hasBasicInfo = !!(
    resume?.basics?.name &&
    resume.basics.name.trim().length > 0 &&
    resume?.basics?.email &&
    resume.basics.email.trim().length > 0
  );

  const hasExperience = !!(
    Array.isArray(resume?.experience) &&
    resume.experience.length > 0 &&
    resume.experience.some(exp => exp.role || exp.company)
  );

  const hasProjects = !!(
    Array.isArray(resume?.projects) &&
    resume.projects.length > 0 &&
    resume.projects.some(proj => proj.name && proj.name.trim().length > 0)
  );

  // Valid if has basic info AND (experience OR projects)
  return hasBasicInfo && (hasExperience || hasProjects);
}

/**
 * Helper: Get total years of experience from resume
 * Parses date strings and calculates duration
 */
export function calculateYearsOfExperience(experience) {
  if (!Array.isArray(experience) || experience.length === 0) {
    return 0;
  }

  try {
    // Extract all dates
    const dates = experience
      .map(exp => exp.dates)
      .filter(Boolean)
      .map(dateStr => {
        // Handle formats like "Apr 2024 – Dec 2024", "Aug 2025 – Present"
        const parts = dateStr.split('–').map(s => s.trim());
        if (parts.length !== 2) return null;

        const start = parseDate(parts[0]);
        const end = parts[1].toLowerCase().includes('present') 
          ? new Date() 
          : parseDate(parts[1]);

        return { start, end };
      })
      .filter(d => d && d.start && d.end);

    if (dates.length === 0) return 0;

    // Find earliest start and latest end
    const earliestStart = new Date(Math.min(...dates.map(d => d.start.getTime())));
    const latestEnd = new Date(Math.max(...dates.map(d => d.end.getTime())));

    // Calculate difference in years
    const diffMs = latestEnd - earliestStart;
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);

    return Math.round(diffYears * 10) / 10; // Round to 1 decimal
  } catch (error) {
    console.error("Error calculating YoE:", error);
    return 0;
  }
}

/**
 * Parse month-year date strings
 * Supports formats: "Apr 2024", "January 2025", etc.
 */
function parseDate(dateStr) {
  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length !== 2) return null;

  const [monthStr, yearStr] = parts;
  const month = monthMap[monthStr.toLowerCase()];
  const year = parseInt(yearStr);

  if (month === undefined || isNaN(year)) return null;

  return new Date(year, month, 1);
}