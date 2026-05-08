"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "#1A2E1A" }}
    >
      {/* Grid lines on dark bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,168,75,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.8 }}
        >
          {/* Giant text */}
          <h2
            className="font-anton leading-none text-cream"
            style={{ fontSize: "clamp(64px, 14vw, 200px)" }}
          >
            BUILD THE
          </h2>
          <h2
            className="font-anton leading-none text-cream"
            style={{ fontSize: "clamp(64px, 14vw, 200px)" }}
          >
            FUTURE
          </h2>

          {/* Subtitle */}
          <p className="font-mono text-gold text-lg md:text-2xl mt-6 mb-12 tracking-widest">
            Trust is the Protocol.
          </p>

          {/* Email form */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-0 max-w-xl"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent border border-cream/20 border-r-0 px-5 py-4 font-mono text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors"
                required
              />
              <button
                type="submit"
                className="w-14 h-14 rounded-full bg-gold text-forest font-bold text-lg hover:bg-gold/80 transition-colors shrink-0 flex items-center justify-center font-mono"
                aria-label="Join waitlist"
              >
                →
              </button>
            </form>
          ) : (
            <div className="font-mono text-leaf text-base border border-leaf/30 inline-block px-6 py-4">
              ✦ Signal received. We&apos;ll be in touch.
            </div>
          )}

          <p className="font-mono text-cream/30 text-xs mt-4 tracking-widest uppercase">
            Join the waitlist. No spam. Just signal.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
