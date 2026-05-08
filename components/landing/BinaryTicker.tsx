"use client";

import { BINARY_TICKER_CONTENT } from "@/lib/constants";

interface BinaryTickerProps {
  direction?: "left" | "right";
  speed?: number;
  dark?: boolean;
}

export default function BinaryTicker({
  direction = "left",
  speed = 30,
  dark = false,
}: BinaryTickerProps) {
  const text = BINARY_TICKER_CONTENT;
  const animationName = direction === "left" ? "ticker-left" : "ticker-right";

  return (
    <div
      className={`overflow-hidden border-t border-b py-1.5 ${
        dark
          ? "border-forest/30 text-leaf/60 bg-dark-surface"
          : "border-forest/20 text-forest/50 bg-cream"
      }`}
      style={{ userSelect: "none" }}
    >
      <div
        className="flex whitespace-nowrap font-mono text-[10px] tracking-widest uppercase"
        style={{
          animation: `${animationName} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        <span className="pr-8">{text}</span>
        <span className="pr-8">{text}</span>
      </div>

      <style jsx>{`
        @keyframes ticker-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes ticker-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
