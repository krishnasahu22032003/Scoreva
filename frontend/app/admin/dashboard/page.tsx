"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, CalendarDays } from "lucide-react";

import { getAdminMatches, AdminMatch } from "@/lib/getAdminMatches";
import { ENV } from "@/lib/ENV";
import AdminDashboardHeader from "@/components/DashboardHeader";

export default function AdminDashboard() {
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    sport: "",
    firstTeam: "",
    secondTeam: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  // 🔥 Fetch Matches
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAdminMatches();
        setMatches(data);
      } catch {
        toast.error("Failed to load matches");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 🔥 Create Match
  const handleCreateMatch = async () => {
    const {
      sport,
      firstTeam,
      secondTeam,
      startDate,
      startTime,
      endDate,
      endTime,
    } = form;

    if (
      !sport ||
      !firstTeam ||
      !secondTeam ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime
    ) {
      toast.error("All fields are required");
      return;
    }

    // Combine date + time
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setCreating(true);

      const res = await axios.post(
        ENV.CREATE_MATCH as string,
        {
          sport,
          firstTeam,
          secondTeam,
          startTime: startDateTime,
          endTime: endDateTime,
        },
        { withCredentials: true }
      );

      const newMatch = res.data.data;
      setMatches((prev) => [newMatch, ...prev]);

      toast.success("Match created successfully");
      setOpenModal(false);

      setForm({
        sport: "",
        firstTeam: "",
        secondTeam: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
      });

    } catch {
      toast.error("Failed to create match");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <AdminDashboardHeader onCreateClick={() => setOpenModal(true)} />

      <div className="space-y-10">

        {/* Title */}
        <div className="flex items-center justify-between pt-4 md:pt-6">
          <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] font-semibold tracking-tight">
            Your{" "}
            <span className="bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
              Matches
            </span>
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-6 w-6 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && matches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-[var(--text-muted)] text-sm">
              No matches yet.
            </p>
            <p className="text-[var(--text-secondary)] text-xs mt-2">
              Click “Create Match” to get started.
            </p>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && matches.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass p-6 hover:border-[var(--border-strong)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-medium">
                    {match.firstTeam} vs {match.secondTeam}
                  </h2>
                  <StatusBadge status={match.status} />
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs text-[var(--text-muted)]">
                  <CalendarDays size={14} />
                  {new Date(match.startTime).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="glass w-full max-w-lg p-8 relative"
            >
              <button
                onClick={() => setOpenModal(false)}
                className="absolute cursor-pointer right-4 top-4 text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                <X size={18} />
              </button>

              <h2 className="text-lg font-semibold mb-6">
                Create Match
              </h2>

              <div className="space-y-4">

                <Input label="Sport" value={form.sport}
                  onChange={(v) => setForm({ ...form, sport: v })} />

                <Input label="First Team" value={form.firstTeam}
                  onChange={(v) => setForm({ ...form, firstTeam: v })} />

                <Input label="Second Team" value={form.secondTeam}
                  onChange={(v) => setForm({ ...form, secondTeam: v })} />

                {/* Start Date + Time */}
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" label="Start Date"
                    value={form.startDate}
                    onChange={(v) => setForm({ ...form, startDate: v })} />

                  <Input type="time" label="Start Time"
                    value={form.startTime}
                    onChange={(v) => setForm({ ...form, startTime: v })} />
                </div>

                {/* End Date + Time */}
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" label="End Date"
                    value={form.endDate}
                    onChange={(v) => setForm({ ...form, endDate: v })} />

                  <Input type="time" label="End Time"
                    value={form.endTime}
                    onChange={(v) => setForm({ ...form, endTime: v })} />
                </div>

                <button
                  onClick={handleCreateMatch}
                  disabled={creating}
                  className="w-full cursor-pointer rounded-xl py-2.5 text-sm font-medium bg-[var(--crimson)] hover:opacity-90 transition-all shadow-[var(--glow-crimson)]"
                >
                  {creating ? "Creating..." : "Create Match"}
                </button>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    LIVE: "bg-[var(--live)] text-black live-pulse",
    UPCOMING: "bg-[var(--violet)] text-white",
    ENDED: "bg-[var(--ended)] text-white",
  };

  return (
    <span className={`text-[10px] px-2 py-1 rounded-md font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-[var(--text-secondary)]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--violet)] transition-colors"
      />
    </div>
  );
}