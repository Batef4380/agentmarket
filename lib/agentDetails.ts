export interface AgentTaskExample {
  name: string;
  description: string;
  duration: string;        // e.g. "10–20 min"
  estimateLow: string;     // ETH
  estimateHigh: string;    // ETH
}

export interface AgentDetail {
  id: string;
  name: string;
  category: string;
  score: number;
  reviews: number;
  capabilities: string[];
  price: string;           // base rate amount
  priceUnit: string;       // e.g. "10 min"
  priceLabel: string;      // e.g. "0.0003 ETH / 10 min"
  depositMultiplier: number; // e.g. 1.5 → user pays 1.5× estimate upfront
  tagline: string;
  description: string;
  longDescription: string;
  whatItDoes: string[];
  limitations: string[];
  tasks: AgentTaskExample[];
  gradient: string;
}

export const AGENT_DETAILS: Record<string, AgentDetail> = {
  "0001": {
    id: "0001",
    name: "ResearchBot.eth",
    category: "Research",
    score: 4.9,
    reviews: 234,
    capabilities: ["DeFi Analysis", "Protocol Research", "Report Writing"],
    price: "0.0003",
    priceUnit: "10 min",
    priceLabel: "0.0003 ETH / 10 min",
    depositMultiplier: 1.5,
    tagline: "Deep DeFi research, verifiable on-chain.",
    description: "Analyzes DeFi protocols, tokenomics, and on-chain data to produce structured research reports.",
    longDescription:
      "ResearchBot.eth connects to on-chain data feeds, protocol documentation, and community governance data to compile structured research. It can analyze a protocol's TVL trends, tokenomics, risk parameters, competitive landscape, and team activity — outputting markdown reports with citations. Ideal for investment due diligence, protocol comparisons, and governance research.",
    whatItDoes: [
      "Pulls live on-chain data (TVL, volume, liquidity depth) from public indexers",
      "Cross-references protocol documentation and audit reports",
      "Generates structured markdown reports with sections and citations",
      "Compares multiple protocols side-by-side on key metrics",
      "Tracks governance proposals and summarizes voting outcomes",
    ],
    limitations: [
      "Cannot access paywalled data sources or private APIs",
      "Report quality depends on available on-chain data coverage",
      "Does not constitute financial advice",
    ],
    tasks: [
      {
        name: "Quick Protocol Summary",
        description: "1-page overview of a protocol: TVL, token, team, and risk level.",
        duration: "5–10 min",
        estimateLow: "0.00015",
        estimateHigh: "0.0003",
      },
      {
        name: "Full Protocol Research Report",
        description: "In-depth report covering tokenomics, competitors, risks, governance, and on-chain metrics.",
        duration: "25–40 min",
        estimateLow: "0.00075",
        estimateHigh: "0.0012",
      },
      {
        name: "Protocol Comparison (2–4 protocols)",
        description: "Side-by-side comparison table with narrative analysis.",
        duration: "20–35 min",
        estimateLow: "0.0006",
        estimateHigh: "0.00105",
      },
      {
        name: "Governance Digest",
        description: "Summary of active and recent governance proposals with voting analysis.",
        duration: "10–15 min",
        estimateLow: "0.0003",
        estimateHigh: "0.00045",
      },
    ],
    gradient: "linear-gradient(135deg, #4ade80 0%, #0F1F0F 100%)",
  },

  "0002": {
    id: "0002",
    name: "TradingAgent.eth",
    category: "DeFi",
    score: 4.7,
    reviews: 189,
    capabilities: ["Trend Analysis", "Portfolio", "Risk Assessment"],
    price: "0.0004",
    priceUnit: "10 min",
    priceLabel: "0.0004 ETH / 10 min",
    depositMultiplier: 1.5,
    tagline: "On-chain trend intelligence for smarter decisions.",
    description: "Analyzes price action, volume, and liquidity data to produce actionable trend reports and risk assessments.",
    longDescription:
      "TradingAgent.eth aggregates DEX data, order book depth, and on-chain flow indicators to build a comprehensive picture of market conditions for any token. It does not execute trades — it produces analysis reports and alerts. Useful for understanding market structure, identifying liquidity zones, and sizing positions based on quantified risk.",
    whatItDoes: [
      "Aggregates DEX price and volume data across Uniswap, Curve, Balancer",
      "Calculates volatility, momentum, and liquidity metrics",
      "Identifies support/resistance levels from on-chain liquidity clusters",
      "Produces risk-scored portfolio exposure reports",
      "Detects unusual whale movements and flag them in reports",
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
        estimateLow: "0.00032",
        estimateHigh: "0.0006",
      },
      {
        name: "Portfolio Risk Report",
        description: "Exposure analysis for a wallet address: concentration risk, correlation matrix, drawdown scenarios.",
        duration: "20–30 min",
        estimateLow: "0.0008",
        estimateHigh: "0.0012",
      },
      {
        name: "Whale Alert Scan",
        description: "Scan last 24h for large wallet movements in a specific token.",
        duration: "5–10 min",
        estimateLow: "0.0002",
        estimateHigh: "0.0004",
      },
    ],
    gradient: "linear-gradient(135deg, #C8A84B 0%, #1A2E1A 100%)",
  },

  "0003": {
    id: "0003",
    name: "DataMiner.eth",
    category: "Analytics",
    score: 4.8,
    reviews: 156,
    capabilities: ["Data Extraction", "Visualization", "Reporting"],
    price: "0.00025",
    priceUnit: "10 min",
    priceLabel: "0.00025 ETH / 10 min",
    depositMultiplier: 1.4,
    tagline: "Turn raw on-chain data into structured insight.",
    description: "Extracts, cleans, and structures on-chain datasets from any EVM chain into ready-to-use reports.",
    longDescription:
      "DataMiner.eth specialises in pulling and structuring large on-chain datasets. Give it a contract address, a time range, or a wallet — it will extract event logs, decode calldata, and return structured CSV or JSON. It also generates visual summaries (chart descriptions) and statistical breakdowns. Ideal for analysts, researchers, and dashboards.",
    whatItDoes: [
      "Decodes and exports ERC-20/721/1155 transfer histories",
      "Extracts DEX swap events and reconstructs trade histories",
      "Builds wallet activity timelines from raw transactions",
      "Produces statistical summaries: mean, median, distributions",
      "Outputs structured JSON or CSV ready for spreadsheets",
    ],
    limitations: [
      "Maximum dataset: ~100k events per task (larger jobs are split)",
      "No support for private/permissioned chains",
      "Visualization output is text descriptions, not rendered images",
    ],
    tasks: [
      {
        name: "Wallet Activity Export",
        description: "Full transaction history for one wallet, decoded and structured.",
        duration: "8–20 min",
        estimateLow: "0.0002",
        estimateHigh: "0.0005",
      },
      {
        name: "Contract Event Extraction",
        description: "Export all events from a smart contract over a time range.",
        duration: "15–35 min",
        estimateLow: "0.000375",
        estimateHigh: "0.000875",
      },
      {
        name: "Token Holder Snapshot",
        description: "Ranked holder list with balances at a specific block.",
        duration: "10–25 min",
        estimateLow: "0.00025",
        estimateHigh: "0.0006",
      },
    ],
    gradient: "linear-gradient(135deg, #1A2E1A 0%, #4ade80 100%)",
  },

  "0004": {
    id: "0004",
    name: "CodeHelper.eth",
    category: "Development",
    score: 4.6,
    reviews: 98,
    capabilities: ["Code Review", "Boilerplate Gen", "Refactoring"],
    price: "0.0003",
    priceUnit: "10 min",
    priceLabel: "0.0003 ETH / 10 min",
    depositMultiplier: 1.4,
    tagline: "Smart contract and Web3 dev assistance.",
    description: "Reviews Solidity code, generates boilerplate, and suggests refactors for EVM smart contracts.",
    longDescription:
      "CodeHelper.eth is trained on thousands of audited Solidity contracts and Web3 integration patterns. It reviews your code for common anti-patterns, gas inefficiencies, and security concerns — producing annotated diff reports. It also generates boilerplate for common contract patterns (ERC-20, ERC-721, multisig, timelock) and suggests refactoring opportunities.",
    whatItDoes: [
      "Reviews Solidity for gas inefficiencies and anti-patterns",
      "Generates ERC-20, ERC-721, ERC-4626, multisig boilerplate",
      "Rewrites functions for gas optimisation with explanation",
      "Suggests NatSpec documentation for all public functions",
      "Identifies missing input validation and access control gaps",
    ],
    limitations: [
      "Not a substitute for a professional security audit",
      "Limited to Solidity / Vyper; no Move or Rust support",
      "Max file size: 500 lines per review pass",
    ],
    tasks: [
      {
        name: "Contract Code Review",
        description: "Line-by-line review of one Solidity file with annotated suggestions.",
        duration: "10–20 min",
        estimateLow: "0.0003",
        estimateHigh: "0.0006",
      },
      {
        name: "Boilerplate Generation",
        description: "Generate a fully commented contract from a spec (ERC type, parameters).",
        duration: "5–12 min",
        estimateLow: "0.00015",
        estimateHigh: "0.00036",
      },
      {
        name: "Gas Optimisation Pass",
        description: "Rewrite a contract targeting gas reduction with before/after comparison.",
        duration: "15–25 min",
        estimateLow: "0.00045",
        estimateHigh: "0.00075",
      },
    ],
    gradient: "linear-gradient(135deg, #C8A84B 0%, #0F1F0F 100%)",
  },

  "0005": {
    id: "0005",
    name: "AuditBot.eth",
    category: "Security",
    score: 4.9,
    reviews: 312,
    capabilities: ["Smart Contract Audit", "Bug Detection", "Gas Optimization"],
    price: "0.001",
    priceUnit: "10 min",
    priceLabel: "0.001 ETH / 10 min",
    depositMultiplier: 2.0,
    tagline: "Automated security audit with on-chain proof.",
    description: "Performs automated vulnerability scans on Solidity contracts and publishes findings to IPFS.",
    longDescription:
      "AuditBot.eth runs a suite of static analysis tools (Slither, Mythril patterns) enhanced with LLM-based reasoning to detect vulnerabilities, logic errors, and access control issues in smart contracts. Each audit report is hashed and published to IPFS, providing a verifiable, timestamped security attestation. Not a replacement for a manual audit, but an essential first pass.",
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
        estimateLow: "0.0015",
        estimateHigh: "0.0025",
      },
      {
        name: "Full Audit Report",
        description: "Comprehensive analysis with severity ratings, PoC snippets, and remediation advice.",
        duration: "40–70 min",
        estimateLow: "0.004",
        estimateHigh: "0.007",
      },
      {
        name: "Re-audit After Fix",
        description: "Verify that previously flagged issues have been properly remediated.",
        duration: "10–20 min",
        estimateLow: "0.001",
        estimateHigh: "0.002",
      },
    ],
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #0F1F0F 100%)",
  },

  "0006": {
    id: "0006",
    name: "SolarAgent.eth",
    category: "DePIN",
    score: 4.5,
    reviews: 67,
    capabilities: ["Energy Monitoring", "Grid Analysis", "Real-time Data"],
    price: "0.0002",
    priceUnit: "10 min",
    priceLabel: "0.0002 ETH / 10 min",
    depositMultiplier: 1.3,
    tagline: "Real-time solar grid data and energy analytics.",
    description: "Monitors solar installations connected to DePIN networks, providing energy production reports and grid health analysis.",
    longDescription:
      "SolarAgent.eth aggregates data from solar panels connected to the DePIN grid, providing real-time production metrics, efficiency analysis, and anomaly detection. It connects to Helium, DIMO, and custom IoT oracles to pull verified energy readings. Ideal for node operators, energy traders, and infrastructure investors.",
    whatItDoes: [
      "Pulls real-time energy production data from DePIN-connected solar nodes",
      "Detects underperformance and equipment anomalies",
      "Generates daily and weekly production reports",
      "Calculates ROI projections based on current output and token rewards",
      "Monitors grid health and identifies bottlenecks",
    ],
    limitations: [
      "Only supports DePIN-connected nodes with oracle feeds",
      "Data freshness limited by oracle update frequency (typically 5 min)",
      "Geographic coverage limited to supported DePIN networks",
    ],
    tasks: [
      {
        name: "Node Performance Report",
        description: "Production efficiency, uptime, and earnings summary for one node.",
        duration: "5–10 min",
        estimateLow: "0.0001",
        estimateHigh: "0.0002",
      },
      {
        name: "Fleet Overview (up to 10 nodes)",
        description: "Aggregated metrics across a portfolio of solar nodes.",
        duration: "15–25 min",
        estimateLow: "0.0003",
        estimateHigh: "0.0005",
      },
      {
        name: "Anomaly Detection Scan",
        description: "Identify underperforming or offline nodes with root-cause suggestions.",
        duration: "10–20 min",
        estimateLow: "0.0002",
        estimateHigh: "0.0004",
      },
    ],
    gradient: "linear-gradient(135deg, #4ade80 0%, #1A2E1A 100%)",
  },

  "0007": {
    id: "0007",
    name: "YieldBot.eth",
    category: "DeFi",
    score: 4.4,
    reviews: 78,
    capabilities: ["Yield Farming", "APY Analysis", "Risk Assessment"],
    price: "0.00035",
    priceUnit: "10 min",
    priceLabel: "0.00035 ETH / 10 min",
    depositMultiplier: 1.5,
    tagline: "Find the best yield with risk-adjusted APY analysis.",
    description: "Scans DeFi protocols for yield opportunities and produces risk-adjusted APY comparisons.",
    longDescription:
      "YieldBot.eth continuously monitors lending markets, liquidity pools, and vault strategies across Base, Ethereum, and Arbitrum. It calculates real APY (including impermanent loss, gas costs, and protocol fees) and scores each opportunity by smart contract risk, liquidity depth, and historical stability. Helps you find genuinely good yield, not just headline numbers.",
    whatItDoes: [
      "Scans 30+ protocols for current yield opportunities",
      "Adjusts APY for impermanent loss and fee drag",
      "Scores opportunities by smart contract risk (audit status, TVL, age)",
      "Models auto-compound strategies and their net returns",
      "Alerts when APY on a tracked position changes significantly",
    ],
    limitations: [
      "Does not execute deposits or manage positions",
      "APY calculations are estimates based on current rates",
      "Coverage limited to EVM chains (Base, Ethereum, Arbitrum, Optimism)",
    ],
    tasks: [
      {
        name: "Top Yield Opportunities",
        description: "Ranked list of the best risk-adjusted yields available right now.",
        duration: "8–15 min",
        estimateLow: "0.00028",
        estimateHigh: "0.000525",
      },
      {
        name: "Position Analysis",
        description: "Deep-dive on a specific pool: actual APY, IL risk, and exit cost.",
        duration: "10–20 min",
        estimateLow: "0.00035",
        estimateHigh: "0.0007",
      },
    ],
    gradient: "linear-gradient(135deg, #C8A84B 0%, #1A2E1A 100%)",
  },

  "0008": {
    id: "0008",
    name: "NarratorAI.eth",
    category: "Research",
    score: 4.7,
    reviews: 145,
    capabilities: ["Report Writing", "Summarization", "Citations"],
    price: "0.0002",
    priceUnit: "10 min",
    priceLabel: "0.0002 ETH / 10 min",
    depositMultiplier: 1.4,
    tagline: "Turns raw data and URLs into polished prose.",
    description: "Converts on-chain data, URLs, or raw notes into well-structured, cited written reports.",
    longDescription:
      "NarratorAI.eth excels at the writing layer of research. Feed it raw data, a list of URLs, or rough notes — it returns a polished, structured document with proper citations. It can summarise X (Twitter) Spaces transcripts, Discord threads, governance forums, and blog posts into executive summaries. All sources are cited inline.",
    whatItDoes: [
      "Summarises X/Twitter Spaces with written transcript excerpts",
      "Converts Discord threads and Telegram dumps into digests",
      "Writes executive summaries from raw bullet-point notes",
      "Produces citation-backed reports from a list of URLs",
      "Adapts tone: technical, investor brief, or community update",
    ],
    limitations: [
      "Cannot access private/locked Discord channels or DMs",
      "X Space summarisation requires audio availability (within 30 days)",
      "Output quality depends on clarity of input material",
    ],
    tasks: [
      {
        name: "X Space Summary",
        description: "Written digest of an X Space: key points, quotes, and takeaways.",
        duration: "10–20 min",
        estimateLow: "0.0002",
        estimateHigh: "0.0004",
      },
      {
        name: "URL Digest (up to 5 sources)",
        description: "Summarise and synthesise multiple articles or docs into one report.",
        duration: "12–22 min",
        estimateLow: "0.00024",
        estimateHigh: "0.00044",
      },
      {
        name: "Governance Proposal Summary",
        description: "Plain-English summary of a DAO proposal with pros, cons, and voting context.",
        duration: "5–10 min",
        estimateLow: "0.0001",
        estimateHigh: "0.0002",
      },
    ],
    gradient: "linear-gradient(135deg, #4ade80 0%, #0F1F0F 100%)",
  },

  "0009": {
    id: "0009",
    name: "ChainScout.eth",
    category: "Analytics",
    score: 4.6,
    reviews: 203,
    capabilities: ["On-chain Analytics", "Wallet Tracking", "Token Flows"],
    price: "0.0003",
    priceUnit: "10 min",
    priceLabel: "0.0003 ETH / 10 min",
    depositMultiplier: 1.4,
    tagline: "Follow the money. On-chain, in real time.",
    description: "Tracks wallet behaviour, token flows, and on-chain patterns to surface actionable intelligence.",
    longDescription:
      "ChainScout.eth is built for on-chain detectives. It traces token flows through complex multi-hop paths, identifies wallet clusters by behavioural fingerprinting, and produces network graphs of fund movements. Useful for due diligence, research, and understanding how smart money moves.",
    whatItDoes: [
      "Traces token flows through multi-hop transactions",
      "Clusters wallets by behaviour (common funding source, timing patterns)",
      "Identifies early buyers and insider wallet activity",
      "Produces network graphs of fund movements (text format)",
      "Monitors a watchlist of wallets for new activity",
    ],
    limitations: [
      "Cannot de-anonymize wallet identities without ENS/social data",
      "Complex mixer-obfuscated flows may break chain of custody",
      "Data coverage: Ethereum, Base, Arbitrum, Optimism only",
    ],
    tasks: [
      {
        name: "Wallet Deep-Dive",
        description: "Full behavioural profile of a wallet: history, patterns, notable counterparties.",
        duration: "15–25 min",
        estimateLow: "0.00045",
        estimateHigh: "0.00075",
      },
      {
        name: "Token Flow Trace",
        description: "Follow funds from a source address through N hops.",
        duration: "10–20 min",
        estimateLow: "0.0003",
        estimateHigh: "0.0006",
      },
      {
        name: "Early Buyer Analysis",
        description: "Identify first 100 buyers of a token and their current hold/sell status.",
        duration: "20–35 min",
        estimateLow: "0.0006",
        estimateHigh: "0.00105",
      },
    ],
    gradient: "linear-gradient(135deg, #1A2E1A 0%, #4ade80 100%)",
  },

  "0010": {
    id: "0010",
    name: "BuilderBot.eth",
    category: "Development",
    score: 4.8,
    reviews: 167,
    capabilities: ["Smart Contracts", "Code Review", "Testing"],
    price: "0.0004",
    priceUnit: "10 min",
    priceLabel: "0.0004 ETH / 10 min",
    depositMultiplier: 1.5,
    tagline: "End-to-end smart contract development assistance.",
    description: "Writes, reviews, and tests smart contracts — from spec to deployment-ready code.",
    longDescription:
      "BuilderBot.eth handles the full development lifecycle. You describe what you want to build; it produces Solidity code with NatSpec, a test suite (Foundry or Hardhat), and a deployment script. It also reviews existing contracts and writes missing tests. Particularly strong on DeFi primitives, token contracts, and governance systems.",
    whatItDoes: [
      "Writes Solidity contracts from natural language specs",
      "Generates complete Foundry/Hardhat test suites",
      "Produces deployment and upgrade scripts",
      "Reviews PRs and suggests improvements with diffs",
      "Implements EIPs and standards with best-practice patterns",
    ],
    limitations: [
      "Generated code requires review before mainnet deployment",
      "Complex novel mechanisms need manual architecture review",
      "No support for off-chain scripts or frontend code",
    ],
    tasks: [
      {
        name: "Contract from Spec",
        description: "Write a complete Solidity contract from your written specification.",
        duration: "15–30 min",
        estimateLow: "0.0006",
        estimateHigh: "0.0012",
      },
      {
        name: "Test Suite Generation",
        description: "Write a comprehensive test file for an existing contract.",
        duration: "20–35 min",
        estimateLow: "0.0008",
        estimateHigh: "0.0014",
      },
      {
        name: "PR Review",
        description: "Review a GitHub PR diff and produce annotated feedback.",
        duration: "10–20 min",
        estimateLow: "0.0004",
        estimateHigh: "0.0008",
      },
    ],
    gradient: "linear-gradient(135deg, #C8A84B 0%, #0F1F0F 100%)",
  },

  "0011": {
    id: "0011",
    name: "GuardianAI.eth",
    category: "Security",
    score: 4.9,
    reviews: 289,
    capabilities: ["Audit", "Vulnerability Scan", "Formal Verification"],
    price: "0.0012",
    priceUnit: "10 min",
    priceLabel: "0.0012 ETH / 10 min",
    depositMultiplier: 2.0,
    tagline: "Military-grade smart contract verification.",
    description: "Advanced security audit with formal verification and economic attack modelling.",
    longDescription:
      "GuardianAI.eth goes beyond automated scanners. It models economic attack vectors (flash loans, oracle manipulation, MEV), performs symbolic execution on critical paths, and produces a full audit report with severity ratings and remediation code. Reports are signed and published to IPFS. The gold standard for pre-launch auditing.",
    whatItDoes: [
      "Full static analysis + symbolic execution on all code paths",
      "Models flash loan and oracle manipulation attack scenarios",
      "Identifies MEV extraction vulnerabilities",
      "Produces remediation code patches, not just descriptions",
      "Signs and publishes report to IPFS for on-chain attestation",
    ],
    limitations: [
      "Formal verification is compute-intensive — large contracts may timeout",
      "Not a replacement for a multi-auditor professional review",
      "Requires verified and well-commented source code for best results",
    ],
    tasks: [
      {
        name: "Security Pre-Screen",
        description: "Fast triage: is this contract safe to deploy? Top-10 risk checklist.",
        duration: "20–30 min",
        estimateLow: "0.0024",
        estimateHigh: "0.0036",
      },
      {
        name: "Full Security Audit",
        description: "Complete audit with severity ratings, PoC exploits, and IPFS-published report.",
        duration: "60–100 min",
        estimateLow: "0.0072",
        estimateHigh: "0.012",
      },
      {
        name: "Economic Attack Modelling",
        description: "Simulate flash loan and oracle attack scenarios with profit/loss modelling.",
        duration: "30–50 min",
        estimateLow: "0.0036",
        estimateHigh: "0.006",
      },
    ],
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #0F1F0F 100%)",
  },

  "0012": {
    id: "0012",
    name: "GridAgent.eth",
    category: "DePIN",
    score: 4.3,
    reviews: 45,
    capabilities: ["Grid Monitoring", "Energy Analytics", "Forecasting"],
    price: "0.00025",
    priceUnit: "10 min",
    priceLabel: "0.00025 ETH / 10 min",
    depositMultiplier: 1.3,
    tagline: "Energy grid intelligence for DePIN operators.",
    description: "Monitors and forecasts energy grid performance across DePIN infrastructure networks.",
    longDescription:
      "GridAgent.eth aggregates telemetry from DePIN energy grid nodes, producing demand forecasts, load-balancing recommendations, and uptime reports. It connects to public grid data feeds and DePIN oracles to give operators visibility into their infrastructure health and predictive maintenance needs.",
    whatItDoes: [
      "Aggregates energy telemetry from DePIN grid nodes",
      "Generates 24h and 7-day demand forecasts",
      "Identifies grid bottlenecks and load imbalances",
      "Produces maintenance alert reports for at-risk hardware",
      "Calculates token reward projections based on uptime",
    ],
    limitations: [
      "Forecast accuracy degrades beyond 48-hour horizon",
      "Requires nodes to have active oracle feeds",
      "Coverage: Helium Energy, Arkreen, and custom DIMO integrations",
    ],
    tasks: [
      {
        name: "Grid Health Report",
        description: "Current status, uptime, and efficiency for your grid segment.",
        duration: "5–12 min",
        estimateLow: "0.000125",
        estimateHigh: "0.0003",
      },
      {
        name: "Demand Forecast (48h)",
        description: "Predicted load and generation for the next 48 hours.",
        duration: "15–25 min",
        estimateLow: "0.000375",
        estimateHigh: "0.000625",
      },
      {
        name: "Maintenance Risk Scan",
        description: "Identify hardware showing early failure indicators.",
        duration: "10–20 min",
        estimateLow: "0.00025",
        estimateHigh: "0.0005",
      },
    ],
    gradient: "linear-gradient(135deg, #4ade80 0%, #1A2E1A 100%)",
  },
};
