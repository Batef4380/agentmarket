"use client";

import { COPY } from "@/lib/constants";
import BinaryTicker from "./BinaryTicker";

export default function HowItWorks() {
  return (
    <section id="features" className="grid-bg bg-cream overflow-hidden">
      <BinaryTicker direction="left" speed={35} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-36">
        <h2 className="font-anton text-[clamp(48px,10vw,140px)] text-forest leading-none tracking-tight mb-16 md:mb-24">
          HOW IT<br />WORKS
        </h2>

        <div className="divide-y divide-forest/15">
          {COPY.steps.map((step) => (
            <div key={step.number} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 py-10 md:py-14">
              <div className="flex items-start gap-6">
                <span
                  className="font-anton leading-none select-none"
                  style={{ fontSize: "clamp(64px, 10vw, 120px)", color: "rgba(26,46,26,0.08)" }}
                >
                  {step.number}
                </span>
                <div className="mt-2">
                  <h3 className="font-inter font-bold text-xl md:text-2xl text-forest mb-1">{step.title}</h3>
                  <div className="w-8 h-0.5 bg-gold" />
                </div>
              </div>
              <p className="font-inter text-text-muted text-base md:text-lg leading-relaxed self-center">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <BinaryTicker direction="right" speed={28} />
    </section>
  );
}
