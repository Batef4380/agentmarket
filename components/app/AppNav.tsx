"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";

function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  if (isConnected && address) {
    return (
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setShowMenu((v) => !v)}
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "#C8A84B",
            background: "rgba(200,168,75,0.1)",
            border: "1px solid rgba(200,168,75,0.5)",
            padding: "6px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          {shortAddr}
        </button>
        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              background: "#0F1F0F",
              border: "1px solid rgba(200,168,75,0.3)",
              minWidth: 160,
              zIndex: 100,
            }}
          >
            <button
              onClick={() => { router.push("/profile"); setShowMenu(false); }}
              style={{
                width: "100%",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: "#C8A84B",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(200,168,75,0.15)",
                padding: "10px 16px",
                textAlign: "left",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,168,75,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              VIEW PROFILE →
            </button>
            <button
              onClick={() => { disconnect(); setShowMenu(false); }}
              style={{
                width: "100%",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: "#F5F0E8",
                background: "transparent",
                border: "none",
                padding: "10px 16px",
                textAlign: "left",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,168,75,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              DISCONNECT
            </button>
          </div>
        )}
      </div>
    );
  }

  const CONNECTOR_META: Record<string, { label: string; icon: string }> = {
    injected: { label: "Browser Wallet", icon: "🦊" },
    metaMask: { label: "MetaMask", icon: "🦊" },
    coinbaseWallet: { label: "Coinbase Wallet", icon: "🔵" },
    walletConnect: { label: "WalletConnect", icon: "🔗" },
  };

  const handleConnect = (connector: (typeof connectors)[0]) => {
    connect(
      { connector },
      {
        onError: (err) => console.error("Connect error:", err.message),
      }
    );
    setShowMenu(false);
  };

  // Deduplicate: one entry per type
  const uniqueConnectors = connectors.filter(
    (c, i, arr) => arr.findIndex((x) => x.type === c.type) === i
  );

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setShowMenu((v) => !v)}
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "#F5F0E8",
          background: "transparent",
          border: "1px solid rgba(200,168,75,0.5)",
          padding: "6px 16px",
          cursor: "pointer",
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
      {showMenu && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "#0F1F0F",
            border: "1px solid rgba(200,168,75,0.3)",
            minWidth: 220,
            zIndex: 100,
          }}
        >
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "#6B7B6B",
              padding: "10px 16px 6px",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(200,168,75,0.1)",
              marginBottom: 4,
            }}
          >
            Select Wallet
          </p>
          {uniqueConnectors.length === 0 && (
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", padding: "12px 16px" }}>
              No wallet detected
            </p>
          )}
          {connectError && (
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#ef4444", padding: "6px 16px", borderTop: "1px solid rgba(239,68,68,0.2)" }}>
              {connectError.message.slice(0, 60)}
            </p>
          )}
          {uniqueConnectors.map((connector) => {
            const meta = CONNECTOR_META[connector.type] ?? { label: connector.name, icon: "💼" };
            return (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                style={{
                  width: "100%",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "#F5F0E8",
                  background: "transparent",
                  border: "none",
                  padding: "11px 16px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,168,75,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.icon}</span>
                {meta.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AppNav() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    try {
      const pool = JSON.parse(localStorage.getItem("stovera_pool") || "[]");
      const pending = pool.filter((a: { status: string }) => a.status === "pending").length;
      // Add mock pending count (4 mock agents)
      setPendingCount(pending + 4);
    } catch {
      setPendingCount(4);
    }
  }, [pathname]);

  const tabs = [
    { label: "HOME", href: "/home" },
    { label: "MARKET", href: "/market" },
    { label: "VERIFY", href: "/verify", badge: pendingCount > 0 ? String(pendingCount) : undefined },
    { label: "PROFILE", href: "/profile" },
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
                  <span style={{ fontSize: 8, letterSpacing: "0.1em", padding: "1px 5px", background: "rgba(200,168,75,0.15)", color: "#C8A84B" }}>
                    SOON
                  </span>
                )}
                {"badge" in tab && tab.badge && (
                  <span style={{ fontSize: 8, padding: "1px 5px", background: "#C8A84B", color: "#0F1F0F", fontFamily: "JetBrains Mono, monospace", letterSpacing: 0 }}>
                    {tab.badge}
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
        <WalletButton />
      </div>
    </nav>
  );
}
