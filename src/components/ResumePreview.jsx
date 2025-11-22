// components/ResumePreview.jsx
import React, { forwardRef } from "react";

const ResumePreview = forwardRef(({ resume }, ref) => {
  const basics = resume.basics || {};
  const work = resume.work || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const education = resume.education || [];
  const achievements = resume.achievements || [];

  return (
<div ref={ref} className="bg-white text-gray-900 p-6 md:p-10 w-full min-h-screen print:min-h-full print:p-0">
  <div className="w-full border px-6 py-6 md:px-10 md:py-10">

        <header className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{basics.name}</h1>
            <p className="text-sm text-gray-600 mt-1">{basics.summary}</p>
          </div>
          <div className="text-sm text-right md:text-left">
            <div>{basics.email}</div>
            <div>{basics.phone}</div>
            <div>{basics.location?.city}, {basics.location?.region}</div>
            <div className="mt-2">
              {basics.profiles?.map((p, i) => (
                <div key={i}>
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{p.network}</a>
                </div>
              ))}
            </div>
          </div>
        </header>

        <hr className="my-4" />

        <section className="mb-4">
          <h2 className="text-lg font-semibold">Work Experience</h2>
          <div className="space-y-3 mt-2">
            {work.map((w, idx) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{w.name} — {w.position}</div>
                    <div className="text-sm text-gray-600">{w.location}</div>
                  </div>
                  <div className="text-sm text-gray-600">{w.startDate} — {w.endDate}</div>
                </div>
                <div className="mt-2 text-sm">
                  {w.projects?.map((p, pi) => (
                    <div key={pi}>
                      <div className="font-medium">{p.name}</div>
                      <ul className="list-disc ml-5 mt-1">
                        {p.highlights?.map((h, hi) => <li key={hi}>{h}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-semibold">Projects</h2>
          <div className="mt-2 space-y-2 text-sm">
            {projects.map((p, i) => (
              <div key={i}>
                <div className="font-medium">{p.name} <span className="text-xs text-gray-500">— {p.type}</span></div>
                <div className="text-sm">{p.highlights?.map((h, idx) => <div key={idx}>• {h}</div>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Education</h3>
            <div className="text-sm mt-1">
              {education.map((e, i) => (
                <div key={i}>
                  <div className="font-medium">{e.institution}</div>
                  <div className="text-gray-600">{e.studyType} — {e.area}</div>
                  <div className="text-gray-600">{e.startDate} - {e.endDate}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((s, i) => s.keywords.map((k, ki) => (
                <span key={`${i}-${ki}`} className="text-sm border px-2 py-1 rounded">{k}</span>
              )))}
            </div>

            <h3 className="font-semibold mt-4">Achievements</h3>
            <ul className="list-disc ml-5 text-sm mt-1">
              {achievements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
});

export default ResumePreview;
