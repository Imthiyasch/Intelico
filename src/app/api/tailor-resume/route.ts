import { NextRequest, NextResponse } from "next/server";
import { openai, aiModel } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI service API key not configured" }, { status: 503 });
    }

    const { resumeData, jobDescription } = await req.json();

    if (!resumeData || !jobDescription) {
      return NextResponse.json({ error: "Missing resumeData or jobDescription" }, { status: 400 });
    }

    const prompt = `You are an expert professional resume writer and ATS optimization specialist.

Tailor the following resume JSON to align with the job description provided.

Resume JSON:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Instructions:
1. Rewrite the professional summary to highlight matching skills and align with the target role.
2. Refine existing work experience bullet points to emphasize achievements, technologies, and keywords that align with the job description. Start bullet points with strong active verbs. Keep the number of bullet points same.
3. Optimize project descriptions to highlight skills and technologies relevant to the job.
4. Do NOT invent new jobs, roles, companies, education degrees, or certifications. Keep names, contact info, dates, and institutions exactly the same.
5. Keep work experience items strictly inside the "experience" section. Do NOT move them, company duties, or team roles into the "achievements" section.
6. The "achievements" section must only contain certifications, awards, publications, honors, or standalone career milestones that do not belong to a specific company.
7. Return ONLY the valid tailored resume JSON matching the exact same schema. Do not add any conversational text.`;

    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        { role: "system", content: "You are an expert ATS resume tailoring specialist. Always return valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const parsed = JSON.parse(content);
    const tailoredData = parsed.resumeData || parsed;

    // Structure sanitization/validation to maintain frontend integrity
    if (!tailoredData.personalInfo) {
      tailoredData.personalInfo = resumeData.personalInfo;
    }
    if (!tailoredData.summary) {
      tailoredData.summary = resumeData.summary || "";
    }
    if (!Array.isArray(tailoredData.experience)) {
      tailoredData.experience = resumeData.experience || [];
    } else {
      tailoredData.experience = tailoredData.experience.map((exp: any, index: number) => {
        const originalExp = (resumeData.experience || [])[index] || {};
        return {
          id: exp.id || originalExp.id || `exp${index + 1}`,
          company: exp.company || originalExp.company || "",
          role: exp.role || originalExp.role || "",
          startDate: exp.startDate || originalExp.startDate || "",
          endDate: exp.endDate || originalExp.endDate || "",
          current: exp.current !== undefined ? !!exp.current : !!originalExp.current,
          bullets: Array.isArray(exp.bullets) ? exp.bullets : (originalExp.bullets || [])
        };
      });
    }
    if (!Array.isArray(tailoredData.education)) {
      tailoredData.education = resumeData.education || [];
    } else {
      tailoredData.education = tailoredData.education.map((edu: any, index: number) => {
        const originalEdu = (resumeData.education || [])[index] || {};
        return {
          id: edu.id || originalEdu.id || `edu${index + 1}`,
          institution: edu.institution || originalEdu.institution || "",
          degree: edu.degree || originalEdu.degree || "",
          field: edu.field || originalEdu.field || "",
          startYear: edu.startYear || originalEdu.startYear || "",
          endYear: edu.endYear || originalEdu.endYear || "",
          gpa: edu.gpa || originalEdu.gpa || ""
        };
      });
    }
    if (!Array.isArray(tailoredData.skills)) {
      tailoredData.skills = resumeData.skills || [];
    }
    if (!Array.isArray(tailoredData.certifications)) {
      tailoredData.certifications = resumeData.certifications || [];
    }
    if (!Array.isArray(tailoredData.projects)) {
      tailoredData.projects = resumeData.projects || [];
    } else {
      tailoredData.projects = tailoredData.projects.map((proj: any, index: number) => {
        const originalProj = (resumeData.projects || [])[index] || {};
        return {
          id: proj.id || originalProj.id || `proj${index + 1}`,
          name: proj.name || originalProj.name || "",
          description: proj.description || originalProj.description || "",
          technologies: Array.isArray(proj.technologies) ? proj.technologies : (originalProj.technologies || []),
          link: proj.link || originalProj.link || ""
        };
      });
    }
    if (!Array.isArray(tailoredData.achievements)) {
      tailoredData.achievements = resumeData.achievements || [];
    }
    if (!Array.isArray(tailoredData.languages)) {
      tailoredData.languages = resumeData.languages || [];
    }

    return NextResponse.json({ resumeData: tailoredData });
  } catch (err) {
    console.error("Resume tailoring error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to tailor resume" },
      { status: 500 }
    );
  }
}
