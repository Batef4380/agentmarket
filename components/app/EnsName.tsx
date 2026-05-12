"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { reverseLookup } from "@bonfida/spl-name-service";

// In-memory cache — survives re-renders, cleared on page reload
const snsCache = new Map<string, string | null>();

function useSnsName(address: string): string | null {
  const { connection } = useConnection();
  const [name, setName] = useState<string | null>(() => snsCache.get(address) ?? null);

  useEffect(() => {
    if (!address) return;
    // Already cached
    if (snsCache.has(address)) {
      setName(snsCache.get(address) ?? null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const pubkey = new PublicKey(address);
        const domain = await reverseLookup(connection, pubkey);
        const result = domain ? `${domain}.sol` : null;
        if (!cancelled) {
          snsCache.set(address, result);
          setName(result);
        }
      } catch {
        // Address has no .sol domain — cache null so we don't retry
        if (!cancelled) {
          snsCache.set(address, null);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [address, connection]);

  return name;
}

interface SolNameProps {
  address: string;
  showAvatar?: boolean;
  fallbackLength?: number;
  style?: React.CSSProperties;
}

export function EnsName({ address, showAvatar = false, fallbackLength = 4, style }: SolNameProps) {
  const snsName = useSnsName(address);

  if (!address) return <span style={style}>—</span>;

  const shortAddr = address.length > fallbackLength * 2 + 3
    ? `${address.slice(0, fallbackLength)}...${address.slice(-fallbackLength)}`
    : address;

  const display = snsName ?? shortAddr;
  const initials = snsName
    ? snsName.slice(0, 2).toUpperCase()
    : address.slice(0, 2).toUpperCase();

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      {showAvatar && (
        <span style={{
          width: 16, height: 16, borderRadius: "50%",
          background: "rgba(200,168,75,0.2)", flexShrink: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, color: "#C8A84B", fontFamily: "JetBrains Mono, monospace",
        }}>
          {initials}
        </span>
      )}
      <span>{display}</span>
    </span>
  );
}
