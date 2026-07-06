import { NextRequest, NextResponse } from "next/server";
import { openai, aiModel } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI service API key not configured" }, { status: 503 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    if (file.name.endsWith(".pdf") || file.type === "application/pdf") {
      // Use standard require instead of dynamic import to bypass ESM/CJS interop quirks in Webpack/Next.js
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (
      file.name.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json({ error: "Unsupported file type. Please upload PDF or DOCX." }, { status: 400 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: "Could not extract text from file. Please try a different file." }, { status: 400 });
    }

    const prompt = `Extract all resume information from the following CV text and return it as structured JSON.

CV Text:
${extractedText.substring(0, 8000)}

Return a JSON object with this exact structure:
{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "portfolio": ""
  },
  "summary": "",
  "experience": [
    {
      "id": "exp1",
      "company": "",
      "role": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "bullets": [""]
    }
  ],
  "education": [
    {
      "id": "edu1",
      "institution": "",
      "degree": "",
      "field": "",
      "startYear": "",
      "endYear": "",
      "gpa": ""
    }
  ],
  "skills": [],
  "certifications": [],
  "projects": [
    {
      "id": "proj1",
      "name": "",
      "description": "",
      "technologies": [],
      "link": ""
    }
  ],
  "achievements": [],
  "languages": [],
  "tools": [],
  "references": ""
}

Rules:
- dates must be in YYYY-MM format or empty string
- skills must be an array of strings (technical and soft skills)
- tools must be an array of strings (software tools, platforms, IDEs — e.g. Figma, Docker, Jira)
- bullets must be an array of strings
- achievements must be an array of strings
- languages must be an array of strings
- technologies must be an array of strings
- references should be a plain string containing names and contacts, or "Available upon request" if found
- generate unique IDs (exp1, exp2, edu1, proj1, etc.)
- if a field is not found, use empty string or empty array
- extract ALL work experience entries
- extract ALL project entries
- extract ALL achievements and languages if found
- separate tools (software/platforms) from skills (abilities/competencies) when possible`;

    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        {
          role: "system",
          content: "You are a professional ATS resume parser. Extract information from the provided CV text and return it as valid JSON matching the exact requested structure.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsed = JSON.parse(content);
    // The AI might return the data nested under a key — handle both cases
    const resumeData = parsed.resumeData || parsed;

    // Ensure proper structure and generate IDs if missing
    if (!resumeData.personalInfo) {
      resumeData.personalInfo = {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        portfolio: ""
      };
    }
    if (!resumeData.summary) {
      resumeData.summary = "";
    }
    if (!Array.isArray(resumeData.experience)) {
      resumeData.experience = [];
    } else {
      resumeData.experience = resumeData.experience.map((exp: any, index: number) => ({
        id: exp.id || `exp${index + 1}`,
        company: exp.company || "",
        role: exp.role || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: !!exp.current,
        bullets: Array.isArray(exp.bullets) ? exp.bullets : []
      }));
    }
    if (!Array.isArray(resumeData.education)) {
      resumeData.education = [];
    } else {
      resumeData.education = resumeData.education.map((edu: any, index: number) => ({
        id: edu.id || `edu${index + 1}`,
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        startYear: edu.startYear || "",
        endYear: edu.endYear || "",
        gpa: edu.gpa || ""
      }));
    }
    if (!Array.isArray(resumeData.skills)) {
      resumeData.skills = [];
    }
    if (!Array.isArray(resumeData.certifications)) {
      resumeData.certifications = [];
    }
    if (!Array.isArray(resumeData.projects)) {
      resumeData.projects = [];
    } else {
      resumeData.projects = resumeData.projects.map((proj: any, index: number) => ({
        id: proj.id || `proj${index + 1}`,
        name: proj.name || "",
        description: proj.description || "",
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
        link: proj.link || ""
      }));
    }
    if (!Array.isArray(resumeData.achievements)) {
      resumeData.achievements = [];
    }
    if (!Array.isArray(resumeData.languages)) {
      resumeData.languages = [];
    }

    return NextResponse.json({ resumeData });
  } catch (err) {
    console.error("Parse CV error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to parse CV" },
      { status: 500 }
    );
  }
}


