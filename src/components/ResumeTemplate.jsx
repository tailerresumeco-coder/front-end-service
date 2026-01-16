import React, { useEffect, useRef, useState } from "react";
import '../components/styles.css';

/**
 * Shared resume template for Preview and PDF
 * FIXED: Safely handles missing dates and prevents .trim() errors
 */
const ResumeTemplate = React.forwardRef(({ resume }, ref) => {
  if (!resume?.basics) {
    return (
      <div ref={ref} style={{ padding: "40px", textAlign: "center", color: "#999" }}>
        No resume data available
      </div>
    );
  }

  const zoomRef = useRef(null);
  const [highlightSkills, setHighlightSkills] = useState();

  const mailTo = () => {
    window.location.href = `mailto:${resume.basics.email}`
  }

  const { basics, education, experience, projects, skills, certifications } = resume;

  // Group experience entries by company to show them together
  const groupedExperience = groupExperienceByCompany(experience || []);
  const hasExperience = groupedExperience && groupedExperience.length > 0;

  const [zoomStyle, setZoomStyle] = useState({});
  const [zoomPx, setZoomPx] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const changeToBold = () => {
    resume?.highlight_keywords?.forEach(keyword => {
      document.querySelectorAll("#experience-highlights li").forEach(li => {
        if (li.textContent.includes(keyword)) {
          li.innerHTML = (li.innerHTML.trim()).replace(keyword, `<span style="font-weight: bold;">${keyword}</span>`);
        }
      });
    })
  }

  useEffect(() => {
    changeToBold();
    const node = zoomRef.current;
    if (!node) return;

    const handleOnWheel = (e) => {
      if (e.ctrlKey) {
        console.log('zooming');
        
        e.preventDefault();
        e.stopPropagation();

        const { left, top, width, height } = node.getBoundingClientRect();
        
        // Fixed math for scroll positions
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setOrigin({ x, y });

        // Using a functional update for state to ensure accuracy
        setZoomPx(prev => {
          let next = e.deltaY < 0 ? prev + 0.1 : prev - 0.1;
          return next < 1 ? 1 : next;
        });
      }
    };

    // The "secret sauce" that stops the error:
    node.addEventListener('wheel', handleOnWheel, { passive: false });

    return () => node.removeEventListener('wheel', handleOnWheel);
  }, []);

  return (
    <div ref={zoomRef}>
      <div
        ref={ref}
        data-testid="resume-preview"
        style={{
          fontFamily: "'Calibri', 'Arial', sans-serif",
          fontSize: "12px",
          lineHeight: "1.4",
          color: "#000",
          minHeight: "11in",
          margin: "0",
          backgroundColor: "#fff",
          boxSizing: "border-box",
          transform: `scale(${zoomPx})`,
          transformOrigin: `${origin.x}% ${origin.y}%`, // Use percentage for origin
          ...zoomStyle,
        }}
        className="main-container"
      >
        {/* HEADER */}
        <div style={{}}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 2px 0", textAlign: "center" }}>
            {basics.name || "Your Name"}
          </h1>

          <div style={{ fontSize: "14px", display: "flex", gap: "3px", flexWrap: "wrap", justifyContent: "center", margin: "4px 0 0 0" }}>
            {basics.phone && <a href={`tel:${basics.phone}`} className="hyperlink"> {basics.phone} </a>}
            {basics.phone && basics.email && <span>|</span>}
            {basics.email && <a href={`mailto:${basics.email}`} className="hyperlink"> {basics.email} </a>}
            {basics.location && (
              <>
                {basics.email && <span>|</span>}
                <span>{basics.location}</span>
              </>
            )}
            {basics.github && (
              <>
                <span>|</span>
                <a href={basics.github} className="hyperlink" target="_blank">
                  Github
                </a>
              </>
            )}
            {basics.leetcode && (
              <>
                <span>|</span>
                <a href={basics.leetcode} className="hyperlink" target="_blank">
                  Leetcode
                </a>
              </>
            )}
            {basics.linkedin && (
              <>
                <span>|</span>
                <a href={basics.linkedin} className="hyperlink" target="_blank">
                  Linkedin
                </a>
              </>
            )}
            {basics.other && (
              <>
                <span>|</span>
                <a href={basics.other} className="hyperlink" target="_blank">
                  {basics.other}
                </a>
              </>
            )}
          </div>
          <div>
            <h2 style={{
              fontSize: "14px",
              fontWeight: "bold",
              borderBottom: "1px solid #000"
            }}>
              SUMMARY
            </h2>
            <p style={{ fontSize: "12px", margin: "2px 0", color: "#000", lineHeight: "1.3" }}>
              {basics.summary || ""}
            </p>
          </div>
        </div>

          {skills && skills.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <h2 style={{
              fontSize: "14px",
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
                  <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                    {skillGroup.category}:
                  </span>
                  <span style={{ fontSize: "12px", marginLeft: "6px" }}>
                    {skillGroup.items.join(", ")}
                  </span>
                </div>
              )
            ))}
          </div>
        )}

        {hasExperience ? (
          <>
            {/* EXPERIENCE - Grouped by Company */}
            {groupedExperience && groupedExperience.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <h2 style={{
                  fontSize: "14px",
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
                      <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                        {company.role || ""} | {company.company || ""}
                        {company.location && `, ${company.location}`}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>{company.overallDuration || ""}</span>
                    </div>

                    {/* Multiple Projects under this company */}
                    {company.projects.map((project, pidx) => (
                      <div key={pidx} style={{ marginBottom: "4px", marginLeft: "10px" }}>
                        {/* Project Name and Duration */}
                        {project.projectName && (
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "12px",
                            fontStyle: "italic",
                            color: "#000",
                            margin: "2px 0"
                          }}>
                            <span style={{fontWeight: "bold"}}>Project: {project.projectName}</span>
                            {/* <span style={{fontWeight: "bold"}}>{project?.dates || ""}</span> */}
                          </div>
                        )}

                        {/* Project Responsibilities */}
                        {project.highlights && project.highlights.length > 0 && (
                          <ul style={{ margin: "2px 0 0 0", paddingLeft: "20px", listStyleType: "disc" }}  id="experience-highlights">
                            {project.highlights.map((h, hidx) => (
                              <li key={hidx} style={{ margin: "1px 0", fontSize: "12px", lineHeight: "1.4", paddingRight: "15px" }}>
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
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "6px 0 4px 0",
                  borderBottom: "1px solid #000",
                  paddingBottom: "2px"
                }}>
                  PROJECTS
                </h2>
                {projects.map((proj, pidx) => (
                  <div key={pidx} style={{ marginBottom: "6px" }}>
                    <div style={{ display: "flex", margin: "0 0 2px 0" }}>
                      <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                        {proj.name || ""}
                      </span> <strong> | </strong>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span style={{ fontSize: "12px", color: "#000", fontWeight: "bold" }}>
                          {proj.technologies.join(", ")}
                        </span>
                      )}
                    </div>
                
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "20px", listStyleType: "disc" }} id="experience-highlights">
                        {proj.highlights.map((h, hidx) => (
                          <li key={hidx} style={{ margin: "1px 0", fontSize: "12px", lineHeight: "1.4", paddingRight: "15px" }}>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION */}
            {education && education.length > 0 && (
              <div style={{ marginBottom: "3px" }}>
                <h2 style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "4px 0 4px 0",
                  borderBottom: "1px solid #000",
                }}>
                  EDUCATION
                </h2>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: "2px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 2px 0" }}>
                      <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                        {edu.institution || ""}
                      </span>
                      <span className="dates" style={{ fontSize: "12px", fontWeight: "bold" }}>{edu.dates || ""}</span>
                    </div>
                    {edu.degree && (
                      <div style={{ fontSize: "12px", color: "#000" }}>
                        {edu.degree}
                        {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CERTIFICATIONS */}
            {certifications && certifications.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <h2 style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "6px 0 4px 0",
                  borderBottom: "1px solid #000",
                  paddingBottom: "2px"
                }}>
                  CERTIFICATIONS
                </h2>
                <ul style={{ margin: "2px 0 0 0", paddingLeft: "20px", listStyleType: "disc" }}>
                  {certifications.map((cert, cidx) => (
                    <li key={cidx} style={{ margin: "1px 0", fontSize: "10px", lineHeight: "1.4", paddingRight: "15px" }}>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            {/* EDUCATION */}
            {education && education.length > 0 && (
              <div style={{ marginBottom: "3px" }}>
                <h2 style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "4px 0 4px 0",
                  borderBottom: "1px solid #000",
                }}>
                  EDUCATION
                </h2>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: "2px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 2px 0" }}>
                      <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                        {edu.institution || ""}
                      </span>
                      <span className="dates" style={{ fontSize: "12px", fontWeight: "bold" }}>{edu.dates || ""}</span>
                    </div>
                    {edu.degree && (
                      <div style={{ fontSize: "12px", color: "#000" }}>
                        {edu.degree}
                        {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS */}
            {projects && projects.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <h2 style={{
                  fontSize: "14px",
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
                      <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                        {proj.name || ""}
                      </span>
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div style={{ fontSize: "12px", color: "#000", margin: "1px 0" }}>
                        <strong>Technologies:</strong> {proj.technologies.join(", ")}
                      </div>
                    )}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "20px", listStyleType: "disc" }}>
                        {proj.highlights.map((h, hidx) => (
                          <li key={hidx} style={{ margin: "1px 0", fontSize: "10px", lineHeight: "1.4", paddingRight: "15px" }}>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CERTIFICATIONS */}
            {certifications && certifications.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <h2 style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "6px 0 4px 0",
                  borderBottom: "1px solid #000",
                  paddingBottom: "2px"
                }}>
                  CERTIFICATIONS
                </h2>
                <ul style={{ margin: "2px 0 0 0", paddingLeft: "20px", listStyleType: "disc" }}>
                  {certifications.map((cert, cidx) => (
                    <li key={cidx} style={{ margin: "1px 0", fontSize: "10px", lineHeight: "1.4", paddingRight: "15px" }}>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

/**
 * Helper function to group experience entries by company
 * FIXED: Safely handles missing or undefined dates
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
        overallDuration: exp.dates || "",
        projects: []
      };
    }

    grouped[key].projects.push({
      projectName: exp.projectName,
      dates: exp.dates || "",
      highlights: exp.highlights
    });
  });

  // Calculate overall duration for each company
  Object.values(grouped).forEach(company => {
    if (company.projects.length > 1) {
      // Find earliest start and latest end date
      const dates = company.projects
        .map(p => p.dates)
        .filter(d => d && typeof d === 'string' && d.trim().length > 0);

      if (dates.length > 0) {
        try {
          // FIXED: Safely split and trim dates
          const firstProjectDate = dates[dates.length - 1];
          const lastProjectDate = dates[0];

          const firstPart = firstProjectDate.split('–')[0];
          const lastPart = lastProjectDate.split('–')[1];

          if (firstPart && lastPart) {
            company.overallDuration = `${firstPart.trim()} – ${lastPart.trim()}`;
          }
        } catch (error) {
          console.warn("Error calculating overall duration:", error);

          company.overallDuration = dates[0] || "";          // Fallback: keep first project's duration
        } 
      }
    }
  });

  return Object.values(grouped);
}

ResumeTemplate.displayName = "ResumeTemplate";

export default ResumeTemplate;