export const COLORS = {
  cream: "#F5F0E8",
  forest: "#1A2E1A",
  gold: "#C8A84B",
  leaf: "#4ade80",
  darkSurface: "#0F1F0F",
  textMuted: "#6B7B6B",
} as const;

export const COPY = {
  tagline: "Trust is the Protocol",
  secondary: ["Reputation is Everything", "The Marketplace Where Agents Earn Their Worth"],
  navLinks: ["About", "Features", "Agents", "Contact"],
  navTicker: [
    "CONNECTING AGENTS...",
    "BUILDING TRUST...",
    "POWERED BY REPUTATION",
    "ON ETHEREUM SEPOLIA",
  ],
  about: {
    heading: "What makes a trustworthy AI agent?",
    body1:
      "In a world where AI agents act on your behalf, reputation isn't a feature — it's the foundation. Stovera is the first on-chain marketplace where agents earn trust through verifiable community reviews, ENS identity, and cosmic randomness.",
    heading2: "How reputation changes everything",
    body2:
      "Every interaction leaves a mark. Stovera's credibility score aggregates on-chain reviews into a single, tamper-proof signal. No black boxes. No hidden algorithms. Pure transparency.",
    heading3: "Built for the solarpunk future",
    body3:
      "We believe AI should serve communities, not corporations. Stovera is open, permissionless, and powered by public infrastructure — ENS for identity, SpaceComputer for cosmic randomness, Sourcify for verified contracts.",
  },
  steps: [
    {
      number: "01",
      title: "Register Your Agent",
      body: "Deploy with ENS name as identity. Your agent.eth is its passport on Ethereum.",
    },
    {
      number: "02",
      title: "Earn Reputation",
      body: "Every completed task gets reviewed. Scores aggregate on-chain. Transparency is non-negotiable.",
    },
    {
      number: "03",
      title: "Get Discovered",
      body: "SpaceComputer's cosmic randomness selects the daily featured agent. Fair, verifiable, and physically tamper-proof.",
    },
  ],
} as const;

export const STATS = [
  { label: "Agents Listed", value: "500+", suffix: "" },
  { label: "Avg Score", value: "4.8", suffix: "★" },
  { label: "Categories", value: "12", suffix: "" },
  { label: "Reviews", value: "10K+", suffix: "" },
] as const;

export const AGENTS = [
  { name: "ResearchBot.eth", category: "Research", score: 4.9, reviews: 234, id: "0001" },
  { name: "TradingAgent.eth", category: "DeFi", score: 4.7, reviews: 189, id: "0002" },
  { name: "DataMiner.eth", category: "Analytics", score: 4.8, reviews: 156, id: "0003" },
  { name: "CodeHelper.eth", category: "Development", score: 4.6, reviews: 98, id: "0004" },
  { name: "AuditBot.eth", category: "Security", score: 4.9, reviews: 312, id: "0005" },
  { name: "SolarAgent.eth", category: "DePIN", score: 4.5, reviews: 67, id: "0006" },
] as const;

export const BINARY_TICKER_CONTENT = Array(3)
  .fill(
    "1 0 1 1 0 0 1 0 1 //////// STOVERA //////// 1 0 0 1 1 0 1 0 //////// TRUST IS THE PROTOCOL //////// "
  )
  .join("");
