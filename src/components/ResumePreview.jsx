// components/ResumePreview.jsx
import React, { forwardRef } from "react";

const ResumePreview = React.forwardRef(({ resume }, ref) => {
  if (!resume || !resume.basics) return null;

  const { basics, education, work, projects, skills } = resume;

  return (
    <div
      ref={ref}
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
      {/* Header */}
      <div style={{ marginBottom: "10px", borderBottom: "2px solid #000", paddingBottom: "8px" }}>
        <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 2px 0" }}>
          {basics.name}
        </h1>
        <p style={{ fontSize: "10px", margin: "2px 0", color: "#555", lineHeight: "1.3" }}>
          {basics.summary}
        </p>
        <div style={{ fontSize: "10px", display: "flex", gap: "12px", flexWrap: "wrap", margin: "4px 0 0 0" }}>
          <span>{basics.phone}</span>
          <span>|</span>
          <span>{basics.email}</span>
          {basics.location && (
            <>
              <span>|</span>
              <span>{basics.location.city}, {basics.location.region}</span>
            </>
          )}
          {basics.profiles?.map((p, i) => (
            <React.Fragment key={i}>
              <span>|</span>
              <span>{p.network}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Education */}
      {education && education.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: "bold", margin: "6px 0 4px 0", borderBottom: "1px solid #000", paddingBottom: "2px" }}>
            EDUCATION
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 2px 0" }}>
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>{edu.institution}</span>
                <span style={{ fontSize: "10px" }}>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={{ fontSize: "10px", color: "#333" }}>
                {edu.studyType} | GPA: {edu.score}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {work && work.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: "bold", margin: "6px 0 4px 0", borderBottom: "1px solid #000", paddingBottom: "2px" }}>
            EXPERIENCE
          </h2>
          {work.map((job, jidx) => (
            <div key={jidx} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 2px 0" }}>
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>{job.position} | {job.name}</span>
                <span style={{ fontSize: "10px" }}>{job.startDate} – {job.endDate}</span>
              </div>
              {job.projects?.map((proj, pidx) => (
                <div key={pidx} style={{ marginBottom: "4px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "10px", margin: "2px 0" }}>
                    Project: {proj.name}
                  </div>
                  <ul style={{ margin: "2px 0 4px 0", paddingLeft: "20px", listStyleType: "disc" }}>
                    {proj.highlights?.map((h, hidx) => (
                      <li key={hidx} style={{ margin: "1px 0", fontSize: "10px", lineHeight: "1.4" }}>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: "bold", margin: "6px 0 4px 0", borderBottom: "1px solid #000", paddingBottom: "2px" }}>
            PERSONAL PROJECTS
          </h2>
          {projects.map((proj, pidx) => (
            <div key={pidx} style={{ marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 2px 0" }}>
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {proj.name} | {proj.type}
                </span>
                <span style={{ fontSize: "10px" }}>{proj.startDate} – {proj.endDate}</span>
              </div>
              {proj.technologies && (
                <div style={{ fontSize: "10px", color: "#333", margin: "1px 0" }}>
                  {proj.technologies}
                </div>
              )}
              <ul style={{ margin: "2px 0", paddingLeft: "20px", listStyleType: "disc" }}>
                {proj.highlights?.map((h, hidx) => (
                  <li key={hidx} style={{ margin: "1px 0", fontSize: "10px", lineHeight: "1.4" }}>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div>
          <h2 style={{ fontSize: "11px", fontWeight: "bold", margin: "6px 0 4px 0", borderBottom: "1px solid #000", paddingBottom: "2px" }}>
            SKILLS & CERTIFICATIONS
          </h2>
          {skills.map((skillGroup, sidx) => (
            <div key={sidx} style={{ marginBottom: "4px" }}>
              <span style={{ fontWeight: "bold", fontSize: "10px" }}>
                {skillGroup.name}:
              </span>
              <span style={{ fontSize: "10px", marginLeft: "6px" }}>
                {skillGroup.keywords?.join(", ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
