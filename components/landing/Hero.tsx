"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import BinaryTicker from "./BinaryTicker";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -2000, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COL_STEP  = 8;    // px between column centers
    const SEG_H     = 3;    // segment rect height
    const SEG_GAP   = 2;    // gap between segments
    const SEG_STEP  = SEG_H + SEG_GAP;
    const BAR_W     = 2.5;
    const MOUSE_R   = 280;  // influence radius (px)

    interface Col {
      x:     number;
      phase: number;
      freq:  number;
      amp:   number;
    }

    let cols: Col[] = [];
    let W = 0, H = 0;
    let raf = 0;
    let t   = 0;
    let started = false;

    const buildCols = () => {
      cols = [];
      const n = Math.ceil(W / COL_STEP) + 2;
      for (let i = 0; i < n; i++) {
        cols.push({
          x:     i * COL_STEP,
          phase: Math.random() * Math.PI * 2,
          freq:  0.22 + Math.random() * 0.45,
          amp:   0.12 + Math.random() * 0.38,
        });
      }
    };

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      if (W === 0 || H === 0) return;
      canvas.width  = W;
      canvas.height = H;
      buildCols();
      if (!started) { started = true; draw(); }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;

      cols.forEach(col => {
        const dx        = col.x - mx;
        const mRaw      = Math.max(0, 1 - Math.abs(dx) / MOUSE_R);
        const mStrength = mRaw * mRaw * mRaw;  // cubic falloff — sharp peak

        // Animated height
        const wave  = (Math.sin(t * col.freq + col.phase) + 1) / 2;
        const baseH = col.amp * wave * H * 0.42;
        const boost = mStrength * H * 0.78;
        const totalH = Math.max(4, baseH + boost);
        const numSegs = Math.floor(totalH / SEG_STEP);

        for (let s = 0; s < numSegs; s++) {
          const y        = H - s * SEG_STEP - SEG_H;
          const progress = s / numSegs;              // 0 = bottom, 1 = top

          let r: number, g: number, b: number, a: number;

          if (mStrength > 0.02) {
            // Gold — brighter center, fades to top & sides
            r = 200; g = 168; b = 75;
            a = (0.2 + mStrength * 0.8) * (1 - progress * 0.55);
          } else {
            // Forest green ghost
            r = 26; g = 46; b = 26;
            a = (0.05 + col.amp * 0.07) * (1 - progress * 0.5);
          }

          ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          ctx.fillRect(col.x - BAR_W / 2, y, BAR_W, SEG_H);
        }
      });

      t   += 0.015;
      raf  = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onLeave = () => { mouseRef.current = { x: -2000, y: 0 }; };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="relative bg-cream pt-16">

      {/* ── CANVAS WAVE ──────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: "55vh", background: "#F5F0E8" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ cursor: "crosshair" }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
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
