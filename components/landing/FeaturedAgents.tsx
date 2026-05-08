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
      style={{
        background: "#0F1F0F",
        backgroundImage: "linear-gradient(rgba(200,168,75,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    >
      {/* Topo SVG lines */}
      <svg aria-hidden xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, zIndex: 0, pointerEvents: "none" }}>
        <path d="M0,6 C240,4 480,9 720,6 S1080,3 1440,7" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,12 C200,15 500,9 720,13 S1100,10 1440,12" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,19 C300,16 480,22 720,18 S960,21 1440,20" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,25 C240,28 600,22 720,26 S1080,23 1440,25" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,31 C360,28 480,34 720,30 S1000,33 1440,32" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,38 C200,40 480,35 720,38 S1100,36 1440,39" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,44 C300,41 600,47 720,43 S960,46 1440,44" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,50 C240,53 480,47 720,51 S1080,48 1440,50" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,56 C360,53 480,59 720,55 S1000,58 1440,57" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,63 C200,65 500,60 720,63 S1100,61 1440,64" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,69 C300,66 480,72 720,68 S960,71 1440,70" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,75 C240,78 600,72 720,76 S1080,73 1440,75" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,81 C360,78 480,84 720,80 S1000,83 1440,82" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,88 C200,90 480,85 720,88 S1100,86 1440,89" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,94 C300,91 600,97 720,93 S960,96 1440,94" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <path d="M0,100 C240,97 480,103 720,99 S1080,102 1440,100" fill="none" stroke="#C8A84B" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
      </svg>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
        <h2 className="font-anton text-[clamp(20px,3.8vw,64px)] text-gold text-center tracking-[0.2em] uppercase mb-16 whitespace-nowrap">
          F E A T U R E D &nbsp; A G E N T S
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              whileHover={{ y: -8 }}
              className="group relative border border-transparent hover:border-gold/50 transition-all duration-300 cursor-pointer"
              style={{ background: "#1A2E1A", border: "2px solid #C8A84B", boxShadow: "0 0 30px rgba(200, 168, 75, 0.2)" }}
            >
              <div className="w-full h-24" style={{ background: CARD_GRADIENTS[i] }} />
              <div className="p-5">
                <span className="absolute top-4 right-4 font-mono text-[10px] text-gold tracking-widest">#{agent.id}</span>
                <span className="inline-block font-mono text-[9px] uppercase tracking-widest text-leaf/70 border border-leaf/20 px-2 py-0.5 mb-3">
                  {agent.category}
                </span>
                <h3 className="font-mono text-sm md:text-base font-bold text-cream mb-3 tracking-tight">{agent.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-anton text-[clamp(32px,4vw,48px)] text-gold leading-none">{agent.score}</span>
                  <span className="text-gold text-lg">★</span>
                  <span className="font-mono text-[10px] text-text-muted">({agent.reviews} reviews)</span>
                </div>
                <div className="border-t border-forest/50 pt-3">
                  <span className="font-mono text-[11px] text-text-muted group-hover:text-gold transition-colors">View Profile →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
