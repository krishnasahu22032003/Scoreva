"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  PlusCircle,
  MessageSquareText,
  User,
  LogOut,
} from "lucide-react";
import axios from "axios";

export default function AdminDashboardHeader() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[rgba(15,22,41,0.6)] backdrop-blur-xl px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-[var(--font-heading)] tracking-widest uppercase text-[var(--foreground)]">
              Scoreva
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--live)] live-pulse" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            <Link
              href="/admin/dashboard/create"
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
            
              Create Match
            </Link>

            <Link
              href="/admin/dashboard/commentary"
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
           
              Commentary
            </Link>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4 relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center cursor-pointer justify-center h-9 w-9 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] transition-all"
            >
              <User size={16} />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-40 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                <button
                  
                  className="w-full flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[var(--foreground)]"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 mx-6 rounded-2xl border border-[var(--border-subtle)] bg-[rgba(15,22,41,0.9)] backdrop-blur-xl px-6 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-6">

          <Link
            href="/admin/dashboard/create"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <PlusCircle size={16} />
            Create Match
          </Link>

          <Link
            href="/admin/dashboard/commentary"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <MessageSquareText size={16} />
            Commentary
          </Link>

          <button
            onClick={() => {
              setOpen(false);
             
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] py-2 text-sm hover:border-[var(--border-strong)] transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}