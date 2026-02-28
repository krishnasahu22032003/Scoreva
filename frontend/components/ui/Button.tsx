"use client";

import React from "react";
import clsx from "clsx";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "live" | "ghost";
  loading?: boolean;
}

export default function Button({
  children,
  className,
  variant = "primary",
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ease-out",
        "rounded-xl overflow-hidden",
        "font-[var(--font-heading)]",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
        {
          "bg-gradient-to-r from-[var(--crimson)] to-[var(--violet)] text-white shadow-lg hover:shadow-[0_0_25px_rgba(255,18,79,0.6)]":
            variant === "primary",

         "bg-[var(--live)]/90 text-[#04140E] shadow-[0_6px_20px_rgba(0,255,148,0.18)] hover:shadow-[0_10px_28px_rgba(0,255,148,0.28)] transition-all duration-300":
            variant === "live",

          "bg-transparent border border-[var(--border-strong)] text-foreground hover:border-[var(--cyan)] hover:text-[var(--cyan)]":
            variant === "ghost",
        },
        "hover:-translate-y-1 active:translate-y-0",
        className
      )}
      disabled={loading}
      {...props}
    >
      {/* Light Sweep Effect */}
      <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <span className="absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[sweep_1.5s_ease-in-out]"></span>
      </span>

      {/* Loading State */}
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing
        </span>
      ) : (
        children
      )}
    </button>
  );
}