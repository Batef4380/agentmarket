"use client";

import { useEffect, useRef } from "react";
import BinaryTicker from "./BinaryTicker";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", () => {
      mouseRef.current = { x: -1, y: -1 };
    });

    let t = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#F5F0E8";
      ctx.fillRect(0, 0, w, h);

      const lineCount = 18;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < lineCount; i++) {
        const baseY = (h / (lineCount + 1)) * (i + 1);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(26, 46, 26, ${0.12 + (i % 3) * 0.04})`;
        ctx.lineWidth = 1;

        for (let x = 0; x <= w; x += 3) {
          const progress = x / w;
          // base wave: multiple sine harmonics
          let y =
            baseY +
            Math.sin(progress * Math.PI * 4 + t + i * 0.5) * 18 +
            Math.sin(progress * Math.PI * 7 + t * 0.7 + i * 0.3) * 10 +
            Math.sin(progress * Math.PI * 2 + t * 0.4) * 25;

          // mouse distortion
          if (mx >= 0) {
            const dx = x - mx;
            const dy = baseY - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - dist / 200);
            y += influence * (my - baseY) * 0.4;
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      t += 0.008;
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
    <section className="relative bg-cream overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: "60vh", display: "block" }}
      />

      {/* Binary ticker below canvas */}
      <BinaryTicker direction="left" speed={25} />

      {/* Giant title */}
      <div className="relative px-4 md:px-8 overflow-hidden select-none">
        <div
          className="flex items-baseline justify-between w-full leading-none py-2"
          style={{
            fontSize: "clamp(64px, 13vw, 200px)",
            fontFamily: "Anton, sans-serif",
            color: "#1A2E1A",
          }}
        >
          <span className="tracking-tight">AGENT</span>
          <span style={{ color: "#C8A84B" }} className="mx-4">
            ✦
          </span>
          <span className="tracking-tight">MARKET</span>
        </div>
      </div>

      {/* Binary ticker below title */}
      <BinaryTicker direction="right" speed={20} />

      {/* Bottom meta row */}
      <div className="flex justify-between items-center px-6 md:px-8 py-4 border-t border-forest/10">
        <span className="font-mono text-[11px] text-text-muted uppercase tracking-widest">
          EST. ETHPrague 2026 / Sepolia Testnet
        </span>
        <span className="font-mono text-[11px] text-text-muted uppercase tracking-widest">
          Scroll to explore ↓
        </span>
      </div>
    </section>
  );
}
