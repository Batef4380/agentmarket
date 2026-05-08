"use client";

import { motion } from "framer-motion";
import { AGENTS } from "@/lib/constants";

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #4ade80 0%, #C8A84B 100%)",
  "linear-gradient(135deg, #C8A84B 0%, #1A2E1A 100%)",
  "linear-gradient(135deg, #1A2E1A 0%, #4ade80 100%)",
  "linear-gradient(135deg, #4ade80 0%, #1A2E1A 60%, #C8A84B 100%)",
  "linear-gradient(135deg, #C8A84B 0%, #4ade80 100%)",
  "linear-gradient(135deg, #1A2E1A 0%, #C8A84B 100%)",
];

export default function FeaturedAgents() {
  return (
    <section
      id="agents"
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "#0F1F0F" }}
    >
      {/* Tiled background text */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <div
          className="font-anton text-[clamp(80px,12vw,160px)] text-cream leading-none tracking-widest whitespace-pre-wrap break-all"
          style={{ opacity: 0.04 }}
        >
          {Array(8)
            .fill("AGENTS ")
            .join("")
            .repeat(6)}
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7 }}
          className="font-anton text-[clamp(20px,3.8vw,64px)] text-gold text-center tracking-[0.2em] uppercase mb-16 whitespace-nowrap"
        >
          F E A T U R E D &nbsp; A G E N T S
        </motion.h2>

        {/* Cards grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -8 }}
              className="group relative border border-forest/0 hover:border-gold/50 transition-all duration-300 cursor-pointer"
              style={{ background: "#1A2E1A" }}
            >
              {/* Gradient thumbnail */}
              <div
                className="w-full h-24"
                style={{ background: CARD_GRADIENTS[i] }}
              />

              {/* Card body */}
              <div className="p-5">
                {/* Card number */}
                <span
                  className="absolute top-4 right-4 font-mono text-[10px] text-gold tracking-widest"
                  aria-hidden
                >
                  #{agent.id}
                </span>

                {/* Category badge */}
                <span className="inline-block font-mono text-[9px] uppercase tracking-widest text-leaf/70 border border-leaf/20 px-2 py-0.5 mb-3">
                  {agent.category}
                </span>

                {/* Agent name */}
                <h3 className="font-mono text-sm md:text-base font-bold text-cream mb-3 tracking-tight">
                  {agent.name}
                </h3>

                {/* Score */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-anton text-[clamp(32px,4vw,48px)] text-gold leading-none">
                    {agent.score}
                  </span>
                  <span className="text-gold text-lg">★</span>
                  <span className="font-mono text-[10px] text-text-muted">
                    ({agent.reviews} reviews)
                  </span>
                </div>

                {/* CTA */}
                <div className="border-t border-forest/50 pt-3">
                  <span className="font-mono text-[11px] text-text-muted group-hover:text-gold transition-colors">
                    View Profile →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
