"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";
import { ENV } from "@/lib/ENV";

interface Commentary {
  id: number;
  matchId: number;

  minute: number | null;
  sequence: number | null;
  period: string | null;
  eventType: string | null;
  actor: string | null;
  team: string | null;

  message: string;

  metadata: Record<string, unknown> | null;
  tags: string[];

  createdAt: string;
}

export default function AdminMatchLivePage() {
  const params = useParams();
  const matchId = Number(params.id);

  const [commentary, setCommentary] = useState<Commentary[]>([]);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ---------------- FETCH HISTORY ----------------

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await axios.get(
          `${ENV.GET_COMMENTARY}/${matchId}`,
          { withCredentials: true }
        );

        setCommentary(res.data.data.reverse());
      } catch {
        toast.error("Failed to load commentary");
      } finally {
        setLoading(false);
      }
    }

    if (matchId) fetchHistory();
  }, [matchId]);

  // ---------------- AUTO SCROLL ----------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commentary]);

  // ---------------- WEBSOCKET ----------------

  useEffect(() => {
    if (!matchId) return;

    const socket = new WebSocket(`${ENV.WS_URL}/ws`);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "subscribe",
          matchId,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "commentary") {
          setCommentary((prev) => [...prev, message.data]);
        }
      } catch {
        console.error("Invalid WS message");
      }
    };

    socket.onerror = () => {
      toast.error("Live connection error");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "unsubscribe",
            matchId,
          })
        );
      }
      socket.close();
    };
  }, [matchId]);

  // ---------------- UI ----------------

  return (
    <div className="px-4 sm:px-6 max-w-6xl mx-auto -mt-10 sm:-mt-14">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 sm:mb-10">

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-[var(--font-heading)] font-semibold tracking-tight">
            Live
            <span className="ml-2 bg-gradient-to-r from-[var(--crimson)] via-[var(--violet)] to-[var(--cyan)] bg-clip-text text-transparent">
              Commentary
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
            Match ID: {matchId}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[var(--live)]/10 border border-[var(--live)]/30 w-fit">
          <Radio size={14} className="text-[var(--live)] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-medium text-[var(--live)]">
            LIVE STREAM
          </span>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-6 w-6 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* FEED CONTAINER */}
      <div className="glass rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-6 max-h-[65vh] sm:max-h-[70vh] overflow-y-auto hide-scrollbar">

        <AnimatePresence initial={false}>
          {commentary.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative mb-4 sm:mb-5 p-4 sm:p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all"
            >

              {/* Accent Line */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--crimson)] rounded-l-2xl" />

              {/* HEADER ROW */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[var(--secondary)]">

                  {item.minute !== null && (
                    <span className="px-2 py-1 rounded-md bg-[var(--live)]/10 text-[var(--live)] font-medium">
                      {item.minute}'
                    </span>
                  )}

                  {item.period && (
                    <span className="px-2 py-1 rounded-md bg-[var(--violet)]/15 text-[var(--violet)]">
                      {item.period}
                    </span>
                  )}

                  {item.sequence !== null && (
                    <span className="text-[var(--muted)]">
                      Seq #{item.sequence}
                    </span>
                  )}
                </div>

                {item.eventType && (
                  <span className="text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] font-medium tracking-wide">
                    {item.eventType}
                  </span>
                )}
              </div>

              {/* MAIN MESSAGE */}
              <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed mb-3">
                {item.message}
              </p>

              {/* META INFO */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-[var(--muted)] mb-3">

                {item.actor && (
                  <span>
                    <span className="text-[var(--secondary)]">Actor:</span> {item.actor}
                  </span>
                )}

                {item.team && (
                  <span>
                    <span className="text-[var(--secondary)]">Team:</span> {item.team}
                  </span>
                )}

                <span>
                  {new Date(item.createdAt).toLocaleTimeString()}
                </span>

              </div>

              {/* TAGS */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-[9px] sm:text-[10px] px-2 py-1 rounded-md bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--secondary)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* METADATA */}
              {item.metadata && (
                <details className="text-[10px] sm:text-[11px] text-[var(--muted)] cursor-pointer">
                  <summary className="hover:text-[var(--foreground)]">
                    View Metadata
                  </summary>
                  <pre className="mt-2 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] overflow-x-auto text-[9px] sm:text-[10px]">
                    {JSON.stringify(item.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}