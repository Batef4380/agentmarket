"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/app/AppNav";

// ── Real Solana ecosystem agents ───────────────────────────────────────────
const ALL_AGENTS = [
  { id: "eliza-agent",      name: "ELIZA",              category: "Research",     score: 0, reviews: 0, capabilities: ["Multi-model", "Autonomous", "Plugin System"],      price: "0.005" },
  { id: "drift-vaults",     name: "Drift Vault Bot",    category: "DeFi",         score: 0, reviews: 0, capabilities: ["Delta Neutral", "Auto-rebalance", "Yield Vault"],   price: "0.01"  },
  { id: "birdeye-analytics",name: "Birdeye Analytics",  category: "Analytics",    score: 0, reviews: 0, capabilities: ["Token Metrics", "Wallet Tracking", "DEX Data"],     price: "0.003" },
  { id: "helius-webhooks",  name: "Helius Webhooks",    category: "Development",  score: 0, reviews: 0, capabilities: ["Event Streaming", "Enhanced RPC", "NFT APIs"],      price: "0.004" },
  { id: "jito-bundle-bot",  name: "Jito Bundle Bot",    category: "DeFi",         score: 0, reviews: 0, capabilities: ["MEV Capture", "Bundle Submit", "Tip Routing"],      price: "0.02"  },
  { id: "jupiter-dca",      name: "Jupiter DCA",        category: "DeFi",         score: 0, reviews: 0, capabilities: ["DCA Orders", "Limit Orders", "Price Alerts"],       price: "0.002" },
  { id: "ottersec-auditor", name: "OtterSec Auditor",   category: "Security",     score: 0, reviews: 0, capabilities: ["Anchor Audit", "Exploit Detection", "IDL Analysis"],price: "0.05"  },
  { id: "tensor-sniper",    name: "Tensor Sniper",      category: "DeFi",         score: 0, reviews: 0, capabilities: ["NFT Sniping", "Rarity Filter", "Auto-bid"],         price: "0.008" },
  { id: "pyth-oracle",      name: "Pyth Oracle Agent",  category: "Analytics",    score: 0, reviews: 0, capabilities: ["Price Feeds", "Confidence Bands", "Pull Model"],    price: "0.001" },
  { id: "dialect-blinks",   name: "Dialect Blinks",     category: "Development",  score: 0, reviews: 0, capabilities: ["Blink Builder", "Action URLs", "Tx Automation"],    price: "0.003" },
  { id: "meteora-lp-bot",   name: "Meteora LP Bot",     category: "DeFi",         score: 0, reviews: 0, capabilities: ["DLMM Management", "Fee Optimization", "Range Setting"], price: "0.006" },
  { id: "hivemapper-agent", name: "Hivemapper Agent",   category: "DePIN",        score: 0, reviews: 0, capabilities: ["Map Coverage", "Rewards Optimizer", "Route Planning"], price: "0.004" },
];

const CATEGORIES = ["All", "DeFi", "Research", "Analytics", "Development", "Security", "DePIN"];
type SortKey = "Top Rated" | "Most Reviewed" | "Newest";

// ── Gradient per category ──────────────────────────────────────────────────
const CATEGORY_GRADIENT: Record<string, string> = {
  DeFi: "linear-gradient(135deg, #C8A84B 0%, #1A2E1A 100%)",
  Research: "linear-gradient(135deg, #9945FF 0%, #0F1F0F 100%)",
  Analytics: "linear-gradient(135deg, #1A2E1A 0%, #14F195 100%)",
  Development: "linear-gradient(135deg, #14F195 0%, #0F1F0F 100%)",
  Security: "linear-gradient(135deg, #7f1d1d 0%, #0F1F0F 100%)",
  DePIN: "linear-gradient(135deg, #9945FF 0%, #1A2E1A 100%)",
};

// ── Agent card ─────────────────────────────────────────────────────────────
function AgentCard({ agent, rep }: { agent: (typeof ALL_AGENTS)[0]; rep?: { avg: number; count: number } }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/agents/${agent.id}`)}
      style={{
        background: "#fff",
        border: hovered ? "2px solid #C8A84B" : "2px solid transparent",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.25s ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Gradient thumbnail */}
      <div
        style={{
          height: 100,
          background: CATEGORY_GRADIENT[agent.category] ?? "linear-gradient(135deg, #1A2E1A, #C8A84B)",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#fff",
            letterSpacing: "0.1em",
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          #{agent.id}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: "20px 20px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Category badge */}
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: "#1A2E1A",
            color: "#F5F0E8",
            padding: "2px 7px",
            alignSelf: "flex-start",
            marginBottom: 10,
          }}
        >
          {agent.category}
        </span>

        {/* Name */}
        <h3
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: "clamp(16px, 1.4vw, 20px)",
            color: "#1A2E1A",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          {agent.name}
        </h3>

        {/* Score / new badge */}
        {rep && rep.count > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 1 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: s <= Math.round(rep.avg) ? "#C8A84B" : "rgba(200,168,75,0.2)", fontSize: 14 }}>★</span>
              ))}
            </div>
            <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 18, color: "#C8A84B", lineHeight: 1 }}>{rep.avg.toFixed(1)}</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>({rep.count})</span>
          </div>
        ) : (
          <div style={{ marginBottom: 14 }}>
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: 9,
              letterSpacing: "0.12em", color: "#166534",
              border: "1px solid rgba(22,101,52,0.35)", padding: "3px 8px",
              background: "rgba(22,101,52,0.07)",
            }}>
              NEW · Be the first to review
            </span>
          </div>
        )}

        {/* Capabilities */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
          {agent.capabilities.map((cap) => (
            <span
              key={cap}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                letterSpacing: "0.04em",
                color: "#3a4a3a",
                border: "1px solid rgba(26,46,26,0.2)",
                padding: "2px 7px",
                background: "rgba(26,46,26,0.04)",
              }}
            >
              {cap}
            </span>
          ))}
        </div>

        {/* ERC-8004 badge + price */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, marginTop: "auto" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#1A2E1A", letterSpacing: "0.05em" }}>
            {agent.price} SOL / task
          </p>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.1em", color: "#166534", padding: "2px 6px", border: "1px solid rgba(22,101,52,0.4)", background: "rgba(22,101,52,0.06)" }}>
            ◎ 8004-SOL
          </span>
        </div>

        {/* View button */}
        <button
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: 13,
            letterSpacing: "0.08em",
            color: "#F5F0E8",
            background: "#1A2E1A",
            border: "none",
            padding: "10px 0",
            cursor: "pointer",
            width: "100%",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#C8A84B")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1A2E1A")}
        >
          VIEW AGENT →
        </button>
      </div>
    </div>
  );
}

// ── Market page ────────────────────────────────────────────────────────────
export default function MarketPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("Top Rated");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedAgents, setVerifiedAgents] = useState<typeof ALL_AGENTS>([]);
  const [reviewSummary, setReviewSummary] = useState<Record<string, { avg: number; count: number }>>({});
  const [solanaPicks, setSolanaPicks] = useState<typeof ALL_AGENTS>(ALL_AGENTS.slice(0, 3));
  const [solanaMeta, setSolanaMeta] = useState<{
    blockhash: string | null;
    slot: number | null;
    rpc: string;
    solscanUrl: string | null;
    timestamp: string;
  }>({ blockhash: null, slot: null, rpc: "mainnet-beta", solscanUrl: null, timestamp: new Date().toISOString() });
  const [solanaLoading, setSolanaLoading] = useState(true);

  useEffect(() => {
    const pool = JSON.parse(localStorage.getItem("stovera_pool") || "[]");
    const verified = pool
      .filter((a: { status: string }) => a.status === "verified")
      .map((a: { id: string; name: string; category: string; price: string; capabilities: string[] }) => ({
        id: a.id, name: a.name, category: a.category,
        score: 0, reviews: 0, capabilities: a.capabilities, price: a.price,
      }));
    setVerifiedAgents(verified);
  }, []);

  useEffect(() => {
    fetch("/api/reviews?summary=1")
      .then((r) => r.json())
      .then((d) => { if (d.summary) setReviewSummary(d.summary); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchSolanaEntropy() {
      setSolanaLoading(true);
      try {
        // Manual timeout via Promise.race — AbortSignal.timeout unreliable in some envs
        const fetchPromise = fetch("/api/random/solana").then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 12000)
        );
        const json = await Promise.race([fetchPromise, timeoutPromise]);

        const pool = ALL_AGENTS;
        const seen = new Set<string>();
        const picks: typeof ALL_AGENTS = [];

        for (const hex of (json.entropy as string[])) {
          const idx = parseInt(hex.slice(0, 8), 16) % pool.length;
          const agent = pool[idx];
          if (!seen.has(agent.id)) { seen.add(agent.id); picks.push(agent); }
          if (picks.length === 3) break;
        }
        for (const a of pool) {
          if (picks.length >= 3) break;
          if (!seen.has(a.id)) { seen.add(a.id); picks.push(a); }
        }

        setSolanaPicks(picks.slice(0, 3));
        setSolanaMeta({
          blockhash: json.blockhash ?? null,
          slot: json.slot ?? null,
          rpc: json.rpc ?? "mainnet-beta",
          solscanUrl: json.solscanUrl ?? null,
          timestamp: json.timestamp,
        });
      } catch {
        // keep existing picks, just clear loading
      } finally {
        setSolanaLoading(false);
      }
    }

    fetchSolanaEntropy();
    // Refresh every 30 seconds — new block, new picks
    const interval = setInterval(fetchSolanaEntropy, 30000);
    return () => clearInterval(interval);
  }, []);

  const allAgents = [...ALL_AGENTS, ...verifiedAgents];

  const filtered = allAgents.filter((a) => {
    const matchesCat = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch =
      searchQuery === "" || a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sort === "Top Rated") return (reviewSummary[b.id]?.avg ?? 0) - (reviewSummary[a.id]?.avg ?? 0);
    if (sort === "Most Reviewed") return (reviewSummary[b.id]?.count ?? 0) - (reviewSummary[a.id]?.count ?? 0);
    return 0;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", paddingTop: 60 }}>
      <AppNav />

      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "28px 24px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: "clamp(28px, 3.5vw, 48px)",
            color: "#1A2E1A",
            letterSpacing: "0.02em",
          }}
        >
          AGENT MARKET
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 12,
              letterSpacing: "0.05em",
              color: "#1A2E1A",
              background: "#fff",
              border: "2px solid rgba(26,46,26,0.3)",
              borderRadius: 0,
              padding: "8px 14px",
              outline: "none",
              width: 220,
            }}
          />
          <div style={{ width: 1, height: 32, background: "rgba(26,46,26,0.15)" }} />
          <button
            onClick={() => router.push("/register")}
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: 14,
              letterSpacing: "0.1em",
              color: "#0F1F0F",
              background: "#C8A84B",
              border: "none",
              padding: "11px 24px",
              cursor: "pointer",
              transition: "background 0.2s, transform 0.1s",
              whiteSpace: "nowrap",
              boxShadow: "2px 2px 0px #1A2E1A",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#d4b455"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#C8A84B"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            + REGISTER AGENT
          </button>
        </div>
      </div>

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 24px",
          borderTop: "1px solid rgba(26,46,26,0.15)",
          borderBottom: "1px solid rgba(26,46,26,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          overflowX: "auto",
        }}
      >
        {/* Category tabs */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: active ? "#0F1F0F" : "#6B7B6B",
                  background: active ? "#C8A84B" : "transparent",
                  border: "none",
                  padding: "12px 16px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#6B7B6B",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}
          >
            Sort by:
          </span>
          {(["Top Rated", "Most Reviewed", "Newest"] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.08em",
                color: sort === s ? "#0F1F0F" : "#6B7B6B",
                background: sort === s ? "#C8A84B" : "transparent",
                border: "1px solid rgba(107,123,107,0.3)",
                padding: "5px 10px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Solana Entropy Picks ───────────────────────────────────────── */}
      <div style={{
          background: "#0a0a1a",
          backgroundImage: "linear-gradient(rgba(153,69,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(153,69,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          borderBottom: "1px solid rgba(153,69,255,0.25)",
          padding: "28px 0",
        }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 20 }}>◎</span>
                <div>
                  <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 18, color: "#F5F0E8", letterSpacing: "0.1em" }}>
                    SOLANA ENTROPY PICKS
                  </p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", letterSpacing: "0.15em", marginTop: 2 }}>
                    SELECTED VIA ON-CHAIN SOLANA BLOCKHASH
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: solanaLoading ? "rgba(107,123,107,0.08)" : solanaMeta?.slot ? "rgba(153,69,255,0.12)" : "rgba(107,123,107,0.1)",
                    border: solanaLoading ? "1px solid rgba(107,123,107,0.2)" : solanaMeta?.slot ? "1px solid rgba(153,69,255,0.4)" : "1px solid rgba(107,123,107,0.3)",
                    padding: "5px 10px",
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: solanaLoading ? "#6B7B6B" : solanaMeta?.slot ? "#9945FF" : "#6B7B6B",
                      animation: solanaLoading ? "pulse 1s infinite" : "none",
                    }} />
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: solanaLoading ? "#6B7B6B" : solanaMeta?.slot ? "#9945FF" : "#6B7B6B", letterSpacing: "0.1em" }}>
                      {solanaLoading ? "FETCHING BLOCK..." : solanaMeta?.slot ? `SLOT #${solanaMeta.slot.toLocaleString()} · LIVE` : "RPC UNAVAILABLE"}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B", letterSpacing: "0.1em" }}>NETWORK</p>
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#9945FF", letterSpacing: "0.05em" }}>
                      {solanaMeta?.rpc ?? "mainnet-beta"}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                  {solanaMeta?.blockhash && (
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B", letterSpacing: "0.05em" }}>
                      blockhash: <span style={{ color: "rgba(153,69,255,0.7)" }}>{solanaMeta.blockhash.slice(0, 16)}...</span>
                    </p>
                  )}
                  {solanaMeta?.solscanUrl && (
                    <a
                      href={solanaMeta.solscanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "rgba(153,69,255,0.6)", letterSpacing: "0.05em", textDecoration: "none" }}
                    >
                      VERIFY ON SOLSCAN →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 3 agent cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {solanaPicks.map((agent, i) => (
                <div
                  key={agent.id}
                  onClick={() => router.push(`/agents/${agent.id}`)}
                  style={{
                    background: "#0f0f20",
                    border: "1px solid rgba(153,69,255,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#9945FF";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(153,69,255,0.3)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ height: 6, background: i === 0 ? "#9945FF" : i === 1 ? "#14F195" : "rgba(153,69,255,0.5)" }} />
                  <div style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace", fontSize: 8,
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        background: "rgba(153,69,255,0.15)", color: "#9945FF",
                        padding: "2px 7px",
                      }}>
                        {agent.category}
                      </span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "rgba(153,69,255,0.5)", letterSpacing: "0.1em" }}>
                        #{i + 1} PICK
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 17, color: "#F5F0E8", marginBottom: 8, lineHeight: 1.2 }}>
                      {agent.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
                      <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 22, color: "#14F195", lineHeight: 1 }}>
                        {agent.score} ★
                      </span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>
                        ({agent.reviews} reviews)
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                      {agent.capabilities.slice(0, 2).map((c) => (
                        <span key={c} style={{
                          fontFamily: "JetBrains Mono, monospace", fontSize: 8,
                          color: "#6B7B6B", border: "1px solid rgba(153,69,255,0.2)", padding: "2px 6px",
                        }}>{c}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(153,69,255,0.15)", paddingTop: 10 }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>
                        {agent.price} SOL / task
                      </span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#9945FF", letterSpacing: "0.1em" }}>
                        VIEW →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* ── Agent grid ─────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "32px 24px 64px",
        }}
      >
        {filtered.length === 0 ? (
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 13,
              color: "#6B7B6B",
              textAlign: "center",
              padding: "80px 0",
              letterSpacing: "0.1em",
            }}
          >
            No agents found.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((agent) => (
              <AgentCard key={agent.id} agent={agent} rep={reviewSummary[agent.id]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
