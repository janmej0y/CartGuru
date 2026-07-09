import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function TrustBar() {
  return (
    <section className="border-y border-border/60 bg-surface/40 py-10">
      <div className="container">
        <ScrollReveal className="flex flex-col items-center justify-center gap-1 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Built for teams who take conversion seriously
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
