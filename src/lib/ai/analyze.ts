import type { SessionEvent } from "@/types/events";
import type { SessionAnalysis } from "@/types/shopper";
import { isGeminiConfigured, generateJSON, generateText } from "./gemini";
import { buildAnalysisPrompt, buildChatPrompt } from "./prompt";
import { runMockAnalysis } from "./mock-engine";
import { sleep } from "@/lib/utils";

function extractJSON(raw: string): unknown {
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");
  return JSON.parse(cleaned);
}

export async function analyzeSession(events: SessionEvent[], sessionId: string): Promise<SessionAnalysis> {
  if (isGeminiConfigured()) {
    try {
      const prompt = buildAnalysisPrompt(events);
      const raw = await generateJSON(prompt);
      const parsed = extractJSON(raw) as Omit<SessionAnalysis, "id" | "sessionId" | "createdAt" | "source" | "sourceEvents">;
      return {
        ...parsed,
        id: crypto.randomUUID(),
        sessionId,
        createdAt: new Date().toISOString(),
        source: "gemini",
        sourceEvents: events,
      };
    } catch (err) {
      console.error("Gemini analysis failed, falling back to mock engine:", err);
      await sleep(400);
      return runMockAnalysis(events, sessionId);
    }
  }
  await sleep(1400);
  return runMockAnalysis(events, sessionId);
}

export async function chatAboutSession(params: {
  question: string;
  events: SessionEvent[];
  analysis?: SessionAnalysis;
  history: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  if (isGeminiConfigured()) {
    try {
      const prompt = buildChatPrompt(params);
      return await generateText(prompt);
    } catch (err) {
      console.error("Gemini chat failed, falling back to mock response:", err);
      return mockChatResponse(params);
    }
  }
  await sleep(900);
  return mockChatResponse(params);
}

function mockChatResponse(params: {
  question: string;
  events: SessionEvent[];
  analysis?: SessionAnalysis;
}): string {
  const { question, events, analysis } = params;
  const q = question.toLowerCase();

  if (!analysis) {
    return "Run an analysis first so I have session evidence to reason over — then ask me anything about the classification, the recommendations, or what-if scenarios.";
  }

  if (q.includes("why") && (q.includes("classif") || q.includes("state") || q.includes("label"))) {
    return `I classified this session as **${analysis.shopperState}** (${analysis.confidence}% confidence) because:\n\n${analysis.evidence.map((e) => `- ${e}`).join("\n")}\n\n${analysis.reasoning.reasoning}`;
  }

  if (q.includes("increase") || q.includes("improve") || q.includes("convers")) {
    const top = analysis.recommendations[0];
    return `The highest-leverage move here is **${top?.title}** — ${top?.why} Expected lift: ${top?.expectedConversionLift} at ${top?.confidence}% confidence. I'd also watch ${analysis.recommendations[1]?.title.toLowerCase()} as a secondary lever.`;
  }

  if (q.includes("what if") && q.includes("again") || q.includes("return")) {
    return `If this shopper returns, their prior **${analysis.shopperState}** signal (${events.length} events) means I'd weight return-visit behavior heavily — repeated interest without conversion typically upgrades the classification toward **Returning Visitor** or, if they finally convert, **Repeat Buyer**. I'd trigger ${analysis.recommendations[0]?.title.toLowerCase()} proactively on their next session.`;
  }

  if (q.includes("risk") || q.includes("churn")) {
    return `Churn risk here is **${analysis.riskLevel}**. ${analysis.expectedBusinessImpact}`;
  }

  if (q.includes("alternative") || q.includes("other")) {
    return analysis.alternatives.length
      ? analysis.alternatives.map((a) => `**${a.state}** (${a.confidence}%) — ${a.reasonRejected}`).join("\n\n")
      : "No close alternative classifications — the evidence for the primary state was unambiguous.";
  }

  return `Looking at the ${events.length}-event session: ${analysis.aiExplanation} Ask me about the recommendations, risk level, or what would change my classification.`;
}
