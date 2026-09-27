import React from "react";
import { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TemplateProps {
  data: ResumeData;
}

export function ElegantTemplate({ data }: TemplateProps) {
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

  const hasPhoto = Boolean(personalInfo.photo);

  return (
    <div
      className="bg-white text-gray-900 w-full min-h-[1056px] p-10 sm:p-12 print-area"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', 'Cambria', serif",
        fontSize: "10.5pt",
        lineHeight: 1.45,
      }}
    >
      {/* Header */}
      <div
        className={`mb-6 ${
          hasPhoto
            ? "flex flex-row items-start justify-between gap-6"
            : "text-center"
        }`}
      >
        <div className={hasPhoto ? "flex-1" : "max-w-2xl mx-auto"}>
          <h1 className="text-3xl font-bold tracking-tight text-gray-950 mb-1">
            {personalInfo.name || "Your Name"}
          </h1>

          {(data.jobRole || personalInfo.name) && (
            <div className="text-sm font-medium text-gray-800 mb-2">
              {data.jobRole || "Professional Title"}
            </div>
          )}

          <div className="text-xs text-gray-700 space-y-1">
            <div
              className={`flex flex-wrap items-center gap-x-2 ${
                !hasPhoto ? "justify-center" : ""
              }`}
            >
              {personalInfo.phone && (
                <span>
                  <strong className="font-semibold">Phone:</strong>{" "}
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.phone && personalInfo.email && <span>|</span>}
              {personalInfo.email && (
                <span>
                  <strong className="font-semibold">Email:</strong>{" "}
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-blue-700 hover:underline"
                  >
                    {personalInfo.email}
                  </a>
                </span>
              )}
            </div>

            <div
              className={`flex flex-wrap items-center gap-x-2 ${
                !hasPhoto ? "justify-center" : ""
              }`}
            >
              {personalInfo.location && (
                <span>
                  <strong className="font-semibold">Location:</strong>{" "}
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.location && personalInfo.nationality && <span>|</span>}
              {personalInfo.nationality && (
                <span>
                  <strong className="font-semibold">Nationality:</strong>{" "}
                  {personalInfo.nationality}
                </span>
              )}
            </div>

            {personalInfo.linkedin && (
              <div className={!hasPhoto ? "text-center" : ""}>
                <strong className="font-semibold">LinkedIn:</strong>{" "}
                <a
                  href={
                    personalInfo.linkedin.startsWith("http")
                      ? personalInfo.linkedin
                      : `https://${personalInfo.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  {personalInfo.linkedin}
                </a>
              </div>
            )}

            {personalInfo.portfolio && (
              <div className={!hasPhoto ? "text-center" : ""}>
                <strong className="font-semibold">Portfolio:</strong>{" "}
                <a
                  href={
                    personalInfo.portfolio.startsWith("http")
                      ? personalInfo.portfolio
                      : `https://${personalInfo.portfolio}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  {personalInfo.portfolio}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Optional Profile Photo */}
        {hasPhoto && (
          <div className="flex-shrink-0">
            <img
              src={personalInfo.photo}
              alt={personalInfo.name || "Profile"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-gray-400 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {summary && (
        <ElegantSection title="PROFESSIONAL SUMMARY">
          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed text-justify">
            {summary}
          </p>
        </ElegantSection>
      )}

      {/* Core Skills */}
      {skills.length > 0 && (
        <ElegantSection title="CORE SKILLS">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs sm:text-sm">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-gray-900 mr-2 font-bold">•</span>
                <span className="text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <ElegantSection title="CERTIFICATION">
          <div className="space-y-3 text-xs sm:text-sm">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-start">
                <span className="text-gray-900 mr-2 font-bold">•</span>
                <div>
                  <div className="font-bold text-gray-950">
                    {cert.name}
                    {cert.date && (
                      <span className="font-normal text-gray-800 ml-1">
                        | {cert.date}
                      </span>
                    )}
                  </div>
                  {cert.issuer && (
                    <div className="text-gray-700 text-xs mt-0.5">
                      {cert.issuer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <ElegantSection title="PROFESSIONAL EXPERIENCE">
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs sm:text-sm">
                <div className="font-bold text-gray-950 flex flex-wrap items-baseline justify-between">
                  <span>{exp.role}</span>
                  {(exp.startDate || exp.endDate) && (
                    <span className="font-semibold text-gray-800 text-xs">
                      {formatDate(exp.startDate)} –{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  )}
                </div>
                {exp.company && (
                  <div className="text-xs text-gray-700 italic mb-1.5">
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
        </ElegantSection>
      )}

      {/* Education */}
      {education.length > 0 && (
        <ElegantSection title="EDUCATION">
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs sm:text-sm">
                <div className="flex items-start">
                  <span className="text-gray-900 mr-2 font-bold">•</span>
                  <div>
                    <span className="font-bold text-gray-950">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </span>
                    {(edu.startYear || edu.endYear) && (
                      <span className="font-normal text-gray-800 ml-1">
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
        </ElegantSection>
      )}

      {/* Key Projects */}
      {projects.length > 0 && (
        <ElegantSection title="PROJECTS">
          <div className="space-y-3 text-xs sm:text-sm">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-start justify-between">
                  <div className="font-bold text-gray-950">
                    {proj.link ? (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline"
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
        </ElegantSection>
      )}

      {/* Tools / Technical Skills */}
      {tools.length > 0 && (
        <ElegantSection title="TECHNICAL SKILLS">
          <div className="flex items-start text-xs sm:text-sm">
            <span className="text-gray-900 mr-2 font-bold">•</span>
            <span className="text-gray-800">{tools.join(", ")}</span>
          </div>
        </ElegantSection>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <ElegantSection title="LANGUAGES">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs sm:text-sm">
            {languages.map((lang, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-gray-900 mr-2 font-bold">•</span>
                <span className="text-gray-800">{lang}</span>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {/* Key Achievements */}
      {achievements.length > 0 && (
        <ElegantSection title="ACHIEVEMENTS">
          <ul className="space-y-1 pl-1 text-xs sm:text-sm">
            {achievements.map((ach, idx) => (
              <li key={idx} className="flex items-start text-gray-800">
                <span className="mr-2 font-bold">•</span>
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </ElegantSection>
      )}

      {/* Personal Details */}
      {(personalInfo.dateOfBirth ||
        personalInfo.visaStatus ||
        personalInfo.nationality) && (
        <ElegantSection title="PERSONAL DETAILS">
          <div className="space-y-1 text-xs sm:text-sm text-gray-800">
            {personalInfo.dateOfBirth && (
              <div>
                <span className="font-semibold text-gray-950">
                  Date of Birth:
                </span>{" "}
                {personalInfo.dateOfBirth}
              </div>
            )}
            {personalInfo.nationality && (
              <div>
                <span className="font-semibold text-gray-950">
                  Nationality:
                </span>{" "}
                {personalInfo.nationality}
              </div>
            )}
            {personalInfo.visaStatus && (
              <div>
                <span className="font-semibold text-gray-950">
                  Visa Status:
                </span>{" "}
                {personalInfo.visaStatus}
              </div>
            )}
          </div>
        </ElegantSection>
      )}

      {/* References */}
      {references && (
        <ElegantSection title="REFERENCES">
          <p className="text-xs text-gray-800">{references}</p>
        </ElegantSection>
      )}
    </div>
  );
}

function ElegantSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="font-serif font-bold text-gray-950 text-xs sm:text-sm tracking-wider uppercase border-b border-gray-900 pb-0.5 mb-2.5">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}
