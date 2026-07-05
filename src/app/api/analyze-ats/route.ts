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

    const prompt = `You are an expert ATS (Applicant Tracking System) recruiter and resume scanner.

Analyze the following resume against the job description below.

Resume JSON:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Generate an audit report and return it as a JSON object with this exact structure:
{
  "score": 85,
  "matchedKeywords": ["React", "TypeScript"],
  "missingKeywords": ["Docker", "CI/CD"],
  "suggestions": [
    "Add more detail about your experience with Docker in your Projects section.",
    "Mention automated CI/CD pipelines under your Senior Engineer experience."
  ]
}

Rules:
- score must be a number between 0 and 100
- matchedKeywords must be an array of strings
- missingKeywords must be an array of strings
- suggestions must be an array of strings`;

    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        { role: "system", content: "You are an expert ATS resume scanner. Always return valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const parsed = JSON.parse(content);

    // Sanitize output structure
    const score = typeof parsed.score === "number" ? parsed.score : 50;
    const matchedKeywords = Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [];
    const missingKeywords = Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [];
    const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];

    return NextResponse.json({
      score,
      matchedKeywords,
      missingKeywords,
      suggestions,
    });
  } catch (err) {
    console.error("ATS analyze error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to analyze ATS score" },
      { status: 500 }
    );
  }
}
