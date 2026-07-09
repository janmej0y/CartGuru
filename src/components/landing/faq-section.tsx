"use client";

import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Does this work without a Gemini API key?",
    answer:
      "Yes, fully. If GEMINI_API_KEY isn't set, every analysis automatically runs through a deterministic rule-based reasoning engine instead of calling out to Gemini. It returns the exact same structured output — shopper state, confidence, evidence, alternatives, recommendations — so the product is completely demoable with zero external dependencies or setup.",
  },
  {
    question: "What's the difference between the mock engine and real Gemini calls?",
    answer:
      "Gemini reasons freely over the event timeline and returns structured JSON matching our schema; the mock engine reaches the same schema through explicit rules and heuristics over the same event data. The mock engine is faster and fully offline, but Gemini generally produces more nuanced evidence strings and catches edge cases the ruleset doesn't anticipate. Both are wired through the same analyzeSession() function, so callers never need to know which path ran — the analysis object carries a source: \"gemini\" | \"mock\" field if you want to distinguish them.",
  },
  {
    question: "How does the AI avoid hallucinating recommendations?",
    answer:
      "The prompt grounds every classification in the actual event timeline that was passed in — the model is asked to cite specific observed behaviors as evidence, not to free-associate. Recommendations are then derived from the classification and confidence score rather than generated independently, so a low-confidence or ambiguous session naturally produces more conservative recommendations instead of a confident-sounding but unsupported action.",
  },
  {
    question: "What happens if the AI classification is wrong?",
    answer:
      "Every classification ships with a confidence score, an evidence strength rating, and a list of rejected alternative classifications with the reason each was rejected. That's deliberate — it's designed so you can set a confidence threshold below which you review before acting, rather than trusting a single label blindly. The reasoning panel also shows which signals were weighted versus ignored, so a wrong call is diagnosable, not a black box.",
  },
  {
    question: "Is my session data stored anywhere?",
    answer:
      "No backend database. Saved analyses persist only in your browser's localStorage under the cartguru-history key via a Zustand persist store — nothing is sent to a server for storage. Clearing your browser storage clears your history. The only network call CartGuru makes is the optional one to Gemini for analysis, and that's the raw event stream, not anything else.",
  },
  {
    question: "Can I customize the shopper states or add my own?",
    answer:
      "The product ships with 15 built-in shopper states — from Browser and Explorer through Cart Abandoner, High Intent Buyer, and VIP Customer — defined as a typed union in src/types/shopper.ts. Because the classification contract is just a TypeScript type plus a prompt (for Gemini) or a ruleset (for the mock engine), extending the list means adding a state to that union and teaching both reasoning paths about it — there's no hidden coupling to a fixed enum elsewhere in the UI.",
  },
  {
    question: "Why build a dual-path AI system instead of just calling Gemini directly?",
    answer:
      "Three reasons: reliability (a third-party API outage shouldn't take your personalization down with it), cost (you can develop, test, and demo without burning API quota on every session), and evaluability (a reviewer or recruiter can run the whole product in under a minute with no credentials). The tradeoff is maintaining two reasoning paths against one contract — worth it because the contract, not the model, is the actual product surface.",
  },
  {
    question: "How is confidence actually calculated?",
    answer:
      "Confidence reflects how strongly the observed events support one classification over the next-best alternative. In the mock engine it's computed from signal weight and count against a ruleset; with Gemini it's part of the model's structured output, prompted to be calibrated against the evidence it cites rather than expressed as a vague gut feeling. Either way, confidence is stored as a plain number on the analysis, not a derived UI-only value, so it's consistent across the dashboard, history, and analytics views.",
  },
] as const;

export function FaqSection() {
  return (
    <section className="relative py-28">
      <div className="container">
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Questions a technical evaluator would actually ask
          </h2>
          <p className="mt-4 text-muted-foreground">
            Straight answers about the architecture, the data, and what happens when the AI gets it wrong.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mx-auto max-w-3xl">
          <div className="gradient-border rounded-2xl border border-border bg-surface p-2 shadow-card sm:p-4">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${i}`}
                  className={i === FAQS.length - 1 ? "border-b-0 px-4" : "px-4"}
                >
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
