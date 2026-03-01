"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email , setEmail] = useState("");
  const [username , setUsername] = useState("");
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8">

          <h1 className="text-2xl font-semibold font-[var(--font-heading)] tracking-tight">
            Sign up as{" "}
            <span className="bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
              User
            </span>
          </h1>

          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Create your account for real-time sports updates.
          </p>

          <form className="mt-6 space-y-5">

            <InputField
              onChange={(e)=> setUsername(e.target.value)}
              label="Full Name"
              placeholder="Enter your full name"
            />

            <InputField
            onChange={(e)=> setEmail(e.target.value)}
              label="Email"
              type="email"
              placeholder="you@example.com"
            />

            {/* PASSWORD */}
            <div>
              <label className="text-xs text-[var(--text-secondary)]">
                Password
              </label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-3 py-2 pr-10 text-sm focus:outline-none focus:border-[var(--violet)] transition-colors"
                  placeholder="Create password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* INLINE RULES */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                <PasswordRule label="8+ chars" valid={rules.length} />
                <PasswordRule label="Uppercase" valid={rules.uppercase} />
                <PasswordRule label="Number" valid={rules.number} />
                <PasswordRule label="Special" valid={rules.special} />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-xs text-[var(--text-secondary)]">
                Confirm Password
              </label>

              <div className="relative mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-lg bg-[var(--surface-elevated)] border px-3 py-2 pr-10 text-sm focus:outline-none transition-colors ${
                    confirmPassword.length === 0
                      ? "border-[var(--border-subtle)]"
                      : passwordsMatch
                      ? "border-[var(--live)]"
                      : "border-[var(--error)]"
                  }`}
                  placeholder="Re-enter password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-1 text-xs text-[var(--error)]">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!allValid}
              className={`w-full rounded-xl py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
                allValid
                  ? "bg-[var(--live)] text-[#042017] hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(0,255,148,0.25)]"
                  : "bg-[var(--surface-elevated)] text-[var(--text-muted)] cursor-not-allowed"
              }`}
            >
              Sign up as User
            </button>

          </form>

          <p className="mt-5 text-xs text-center text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--foreground)] hover:text-[var(--violet)] transition-colors"
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
  onChange
}: {
  label: string;
  type?: string;
  placeholder: string;
  onChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-xs text-[var(--text-secondary)]">
        {label}
      </label>
      <input
      
      type={type}
      className="mt-1 w-full rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--violet)] transition-colors"
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
    <div className="flex items-center gap-1 text-[10px]">
      <CheckCircle2
        size={12}
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