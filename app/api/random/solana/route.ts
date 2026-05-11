import { NextResponse } from "next/server";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
  clusterApiUrl(
    (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as "devnet" | "mainnet-beta") ??
      "mainnet-beta"
  );

export async function GET() {
  try {
    const connection = new Connection(RPC_URL, "confirmed");

    // Fetch latest blockhash + slot in parallel
    const [{ blockhash, lastValidBlockHeight }, slot] = await Promise.all([
      connection.getLatestBlockhash("confirmed"),
      connection.getSlot("confirmed"),
    ]);

    // Derive 3 random u32 values from different 8-char windows of the blockhash
    // blockhash is base58 — convert to hex via BigInt for reproducible slicing
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

    // Also mix slot number in for extra uniqueness
    const slotMix = (slot ^ 0xdeadbeef) >>> 0;
    const entropy = [
      (v0 ^ slotMix).toString(16).padStart(8, "0").repeat(8),
      (v1 ^ slotMix).toString(16).padStart(8, "0").repeat(8),
      (v2 ^ slotMix).toString(16).padStart(8, "0").repeat(8),
      (v3 ^ slotMix).toString(16).padStart(8, "0").repeat(8),
    ];

    return NextResponse.json({
      entropy,
      blockhash,
      slot,
      lastValidBlockHeight,
      rpc: RPC_URL.includes("mainnet") ? "mainnet-beta" : "devnet",
      timestamp: new Date().toISOString(),
      solscanUrl: `https://solscan.io/block/${slot}`,
    });
  } catch (err) {
    console.error("[Solana entropy] RPC error:", (err as Error).message);

    // Fallback: slot-seeded deterministic
    const t = Date.now();
    const s0 = ((t * 2654435761) >>> 0).toString(16).padStart(8, "0");
    const s1 = ((t * 40503 + 7) >>> 0).toString(16).padStart(8, "0");
    const s2 = ((t * 1664525 + 1013904223) >>> 0).toString(16).padStart(8, "0");

    return NextResponse.json({
      entropy: [s0.repeat(8), s1.repeat(8), s2.repeat(8)],
      blockhash: null,
      slot: null,
      lastValidBlockHeight: null,
      rpc: "fallback",
      timestamp: new Date().toISOString(),
      solscanUrl: null,
    });
  }
}
