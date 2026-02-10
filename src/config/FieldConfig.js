/**
 * Define which fields are editable, their types, labels
 * Metadata fields are READ-ONLY
 */
export const FIELD_CONFIG = {
  basics: {
    label: "Basic Information",
    fields: {
      name: { label: "Full Name", type: "text", required: true },
      email: { label: "Email", type: "email", required: true },
      phone: { label: "Phone", type: "tel" },
      location: { label: "Location", type: "text" },
      summary: { label: "Professional Summary", type: "textarea", placeholder: "Brief summary of your professional background..." },
      github: { label: "GitHub", type: "url", placeholder: "https://github.com/username" },
      leetcode: { label: "LeetCode", type: "url", placeholder: "https://leetcode.com/username" },
      linkedin: { label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/username" },
      other: { label: "Other Link", type: "url", placeholder: "Portfolio, blog, etc." }
    }
  },

  education: {
    label: "Education",
    canAddRemove: true,
    fields: {
      institution: { label: "Institution", type: "text", required: true },
      degree: { label: "Degree", type: "text", required: true },
      dates: { label: "Duration", type: "date-range", placeholder: "Nov 2020 – Apr 2025" },
      gpa: { label: "GPA", type: "number", placeholder: "7.5" }
    }
  },

  experience: {
    label: "Work Experience",
    canAddRemove: true,
    fields: {
      role: { label: "Job Title", type: "text", required: true },
      company: { label: "Company", type: "text", required: true },
      location: { label: "Location", type: "text" },
      dates: { label: "Duration", type: "date-range", placeholder: "Apr 2024 – Dec 2024" },
      projectName: { label: "Project Name", type: "text", placeholder: "Optional: Project you worked on" },
      highlights: { label: "Responsibilities/Achievements", type: "array" }
    }
  },

  projects: {
    label: "Projects",
    canAddRemove: true,
    fields: {
      name: { label: "Project Name", type: "text", required: true },
      technologies: { label: "Technologies", type: "array" },
      description: { label: "Description", type: "textarea" },
      highlights: { label: "Key Features/Highlights", type: "array" }
    }
  },

  skills: {
    label: "Skills",
    canAddRemove: true,
    fields: {
      category: { label: "Skill Category", type: "text", placeholder: "e.g., Technical Skills, Soft Skills" },
      items: { label: "Skills", type: "array" }
    }
  },

  certifications: {
    label: "Certifications",
    canAddRemove: true
  },

  internships: {
    label: "Internships",
    canAddRemove: true,
    fields: {
      role: { label: "Job Title", type: "text", required: true },
      company: { label: "Company", type: "text", required: true },
      location: { label: "Location", type: "text" },
      dates: { label: "Duration", type: "date-range", placeholder: "Apr 2024 – Dec 2024" },
      highlights: { label: "Responsibilities/Achievements", type: "array" }
    }
  },

  awards: {
    label: "Awards & Honors",
    canAddRemove: true,
    fields: {
      title: { label: "Award Title", type: "text", required: true },
      issuer: { label: "Issuing Organization", type: "text", required: true },
      date: { label: "Date Received", type: "text", placeholder: "May 2024" },
      description: { label: "Description", type: "textarea", placeholder: "Brief description of the award and why you received it..." }
    }
  },

  languages: {
    label: "Languages",
    canAddRemove: true,
    fields: {
      language: { label: "Language", type: "text", required: true, placeholder: "e.g., English, Spanish, French" },
      proficiency: { label: "Proficiency Level", type: "text", placeholder: "e.g., Native, Fluent, Professional, Conversational" }
    }
  }
};

export const SECTION_ORDER = [
  "basics",
  "education",
  "experience",
  "internships",
  "projects",
  "skills",
  "certifications",
  "awards",
  "languages",
  "_metadata"
];

export const TEMPLATE_SECTIONS = [
  { key: "basics", displayName: "Personal Details" },
  { key: "education", displayName: "Education" },
  { key: "experience", displayName: "Work Experience" },
  { key: "internships", displayName: "Internships" },
  { key: "projects", displayName: "Projects" },
  { key: "skills", displayName: "Skills" },
  { key: "certifications", displayName: "Certifications" },
  { key: "awards", displayName: "Awards & Honors" },
  { key: "languages", displayName: "Languages" }
];
