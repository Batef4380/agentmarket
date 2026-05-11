"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import AppNav from "@/components/app/AppNav";
import { EnsName } from "@/components/app/EnsName";
import Link from "next/link";

interface PoolAgent {
  id: string;
  name: string;
  category: string;
  description: string;
  endpoint: string;
  price: string;
  capabilities: string[];
  notes?: string;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  verifiedAt?: string;
}

const MOCK_POOL: PoolAgent[] = [
  {
    id: "mock_001",
    name: "YieldOptimizer.sol",
    category: "DeFi",
    description: "Automatically optimizes yield farming strategies across multiple protocols by analyzing APY, gas costs, and risk parameters in real-time.",
    endpoint: "https://api.yieldoptimizer.xyz/v1",
    price: "0.003",
    capabilities: ["Yield Farming", "APY Analysis", "Auto-Compound"],
    notes: "Audited by CertiK. GitHub: github.com/yieldopt. Live for 3 months on testnet.",
    submittedBy: "0x3f4e5d6c7e8f9a0b",
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: "pending",
  },
  {
    id: "mock_002",
    name: "NFTAnalyzer.sol",
    category: "Analytics",
    description: "Deep NFT collection analytics — floor price tracking, whale wallet monitoring, and rarity score calculations across all major marketplaces.",
    endpoint: "https://api.nftanalyzer.xyz/v1",
    price: "0.001",
    capabilities: ["Floor Price", "Whale Tracking", "Rarity Score"],
    submittedBy: "0x7b8c9d0e1f2a3b4c",
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "pending",
  },
  {
    id: "mock_003",
    name: "BridgeAgent.sol",
    category: "DeFi",
    description: "Cross-chain bridge optimization — finds the cheapest and fastest bridge routes for token transfers across 15+ supported networks.",
    endpoint: "https://api.bridgeagent.xyz/v1",
    price: "0.0015",
    capabilities: ["Cross-chain", "Bridge Routes", "Fee Optimization"],
    submittedBy: "0x1a2b3c4d5e6f7a8b",
    submittedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: "pending",
  },
  {
    id: "mock_004",
    name: "GovernanceBot.sol",
    category: "Research",
    description: "Monitors and summarizes DAO governance proposals across major protocols. Sends digest reports and voting recommendations based on your portfolio.",
    endpoint: "https://api.govbot.xyz/v1",
    price: "0.0008",
    capabilities: ["DAO Governance", "Proposal Digest", "Voting Analysis"],
    notes: "Open source. MIT license.",
    submittedBy: "0x5d6e7f8a9b0c1d2e",
    submittedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    status: "pending",
  },
];

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

export default function VerifyPoolPage() {
  const { publicKey, connected } = useWallet();
  const address = publicKey?.toBase58() ?? null;
  const isConnected = connected;
  const [pool, setPool] = useState<PoolAgent[]>([]);
  const [filter, setFilter] = useState<"pending" | "verified" | "rejected" | "all">("pending");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const stored: PoolAgent[] = JSON.parse(localStorage.getItem("stovera_pool") || "[]");
    setPool([...MOCK_POOL, ...stored]);
  }, []);

  const counts = {
    pending: pool.filter((a) => a.status === "pending").length,
    verified: pool.filter((a) => a.status === "verified").length,
    rejected: pool.filter((a) => a.status === "rejected").length,
  };

  const displayed = filter === "all" ? pool : pool.filter((a) => a.status === filter);

  const updateStatus = (id: string, status: "verified" | "rejected") => {
    setPool((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status, verifiedBy: address ?? undefined, verifiedAt: new Date().toISOString() }
          : a
      )
    );
    // Persist user-submitted ones back
    const stored: PoolAgent[] = JSON.parse(localStorage.getItem("stovera_pool") || "[]");
    const updated = stored.map((a) =>
      a.id === id ? { ...a, status, verifiedBy: address ?? undefined, verifiedAt: new Date().toISOString() } : a
    );
    localStorage.setItem("stovera_pool", JSON.stringify(updated));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", paddingTop: 60 }}>
      <AppNav />

      {/* Header */}
      <div
        style={{
          background: "#0F1F0F",
          backgroundImage: "linear-gradient(rgba(200,168,75,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          borderBottom: "1px solid rgba(200,168,75,0.3)",
          padding: "40px 24px",
        }}
      >
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
                Review submitted agents. Verify legitimate ones to list them on the market,
                or reject those that don&apos;t meet standards.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "Pending", value: counts.pending, color: "#C8A84B" },
                { label: "Verified", value: counts.verified, color: "#4ade80" },
                { label: "Rejected", value: counts.rejected, color: "#ef4444" },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(245,240,232,0.05)", border: "1px solid rgba(200,168,75,0.2)", padding: "16px 20px", textAlign: "center", minWidth: 80 }}>
                  <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 28, color: s.color, lineHeight: 1 }}>
                    {s.value}
                  </p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Verifier status */}
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: isConnected ? "rgba(74,222,128,0.1)" : "rgba(107,123,107,0.1)",
              border: `1px solid ${isConnected ? "rgba(74,222,128,0.3)" : "rgba(107,123,107,0.3)"}`,
              padding: "6px 14px",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: isConnected ? "#4ade80" : "#6B7B6B" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: isConnected ? "#4ade80" : "#6B7B6B", letterSpacing: "0.1em" }}>
                {isConnected && address ? (
              <>VERIFIER · <EnsName address={address} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.1em" }} /></>
            ) : "CONNECT WALLET TO VERIFY"}
              </span>
            </div>
            {isConnected && (
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>
                In production, verifier role is token-gated
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Filter tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28, borderBottom: "1px solid rgba(26,46,26,0.15)" }}>
          {(["pending", "verified", "rejected", "all"] as const).map((f) => {
            const active = filter === f;
            const count = f === "all" ? pool.length : counts[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: active ? "#0F1F0F" : "#6B7B6B",
                  background: active ? "#C8A84B" : "transparent",
                  border: "none",
                  padding: "10px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.15s",
                }}
              >
                {f.toUpperCase()}
                <span style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 9,
                  background: active ? "rgba(0,0,0,0.15)" : "rgba(107,123,107,0.2)",
                  color: active ? "#0F1F0F" : "#6B7B6B",
                  padding: "1px 6px",
                }}>
                  {count}
                </span>
              </button>
            );
          })}

          <div style={{ marginLeft: "auto" }}>
            <Link href="/register" style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: 11,
              letterSpacing: "0.1em", color: "#1A2E1A",
              border: "1px solid rgba(26,46,26,0.4)", padding: "8px 16px",
              textDecoration: "none", display: "inline-block",
            }}>
              + SUBMIT AGENT
            </Link>
          </div>
        </div>

        {displayed.length === 0 && (
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#6B7B6B", textAlign: "center", padding: "60px 0" }}>
            No agents in this category.
          </p>
        )}

        {/* Agent cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {displayed.map((agent) => {
            const isExpanded = expanded === agent.id;
            return (
              <div
                key={agent.id}
                style={{
                  background: "#fff",
                  border: `2px solid ${agent.status === "verified" ? "#4ade80" : agent.status === "rejected" ? "rgba(239,68,68,0.4)" : "#1A2E1A"}`,
                }}
              >
                {/* Card header */}
                <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                  {/* Gradient strip */}
                  <div style={{ width: 6, background: CATEGORY_COLOR[agent.category] ?? "#1A2E1A", flexShrink: 0 }} />

                  <div style={{ flex: 1, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <h3 style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 18, color: "#1A2E1A", lineHeight: 1 }}>
                            {agent.name}
                          </h3>
                          <span style={{
                            fontFamily: "JetBrains Mono, monospace", fontSize: 9,
                            letterSpacing: "0.15em", textTransform: "uppercase",
                            background: "#1A2E1A", color: "#F5F0E8", padding: "2px 7px",
                          }}>
                            {agent.category}
                          </span>
                          {agent.status !== "pending" && (
                            <span style={{
                              fontFamily: "JetBrains Mono, monospace", fontSize: 9,
                              letterSpacing: "0.1em", textTransform: "uppercase",
                              background: agent.status === "verified" ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.1)",
                              color: agent.status === "verified" ? "#4ade80" : "#ef4444",
                              border: `1px solid ${agent.status === "verified" ? "rgba(74,222,128,0.4)" : "rgba(239,68,68,0.3)"}`,
                              padding: "2px 8px",
                            }}>
                              {agent.status === "verified" ? "✓ VERIFIED" : "✗ REJECTED"}
                            </span>
                          )}
                        </div>
                        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                          by <EnsName address={agent.submittedBy} showAvatar style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10 }} /> · {timeAgo(agent.submittedAt)} · {agent.price} SOL/task
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : agent.id)}
                        style={{
                          fontFamily: "JetBrains Mono, monospace", fontSize: 10,
                          letterSpacing: "0.1em", color: "#6B7B6B",
                          background: "transparent", border: "1px solid rgba(107,123,107,0.3)",
                          padding: "7px 14px", cursor: "pointer",
                        }}
                      >
                        {isExpanded ? "COLLAPSE ↑" : "DETAILS ↓"}
                      </button>

                      {agent.status === "pending" && isConnected && (
                        <>
                          <button
                            onClick={() => updateStatus(agent.id, "rejected")}
                            style={{
                              fontFamily: "JetBrains Mono, monospace", fontSize: 10,
                              letterSpacing: "0.1em", color: "#ef4444",
                              background: "transparent", border: "1px solid rgba(239,68,68,0.4)",
                              padding: "7px 14px", cursor: "pointer", transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                          >
                            ✗ REJECT
                          </button>
                          <button
                            onClick={() => updateStatus(agent.id, "verified")}
                            style={{
                              fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 12,
                              letterSpacing: "0.08em", color: "#0F1F0F",
                              background: "#4ade80", border: "none",
                              padding: "8px 18px", cursor: "pointer", transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#22c55e"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#4ade80"; }}
                          >
                            ✓ VERIFY
                          </button>
                        </>
                      )}

                      {agent.status === "pending" && !isConnected && (
                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", letterSpacing: "0.1em" }}>
                          Connect to verify
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ padding: "20px 26px 24px", borderTop: "1px solid rgba(26,46,26,0.1)", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <p style={{ ...DETAIL_LABEL }}>Description</p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2E1A", lineHeight: 1.7, opacity: 0.85 }}>
                        {agent.description}
                      </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div>
                        <p style={{ ...DETAIL_LABEL }}>Endpoint</p>
                        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#1A2E1A", wordBreak: "break-all" }}>
                          {agent.endpoint}
                        </p>
                      </div>
                      <div>
                        <p style={{ ...DETAIL_LABEL }}>Submitted By</p>
                        <EnsName address={agent.submittedBy} showAvatar style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#1A2E1A" }} />
                      </div>
                    </div>

                    <div>
                      <p style={{ ...DETAIL_LABEL }}>Capabilities</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {agent.capabilities.map((c) => (
                          <span key={c} style={{
                            fontFamily: "JetBrains Mono, monospace", fontSize: 9,
                            letterSpacing: "0.05em", color: "#1A2E1A",
                            border: "1px solid rgba(26,46,26,0.3)", padding: "3px 8px",
                            background: "rgba(26,46,26,0.04)",
                          }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {agent.notes && (
                      <div>
                        <p style={{ ...DETAIL_LABEL }}>Notes from Submitter</p>
                        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#6B7B6B", lineHeight: 1.7 }}>
                          {agent.notes}
                        </p>
                      </div>
                    )}

                    {agent.verifiedBy && (
                      <div style={{ padding: "10px 14px", background: agent.status === "verified" ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.05)", border: `1px solid ${agent.status === "verified" ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.2)"}` }}>
                        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: agent.status === "verified" ? "#4ade80" : "#ef4444", letterSpacing: "0.1em" }}>
                          {agent.status === "verified" ? "✓ VERIFIED" : "✗ REJECTED"} by{" "}
                          {agent.verifiedBy && <EnsName address={agent.verifiedBy} showAvatar style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10 }} />}
                          {" "}· {agent.verifiedAt ? timeAgo(agent.verifiedAt) : ""}
                        </p>
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

const DETAIL_LABEL = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 9,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "#6B7B6B",
  marginBottom: 6,
};
