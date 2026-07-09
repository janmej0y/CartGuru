"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticWrapper } from "@/components/landing/magnetic-button";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-purple/10 blur-[120px]" />

      <div className="container">
        <ScrollReveal className="gradient-border glass relative mx-auto flex max-w-3xl flex-col items-center rounded-2xl px-6 py-16 text-center shadow-glow sm:px-16">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Understand every shopper.
            <br />
            <span className="text-gradient">Personalize every journey.</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            See CartGuru classify a live session, explain its reasoning, and recommend the next best action — in
            under a minute.
          </p>
          <MagneticWrapper className="mt-8">
            <Button asChild variant="gradient" size="lg">
              <Link href="/dashboard">
                Try Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </MagneticWrapper>
        </ScrollReveal>
      </div>
    </section>
  );
}
