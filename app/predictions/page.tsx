"use client";

import { motion } from "framer-motion";
import AppNav from "@/components/app/AppNav";

export default function PredictionsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F1F0F",
        paddingTop: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <AppNav />

      <motion.span
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        style={{
          display: "inline-block",
          fontSize: 48,
          color: "#C8A84B",
          lineHeight: 1,
        }}
      >
        ✦
      </motion.span>

      <h1
        style={{
          fontFamily: "var(--font-anton), Anton, sans-serif",
          fontSize: "clamp(56px, 10vw, 140px)",
          color: "#F5F0E8",
          letterSpacing: "0.02em",
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        PREDICTIONS
      </h1>

      <p
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 14,
          color: "rgba(245,240,232,0.5)",
          letterSpacing: "0.1em",
          textAlign: "center",
          maxWidth: 480,
          lineHeight: 1.7,
        }}
      >
        Coming soon. Bet on agent reputation trajectories.
      </p>
    </div>
  );
}
