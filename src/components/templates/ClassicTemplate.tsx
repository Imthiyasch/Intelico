import React from "react";
import { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TemplateProps {
  data: ResumeData;
}

export function ClassicTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects = [], achievements = [], languages = [] } = data;
  return (
    <div className="font-serif bg-white text-gray-900 w-full min-h-[1056px] p-12 print-area" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "11pt", lineHeight: 1.5 }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-5">
        <h1 className="text-3xl font-bold tracking-wide uppercase mb-1">{personalInfo.name || "Your Name"}</h1>
        <div className="text-sm flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span>·</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span>·</span><span>{personalInfo.location}</span></>}
          {personalInfo.linkedin && <><span>·</span><span>{personalInfo.linkedin}</span></>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <Section title="Professional Summary">
          <p className="text-sm leading-relaxed">{summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Professional Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <div className="font-bold text-sm">{exp.role}</div>
                <div className="text-xs text-gray-600 italic">
                  {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                </div>
              </div>
              <div className="italic text-sm text-gray-700 mb-1">{exp.company}</div>
              <ul className="list-disc pl-5 space-y-0.5">
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} className="text-xs leading-relaxed">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <div className="font-bold text-sm">{edu.degree} in {edu.field}</div>
                <div className="text-xs text-gray-600 italic">{edu.startYear} — {edu.endYear}</div>
              </div>
              <div className="text-sm text-gray-700 italic">{edu.institution}</div>
              {edu.gpa && <div className="text-xs text-gray-600">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          <p className="text-sm">{skills.join(" · ")}</p>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
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
                  <div className="text-xs text-gray-500 italic">
                    {proj.technologies.join(", ")}
                  </div>
                )}
              </div>
              <p className="text-xs leading-relaxed mt-0.5">{proj.description}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Section title="Key Achievements">
          <ul className="list-disc pl-5 space-y-0.5">
            {achievements.map((ach, i) => (
              <li key={i} className="text-xs leading-relaxed">{ach}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="Languages">
          <p className="text-sm">{languages.join(" · ")}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">{title}</h2>
      {children}
    </div>
  );
}
