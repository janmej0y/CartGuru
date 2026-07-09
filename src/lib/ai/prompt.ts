import type { SessionEvent } from "@/types/events";
import { EVENT_LABELS } from "@/types/events";
import { SHOPPER_STATES } from "@/types/shopper";

export const SYSTEM_PERSONA = `You are the reasoning core of CartGuru, an AI ecommerce personalization engine. You think and write like a senior CRO (Conversion Rate Optimization) consultant and customer behavior analyst with 15 years of experience at companies like Shopify Plus, Amazon, and Klaviyo.

Rules you must follow at all times:
1. Never behave like a simple if/else classifier. Reason holistically about sequence, timing, and intent — not just event counts.
2. Every claim must cite specific evidence from the actual event stream provided. Never invent behavior that isn't in the data.
3. Be decisive. Pick exactly one primary Shopper State from the allowed list, but acknowledge genuine ambiguity when it exists via alternatives.
4. Think in business terms: revenue impact, conversion lift, urgency, and risk — not just labels.
5. Your tone is sharp, confident, and expert — never generic, never hedgy filler like "it seems" or "possibly". Say what you see.
6. Output strictly valid JSON matching the provided schema. No markdown fences, no commentary outside the JSON.`;

export const ALLOWED_STATES = SHOPPER_STATES.join(", ");

export function formatEventsForPrompt(events: SessionEvent[]): string {
  return events
    .map((e, i) => {
      const label = EVENT_LABELS[e.event] ?? e.event;
      const parts = [`${i + 1}. ${label}`];
      if (e.product) parts.push(`product="${e.product}"`);
      if (e.category) parts.push(`category="${e.category}"`);
      if (typeof e.price === "number") parts.push(`price=$${e.price}`);
      if (e.timestamp) parts.push(`at=${e.timestamp}`);
      if (e.meta) parts.push(`meta=${JSON.stringify(e.meta)}`);
      return parts.join(" | ");
    })
    .join("\n");
}

export function buildAnalysisPrompt(events: SessionEvent[]): string {
  return `${SYSTEM_PERSONA}

## Allowed Shopper States
${ALLOWED_STATES}

## Event Stream to Analyze
${formatEventsForPrompt(events)}

## Your Task
Analyze this session like a CRO expert would in a strategy review. Consider event sequence and timing (not just which events occurred), what the shopper likely wants, what's stopping them from converting, and what single action would most move the needle.

Return ONLY a JSON object with this exact shape (no markdown fences):

{
  "shopperState": "<one of the allowed states>",
  "confidence": <number 0-100>,
  "evidenceStrength": <number 0-100, how strong/unambiguous the behavioral signal is>,
  "modelConfidence": <number 0-100, your own certainty in this reasoning>,
  "evidence": ["<short evidence bullet citing specific events>", ...3-5 items],
  "aiExplanation": "<2-3 sentences, written like a CRO expert explaining the call to a colleague>",
  "recommendedAction": "<single clearest personalization action, one sentence>",
  "expectedBusinessImpact": "<1-2 sentences on revenue/retention impact, business language>",
  "expectedLift": "<e.g. '+12-18% conversion lift'>",
  "estimatedRevenueImpact": <number, estimated USD opportunity for this single session/segment>,
  "urgency": "<low|medium|high|critical>",
  "riskLevel": "<low|medium|high, risk of losing this shopper if no action taken>",
  "alternatives": [
    {"state": "<alternative state>", "confidence": <0-100>, "reasonRejected": "<why primary was chosen over this>"}
    ... 2 items
  ],
  "recommendations": [
    {
      "id": "<kebab-case-id>",
      "title": "<short action title>",
      "type": "<one of: discount_popup, free_shipping, testimonials, bundle, recently_viewed, cross_sell, upsell, urgency_timer, inventory_message, price_drop_alert, wishlist_reminder, email_reminder, sms_reminder, reward_points, personal_coupon, recommendation_carousel>",
      "why": "<evidence-grounded reason, cite specific events>",
      "expectedConversionLift": "<e.g. '+8%'>",
      "confidence": <0-100>,
      "effort": "<low|medium|high>",
      "priority": <1-5, 1 is highest>
    }
    ... 3-4 items, ranked by priority
  ],
  "reasoning": {
    "observedBehaviors": ["<factual behaviors observed, no interpretation>", ...],
    "importantSignals": ["<which events most influenced the decision and why>", ...],
    "ignoredSignals": ["<events that were noise/low-signal and why they were discounted>", ...],
    "reasoning": "<the core chain of reasoning, 3-5 sentences, step by step like thinking out loud>",
    "finalDecision": "<one sentence stating the final classification decision>",
    "businessStrategy": "<2-3 sentences on the broader CRO strategy this session suggests>",
    "whyNotOthers": "<1-2 sentences on why the top alternative states were rejected>"
  },
  "timelineEvidence": [
    {"eventIndex": <0-based index into the input events array>, "label": "<short label>", "weight": "<signal|supporting|noise>", "note": "<optional short note>"}
    ... one entry per input event, in order
  ]
}

Respond with ONLY the JSON object.`;
}

export function buildChatPrompt(params: {
  question: string;
  events: SessionEvent[];
  analysis?: unknown;
  history: { role: "user" | "assistant"; content: string }[];
}): string {
  const { question, events, analysis, history } = params;
  const historyText = history
    .slice(-6)
    .map((h) => `${h.role === "user" ? "User" : "CartGuru AI"}: ${h.content}`)
    .join("\n");

  return `${SYSTEM_PERSONA}

You are now in an interactive Q&A session with a growth/product manager who is looking at a specific shopper session analysis. Answer their question directly, citing the underlying event data and the prior analysis where relevant. Keep answers focused, concrete, and under 150 words unless the question needs more. Use markdown for light formatting (bold, bullet points) where it aids clarity. Do not repeat the full analysis unless asked.

## Session Event Stream
${formatEventsForPrompt(events)}

${analysis ? `## Prior AI Analysis\n${JSON.stringify(analysis, null, 2)}\n` : ""}

## Conversation so far
${historyText || "(no prior messages)"}

## New Question
${question}

Respond with plain conversational text (markdown allowed), not JSON.`;
}
