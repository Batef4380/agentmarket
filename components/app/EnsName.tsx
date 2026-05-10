"use client";

import { useEnsName, useEnsAvatar } from "wagmi";
import { mainnet } from "wagmi/chains";

interface EnsNameProps {
  address: string;
  showAvatar?: boolean;
  fallbackLength?: number; // chars to show from each end of address
  style?: React.CSSProperties;
}

// Resolves 0x address → ENS name on Ethereum mainnet
// Falls back to truncated address if no ENS name found
export function EnsName({ address, showAvatar = false, fallbackLength = 6, style }: EnsNameProps) {
  const addr = address as `0x${string}`;
  const { data: ensName } = useEnsName({ address: addr, chainId: mainnet.id });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? undefined, chainId: mainnet.id });

  const display = ensName ?? `${address.slice(0, fallbackLength)}...${address.slice(-4)}`;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      {showAvatar && ensAvatar && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ensAvatar} alt="" style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0 }} />
      )}
      <span style={{ color: ensName ? "#4ade80" : "inherit" }}>{display}</span>
    </span>
  );
}
