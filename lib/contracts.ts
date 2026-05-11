import { PublicKey } from "@solana/web3.js";

// Deployed Anchor program on Solana
// Update NEXT_PUBLIC_SOLANA_PROGRAM_ID after `anchor deploy`
export const STOVERA_ESCROW_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID ?? "11111111111111111111111111111111"
);

export const STATE_SEED = Buffer.from("state");
export const TASK_SEED  = Buffer.from("task");

// Placeholder — set NEXT_PUBLIC_DEFAULT_OPERATOR to your actual Solana operator pubkey
export const DEFAULT_OPERATOR = new PublicKey(
  process.env.NEXT_PUBLIC_DEFAULT_OPERATOR ?? "11111111111111111111111111111111"
);

export enum TaskStatus {
  Pending   = 0,
  Executing = 1,
  Completed = 2,
  Cancelled = 3,
}

export const LAMPORTS_PER_SOL = 1_000_000_000n;

export function parseSol(solStr: string): bigint {
  const [whole, frac = ""] = solStr.split(".");
  const fracPadded = frac.padEnd(9, "0").slice(0, 9);
  return BigInt(whole) * LAMPORTS_PER_SOL + BigInt(fracPadded);
}

export function formatSol(lamports: bigint): string {
  const sol = Number(lamports) / 1e9;
  if (sol === 0) return "0";
  return sol.toFixed(9).replace(/0+$/, "").replace(/\.$/, "");
}
