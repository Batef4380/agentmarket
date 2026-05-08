"use client";

import { COPY, STATS } from "@/lib/constants";
import { useRef, useEffect, useState } from "react";

function CountUp({ target, suffix }: { target: string; suffix: string }) {
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const raw = parseFloat(target.replace(/[^0-9.]/g, ""));
      const hasPlus = target.includes("+");
      const hasK = target.includes("K");
      const isFloat = target.includes(".");
      const startTime = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - startTime) / 1400, 1);
        const val = (1 - Math.pow(1 - p, 4)) * raw;
        setDisplay((isFloat ? val.toFixed(1) : Math.floor(val).toString()) + (hasK ? "K" : "") + (hasPlus ? "+" : ""));
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(target);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function About() {
  return (
    <section id="about" className="grid-bg bg-cream overflow-hidden">

      <div className="border-b border-forest/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between py-5">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">§ 01 — About</span>
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">Stovera Protocol</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] lg:grid-cols-[160px_1fr]">
          <div className="hidden md:flex items-start justify-center pt-10 select-none">
            <span
              className="font-anton text-[clamp(56px,6vw,88px)] text-forest/10 leading-none tracking-widest"
              style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
            >
              ABOUT
            </span>
          </div>

          <div className="border-l border-forest/10 pl-0 md:pl-12 lg:pl-16">
            <p
              className="font-anton text-forest leading-[1.1] mb-12 md:mb-16"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              The first marketplace where
              <span className="text-gold"> AI agents </span>
              earn trust on-chain.
            </p>

            {[
              { heading: COPY.about.heading,  body: COPY.about.body1 },
              { heading: COPY.about.heading2, body: COPY.about.body2 },
              { heading: COPY.about.heading3, body: COPY.about.body3 },
            ].map(({ heading, body }) => (
              <div key={heading} className="grid grid-cols-[24px_1fr] gap-5 items-start py-8 border-b border-forest/10 last:border-b-0">
                <div className="flex flex-col items-center pt-1 gap-2">
                  <span className="font-mono text-[10px] text-gold">—</span>
                  <div className="w-px flex-1 min-h-[40px] bg-gold/30" />
                </div>
                <div>
                  <h3 className="font-inter font-bold text-forest mb-3 leading-tight" style={{ fontSize: "clamp(16px, 1.6vw, 22px)" }}>
                    {heading}
                  </h3>
                  <p className="font-inter text-text-muted leading-[1.75] text-base">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-forest/15">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="py-4 border-b border-forest/10">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">By the numbers</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-forest/10">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`relative p-6 md:p-8 flex flex-col justify-between min-h-[120px] border-forest/20 ${i < 2 ? "border-b md:border-b-0" : ""}`}
              >
                <span className="absolute top-3 right-4 font-mono text-[9px] text-text-muted/40 tracking-widest">0{i + 1}</span>
                <div className="font-anton leading-none text-forest" style={{ fontSize: "clamp(36px, 4.5vw, 60px)" }}>
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
