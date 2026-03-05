"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { userSignOut } from "@/lib/usersignout";
import toast from "react-hot-toast";

interface Props {
  onCreateClick: () => void;
}

const quotes = [
  "Every second counts.",
  "Pressure creates legends.",
  "Momentum decides everything.",
  "Champions read the game before it happens.",
  "Speed wins matches.",
  "Victory lives in the details.",
  "Great players see the future.",
];

export default function UserDashboardHeader({ onCreateClick }: Props) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [paused]);

  const handleLogout = async () => {
    try {
      const res = await userSignOut();

      if (res.success) {
        toast.success(res.message || "Logged out successfully");
        router.replace("/signin");
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[rgba(15,22,41,0.65)] backdrop-blur-xl px-4 sm:px-6 py-4 shadow-[0_15px_45px_rgba(0,0,0,0.5)] transition-all">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-lg sm:text-xl font-[var(--font-heading)] tracking-widest uppercase text-[var(--foreground)]">
              Scoreva
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--live)] live-pulse" />
          </div>

          <div
            className="hidden md:flex flex-1 items-center justify-center px-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={quoteIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6 }}
                className="text-xs sm:text-sm md:text-base text-center italic font-[var(--font-heading)] tracking-wide bg-gradient-to-r from-[var(--cyan)] via-[var(--violet)] to-[var(--crimson)] bg-clip-text text-transparent"
              >
                “{quotes[quoteIndex]}”
              </motion.span>
            </AnimatePresence>
          </div>

          <div
            className="hidden md:flex items-center gap-4 relative shrink-0"
            ref={dropdownRef}
          >
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center cursor-pointer justify-center h-9 w-9 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:shadow-[var(--glow-violet)] transition-all duration-300"
            >
              <User size={16} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 w-44 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center cursor-pointer gap-2 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] transition-all"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden cursor-pointer text-[var(--foreground)]"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-4 mx-4 sm:mx-6 rounded-2xl border border-[var(--border-subtle)] bg-[rgba(15,22,41,0.95)] backdrop-blur-xl px-6 py-6 shadow-[0_15px_45px_rgba(0,0,0,0.6)] space-y-6">
          <p className="text-center text-sm italic font-[var(--font-heading)] bg-gradient-to-r from-[var(--cyan)] via-[var(--violet)] to-[var(--crimson)] bg-clip-text text-transparent">
            “{quotes[quoteIndex]}”
          </p>

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] py-2 text-sm hover:border-[var(--border-strong)] transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}