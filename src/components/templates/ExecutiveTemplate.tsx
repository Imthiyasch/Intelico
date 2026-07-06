import React from "react";
import { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TemplateProps { data: ResumeData; }

export function ExecutiveTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects = [], achievements = [], languages = [], certifications = [], tools = [], references } = data;
  return (
    <div className="bg-white text-gray-800 w-full min-h-[1056px] p-12 print-area" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "10.5pt", lineHeight: 1.55 }}>
      {/* Two-column header */}
      <div className="flex justify-between items-start border-b-2 pb-4 mb-6" style={{ borderColor: "#1e3a5f" }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#1e3a5f" }}>{personalInfo.name || "Your Name"}</h1>
        </div>
        <div className="text-right text-xs" style={{ color: "#4b5563" }}>
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <ExecSection title="Executive Summary" />
          <p className="text-xs leading-relaxed italic">{summary}</p>
        </div>
      )}

      {/* Two-column body */}
      <div className="flex gap-8">
        {/* Main column */}
        <div className="flex-[2] space-y-5">
          {experience.length > 0 && (
            <div>
              <ExecSection title="Career History" />
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between">
                      <div className="font-bold text-sm" style={{ color: "#1e3a5f" }}>{exp.role}</div>
                      <div className="text-xs text-gray-500 italic">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</div>
                    </div>
                    <div className="text-xs italic text-gray-600 mb-1.5">{exp.company}</div>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="text-xs leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <ExecSection title="Key Projects" />
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="mb-3">
                    <div className="flex justify-between">
                      <div className="font-bold text-sm" style={{ color: "#1e3a5f" }}>
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
                    <p className="text-xs leading-relaxed mt-1">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <ExecSection title="Key Accomplishments" />
              <ul className="list-disc pl-5 space-y-0.5">
                {achievements.map((ach, i) => (
                  <li key={i} className="text-xs leading-relaxed">{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Side column */}
        <div className="flex-[1] space-y-5 pl-6" style={{ borderLeft: "1px solid #e5e7eb" }}>
          {education.length > 0 && (
            <div>
              <ExecSection title="Education" />
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="font-bold text-xs" style={{ color: "#1e3a5f" }}>{edu.degree}</div>
                  <div className="text-xs">{edu.field}</div>
                  <div className="text-xs italic text-gray-600">{edu.institution}</div>
                  <div className="text-xs text-gray-500">{edu.endYear}</div>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <ExecSection title="Core Competencies" />
              <ul className="space-y-1">
                {skills.map((s) => (
                  <li key={s} className="text-xs flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">▸</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <ExecSection title="Languages" />
              <ul className="space-y-1">
                {languages.map((l) => (
                  <li key={l} className="text-xs flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">▸</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <ExecSection title="Certifications" />
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="text-xs font-bold" style={{ color: "#1e3a5f" }}>{cert.name}</div>
                    {cert.issuer && <div className="text-xs italic text-gray-600">{cert.issuer}</div>}
                    {cert.date && <div className="text-xs text-gray-500">{cert.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          {tools.length > 0 && (
            <div>
              <ExecSection title="Tools" />
              <ul className="space-y-1">
                {tools.map((t) => (
                  <li key={t} className="text-xs flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">▸</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* References */}
          {references && references.trim() && (
            <div>
              <ExecSection title="References" />
              <p className="text-xs text-gray-700 whitespace-pre-line">{references}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecSection({ title }: { title: string }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-2.5 pb-1 border-b" style={{ color: "#1e3a5f", borderColor: "#dbeafe" }}>{title}</h2>
  );
}
