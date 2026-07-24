"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, CalendarDays, MessageSquareText, Radio } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAdminMatches, AdminMatch } from "@/lib/getAdminMatches";
import { postCommentary } from "@/lib/commentary";
import { ENV } from "@/lib/ENV";
import AdminDashboardHeader from "@/components/DashboardHeader";
import { Trash2 } from "lucide-react";
import { DeleteMatch } from "@/lib/deletematch";

export default function AdminDashboard() {
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  // Create Match Modal
  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Commentary Modal
  const [commentaryOpen, setCommentaryOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [postingCommentary, setPostingCommentary] = useState(false);

// Commentary States
const [commentaryMinute, setCommentaryMinute] = useState("");
const [commentarySequence, setCommentarySequence] = useState("");
const [commentaryPeriod, setCommentaryPeriod] = useState("");
const [commentaryEventType, setCommentaryEventType] = useState("");
const [commentaryActor, setCommentaryActor] = useState("");
const [commentaryTeam, setCommentaryTeam] = useState("");
const [commentaryTags, setCommentaryTags] = useState("");
const [commentaryMetadata, setCommentaryMetadata] = useState("");
const [commentaryMessage, setCommentaryMessage] = useState("");
const [page, setPage] = useState(0);
const [pagination, setPagination] = useState({ totalPages: 0 });
const limit = 6
  const [form, setForm] = useState({
    sport: "",
    firstTeam: "",
    secondTeam: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
 //Delete Match 

const [deleteOpen, setDeleteOpen] = useState(false);
const [deleteMatchId, setDeleteMatchId] = useState<number | null>(null);
const [deleting, setDeleting] = useState(false);


useEffect(() => {
  async function fetchData() {
    try {
      const res = await getAdminMatches({ page, limit });

      setMatches(res.matches);
      setPagination(res.pagination);
    } catch {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [page]);
// Delete Handler

const handleDeleteMatch = async () => {
  if (!deleteMatchId) return;

  try {
    setDeleting(true);

    await DeleteMatch(deleteMatchId);

    setMatches((prev) => prev.filter((m) => m.id !== deleteMatchId));

    toast.success("Match deleted");

    setDeleteOpen(false);
    setDeleteMatchId(null);
  } catch (error: any) {
    toast.error(error.message || "Failed to delete match");
  } finally {
    setDeleting(false);
  }
};

  // ---------------- CREATE MATCH ----------------

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

  // ---------------- POST COMMENTARY ----------------
const handlePostCommentary = async () => {
  if (!selectedMatchId) return;

  if (!commentaryMessage.trim()) {
    toast.error("Commentary message is required");
    return;
  }

  let parsedMetadata: Record<string, unknown> | undefined;

  if (commentaryMetadata.trim()) {
    try {
      parsedMetadata = JSON.parse(commentaryMetadata);
    } catch {
      toast.error("Metadata must be valid JSON");
      return;
    }
  }
const selectedMatch = matches.find(m => m.id === selectedMatchId);
if (!selectedMatch || selectedMatch.status !== "LIVE") {
  toast.error("Commentary allowed only when match is LIVE");
  return;
}
  try {
    setPostingCommentary(true);

    await postCommentary(selectedMatchId, {
      minute: commentaryMinute ? Number(commentaryMinute) : undefined,
      sequence: commentarySequence ? Number(commentarySequence) : undefined,
      period: commentaryPeriod || undefined,
      eventType: commentaryEventType || undefined,
      actor: commentaryActor || undefined,
      team: commentaryTeam || undefined,
      tags: commentaryTags
        ? commentaryTags.split(",").map((tag) => tag.trim())
        : undefined,
      metadata: parsedMetadata,
      message: commentaryMessage,
    });

    toast.success("Commentary added successfully");

    // Reset fields
    setCommentaryMinute("");
    setCommentarySequence("");
    setCommentaryPeriod("");
    setCommentaryEventType("");
    setCommentaryActor("");
    setCommentaryTeam("");
    setCommentaryTags("");
    setCommentaryMetadata("");
    setCommentaryMessage("");

    setCommentaryOpen(false);
  } catch (err: any) {
    toast.error(err.message || "Failed to post commentary");
  } finally {
    setPostingCommentary(false);
  }
};

  return (
  <>
    <AdminDashboardHeader onCreateClick={() => setOpenModal(true)} />

    <div className="space-y-10">
      <div className="flex items-center justify-between pt-4 md:pt-6">
        <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] font-semibold tracking-tight">
          Your{" "}
          <span className="bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
            Matches
          </span>
        </h1>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-6 w-6 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

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

      {!loading && matches.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative glass p-6 hover:border-[var(--border-strong)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300"
              >
    <div className="flex justify-between items-center pr-6">
  <h2 className="text-sm font-medium">
    {match.firstTeam} vs {match.secondTeam}
  </h2>

  <StatusBadge status={match.status} />
</div>

<button
  onClick={() => {
    setDeleteMatchId(match.id);
    setDeleteOpen(true);
  }}
  className="absolute cursor-pointer top-4 right-4 text-[var(--text-muted)] hover:text-[var(--crimson)] transition"
>
  <Trash2 size={16} />
</button>

                <div className="flex items-center gap-2 mt-4 text-xs text-[var(--text-muted)]">
                  <CalendarDays size={14} />
                  {new Date(match.startTime).toLocaleString()}
                </div>

                {match.status === "LIVE" && (
                  <div>
                    <button
                      onClick={() => {
                        setSelectedMatchId(match.id);
                        setCommentaryOpen(true);
                      }}
                      className="mt-5 w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] py-2 text-xs hover:border-[var(--border-strong)] transition-all"
                    >
                      <MessageSquareText size={14} />
                      Add Commentary
                    </button>

                    <button
                      onClick={() => router.push(`/admin/dashboard/match/${match.id}`)}
                      className="mt-5 w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] py-2 text-xs hover:border-[var(--border-strong)] transition-all"
                    >
                      <Radio size={14} />
                      View Live Feed
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center bottom-0 pt-8">
            <div className="glass flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-subtle)]">

              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                className="px-4 py-1.5 text-xs font-medium rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-xs text-[var(--text-muted)] px-2">
                Page <span className="text-[var(--foreground)] font-medium">{page + 1}</span>
              </span>

              <button
                disabled={matches.length < limit}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-1.5 text-xs font-medium rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>

            </div>
          </div>
        </>
      )}
    </div>
<AnimatePresence>
  {deleteOpen && (
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
        className="glass w-full max-w-md p-8 relative"
      >
        <button
          onClick={() => setDeleteOpen(false)}
          className="absolute cursor-pointer right-4 top-4 text-[var(--text-muted)] hover:text-[var(--foreground)]"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Delete Match
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Are you sure you want to delete this match? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setDeleteOpen(false)}
            className="px-4 cursor-pointer py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteMatch}
            disabled={deleting}
            className="px-4 py-2 cursor-pointer text-xs rounded-lg bg-[var(--crimson)] text-white hover:opacity-90 transition shadow-[var(--glow-crimson)]"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      {/*COMMENTARY MODAL */}
<AnimatePresence>
  {commentaryOpen && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="glass w-full max-w-xl p-8 relative max-h-[90vh] overflow-y-auto hide-scrollbar"
      >
        <button
          onClick={() => {
  setCommentaryOpen(false);
  setCommentaryMessage("");
}}
          className="absolute cursor-pointer right-4 top-4 text-[var(--text-muted)] hover:text-[var(--foreground)]"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-6">
          Add Commentary
        </h2>

        <div className="space-y-4">

          <Input
            label="Minute"
            type="number"
            value={commentaryMinute}
            onChange={setCommentaryMinute}
          />

          <Input
            label="Sequence"
            type="number"
            value={commentarySequence}
            onChange={setCommentarySequence}
          />

          <Input
            label="Period"
            value={commentaryPeriod}
            onChange={setCommentaryPeriod}
          />

          <Input
            label="Event Type"
            value={commentaryEventType}
            onChange={setCommentaryEventType}
          />

          <Input
            label="Actor"
            value={commentaryActor}
            onChange={setCommentaryActor}
          />

          <Input
            label="Team"
            value={commentaryTeam}
            onChange={setCommentaryTeam}
          />

          <Input
            label="Tags (comma separated)"
            value={commentaryTags}
            onChange={setCommentaryTags}
          />

          <div>
            <label className="text-xs text-[var(--text-secondary)]">
              Metadata (JSON optional)
            </label>
            <textarea
              value={commentaryMetadata}
              onChange={(e) => setCommentaryMetadata(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--violet)] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)]">
              Message *
            </label>
            <textarea
              value={commentaryMessage}
              onChange={(e) => setCommentaryMessage(e.target.value)}
              rows={4}
              placeholder="Write live commentary..."
              className="mt-1 w-full rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--violet)] transition-colors"
            />
          </div>

          <button
            onClick={handlePostCommentary}
            disabled={postingCommentary}
            className="mt-4 w-full cursor-pointer rounded-xl py-2.5 text-sm font-medium bg-[var(--crimson)] hover:opacity-90 transition-all shadow-[var(--glow-crimson)]"
          >
            {postingCommentary ? "Posting..." : "Post Commentary"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* ---------------- CREATE MATCH MODAL ---------------- */}

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

                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" label="Start Date"
                    value={form.startDate}
                    onChange={(v) => setForm({ ...form, startDate: v })} />

                  <Input type="time" label="Start Time"
                    value={form.startTime}
                    onChange={(v) => setForm({ ...form, startTime: v })} />
                </div>

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