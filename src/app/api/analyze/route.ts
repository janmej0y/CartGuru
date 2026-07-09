import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeSession } from "@/lib/ai/analyze";

const eventSchema = z.object({
  event: z.string(),
  product: z.string().optional(),
  category: z.string().optional(),
  price: z.number().optional(),
  timestamp: z.string().optional(),
  meta: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const bodySchema = z.object({
  sessionId: z.string().optional(),
  events: z.array(eventSchema).min(1, "At least one event is required"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid event stream", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sessionId = crypto.randomUUID(), events } = parsed.data;
    const analysis = await analyzeSession(events, sessionId);
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("Analyze route error:", err);
    return NextResponse.json({ error: "Failed to analyze session" }, { status: 500 });
  }
}
