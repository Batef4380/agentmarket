"use client";

// Solana address display component
// Interface kept identical to the old ENS version for drop-in compatibility.
// SNS (Solana Name Service) lookup can be added later without changing call sites.

interface SolNameProps {
  address: string;
  showAvatar?: boolean;
  fallbackLength?: number;
  style?: React.CSSProperties;
}

export function EnsName({ address, showAvatar = false, fallbackLength = 4, style }: SolNameProps) {
  const display = address.length > fallbackLength * 2 + 3
    ? `${address.slice(0, fallbackLength)}...${address.slice(-fallbackLength)}`
    : address;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      {showAvatar && (
        <span style={{
          width: 16, height: 16, borderRadius: "50%",
          background: "rgba(200,168,75,0.2)", flexShrink: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, color: "#C8A84B", fontFamily: "JetBrains Mono, monospace",
        }}>
          {address.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span>{display}</span>
    </span>
  );
}
