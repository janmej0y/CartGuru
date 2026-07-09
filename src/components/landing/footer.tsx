import Link from "next/link";
import { Sparkles } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analyzer", href: "/analyzer" },
  { label: "Playground", href: "/playground" },
  { label: "Analytics", href: "/analytics" },
  { label: "About", href: "/about" },
  { label: "GitHub", href: "https://github.com/janmej0y/CartGuru", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue">
            <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-foreground">CartGuru</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CartGuru. All rights reserved.</p>
      </div>
    </footer>
  );
}
