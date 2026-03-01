"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserSignin } from "@/lib/userSignin";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const allValid =
    email.trim() !== "" &&
    password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const response = await UserSignin({
        email,
        password,
      });

      toast.success("Welcome back!");

      const role = response.data.role;

      const dashboardRoutes: Record<string, string> = {
        ADMIN: "/admin/dashboard",
        USER: "/user/dashboard",
      };

      router.replace(dashboardRoutes[role]);

    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8">
          <div className="flex items-center gap-2 mb-4">
            <LogIn className="w-5 h-5 text-[var(--violet)]" />
            <h1 className="text-2xl font-semibold font-[var(--font-heading)] tracking-tight">
              Sign in to{" "}
              <span className="bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
                Scoreva
              </span>
            </h1>
          </div>

          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Access your dashboard and experience real-time sports updates.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            <InputField
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="email"
              placeholder="you@example.com"
            />

            <div>
              <label className="text-xs text-[var(--text-secondary)]">
                Password
              </label>

              <div className="relative mt-1">
                <input
                  disabled={loading}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-3 py-2 pr-10 text-sm focus:outline-none focus:border-[var(--violet)] transition-colors disabled:opacity-60"
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!allValid || loading}
              className={`w-full rounded-xl py-2.5 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                !allValid || loading
                  ? "bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed"
                  : "bg-[#3E35A8] text-[var(--foreground)] hover:bg-[#342C8C] hover:-translate-y-[1px]"
              }`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

          </form>

          <p className="mt-5 text-xs text-center text-[var(--text-secondary)]">
            Don’t have an account?{" "}
            <Link
              href="/"
              className="text-[var(--foreground)] hover:text-[var(--violet)] transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  placeholder,
  onChange,
  disabled,
  value,
}: {
  label: string;
  type?: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  value: string;
}) {
  return (
    <div>
      <label className="text-xs text-[var(--text-secondary)]">
        {label}
      </label>
      <input
        value={value}
        disabled={disabled}
        type={type}
        onChange={onChange}
        className="mt-1 w-full rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--violet)] transition-colors disabled:opacity-60"
        placeholder={placeholder}
      />
    </div>
  );
}