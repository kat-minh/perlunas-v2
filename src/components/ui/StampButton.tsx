"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

interface StampButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
}

const styles: Record<Variant, string> = {
  solid:
    "bg-emerald text-warm shadow-paper hover:bg-emerald-deep border border-emerald-deep/30",
  outline:
    "border border-leather/40 text-emerald hover:border-forest hover:bg-warm/60",
  ghost: "text-emerald hover:bg-warm/60",
};

/**
 * Primary CTA. On press it "stamps" — a quick scale dip plus an ink ring,
 * echoing a passport stamp landing on paper.
 */
export const StampButton = forwardRef<HTMLButtonElement, StampButtonProps>(
  function StampButton(
    { variant = "solid", className, children, href, ...props },
    ref,
  ) {
    const content = (
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    );

    const classes = cn(
      "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300",
      styles[variant],
      className,
    );

    if (href) {
      return (
        <motion.a
          href={href}
          whileTap={{ scale: 0.94 }}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className={classes}
          data-cursor="hover"
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.94 }}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className={classes}
        data-cursor="hover"
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {content}
      </motion.button>
    );
  },
);
