import { NextRequest, NextResponse } from "next/server";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType,
} from "docx";
import { ResumeData } from "@/lib/types";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function createHeader(name: string) {
  return new Paragraph({
    children: [new TextRun({ text: name, bold: true, size: 36, font: "Calibri" })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
  });
}

function createSectionTitle(title: string) {
  return new Paragraph({
    children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, font: "Calibri", color: "2563EB" })],
    border: { bottom: { color: "2563EB", style: BorderStyle.SINGLE, size: 6 } },
    spacing: { before: 200, after: 100 },
  });
}

function createBullet(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: "Calibri" })],
    bullet: { level: 0 },
    spacing: { after: 40 },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { resumeData, title } = await req.json() as { resumeData: ResumeData; title: string };
    const { personalInfo, summary, experience, education, skills, projects = [], achievements = [], languages = [] } = resumeData;

    const contactLine = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
    ].filter(Boolean).join(" | ");

    const children: Paragraph[] = [
      createHeader(personalInfo.name || "Your Name"),
      new Paragraph({
        children: [new TextRun({ text: contactLine, size: 20, font: "Calibri", color: "4B5563" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
    ];

    // Summary
    if (summary) {
      children.push(createSectionTitle("Professional Summary"));
      children.push(new Paragraph({
        children: [new TextRun({ text: summary, size: 20, font: "Calibri" })],
        spacing: { after: 120 },
      }));
    }

    // Experience
    if (experience.length > 0) {
      children.push(createSectionTitle("Work Experience"));
      for (const exp of experience) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.role, bold: true, size: 22, font: "Calibri" }),
              new TextRun({ text: `  |  `, size: 20, font: "Calibri", color: "9CA3AF" }),
              new TextRun({ text: exp.company, size: 20, font: "Calibri", italics: true }),
              new TextRun({ text: `  |  `, size: 20, font: "Calibri", color: "9CA3AF" }),
              new TextRun({
                text: `${formatDate(exp.startDate)} – ${exp.current ? "Present" : formatDate(exp.endDate)}`,
                size: 20, font: "Calibri", color: "6B7280",
              }),
            ],
            spacing: { before: 120, after: 60 },
          })
        );
        for (const bullet of exp.bullets.filter(Boolean)) {
          children.push(createBullet(bullet));
        }
      }
    }

    // Education
    if (education.length > 0) {
      children.push(createSectionTitle("Education"));
      for (const edu of education) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 22, font: "Calibri" }),
              new TextRun({ text: `  —  ${edu.institution}`, size: 20, font: "Calibri", italics: true }),
              new TextRun({ text: `  (${edu.startYear} – ${edu.endYear})`, size: 20, font: "Calibri", color: "6B7280" }),
            ],
            spacing: { before: 100, after: 60 },
          })
        );
        if (edu.gpa) {
          children.push(new Paragraph({
            children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 20, font: "Calibri", color: "6B7280" })],
            spacing: { after: 60 },
          }));
        }
      }
    }

    // Skills
    if (skills.length > 0) {
      children.push(createSectionTitle("Skills"));
      children.push(new Paragraph({
        children: [new TextRun({ text: skills.join("  ·  "), size: 20, font: "Calibri" })],
        spacing: { after: 60 },
      }));
    }

    // Projects
    if (projects.length > 0) {
      children.push(createSectionTitle("Projects"));
      for (const proj of projects) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: proj.name, bold: true, size: 22, font: "Calibri" }),
              proj.technologies && proj.technologies.length > 0
                ? new TextRun({ text: `  (${proj.technologies.join(", ")})`, size: 20, font: "Calibri", color: "6B7280" })
                : new TextRun({ text: "" }),
            ],
            spacing: { before: 120, after: 40 },
          })
        );
        if (proj.description) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: proj.description, size: 20, font: "Calibri" })],
              spacing: { after: 60 },
            })
          );
        }
      }
    }

    // Achievements
    if (achievements.length > 0) {
      children.push(createSectionTitle("Key Achievements"));
      for (const ach of achievements) {
        children.push(createBullet(ach));
      }
    }

    // Languages
    if (languages.length > 0) {
      children.push(createSectionTitle("Languages"));
      children.push(new Paragraph({
        children: [new TextRun({ text: languages.join("  ·  "), size: 20, font: "Calibri" })],
        spacing: { after: 60 },
      }));
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${(title || "resume").replace(/\s+/g, "_")}.docx"`,
      },
    });
  } catch (err) {
    console.error("DOCX error:", err);
    return NextResponse.json({ error: "Failed to generate Word document" }, { status: 500 });
  }
}
