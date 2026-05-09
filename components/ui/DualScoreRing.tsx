"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export interface DualScoreRingProps {
  /** Community rating 0–5 */
  rating: number;
  /** Reputation score 0–100 */
  rep: number;
  /** Overall size multiplier — default 1 (outer ring r=80) */
  scale?: number;
  /** Animate in when scrolled into view — default true */
  animate?: boolean;
}

export default function DualScoreRing({
  rating,
  rep,
  scale = 1,
  animate = true,
}: DualScoreRingProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const [progress, setProgress] = useState(animate ? 0 : 1);

  useEffect(() => {
    if (!animate || !inView) return;
    const start = performance.now();
    const duration = 1200;
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, animate]);

  // ── geometry ──────────────────────────────────────────────────────────────
  const cx = 90;
  const cy = 90;

  // Outer ring — full circle, rep score
  const rOuter = 80 * scale;
  const outerCirc = 2 * Math.PI * rOuter;
  const outerFill = (rep / 100) * outerCirc * progress;
  const outerGap = outerCirc - outerFill;

  // Inner ring — 270° sweep starting at 135° (7 o'clock), community rating
  const rInner = 62 * scale;
  const SWEEP = 270; // degrees
  const sweepRad = (SWEEP * Math.PI) / 180;
  const innerCirc = 2 * Math.PI * rInner;
  const innerTotal = (SWEEP / 360) * innerCirc;
  const innerFill = (rating / 5) * innerTotal * progress;
  const innerGap = innerCirc - innerFill;
  // Rotate so arc starts at 135deg (7 o'clock)
  const innerRotate = 135;

  // SVG viewBox is always 180×210 (circle 180 + label area below)
  const vw = 180;
  const vh = 215;

  // Animated values for center display
  const displayRating = (rating * progress).toFixed(1);
  const displayRep = Math.round(rep * progress);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <svg
        ref={ref}
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Outer ring track ──────────────────────────────────────── */}
        <circle
          cx={cx}
          cy={cy}
          r={rOuter}
          stroke="rgba(200,168,75,0.15)"
          strokeWidth={3}
        />

        {/* ── Outer ring fill ───────────────────────────────────────── */}
        <circle
          cx={cx}
          cy={cy}
          r={rOuter}
          stroke="#C8A84B"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`${outerFill} ${outerGap}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        {/* ── REP label at top of outer ring ────────────────────────── */}
        <text
          x={cx}
          y={cy - rOuter + 14}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          fill="#C8A84B"
          opacity={0.7}
          letterSpacing="0.12em"
        >
          REP {displayRep}
        </text>

        {/* ── Inner ring track ──────────────────────────────────────── */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          stroke="rgba(200,168,75,0.12)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${innerTotal} ${innerCirc - innerTotal}`}
          transform={`rotate(${innerRotate} ${cx} ${cy})`}
        />

        {/* ── Inner ring fill ───────────────────────────────────────── */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          stroke="#D4A843"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${innerFill} ${innerGap}`}
          transform={`rotate(${innerRotate} ${cx} ${cy})`}
        />

        {/* ── Center: rating number + star ──────────────────────────── */}
        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Anton, var(--font-anton), sans-serif"
          fontSize={32}
          fill="#C8A84B"
        >
          {displayRating}
        </text>
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          fontFamily="Anton, var(--font-anton), sans-serif"
          fontSize={12}
          fill="#C8A84B"
          opacity={0.9}
        >
          ★
        </text>

        {/* ── Labels below circle ───────────────────────────────────── */}
        <text
          x={cx}
          y={cy + rOuter + 26}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          fill="#8B7A3A"
          letterSpacing="0.1em"
        >
          ★ {rating.toFixed(1)}  COMMUNITY RATING
        </text>
        <text
          x={cx}
          y={cy + rOuter + 42}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          fill="#8B7A3A"
          letterSpacing="0.1em"
        >
          ◆ {rep}   REPUTATION SCORE
        </text>
      </svg>
    </div>
  );
}
