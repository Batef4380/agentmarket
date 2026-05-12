"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import AppNav from "@/components/app/AppNav";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  task_id_bytes32: string;
  agent_id: string;
  deposit_sol: string;
  actual_cost_sol: string | null;
  status: string;
  tx_hash_deposit: string | null;
  tx_hash_complete: string | null;
  created_at: string;
  completed_at: string | null;
}

interface Review {
  id: string;
  agent_id: string;
  rating: number;
  comment: string | null;
  tx_hash: string | null;
  created_at: string;
}

function AddressAvatar({ address }: { address: string }) {
  const chars = address.slice(0, 2).toUpperCase();
  const hue = address.charCodeAt(0) * 37 + address.charCodeAt(1) * 17 + address.charCodeAt(2) * 7;
  const bg = `hsl(${hue}, 55%, 38%)`;
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" style={{ display: "block", flexShrink: 0 }}>
      <rect width={64} height={64} fill={bg} />
      <text x={32} y={40} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize={22} fill="#F5F0E8">{chars}</text>
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    completed: { bg: "rgba(74,222,128,0.12)", color: "#4ade80" },
    pending:   { bg: "rgba(200,168,75,0.12)", color: "#C8A84B" },
    executing: { bg: "rgba(153,69,255,0.12)", color: "#9945FF" },
    cancelled: { bg: "rgba(107,123,107,0.12)", color: "#6B7B6B" },
  };
  const c = colors[status] ?? colors.pending;
  return (
    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 7px", background: c.bg, color: c.color, border: `1px solid ${c.color}44` }}>
      {status}
    </span>
  );
}

const TABS = ["ACTIVITY", "MY REVIEWS"] as const;
type Tab = (typeof TABS)[number];

export default function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const address = publicKey?.toBase58() ?? null;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("ACTIVITY");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/tasks?userAddress=${address}`).then((r) => r.json()),
      fetch(`/api/reviews?userAddress=${address}`).then((r) => r.json()),
    ]).then(([taskData, reviewData]) => {
      setTasks(taskData.tasks ?? []);
      setReviews(reviewData.reviews ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [address]);

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const totalSpent = completedTasks.reduce((sum, t) => sum + parseFloat(t.actual_cost_sol ?? t.deposit_sol ?? "0"), 0);

  // Semi-real trust score: base 200 + 40 per task + 60 per review, cap 999
  const trustScore = Math.min(999, 200 + completedTasks.length * 40 + reviews.length * 60);
  const trustPct = (trustScore / 999) * 100;
  const trustLabel = trustScore >= 800 ? "POWER USER" : trustScore >= 500 ? "ACTIVE" : trustScore >= 300 ? "VERIFIED" : "NEW";

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };

  if (!connected) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F0E8", paddingTop: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AppNav />
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#6B7B6B", letterSpacing: "0.1em" }}>Connect wallet to view profile</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", paddingTop: 60 }}>
      <AppNav />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px", display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 80 }}>

          {/* Identity */}
          <div style={{ border: "2px solid #C8A84B", background: "#fff", padding: 20 }}>
            <div style={{ marginBottom: 14 }}><AddressAvatar address={address!} /></div>
            <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 18, color: "#1A2E1A", marginBottom: 6 }}>{shortAddr}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B" }}>{shortAddr}</span>
              <button onClick={handleCopy} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px 4px", fontSize: 12, color: copied ? "#C8A84B" : "#6B7B6B", transition: "color 0.2s" }}>
                {copied ? "✓" : "📋"}
              </button>
            </div>
          </div>

          {/* Trust Score */}
          <div style={{ background: "#fff", border: "1px solid rgba(26,46,26,0.1)", padding: "18px 20px" }}>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#C8A84B", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>Trust Score</p>
            <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 48, color: "#C8A84B", lineHeight: 1, marginBottom: 4 }}>{trustScore}</p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#4ade80", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>{trustLabel}</p>
            <div style={{ height: 4, background: "#1A2E1A", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${trustPct}%`, background: "#C8A84B", transition: "width 0.5s" }} />
            </div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B", marginTop: 8, lineHeight: 1.6 }}>
              Based on task history · review count · on-chain activity
            </p>
          </div>

          {/* Stats */}
          <div style={{ background: "#fff", border: "1px solid rgba(26,46,26,0.1)", padding: "4px 0" }}>
            {[
              { label: "Tasks Total",      value: tasks.length.toString() },
              { label: "Tasks Completed",  value: completedTasks.length.toString() },
              { label: "SOL Spent",        value: `${totalSpent.toFixed(4)} SOL` },
              { label: "Reviews Written",  value: reviews.length.toString() },
            ].map((stat, i, arr) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 20px", borderBottom: i < arr.length - 1 ? "1px solid rgba(26,46,26,0.07)" : "none" }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B" }}>{stat.label}</span>
                <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 15, color: "#1A2E1A" }}>{stat.value}</span>
              </div>
            ))}
          </div>

          <button onClick={() => router.push("/market")} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "#1A2E1A", background: "transparent", border: "2px solid #1A2E1A", padding: "10px 0", cursor: "pointer", width: "100%", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1A2E1A"; e.currentTarget.style.color = "#F5F0E8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1A2E1A"; }}>
            BROWSE AGENTS →
          </button>
        </aside>

        {/* ── MAIN ────────────────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.15em", color: active ? "#0F1F0F" : "#6B7B6B", background: active ? "#C8A84B" : "transparent", border: `1px solid ${active ? "#C8A84B" : "rgba(107,123,107,0.3)"}`, padding: "7px 16px", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = "#C8A84B"; e.currentTarget.style.borderColor = "#C8A84B"; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = "#6B7B6B"; e.currentTarget.style.borderColor = "rgba(107,123,107,0.3)"; } }}>
                  {tab}
                </button>
              );
            })}
          </div>

          {loading && (
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#6B7B6B", letterSpacing: "0.15em", padding: "60px 0", textAlign: "center" }}>LOADING...</p>
          )}

          {/* ── ACTIVITY TAB ─────────────────────────────────────────────── */}
          {!loading && activeTab === "ACTIVITY" && (
            <div style={{ background: "#fff", border: "2px solid #1A2E1A" }}>
              <div style={{ padding: "12px 20px", background: "#1A2E1A" }}>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.2em", color: "#C8A84B", textTransform: "uppercase" }}>Task History</p>
              </div>
              {tasks.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", letterSpacing: "0.1em" }}>NO TASKS YET</p>
                  <button onClick={() => router.push("/market")} style={{ marginTop: 16, fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#C8A84B", background: "transparent", border: "1px solid #C8A84B", padding: "8px 20px", cursor: "pointer" }}>
                    BROWSE AGENTS →
                  </button>
                </div>
              ) : (
                tasks.map((task, i) => (
                  <div key={task.id} style={{ padding: "18px 24px", borderBottom: i < tasks.length - 1 ? "1px solid rgba(26,46,26,0.08)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 15, color: "#1A2E1A" }}>{task.agent_id}</span>
                        <StatusBadge status={task.status} />
                      </div>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>
                          {new Date(task.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>
                          deposit: <span style={{ color: "#C8A84B" }}>{parseFloat(task.deposit_sol).toFixed(4)} SOL</span>
                        </span>
                        {task.actual_cost_sol && (
                          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>
                            cost: <span style={{ color: "#4ade80" }}>{parseFloat(task.actual_cost_sol).toFixed(4)} SOL</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {task.tx_hash_deposit && (
                        <a href={`https://solscan.io/tx/${task.tx_hash_deposit}?cluster=devnet`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#4ade80", textDecoration: "none", border: "1px solid rgba(74,222,128,0.3)", padding: "3px 8px" }}>
                          TX ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── MY REVIEWS TAB ───────────────────────────────────────────── */}
          {!loading && activeTab === "MY REVIEWS" && (
            <div style={{ background: "#fff", border: "2px solid #1A2E1A" }}>
              <div style={{ padding: "12px 20px", background: "#1A2E1A" }}>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.2em", color: "#C8A84B", textTransform: "uppercase" }}>On-Chain Reviews</p>
              </div>
              {reviews.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", letterSpacing: "0.1em" }}>NO REVIEWS YET</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7B6B", marginTop: 8, lineHeight: 1.6 }}>Complete a task to leave an on-chain review.</p>
                </div>
              ) : (
                reviews.map((r, i) => (
                  <div key={r.id} style={{ padding: "20px 24px", borderBottom: i < reviews.length - 1 ? "1px solid rgba(26,46,26,0.08)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 15, color: "#1A2E1A" }}>{r.agent_id}</span>
                        <div style={{ display: "flex", gap: 1 }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ color: s <= r.rating ? "#C8A84B" : "rgba(200,168,75,0.2)", fontSize: 13 }}>★</span>
                          ))}
                        </div>
                      </div>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B" }}>
                        {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    {r.comment && (
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2E1A", lineHeight: 1.65, opacity: 0.85, marginBottom: 8 }}>{r.comment}</p>
                    )}
                    {r.tx_hash && (
                      <a href={`https://solscan.io/tx/${r.tx_hash}?cluster=devnet`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#4ade80", textDecoration: "none" }}>
                        ◎ on-chain ↗
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
