/**
 * Transform backend API response to internal resume format
 * Handles optional fields gracefully
 * 
 * Backend Response Structure:
 * {
 *   basic: { name, phone, email, github, leetcode, linkedin, education, location },
 *   ats_score: { before_tailoring, after_tailoring, score_explanation },
 *   gap_analysis: { missing_technical_skills, missing_certifications_or_education, experience_gap },
 *   tailored_content: { professional_summary, experience, skills, projects }
 * }
 */
export function transformBackendResponse(backendData) {
  if (!backendData) {
    throw new Error("Backend data is empty");
  }

  const { basic = {}, ats_score = {}, gap_analysis = {}, tailored_content = {} } = backendData;

  // Extract education info
  const education = basic.education ? [{
    degree: basic.education.degree ?? "",
    institution: basic.education.institution ?? "",
    dates: basic.education.dates ?? "",
    gpa: basic.education.gpa ? Number(basic.education.gpa) : 0
  }] : [];

  // Transform experience - handle both direct structure and nested
  const experience = (tailored_content.experience ?? []).map(exp => ({
    role: exp.role ?? "",
    company: exp.company ?? "",
    dates: exp.dates ?? "",
    highlights: Array.isArray(exp.highlights) ? exp.highlights : (exp.tailored_points ?? [])
  }));

  // Transform projects
  const projects = (tailored_content.projects ?? []).map(proj => ({
    name: proj.name ?? "",
    technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
    description: proj.description ?? "",
    highlights: Array.isArray(proj.tailored_points) ? proj.tailored_points : []
  }));

  // Transform skills
  const skills = transformSkills(tailored_content.skills ?? {});

  return {
    // Meta - Read-only
    _metadata: {
      atsScoreBefore: ats_score.before_tailoring ?? null,
      atsScoreAfter: ats_score.after_tailoring ?? null,
      atsExplanation: ats_score.score_explanation ?? "",
      gapAnalysis: gap_analysis ?? {}
    },

    // Editable
    basics: {
      name: basic.name ?? "",
      email: basic.email ?? "",
      phone: basic.phone ?? "",
      location: basic.location ?? "",
      summary: tailored_content.professional_summary ?? "",
      github: basic.github ?? "",
      leetcode: basic.leetcode ?? "",
      linkedin: basic.linkedin ?? ""
    },

    education,
    experience,
    projects,
    skills
  };
}

/**
 * Transform skills object to array of categories
 * Handles skills organized by type (programming_languages, frontend, backend, etc.)
 */
function transformSkills(skillsObj) {
  const skillsMap = {
    programming_languages: "Programming Languages",
    frontend: "Frontend",
    backend: "Backend",
    databases: "Databases",
    apis: "APIs",
    tools: "Tools",
    concepts: "Concepts",
    certifications: "Certifications",
    soft_skills: "Soft Skills"
  };

  return Object.entries(skillsMap)
    .map(([key, label]) => {
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
 * - At least one experience entry
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

  return hasBasicInfo && hasExperience;
}