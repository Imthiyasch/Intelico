import OpenAI from "openai";

const useGemini = !!process.env.GEMINI_API_KEY;

export const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: useGemini ? "https://generativelanguage.googleapis.com/v1beta/openai/" : undefined,
});

export const aiModel = useGemini ? "gemini-2.5-flash" : "gpt-4o-mini";
