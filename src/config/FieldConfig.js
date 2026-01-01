/**
 * Define which fields are editable, their types, labels
 * Metadata fields are READ-ONLY
 */
export const FIELD_CONFIG = {
  _metadata: {
    editable: false,
    label: "Resume Analysis",
    fields: {
      atsScoreBefore: { type: "number", label: "ATS Score (Before)", readOnly: true },
      atsScoreAfter: { type: "number", label: "ATS Score (After)", readOnly: true },
      atsExplanation: { type: "text", label: "Score Explanation", readOnly: true }
    }
  },

  basics: {
    editable: true,
    label: "Personal Details",
    fields: {
      name: { type: "text", label: "Full Name", required: true },
      email: { type: "email", label: "Email", required: true },
      phone: { type: "tel", label: "Phone Number" },
      location: { type: "text", label: "Location" },
      summary: { type: "textarea", label: "Professional Summary" },
      github: { type: "url", label: "GitHub Profile" },
      leetcode: { type: "url", label: "LeetCode Profile" },
      linkedin: { type: "url", label: "LinkedIn Profile" }
    }
  },

  education: {
    editable: true,
    label: "Education",
    isArray: true,
    fields: {
      degree: { type: "text", label: "Degree", required: true },
      institution: { type: "text", label: "Institution", required: true },
      dates: { type: "date-range", label: "Duration" },
      gpa: { type: "number", label: "GPA" }
    }
  },

  experience: {
    editable: true,
    label: "Work Experience",
    isArray: true,
    canAddRemove: true,
    fields: {
      role: { type: "text", label: "Job Title", required: true },
      company: { type: "text", label: "Company", required: true },
      dates: { type: "date-range", label: "Duration" },
      highlights: { type: "array", label: "Responsibilities", itemType: "text", canAddRemove: true }
    }
  },

  projects: {
    editable: true,
    label: "Projects",
    isArray: true,
    canAddRemove: true,
    fields: {
      name: { type: "text", label: "Project Name", required: true },
      technologies: { type: "array", label: "Technologies", itemType: "text", canAddRemove: true },
      description: { type: "textarea", label: "Description" }
    }
  },

  skills: {
    editable: true,
    label: "Skills",
    isArray: true,
    fields: {
      category: { type: "text", label: "Category", required: true },
      items: { type: "array", label: "Skills", itemType: "text", canAddRemove: true }
    }
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