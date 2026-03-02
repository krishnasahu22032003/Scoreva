"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  PlusCircle,
  MessageSquareText,
  User,
  LogOut,
} from "lucide-react";
import { userSignOut } from "@/lib/usersignout";
import toast from "react-hot-toast";

interface Props {
  onCreateClick: () => void;
}

export default function AdminDashboardHeader({ onCreateClick }: Props) {
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
      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[rgba(15,22,41,0.65)] backdrop-blur-xl px-6 py-4 shadow-[0_15px_45px_rgba(0,0,0,0.5)] transition-all">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-[var(--font-heading)] tracking-widest uppercase text-[var(--foreground)]">
              Scoreva
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--live)] live-pulse" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">

            <button
              onClick={onCreateClick}
              className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-all duration-300 hover:scale-[1.02]"
            >
              <PlusCircle size={16} />
              Create Match
            </button>

            <button
              onClick={() => router.push("/admin/dashboard/commentary")}
              className="flex items-center cursor-pointer gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-all duration-300 hover:scale-[1.02]"
            >
              <MessageSquareText size={16} />
              Commentary
            </button>

          </nav>

          {/* Profile */}
          <div className="hidden md:flex items-center gap-4 relative" ref={dropdownRef}>
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
        <div className="md:hidden mt-4 mx-6 rounded-2xl border border-[var(--border-subtle)] bg-[rgba(15,22,41,0.95)] backdrop-blur-xl px-6 py-6 shadow-[0_15px_45px_rgba(0,0,0,0.6)] space-y-6">

          <button
            onClick={() => {
              setOpen(false);
              onCreateClick();
            }}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <PlusCircle size={16} />
            Create Match
          </button>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/admin/dashboard/commentary");
            }}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <MessageSquareText size={16} />
            Commentary
          </button>

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
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