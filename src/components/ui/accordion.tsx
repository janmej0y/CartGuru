"use client";

/**
 * Lightweight shadcn-style Accordion.
 *
 * Note: @radix-ui/react-accordion is not present in this project's dependencies
 * (only a subset of Radix primitives is installed — see package.json). Rather than
 * add a new dependency, this implements the same public API shape (Accordion /
 * AccordionItem / AccordionTrigger / AccordionContent) with plain React state and
 * a CSS grid-rows height transition, so callers can use it exactly like the
 * Radix-backed primitives elsewhere in this codebase.
 */

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", defaultValue, collapsible = true, children, ...props }, ref) => {
    const initial = React.useMemo(() => {
      if (!defaultValue) return new Set<string>();
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    }, [defaultValue]);

    const [openItems, setOpenItems] = React.useState<Set<string>>(initial);

    const toggle = React.useCallback(
      (value: string) => {
        setOpenItems((prev) => {
          const next = new Set(prev);
          if (next.has(value)) {
            if (type === "single" && !collapsible) return prev;
            next.delete(value);
          } else {
            if (type === "single") next.clear();
            next.add(value);
          }
          return next;
        });
      },
      [type, collapsible]
    );

    return (
      <AccordionContext.Provider value={{ openItems, toggle }}>
        <div ref={ref} className={cn(className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(AccordionContext);
    const isOpen = ctx?.openItems.has(value) ?? false;

    return (
      <AccordionItemContext.Provider value={{ value, isOpen }}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn("border-b border-border", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, onClick, ...props }, ref) => {
    const accordionCtx = React.useContext(AccordionContext);
    const itemCtx = React.useContext(AccordionItemContext);
    const isOpen = itemCtx?.isOpen ?? false;

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
        onClick={(e) => {
          onClick?.(e);
          if (itemCtx) accordionCtx?.toggle(itemCtx.value);
        }}
        className={cn(
          "flex w-full flex-1 items-center justify-between gap-4 py-5 text-left font-display text-base font-medium text-foreground transition-colors hover:text-accent-purple",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 text-accent-purple"
          )}
        />
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const itemCtx = React.useContext(AccordionItemContext);
    const isOpen = itemCtx?.isOpen ?? false;

    return (
      <div
        data-state={isOpen ? "open" : "closed"}
        className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div ref={ref} className={cn("pb-5 pr-8 text-sm leading-relaxed text-muted-foreground", className)} {...props}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
