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
      className="bg-white text-gray-900 w-full p-8 sm:p-10 box-border print-area select-text"
      style={{
        fontFamily: "'Times New Roman', 'Georgia', 'Cambria', serif",
        fontSize: "10pt",
        lineHeight: 1.4,
        color: "#000000",
      }}
    >
      {/* Header */}
      <div
        className={`mb-4 ${
          hasPhoto
            ? "flex flex-row items-start justify-between gap-4"
            : ""
        }`}
      >
        <div className="flex-1">
          <h1 className="text-[26px] font-bold tracking-normal text-black mb-0.5 leading-tight font-serif">
            {personalInfo.name || "Your Name"}
          </h1>

          {(data.jobRole || personalInfo.name) && (
            <div className="text-[13.5px] font-normal text-gray-900 mb-2 font-serif">
              {data.jobRole || "Professional Title"}
            </div>
          )}

          <div className="text-[11.5px] text-gray-900 space-y-0.5 leading-normal">
            {(personalInfo.phone || personalInfo.email) && (
              <div className="flex flex-wrap items-center gap-x-1.5">
                {personalInfo.phone && (
                  <span>
                    <strong className="font-bold text-black">Phone:</strong>{" "}
                    {personalInfo.phone}
                  </span>
                )}
                {personalInfo.phone && personalInfo.email && <span className="text-gray-400">|</span>}
                {personalInfo.email && (
                  <span>
                    <strong className="font-bold text-black">Email:</strong>{" "}
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-blue-700 hover:underline"
                    >
                      {personalInfo.email}
                    </a>
                  </span>
                )}
              </div>
            )}

            {(personalInfo.location || personalInfo.nationality) && (
              <div className="flex flex-wrap items-center gap-x-1.5">
                {personalInfo.location && (
                  <span>
                    <strong className="font-bold text-black">Location:</strong>{" "}
                    {personalInfo.location}
                  </span>
                )}
                {personalInfo.location && personalInfo.nationality && <span className="text-gray-400">|</span>}
                {personalInfo.nationality && (
                  <span>
                    <strong className="font-bold text-black">Nationality:</strong>{" "}
                    {personalInfo.nationality}
                  </span>
                )}
              </div>
            )}

            {personalInfo.linkedin && (
              <div>
                <strong className="font-bold text-black">LinkedIn:</strong>{" "}
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
              <div>
                <strong className="font-bold text-black">Portfolio:</strong>{" "}
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

        {/* Profile Photo */}
        {hasPhoto && (
          <div className="flex-shrink-0 self-start pt-1">
            <img
              src={personalInfo.photo}
              alt={personalInfo.name || "Profile"}
              className="w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] rounded-full object-cover border border-gray-900"
            />
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {summary && (
        <ElegantSection title="PROFESSIONAL SUMMARY">
          <p className="text-[11.5px] text-gray-950 leading-[1.45] text-justify">
            {summary}
          </p>
        </ElegantSection>
      )}

      {/* Core Skills (2 equal columns) */}
      {skills.length > 0 && (
        <ElegantSection title="CORE SKILLS">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[11.5px]">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-black font-bold mr-2 select-none leading-none mt-0.5 text-[11px]">•</span>
                <span className="text-gray-950 leading-tight">{skill}</span>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {/* Certification */}
      {certifications.length > 0 && (
        <ElegantSection title="CERTIFICATION">
          <div className="space-y-2 text-[11.5px]">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-start">
                <span className="text-black font-bold mr-2 select-none leading-none mt-0.5 text-[11px]">•</span>
                <div className="flex-1">
                  <div className="font-bold text-black leading-tight">
                    {cert.name}
                    {cert.date && (
                      <span className="font-bold text-black ml-1">
                        | {cert.date}
                      </span>
                    )}
                  </div>
                  {cert.issuer && (
                    <div className="text-gray-900 text-[11px] mt-0.5 leading-tight">
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
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="text-[11.5px]">
                <div className="font-bold text-black text-[12px] flex flex-wrap items-baseline justify-between leading-tight">
                  <span>{exp.role}</span>
                  {(exp.startDate || exp.endDate) && (
                    <span className="font-bold text-black text-[11.5px]">
                      | {formatDate(exp.startDate)} –{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  )}
                </div>
                {exp.company && (
                  <div className="text-[11px] text-gray-900 mb-1 leading-tight">
                    {exp.company}
                  </div>
                )}
                <ul className="space-y-1 pl-0">
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex items-start text-gray-950 leading-[1.4]">
                      <span className="text-black font-bold mr-2 select-none leading-none mt-1 text-[10px]">•</span>
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
          <div className="space-y-2 text-[11.5px]">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-start">
                <span className="text-black font-bold mr-2 select-none leading-none mt-0.5 text-[11px]">•</span>
                <div className="flex-1">
                  <div className="font-bold text-black leading-tight">
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ""}
                    {(edu.startYear || edu.endYear) && (
                      <span className="font-bold text-black ml-1">
                        | {edu.startYear ? `${edu.startYear} – ` : ""}
                        {edu.endYear || ""}
                      </span>
                    )}
                  </div>
                  {edu.institution && (
                    <div className="text-gray-900 text-[11px] mt-0.5 leading-tight">
                      {edu.institution}
                      {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <ElegantSection title="PROJECTS">
          <div className="space-y-2 text-[11.5px]">
            {projects.map((proj) => (
              <div key={proj.id} className="flex items-start">
                <span className="text-black font-bold mr-2 select-none leading-none mt-0.5 text-[11px]">•</span>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between leading-tight">
                    <span className="font-bold text-black">
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
                    </span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-[11px] text-gray-700 italic">
                        {proj.technologies.join(", ")}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-[11px] text-gray-950 mt-0.5 leading-normal">
                      {proj.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {/* Technical Skills */}
      {tools.length > 0 && (
        <ElegantSection title="TECHNICAL SKILLS">
          <div className="flex items-start text-[11.5px]">
            <span className="text-black font-bold mr-2 select-none leading-none mt-0.5 text-[11px]">•</span>
            <span className="text-gray-950 leading-tight">{tools.join(", ")}</span>
          </div>
        </ElegantSection>
      )}

      {/* Languages (2 equal columns) */}
      {languages.length > 0 && (
        <ElegantSection title="LANGUAGES">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[11.5px]">
            {languages.map((lang, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-black font-bold mr-2 select-none leading-none mt-0.5 text-[11px]">•</span>
                <span className="text-gray-950 leading-tight">{lang}</span>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <ElegantSection title="ACHIEVEMENTS">
          <ul className="space-y-1 pl-0 text-[11.5px]">
            {achievements.map((ach, idx) => (
              <li key={idx} className="flex items-start text-gray-950 leading-snug">
                <span className="text-black font-bold mr-2 select-none leading-none mt-1 text-[10px]">•</span>
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
          <div className="space-y-1 text-[11.5px] text-gray-950">
            {personalInfo.dateOfBirth && (
              <div>
                <span className="font-bold text-black">
                  Date of Birth:
                </span>{" "}
                {personalInfo.dateOfBirth}
              </div>
            )}
            {personalInfo.nationality && (
              <div>
                <span className="font-bold text-black">
                  Nationality:
                </span>{" "}
                {personalInfo.nationality}
              </div>
            )}
            {personalInfo.visaStatus && (
              <div>
                <span className="font-bold text-black">
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
          <p className="text-[11.5px] text-gray-950 leading-normal">{references}</p>
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
    <div className="mb-3.5">
      <div className="font-serif font-bold text-black text-[12px] sm:text-[12.5px] tracking-wider uppercase border-b border-black pb-0.5 mb-2">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

