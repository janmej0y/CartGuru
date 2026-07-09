import { GoogleGenerativeAI } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new GoogleGenerativeAI(apiKey);
  return client;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function generateJSON(prompt: string): Promise<string> {
  const gemini = getGeminiClient();
  if (!gemini) throw new Error("Gemini API key not configured");

  const model = gemini.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateText(prompt: string): Promise<string> {
  const gemini = getGeminiClient();
  if (!gemini) throw new Error("Gemini API key not configured");

  const model = gemini.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { temperature: 0.6 },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}
