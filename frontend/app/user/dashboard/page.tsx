"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Radio, Activity } from "lucide-react";
import toast from "react-hot-toast";
import UserDashboardHeader from "@/components/UserDashboardHeader";
import { GetMatches, Match } from "@/lib/getusermatches";
import { GetUserDetails } from "@/lib/getuserdetails";
import { GetCommentary } from "@/lib/getcommentary";
import { useLiveCommentary } from "@/hooks/liveCommentary";

interface Commentary {
  id: number;
  matchId: number;
  minute: number | null;
  message: string;
  eventType: string | null;
  createdAt: string;
}

export default function UserDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [commentary, setCommentary] = useState<Commentary[]>([]);
  const [commentaryLoading, setCommentaryLoading] = useState(false);

  useLiveCommentary(selectedMatch?.id ?? null, (data) => {
    setCommentary((prev) => [...prev, data]);
  });

  useEffect(() => {
    async function load() {
      try {
        const [matchData, userData] = await Promise.all([
          GetMatches(),
          GetUserDetails(),
        ]);

        setMatches(matchData as Match[]);
        setUser(userData);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleSelectMatch = async (match: Match) => {
    setSelectedMatch(match);
    setCommentary([]);

    if (match.status !== "LIVE") return;

    try {
      setCommentaryLoading(true);

      const data = await GetCommentary(match.id);
      setCommentary([...data].reverse());
    } catch {
      toast.error("Failed to load commentary");
    } finally {
      setCommentaryLoading(false);
    }
  };

  return (
    <>
      <UserDashboardHeader onCreateClick={() => {}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 md:pt-8 space-y-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] font-semibold tracking-tight">
            Welcome{" "}
            <span className="bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
              {user?.username || "User"}
            </span>
          </h1>

          <p className="text-sm text-[var(--secondary)]">
            Follow live matches and commentary in real time.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="h-6 w-6 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
                <Activity size={16} />
                Available Matches
              </div>

              {matches.length === 0 && (
                <div className="glass p-10 text-center text-sm text-[var(--secondary)]">
                  No matches available
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                {matches.map((match) => (
                  <motion.div
                    key={match.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => handleSelectMatch(match)}
                    className={`glass p-6 cursor-pointer border transition-all ${
                      selectedMatch?.id === match.id
                        ? "border-[var(--cyan)] shadow-[var(--glow-cyan)]"
                        : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] px-2 py-1 rounded-md bg-[var(--surface)] border border-[var(--border-subtle)]">
                        {match.sport}
                      </span>

                      <StatusBadge status={match.status} />
                    </div>

                    <h3 className="mt-3 text-sm font-medium">
                      {match.firstTeam} vs {match.secondTeam}
                    </h3>

                    <div className="flex items-center gap-2 mt-3 text-xs text-[var(--secondary)]">
                      <CalendarDays size={14} />
                      {new Date(match.startTime).toLocaleString()}
                    </div>

                    {match.status === "LIVE" && (
                      <div className="mt-4 flex items-center gap-2 text-[10px] text-[var(--live)]">
                        <Radio size={12} className="animate-pulse" />
                        Live Commentary Available
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
                <Radio size={16} />
                Live Commentary
              </div>

              <div className="glass p-5 h-[520px] overflow-y-auto hide-scrollbar">
                {!selectedMatch && (
                  <div className="h-full flex items-center justify-center text-sm text-[var(--secondary)] text-center">
                    Select a live match to view commentary
                  </div>
                )}

                {selectedMatch && selectedMatch.status !== "LIVE" && (
                  <div className="h-full flex items-center justify-center text-sm text-[var(--secondary)] text-center">
                    Commentary available only for live matches
                  </div>
                )}

                {commentaryLoading && (
                  <div className="flex justify-center py-20">
                    <div className="h-5 w-5 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {selectedMatch &&
                    selectedMatch.status === "LIVE" &&
                    commentary.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-4 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]"
                      >
                        <div className="flex justify-between text-xs text-[var(--secondary)] mb-1">
                          <span>
                            {item.minute !== null && `${item.minute}'`}
                          </span>

                          {item.eventType && (
                            <span className="text-[var(--cyan)]">
                              {item.eventType}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-[var(--foreground)] leading-relaxed">
                          {item.message}
                        </p>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
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
    <span
      className={`text-[10px] px-2 py-1 rounded-md font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}