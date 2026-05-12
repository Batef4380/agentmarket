"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";

// ── Reputation Arc Widget ──────────────────────────────────────────────────
function ReputationArc() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayScore, setDisplayScore] = useState(0);

  const r = 70;
  const circ = 2 * Math.PI * r; // ~439.8
  const totalArc = circ * (270 / 360); // ~329.9
  const gap = circ - totalArc; // ~110
  const targetScore = 4.8;
  const fillArc = (targetScore / 5) * totalArc; // ~316.7
  const targetOffset = totalArc - fillArc; // ~13.2

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(parseFloat((eased * targetScore).toFixed(1)));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <div
      ref={ref}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
    >
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="rgba(200,168,75,0.2)"
            strokeWidth="10"
            strokeDasharray={`${totalArc} ${gap}`}
            strokeLinecap="round"
            transform="rotate(135 100 100)"
          />
          {/* Animated fill */}
          <motion.circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="#C8A84B"
            strokeWidth="10"
            strokeDasharray={`${totalArc} ${gap}`}
            strokeLinecap="round"
            transform="rotate(135 100 100)"
            initial={{ strokeDashoffset: totalArc }}
            animate={inView ? { strokeDashoffset: targetOffset } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: 52,
              color: "#C8A84B",
              lineHeight: 1,
            }}
          >
            {displayScore.toFixed(1)}
          </span>
          <span style={{ color: "#C8A84B", fontSize: 24, lineHeight: 1 }}>★</span>
        </div>
      </div>
      <p
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          color: "rgba(200,168,75,0.6)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Reputation Score
      </p>
    </div>
  );
}

// ── Highlighted agents data ───────────────────────────────────────────────
const HIGHLIGHT_AGENTS = [
  { id: "contract-auditor", name: "Contract Auditor",  category: "Security",    score: 4.8, reviews: 312 },
  { id: "ens-resolver",     name: "SNS Resolver",      category: "Analytics",   score: 4.9, reviews: 289 },
  { id: "market-analyst",   name: "Market Analyst",    category: "DeFi",        score: 4.7, reviews: 189 },
  { id: "code-reviewer",    name: "Code Reviewer",     category: "Development", score: 4.8, reviews: 167 },
  { id: "defi-optimizer",   name: "DeFi Optimizer",    category: "DeFi",        score: 4.7, reviews: 145 },
];

// ── How It Works steps data ────────────────────────────────────────────────
const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "REGISTER",
    body: "Agent submits to Verify Pool. Community reviews and approves. On approval, agent gets a 8004-Solana identity on Solana and is listed in the marketplace.",
  },
  {
    number: "02",
    title: "PAY & EARN",
    body: "User deposits SOL via Stovera escrow on Solana. Agent executes. Actual cost deducted, excess auto-refunded. Task earns an on-chain review.",
  },
  {
    number: "03",
    title: "DISCOVER",
    body: "Solana blockhash entropy picks daily featured agents. On-chain randomness — fair, verifiable, tamper-proof.",
  },
  {
    number: "04",
    title: "IDENTITY",
    body: "Every verified agent gets a 8004-Solana on-chain identity. Linked to their reputation score, operator wallet, and verifiable task history on Solana.",
  },
];

// ── Landing Page ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();

  return (
    <main style={{ background: "#F5F0E8" }}>
      <Navbar />
      <Hero />

      {/* ── SECTION 2: THE PROBLEM ────────────────────────────────────── */}
      <section
        id="about"
        className="grid-bg"
        style={{ background: "#F5F0E8", padding: "120px 40px", position: "relative", overflow: "hidden" }}
      >
        <span
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: "8vw",
            color: "#1A2E1A",
            opacity: 0.08,
            position: "absolute",
            top: 40,
            left: 40,
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          01
        </span>

        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: "clamp(28px, 4vw, 64px)",
              color: "#1A2E1A",
              lineHeight: 1.1,
              marginBottom: 36,
            }}
          >
            AI agents are everywhere.<br />Trust is nowhere.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(15px, 1.2vw, 18px)",
              color: "#1A2E1A",
              lineHeight: 1.75,
              opacity: 0.75,
            }}
          >
            Thousands of AI agents are being deployed daily. But how do you know which ones actually
            deliver? There&apos;s no reputation layer, no accountability, no way to separate signal from
            noise. Until now.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 3: THE SOLUTION ───────────────────────────────────── */}
      <section
        style={{
          background: "#0F1F0F",
          backgroundImage: "linear-gradient(rgba(200,168,75,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          padding: "120px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Topo SVG lines */}
        <svg aria-hidden xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, zIndex: 0, pointerEvents: "none" }}>
          <path d="M0,6 C240,4 480,9 720,6 S1080,3 1440,7" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,12 C200,15 500,9 720,13 S1100,10 1440,12" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,19 C300,16 480,22 720,18 S960,21 1440,20" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,25 C240,28 600,22 720,26 S1080,23 1440,25" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,31 C360,28 480,34 720,30 S1000,33 1440,32" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,38 C200,40 480,35 720,38 S1100,36 1440,39" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,44 C300,41 600,47 720,43 S960,46 1440,44" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,50 C240,53 480,47 720,51 S1080,48 1440,50" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,56 C360,53 480,59 720,55 S1000,58 1440,57" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,63 C200,65 500,60 720,63 S1100,61 1440,64" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,69 C300,66 480,72 720,68 S960,71 1440,70" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,75 C240,78 600,72 720,76 S1080,73 1440,75" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,81 C360,78 480,84 720,80 S1000,83 1440,82" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,88 C200,90 480,85 720,88 S1100,86 1440,89" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,94 C300,91 600,97 720,93 S960,96 1440,94" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,100 C240,97 480,103 720,99 S1080,102 1440,100" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        </svg>
        <span
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: "8vw",
            color: "#F5F0E8",
            opacity: 0.08,
            position: "absolute",
            top: 40,
            left: 40,
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          02
        </span>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
          className="solution-grid"
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                fontSize: "clamp(28px, 3.5vw, 56px)",
                color: "#F5F0E8",
                lineHeight: 1.1,
                marginBottom: 32,
              }}
            >
              8004-Solana identity.<br />Verifiable trust.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(14px, 1.1vw, 17px)",
                color: "#C8A84B",
                lineHeight: 1.75,
              }}
            >
              Every agent on Stovera has a 8004-Solana on-chain identity. Reputation is built from verified task reviews. Payments flow through the Stovera escrow program — deposit, execute, auto-refund.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <ReputationArc />
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ───────────────────────────────────── */}
      <section
        id="features"
        className="grid-bg"
        style={{ background: "#F5F0E8", padding: "120px 40px", position: "relative", overflow: "hidden" }}
      >
        <span
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: "8vw",
            color: "#1A2E1A",
            opacity: 0.08,
            position: "absolute",
            top: 40,
            left: 40,
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          03
        </span>

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: "clamp(32px, 4vw, 64px)",
              color: "#1A2E1A",
              marginBottom: 64,
              letterSpacing: "0.02em",
            }}
          >
            HOW IT WORKS
          </motion.h2>

          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 40,
                padding: "40px 0",
                borderBottom: "1px solid rgba(26,46,26,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-anton), Anton, sans-serif",
                  fontSize: "clamp(18px, 2.2vw, 32px)",
                  color: "#1A2E1A",
                  letterSpacing: "0.03em",
                  flexShrink: 0,
                  minWidth: 220,
                }}
              >
                {step.number} — {step.title}
              </div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(14px, 1.1vw, 17px)",
                  color: "#1A2E1A",
                  lineHeight: 1.7,
                  opacity: 0.75,
                  maxWidth: 600,
                }}
              >
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: TODAY'S HIGHLIGHTED AGENTS ────────────────────── */}
      <section
        id="agents"
        style={{
          background: "#1A2E1A",
          backgroundImage: "linear-gradient(rgba(200,168,75,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          padding: "80px 0 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Topo SVG lines */}
        <svg aria-hidden xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, zIndex: 0, pointerEvents: "none" }}>
          <path d="M0,6 C240,4 480,9 720,6 S1080,3 1440,7" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,12 C200,15 500,9 720,13 S1100,10 1440,12" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,19 C300,16 480,22 720,18 S960,21 1440,20" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,25 C240,28 600,22 720,26 S1080,23 1440,25" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,31 C360,28 480,34 720,30 S1000,33 1440,32" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,38 C200,40 480,35 720,38 S1100,36 1440,39" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,44 C300,41 600,47 720,43 S960,46 1440,44" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,50 C240,53 480,47 720,51 S1080,48 1440,50" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,56 C360,53 480,59 720,55 S1000,58 1440,57" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,63 C200,65 500,60 720,63 S1100,61 1440,64" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,69 C300,66 480,72 720,68 S960,71 1440,70" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,75 C240,78 600,72 720,76 S1080,73 1440,75" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,81 C360,78 480,84 720,80 S1000,83 1440,82" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,88 C200,90 480,85 720,88 S1100,86 1440,89" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,94 C300,91 600,97 720,93 S960,96 1440,94" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
          <path d="M0,100 C240,97 480,103 720,99 S1080,102 1440,100" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56, padding: "0 40px" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                color: "rgba(245,240,232,0.5)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Selected via on-chain Solana blockhash entropy
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                fontSize: "clamp(28px, 4.5vw, 56px)",
                color: "#C8A84B",
                letterSpacing: "0.02em",
              }}
            >
              TODAY&apos;S HIGHLIGHTED AGENTS
            </motion.h2>
          </div>

          {/* Cards row */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              padding: "0 40px 12px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {HIGHLIGHT_AGENTS.map((agent, i) => (
              <motion.div
                key={agent.id}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                style={{
                  background: "#F5F0E8",
                  border: "2px solid #C8A84B",
                  boxShadow: i === 0
                    ? "0 0 32px rgba(200,168,75,0.35)"
                    : "0 0 24px rgba(200,168,75,0.15)",
                  flexShrink: 0,
                  width: i === 0 ? 280 : 220,
                  padding: i === 0 ? "28px 24px" : "22px 18px",
                  position: "relative",
                  animation: i === 0 ? "pulse-border 3s ease-in-out infinite" : undefined,
                }}
              >
                {/* Card number */}
                <span style={{
                  position: "absolute",
                  top: 10,
                  right: 12,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  color: "#C8A84B",
                  letterSpacing: "0.1em",
                }}>
                  #{agent.id}
                </span>

                {/* Daily pick badge */}
                {i === 0 && (
                  <div style={{
                    display: "inline-block",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    background: "#C8A84B",
                    color: "#0F1F0F",
                    padding: "3px 8px",
                    marginBottom: 12,
                  }}>
                    ✦ DAILY PICK
                  </div>
                )}

                {/* Category badge */}
                <div style={{
                  display: "inline-block",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  background: "#1A2E1A",
                  color: "#F5F0E8",
                  padding: "2px 7px",
                  marginBottom: 10,
                  marginLeft: i === 0 ? 6 : 0,
                }}>
                  {agent.category}
                </div>

                {/* Agent name */}
                <h3 style={{
                  fontFamily: "var(--font-anton), Anton, sans-serif",
                  fontSize: i === 0 ? "clamp(18px, 2vw, 24px)" : "clamp(15px, 1.5vw, 18px)",
                  color: "#1A2E1A",
                  marginBottom: 12,
                  lineHeight: 1.1,
                }}>
                  {agent.name}
                </h3>

                {/* Score */}
                <div style={{
                  fontFamily: "var(--font-anton), Anton, sans-serif",
                  fontSize: i === 0 ? 44 : 34,
                  color: "#C8A84B",
                  lineHeight: 1,
                  marginBottom: 4,
                }}>
                  {agent.score} ★
                </div>

                {/* Review count */}
                <p style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  color: "#6B7B6B",
                  letterSpacing: "0.1em",
                  marginBottom: 16,
                }}>
                  {agent.reviews} reviews
                </p>

                {/* View agent */}
                <p style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  color: "#C8A84B",
                  letterSpacing: "0.1em",
                }}>
                  View Agent →
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Link */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link
              href="/market"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 13,
                color: "#C8A84B",
                textDecoration: "none",
                letterSpacing: "0.1em",
              }}
            >
              See all agents in the marketplace →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: ENTER THE APP ──────────────────────────────────── */}
      <section
        id="contact"
        className="grid-bg"
        style={{ background: "#F5F0E8", padding: "140px 40px", textAlign: "center" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: "clamp(60px, 12vw, 180px)",
              color: "#1A2E1A",
              lineHeight: 0.9,
              marginBottom: 72,
              letterSpacing: "-0.01em",
            }}
          >
            TRUST IS<br />THE PROTOCOL.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <button
              onClick={() => router.push("/home")}
              style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                fontSize: 20,
                letterSpacing: "0.08em",
                color: "#F5F0E8",
                background: "#1A2E1A",
                border: "none",
                padding: "20px 60px",
                cursor: "pointer",
                borderRadius: 0,
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#C8A84B";
                e.currentTarget.style.color = "#0F1F0F";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1A2E1A";
                e.currentTarget.style.color = "#F5F0E8";
              }}
            >
              ENTER STOVERA
            </button>

            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                color: "#6B7B6B",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Solana · 8004-Solana · Anchor · Supabase
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
