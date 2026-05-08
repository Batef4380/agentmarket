"use client";

import { motion } from "framer-motion";
import { COPY, STATS } from "@/lib/constants";
import { useRef, useEffect, useState } from "react";

function CountUp({ target, suffix }: { target: string; suffix: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseFloat(target.replace(/[^0-9.]/g, ""));
          const hasPlus = target.includes("+");
          const hasK = target.includes("K");
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const current = eased * num;
            const formatted = Number.isInteger(num)
              ? Math.floor(current).toString()
              : current.toFixed(1);
            setDisplay(formatted + (hasK ? "K" : "") + (hasPlus ? "+" : ""));
            if (p < 1) requestAnimationFrame(tick);
            else setDisplay(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="grid-bg bg-cream py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-12 md:gap-20">
          {/* Left — rotated label */}
          <div className="flex items-start justify-center md:justify-start">
            <span
              className="font-anton text-[clamp(48px,6vw,80px)] text-forest/15 tracking-widest select-none"
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
            >
              ABOUT
            </span>
          </div>

          {/* Right — content */}
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.15 }}
              className="space-y-10"
            >
              <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
                <h3 className="font-inter font-bold text-xl md:text-2xl text-forest mb-3">
                  {COPY.about.heading}
                </h3>
                <p className="font-inter text-text-muted leading-relaxed text-base md:text-lg">
                  {COPY.about.body1}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
                <h3 className="font-inter font-bold text-xl md:text-2xl text-forest mb-3">
                  {COPY.about.heading2}
                </h3>
                <p className="font-inter text-text-muted leading-relaxed text-base md:text-lg">
                  {COPY.about.body2}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
                <h3 className="font-inter font-bold text-xl md:text-2xl text-forest mb-3">
                  {COPY.about.heading3}
                </h3>
                <p className="font-inter text-text-muted leading-relaxed text-base md:text-lg">
                  {COPY.about.body3}
                </p>
              </motion.div>

              {/* Stats grid */}
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-forest/20 mt-4"
              >
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`p-6 ${i < STATS.length - 1 ? "border-r border-forest/20" : ""}`}
                  >
                    <div className="font-anton text-[clamp(28px,4vw,48px)] text-forest leading-none mb-1">
                      <CountUp target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
