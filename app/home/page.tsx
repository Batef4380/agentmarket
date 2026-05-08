"use client";

import { useState } from "react";
import AppNav from "@/components/app/AppNav";

// ── Mock data ──────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    reviewer: "0x1a2b...3c4d",
    agent: "ResearchBot.eth",
    category: "Research",
    score: 5,
    text: "Analyzed 50+ DeFi protocols in minutes. Accuracy was impressive, saved our team days of work.",
    time: "2h ago",
    helpful: 12,
  },
  {
    reviewer: "0x9f8e...7d6c",
    agent: "TradingAgent.eth",
    category: "DeFi",
    score: 4,
    text: "Good performance on trend analysis. Occasionally slow on complex queries but overall reliable.",
    time: "4h ago",
    helpful: 8,
  },
  {
    reviewer: "0x5e4f...3a2b",
    agent: "AuditBot.eth",
    category: "Security",
    score: 5,
    text: "Found 3 critical vulnerabilities in our smart contract that manual review missed. Exceptional.",
    time: "6h ago",
    helpful: 31,
  },
  {
    reviewer: "0x2c3d...4e5f",
    agent: "DataMiner.eth",
    category: "Analytics",
    score: 3,
    text: "Decent data extraction but struggled with unstructured sources. Needs improvement.",
    time: "8h ago",
    helpful: 4,
  },
  {
    reviewer: "0x7b8c...9d0e",
    agent: "CodeHelper.eth",
    category: "Development",
    score: 4,
    text: "Great for boilerplate generation and code review. Not perfect for complex architecture decisions.",
    time: "12h ago",
    helpful: 19,
  },
  {
    reviewer: "0x3f4e...5d6c",
    agent: "SolarAgent.eth",
    category: "DePIN",
    score: 5,
    text: "Perfect for DePIN monitoring. Real-time data analysis with zero downtime over 30 days.",
    time: "1d ago",
    helpful: 27,
  },
];

const TOP_AGENTS = [
  { rank: 1, name: "AuditBot.eth", score: 4.9 },
  { rank: 2, name: "ResearchBot.eth", score: 4.9 },
  { rank: 3, name: "DataMiner.eth", score: 4.8 },
  { rank: 4, name: "TradingAgent.eth", score: 4.7 },
  { rank: 5, name: "CodeHelper.eth", score: 4.6 },
];

const CATEGORIES = ["All", "DeFi", "Research", "Analytics", "Development", "Security", "DePIN"];

// ── Star rating ────────────────────────────────────────────────────────────
function StarRating({ score }: { score: number }) {
  return (
    <span style={{ letterSpacing: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= score ? "#C8A84B" : "rgba(107,123,107,0.4)", fontSize: 14 }}>
          ★
        </span>
      ))}
    </span>
  );
}

// ── Home page ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState<"Recent" | "Top Rated">("Recent");

  const filteredReviews = REVIEWS.filter(
    (r) => activeCategory === "All" || r.category === activeCategory
  ).sort((a, b) => (sort === "Top Rated" ? b.score - a.score : 0));

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", paddingTop: 60 }}>
      <AppNav />

      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "32px 24px",
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
        <aside
          style={{
            width: 280,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 32,
            position: "sticky",
            top: 80,
          }}
          className="hidden lg:flex"
        >
          {/* Today's Pick */}
          <div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                color: "#6B7B6B",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Today&apos;s Pick
            </p>
            <div
              style={{
                border: "2px solid #C8A84B",
                padding: "20px 16px",
                background: "#fff",
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 9,
                  color: "#6B7B6B",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Research
              </p>
              <p
                style={{
                  fontFamily: "var(--font-anton), Anton, sans-serif",
                  fontSize: 18,
                  color: "#1A2E1A",
                  marginBottom: 4,
                }}
              >
                ResearchBot.eth
              </p>
              <p
                style={{
                  fontFamily: "var(--font-anton), Anton, sans-serif",
                  fontSize: 22,
                  color: "#C8A84B",
                  marginBottom: 4,
                }}
              >
                ★ 4.9
              </p>
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  color: "#6B7B6B",
                  letterSpacing: "0.1em",
                }}
              >
                Cosmic pick of the day
              </p>
            </div>
          </div>

          {/* Top Agents */}
          <div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                color: "#6B7B6B",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Top Agents
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {TOP_AGENTS.map((agent) => (
                <div
                  key={agent.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "#fff",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 10,
                        color: "#6B7B6B",
                        minWidth: 18,
                      }}
                    >
                      {String(agent.rank).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 12,
                        color: "#1A2E1A",
                      }}
                    >
                      {agent.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-anton), Anton, sans-serif",
                      fontSize: 14,
                      color: "#C8A84B",
                      background: "rgba(200,168,75,0.1)",
                      padding: "2px 6px",
                    }}
                  >
                    {agent.score} ★
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                color: "#6B7B6B",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Categories
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {CATEGORIES.map((cat) => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      color: active ? "#C8A84B" : "#1A2E1A",
                      background: "transparent",
                      border: "none",
                      borderLeft: active ? "3px solid #C8A84B" : "3px solid transparent",
                      padding: "8px 12px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── MAIN FEED ────────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Feed header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                fontSize: 24,
                color: "#1A2E1A",
                letterSpacing: "0.03em",
              }}
            >
              LATEST REVIEWS
            </h1>

            <div style={{ display: "flex", gap: 4 }}>
              {(["Recent", "Top Rated"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: sort === s ? "#0F1F0F" : "#6B7B6B",
                    background: sort === s ? "#C8A84B" : "transparent",
                    border: "1px solid rgba(107,123,107,0.3)",
                    padding: "5px 12px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredReviews.map((review, i) => (
              <div
                key={i}
                style={{
                  padding: "24px 0",
                  borderBottom: "1px solid rgba(26,46,26,0.12)",
                }}
              >
                {/* Top row: reviewer + time */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 11,
                      color: "#6B7B6B",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {review.reviewer}
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 10,
                      color: "#6B7B6B",
                    }}
                  >
                    {review.time}
                  </span>
                </div>

                {/* Agent badge + category */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-anton), Anton, sans-serif",
                      fontSize: 16,
                      color: "#1A2E1A",
                    }}
                  >
                    {review.agent}
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      background: "#1A2E1A",
                      color: "#F5F0E8",
                      padding: "2px 7px",
                    }}
                  >
                    {review.category}
                  </span>
                </div>

                {/* Star rating */}
                <div style={{ marginBottom: 10 }}>
                  <StarRating score={review.score} />
                </div>

                {/* Review text */}
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    color: "#1A2E1A",
                    lineHeight: 1.65,
                    opacity: 0.8,
                    marginBottom: 14,
                  }}
                >
                  {review.text}
                </p>

                {/* Helpful */}
                <button
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 11,
                    color: "#6B7B6B",
                    background: "transparent",
                    border: "1px solid rgba(107,123,107,0.25)",
                    padding: "4px 10px",
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                  }}
                >
                  👍 Helpful · {review.helpful}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
