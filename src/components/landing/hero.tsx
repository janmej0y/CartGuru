"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticWrapper } from "@/components/landing/magnetic-button";
import { HeroDashboardPreview } from "@/components/landing/hero-dashboard-preview";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 20 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlight({ x, y });
    }

    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pb-28 pt-40 sm:pt-48"
    >
      {/* cursor-following spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 transition-[background] duration-300 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${spotlight.x}% ${spotlight.y}%, hsl(var(--accent-purple) / 0.14), transparent 70%)`,
        }}
      />

      {/* faint dot grid */}
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 -z-30 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      {/* floating blur blobs */}
      <div aria-hidden className="pointer-events-none absolute left-[8%] top-24 -z-10 h-72 w-72 rounded-full bg-accent-purple/10 blur-[100px] animate-float-slow" />
      <div aria-hidden className="pointer-events-none absolute right-[8%] top-40 -z-10 h-72 w-72 rounded-full bg-accent-blue/10 blur-[100px] animate-float" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-accent-emerald/5 blur-[100px]" />

      <div className="container flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-4 py-1.5 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse-glow" />
          LLM-powered shopper intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          AI That Understands
          <br />
          <span className="text-gradient">Every Shopper</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl"
        >
          Transform raw customer behavior into intelligent personalization decisions using LLM-powered reasoning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticWrapper>
            <Button asChild variant="gradient" size="lg">
              <Link href="/dashboard">
                Try Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </MagneticWrapper>
          <MagneticWrapper>
            <Button asChild variant="outline" size="lg">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          </MagneticWrapper>
          <MagneticWrapper>
            <Button asChild variant="ghost" size="lg">
              <Link href="/analyzer">
                <PlayCircle className="h-4 w-4" />
                Live Demo
              </Link>
            </Button>
          </MagneticWrapper>
        </motion.div>

        <div className="mt-20 w-full">
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}
