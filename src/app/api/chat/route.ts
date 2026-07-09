import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chatAboutSession } from "@/lib/ai/analyze";

const bodySchema = z.object({
  question: z.string().min(1),
  events: z.array(z.record(z.unknown())),
  analysis: z.record(z.unknown()).optional(),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { question, events, analysis, history } = parsed.data;
    const answer = await chatAboutSession({
      question,
      events: events as never,
      analysis: analysis as never,
      history,
    });

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
