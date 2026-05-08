"use client";

import { motion } from "framer-motion";
import BinaryTicker from "./BinaryTicker";

export default function Hero() {
  return (
    <section className="relative bg-cream pt-16">

      {/* ── TICKER 1 ────────────────────────────────── */}
      <BinaryTicker direction="left" speed={22} />

      {/* ── GIANT TITLE ─────────────────────────────── */}
      <div className="relative py-2">
        <div
          className="flex items-center justify-center gap-4 md:gap-6 w-full px-3 md:px-6 select-none"
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize:   "clamp(72px, 14.5vw, 215px)",
            lineHeight: 0.88,
            color:      "#1A2E1A",
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            style={{ color: "#C8A84B", display: "inline-block", fontSize: "0.45em" }}
          >
            ✦
          </motion.span>
          <span className="tracking-[-0.02em] whitespace-nowrap">STOVERA</span>
          <motion.span
            animate={{ rotate: [0, -15, 0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 3 }}
            style={{ color: "#C8A84B", display: "inline-block", fontSize: "0.45em" }}
          >
            ✦
          </motion.span>
        </div>

        <div className="flex items-center justify-between px-4 md:px-7 pt-4 pb-2">
          <p className="font-mono text-[11px] md:text-xs text-text-muted uppercase tracking-[0.25em]">
            Reputation is Everything
          </p>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-16 h-px bg-forest/20" />
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-[0.25em]">
              Where Agents Earn Their Worth
            </p>
          </div>
        </div>
      </div>

      {/* ── TICKER 2 ────────────────────────────────── */}
      <BinaryTicker direction="right" speed={18} />

      {/* ── BOTTOM META ROW ─────────────────────────── */}
      <div className="flex justify-between items-center px-6 md:px-10 py-5 border-t border-forest/10">
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
          ENS · SpaceComputer · Sourcify
        </span>
        <a
          href="#about"
          className="font-mono text-[10px] text-text-muted uppercase tracking-widest hover:text-forest transition-colors flex items-center gap-2"
        >
          Scroll to explore
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="inline-block"
          >
            ↓
          </motion.span>
        </a>
      </div>
    </section>
  );
}
