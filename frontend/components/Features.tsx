"use client";

import { motion, type Variants } from "framer-motion";
import {
  Zap,
  Radio,
  ShieldCheck,
  Cpu,
  BarChart3,
  Activity,
} from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-28 px-6 relative">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-5xl font-semibold tracking-tight">
            Engineered for{" "}
             <span className="block mt-4 bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
              Real-Time Reliability
            </span>
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            A performance-focused infrastructure designed for instant sports
            commentary delivery, scalable broadcasting, and secure role-based
            access control.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <FeatureCard
            icon={Zap}
            title="Sub-Second Updates"
            description="Persistent WebSocket streams ensure near-instant score synchronization."
            accent="var(--violet)"
          />

          <FeatureCard
            icon={Radio}
            title="Live Broadcast Engine"
            description="Real-time commentary distribution with efficient event handling."
            accent="var(--cyan)"
          />

          <FeatureCard
            icon={ShieldCheck}
            title="Secure Role Access"
            description="Granular admin and user access powered by protected endpoints."
            accent="var(--crimson)"
          />

          <FeatureCard
            icon={Cpu}
            title="Scalable Core"
            description="Optimized socket lifecycle and memory-efficient architecture."
            accent="var(--violet)"
          />

          <FeatureCard
            icon={BarChart3}
            title="Match Control"
            description="Full lifecycle management from upcoming to live and ended."
            accent="var(--cyan)"
          />

          <FeatureCard
            icon={Activity}
            title="Performance Optimized"
            description="Smooth UI rendering under high-frequency update conditions."
            accent="var(--crimson)"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
}: {
  icon: any;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--border-strong)]"
    >
      <div
        className="flex items-center justify-center h-11 w-11 rounded-lg mb-5 border border-[var(--border-subtle)]"
        style={{ backgroundColor: "var(--surface-elevated)" }}
      >
        <Icon
          className="w-5 h-5"
          style={{ color: accent }}
        />
      </div>

      <h3 className="text-lg font-semibold font-[var(--font-heading)] mb-3">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>
    </motion.div>
  );
}