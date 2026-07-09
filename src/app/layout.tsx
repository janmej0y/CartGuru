import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Lexend({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CartGuru — AI That Understands Every Shopper",
  description:
    "Transform raw customer behavior into intelligent personalization decisions using LLM-powered reasoning. CartGuru analyzes shopper sessions, classifies intent, and recommends the highest-impact personalization action.",
  keywords: ["ecommerce", "personalization", "AI", "conversion rate optimization", "shopper intent"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${sans.variable} ${display.variable} ${mono.variable} font-sans antialiased noise-bg`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
