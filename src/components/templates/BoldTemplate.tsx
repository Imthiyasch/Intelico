import React from "react";
import { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TemplateProps { data: ResumeData; }

export function BoldTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects = [], achievements = [], languages = [], certifications = [], tools = [], references } = data;
  return (
    <div className="bg-white text-gray-800 w-full min-h-[1056px] print-area" style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", fontSize: "10.5pt" }}>
      {/* Dark Header */}
      <div className="px-10 py-8" style={{ background: "#111827" }}>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">{personalInfo.name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "#9ca3af" }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Skills strip */}
      {skills.length > 0 && (
        <div className="px-10 py-3 flex flex-wrap gap-2" style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
          {skills.map((s) => (
            <span key={s} className="px-2.5 py-0.5 rounded text-xs font-semibold" style={{ background: "#111827", color: "#f9fafb" }}>{s}</span>
          ))}
        </div>
      )}

      <div className="px-10 py-6 space-y-6">
        {summary && (
          <div>
            <BoldSection title="Profile" />
            <p className="text-xs leading-relaxed">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <BoldSection title="Experience" />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: "#111827" }}>
                  <div className="flex justify-between">
                    <div className="font-bold text-sm">{exp.role}</div>
                    <div className="text-xs" style={{ color: "#6b7280" }}>{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</div>
                  </div>
                  <div className="text-xs font-semibold mb-2" style={{ color: "#374151" }}>{exp.company}</div>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-xs">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <BoldSection title="Education" />
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between mb-2">
                <div>
                  <div className="font-bold text-xs">{edu.degree} in {edu.field}</div>
                  <div className="text-xs" style={{ color: "#6b7280" }}>{edu.institution}</div>
                </div>
                <div className="text-xs" style={{ color: "#6b7280" }}>{edu.startYear} – {edu.endYear}</div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <BoldSection title="Projects" />
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="border-l-2 pl-4" style={{ borderColor: "#111827" }}>
                  <div className="flex justify-between">
                    <div className="font-bold text-sm">
                      {proj.link ? (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                          {proj.name}
                        </a>
                      ) : (
                        proj.name
                      )}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-xs text-gray-500 italic">{proj.technologies.join(", ")}</span>
                    )}
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <BoldSection title="Achievements" />
            <ul className="list-disc pl-4 space-y-0.5">
              {achievements.map((ach, i) => (
                <li key={i} className="text-xs">{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <BoldSection title="Languages" />
            <p className="text-xs">{languages.join("  ·  ")}</p>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <BoldSection title="Certifications" />
            <div className="space-y-1.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold">{cert.name}</span>
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
            <BoldSection title="Tools & Software" />
            <div className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <span key={t} className="px-2.5 py-0.5 rounded text-xs font-medium" style={{ background: "#f0fdf4", color: "#16a34a" }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references && references.trim() && (
          <div>
            <BoldSection title="References" />
            <p className="text-xs whitespace-pre-line">{references}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BoldSection({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: "#111827" }}>{title}</h2>
      <div className="flex-1 h-0.5" style={{ background: "#111827" }} />
    </div>
  );
}
