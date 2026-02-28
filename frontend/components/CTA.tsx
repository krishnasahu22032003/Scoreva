"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function CTA() {
  return (
    <section className="py-32 px-6 relative">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-4xl"
      >
        <motion.div
          variants={fadeUp}
          className="relative glass px-10 sm:px-20 py-10 text-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_50%_0%,var(--violet),transparent_60%)] pointer-events-none" />

          <motion.h2
            variants={fadeUp}
            className="relative font-[var(--font-heading)] text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1]"
          >
            Ready to Experience{" "}
            <span className="block mt-4 bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
              Real-Time Sports?
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="relative mt-6 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto"
          >
            Built for speed, precision, and uninterrupted live updates.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="relative mt-10 flex justify-center"
          >
            <Link href="/signup">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25 }}
              >
                <Button
                  className="cursor-pointer group px-9 py-3.5 rounded-xl text-sm font-medium bg-[var(--live)] text-[#052018] shadow-[0_8px_24px_rgba(0,255,148,0.15)] transition-all duration-300 hover:shadow-[0_14px_32px_rgba(0,255,148,0.25)]"
                >
                  <span className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}