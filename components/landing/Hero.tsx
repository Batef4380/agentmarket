"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import BinaryTicker from "./BinaryTicker";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left),
        y: (e.clientY - rect.top),
      };
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", () => {
      mouseRef.current = { x: -9999, y: -9999 };
    });

    let t = 0;

    // Topographic contour: each line is a continuous height-field contour
    // We draw N horizontal "iso-lines" that oscillate via layered sine harmonics
    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      // background
      ctx.fillStyle = "#F5F0E8";
      ctx.fillRect(0, 0, W, H);

      const LINES = 22;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const MOUSE_RADIUS = 280;
      const MOUSE_STRENGTH = 55;

      for (let i = 0; i < LINES; i++) {
        const norm = i / (LINES - 1); // 0..1
        const baseY = H * 0.05 + norm * H * 0.9;

        // alternating opacity for topographic "elevation band" feel
        const alpha = i % 2 === 0
          ? 0.18 + norm * 0.1
          : 0.08 + norm * 0.06;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(26, 46, 26, ${alpha})`;
        ctx.lineWidth = i % 4 === 0 ? 1.5 : 0.8;

        const STEP = 2;
        for (let px = 0; px <= W; px += STEP) {
          const nx = px / W;

          // layered harmonics — each line has a unique phase fingerprint
          const y =
            baseY +
            Math.sin(nx * Math.PI * 3.2 + t * 0.9 + i * 0.42) * (22 + norm * 14) +
            Math.sin(nx * Math.PI * 6.1 + t * 0.55 + i * 0.71) * (12 + norm * 8) +
            Math.sin(nx * Math.PI * 1.4 + t * 0.35 + i * 0.28) * (30 + norm * 10) +
            Math.sin(nx * Math.PI * 9.3 + t * 1.1  + i * 0.19) * 5;

          // mouse repulsion / attraction
          const dx = px - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = dist < MOUSE_RADIUS
            ? (1 - dist / MOUSE_RADIUS) ** 2 * MOUSE_STRENGTH
            : 0;
          const finalY = y + pull * Math.sign(dy || 1);

          if (px === 0) ctx.moveTo(px, finalY);
          else ctx.lineTo(px, finalY);
        }

        ctx.stroke();
      }

      // subtle gold accent dot at mouse position
      if (mx > 0 && mx < W && my > 0 && my < H) {
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200, 168, 75, 0.6)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(200, 168, 75, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      t += 0.007;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section className="relative bg-cream overflow-hidden pt-16">
      {/* ── CANVAS ─────────────────────────────────── */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ height: "55vh" }}
        />

        {/* overlay gradient at bottom of canvas — fades into title */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #F5F0E8)",
          }}
        />

        {/* floating label top-left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute top-6 left-6 md:left-10"
        >
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] border border-forest/15 px-3 py-1.5 bg-cream/60 backdrop-blur-sm">
            ✦ Sepolia Testnet
          </span>
        </motion.div>

        {/* floating label top-right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-6 right-6 md:right-10"
        >
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] border border-forest/15 px-3 py-1.5 bg-cream/60 backdrop-blur-sm">
            ETHPrague 2026
          </span>
        </motion.div>
      </div>

      {/* ── TICKER 1 ────────────────────────────────── */}
      <BinaryTicker direction="left" speed={22} />

      {/* ── GIANT TITLE ─────────────────────────────── */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="px-3 md:px-6 select-none"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(72px, 14.5vw, 215px)",
            lineHeight: 0.88,
            color: "#1A2E1A",
          }}
        >
          {/* Line 1 */}
          <div className="flex items-baseline justify-between w-full">
            <span className="tracking-[-0.01em]">STO</span>
            <motion.span
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{ color: "#C8A84B", display: "inline-block" }}
              className="mx-2 md:mx-4"
            >
              ✦
            </motion.span>
            <span className="tracking-[-0.01em]">VERA</span>
          </div>
        </motion.div>

        {/* Tagline below title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="flex items-center justify-between px-4 md:px-7 pt-4 pb-2"
        >
          <p className="font-mono text-[11px] md:text-xs text-text-muted uppercase tracking-[0.25em]">
            Reputation is Everything
          </p>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-16 h-px bg-forest/20" />
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-[0.25em]">
              Where Agents Earn Their Worth
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── TICKER 2 ────────────────────────────────── */}
      <BinaryTicker direction="right" speed={18} />

      {/* ── BOTTOM META ROW ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex justify-between items-center px-6 md:px-10 py-5 border-t border-forest/10"
      >
        <div className="flex items-center gap-6">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
            ENS ·  SpaceComputer · Sourcify
          </span>
        </div>
        <a
          href="#about"
          className="group font-mono text-[10px] text-text-muted uppercase tracking-widest hover:text-forest transition-colors flex items-center gap-2"
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
      </motion.div>
    </section>
  );
}
