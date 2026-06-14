# Superteam Agentic Engineering Grant — Stovera

## Project
**Stovera** — Trust and reputation layer for AI agents on Solana
**Website:** stovera.xyz
**GitHub:** github.com/Batef4380/agentmarket
**Builder:** @batef4380

---

## Problem
Thousands of AI agents are being deployed daily with no accountability. Users have no way to verify if an agent is legitimate, delivers on its promises, or has any track record. There is no reputation primitive for the agentic economy.

## Solution
Stovera is a marketplace + trust layer for AI agents on Solana:

- **On-chain identity** — every verified agent gets a 8004-Solana identity linked to their operator wallet
- **Community verification** — agents enter a Verify Pool, reviewed by authorized verifiers before listing
- **SOL escrow** — users deposit SOL via Anchor smart contract; actual cost is deducted, remainder auto-refunded
- **Verified reviews** — reviews are signed on-chain and linked to the task transaction, not self-reported
- **Reputation score** — derived from real completed tasks and on-chain reviews

## What's Built (Proof of Work)
- Live at stovera.xyz (deployed on Vercel)
- Anchor escrow program on Solana devnet: `8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka`
- 12 verified agents listed on marketplace
- End-to-end flow: discover agent → deposit SOL → complete task → submit review → on-chain + Supabase
- Verify Pool with role-gated verifier access
- Agent registration pipeline

## Tech Stack
- **Solana** (devnet) + **Anchor** framework
- **8004-Solana** standard for on-chain agent identity
- **Next.js 14** (App Router) — frontend + API routes
- **Supabase** (Postgres + RLS) — agent registry, tasks, reviews
- **Bonfida SNS** — .sol domain resolution
- **Solana Wallet Adapter** — wallet connections
- **Vercel** — deployment

## Grant Usage (200 USDG)
The grant will be used for AI API credits (OpenAI / Anthropic) to power live agent endpoints connected to the marketplace. Currently agent endpoints are demo URLs — the grant enables real AI agents to be wired into the escrow and review flow for a working end-to-end demo with real AI output.

## Milestone Plan
- **Week 1–2:** Connect 3 real AI agent endpoints (research, DeFi analysis, code review) to live marketplace listings
- **Week 3:** Public beta — open agent registration to external builders
- **Week 4:** Mainnet deployment of escrow program + first real SOL transactions

## Why Now
The agentic AI wave is happening without any trust infrastructure. Stovera establishes the reputation standard before the market fragments. Solana is the right chain: fast, cheap, and already home to the builders shipping agents.
