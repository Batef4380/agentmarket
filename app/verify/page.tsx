"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import AppNav from "@/components/app/AppNav";
import { EnsName } from "@/components/app/EnsName";
import Link from "next/link";

const AUTHORIZED_VERIFIER = "EBprum6K7W7mQcAuTadaKAsPQQZywiU61D9yC1X2H4VA";

const MOCK_PENDING: PoolAgent[] = [
  {
    id: "stovera-assistant-1",
    name: "Stovera Assistant",
    category: "DeFi",
    description: "An AI agent that automates DeFi yield optimization strategies on Solana protocols.",
    price_label: "0.002 SOL / task",
    capabilities: ["Yield Optimization", "Portfolio Rebalancing", "Risk Assessment"],
    notes: "Fully audited. GitHub: github.com/stovera/assistant-agent",
    submitter_address: "EBprum6K7W7mQcAuTadaKAsPQQZywiU61D9yC1X2H4VA",
    operator_address: "EBprum6K7W7mQcAuTadaKAsPQQZywiU61D9yC1X2H4VA",
    created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    status: "pending",
  },
  {
    id: "sol-research-bot-1",
    name: "Sol Research Bot",
    category: "Research",
    description: "Scans Solana ecosystem for alpha: new protocol launches, token unlocks, and governance proposals.",
    price_label: "0.001 SOL / task",
    capabilities: ["Protocol Monitoring", "Token Analysis", "Governance Alerts"],
    notes: "Endpoint tested on devnet. Latency < 200ms.",
    submitter_address: "EBprum6K7W7mQcAuTadaKAsPQQZywiU61D9yC1X2H4VA",
    operator_address: "EBprum6K7W7mQcAuTadaKAsPQQZywiU61D9yC1X2H4VA",
    created_at: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
    status: "pending",
  },
  {
    id: "depin-monitor-1",
    name: "DePIN Monitor",
    category: "DePIN",
    description: "Monitors DePIN network health metrics, node uptime, and reward distribution anomalies in real time.",
    price_label: "0.003 SOL / task",
    capabilities: ["Node Health", "Reward Tracking", "Anomaly Detection"],
    submitter_address: "EBprum6K7W7mQcAuTadaKAsPQQZywiU61D9yC1X2H4VA",
    operator_address: "EBprum6K7W7mQcAuTadaKAsPQQZywiU61D9yC1X2H4VA",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: "pending",
  },
];

interface PoolAgent {
  id: string;
  name: string;
  category: string;
  description: string;
  long_description?: string;
  endpoint?: string;
  price_label: string;
  capabilities: string[];
  notes?: string;
  submitter_address: string;
  created_at: string;
  status: "pending" | "verified" | "rejected";
  operator_address: string;
}

const CATEGORY_COLOR: Record<string, string> = {
  DeFi: "linear-gradient(135deg, #C8A84B 0%, #1A2E1A 100%)",
  Research: "linear-gradient(135deg, #4ade80 0%, #0F1F0F 100%)",
  Analytics: "linear-gradient(135deg, #1A2E1A 0%, #4ade80 100%)",
  Development: "linear-gradient(135deg, #C8A84B 0%, #0F1F0F 100%)",
  Security: "linear-gradient(135deg, #7f1d1d 0%, #0F1F0F 100%)",
  DePIN: "linear-gradient(135deg, #4ade80 0%, #1A2E1A 100%)",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return "just now";
}

const DETAIL_LABEL = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 9,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "#6B7B6B",
  marginBottom: 6,
};

export default function VerifyPoolPage() {
  const { publicKey, connected } = useWallet();
  const address = publicKey?.toBase58() ?? null;
  const isAuthorized = address === AUTHORIZED_VERIFIER;

  const [pool, setPool] = useState<PoolAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"pending" | "verified" | "rejected" | "all">("pending");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents", { cache: "no-store" });
      const data = await res.json();
      const verified = (data.agents ?? []).filter((a: PoolAgent) => a.status !== "pending");
      setPool([...MOCK_PENDING, ...verified]);
    } catch {
      setPool(MOCK_PENDING);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) fetchAgents();
  }, [isAuthorized, fetchAgents]);

  const counts = {
    pending:  pool.filter((a) => a.status === "pending").length,
    verified: pool.filter((a) => a.status === "verified").length,
    rejected: pool.filter((a) => a.status === "rejected").length,
  };

  const displayed = filter === "all" ? pool : pool.filter((a) => a.status === filter);

  const updateStatus = async (id: string, status: "verified" | "rejected") => {
    setPool((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    await fetch(`/api/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-operator-secret": "stovera2026" },
      body: JSON.stringify({ status, verifiedBy: address }),
    });
  };

  // ── Not connected ──────────────────────────────────────────────────────────
  if (!connected) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1F0F", paddingTop: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AppNav />
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.3em", color: "#C8A84B", textTransform: "uppercase", marginBottom: 16 }}>Access Required</p>
          <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 40, color: "#F5F0E8", marginBottom: 12 }}>VERIFY POOL</p>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#6B7B6B", lineHeight: 1.7 }}>Connect your wallet to continue.</p>
        </div>
      </div>
    );
  }

  // ── Not authorized ─────────────────────────────────────────────────────────
  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1F0F", paddingTop: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AppNav />
        <div style={{ textAlign: "center", padding: "0 24px", maxWidth: 500 }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🔒</div>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.3em", color: "#C8A84B", textTransform: "uppercase", marginBottom: 14 }}>Invite Only</p>
          <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 36, color: "#F5F0E8", marginBottom: 16, lineHeight: 1.1 }}>
            VERIFICATION ACCESS IS CURRENTLY INVITE ONLY
          </p>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#6B7B6B", lineHeight: 1.8, marginBottom: 24 }}>
            The Stovera verify panel is restricted to trusted community verifiers. If you&apos;re interested in becoming a verifier, reach out.
          </p>
          <div style={{ padding: "10px 16px", background: "rgba(200,168,75,0.08)", border: "1px solid rgba(200,168,75,0.2)", display: "inline-block" }}>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B" }}>
              Connected as: <span style={{ color: "#C8A84B" }}>{address?.slice(0, 8)}...{address?.slice(-4)}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Authorized UI ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", paddingTop: 60 }}>
      <AppNav />

      <div style={{
        background: "#0F1F0F",
        backgroundImage: "linear-gradient(rgba(200,168,75,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        borderBottom: "1px solid rgba(200,168,75,0.3)",
        padding: "40px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.3em", color: "#C8A84B", textTransform: "uppercase", marginBottom: 10 }}>
                Community Verification
              </p>
              <h1 style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", color: "#F5F0E8", letterSpacing: "0.02em", marginBottom: 12 }}>
                VERIFY POOL
              </h1>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#6B7B6B", lineHeight: 1.7, maxWidth: 500 }}>
                Review submitted agents. Verify legitimate ones to list them on the market, or reject those that don&apos;t meet standards.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "Pending",  value: counts.pending,  color: "#C8A84B" },
                { label: "Verified", value: counts.verified, color: "#4ade80" },
                { label: "Rejected", value: counts.rejected, color: "#ef4444" },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(245,240,232,0.05)", border: "1px solid rgba(200,168,75,0.2)", padding: "16px 20px", textAlign: "center", minWidth: 80 }}>
                  <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 28, color: s.color, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", padding: "6px 14px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#4ade80", letterSpacing: "0.1em" }}>
                AUTHORIZED VERIFIER · <EnsName address={address} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10 }} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28, borderBottom: "1px solid rgba(26,46,26,0.15)" }}>
          {(["pending", "verified", "rejected", "all"] as const).map((f) => {
            const active = filter === f;
            const count = f === "all" ? pool.length : counts[f];
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.1em",
                color: active ? "#0F1F0F" : "#6B7B6B",
                background: active ? "#C8A84B" : "transparent",
                border: "none", padding: "10px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
              }}>
                {f.toUpperCase()}
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, background: active ? "rgba(0,0,0,0.15)" : "rgba(107,123,107,0.2)", color: active ? "#0F1F0F" : "#6B7B6B", padding: "1px 6px" }}>
                  {count}
                </span>
              </button>
            );
          })}
          <div style={{ marginLeft: "auto" }}>
            <Link href="/register" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.1em", color: "#1A2E1A", border: "1px solid rgba(26,46,26,0.4)", padding: "8px 16px", textDecoration: "none", display: "inline-block" }}>
              + SUBMIT AGENT
            </Link>
          </div>
        </div>

        {loading && (
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#6B7B6B", textAlign: "center", padding: "60px 0", letterSpacing: "0.15em" }}>
            LOADING POOL...
          </p>
        )}

        {!loading && displayed.length === 0 && (
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#6B7B6B", textAlign: "center", padding: "60px 0" }}>
            No agents in this category.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {displayed.map((agent) => {
            const isExpanded = expanded === agent.id;
            return (
              <div key={agent.id} style={{ background: "#fff", border: `2px solid ${agent.status === "verified" ? "#4ade80" : agent.status === "rejected" ? "rgba(239,68,68,0.4)" : "#1A2E1A"}` }}>
                <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                  <div style={{ width: 6, background: CATEGORY_COLOR[agent.category] ?? "#1A2E1A", flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 18, color: "#1A2E1A", lineHeight: 1 }}>{agent.name}</h3>
                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", background: "#1A2E1A", color: "#F5F0E8", padding: "2px 7px" }}>
                          {agent.category}
                        </span>
                        {agent.status !== "pending" && (
                          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", background: agent.status === "verified" ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.1)", color: agent.status === "verified" ? "#4ade80" : "#ef4444", border: `1px solid ${agent.status === "verified" ? "rgba(74,222,128,0.4)" : "rgba(239,68,68,0.3)"}`, padding: "2px 8px" }}>
                            {agent.status === "verified" ? "✓ VERIFIED" : "✗ REJECTED"}
                          </span>
                        )}
                      </div>
                      <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                        by <EnsName address={agent.submitter_address} showAvatar style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10 }} /> · {timeAgo(agent.created_at)} · {agent.price_label}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => setExpanded(isExpanded ? null : agent.id)} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "#6B7B6B", background: "transparent", border: "1px solid rgba(107,123,107,0.3)", padding: "7px 14px", cursor: "pointer" }}>
                        {isExpanded ? "COLLAPSE ↑" : "DETAILS ↓"}
                      </button>
                      {agent.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(agent.id, "rejected")} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.1em", color: "#ef4444", background: "transparent", border: "1px solid rgba(239,68,68,0.4)", padding: "7px 14px", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                            ✗ REJECT
                          </button>
                          <button onClick={() => updateStatus(agent.id, "verified")} style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 12, letterSpacing: "0.08em", color: "#0F1F0F", background: "#4ade80", border: "none", padding: "8px 18px", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#22c55e"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#4ade80"; }}>
                            ✓ VERIFY
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: "20px 26px 24px", borderTop: "1px solid rgba(26,46,26,0.1)", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <p style={{ ...DETAIL_LABEL }}>Description</p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2E1A", lineHeight: 1.7, opacity: 0.85 }}>{agent.description}</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div>
                        <p style={{ ...DETAIL_LABEL }}>Price</p>
                        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#1A2E1A" }}>{agent.price_label}</p>
                      </div>
                      <div>
                        <p style={{ ...DETAIL_LABEL }}>Submitted By</p>
                        <EnsName address={agent.submitter_address} showAvatar style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#1A2E1A" }} />
                      </div>
                    </div>
                    <div>
                      <p style={{ ...DETAIL_LABEL }}>Capabilities</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {(agent.capabilities ?? []).map((c: string) => (
                          <span key={c} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.05em", color: "#1A2E1A", border: "1px solid rgba(26,46,26,0.3)", padding: "3px 8px", background: "rgba(26,46,26,0.04)" }}>{c}</span>
                        ))}
                      </div>
                    </div>
                    {agent.notes && (
                      <div>
                        <p style={{ ...DETAIL_LABEL }}>Notes</p>
                        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#6B7B6B", lineHeight: 1.7 }}>{agent.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
