import React from "react";
import { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TemplateProps { data: ResumeData; }

export function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects = [], achievements = [], languages = [], certifications = [], tools = [], references } = data;
  const ACCENT = "#2563EB";
  return (
    <div className="bg-white text-gray-800 w-full min-h-[1056px] print-area" style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", fontSize: "10.5pt" }}>
      {/* Header bar */}
      <div className="px-10 py-8" style={{ borderBottom: `3px solid ${ACCENT}` }}>
        <h1 className="text-3xl font-bold mb-1 tracking-tight" style={{ color: "#0f172a" }}>{personalInfo.name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "#64748b" }}>
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo.portfolio && <span>🌐 {personalInfo.portfolio}</span>}
        </div>
      </div>

      <div className="px-10 py-6 space-y-5">
        {summary && (
          <div>
            <SectionHead title="Summary" accent={ACCENT} />
            <p className="text-xs leading-relaxed text-gray-700">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SectionHead title="Experience" accent={ACCENT} />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-sm" style={{ color: "#0f172a" }}>{exp.role}</span>
                    <span className="text-xs text-gray-500">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  <div className="text-xs font-medium mb-1.5" style={{ color: ACCENT }}>{exp.company}</div>
                  <ul className="space-y-0.5 pl-4">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-xs text-gray-700 list-disc">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SectionHead title="Education" accent={ACCENT} />
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <div className="font-semibold text-xs" style={{ color: "#0f172a" }}>{edu.degree} in {edu.field}</div>
                    <div className="text-xs text-gray-600">{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div>
                  </div>
                  <div className="text-xs text-gray-500">{edu.startYear} – {edu.endYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <SectionHead title="Skills" accent={ACCENT} />
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#dbeafe", color: ACCENT }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <SectionHead title="Projects" accent={ACCENT} />
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-xs text-slate-900">
                      {proj.link ? (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                          {proj.name}
                        </a>
                      ) : (
                        proj.name
                      )}
                    </span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-xs text-gray-500">{proj.technologies.join(", ")}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <SectionHead title="Achievements" accent={ACCENT} />
            <ul className="space-y-1 pl-4">
              {achievements.map((ach, i) => (
                <li key={i} className="text-xs text-gray-700 list-disc">{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <SectionHead title="Languages" accent={ACCENT} />
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <span key={l} className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#f1f5f9", color: "#475569" }}>{l}</span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <SectionHead title="Certifications" accent={ACCENT} />
            <div className="space-y-1">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-semibold text-slate-800">{cert.name}</span>
                    {cert.issuer && <span className="text-xs text-gray-500 ml-2">· {cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="text-xs text-gray-400">{cert.date}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <div>
            <SectionHead title="Tools & Software" accent={ACCENT} />
            <div className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#ecfdf5", color: "#059669" }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references && references.trim() && (
          <div>
            <SectionHead title="References" accent={ACCENT} />
            <p className="text-xs text-gray-700 whitespace-pre-line">{references}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHead({ title, accent }: { title: string; accent: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: accent, opacity: 0.25 }} />
    </div>
  );
}
