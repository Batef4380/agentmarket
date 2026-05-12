"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % COPY.navTicker.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md border-b border-forest/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Left — Logo + ticker */}
        <div className="flex items-center gap-3 shrink-0">
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
            <line x1="50" y1="4"  x2="50" y2="96" stroke="#C8A84B" strokeWidth="8" strokeLinecap="round"/>
            <line x1="4"  y1="50" x2="96" y2="50" stroke="#C8A84B" strokeWidth="8" strokeLinecap="round"/>
            <line x1="15" y1="15" x2="85" y2="85" stroke="#C8A84B" strokeWidth="8" strokeLinecap="round"/>
            <line x1="85" y1="15" x2="15" y2="85" stroke="#C8A84B" strokeWidth="8" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="22" fill="#1A2E1A"/>
          </svg>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase leading-tight">
              {COPY.navTicker[tickerIndex]}
            </span>
            <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase leading-tight">
              {COPY.navTicker[(tickerIndex + 1) % COPY.navTicker.length]}
            </span>
          </div>
        </div>

        {/* Center — Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {COPY.navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-anton text-sm tracking-[0.15em] text-forest hover:text-gold transition-colors uppercase"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right — icons + CTA */}
        <div className="flex items-center gap-4 shrink-0">
          {/* GitHub */}
          <a
            href="https://github.com/Batef4380/agentmarket"
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest hover:text-gold transition-colors"
            aria-label="GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* X / Twitter */}
          <a
            href="#"
            className="text-forest hover:text-gold transition-colors"
            aria-label="Twitter/X"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.746-8.851L1.548 2.25H8.08l4.261 5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <span className="hidden lg:block font-mono text-xs text-forest border border-forest/30 px-3 py-1.5 hover:border-gold hover:text-gold transition-colors cursor-pointer">
            Trust is the Protocol →
          </span>
        </div>
      </div>
    </nav>
  );
}
