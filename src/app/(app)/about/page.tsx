"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  Brain,
  Github,
  LayoutDashboard,
  Sparkles,
  Workflow,
} from "lucide-react";
import { SHOPPER_STATES } from "@/types/shopper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const STATE_DESCRIPTIONS: Record<string, string> = {
  Browser: "Passive scrolling with no product focus yet — still forming a first impression of the catalog.",
  Explorer: "Actively sampling multiple products across a category without narrowing down a favorite.",
  Comparer: "Weighing two or three specific products side by side — price, reviews, and specs matter most now.",
  "Discount Seeker": "Hunting for a coupon code or lower price before committing — highly price-anchored.",
  "Impulse Buyer": "Fast, low-friction path from view to purchase — decisiveness over deliberation.",
  "Cart Abandoner": "Added items but stalled before completing checkout — the friction point needs isolating.",
  "Returning Visitor": "Back for a second look at the same product without buying — reconsidering, not lost.",
  "Loyal Customer": "Repeat purchaser with an established relationship — retention matters more than persuasion.",
  "High Intent Buyer": "Deep in the funnel with strong buying signals — minimize friction, don't distract.",
  "Window Shopper": "Browsing with no cart activity or urgency — likely entertainment, not a purchase mission.",
  "Repeat Buyer": "Restocking a known, previously purchased item — speed and familiarity win here.",
  "VIP Customer": "High historical value and confident, fast decision-making — deserves white-glove treatment.",
  "Gift Shopper": "Shopping for someone else — gift framing and presentation outweigh personal preference signals.",
  Researcher: "Reading reviews, watching videos, and comparing specs before any commitment — needs proof, not pressure.",
  "Uncertain Buyer": "Mixed or thin signals that don't cleanly resolve to a confident state — approach cautiously.",
};

const TECH_STACK: { name: string; why?: string }[] = [
  { name: "Next.js 15 (App Router)" },
  { name: "React 19" },
  { name: "TypeScript" },
  { name: "Tailwind CSS" },
  {
    name: "Zustand",
    why: "A single flat store beats prop-drilling or nested Context providers for state that's genuinely global — events, analysis, and chat history all need to be readable from three unrelated routes without re-render storms.",
  },
  { name: "Framer Motion" },
  { name: "Recharts" },
  { name: "React Hook Form + Zod" },
  {
    name: "Google Gemini API",
    why: "Chosen for strong structured-output JSON mode and reasoning quality at a price point that keeps a demo product cheap to run continuously.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function AboutPage() {
  return (
    <div className="dot-grid relative min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-aurora-1" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-aurora-2" />

      <div className="relative mx-auto max-w-4xl px-6 py-16 lg:px-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow-purple">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-gradient font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            About CartGuru
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
            Understand every shopper. Personalize every journey.
          </p>
        </motion.div>

        {/* What it does */}
        <Section className="mb-16">
          <div className="mb-4 flex items-center gap-2.5">
            <Boxes className="h-5 w-5 text-accent-purple" />
            <h2 className="font-display text-2xl font-semibold tracking-tight">What it does</h2>
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              CartGuru is an AI-powered personalization engine for ecommerce teams who are tired of shipping
              rules that don&apos;t generalize. Most personalization tooling on the market is built on rigid
              if/else logic — <span className="text-foreground">&ldquo;if cart value &gt; $50 and time on
              page &gt; 30s, show a discount popup.&rdquo;</span> That works for the exact scenario it was
              written for and breaks silently everywhere else.
            </p>
            <p>
              CartGuru replaces the rule tree with reasoning. It takes a raw stream of session events —
              product views, searches, cart actions, checkout attempts, support chats — and asks a language
              model to interpret them the way a senior conversion-rate-optimization consultant would: what is
              this person actually trying to do, what&apos;s stopping them, and what&apos;s the single highest-leverage
              intervention right now.
            </p>
            <p>
              The output isn&apos;t a black-box score. Every classification comes with the evidence that
              produced it, the alternatives the model considered and rejected, a confidence level, and a
              concrete recommended action with an estimated business impact — so a merchandising or growth
              team can trust it enough to act on it, and audit it when they don&apos;t.
            </p>
          </div>
        </Section>

        <Separator className="mb-16" />

        {/* How the AI reasons */}
        <Section className="mb-16">
          <div className="mb-4 flex items-center gap-2.5">
            <Brain className="h-5 w-5 text-accent-blue" />
            <h2 className="font-display text-2xl font-semibold tracking-tight">How the AI reasons</h2>
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              The pipeline is intentionally simple to describe and hard to fake: an event stream goes in, a
              structured prompt frames the model with a &ldquo;senior CRO consultant&rdquo; persona and the
              full taxonomy of shopper states it&apos;s allowed to choose from, and the model returns
              structured JSON — shopper state, confidence, supporting evidence, alternative classifications
              it ruled out and why, and a ranked set of personalization recommendations with expected lift.
            </p>
            <p>
              What makes this reliable in production rather than just a demo trick is the fallback path.
              When no Gemini API key is configured — during local development, in a sandboxed review
              environment, or if the provider has an outage — CartGuru falls back to a deterministic,
              rule-based reasoning engine that mirrors the same output shape. This is a deliberate engineering
              decision, not a stopgap:{" "}
              <span className="text-foreground">
                the product should always be fully demoable, testable, and reviewable without any external
                dependency or secret.
              </span>{" "}
              Every downstream component — the analyzer, the simulator, the playground — is written against
              the same <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm">SessionAnalysis</code>{" "}
              contract regardless of which engine produced it, so swapping between them is invisible to the UI.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {[
              { label: "Event stream", icon: Workflow },
              { label: "Structured LLM reasoning (Gemini)", icon: Brain },
              { label: "Deterministic rule engine (fallback)", icon: Boxes },
              { label: "SessionAnalysis JSON", icon: LayoutDashboard },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex flex-1 items-center gap-3">
                <div className="glass flex flex-1 items-center gap-2 rounded-xl border border-border px-3 py-2.5">
                  <step.icon className="h-4 w-4 shrink-0 text-accent-purple" />
                  <span className="text-xs font-medium text-foreground">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <ArrowUpRight className="hidden h-4 w-4 shrink-0 rotate-90 text-muted-foreground sm:block sm:rotate-0" />
                )}
              </div>
            ))}
          </div>
        </Section>

        <Separator className="mb-16" />

        {/* Shopper states */}
        <Section className="mb-16">
          <div className="mb-4 flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-accent-emerald" />
            <h2 className="font-display text-2xl font-semibold tracking-tight">Shopper states supported</h2>
          </div>
          <p className="mb-6 text-[15px] leading-relaxed text-muted-foreground">
            The classifier chooses from fifteen distinct shopper states, each mapped to a different
            personalization strategy.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SHOPPER_STATES.map((state) => (
              <Card key={state} className="border-border/80 bg-surface-2/40">
                <CardContent className="p-4">
                  <p className="mb-1 font-display text-sm font-semibold text-foreground">{state}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {STATE_DESCRIPTIONS[state]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Separator className="mb-16" />

        {/* Tech stack */}
        <Section className="mb-16">
          <div className="mb-4 flex items-center gap-2.5">
            <Boxes className="h-5 w-5 text-accent-purple" />
            <h2 className="font-display text-2xl font-semibold tracking-tight">Tech stack</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TECH_STACK.map((tech) => (
              <Card key={tech.name} className="border-border/80 bg-surface-2/40">
                <CardContent className="p-4">
                  <p className="font-display text-sm font-semibold text-foreground">{tech.name}</p>
                  {tech.why && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{tech.why}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Separator className="mb-16" />

        {/* Design philosophy */}
        <Section className="mb-16">
          <div className="mb-4 flex items-center gap-2.5">
            <LayoutDashboard className="h-5 w-5 text-accent-blue" />
            <h2 className="font-display text-2xl font-semibold tracking-tight">Design philosophy</h2>
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              The visual direction borrows from the current generation of premium developer and productivity
              tools — Linear, Stripe, Vercel, Raycast, Perplexity — dark by default, generous negative space,
              restrained color used only to carry meaning (confidence levels, urgency, accent highlights on
              interactive elements), and typography doing most of the hierarchy work rather than heavy
              chrome or borders.
            </p>
            <p>
              Motion is deliberate, not decorative: state changes animate so the interface reads as a living
              system that responds to input, but nothing moves without a reason — no gratuitous parallax,
              no animation competing with the data it&apos;s presenting.
            </p>
            <p>
              The most important principle is that explainability is a first-class UI concern, not an
              afterthought bolted onto a black-box score. Every AI output in this product is designed to be
              interrogated — what evidence supports it, what else was considered, why was it rejected — because
              a personalization decision that a growth team can&apos;t explain to a stakeholder is a decision
              they won&apos;t ship.
            </p>
          </div>
        </Section>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="gradient-border rounded-2xl border border-border bg-surface-2/50 p-8 text-center"
        >
          <h3 className="font-display text-xl font-semibold tracking-tight">See it in action</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Explore a live session breakdown, build your own event stream, or ask the AI directly why it made
            a call.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gradient">
              <Link href="/dashboard">
                Go to dashboard
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/analyzer">
                Try the Analyzer
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
          <Badge variant="secondary" className="mt-6">
            Built as a portfolio engineering piece
          </Badge>
        </motion.div>
      </div>
    </div>
  );
}
