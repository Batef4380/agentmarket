"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BinaryTicker from "./BinaryTicker";

const NUM_LINES = 22;
const MOUSE_RADIUS = 120;
const DISTORT_AMP  = 35;

export default function Hero() {
  const router = useRouter();
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: -9999, y: -9999 });
  const influenceRef = useRef(0); // current smoothed influence scalar

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let time = 0;
    let W = 0, H = 0;
    let started = false;
    const dpr = window.devicePixelRatio || 1;

    // Line definitions — precompute random params once
    const lines = Array.from({ length: NUM_LINES }, (_, i) => ({
      baseline: 0,           // set in resize
      A1: 18 + Math.random() * 22,
      f1: 0.0028 + Math.random() * 0.002,
      p1: Math.random() * Math.PI * 2,
      A2: 8  + Math.random() * 14,
      f2: 0.006  + Math.random() * 0.004,
      p2: Math.random() * Math.PI * 2,
      A3: 4  + Math.random() * 8,
      f3: 0.012  + Math.random() * 0.006,
      p3: Math.random() * Math.PI * 2,
      thick: i % 4 === 0,
    }));

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      if (!W || !H) return;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      const pad = H * 0.12;
      lines.forEach((ln, i) => {
        ln.baseline = pad + (i / (NUM_LINES - 1)) * (H - pad * 2);
      });

      if (!started) { started = true; draw(); }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      // Smooth influence scalar toward 1 when mouse active, 0 when gone
      const targetInfluence = mx > -9000 ? 1 : 0;
      influenceRef.current += (targetInfluence - influenceRef.current) * 0.06;
      const inf = influenceRef.current;

      lines.forEach((ln) => {
        ctx.beginPath();
        ctx.lineWidth   = ln.thick ? 2 : 1;
        ctx.strokeStyle = "#1A2E1A";
        ctx.globalAlpha = ln.thick ? 0.55 : 0.35;

        for (let px = 0; px <= W; px += 2) {
          const wave =
            ln.A1 * Math.sin(px * ln.f1 + ln.p1 + time) +
            ln.A2 * Math.sin(px * ln.f2 + ln.p2 + time * 0.7) +
            ln.A3 * Math.sin(px * ln.f3 + ln.p3 + time * 1.3);

          // Gaussian mouse distortion toward cursor
          const dx = px - mx;
          const dy = ln.baseline + wave - my;
          const dist2 = dx * dx + dy * dy;
          const r2 = MOUSE_RADIUS * MOUSE_RADIUS * 2;
          const gaussian = inf * Math.exp(-dist2 / r2);
          const distort  = gaussian * DISTORT_AMP * Math.sin(mx / 80);

          const y = ln.baseline + wave + distort;

          if (px === 0) ctx.moveTo(px, y);
          else          ctx.lineTo(px, y);
        }

        ctx.stroke();
      });

      // Gold dot at cursor
      if (inf > 0.05 && mx > 0) {
        ctx.globalAlpha = 0.7 * inf;
        ctx.fillStyle   = "#C8A84B";
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      time += 0.003;
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mousePosRef.current = { x: -9999, y: -9999 }; };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize(); // succeeds immediately if element already has size

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

      {/* ── TOPOGRAPHIC CANVAS ───────────────────────── */}
      <div className="relative w-full" style={{ height: "30vh", minHeight: 160, background: "#F5F0E8" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block", cursor: "crosshair" }}
        />

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: 80,
            background: "linear-gradient(to bottom, transparent 70%, #F5F0E8 100%)",
          }}
        />

        {/* Floating badges */}
        <div className="absolute top-6 left-6 md:left-10 z-10 pointer-events-none">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] border border-forest/15 px-3 py-1.5 bg-cream/80 backdrop-blur-sm">
            ✦ Base Mainnet
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
      <div className="relative py-2 pb-6">
        <div
          className="flex items-center justify-center gap-4 md:gap-6 w-full px-3 md:px-6 select-none"
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize:   "clamp(56px, 11vw, 160px)",
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
          <div className="flex items-center gap-2">
            <p className="font-mono text-[11px] md:text-xs text-text-muted uppercase tracking-[0.25em]">
              Reputation is Everything
            </p>
            <div className="w-16 h-px bg-forest/20" />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-16 h-px bg-forest/20" />
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-[0.25em]">
              Where Agents Earn Their Worth
            </p>
          </div>
        </div>
      </div>

      {/* ── ENTER THE MARKET CTA ─────────────────────── */}
      <div className="flex justify-center py-4 px-4">
        <button
          onClick={() => router.push("/home")}
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: 24,
            letterSpacing: "0.05em",
            color: "#F5F0E8",
            background: "#1A2E1A",
            border: "none",
            padding: "14px 40px",
            cursor: "pointer",
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
          ENTER THE MARKET →
        </button>
      </div>

      {/* ── TICKER 2 ────────────────────────────────── */}
      <BinaryTicker direction="right" speed={18} />

      {/* ── SCROLL TO EXPLORE ────────────────────────── */}
      <a href="#about" style={{ textDecoration: "none", display: "flex", justifyContent: "center", padding: "24px 0" }}>
        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRight: "2px solid #C8A84B",
                borderBottom: "2px solid #C8A84B",
                transform: "rotate(45deg)",
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </a>
    </section>
  );
}
