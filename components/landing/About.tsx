"use client";

import { motion, useInView } from "framer-motion";
import { COPY, STATS } from "@/lib/constants";
import { useRef, useEffect, useState } from "react";

/* ── Count-up hook ─────────────────────────────────────── */
function useCountUp(target: string, isInView: boolean) {
  const [display, setDisplay] = useState("0");
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const raw = parseFloat(target.replace(/[^0-9.]/g, ""));
    const hasPlus = target.includes("+");
    const hasK = target.includes("K");
    const isFloat = target.includes(".");
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      const val = eased * raw;
      const formatted = isFloat ? val.toFixed(1) : Math.floor(val).toString();
      setDisplay(formatted + (hasK ? "K" : "") + (hasPlus ? "+" : ""));
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    };

    requestAnimationFrame(tick);
  }, [isInView, target]);

  return display;
}

/* ── Stat card ─────────────────────────────────────────── */
function StatCard({
  stat,
  index,
}: {
  stat: (typeof STATS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const display = useCountUp(stat.value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-6 md:p-8 flex flex-col justify-between min-h-[120px] border-forest/20
        ${index < STATS.length - 1 ? "border-r" : ""}
        ${index < 2 ? "border-b md:border-b-0" : ""}
      `}
    >
      {/* index number — top-right micro label */}
      <span className="absolute top-3 right-4 font-mono text-[9px] text-text-muted/40 tracking-widest">
        0{index + 1}
      </span>

      <div
        className="font-anton leading-none text-forest"
        style={{ fontSize: "clamp(36px, 4.5vw, 60px)" }}
      >
        {display}
        {stat.suffix}
      </div>

      <div className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] mt-2">
        {stat.label}
      </div>
    </motion.div>
  );
}

/* ── Content block ─────────────────────────────────────── */
function ContentBlock({
  num,
  heading,
  body,
  delay,
}: {
  num: string;
  heading: string;
  body: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-[32px_1fr] gap-5 items-start py-8 border-b border-forest/10 last:border-b-0"
    >
      {/* Number accent */}
      <div className="flex flex-col items-center pt-1 gap-2">
        <span className="font-mono text-[10px] text-gold tracking-widest">
          {num}
        </span>
        <div className="w-px flex-1 min-h-[40px] bg-gold/30" />
      </div>

      {/* Text */}
      <div>
        <h3
          className="font-inter font-bold text-forest mb-3 leading-tight"
          style={{ fontSize: "clamp(16px, 1.6vw, 22px)" }}
        >
          {heading}
        </h3>
        <p className="font-inter text-text-muted leading-[1.75] text-base">
          {body}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Section ───────────────────────────────────────────── */
export default function About() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="about" className="grid-bg bg-cream overflow-hidden">

      {/* ── Editorial header bar ──────────────────── */}
      <div className="border-b border-forest/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div
            className="flex items-center justify-between py-5"
          >
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">
              § 01 — About
            </span>
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">
              Stovera Protocol
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] lg:grid-cols-[160px_1fr] gap-0">

          {/* Left — rotated label */}
          <div className="hidden md:flex items-start justify-center pt-10 select-none">
            <span
              className="font-anton text-[clamp(56px,6vw,88px)] text-forest/10 leading-none tracking-widest"
              style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
            >
              ABOUT
            </span>
          </div>

          {/* Right — content blocks */}
          <div className="border-l border-forest/10 pl-0 md:pl-12 lg:pl-16">

            {/* Large pull quote */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.8 }}
              className="font-anton text-forest leading-[1.1] mb-12 md:mb-16"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              The first marketplace where
              <span className="text-gold"> AI agents </span>
              earn trust on-chain.
            </motion.p>

            {/* Three content blocks */}
            <ContentBlock
              num="—"
              heading={COPY.about.heading}
              body={COPY.about.body1}
              delay={0}
            />
            <ContentBlock
              num="—"
              heading={COPY.about.heading2}
              body={COPY.about.body2}
              delay={0.1}
            />
            <ContentBlock
              num="—"
              heading={COPY.about.heading3}
              body={COPY.about.body3}
              delay={0.2}
            />
          </div>
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────── */}
      <div className="border-t border-forest/15">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Label row */}
          <div className="py-4 border-b border-forest/10">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">
              By the numbers
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-forest/15 divide-x divide-forest/10">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
