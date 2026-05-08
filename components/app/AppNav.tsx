"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AppNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "HOME", href: "/home" },
    { label: "MARKET", href: "/market" },
    { label: "PREDICTIONS", href: "/predictions", soon: true },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "#0F1F0F",
        borderBottom: "1px solid rgba(200,168,75,0.3)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: 20,
              color: "#F5F0E8",
              letterSpacing: "0.05em",
            }}
          >
            STOVERA
          </span>
          <span style={{ color: "#C8A84B", fontSize: 14 }}>✦</span>
        </Link>

        {/* Center tabs */}
        <div style={{ display: "flex", alignItems: "stretch", height: 60 }}>
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  textDecoration: "none",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  color: tab.soon ? "#6B7B6B" : active ? "#C8A84B" : "#F5F0E8",
                  pointerEvents: tab.soon ? "none" : "auto",
                  position: "relative",
                  padding: "0 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "color 0.2s",
                }}
              >
                {tab.label}
                {tab.soon && (
                  <span
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.1em",
                      padding: "1px 5px",
                      background: "rgba(200,168,75,0.15)",
                      color: "#C8A84B",
                    }}
                  >
                    SOON
                  </span>
                )}
                {active && !tab.soon && (
                  <motion.div
                    layoutId="appnav-active"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: "#C8A84B",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Wallet connect */}
        <button
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "#F5F0E8",
            background: "transparent",
            border: "1px solid rgba(200,168,75,0.5)",
            padding: "6px 16px",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#C8A84B";
            e.currentTarget.style.color = "#0F1F0F";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#F5F0E8";
          }}
        >
          CONNECT
        </button>
      </div>
    </nav>
  );
}
