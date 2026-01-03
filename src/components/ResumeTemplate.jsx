import React from "react";

/**
 * Shared resume template for Preview and PDF
 * Used by both screen display and PDF generation
 * Layout matches the reference PDF template
 * 
 * CRITICAL: Must be a forwardRef to work with react-to-print
 */
const ResumeTemplate = React.forwardRef(({ resume }, ref) => {
  if (!resume?.basics) {
    return (
      <div ref={ref} style={{ padding: "40px", textAlign: "center", color: "#999" }}>
        No resume data available
      </div>
    );
  }

  const { basics, education, experience, projects, skills } = resume;

  return (
    <div
      ref={ref}
      data-testid="resume-preview"
      style={{
        fontFamily: "'Calibri', 'Arial', sans-serif",
        fontSize: "11px",
        lineHeight: "1.4",
        color: "#000",
        padding: "40px",
        width: "8.5in",
        minHeight: "11in",
        margin: "0",
        backgroundColor: "#fff",
        boxSizing: "border-box"
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: "10px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>
        <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 2px 0" }}>
          {basics.name || "Your Name"}
        </h1>
        <p style={{ fontSize: "10px", margin: "2px 0", color: "#555", lineHeight: "1.3" }}>
          {basics.summary || ""}
        </p>
        <div style={{ fontSize: "10px", display: "flex", gap: "12px", flexWrap: "wrap", margin: "4px 0 0 0" }}>
          {basics.phone && <span>{basics.phone}</span>}
          {basics.phone && basics.email && <span>|</span>}
          {basics.email && <span>{basics.email}</span>}
          {basics.location && (
            <>
              {basics.email && <span>|</span>}
              <span>{basics.location}</span>
            </>
          )}
          {basics.github && (
            <>
              <span>|</span>
              <span>{basics.github}</span>
            </>
          )}
          {basics.linkedin && (
            <>
              <span>|</span>
              <span>{basics.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {/* EDUCATION */}
      {education && education.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{
            fontSize: "11px",
            fontWeight: "bold",
            margin: "6px 0 4px 0",
            borderBottom: "1px solid #000",
            paddingBottom: "2px"
          }}>
            EDUCATION
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 2px 0" }}>
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {edu.institution || ""}
                </span>
                <span style={{ fontSize: "10px" }}>{edu.dates || ""}</span>
              </div>
              {edu.degree && (
                <div style={{ fontSize: "10px", color: "#333" }}>
                  {edu.degree}
                  {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EXPERIENCE */}
      {experience && experience.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{
            fontSize: "11px",
            fontWeight: "bold",
            margin: "6px 0 4px 0",
            borderBottom: "1px solid #000",
            paddingBottom: "2px"
          }}>
            EXPERIENCE
          </h2>
          {experience.map((job, jidx) => (
            <div key={jidx} style={{ marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 2px 0" }}>
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {job.role || ""} | {job.company || ""}
                </span>
                <span style={{ fontSize: "10px" }}>{job.dates || ""}</span>
              </div>

               {job.projectName && (
                <div style={{ 
                  fontSize: "10px", 
                  fontStyle: "italic", 
                  color: "#444",
                  margin: "1px 0 2px 0"
                }}>
                  Project: {job.projectName}
                </div>
              )}
              {job.highlights && job.highlights.length > 0 && (
                <ul style={{ margin: "2px 0 0 0", paddingLeft: "20px", listStyleType: "disc" }}>
                  {job.highlights.map((h, hidx) => (
                    <li key={hidx} style={{ margin: "1px 0", fontSize: "10px", lineHeight: "1.4" }}>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{
            fontSize: "11px",
            fontWeight: "bold",
            margin: "6px 0 4px 0",
            borderBottom: "1px solid #000",
            paddingBottom: "2px"
          }}>
            PROJECTS
          </h2>
          {projects.map((proj, pidx) => (
            <div key={pidx} style={{ marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 2px 0" }}>
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {proj.name || ""}
                </span>
              </div>
              {proj.technologies && proj.technologies.length > 0 && (
                <div style={{ fontSize: "10px", color: "#333", margin: "1px 0" }}>
                  <strong>Tech:</strong> {proj.technologies.join(", ")}
                </div>
              )}
              {proj.description && (
                <div style={{ fontSize: "10px", margin: "1px 0" }}>
                  {proj.description}
                </div>
              )}
              {proj.highlights && proj.highlights.length > 0 && (
                <ul style={{ margin: "2px 0 0 0", paddingLeft: "20px", listStyleType: "disc" }}>
                  {proj.highlights.map((h, hidx) => (
                    <li key={hidx} style={{ margin: "1px 0", fontSize: "10px", lineHeight: "1.4" }}>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills && skills.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{
            fontSize: "11px",
            fontWeight: "bold",
            margin: "6px 0 4px 0",
            borderBottom: "1px solid #000",
            paddingBottom: "2px"
          }}>
            SKILLS
          </h2>
          {skills.map((skillGroup, sidx) => (
            skillGroup.items && skillGroup.items.length > 0 && (
              <div key={sidx} style={{ marginBottom: "3px" }}>
                <span style={{ fontWeight: "bold", fontSize: "10px" }}>
                  {skillGroup.category}:
                </span>
                <span style={{ fontSize: "10px", marginLeft: "6px" }}>
                  {skillGroup.items.join(", ")}
                </span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
});

ResumeTemplate.displayName = "ResumeTemplate";

export default ResumeTemplate;