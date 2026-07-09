import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-foreground text-background",
        secondary: "border-border bg-surface-2 text-foreground",
        outline: "border-border text-foreground",
        purple: "border-accent-purple/30 bg-accent-purple/10 text-accent-purple",
        blue: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue",
        emerald: "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald",
        success: "border-confidence-high/30 bg-confidence-high/10 text-confidence-high",
        warning: "border-confidence-mid/30 bg-confidence-mid/10 text-confidence-mid",
        danger: "border-confidence-low/30 bg-confidence-low/10 text-confidence-low",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
