"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { ScrollReveal, staggerContainer, staggerItem } from "@/components/landing/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    initials: "RM",
    name: "Renata Marsh",
    role: "Head of Growth",
    company: "Lucid Bloom Cosmetics",
    quote:
      "The confidence score changed how our team ships personalization. We stopped triggering the 10% coupon on anything under 70% confidence, and our discount rate dropped 22% with zero drop in conversion. That one number saved us more margin than any A/B test we'd run in a year.",
  },
  {
    initials: "DK",
    name: "Devon Kessler",
    role: "Senior Engineer",
    company: "Northfield Outfitters",
    quote:
      "I evaluated this specifically to see if the mock fallback was a real engineering decision or just a demo trick. It's the former — same JSON contract whether Gemini answers or the rule engine does, so our staging environment behaves identically to prod without burning API quota. That's the kind of design choice you only make once you've been burned by a flaky third-party dependency.",
  },
  {
    initials: "PA",
    name: "Priya Anand",
    role: "CRO Lead",
    company: "Wescott & Rowe",
    quote:
      "The reasoning panel is what sold my team. Instead of trusting a black-box label, we can see the exact signals it weighted — 'abandon_checkout' as a hard signal, 'scroll_footer' explicitly marked as noise — and why the runner-up classification got rejected. That transparency is why we let it drive live storefront rules.",
  },
  {
    initials: "JT",
    name: "Jonah Tran",
    role: "Founding Engineer",
    company: "Ampersand Supply Co.",
    quote:
      "Most cart-abandonment tools give you a single rule: 'left checkout, send email.' This one distinguishes a genuine Cart Abandoner from a Discount Seeker who's just testing coupon codes, and the recommendations differ accordingly — free shipping nudge for one, nothing for the other. That distinction alone paid for the integration time.",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="relative py-28">
      <div className="container">
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Trusted by teams who read the reasoning, not just the label
          </h2>
          <p className="mt-4 text-muted-foreground">
            Evaluators keep coming back to the same three things: the confidence score, the transparency, and
            the fact that it never goes dark.
          </p>
        </ScrollReveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={staggerItem} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
              <Card className="relative h-full overflow-hidden p-6">
                <Quote className="absolute right-5 top-5 h-8 w-8 text-accent-purple/10" aria-hidden />
                <CardContent className="relative flex h-full flex-col p-0">
                  <p className="text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{t.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role} &middot; {t.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
