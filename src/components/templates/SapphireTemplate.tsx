import React from "react";
import { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TemplateProps {
  data: ResumeData;
}

export function SapphireTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    achievements = [],
    languages = [],
    certifications = [],
    tools = [],
    references,
  } = data;

  const PRIMARY = "#002D62"; // Deep navy blue accent

  return (
    <div
      className="bg-white text-gray-900 w-full min-h-[1056px] p-10 sm:p-12 print-area"
      style={{
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "10.5pt",
        lineHeight: 1.45,
      }}
    >
      {/* Header */}
      <div className="flex flex-row items-start justify-between gap-6 mb-6">
        <div className="flex-1">
          <h1
            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide mb-1"
            style={{ color: PRIMARY }}
          >
            {personalInfo.name || "YOUR NAME"}
          </h1>

          {(data.jobRole || personalInfo.name) && (
            <div className="text-sm font-bold text-gray-800 mb-2">
              {data.jobRole || "Professional Title"}
            </div>
          )}

          <div className="text-xs text-gray-700 space-y-1">
            <div className="flex flex-wrap items-center gap-x-2">
              {personalInfo.phone && <span>Phone: {personalInfo.phone}</span>}
              {personalInfo.phone && personalInfo.email && <span>|</span>}
              {personalInfo.email && (
                <span>
                  Email:{" "}
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {personalInfo.email}
                  </a>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-2">
              {personalInfo.location && (
                <span>Location: {personalInfo.location}</span>
              )}
              {personalInfo.location && personalInfo.nationality && (
                <span>|</span>
              )}
              {personalInfo.nationality && (
                <span>Nationality: {personalInfo.nationality}</span>
              )}
            </div>

            {personalInfo.linkedin && (
              <div>
                LinkedIn:{" "}
                <a
                  href={
                    personalInfo.linkedin.startsWith("http")
                      ? personalInfo.linkedin
                      : `https://${personalInfo.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {personalInfo.linkedin}
                </a>
              </div>
            )}

            {personalInfo.portfolio && (
              <div>
                Portfolio:{" "}
                <a
                  href={
                    personalInfo.portfolio.startsWith("http")
                      ? personalInfo.portfolio
                      : `https://${personalInfo.portfolio}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {personalInfo.portfolio}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Optional Profile Photo */}
        {personalInfo.photo && (
          <div className="flex-shrink-0">
            <img
              src={personalInfo.photo}
              alt={personalInfo.name || "Profile"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-slate-300 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <SapphireSection title="PROFESSIONAL SUMMARY" primary={PRIMARY}>
          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
            {summary}
          </p>
        </SapphireSection>
      )}

      {/* Educational Qualifications */}
      {education.length > 0 && (
        <SapphireSection title="EDUCATIONAL QUALIFICATIONS" primary={PRIMARY}>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs sm:text-sm">
                <div className="flex items-start">
                  <span className="text-gray-900 mr-2 font-bold">•</span>
                  <div>
                    <span className="font-bold text-gray-900">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </span>
                    {(edu.startYear || edu.endYear) && (
                      <span className="font-semibold text-gray-800 ml-1">
                        | {edu.startYear ? `${edu.startYear} – ` : ""}
                        {edu.endYear || ""}
                      </span>
                    )}
                    {edu.institution && (
                      <div className="text-gray-700 text-xs mt-0.5">
                        {edu.institution}
                        {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SapphireSection>
      )}

      {/* Core Skills */}
      {skills.length > 0 && (
        <SapphireSection title="CORE SKILLS" primary={PRIMARY}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:text-sm">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-gray-900 mr-2 font-bold">•</span>
                <span className="text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
        </SapphireSection>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <SapphireSection title="PROFESSIONAL EXPERIENCE" primary={PRIMARY}>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs sm:text-sm">
                <div className="font-bold text-gray-900 flex flex-wrap items-baseline gap-x-2">
                  <span>{exp.role}</span>
                  {(exp.startDate || exp.endDate) && (
                    <span className="font-semibold text-gray-700">
                      | | {formatDate(exp.startDate)} –{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  )}
                </div>
                {exp.company && (
                  <div className="text-xs text-gray-700 font-medium mb-1.5">
                    {exp.company}
                  </div>
                )}
                <ul className="space-y-1 pl-1">
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex items-start text-xs text-gray-800 leading-relaxed">
                      <span className="mr-2 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SapphireSection>
      )}

      {/* Certifications & Training */}
      {certifications.length > 0 && (
        <SapphireSection title="CERTIFICATIONS & TRAINING" primary={PRIMARY}>
          <div className="space-y-2 text-xs sm:text-sm">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-start">
                <span className="text-gray-900 mr-2 font-bold">•</span>
                <div>
                  <span className="font-bold text-gray-900">{cert.name}</span>
                  {cert.issuer && (
                    <span className="text-gray-700"> – {cert.issuer}</span>
                  )}
                  {cert.date && (
                    <span className="text-gray-600 text-xs ml-1">
                      ({cert.date})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SapphireSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <SapphireSection title="KEY PROJECTS" primary={PRIMARY}>
          <div className="space-y-3 text-xs sm:text-sm">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-start justify-between">
                  <div className="font-bold text-gray-900">
                    {proj.link ? (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {proj.name}
                      </a>
                    ) : (
                      proj.name
                    )}
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-xs text-gray-600 italic">
                      {proj.technologies.join(", ")}
                    </div>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-gray-800 mt-0.5 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SapphireSection>
      )}

      {/* Technical Skills / Tools */}
      {tools.length > 0 && (
        <SapphireSection title="TECHNICAL SKILLS" primary={PRIMARY}>
          <div className="flex items-start text-xs sm:text-sm">
            <span className="text-gray-900 mr-2 font-bold">•</span>
            <span className="text-gray-800">{tools.join(", ")}</span>
          </div>
        </SapphireSection>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <SapphireSection title="KEY ACHIEVEMENTS" primary={PRIMARY}>
          <ul className="space-y-1 pl-1 text-xs sm:text-sm">
            {achievements.map((ach, idx) => (
              <li key={idx} className="flex items-start text-gray-800">
                <span className="mr-2 font-bold">•</span>
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </SapphireSection>
      )}

      {/* Languages Known */}
      {languages.length > 0 && (
        <SapphireSection title="LANGUAGES KNOWN" primary={PRIMARY}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs sm:text-sm">
            {languages.map((lang, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-gray-900 mr-2 font-bold">•</span>
                <span className="text-gray-800">{lang}</span>
              </div>
            ))}
          </div>
        </SapphireSection>
      )}

      {/* Personal Information */}
      {(personalInfo.dateOfBirth ||
        personalInfo.visaStatus ||
        personalInfo.nationality) && (
        <SapphireSection title="PERSONAL INFORMATION" primary={PRIMARY}>
          <div className="space-y-1 text-xs sm:text-sm text-gray-800">
            {personalInfo.dateOfBirth && (
              <div>
                <span className="font-semibold text-gray-900">
                  Date of Birth:
                </span>{" "}
                {personalInfo.dateOfBirth}
              </div>
            )}
            {personalInfo.nationality && (
              <div>
                <span className="font-semibold text-gray-900">
                  Nationality:
                </span>{" "}
                {personalInfo.nationality}
              </div>
            )}
            {personalInfo.visaStatus && (
              <div>
                <span className="font-semibold text-gray-900">
                  Visa Status:
                </span>{" "}
                {personalInfo.visaStatus}
              </div>
            )}
          </div>
        </SapphireSection>
      )}

      {/* References */}
      {references && (
        <SapphireSection title="REFERENCES" primary={PRIMARY}>
          <p className="text-xs text-gray-800">{references}</p>
        </SapphireSection>
      )}
    </div>
  );
}

function SapphireSection({
  title,
  primary,
  children,
}: {
  title: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="text-xs sm:text-sm font-bold tracking-wider uppercase" style={{ color: primary }}>
        {title}
      </div>
      {/* Diamond Divider Line */}
      <div className="flex items-center my-1.5">
        <div
          className="w-1.5 h-1.5 rotate-45 flex-shrink-0"
          style={{ backgroundColor: primary }}
        />
        <div className="flex-1 h-[1px]" style={{ backgroundColor: primary }} />
        <div
          className="w-1.5 h-1.5 rotate-45 flex-shrink-0"
          style={{ backgroundColor: primary }}
        />
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
