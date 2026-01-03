import React from "react";

/**
 * Shared resume template for Preview and PDF
 * Handles nested projects under experience
 */
const ResumeTemplate = React.forwardRef(({ resume }, ref) => {
  if (!resume?.basics) {
    return (
      <div ref={ref} style={{ padding: "40px", textAlign: "center", color: "#999" }}>
        No resume data available
      </div>
    );
  }

  const { basics, education, experience, projects, skills, certifications } = resume;

  // Group experience entries by company to show them together
  const groupedExperience = groupExperienceByCompany(experience || []);

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
        <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 2px 0" ,textAlign:"center"}}>
          {basics.name || "Your Name"}
        </h1>
        
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
              <span style={{ fontSize: "9px", wordBreak: "break-all" }}>
                {basics.github.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            </>
          )}
          {basics.leetcode && (
            <>
              <span>|</span>
              <span style={{ fontSize: "9px", wordBreak: "break-all" }}>
                {basics.leetcode.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            </>
          )}
          {basics.linkedin && (
            <>
              <span>|</span>
              <span style={{ fontSize: "9px", wordBreak: "break-all" }}>
                {basics.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            </>
          )}
          {basics.other && (
            <>
              <span>|</span>
              <span style={{ fontSize: "9px", wordBreak: "break-all" }}>
                {basics.other.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            </>
          )}
        </div>
        <div style={{borderTop:"1px solid #000"}}>
           <h2 style={{
            fontSize: "11px",
            fontWeight: "bold",
            margin: "6px 0 4px 0",
            paddingBottom: "2px"
          }}>
           SUMMARY 
          </h2>
        <p style={{ fontSize: "10px", margin: "2px 0", color: "#000", lineHeight: "1.3" }}>
          {basics.summary || ""}
        </p>
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
            <div key={idx} style={{ marginBottom: "2px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 2px 0" }}>
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {edu.institution || ""}
                </span>
                <span style={{ fontSize: "10px" }}>{edu.dates || ""}</span>
              </div>
              {edu.degree && (
                <div style={{ fontSize: "10px", color: "#000" }}>
                  {edu.degree}
                  {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EXPERIENCE - Grouped by Company */}
      {groupedExperience && groupedExperience.length > 0 && (
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
          {groupedExperience.map((company, cidx) => (
            <div key={cidx} style={{ marginBottom: "8px" }}>
              {/* Company Header (shown once per company) */}
              <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 4px 0" }}>
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {company.role || ""} | {company.company || ""}
                  {company.location && `, ${company.location}`}
                </span>
                <span style={{ fontSize: "10px" }}>{company.overallDuration || ""}</span>
              </div>

              {/* Multiple Projects under this company */}
              {company.projects.map((project, pidx) => (
                <div key={pidx} style={{ marginBottom: "4px", marginLeft: "10px" }}>
                  {/* Project Name and Duration */}
                  {project.projectName && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "10px",
                      fontStyle: "italic",
                      color: "#000",
                      margin: "2px 0"
                    }}>
                      <span>Project: {project.projectName}</span>
                      <span>{project.dates}</span>
                    </div>
                  )}

                  {/* Project Responsibilities */}
                  {project.highlights && project.highlights.length > 0 && (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "20px", listStyleType: "disc" }}>
                      {project.highlights.map((h, hidx) => (
                        <li key={hidx} style={{ margin: "1px 0", fontSize: "10px", lineHeight: "1.4" }}>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
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
                <div style={{ fontSize: "10px", color: "#000", margin: "1px 0" }}>
                  <strong>Technologies:</strong> {proj.technologies.join(", ")}
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

      {/* CERTIFICATIONS */}
      {certifications && certifications.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{
            fontSize: "11px",
            fontWeight: "bold",
            margin: "6px 0 4px 0",
            borderBottom: "1px solid #000",
            paddingBottom: "2px"
          }}>
            CERTIFICATIONS
          </h2>
          <ul style={{ margin: "2px 0 0 0", paddingLeft: "20px", listStyleType: "disc" }}>
            {certifications.map((cert, cidx) => (
              <li key={cidx} style={{ margin: "1px 0", fontSize: "10px", lineHeight: "1.4" }}>
                {cert}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

/**
 * Helper function to group experience entries by company
 * Groups multiple projects under the same company/role
 */
function groupExperienceByCompany(experience) {
  const grouped = {};

  experience.forEach(exp => {
    const key = `${exp.company}-${exp.role}`;
    
    if (!grouped[key]) {
      grouped[key] = {
        role: exp.role,
        company: exp.company,
        location: exp.location,
        overallDuration: exp.dates,
        projects: []
      };
    }

    grouped[key].projects.push({
      projectName: exp.projectName,
      dates: exp.dates,
      highlights: exp.highlights
    });
  });

  // Calculate overall duration for each company
  Object.values(grouped).forEach(company => {
    if (company.projects.length > 1) {
      // Find earliest start and latest end date
      const dates = company.projects
        .map(p => p.dates)
        .filter(Boolean);
      
      if (dates.length > 0) {
        // Simple approach: use first and last project dates
        company.overallDuration = `${dates[dates.length - 1].split('–')[0].trim()} – ${dates[0].split('–')[1].trim()}`;
      }
    }
  });

  return Object.values(grouped);
}

ResumeTemplate.displayName = "ResumeTemplate";

export default ResumeTemplate;