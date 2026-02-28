"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordValid =
    rules.length && rules.uppercase && rules.number && rules.special;

  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  const allValid = passwordValid && passwordsMatch;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass p-10">

          <h1 className="text-2xl sm:text-3xl font-semibold font-[var(--font-heading)] tracking-tight">
            Sign up as{" "}
            <span className="bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
              User
            </span>
          </h1>

          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Create your account to start experiencing real-time sports updates.
          </p>

          <form className="mt-8 space-y-6">

            <InputField label="Full Name" placeholder="Krishna Sahu" />

            <InputField label="Email" type="email" placeholder="you@example.com" />

            <div>
              <label className="text-sm text-[var(--text-secondary)]">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[var(--violet)] transition-colors"
                  placeholder="Create a secure password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <PasswordRule label="Minimum 8 characters" valid={rules.length} />
                <PasswordRule label="One uppercase letter" valid={rules.uppercase} />
                <PasswordRule label="One number" valid={rules.number} />
                <PasswordRule label="One special character" valid={rules.special} />
              </div>
            </div>

            <div>
              <label className="text-sm text-[var(--text-secondary)]">
                Confirm Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-lg bg-[var(--surface-elevated)] border px-4 py-3 pr-12 text-sm focus:outline-none transition-colors ${
                    confirmPassword.length === 0
                      ? "border-[var(--border-subtle)]"
                      : passwordsMatch
                      ? "border-[var(--live)]"
                      : "border-[var(--error)]"
                  }`}
                  placeholder="Re-enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-2 text-xs text-[var(--error)]">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!allValid}
              className={`w-full rounded-xl py-3 text-sm font-medium transition-all duration-300 ${
                allValid
                  ? "bg-[var(--live)] text-[#042017] shadow-[0_6px_18px_rgba(0,255,148,0.18)] hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(0,255,148,0.28)]"
                  : "bg-[var(--surface-elevated)] text-[var(--text-muted)] cursor-not-allowed"
              }`}
            >
              Sign up as User
            </button>

          </form>

          <p className="mt-6 text-sm text-center text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--foreground)] hover:text-[var(--violet)] transition-colors duration-300"
            >
              Sign in
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
}: {
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm text-[var(--text-secondary)]">
        {label}
      </label>
      <input
        type={type}
        className="mt-2 w-full rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--violet)] transition-colors"
        placeholder={placeholder}
      />
    </div>
  );
}

function PasswordRule({
  label,
  valid,
}: {
  label: string;
  valid: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <CheckCircle2
        size={14}
        className={valid ? "text-[var(--live)]" : "text-[var(--text-muted)]"}
      />
      <span
        className={
          valid
            ? "text-[var(--foreground)]"
            : "text-[var(--text-muted)]"
        }
      >
        {label}
      </span>
    </div>
  );
}