"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ShieldCheck, Radio, Trophy, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const ,
    },
  },
};

export default function Hero() {
  return (
    <section className="relative pt-32 pb-32 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_25%,rgba(122,92,255,0.18),transparent_45%),radial-gradient(circle_at_75%_0%,rgba(0,229,255,0.15),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(255,0,92,0.12),transparent_50%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl text-center"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-3 rounded-full border border-(--border-subtle) bg-[rgba(15,22,41,0.65)] px-5 py-2.5 backdrop-blur-2xl mb-10"
        >
          <Radio className="w-4 h-4 text-live" />
          <span className="text-xs tracking-[0.2em] uppercase font-(--font-heading) text-live">
            Ultra Low Latency Engine
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
        >
          Experience Live Sports
          <span className="block mt-4 bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
            Without Delay
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl mx-auto text-md sm:text-md text-[var(--text-secondary)] leading-relaxed font-[var(--font-body)]"
        >
          Scoreva is engineered on a WebSocket-powered real-time infrastructure
          delivering sub-second match commentary, secure broadcasting control,
          and precision-driven live updates at scale.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-[var(--text-muted)] font-[var(--font-body)]"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--violet)]" />
            <span>Sub-Second Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--cyan)]" />
            <span>Secure Role-Based Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[var(--crimson)]" />
            <span>Real-Time Broadcasting</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--live)]" />
            <span>Admin Match Control</span>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/signup">
            <Button
              variant="primary"
              className="group relative px-6 py-4 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                Join as User
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 font-bold" />
              </span>
            </Button>
          </Link>

          <Link href="/admin/signup">
            <Button
              variant="live"
              className="group relative px-6 py-4 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                Create as Admin
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 font-bold" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}