"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import BinaryTicker from "./BinaryTicker";

const COLS = 18;
const ROWS = 7;
const TOTAL = COLS * ROWS;
const RADIUS = 160; // px — reveal circle radius

const WORDS = [
  "REPUTATION", "ON-CHAIN", "TRUST", "AGENTS", "EARN", "WORTH",
  "VERIFY", "DEPLOY", "STAKE", "SCORE", "PROOF", "PROTOCOL",
  "MARKET", "STOVERA", "BOUNTY", "REVIEW", "SIGNAL", "BADGE",
  "IDENTITY", "NETWORK", "TASK", "REWARD", "AGENT", "HIRE",
  "BUILD", "AUDIT", "RANK", "CHAIN", "REGISTRY", "ESCROW",
  "MERIT", "TRACK", "ETH", "0x", "✦", "→",
];

// Deterministic cell content — ~40 % of cells get a word
const CELL_WORDS = Array.from({ length: TOTAL }, (_, i) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  const hash = ((row * 7 + 1) * (col * 13 + 1) * 37) % 100;
  if (hash < 40) return WORDS[(row * 5 + col * 7) % WORDS.length];
  return "";
});

export default function Hero() {
  const gridRef   = useRef<HTMLDivElement>(null);
  const cellRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef    = useRef<number>();
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const update = () => {
      const { x, y } = mouseRef.current;
      const W = grid.offsetWidth  / COLS;
      const H = grid.offsetHeight / ROWS;

      cellRefs.current.forEach((cell, i) => {
        if (!cell) return;
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const cx  = (col + 0.5) * W;
        const cy  = (row + 0.5) * H;
        const dist = Math.hypot(cx - x, cy - y);
        const t   = Math.max(0, 1 - dist / RADIUS); // 0–1
        const t2  = t * t;                           // ease-in curve

        cell.style.borderColor      = `rgba(200,168,75,${0.06 + t2 * 0.7})`;
        cell.style.backgroundColor  = `rgba(200,168,75,${t2 * 0.1})`;

        const txt = cell.firstElementChild as HTMLElement | null;
        if (txt) {
          txt.style.opacity = String(0.05 + t * 0.95);
          txt.style.color   = t > 0.35
            ? `rgba(200,168,75,1)`
            : `rgba(26,46,26,${0.2 + t * 0.6})`;
          txt.style.transform = `scale(${1 + t * 0.08})`;
        }
      });
    };

    const onMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      cancelAnimationFrame(rafRef.current!);
      rafRef.current = requestAnimationFrame(update);
    };

    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      cancelAnimationFrame(rafRef.current!);
      rafRef.current = requestAnimationFrame(update);
    };

    grid.addEventListener("mousemove", onMove);
    grid.addEventListener("mouseleave", onLeave);
    return () => {
      grid.removeEventListener("mousemove", onMove);
      grid.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current!);
    };
  }, []);

  return (
    <section className="relative bg-cream pt-16">

      {/* ── INTERACTIVE GRID ─────────────────────────── */}
      <div
        ref={gridRef}
        className="relative overflow-hidden"
        style={{ height: "55vh", background: "#F5F0E8" }}
      >
        {/* Cell grid */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows:    `repeat(${ROWS}, 1fr)`,
          }}
        >
          {CELL_WORDS.map((word, i) => (
            <div
              key={i}
              ref={el => { cellRefs.current[i] = el; }}
              className="flex items-center justify-center border"
              style={{
                borderColor: "rgba(26,46,26,0.06)",
                backgroundColor: "transparent",
                transition: "border-color 80ms, background-color 80ms",
              }}
            >
              {word && (
                <span
                  className="font-mono uppercase select-none pointer-events-none"
                  style={{
                    fontSize: "clamp(6px, 0.6vw, 9px)",
                    letterSpacing: "0.15em",
                    opacity: 0.05,
                    color: "rgba(26,46,26,0.3)",
                    transition: "opacity 80ms, color 80ms, transform 80ms",
                    transformOrigin: "center",
                  }}
                >
                  {word}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Radial vignette so edges fade softly */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 90% at 50% 50%, transparent 40%, rgba(245,240,232,0.7) 100%)",
          }}
        />

        {/* Bottom fade into body */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #F5F0E8)" }}
        />

        {/* Floating badges */}
        <div className="absolute top-6 left-6 md:left-10 z-10 pointer-events-none">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] border border-forest/15 px-3 py-1.5 bg-cream/80 backdrop-blur-sm">
            ✦ Sepolia Testnet
          </span>
        </div>
        <div className="absolute top-6 right-6 md:right-10 z-10 pointer-events-none">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] border border-forest/15 px-3 py-1.5 bg-cream/80 backdrop-blur-sm">
            ETHPrague 2026
          </span>
        </div>
      </div>

      {/* ── TICKER 1 ────────────────────────────────── */}
      <BinaryTicker direction="left" speed={22} />

      {/* ── GIANT TITLE ─────────────────────────────── */}
      <div className="relative py-2">
        <div
          className="flex items-center justify-center gap-4 md:gap-6 w-full px-3 md:px-6 select-none"
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: "clamp(72px, 14.5vw, 215px)",
            lineHeight: 0.88,
            color: "#1A2E1A",
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
