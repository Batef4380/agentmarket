import { NextResponse } from "next/server";
import { Connection, clusterApiUrl } from "@solana/web3.js";

// Try configured URL first, then public fallbacks
const RPC_ENDPOINTS = [
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  "https://rpc.ankr.com/solana",
  "https://api.mainnet-beta.solana.com",
  clusterApiUrl("mainnet-beta"),
].filter(Boolean) as string[];

async function fetchEntropyFromRpc(url: string) {
  const connection = new Connection(url, {
    commitment: "confirmed",
    disableRetryOnRateLimit: true,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const [{ blockhash, lastValidBlockHeight }, slot] = await Promise.all([
      connection.getLatestBlockhash("confirmed"),
      connection.getSlot("confirmed"),
    ]);
    clearTimeout(timeout);

    // Derive entropy from blockhash bytes XOR'd with slot
    const hashBytes = Buffer.from(
      blockhash
        .split("")
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
      "hex"
    );

    const v0 = hashBytes.slice(0, 4).readUInt32BE(0);
    const v1 = hashBytes.slice(4, 8).readUInt32BE(0);
    const v2 = hashBytes.slice(8, 12).readUInt32BE(0);
    const v3 = hashBytes.slice(12, 16).readUInt32BE(0);

    const slotMix = (slot ^ 0xdeadbeef) >>> 0;
    const entropy = [
      ((v0 ^ slotMix) >>> 0).toString(16).padStart(8, "0").repeat(8),
      ((v1 ^ slotMix) >>> 0).toString(16).padStart(8, "0").repeat(8),
      ((v2 ^ slotMix) >>> 0).toString(16).padStart(8, "0").repeat(8),
      ((v3 ^ slotMix) >>> 0).toString(16).padStart(8, "0").repeat(8),
    ];

    return { entropy, blockhash, slot, lastValidBlockHeight };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  let lastError: Error | null = null;

  for (const url of RPC_ENDPOINTS) {
    try {
      const { entropy, blockhash, slot, lastValidBlockHeight } =
        await fetchEntropyFromRpc(url);

      const rpcLabel = url.includes("ankr")
        ? "ankr/mainnet-beta"
        : url.includes("mainnet")
        ? "mainnet-beta"
        : "mainnet-beta";

      return NextResponse.json({
        entropy,
        blockhash,
        slot,
        lastValidBlockHeight,
        rpc: rpcLabel,
        timestamp: new Date().toISOString(),
        solscanUrl: `https://solscan.io/block/${slot}`,
      });
    } catch (err) {
      lastError = err as Error;
      console.warn(`[Solana entropy] RPC ${url} failed:`, (err as Error).message);
      // try next endpoint
    }
  }

  // All RPCs failed — deterministic time-based fallback
  console.error("[Solana entropy] All RPCs failed:", lastError?.message);
  const t = Date.now();
  const s0 = ((t * 2654435761) >>> 0).toString(16).padStart(8, "0");
  const s1 = ((t * 40503 + 7) >>> 0).toString(16).padStart(8, "0");
  const s2 = ((t * 1664525 + 1013904223) >>> 0).toString(16).padStart(8, "0");
  const s3 = ((t * 214013 + 2531011) >>> 0).toString(16).padStart(8, "0");

  return NextResponse.json({
    entropy: [s0.repeat(8), s1.repeat(8), s2.repeat(8), s3.repeat(8)],
    blockhash: null,
    slot: null,
    lastValidBlockHeight: null,
    rpc: "fallback",
    timestamp: new Date().toISOString(),
    solscanUrl: null,
  });
}
