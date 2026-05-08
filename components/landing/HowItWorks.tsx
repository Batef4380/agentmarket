"use client";

import { motion } from "framer-motion";
import { COPY } from "@/lib/constants";
import BinaryTicker from "./BinaryTicker";

export default function HowItWorks() {
  return (
    <section id="features" className="grid-bg bg-cream overflow-hidden">
      <BinaryTicker direction="left" speed={35} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-36">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-anton text-[clamp(48px,10vw,140px)] text-forest leading-none tracking-tight mb-16 md:mb-24"
        >
          HOW IT
          <br />
          WORKS
        </motion.h2>

        <div className="divide-y divide-forest/15">
          {COPY.steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 py-10 md:py-14 group"
            >
              {/* Step number + title */}
              <div className="flex items-start gap-6">
                <span
                  className="font-anton leading-none text-forest/08 select-none"
                  style={{
                    fontSize: "clamp(64px, 10vw, 120px)",
                    color: "rgba(26,46,26,0.08)",
                  }}
                >
                  {step.number}
                </span>
                <div className="mt-2">
                  <h3 className="font-inter font-bold text-xl md:text-2xl text-forest mb-1">
                    {step.title}
                  </h3>
                  <div className="w-8 h-0.5 bg-gold" />
                </div>
              </div>

              {/* Body */}
              <p className="font-inter text-text-muted text-base md:text-lg leading-relaxed self-center">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <BinaryTicker direction="right" speed={28} />
    </section>
  );
}
