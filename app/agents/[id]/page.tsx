"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction, PublicKey, TransactionInstruction } from "@solana/web3.js";
import AppNav from "@/components/app/AppNav";
import { EnsName } from "@/components/app/EnsName";
import ReviewModal from "@/components/app/ReviewModal";
import { AGENT_DETAILS, type AgentTaskExample } from "@/lib/agentDetails";
import { DEFAULT_OPERATOR, STOVERA_ESCROW_PROGRAM_ID, STATE_SEED, TASK_SEED, parseSol, formatSol } from "@/lib/contracts";

const AGENT_SEED = Buffer.from("agent");

// Read AgentAccount PDA: owner(32) + agent_id(32) + review_count(4) + total_rating(4) + bump(1)
async function fetchOnChainReputation(
  connection: import("@solana/web3.js").Connection,
  agentSlug: string
): Promise<{ reviewCount: number; avgScore: number; pda: string } | null> {
  try {
    const encoded = new TextEncoder().encode(agentSlug);
    const hashBuf = await crypto.subtle.digest("SHA-256", encoded.buffer as ArrayBuffer);
    const agentIdBytes = new Uint8Array(hashBuf);
    const [agentPDA] = PublicKey.findProgramAddressSync(
      [AGENT_SEED, agentIdBytes],
      STOVERA_ESCROW_PROGRAM_ID
    );
    const info = await connection.getAccountInfo(agentPDA);
    if (!info) return { reviewCount: 0, avgScore: 0, pda: agentPDA.toBase58() };
    const data = info.data;
    const reviewCount = data.readUInt32LE(72);
    const totalRating = data.readUInt32LE(76);
    const avgScore = reviewCount > 0 ? totalRating / reviewCount : 0;
    return { reviewCount, avgScore, pda: agentPDA.toBase58() };
  } catch {
    return null;
  }
}

const STARS = (score: number) =>
  [1, 2, 3, 4, 5].map((i) => (
    <span key={i} style={{ color: i <= Math.round(score) ? "#C8A84B" : "rgba(200,168,75,0.2)", fontSize: 14 }}>★</span>
  ));

function fmtSol(val: string) {
  const n = parseFloat(val);
  if (n === 0) return "0 SOL";
  return n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") + " SOL";
}

// Generate a deterministic task ID from sha256 of agent + address + timestamp
async function generateTaskId(agentId: string, userAddress: string): Promise<string> {
  const raw = `${agentId}-${userAddress}-${Date.now()}`;
  const encoded = Buffer.from(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const address = publicKey?.toBase58() ?? null;
  const isConnected = connected;

  const agent = AGENT_DETAILS[id as string];

  const [selectedTask, setSelectedTask] = useState<AgentTaskExample | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [step, setStep] = useState<"idle" | "confirm" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [onChainRep, setOnChainRep] = useState<{ reviewCount: number; avgScore: number; pda: string } | null>(null);
  const [reviews, setReviews] = useState<{ id: string; user_address: string; rating: number; comment: string | null; created_at: string; tx_hash: string | null }[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [completeError, setCompleteError] = useState("");

  const handleCompleteTask = useCallback(async () => {
    if (!taskId) return;
    setCompleting(true);
    setCompleteError("");
    try {
      const res = await fetch("/api/operator/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-operator-secret": "stovera2026" },
        body: JSON.stringify({ taskIdHex: taskId, actualCostLamports: 0 }),
      });
      if (res.ok) {
        setTaskCompleted(true);
      } else {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        setCompleteError(body.error || `HTTP ${res.status}`);
      }
    } catch (err) {
      setCompleteError(err instanceof Error ? err.message : "Network error");
    } finally {
      setCompleting(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (!agent) return;
    fetchOnChainReputation(connection, agent.id).then(setOnChainRep);
    fetch(`/api/reviews?agentId=${encodeURIComponent(agent.id)}`)
      .then((r) => r.json())
      .then((d) => { if (d.reviews) setReviews(d.reviews); })
      .catch(() => {});
  }, [connection, agent]);

  const depositLamports = selectedTask && agent
    ? parseSol((parseFloat(selectedTask.estimateHigh) * agent.depositMultiplier).toFixed(9))
    : null;

  const refundEstimate = selectedTask && depositLamports
    ? formatSol(depositLamports - parseSol(selectedTask.estimateLow))
    : null;

  const handleDeposit = useCallback(async () => {
    if (!publicKey || !selectedTask || !depositLamports || !agent) return;
    setStep("pending");
    setErrorMsg("");

    try {
      const tid = await generateTaskId(agent.id, publicKey.toBase58());
      setTaskId(tid);

      // Convert hex task ID to 32-byte array
      const taskIdBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        taskIdBytes[i] = parseInt(tid.slice(i * 2, i * 2 + 2), 16);
      }

      // Derive PDAs
      const [taskPDA] = PublicKey.findProgramAddressSync(
        [TASK_SEED, taskIdBytes],
        STOVERA_ESCROW_PROGRAM_ID
      );
      const [statePDA] = PublicKey.findProgramAddressSync(
        [STATE_SEED],
        STOVERA_ESCROW_PROGRAM_ID
      );

      // Build deposit_for_task instruction manually
      // discriminator: [127, 150, 47, 196, 130, 128, 57, 42]
      const disc = Buffer.from([127, 150, 47, 196, 130, 128, 57, 42]);
      const data = Buffer.alloc(8 + 32 + 32 + 8);
      disc.copy(data, 0);
      Buffer.from(taskIdBytes).copy(data, 8);
      DEFAULT_OPERATOR.toBuffer().copy(data, 40);
      // u64 LE for deposit_lamports
      const lamportsBN = depositLamports;
      data.writeUInt32LE(Number(lamportsBN & 0xFFFFFFFFn), 72);
      data.writeUInt32LE(Number((lamportsBN >> 32n) & 0xFFFFFFFFn), 76);

      const ix = new TransactionInstruction({
        programId: STOVERA_ESCROW_PROGRAM_ID,
        keys: [
          { pubkey: taskPDA, isSigner: false, isWritable: true },
          { pubkey: statePDA, isSigner: false, isWritable: false },
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data,
      });

      const tx = new Transaction().add(ix);
      const sig = await sendTransaction(tx, connection);
      setTxSig(sig);

      // Confirm transaction
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });

      setStep("success");

      // Persist to Supabase
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskIdBytes32: `0x${tid}`,
          agentId: agent.id,
          userAddress: publicKey.toBase58(),
          operatorAddress: DEFAULT_OPERATOR.toBase58(),
          depositSol: formatSol(depositLamports),
          txHashDeposit: sig,
        }),
      }).catch((e) => console.error("Failed to save task to DB:", e));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message.slice(0, 120) : "Transaction failed";
      setErrorMsg(msg);
      setStep("error");
    }
  }, [publicKey, selectedTask, depositLamports, agent, sendTransaction, connection]);

  if (!agent) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F0E8", paddingTop: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AppNav />
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 28, color: "#1A2E1A" }}>AGENT NOT FOUND</p>
          <button onClick={() => router.push("/market")} style={{ marginTop: 16, fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#C8A84B", background: "transparent", border: "1px solid #C8A84B", padding: "8px 20px", cursor: "pointer" }}>
            ← BACK TO MARKET
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", paddingTop: 60 }}>
      <AppNav />

      {/* Hero */}
      <div style={{ background: "#0F1F0F", borderBottom: "1px solid rgba(200,168,75,0.3)" }}>
        <div style={{ height: 5, background: agent.gradient }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 36px", display: "flex", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", background: "rgba(200,168,75,0.15)", color: "#C8A84B", padding: "3px 9px", border: "1px solid rgba(200,168,75,0.3)" }}>
                {agent.category}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.12em", color: "#4ade80", padding: "3px 9px", border: "1px solid rgba(74,222,128,0.35)", background: "rgba(74,222,128,0.07)" }}>
                <span style={{ fontSize: 8 }}>◎</span> 8004-SOL IDENTITY
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(28px, 4vw, 52px)", color: "#F5F0E8", letterSpacing: "0.02em", lineHeight: 1.1, marginBottom: 10 }}>
              {agent.name}
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#6B7B6B", lineHeight: 1.6, maxWidth: 520, marginBottom: 20 }}>
              {agent.tagline}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {reviews.length > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "flex" }}>{STARS(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)}</span>
                  <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 22, color: "#C8A84B" }}>{(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}</span>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B" }}>({reviews.length} reviews · on-chain)</span>
                </div>
              ) : (
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.15em", color: "#4ade80", border: "1px solid rgba(74,222,128,0.4)", padding: "3px 8px", background: "rgba(74,222,128,0.06)" }}>
                  NEW · Be the first to review
                </span>
              )}
              <div style={{ width: 1, height: 20, background: "rgba(200,168,75,0.2)" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#C8A84B" }}>{agent.priceLabel}</span>
              {(agent.website || agent.github) && (
                <>
                  <div style={{ width: 1, height: 20, background: "rgba(200,168,75,0.2)" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    {agent.website && (
                      <a href={agent.website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.1em", color: "#C8A84B", border: "1px solid rgba(200,168,75,0.35)", padding: "3px 10px", textDecoration: "none", background: "rgba(200,168,75,0.06)" }}>
                        WEBSITE ↗
                      </a>
                    )}
                    {agent.github && (
                      <a href={agent.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.1em", color: "#6B7B6B", border: "1px solid rgba(107,123,107,0.35)", padding: "3px 10px", textDecoration: "none" }}>
                        GITHUB ↗
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Price card */}
          <div style={{ background: "rgba(245,240,232,0.05)", border: "1px solid rgba(200,168,75,0.3)", padding: "24px", minWidth: 260 }}>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.2em", color: "#6B7B6B", textTransform: "uppercase", marginBottom: 12 }}>Pricing Model</p>
            <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 28, color: "#C8A84B", lineHeight: 1, marginBottom: 4 }}>{agent.priceLabel}</p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", lineHeight: 1.6, marginBottom: 16 }}>
              Billed by actual compute time.<br />
              You deposit the max cost upfront.<br />
              Unused portion refunded automatically.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)" }}>
              <span style={{ color: "#4ade80", fontSize: 12 }}>↩</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#4ade80", letterSpacing: "0.1em" }}>AUTO-REFUND EXCESS AFTER TASK</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 80px", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── LEFT / MAIN ─────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#fff", border: "2px solid #1A2E1A" }}>
            <SectionHeader label="What this agent does" />
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#1A2E1A", lineHeight: 1.75, marginBottom: 20, opacity: 0.85 }}>{agent.longDescription}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {agent.whatItDoes.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <span style={{ color: "#C8A84B", fontSize: 14, flexShrink: 0, marginTop: 1 }}>✦</span>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2E1A", lineHeight: 1.6, opacity: 0.85 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "2px solid #1A2E1A" }}>
            <SectionHeader label="Limitations" />
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
              {agent.limitations.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: "#6B7B6B", fontSize: 14, flexShrink: 0 }}>—</span>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B7B6B", lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", border: "2px solid #1A2E1A" }}>
            <SectionHeader label="Capabilities" />
            <div style={{ padding: "16px 24px", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {agent.capabilities.map((c) => (
                <span key={c} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.05em", color: "#1A2E1A", border: "1px solid rgba(26,46,26,0.35)", padding: "4px 10px", background: "rgba(26,46,26,0.04)" }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div style={{ background: "#fff", border: "2px solid #1A2E1A" }}>
            <SectionHeader label={`Reviews${reviews.length > 0 ? ` (${reviews.length})` : ""}`} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {reviews.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", letterSpacing: "0.1em" }}>
                    {onChainRep && onChainRep.reviewCount > 0 ? "ON-CHAIN REVIEWS NOT YET INDEXED" : "NO REVIEWS YET"}
                  </p>
                  {onChainRep && onChainRep.reviewCount > 0 && (
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6B7B6B", marginTop: 6, lineHeight: 1.6 }}>
                      {onChainRep.reviewCount} review{onChainRep.reviewCount > 1 ? "s" : ""} recorded on Solana · avg {onChainRep.avgScore.toFixed(1)} / 5.0
                    </p>
                  )}
                </div>
              ) : (
                reviews.map((r, i) => (
                  <div key={r.id} style={{ padding: "16px 24px", borderBottom: i < reviews.length - 1 ? "1px solid rgba(26,46,26,0.08)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ color: s <= r.rating ? "#C8A84B" : "rgba(200,168,75,0.2)", fontSize: 13 }}>★</span>
                        ))}
                      </div>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B", letterSpacing: "0.08em" }}>
                        {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    {r.comment && (
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2E1A", lineHeight: 1.65, marginBottom: 6, opacity: 0.85 }}>{r.comment}</p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#6B7B6B", letterSpacing: "0.06em" }}>
                        {r.user_address.slice(0, 6)}...{r.user_address.slice(-4)}
                      </span>
                      {r.tx_hash && (
                        <a
                          href={`https://solscan.io/tx/${r.tx_hash}?cluster=devnet`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, color: "#4ade80", letterSpacing: "0.06em", textDecoration: "none" }}
                        >
                          ◎ on-chain ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 8004-SOL Identity Card */}
          <div style={{ background: "#0F1F0F", border: "1px solid rgba(74,222,128,0.3)" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(74,222,128,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#4ade80", fontSize: 14 }}>◎</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.2em", color: "#4ade80", textTransform: "uppercase" }}>8004-Solana On-Chain Identity</span>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.15em", color: "#6B7B6B", marginBottom: 4, textTransform: "uppercase" }}>Global Agent ID</p>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#4ade80", wordBreak: "break-all", lineHeight: 1.6 }}>{agent.erc8004Id}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Chain</p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#F5F0E8" }}>Solana Mainnet</p>
                </div>
                <div>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Standard</p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#F5F0E8" }}>8004-Solana</p>
                </div>
                <div>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Reputation</p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: reviews.length > 0 ? "#C8A84B" : "#6B7B6B" }}>
                    {reviews.length > 0 ? `${(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} / 5.0` : "unrated"}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Feedback</p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#F5F0E8" }}>
                    {reviews.length === 0 ? "no reviews yet" : `${reviews.length} on-chain`}
                  </p>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Operator</p>
                  <EnsName address={DEFAULT_OPERATOR.toBase58()} showAvatar style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#F5F0E8" }} />
                </div>
                {onChainRep?.pda && (
                  <div style={{ gridColumn: "span 2" }}>
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Identity Account (PDA)</p>
                    <a
                      href={`https://solscan.io/account/${onChainRep.pda}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#4ade80", wordBreak: "break-all", lineHeight: 1.5, textDecoration: "none" }}
                    >
                      {onChainRep.pda} ↗
                    </a>
                  </div>
                )}
                <div style={{ gridColumn: "span 2" }}>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Escrow Program</p>
                  <a
                    href={`https://solscan.io/account/${STOVERA_ESCROW_PROGRAM_ID.toBase58()}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#4ade80", wordBreak: "break-all", lineHeight: 1.5, textDecoration: "none" }}
                  >
                    {STOVERA_ESCROW_PROGRAM_ID.toBase58()} ↗
                  </a>
                </div>
              </div>
              <div style={{ padding: "8px 10px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#4ade80", lineHeight: 1.6 }}>
                  Identity, reputation, and validation data stored on-chain per 8004-Solana. Feedback is immutable and verifiable by anyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT / TASK PANEL ─────────────────────────────────── */}
        <div style={{ width: 340, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Task selector */}
          <div style={{ background: "#fff", border: "2px solid #1A2E1A" }}>
            <SectionHeader label="Select a Task" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {agent.tasks.map((task, i) => {
                const isSelected = selectedTask?.name === task.name;
                return (
                  <button
                    key={i}
                    onClick={() => { setSelectedTask(task); setStep("idle"); setTaskId(null); setTxSig(null); }}
                    style={{
                      display: "flex", flexDirection: "column", gap: 6,
                      padding: "16px 20px", textAlign: "left",
                      background: isSelected ? "rgba(200,168,75,0.08)" : "transparent",
                      border: "none",
                      borderLeft: isSelected ? "3px solid #C8A84B" : "3px solid transparent",
                      borderBottom: i < agent.tasks.length - 1 ? "1px solid rgba(26,46,26,0.1)" : "none",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "rgba(26,46,26,0.03)"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2E1A", fontWeight: isSelected ? 700 : 500 }}>{task.name}</span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", whiteSpace: "nowrap" }}>{task.duration}</span>
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7B6B", lineHeight: 1.55 }}>{task.description}</p>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#C8A84B" }}>
                      ~{fmtSol(task.estimateLow)} – {fmtSol(task.estimateHigh)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cost + payment */}
          {selectedTask && (
            <div style={{ background: "#fff", border: `2px solid ${step === "success" ? "#4ade80" : step === "error" ? "#ef4444" : "#C8A84B"}` }}>
              <SectionHeader label="Cost Estimate" gold />
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <CostRow label="Task" value={selectedTask.name} mono />
                <CostRow label="Duration" value={selectedTask.duration} />
                <CostRow label="Min cost" value={`~${fmtSol(selectedTask.estimateLow)}`} />
                <CostRow label="Max cost" value={`~${fmtSol(selectedTask.estimateHigh)}`} />
                <div style={{ height: 1, background: "rgba(200,168,75,0.2)", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", letterSpacing: "0.1em" }}>
                    DEPOSIT (= MAX COST)
                  </span>
                  <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 20, color: "#C8A84B" }}>
                    {depositLamports ? formatSol(depositLamports) : "—"} SOL
                  </span>
                </div>
                <div style={{ padding: "8px 10px", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#4ade80", lineHeight: 1.6 }}>
                    ↩ Up to ~{refundEstimate} SOL refunded after task completes (actual cost deducted)
                  </p>
                </div>

                {/* CTA states */}
                {step === "idle" && (
                  <button
                    onClick={() => isConnected ? setStep("confirm") : null}
                    style={{ marginTop: 4, fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 14, letterSpacing: "0.08em", color: "#F5F0E8", background: isConnected ? "#1A2E1A" : "#6B7B6B", border: "none", padding: "13px 0", cursor: isConnected ? "pointer" : "not-allowed", width: "100%", transition: "background 0.2s" }}
                    onMouseEnter={(e) => { if (isConnected) e.currentTarget.style.background = "#C8A84B"; }}
                    onMouseLeave={(e) => { if (isConnected) e.currentTarget.style.background = "#1A2E1A"; }}
                  >
                    {isConnected ? "START TASK →" : "CONNECT WALLET"}
                  </button>
                )}

                {step === "confirm" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ padding: "10px 12px", background: "rgba(200,168,75,0.08)", border: "1px solid rgba(200,168,75,0.3)" }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#C8A84B", lineHeight: 1.7 }}>
                        Deposit <strong>{depositLamports ? formatSol(depositLamports) : "—"} SOL</strong> on Solana. Actual cost deducted — remainder refunded automatically.
                      </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <button onClick={() => setStep("idle")} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#6B7B6B", background: "transparent", border: "1px solid rgba(107,123,107,0.4)", padding: "10px 0", cursor: "pointer" }}>
                        CANCEL
                      </button>
                      <button onClick={handleDeposit} style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 13, color: "#0F1F0F", background: "#C8A84B", border: "none", padding: "10px 0", cursor: "pointer" }}>
                        CONFIRM →
                      </button>
                    </div>
                  </div>
                )}

                {step === "pending" && (
                  <div style={{ padding: "16px", background: "rgba(200,168,75,0.06)", border: "1px solid rgba(200,168,75,0.3)", textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 14, color: "#C8A84B", marginBottom: 6 }}>
                      {txSig ? "CONFIRMING ON SOLANA..." : "CONFIRM IN WALLET..."}
                    </p>
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>
                      {txSig ? `sig: ${txSig.slice(0, 18)}...` : "Waiting for signature"}
                    </p>
                  </div>
                )}

                {step === "success" && (
                  <div style={{ padding: "16px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 16, color: "#4ade80", marginBottom: 6 }}>TASK QUEUED ✓</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7B6B", lineHeight: 1.7, marginBottom: 10 }}>
                      Deposit confirmed on Solana.<br />
                      Refund sent automatically when task completes.
                    </p>
                    {txSig && (
                      <a
                        href={`https://solscan.io/tx/${txSig}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#C8A84B", letterSpacing: "0.1em" }}
                      >
                        VIEW ON SOLSCAN →
                      </a>
                    )}
                    {!taskCompleted ? (
                      <>
                        <button
                          onClick={handleCompleteTask}
                          disabled={completing}
                          style={{ display: "block", marginTop: 12, width: "100%", fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 12, letterSpacing: "0.08em", color: "#F5F0E8", background: completing ? "#6B7B6B" : "#1A2E1A", border: "1px solid rgba(74,222,128,0.3)", padding: "10px 0", cursor: completing ? "not-allowed" : "pointer" }}
                        >
                          {completing ? "COMPLETING..." : "⚡ SIMULATE TASK COMPLETE"}
                        </button>
                        {completeError && (
                          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#ef4444", lineHeight: 1.6, marginTop: 6, wordBreak: "break-all" }}>{completeError}</p>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => setShowReview(true)}
                        style={{ display: "block", marginTop: 12, width: "100%", fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 12, letterSpacing: "0.08em", color: "#0F1F0F", background: "#C8A84B", border: "none", padding: "10px 0", cursor: "pointer" }}
                      >
                        ★ LEAVE A REVIEW
                      </button>
                    )}
                  </div>
                )}

                {step === "error" && (
                  <div style={{ padding: "12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.3)" }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#ef4444", lineHeight: 1.6 }}>
                      {errorMsg || "Transaction failed. Please try again."}
                    </p>
                    <button onClick={() => setStep("idle")} style={{ marginTop: 8, fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", background: "transparent", border: "1px solid rgba(107,123,107,0.3)", padding: "6px 12px", cursor: "pointer" }}>
                      TRY AGAIN
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => router.push("/market")}
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.1em", color: "#6B7B6B", background: "transparent", border: "1px solid rgba(107,123,107,0.3)", padding: "10px 0", cursor: "pointer", width: "100%", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#1A2E1A"; e.currentTarget.style.borderColor = "#1A2E1A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7B6B"; e.currentTarget.style.borderColor = "rgba(107,123,107,0.3)"; }}
          >
            ← BACK TO MARKET
          </button>
        </div>
      </div>

      {showReview && agent && taskId && (
        <ReviewModal
          agentId={agent.id}
          agentName={agent.name}
          taskIdHex={taskId}
          onClose={() => setShowReview(false)}
          onSuccess={() => {
            setShowReview(false);
            fetchOnChainReputation(connection, agent.id).then(setOnChainRep);
            fetch(`/api/reviews?agentId=${encodeURIComponent(agent.id)}`)
              .then((r) => r.json())
              .then((d) => { if (d.reviews) setReviews(d.reviews); })
              .catch(() => {});
          }}
        />
      )}
    </div>
  );
}

function SectionHeader({ label, gold }: { label: string; gold?: boolean }) {
  return (
    <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(26,46,26,0.1)", background: gold ? "rgba(200,168,75,0.06)" : "#1A2E1A" }}>
      <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A84B" }}>{label}</p>
    </div>
  );
}

function CostRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontFamily: mono ? "JetBrains Mono, monospace" : "Inter, sans-serif", fontSize: mono ? 10 : 12, color: "#1A2E1A", textAlign: "right", maxWidth: 180 }}>{value}</span>
    </div>
  );
}
