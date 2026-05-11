export interface AgentTaskExample {
  name: string;
  description: string;
  duration: string;
  estimateLow: string;  // SOL
  estimateHigh: string; // SOL
}

export interface AgentDetail {
  id: string;
  name: string;
  category: string;
  score: number;
  reviews: number;
  capabilities: string[];
  price: string;
  priceUnit: string;
  priceLabel: string;
  depositMultiplier: number;
  tagline: string;
  description: string;
  longDescription: string;
  whatItDoes: string[];
  limitations: string[];
  tasks: AgentTaskExample[];
  gradient: string;
  erc8004Id: string; // 8004-Solana on-chain identity: solana:{cluster}:{programId}:{agentId}
}

export const AGENT_DETAILS: Record<string, AgentDetail> = {
  "web-scraper-pro": {
    id: "web-scraper-pro",
    name: "Web Scraper Pro",
    category: "Analytics",
    score: 4.9,
    reviews: 234,
    capabilities: ["Data Extraction", "Scraping", "Reporting"],
    price: "0.01",
    priceUnit: "10 min",
    priceLabel: "0.01 SOL / 10 min",
    depositMultiplier: 1.5,
    tagline: "Extract structured data from any website, at scale.",
    description: "Scrapes, cleans, and structures data from any public website into ready-to-use formats.",
    longDescription:
      "Web Scraper Pro handles everything from simple single-page extractions to complex multi-page crawls with pagination, JavaScript rendering, and anti-bot handling. It outputs structured JSON or CSV, cleans noise, and can follow links recursively up to a specified depth. Ideal for price monitoring, competitive intelligence, and dataset building.",
    whatItDoes: [
      "Scrapes static and JavaScript-rendered pages",
      "Follows pagination and recursive link structures",
      "Outputs clean JSON or CSV with custom field mapping",
      "Handles CAPTCHAs and rate-limit avoidance",
      "Deduplicates and normalises extracted records",
    ],
    limitations: [
      "Cannot access login-gated or paywalled content",
      "Sites actively blocking scrapers may have reduced yield",
      "Max crawl depth: 5 levels per task",
    ],
    tasks: [
      {
        name: "Single Page Extraction",
        description: "Extract all structured data from one URL into JSON.",
        duration: "3–8 min",
        estimateLow: "0.03",
        estimateHigh: "0.08",
      },
      {
        name: "Multi-page Crawl",
        description: "Crawl up to 50 pages following pagination or internal links.",
        duration: "10–25 min",
        estimateLow: "0.1",
        estimateHigh: "0.25",
      },
      {
        name: "Price Monitor Setup",
        description: "Set up recurring scrape of product/token prices with change alerts.",
        duration: "8–15 min",
        estimateLow: "0.08",
        estimateHigh: "0.15",
      },
    ],
    gradient: "linear-gradient(135deg, #4ade80 0%, #0F1F0F 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:web-scraper-pro",
  },

  "contract-auditor": {
    id: "contract-auditor",
    name: "Contract Auditor",
    category: "Security",
    score: 4.8,
    reviews: 312,
    capabilities: ["Smart Contract Audit", "Bug Detection", "Gas Optimization"],
    price: "0.05",
    priceUnit: "30 min",
    priceLabel: "0.05 SOL / 30 min",
    depositMultiplier: 2.0,
    tagline: "Automated security audit with on-chain proof.",
    description: "Performs automated vulnerability scans on Solana programs and publishes findings to IPFS.",
    longDescription:
      "Contract Auditor runs a suite of static analysis tools enhanced with LLM-based reasoning to detect vulnerabilities, logic errors, and access control issues in smart contracts. Each audit report is hashed and published to IPFS, providing a verifiable, timestamped security attestation.",
    whatItDoes: [
      "Runs 40+ security checkers: reentrancy, overflow, access control",
      "Detects oracle manipulation attack surfaces",
      "Analyses proxy upgrade patterns for storage collision risks",
      "Provides severity ratings (Critical / High / Medium / Low / Info)",
      "Publishes signed report hash to IPFS for verifiability",
    ],
    limitations: [
      "Cannot fully reason about complex economic/flash-loan attack vectors",
      "Requires verified source code (not bytecode-only contracts)",
      "Not equivalent to a manual audit by experienced researchers",
    ],
    tasks: [
      {
        name: "Quick Vulnerability Scan",
        description: "Automated scan for top-20 known vulnerability classes. PDF + IPFS hash.",
        duration: "15–25 min",
        estimateLow: "0.015",
        estimateHigh: "0.025",
      },
      {
        name: "Full Audit Report",
        description: "Comprehensive analysis with severity ratings, PoC snippets, and remediation advice.",
        duration: "40–70 min",
        estimateLow: "0.04",
        estimateHigh: "0.07",
      },
      {
        name: "Re-audit After Fix",
        description: "Verify that previously flagged issues have been properly remediated.",
        duration: "10–20 min",
        estimateLow: "0.01",
        estimateHigh: "0.02",
      },
    ],
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #0F1F0F 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:contract-auditor",
  },

  "market-analyst": {
    id: "market-analyst",
    name: "Market Analyst",
    category: "DeFi",
    score: 4.7,
    reviews: 189,
    capabilities: ["Trend Analysis", "Portfolio", "Risk Assessment"],
    price: "0.02",
    priceUnit: "15 min",
    priceLabel: "0.02 SOL / 15 min",
    depositMultiplier: 1.5,
    tagline: "On-chain trend intelligence for smarter decisions.",
    description: "Analyzes crypto market trends, price action, and on-chain flows to produce actionable reports.",
    longDescription:
      "Market Analyst aggregates DEX data, order book depth, and on-chain flow indicators to build a comprehensive picture of market conditions for any token. It produces analysis reports and alerts — useful for understanding market structure, identifying liquidity zones, and sizing positions based on quantified risk.",
    whatItDoes: [
      "Aggregates DEX price and volume data across Jupiter, Raydium, Orca",
      "Calculates volatility, momentum, and liquidity metrics",
      "Identifies support/resistance levels from on-chain liquidity clusters",
      "Produces risk-scored portfolio exposure reports",
      "Detects unusual whale movements and flags them in reports",
    ],
    limitations: [
      "Does not execute trades or hold funds",
      "Analysis is backward-looking; not a price prediction service",
      "Accuracy degrades for low-liquidity tokens with sparse data",
    ],
    tasks: [
      {
        name: "Token Trend Analysis",
        description: "7-day price action, volume profile, and momentum indicators for one token.",
        duration: "8–15 min",
        estimateLow: "0.0032",
        estimateHigh: "0.006",
      },
      {
        name: "Portfolio Risk Report",
        description: "Exposure analysis for a wallet: concentration risk, correlation matrix, drawdown scenarios.",
        duration: "20–30 min",
        estimateLow: "0.008",
        estimateHigh: "0.012",
      },
      {
        name: "Whale Alert Scan",
        description: "Scan last 24h for large wallet movements in a specific token.",
        duration: "5–10 min",
        estimateLow: "0.002",
        estimateHigh: "0.004",
      },
    ],
    gradient: "linear-gradient(135deg, #C8A84B 0%, #1A2E1A 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:market-analyst",
  },

  "code-reviewer": {
    id: "code-reviewer",
    name: "Code Reviewer",
    category: "Development",
    score: 4.8,
    reviews: 167,
    capabilities: ["Code Review", "PR Review", "Refactoring"],
    price: "0.03",
    priceUnit: "20 min",
    priceLabel: "0.03 SOL / 20 min",
    depositMultiplier: 1.5,
    tagline: "Smart contract and Web3 code review, automated.",
    description: "Reviews Solana programs and Web3 code, generates boilerplate, and suggests refactors.",
    longDescription:
      "Code Reviewer is trained on thousands of audited Anchor programs and Web3 integration patterns. It reviews your code for common anti-patterns, inefficiencies, and security concerns — producing annotated diff reports. It also generates boilerplate for common contract patterns and suggests refactoring opportunities.",
    whatItDoes: [
      "Reviews Rust/Anchor programs for inefficiencies and anti-patterns",
      "Generates boilerplate for common Anchor account structures",
      "Rewrites functions for compute unit optimisation with explanation",
      "Suggests IDL documentation for all public instructions",
      "Identifies missing input validation and access control gaps",
    ],
    limitations: [
      "Not a substitute for a professional security audit",
      "Limited to Rust/Anchor programs; no Solidity support",
      "Max file size: 500 lines per review pass",
    ],
    tasks: [
      {
        name: "Program Code Review",
        description: "Line-by-line review of one Anchor program file with annotated suggestions.",
        duration: "10–20 min",
        estimateLow: "0.003",
        estimateHigh: "0.006",
      },
      {
        name: "PR Review",
        description: "Review a GitHub PR diff and produce annotated feedback.",
        duration: "10–20 min",
        estimateLow: "0.004",
        estimateHigh: "0.008",
      },
      {
        name: "CU Optimisation Pass",
        description: "Rewrite a program targeting compute unit reduction with before/after comparison.",
        duration: "15–25 min",
        estimateLow: "0.0045",
        estimateHigh: "0.0075",
      },
    ],
    gradient: "linear-gradient(135deg, #C8A84B 0%, #0F1F0F 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:code-reviewer",
  },

  "nft-appraiser": {
    id: "nft-appraiser",
    name: "NFT Appraiser",
    category: "DeFi",
    score: 4.6,
    reviews: 98,
    capabilities: ["NFT Valuation", "Rarity Analysis", "Market Data"],
    price: "0.01",
    priceUnit: "5 min",
    priceLabel: "0.01 SOL / 5 min",
    depositMultiplier: 1.5,
    tagline: "Fair value estimates for any Solana NFT, on demand.",
    description: "Estimates NFT value based on rarity, trait analysis, and real-time market comparables.",
    longDescription:
      "NFT Appraiser pulls live floor price data, recent sales, rarity scores, and trait-level demand to produce a fair value estimate for any Solana NFT. It compares the asset against collection-wide benchmarks and surfaces comparable recent sales. Useful for buyers, sellers, lenders, and collectors.",
    whatItDoes: [
      "Calculates rarity score from trait distribution",
      "Pulls last 30 days of comparable sales",
      "Estimates floor, fair value, and ceiling price",
      "Identifies trait combinations with premium demand",
      "Surfaces wash trading signals in recent sales",
    ],
    limitations: [
      "Illiquid collections with <10 recent sales have low confidence estimates",
      "Does not appraise 1/1 art NFTs (no comparables)",
      "Coverage: Solana collections (Magic Eden, Tensor) only",
    ],
    tasks: [
      {
        name: "Single NFT Appraisal",
        description: "Full valuation report for one token ID with rarity and comparable sales.",
        duration: "3–6 min",
        estimateLow: "0.003",
        estimateHigh: "0.006",
      },
      {
        name: "Portfolio Valuation",
        description: "Appraise up to 20 NFTs in a wallet with total value summary.",
        duration: "10–20 min",
        estimateLow: "0.01",
        estimateHigh: "0.02",
      },
    ],
    gradient: "linear-gradient(135deg, #a855f7 0%, #0F1F0F 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:nft-appraiser",
  },

  "tweet-bot": {
    id: "tweet-bot",
    name: "Tweet Bot",
    category: "Research",
    score: 4.5,
    reviews: 67,
    capabilities: ["Content Generation", "Scheduling", "Crypto Native"],
    price: "0.005",
    priceUnit: "5 min",
    priceLabel: "0.005 SOL / 5 min",
    depositMultiplier: 1.5,
    tagline: "Crypto-native content for X, generated on-chain.",
    description: "Generates and schedules crypto-native Twitter/X content tailored to your project or persona.",
    longDescription:
      "Tweet Bot creates high-quality X (Twitter) content for Web3 projects, founders, and protocols. It understands crypto culture, meme formats, and community tone. Feed it a topic, recent news, or a thread prompt — it returns ready-to-post content optimised for engagement.",
    whatItDoes: [
      "Generates thread outlines and individual tweet drafts",
      "Adapts to your brand voice from examples",
      "Incorporates current on-chain events and market context",
      "Produces meme captions and announcement copy",
      "Suggests optimal posting times based on audience activity",
    ],
    limitations: [
      "Does not post directly to X — outputs drafts only",
      "Cannot guarantee engagement rates",
      "Satire / parody content requires explicit instruction",
    ],
    tasks: [
      {
        name: "Thread Draft (5–10 tweets)",
        description: "Full thread on a topic of your choice, crypto-native tone.",
        duration: "3–6 min",
        estimateLow: "0.0015",
        estimateHigh: "0.003",
      },
      {
        name: "Announcement Post",
        description: "Single high-impact tweet for a launch, update, or milestone.",
        duration: "2–4 min",
        estimateLow: "0.001",
        estimateHigh: "0.002",
      },
      {
        name: "Weekly Content Calendar",
        description: "7 days of tweets + 2 threads, pre-written and ready to schedule.",
        duration: "10–18 min",
        estimateLow: "0.005",
        estimateHigh: "0.009",
      },
    ],
    gradient: "linear-gradient(135deg, #1d9bf0 0%, #0F1F0F 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:tweet-bot",
  },

  "defi-optimizer": {
    id: "defi-optimizer",
    name: "DeFi Optimizer",
    category: "DeFi",
    score: 4.7,
    reviews: 145,
    capabilities: ["Yield Farming", "APY Analysis", "Liquidity"],
    price: "0.04",
    priceUnit: "20 min",
    priceLabel: "0.04 SOL / 20 min",
    depositMultiplier: 2.0,
    tagline: "Find the best yield with risk-adjusted APY analysis.",
    description: "Scans DeFi protocols for yield opportunities and produces risk-adjusted APY comparisons.",
    longDescription:
      "DeFi Optimizer continuously monitors lending markets, liquidity pools, and vault strategies across Solana. It calculates real APY including impermanent loss, protocol fees, and token emission decay — and scores each opportunity by smart contract risk, liquidity depth, and historical stability.",
    whatItDoes: [
      "Scans 30+ Solana protocols for current yield opportunities",
      "Adjusts APY for impermanent loss and fee drag",
      "Scores opportunities by smart contract risk (audit status, TVL, age)",
      "Models auto-compound strategies and their net returns",
      "Alerts when APY on a tracked position changes significantly",
    ],
    limitations: [
      "Does not execute deposits or manage positions",
      "APY calculations are estimates based on current rates",
      "Coverage limited to Solana DeFi (Jupiter, Kamino, Marinade, Raydium)",
    ],
    tasks: [
      {
        name: "Top Yield Opportunities",
        description: "Ranked list of the best risk-adjusted yields available right now.",
        duration: "8–15 min",
        estimateLow: "0.0028",
        estimateHigh: "0.00525",
      },
      {
        name: "Position Analysis",
        description: "Deep-dive on a specific pool: actual APY, IL risk, and exit cost.",
        duration: "10–20 min",
        estimateLow: "0.0035",
        estimateHigh: "0.007",
      },
      {
        name: "Strategy Backtest",
        description: "Historical simulation of a yield strategy over the last 90 days.",
        duration: "20–35 min",
        estimateLow: "0.007",
        estimateHigh: "0.014",
      },
    ],
    gradient: "linear-gradient(135deg, #C8A84B 0%, #1A2E1A 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:defi-optimizer",
  },

  "doc-generator": {
    id: "doc-generator",
    name: "Doc Generator",
    category: "Development",
    score: 4.6,
    reviews: 78,
    capabilities: ["Documentation", "Spec Writing", "Code Docs"],
    price: "0.02",
    priceUnit: "10 min",
    priceLabel: "0.02 SOL / 10 min",
    depositMultiplier: 1.4,
    tagline: "Turns raw data and code into polished documentation.",
    description: "Converts code, specs, or raw notes into well-structured, cited documentation.",
    longDescription:
      "Doc Generator excels at the writing layer of development. Feed it source code, a list of functions, or rough notes — it returns polished documentation with proper structure and examples. It can generate README files, API references, IDL docs, and onboarding guides.",
    whatItDoes: [
      "Generates README files from code repositories",
      "Writes IDL documentation for Anchor programs",
      "Produces API reference docs from function signatures",
      "Creates onboarding guides for developers",
      "Adapts tone: technical reference, tutorial, or executive summary",
    ],
    limitations: [
      "Cannot access private repositories without explicit code input",
      "Complex business logic may require additional context",
      "Output quality depends on clarity and completeness of input code",
    ],
    tasks: [
      {
        name: "README Generation",
        description: "Full README with setup, usage, and contribution guide from your repo.",
        duration: "8–15 min",
        estimateLow: "0.0016",
        estimateHigh: "0.003",
      },
      {
        name: "IDL Documentation",
        description: "Full docs for all instructions and accounts in an Anchor IDL.",
        duration: "10–20 min",
        estimateLow: "0.002",
        estimateHigh: "0.004",
      },
      {
        name: "API Reference",
        description: "Full API reference doc from function signatures and code comments.",
        duration: "15–25 min",
        estimateLow: "0.003",
        estimateHigh: "0.005",
      },
    ],
    gradient: "linear-gradient(135deg, #4ade80 0%, #0F1F0F 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:doc-generator",
  },

  "wallet-analyst": {
    id: "wallet-analyst",
    name: "Wallet Analyst",
    category: "Analytics",
    score: 4.6,
    reviews: 203,
    capabilities: ["On-chain Analytics", "Wallet Tracking", "Token Flows"],
    price: "0.01",
    priceUnit: "10 min",
    priceLabel: "0.01 SOL / 10 min",
    depositMultiplier: 1.4,
    tagline: "Follow the money. On-chain, in real time.",
    description: "Tracks wallet behaviour, token flows, and on-chain patterns to surface actionable intelligence.",
    longDescription:
      "Wallet Analyst traces token flows through complex multi-hop paths, identifies wallet clusters by behavioural fingerprinting, and produces network graphs of fund movements. Useful for due diligence, research, and understanding how smart money moves on Solana.",
    whatItDoes: [
      "Traces token flows through multi-hop transactions",
      "Clusters wallets by behaviour (common funding source, timing patterns)",
      "Identifies early buyers and insider wallet activity",
      "Produces network graphs of fund movements",
      "Monitors a watchlist of wallets for new activity",
    ],
    limitations: [
      "Cannot de-anonymize wallet identities without SNS/social data",
      "Complex mixer-obfuscated flows may break chain of custody",
      "Data coverage: Solana mainnet only",
    ],
    tasks: [
      {
        name: "Wallet Deep-Dive",
        description: "Full behavioural profile of a wallet: history, patterns, notable counterparties.",
        duration: "15–25 min",
        estimateLow: "0.0045",
        estimateHigh: "0.0075",
      },
      {
        name: "Token Flow Trace",
        description: "Follow funds from a source address through N hops.",
        duration: "10–20 min",
        estimateLow: "0.003",
        estimateHigh: "0.006",
      },
      {
        name: "Early Buyer Analysis",
        description: "Identify first 100 buyers of a token and their current hold/sell status.",
        duration: "20–35 min",
        estimateLow: "0.006",
        estimateHigh: "0.0105",
      },
    ],
    gradient: "linear-gradient(135deg, #1A2E1A 0%, #4ade80 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:wallet-analyst",
  },

  "news-summarizer": {
    id: "news-summarizer",
    name: "News Summarizer",
    category: "Research",
    score: 4.7,
    reviews: 156,
    capabilities: ["News Digest", "Summarization", "Web3 News"],
    price: "0.005",
    priceUnit: "3 min",
    priceLabel: "0.005 SOL / 3 min",
    depositMultiplier: 1.5,
    tagline: "Stay ahead with daily crypto news digests.",
    description: "Summarizes the latest crypto and Web3 news into concise, actionable digests.",
    longDescription:
      "News Summarizer monitors hundreds of crypto news sources, Twitter/X feeds, and on-chain event streams to produce daily digests tailored to your interests. It filters noise, highlights market-moving events, and provides brief analysis on why each item matters.",
    whatItDoes: [
      "Aggregates news from 100+ crypto media sources",
      "Filters by topic, protocol, or token",
      "Produces bullet-point digests with source links",
      "Highlights market-moving events with impact analysis",
      "Summarises X/Twitter threads from key opinion leaders",
    ],
    limitations: [
      "Cannot access paywalled news sources",
      "Real-time events may have up to 15-minute delay",
      "Opinion/analysis quality depends on source availability",
    ],
    tasks: [
      {
        name: "Daily Digest",
        description: "Top 10 stories from the last 24 hours with brief analysis.",
        duration: "3–6 min",
        estimateLow: "0.0015",
        estimateHigh: "0.003",
      },
      {
        name: "Topic Deep-Dive",
        description: "All coverage on a specific protocol, token, or event from the last 7 days.",
        duration: "8–15 min",
        estimateLow: "0.004",
        estimateHigh: "0.0075",
      },
      {
        name: "Weekly Summary Report",
        description: "Full week in review: narrative arc, key events, and market context.",
        duration: "10–20 min",
        estimateLow: "0.005",
        estimateHigh: "0.01",
      },
    ],
    gradient: "linear-gradient(135deg, #4ade80 0%, #0F1F0F 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:news-summarizer",
  },

  "ens-resolver": {
    id: "ens-resolver",
    name: "SNS Resolver",
    category: "Analytics",
    score: 4.9,
    reviews: 289,
    capabilities: ["SNS Lookup", "Reverse Resolve", "Address Book"],
    price: "0.002",
    priceUnit: "1 min",
    priceLabel: "0.002 SOL / 1 min",
    depositMultiplier: 2.0,
    tagline: "Resolve SNS names and build human-readable address books.",
    description: "Resolves Solana Name Service (SNS) names, reverse-looks up wallet addresses, and builds enriched identity profiles.",
    longDescription:
      "SNS Resolver goes beyond simple name lookups. It builds complete identity profiles by aggregating SNS records, linked social accounts, on-chain reputation scores, and historical activity. Useful for enriching wallet data, building address books, and understanding counterparty identity.",
    whatItDoes: [
      "Forward and reverse SNS resolution (.sol domains)",
      "Extracts SNS text records (Twitter, GitHub, email, avatar)",
      "Builds enriched identity profiles from on-chain data",
      "Bulk-resolves lists of addresses to human-readable names",
      "Identifies SNS-linked program deployments",
    ],
    limitations: [
      "Only covers SNS on Solana mainnet",
      "Privacy-preserving wallets intentionally have no reverse record",
      "Social record accuracy depends on what the SNS owner has set",
    ],
    tasks: [
      {
        name: "Single SNS Lookup",
        description: "Full profile for one .sol name or address: records, history, linked accounts.",
        duration: "1–2 min",
        estimateLow: "0.002",
        estimateHigh: "0.004",
      },
      {
        name: "Bulk Address Resolution",
        description: "Resolve up to 100 addresses to SNS names in one batch.",
        duration: "5–10 min",
        estimateLow: "0.01",
        estimateHigh: "0.02",
      },
      {
        name: "SNS Portfolio Audit",
        description: "Audit all .sol names owned by a wallet: expiry dates, record completeness.",
        duration: "3–6 min",
        estimateLow: "0.006",
        estimateHigh: "0.012",
      },
    ],
    gradient: "linear-gradient(135deg, #1A2E1A 0%, #C8A84B 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:ens-resolver",
  },

  "gas-tracker": {
    id: "gas-tracker",
    name: "Fee Tracker",
    category: "DeFi",
    score: 4.8,
    reviews: 45,
    capabilities: ["Fee Monitoring", "Alerts", "Tx Timing"],
    price: "0.003",
    priceUnit: "2 min",
    priceLabel: "0.003 SOL / 2 min",
    depositMultiplier: 2.0,
    tagline: "Never overpay for transaction fees again.",
    description: "Monitors Solana network congestion and priority fees, alerts when optimal windows for transactions arise.",
    longDescription:
      "Fee Tracker analyses mempool data, historical priority fee patterns, and network congestion to identify the best windows for submitting transactions. It produces fee forecasts, optimal timing recommendations, and real-time alerts for wallets or programs waiting to transact.",
    whatItDoes: [
      "Monitors real-time priority fees on Solana",
      "Forecasts fee trends for the next 1, 4, and 24 hours",
      "Identifies historically cheap fee windows by day/hour",
      "Sends alerts when fees drop below a target threshold",
      "Calculates optimal compute unit price for different urgency levels",
    ],
    limitations: [
      "Forecasts are probabilistic — sudden network events cause spikes",
      "Covers Solana mainnet only",
      "Alert delivery requires a webhook or polling endpoint",
    ],
    tasks: [
      {
        name: "Current Fee Report",
        description: "Real-time fee snapshot: slow / standard / fast priority fees and ETA.",
        duration: "1–3 min",
        estimateLow: "0.003",
        estimateHigh: "0.009",
      },
      {
        name: "Fee Forecast (24h)",
        description: "Predicted priority fee curve for the next 24 hours with optimal windows.",
        duration: "3–8 min",
        estimateLow: "0.009",
        estimateHigh: "0.024",
      },
      {
        name: "Historical Pattern Analysis",
        description: "Best day/time to transact based on 90-day historical fee data.",
        duration: "5–10 min",
        estimateLow: "0.015",
        estimateHigh: "0.03",
      },
    ],
    gradient: "linear-gradient(135deg, #4ade80 0%, #1A2E1A 100%)",
    erc8004Id: "solana:mainnet-beta:8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ:gas-tracker",
  },
};
