"use client";

import { motion, type Variants } from "framer-motion";
import { Layers, Globe, Gauge, Shield } from "lucide-react";

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

export default function About() {
  return (
    <section id="about" className="py-28 px-6 relative">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-6xl"
      >
        <motion.div
          variants={fadeUp}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div>
         <h2 className="font-[var(--font-heading)] text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
  Redefining{" "}
  <span className="inline-block align-baseline bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
    Real-Time Sports Infrastructure
  </span>
</h2>

            <p className="mt-6 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              Scoreva is built to eliminate latency in live sports commentary.
              Our WebSocket-driven architecture ensures instant match updates,
              seamless broadcasting, and scalable performance under pressure.
            </p>

            <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              Designed with precision and engineered for reliability, Scoreva
              empowers administrators to control live match flows while users
              experience uninterrupted, real-time engagement.
            </p>
          </div>

          <motion.div
            variants={container}
            className="grid sm:grid-cols-2 gap-6"
          >
            <AboutCard
              icon={Layers}
              title="Structured Architecture"
              description="Layered backend design ensuring stability and clean data flow."
              accent="var(--violet)"
            />

            <AboutCard
              icon={Gauge}
              title="Performance First"
              description="Optimized event handling for consistent low-latency delivery."
              accent="var(--cyan)"
            />

            <AboutCard
              icon={Shield}
              title="Security Focused"
              description="Authentication and protected routes safeguard every interaction."
              accent="var(--crimson)"
            />

            <AboutCard
              icon={Globe}
              title="Scalable Delivery"
              description="Engineered to support thousands of concurrent connections."
              accent="var(--violet)"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function AboutCard({
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--border-strong)]"
    >
      <div
        className="flex items-center justify-center h-10 w-10 rounded-lg mb-4 border border-[var(--border-subtle)]"
        style={{ backgroundColor: "var(--surface-elevated)" }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>

      <h3 className="text-lg font-semibold font-[var(--font-heading)] mb-2">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>
    </motion.div>
  );
}