import { NextRequest, NextResponse } from "next/server";
import { openai, aiModel } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { resumeData } = await req.json();

    if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI service API key not configured" }, { status: 503 });
    }

    const prompt = `You are an expert ATS resume optimizer and professional resume writer.

Analyze the following resume JSON and rewrite it to be:
1. ATS (Applicant Tracking System) optimized with relevant industry keywords
2. Using strong action verbs (Led, Developed, Implemented, Optimized, Achieved, etc.)
3. Quantified achievements where possible (add realistic metrics if missing)
4. Professional summary that is concise, impactful, and keyword-rich
5. Experience bullets and achievements that start with action verbs and highlight impact
6. Project descriptions optimized to highlight tech stack and clear outcomes

IMPORTANT: Return ONLY valid JSON matching the exact same structure as input. Do not add or remove fields.
- Keep work experience items strictly inside the "experience" section. Do NOT move them, company duties, or team roles into the "achievements" section.
- The "achievements" section must only contain certifications, awards, publications, honors, or standalone career milestones that do not belong to a specific company.

Input Resume JSON:
${JSON.stringify(resumeData, null, 2)}

Return the optimized resume in the same JSON structure. Ensure all strings are properly escaped.`;

    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        { role: "system", content: "You are an expert ATS resume writer. Always return valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from OpenAI");

    const parsed = JSON.parse(content);
    // The AI might return the data nested under a key — handle both cases
    const optimizedData = parsed.resumeData || parsed;

    return NextResponse.json({ resumeData: optimizedData });
  } catch (err) {
    console.error("Optimize error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Optimization failed" },
      { status: 500 }
    );
  }
}
