"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--border-subtle)]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        viewport={{ once: true }}
        className="mx-auto max-w-5xl px-6 py-6 text-center"
      >
        <p className="text-xs sm:text-sm text-[var(--text-muted)] tracking-wide">
          © {new Date().getFullYear()} Scoreva. All rights reserved.
        </p>

        <div className="mt-2 flex items-center justify-center gap-2 text-xs sm:text-sm">
          <span className="text-[var(--text-secondary)]">
            Made with
          </span>

          <Heart className="w-3.5 h-3.5 text-[var(--crimson)] fill-[var(--crimson)]" />

          <span className="text-[var(--text-secondary)]">
            by
          </span>

          <span className="font-medium text-[var(--foreground)]">
            Krishna Sahu
          </span>
        </div>
      </motion.div>
    </footer>
  );
}