import React from "react";
import { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TemplateProps { data: ResumeData; }

export function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects = [], achievements = [], languages = [], certifications = [], tools = [], references } = data;
  return (
    <div className="bg-white text-gray-800 w-full min-h-[1056px] p-14 print-area" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: "10pt", lineHeight: 1.6 }}>
      {/* Name */}
      <div className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">{personalInfo.name || "Your Name"}</h1>
        <div className="text-xs text-gray-400 flex flex-wrap gap-x-5 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-7">
          <div className="h-px bg-gray-100 mb-4" />
          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-7">
          <div className="h-px bg-gray-100 mb-4" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Experience</h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <div className="font-medium text-sm text-gray-900">{exp.role}</div>
                  <div className="text-xs text-gray-500 mb-2">{exp.company}</div>
                  <ul className="space-y-1">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-2">
                        <span className="text-gray-300 flex-shrink-0">—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-xs text-gray-400 text-right whitespace-nowrap pt-0.5">
                  {formatDate(exp.startDate)}<br />{exp.current ? "Present" : formatDate(exp.endDate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-7">
          <div className="h-px bg-gray-100 mb-4" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <div className="font-medium text-sm text-gray-900">{edu.degree} — {edu.field}</div>
                  <div className="text-xs text-gray-500">{edu.institution}</div>
                </div>
                <div className="text-xs text-gray-400 text-right">{edu.startYear} – {edu.endYear}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <div className="h-px bg-gray-100 mb-4" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Skills</h2>
          <p className="text-xs text-gray-600">{skills.join("  ·  ")}</p>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-7">
          <div className="h-px bg-gray-100 mb-4" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-medium text-sm text-gray-900">
                    {proj.link ? (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                        {proj.name}
                      </a>
                    ) : (
                      proj.name
                    )}
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-xs text-gray-400">{proj.technologies.join(", ")}</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mb-7">
          <div className="h-px bg-gray-100 mb-4" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Achievements</h2>
          <ul className="space-y-1">
            {achievements.map((ach, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-2">
                <span className="text-gray-300 flex-shrink-0">—</span>
                {ach}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <div className="h-px bg-gray-100 mb-4" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Languages</h2>
          <p className="text-xs text-gray-600">{languages.join("  ·  ")}</p>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mt-6">
          <div className="h-px bg-gray-100 mb-4" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Certifications</h2>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-medium text-gray-800">{cert.name}</span>
                  {cert.issuer && <span className="text-xs text-gray-400 ml-2">· {cert.issuer}</span>}
                </div>
                {cert.date && <span className="text-xs text-gray-400">{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tools */}
      {tools.length > 0 && (
        <div className="mt-6">
          <div className="h-px bg-gray-100 mb-4" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Tools & Software</h2>
          <p className="text-xs text-gray-600">{tools.join("  ·  ")}</p>
        </div>
      )}

      {/* References */}
      {references && references.trim() && (
        <div className="mt-6">
          <div className="h-px bg-gray-100 mb-4" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">References</h2>
          <p className="text-xs text-gray-600 whitespace-pre-line">{references}</p>
        </div>
      )}
    </div>
  );
}
