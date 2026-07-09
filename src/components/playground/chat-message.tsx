"use client";

import { motion } from "framer-motion";
import { AlertCircle, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MarkdownLite } from "./markdown-lite";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

export function ChatMessage({ role, content, isError }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
      className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}
    >
      <Avatar className="mt-0.5 h-8 w-8 shrink-0">
        {isUser ? (
          <AvatarFallback className="bg-surface-3 text-foreground">You</AvatarFallback>
        ) : (
          <AvatarFallback className={cn(isError && "from-destructive to-destructive")}>
            <Sparkles className="h-3.5 w-3.5" />
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-card",
          isUser
            ? "rounded-tr-sm bg-surface-2 text-foreground"
            : "rounded-tl-sm border border-border bg-surface text-foreground",
          isError && "border-destructive/40 bg-destructive/5 text-destructive"
        )}
      >
        {isError && (
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            Something went wrong
          </div>
        )}
        <MarkdownLite content={content} />
      </div>
    </motion.div>
  );
}
