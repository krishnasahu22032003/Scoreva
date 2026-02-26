"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-28 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl text-center">

        {/* Subtle Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(122,92,255,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(0,229,255,0.12),transparent_40%)]" />

        {/* Live Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[rgba(15,22,41,0.6)] px-4 py-2 backdrop-blur-xl mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-[var(--live)] live-pulse" />
          <span className="text-xs tracking-wider uppercase font-[var(--font-heading)] text-[var(--live)]">
            Ultra Low Latency Engine
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-[var(--font-heading)] text-4xl sm:text-6xl lg:text-7xl font-semibold uppercase tracking-wide leading-tight"
        >
          Experience Live Sports
          <span className="block bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
            Without Delay
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-8 max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-[var(--font-body)]"
        >
          Scoreva delivers real-time sports commentary powered by a WebSocket-driven engine.
          Track live matches, broadcast commentary instantly, and experience ultra-low latency
          updates engineered for speed, precision, and scale.
        </motion.p>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-[var(--text-muted)] font-[var(--font-body)]"
        >
          <span>⚡ Sub-Second Updates</span>
          <span>🔐 Secure Role-Based Access</span>
          <span>📡 Real-Time Broadcasting</span>
          <span>🏟 Admin Match Control</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/signup">
            <Button variant="primary" className="px-8 py-3 text-sm">
              Join as User
            </Button>
          </Link>

          <Link href="/admin/signup">
            <Button variant="live" className="px-8 py-3 text-sm">
              Create as Admin
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}