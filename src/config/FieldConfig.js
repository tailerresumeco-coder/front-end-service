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
  }
};

export const SECTION_ORDER = [
  "basics",
  "education",
  "experience",
  "projects",
  "skills",
  "_metadata"
];

export const TEMPLATE_SECTIONS = [
  { key: "basics", displayName: "Personal Details" },
  { key: "education", displayName: "Education" },
  { key: "experience", displayName: "Work Experience" },
  { key: "projects", displayName: "Projects" },
  { key: "skills", displayName: "Skills" }
];