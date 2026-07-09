import { NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/ai/gemini";

export async function GET() {
  return NextResponse.json({
    configured: isGeminiConfigured(),
    engine: isGeminiConfigured() ? "gemini-2.0-flash" : "mock-reasoning-engine",
  });
}
