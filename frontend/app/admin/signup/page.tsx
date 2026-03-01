"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { AdminSignup } from "@/lib/adminSignup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminSignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  const allValid =
    passwordValid &&
    passwordsMatch &&
    username.trim() !== "" &&
    email.trim() !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await AdminSignup({
        username,
        email,
        password,
      });

      toast.success("Admin account created successfully");

      setTimeout(() => {
        router.replace("/admin/signin");
      }, 1200);

    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
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
            <Shield className="w-5 h-5 text-[var(--crimson)]" />
            <h1 className="text-2xl font-semibold font-[var(--font-heading)] tracking-tight">
              Sign up as{" "}
              <span className="bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
                Admin
              </span>
            </h1>
          </div>

          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Create an admin account to manage matches, commentary, and real-time controls.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            <InputField
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
              label="Full Name"
              placeholder="Enter admin name"
            />

            <InputField
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="email"
              placeholder="admin@example.com"
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
                  placeholder="Create secure password"
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

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                <PasswordRule label="8+ chars" valid={rules.length} />
                <PasswordRule label="Uppercase" valid={rules.uppercase} />
                <PasswordRule label="Number" valid={rules.number} />
                <PasswordRule label="Special" valid={rules.special} />
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--text-secondary)]">
                Confirm Password
              </label>

              <div className="relative mt-1">
                <input
                  disabled={loading}
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-lg bg-[var(--surface-elevated)] border px-3 py-2 pr-10 text-sm focus:outline-none transition-colors disabled:opacity-60 ${
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
                  disabled={loading}
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
              disabled={!allValid || loading}
              className={`w-full rounded-xl py-2.5 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                !allValid || loading
                  ? "bg-[var(--surface-elevated)] text-[var(--text-muted)] cursor-not-allowed"
                  : "bg-[var(--crimson)] text-white hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(255,18,79,0.35)]"
              }`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating admin...
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>

          </form>

          <p className="mt-5 text-xs text-center text-[var(--text-secondary)]">
            Already an admin?{" "}
            <Link
              href="/admin/signin"
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
        className={
          valid ? "text-[var(--live)]" : "text-[var(--text-muted)]"
        }
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