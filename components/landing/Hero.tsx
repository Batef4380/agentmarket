"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import BinaryTicker from "./BinaryTicker";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);
    setSize();

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });
    canvas.addEventListener("mouseleave", () => {
      mouseRef.current = { x: -9999, y: -9999 };
    });

    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (!W || !H) { animFrameRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#F5F0E8";
      ctx.fillRect(0, 0, W, H);

      const t = tRef.current;
      const { x: mx, y: my } = mouseRef.current;
      const LINES = 22;

      for (let i = 0; i < LINES; i++) {
        const norm = i / (LINES - 1);
        const baseY = H * 0.05 + norm * H * 0.9;
        const alpha = i % 2 === 0 ? 0.18 + norm * 0.1 : 0.08 + norm * 0.06;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(26,46,26,${alpha})`;
        ctx.lineWidth = i % 4 === 0 ? 1.5 : 0.8;

        for (let px = 0; px <= W; px += 2) {
          const nx = px / W;
          const y =
            baseY +
            Math.sin(nx * Math.PI * 3.2 + t * 0.9 + i * 0.42) * (22 + norm * 14) +
            Math.sin(nx * Math.PI * 6.1 + t * 0.55 + i * 0.71) * (12 + norm * 8) +
            Math.sin(nx * Math.PI * 1.4 + t * 0.35 + i * 0.28) * (30 + norm * 10) +
            Math.sin(nx * Math.PI * 9.3 + t * 1.1 + i * 0.19) * 5;

          const dx = px - mx, dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = dist < 280 ? (1 - dist / 280) ** 2 * 55 : 0;
          const finalY = y + pull * Math.sign(dy || 1);

          px === 0 ? ctx.moveTo(px, finalY) : ctx.lineTo(px, finalY);
        }
        ctx.stroke();
      }

      if (mx > 0 && mx < W && my > 0 && my < H) {
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,168,75,0.6)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(200,168,75,0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      tRef.current += 0.007;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { ro.disconnect(); cancelAnimationFrame(animFrameRef.current); };
  }, []);

  return (
    <section className="relative bg-cream pt-16">
      {/* Canvas */}
      <div className="relative">
        <canvas ref={canvasRef} className="w-full block" style={{ height: "55vh" }} />
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #F5F0E8)" }}
        />
        <div className="absolute top-6 left-6 md:left-10">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] border border-forest/15 px-3 py-1.5 bg-cream/60 backdrop-blur-sm">
            ✦ Sepolia Testnet
          </span>
        </div>
        <div className="absolute top-6 right-6 md:right-10">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] border border-forest/15 px-3 py-1.5 bg-cream/60 backdrop-blur-sm">
            ETHPrague 2026
          </span>
        </div>
      </div>

      {/* Ticker 1 */}
      <BinaryTicker direction="left" speed={22} />

      {/* Giant title — NO overflow-hidden */}
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

      {/* Ticker 2 */}
      <BinaryTicker direction="right" speed={18} />

      {/* Bottom meta row */}
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
