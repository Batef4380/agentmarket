"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/app/AppNav";

// ── Mock agents (12 total) ─────────────────────────────────────────────────
const ALL_AGENTS = [
  {
    id: "web-scraper-pro",
    name: "Web Scraper Pro",
    category: "Analytics",
    score: 4.9,
    reviews: 234,
    capabilities: ["Data Extraction", "Scraping", "Reporting"],
    price: "0.001",
  },
  {
    id: "contract-auditor",
    name: "Contract Auditor",
    category: "Security",
    score: 4.8,
    reviews: 312,
    capabilities: ["Smart Contract Audit", "Bug Detection", "Gas Optimization"],
    price: "0.005",
  },
  {
    id: "market-analyst",
    name: "Market Analyst",
    category: "DeFi",
    score: 4.7,
    reviews: 189,
    capabilities: ["Trend Analysis", "Portfolio", "Risk Assessment"],
    price: "0.002",
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    category: "Development",
    score: 4.8,
    reviews: 167,
    capabilities: ["Code Review", "PR Review", "Refactoring"],
    price: "0.003",
  },
  {
    id: "nft-appraiser",
    name: "NFT Appraiser",
    category: "DeFi",
    score: 4.6,
    reviews: 98,
    capabilities: ["NFT Valuation", "Rarity Analysis", "Market Data"],
    price: "0.001",
  },
  {
    id: "tweet-bot",
    name: "Tweet Bot",
    category: "Research",
    score: 4.5,
    reviews: 67,
    capabilities: ["Content Generation", "Scheduling", "Crypto Native"],
    price: "0.0005",
  },
  {
    id: "defi-optimizer",
    name: "DeFi Optimizer",
    category: "DeFi",
    score: 4.7,
    reviews: 145,
    capabilities: ["Yield Farming", "APY Analysis", "Liquidity"],
    price: "0.004",
  },
  {
    id: "doc-generator",
    name: "Doc Generator",
    category: "Development",
    score: 4.6,
    reviews: 78,
    capabilities: ["Documentation", "Spec Writing", "Code Docs"],
    price: "0.002",
  },
  {
    id: "wallet-analyst",
    name: "Wallet Analyst",
    category: "Analytics",
    score: 4.6,
    reviews: 203,
    capabilities: ["On-chain Analytics", "Wallet Tracking", "Token Flows"],
    price: "0.001",
  },
  {
    id: "news-summarizer",
    name: "News Summarizer",
    category: "Research",
    score: 4.7,
    reviews: 156,
    capabilities: ["News Digest", "Summarization", "Web3 News"],
    price: "0.0005",
  },
  {
    id: "ens-resolver",
    name: "ENS Resolver",
    category: "Analytics",
    score: 4.9,
    reviews: 289,
    capabilities: ["ENS Lookup", "Reverse Resolve", "Address Book"],
    price: "0.0002",
  },
  {
    id: "gas-tracker",
    name: "Gas Tracker",
    category: "DeFi",
    score: 4.8,
    reviews: 45,
    capabilities: ["Gas Monitoring", "Alerts", "Tx Timing"],
    price: "0.0003",
  },
];

const CATEGORIES = ["All", "DeFi", "Research", "Analytics", "Development", "Security", "DePIN"];
type SortKey = "Top Rated" | "Most Reviewed" | "Newest";

// ── Gradient per category ──────────────────────────────────────────────────
const CATEGORY_GRADIENT: Record<string, string> = {
  DeFi: "linear-gradient(135deg, #C8A84B 0%, #1A2E1A 100%)",
  Research: "linear-gradient(135deg, #4ade80 0%, #0F1F0F 100%)",
  Analytics: "linear-gradient(135deg, #1A2E1A 0%, #4ade80 100%)",
  Development: "linear-gradient(135deg, #C8A84B 0%, #0F1F0F 100%)",
  Security: "linear-gradient(135deg, #7f1d1d 0%, #0F1F0F 100%)",
  DePIN: "linear-gradient(135deg, #4ade80 0%, #1A2E1A 100%)",
};

// ── Agent card ─────────────────────────────────────────────────────────────
function AgentCard({ agent }: { agent: (typeof ALL_AGENTS)[0] }) {
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
            color: "#C8A84B",
            letterSpacing: "0.1em",
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

        {/* Score */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
          <span
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: 28,
              color: "#C8A84B",
              lineHeight: 1,
            }}
          >
            {agent.score} ★
          </span>
        </div>

        {/* Review count */}
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#6B7B6B",
            letterSpacing: "0.05em",
            marginBottom: 14,
          }}
        >
          ({agent.reviews} reviews)
        </p>

        {/* Capabilities */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
          {agent.capabilities.map((cap) => (
            <span
              key={cap}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                letterSpacing: "0.05em",
                color: "#6B7B6B",
                border: "1px solid rgba(107,123,107,0.3)",
                padding: "2px 6px",
              }}
            >
              {cap}
            </span>
          ))}
        </div>

        {/* ERC-8004 badge + price */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, marginTop: "auto" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#1A2E1A", letterSpacing: "0.05em" }}>
            {agent.price} ETH / task
          </p>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.1em", color: "#4ade80", padding: "2px 6px", border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.05)" }}>
            ⬡ ERC-8004
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
  const [cosmicPicks, setCosmicPicks] = useState<typeof ALL_AGENTS | null>(null);
  const [cosmicMeta, setCosmicMeta] = useState<{
    seed: string;
    seq: number | null;
    live: boolean;
    source: string;
    signature: string | null;
    via: string;
  } | null>(null);

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
    async function fetchCosmicRandom() {
      let values: string[] = [];
      let source = "date_seeded";
      let signature: string | null = null;
      let seq: number | null = null;
      let live = false;
      let via = "fallback";

      try {
        const res = await fetch("/api/random", { signal: AbortSignal.timeout(10000) });
        if (res.ok) {
          const json = await res.json();
          values = json.values ?? [];
          source = json.source ?? "unknown";
          signature = json.signature ?? null;
          seq = json.sequence ?? null;
          live = json.live ?? false;
          via = json.via ?? "unknown";
        }
      } catch {
        // fallback handled below
      }

      const pool = ALL_AGENTS;
      const seen = new Set<string>();
      const picks: typeof ALL_AGENTS = [];

      for (const hex of values) {
        const idx = parseInt(hex.slice(0, 8), 16) % pool.length;
        const agent = pool[idx];
        if (!seen.has(agent.id)) { seen.add(agent.id); picks.push(agent); }
        if (picks.length === 3) break;
      }
      for (const a of pool) {
        if (picks.length >= 3) break;
        if (!seen.has(a.id)) { seen.add(a.id); picks.push(a); }
      }

      setCosmicPicks(picks.slice(0, 3));
      setCosmicMeta({
        seed: values[0]?.slice(0, 16) ?? "???",
        seq,
        live,
        source,
        signature,
        via,
      });
    }
    fetchCosmicRandom();
  }, []);

  const allAgents = [...ALL_AGENTS, ...verifiedAgents];

  const filtered = allAgents.filter((a) => {
    const matchesCat = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch =
      searchQuery === "" || a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sort === "Top Rated") return b.score - a.score;
    if (sort === "Most Reviewed") return b.reviews - a.reviews;
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

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              border: "2px solid #1A2E1A",
              borderRadius: 0,
              padding: "8px 14px",
              outline: "none",
              width: 220,
            }}
          />
          <button
            onClick={() => router.push("/register")}
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "#F5F0E8",
              background: "#1A2E1A",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              transition: "background 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#C8A84B")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1A2E1A")}
          >
            REGISTER AGENT
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

      {/* ── Cosmic Picks ───────────────────────────────────────────────── */}
      {cosmicPicks && (
        <div style={{
          background: "#0F1F0F",
          backgroundImage: "linear-gradient(rgba(200,168,75,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          borderBottom: "1px solid rgba(200,168,75,0.2)",
          padding: "28px 0",
        }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ color: "#C8A84B", fontSize: 18, animation: "spin 8s linear infinite" }}>✦</span>
                <div>
                  <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 18, color: "#F5F0E8", letterSpacing: "0.1em" }}>
                    COSMIC PICKS
                  </p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", letterSpacing: "0.15em", marginTop: 2 }}>
                    TODAY&apos;S RANDOM AGENT SPOTLIGHT
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                {/* Status pill */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: cosmicMeta?.via === "orbitport_api" ? "rgba(74,222,128,0.1)" : "rgba(200,168,75,0.08)",
                    border: cosmicMeta?.via === "orbitport_api" ? "1px solid rgba(74,222,128,0.4)" : "1px solid rgba(200,168,75,0.25)",
                    padding: "5px 10px",
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: cosmicMeta?.live ? "#4ade80" : "#6B7B6B" }} />
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: cosmicMeta?.live ? "#4ade80" : "#6B7B6B", letterSpacing: "0.1em" }}>
                      {cosmicMeta?.via === "orbitport_api" ? "SATELLITE · LIVE" : cosmicMeta?.via === "ipfs_beacon" ? "IPFS BEACON · LIVE" : "DATE-SEEDED"}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B", letterSpacing: "0.1em" }}>POWERED BY</p>
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#C8A84B", letterSpacing: "0.05em" }}>
                      SpaceComputer cTRNG{cosmicMeta?.seq ? ` · seq #${cosmicMeta.seq}` : ""}
                    </p>
                  </div>
                </div>
                {/* Seed + signature */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B", letterSpacing: "0.05em" }}>
                    entropy: <span style={{ color: "rgba(200,168,75,0.6)" }}>{cosmicMeta?.seed}...</span>
                  </p>
                  {cosmicMeta?.source && cosmicMeta.source !== "date_seeded" && (
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B", letterSpacing: "0.05em" }}>
                      source: <span style={{ color: "#4ade80" }}>{cosmicMeta.source}</span>
                    </p>
                  )}
                  {cosmicMeta?.signature && (
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B", letterSpacing: "0.05em" }}>
                      sig: <span style={{ color: "rgba(74,222,128,0.6)" }}>{cosmicMeta.signature.slice(0, 20)}...</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3 agent cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {cosmicPicks.map((agent, i) => (
                <div
                  key={agent.id}
                  onClick={() => router.push(`/agents/${agent.id}`)}
                  style={{
                    background: "#1A2E1A",
                    border: "1px solid rgba(200,168,75,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#C8A84B";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,168,75,0.35)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ height: 6, background: i === 0 ? "#C8A84B" : i === 1 ? "#4ade80" : "rgba(200,168,75,0.5)" }} />
                  <div style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace", fontSize: 8,
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        background: "rgba(200,168,75,0.15)", color: "#C8A84B",
                        padding: "2px 7px",
                      }}>
                        {agent.category}
                      </span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "rgba(200,168,75,0.4)", letterSpacing: "0.1em" }}>
                        #{i + 1} PICK
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 17, color: "#F5F0E8", marginBottom: 8, lineHeight: 1.2 }}>
                      {agent.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
                      <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 22, color: "#C8A84B", lineHeight: 1 }}>
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
                          color: "#6B7B6B", border: "1px solid rgba(107,123,107,0.3)", padding: "2px 6px",
                        }}>{c}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(200,168,75,0.15)", paddingTop: 10 }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>
                        {agent.price} ETH / task
                      </span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#C8A84B", letterSpacing: "0.1em" }}>
                        VIEW →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
