"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[rgba(15,22,41,0.6)] backdrop-blur-xl px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-[var(--font-heading)] tracking-widest uppercase text-foreground">
              Scoreva
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--live)] live-pulse" />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <a
              href="#about"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:text-foreground"
            >
              About
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:text-foreground"
            >
              Features
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
      
            <Button variant="primary" className="px-5 py-2 text-xs cursor-pointer">
              Get Started
            </Button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-foreground"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-4 mx-6 rounded-2xl border border-[var(--border-subtle)] bg-[rgba(15,22,41,0.9)] backdrop-blur-xl px-6 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-6">
          <a
            href="#about"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-[var(--text-secondary)] hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#features"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-[var(--text-secondary)] hover:text-foreground transition-colors"
          >
            Features
          </a>
     
          <Button
            variant="primary"
            className="w-full text-xs"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
}