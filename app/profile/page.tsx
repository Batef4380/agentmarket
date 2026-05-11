"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import AppNav from "@/components/app/AppNav";

// ── Mock data ──────────────────────────────────────────────────────────────

const FAVORITE_AGENTS = [
  {
    name: "ResearchBot.sol",
    category: "Research",
    score: 4.9,
    gradient: "linear-gradient(135deg, #1A2E1A 0%, #2d5a2d 50%, #C8A84B 100%)",
  },
  {
    name: "AuditBot.sol",
    category: "Security",
    score: 4.9,
    gradient: "linear-gradient(135deg, #0F1F0F 0%, #1a3a2a 50%, #4ade80 100%)",
  },
  {
    name: "DataMiner.sol",
    category: "Analytics",
    score: 4.8,
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2e2a1a 50%, #C8A84B 100%)",
  },
  {
    name: "SolarAgent.sol",
    category: "DePIN",
    score: 4.9,
    gradient: "linear-gradient(135deg, #2e1a0f 0%, #4a2e10 50%, #f97316 100%)",
  },
];

const RECENT_ACTIVITY = [
  {
    timestamp: "2026-05-09 · 14:32",
    agent: "ResearchBot.sol",
    action: "TASK COMPLETED",
    actionColor: "#4ade80",
    cost: "0.002 SOL",
  },
  {
    timestamp: "2026-05-09 · 11:18",
    agent: "AuditBot.sol",
    action: "REVIEW LEFT",
    actionColor: "#C8A84B",
    cost: "0.000 SOL",
  },
  {
    timestamp: "2026-05-08 · 22:05",
    agent: "DataMiner.sol",
    action: "TASK COMPLETED",
    actionColor: "#4ade80",
    cost: "0.001 SOL",
  },
  {
    timestamp: "2026-05-08 · 16:44",
    agent: "TradingAgent.sol",
    action: "REVIEW LEFT",
    actionColor: "#C8A84B",
    cost: "0.000 SOL",
  },
  {
    timestamp: "2026-05-07 · 09:11",
    agent: "SolarAgent.sol",
    action: "TASK COMPLETED",
    actionColor: "#4ade80",
    cost: "0.003 SOL",
  },
];

const MY_REVIEWS = [
  {
    agent: "AuditBot.sol",
    category: "Security",
    score: 5,
    text: "Found 3 critical vulnerabilities in our smart contract that manual review missed. Exceptional.",
    helpful: 31,
    timestamp: "6h ago",
  },
  {
    agent: "ResearchBot.sol",
    category: "Research",
    score: 5,
    text: "Analyzed 50+ DeFi protocols in minutes. Accuracy was impressive, saved our team days of work.",
    helpful: 12,
    timestamp: "2h ago",
  },
  {
    agent: "DataMiner.sol",
    category: "Analytics",
    score: 3,
    text: "Decent data extraction but struggled with unstructured sources. Needs improvement for edge cases.",
    helpful: 4,
    timestamp: "8h ago",
  },
];

const WATCHLIST_AGENTS = [
  {
    name: "CodeHelper.sol",
    category: "Development",
    score: 4.6,
    gradient: "linear-gradient(135deg, #1a2e2e 0%, #1a3a3a 50%, #22d3ee 100%)",
    watching: true,
  },
  {
    name: "TradingAgent.sol",
    category: "DeFi",
    score: 4.7,
    gradient: "linear-gradient(135deg, #2e1a1a 0%, #3a2a10 50%, #C8A84B 100%)",
    watching: true,
  },
  {
    name: "NexusBot.sol",
    category: "Analytics",
    score: 4.5,
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2a1a3a 50%, #a855f7 100%)",
    watching: false,
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function StarRating({ score }: { score: number }) {
  return (
    <span style={{ letterSpacing: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            color: i <= score ? "#C8A84B" : "rgba(107,123,107,0.4)",
            fontSize: 14,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function AddressAvatar({ address }: { address: string }) {
  // Deterministic color from address (base58-compatible)
  const chars = address.slice(0, 2).toUpperCase();
  const hue = address.charCodeAt(0) * 37 + address.charCodeAt(1) * 17 + address.charCodeAt(2) * 7;
  const bg = `hsl(${hue}, 55%, 38%)`;

  return (
    <svg
      width={64}
      height={64}
      viewBox="0 0 64 64"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width={64} height={64} fill={bg} />
      <text
        x={32}
        y={40}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fontSize={22}
        fill="#F5F0E8"
      >
        {chars}
      </text>
    </svg>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy address"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "2px 4px",
        fontSize: 12,
        lineHeight: 1,
        color: copied ? "#C8A84B" : "#6B7B6B",
        transition: "color 0.2s",
      }}
    >
      {copied ? "✓" : "📋"}
    </button>
  );
}

// ── Tab content components ─────────────────────────────────────────────────

function FavoritesTab() {
  const [removed, setRemoved] = useState<string[]>([]);
  const visible = FAVORITE_AGENTS.filter((a) => !removed.includes(a.name));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}
    >
      {visible.map((agent) => (
        <AgentCard
          key={agent.name}
          agent={agent}
          onRemove={() => setRemoved((prev) => [...prev, agent.name])}
        />
      ))}
      {visible.length === 0 && (
        <p
          style={{
            gridColumn: "1 / -1",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 12,
            color: "#6B7B6B",
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          No favorites yet.
        </p>
      )}
    </div>
  );
}

function AgentCard({
  agent,
  onRemove,
}: {
  agent: (typeof FAVORITE_AGENTS)[0];
  onRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: hovered ? "2px solid #C8A84B" : "2px solid transparent",
        transition: "border-color 0.2s",
        overflow: "hidden",
      }}
    >
      {/* Gradient thumbnail */}
      <div
        style={{
          height: 80,
          background: agent.gradient,
        }}
      />
      <div style={{ padding: "14px 16px 16px" }}>
        {/* Category badge */}
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            background: "#1A2E1A",
            color: "#F5F0E8",
            padding: "2px 7px",
            display: "inline-block",
            marginBottom: 8,
          }}
        >
          {agent.category}
        </span>
        {/* Agent name */}
        <p
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: 16,
            color: "#1A2E1A",
            marginBottom: 6,
          }}
        >
          {agent.name}
        </p>
        {/* Score */}
        <p
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: 18,
            color: "#C8A84B",
            marginBottom: 12,
          }}
        >
          ★ {agent.score}
        </p>
        {/* Remove button */}
        <button
          onClick={onRemove}
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "#6B7B6B",
            background: "transparent",
            border: "1px solid rgba(107,123,107,0.3)",
            padding: "5px 10px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#C8A84B";
            e.currentTarget.style.borderColor = "#C8A84B";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#6B7B6B";
            e.currentTarget.style.borderColor = "rgba(107,123,107,0.3)";
          }}
        >
          REMOVE ★
        </button>
      </div>
    </div>
  );
}

function RecentTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {RECENT_ACTIVITY.map((item, i) => (
        <div
          key={i}
          style={{
            padding: "18px 0",
            borderBottom:
              i < RECENT_ACTIVITY.length - 1
                ? "1px solid rgba(26,46,26,0.12)"
                : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  color: "#6B7B6B",
                  flexShrink: 0,
                }}
              >
                {item.timestamp}
              </span>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 8,
                  letterSpacing: "0.15em",
                  padding: "2px 6px",
                  background: `${item.actionColor}22`,
                  color: item.actionColor,
                  border: `1px solid ${item.actionColor}44`,
                  flexShrink: 0,
                }}
              >
                {item.action}
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                fontSize: 15,
                color: "#1A2E1A",
              }}
            >
              {item.agent}
            </p>
          </div>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              color: "#C8A84B",
              flexShrink: 0,
            }}
          >
            {item.cost}
          </span>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {MY_REVIEWS.map((review, i) => (
        <div
          key={i}
          style={{
            padding: "24px 0",
            borderBottom:
              i < MY_REVIEWS.length - 1
                ? "1px solid rgba(26,46,26,0.12)"
                : "none",
          }}
        >
          {/* Agent + category */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
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
                textTransform: "uppercase" as const,
                background: "#1A2E1A",
                color: "#F5F0E8",
                padding: "2px 7px",
              }}
            >
              {review.category}
            </span>
          </div>
          {/* Stars */}
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
              marginBottom: 12,
            }}
          >
            {review.text}
          </p>
          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
              Helpful · {review.helpful}
            </button>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                color: "#6B7B6B",
              }}
            >
              {review.timestamp}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WatchlistTab() {
  const [watching, setWatching] = useState<Record<string, boolean>>(
    Object.fromEntries(WATCHLIST_AGENTS.map((a) => [a.name, a.watching]))
  );

  const toggle = (name: string) =>
    setWatching((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {WATCHLIST_AGENTS.map((agent) => (
        <div
          key={agent.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 16px",
            background: "#fff",
          }}
        >
          {/* Gradient square */}
          <div
            style={{
              width: 40,
              height: 40,
              background: agent.gradient,
              flexShrink: 0,
            }}
          />
          {/* Info */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                fontSize: 15,
                color: "#1A2E1A",
                marginBottom: 2,
              }}
            >
              {agent.name}
            </p>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                background: "#1A2E1A",
                color: "#F5F0E8",
                padding: "1px 6px",
              }}
            >
              {agent.category}
            </span>
          </div>
          {/* Score */}
          <span
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: 14,
              color: "#C8A84B",
              background: "rgba(200,168,75,0.1)",
              padding: "2px 6px",
              flexShrink: 0,
            }}
          >
            {agent.score} ★
          </span>
          {/* Toggle button */}
          <button
            onClick={() => toggle(agent.name)}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: watching[agent.name] ? "#C8A84B" : "#6B7B6B",
              background: "transparent",
              border: `1px solid ${watching[agent.name] ? "#C8A84B" : "rgba(107,123,107,0.3)"}`,
              padding: "5px 10px",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            {watching[agent.name] ? "REMOVE" : "+ ADD TO WATCHLIST"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Profile page ───────────────────────────────────────────────────────────

const TABS = ["FAVORITES", "RECENT", "MY REVIEWS", "WATCHLIST"] as const;
type Tab = (typeof TABS)[number];

export default function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const address = publicKey?.toBase58() ?? null;
  const isConnected = connected;
  const [activeTab, setActiveTab] = useState<Tab>("FAVORITES");
  const [copied, setCopied] = useState(false);

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;


  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

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
        {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
        <aside
          style={{
            width: 280,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            position: "sticky",
            top: 80,
          }}
        >
          {/* Identity Card */}
          <div
            style={{
              border: "2px solid #C8A84B",
              background: "#fff",
              padding: 20,
            }}
          >
            {isConnected && address ? (
              <>
                {/* Avatar */}
                <div style={{ marginBottom: 14 }}>
                  <AddressAvatar address={address} />
                </div>
                {/* Address display */}
                <p
                  style={{
                    fontFamily: "var(--font-anton), Anton, sans-serif",
                    fontSize: 18,
                    color: "#1A2E1A",
                    marginBottom: 8,
                  }}
                >
                  {shortAddr}
                </p>
                {/* Address row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 11,
                      color: "#6B7B6B",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {shortAddr}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    title="Copy full address"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 4px",
                      fontSize: 13,
                      lineHeight: 1,
                      color: copied ? "#C8A84B" : "#6B7B6B",
                      transition: "color 0.2s",
                    }}
                  >
                    {copied ? "✓" : "📋"}
                  </button>
                </div>
              </>
            ) : (
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  color: "#6B7B6B",
                  lineHeight: 1.6,
                  letterSpacing: "0.05em",
                }}
              >
                Connect wallet to view profile
              </p>
            )}
          </div>

          {/* Trust Score */}
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(26,46,26,0.1)",
              padding: "18px 20px",
            }}
          >
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                color: "#C8A84B",
                letterSpacing: "0.25em",
                textTransform: "uppercase" as const,
                marginBottom: 6,
              }}
            >
              Trust Score
            </p>
            <p
              style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                fontSize: 48,
                color: "#C8A84B",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              847
            </p>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                color: "#4ade80",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                marginBottom: 12,
              }}
            >
              Verified Reviewer
            </p>
            {/* Progress bar */}
            <div
              style={{
                height: 4,
                background: "#1A2E1A",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "84%",
                  background: "#C8A84B",
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(26,46,26,0.1)",
              padding: "4px 0",
            }}
          >
            {[
              { label: "Tasks Completed", value: "23" },
              { label: "SOL Spent", value: "0.47" },
              { label: "Reviews Written", value: "18" },
              { label: "Helpful Votes", value: "94" },
            ].map((stat, i, arr) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 20px",
                  borderBottom:
                    i < arr.length - 1
                      ? "1px solid rgba(26,46,26,0.07)"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 11,
                    color: "#6B7B6B",
                    letterSpacing: "0.04em",
                  }}
                >
                  {stat.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-anton), Anton, sans-serif",
                    fontSize: 16,
                    color: "#1A2E1A",
                  }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 28,
              flexWrap: "wrap" as const,
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: active ? "#0F1F0F" : "#6B7B6B",
                    background: active ? "#C8A84B" : "transparent",
                    border: `1px solid ${active ? "#C8A84B" : "rgba(107,123,107,0.3)"}`,
                    padding: "7px 16px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "#C8A84B";
                      e.currentTarget.style.borderColor = "#C8A84B";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "#6B7B6B";
                      e.currentTarget.style.borderColor =
                        "rgba(107,123,107,0.3)";
                    }
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === "FAVORITES" && <FavoritesTab />}
          {activeTab === "RECENT" && <RecentTab />}
          {activeTab === "MY REVIEWS" && <ReviewsTab />}
          {activeTab === "WATCHLIST" && <WatchlistTab />}
        </main>
      </div>
    </div>
  );
}
