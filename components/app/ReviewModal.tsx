"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, TransactionInstruction, SystemProgram } from "@solana/web3.js";
import { STOVERA_ESCROW_PROGRAM_ID } from "@/lib/contracts";

const AGENT_SEED  = Buffer.from("agent");
const REVIEW_SEED = Buffer.from("review");
const TASK_SEED   = Buffer.from("task");

// submit_review discriminator from IDL
const SUBMIT_REVIEW_DISC = Buffer.from([106, 30, 50, 83, 89, 46, 213, 239]);

interface Props {
  agentId: string;       // slug e.g. "eliza-agent"
  agentName: string;
  taskIdHex: string;     // 64-char hex (no 0x prefix), from completed task
  onClose: () => void;
  onSuccess: (sig: string) => void;
}

export default function ReviewModal({ agentId, agentName, taskIdHex, onClose, onSuccess }: Props) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [step, setStep] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [txSig, setTxSig] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!publicKey || rating === 0) return;
    setStep("pending");
    setErrorMsg("");

    try {
      // Derive agent_id bytes (sha256 of slug)
      const encoded = new TextEncoder().encode(agentId);
      const agentIdBuf = await crypto.subtle.digest("SHA-256", encoded.buffer as ArrayBuffer);
      const agentIdBytes = new Uint8Array(agentIdBuf);

      // task_id bytes from hex
      const taskIdBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        taskIdBytes[i] = parseInt(taskIdHex.slice(i * 2, i * 2 + 2), 16);
      }

      // PDAs
      const [reviewPDA] = PublicKey.findProgramAddressSync(
        [REVIEW_SEED, agentIdBytes, taskIdBytes],
        STOVERA_ESCROW_PROGRAM_ID
      );
      const [agentPDA] = PublicKey.findProgramAddressSync(
        [AGENT_SEED, agentIdBytes],
        STOVERA_ESCROW_PROGRAM_ID
      );
      const [taskPDA] = PublicKey.findProgramAddressSync(
        [TASK_SEED, taskIdBytes],
        STOVERA_ESCROW_PROGRAM_ID
      );

      // Instruction data: disc(8) + agent_id(32) + task_id(32) + rating(1)
      const data = Buffer.alloc(8 + 32 + 32 + 1);
      SUBMIT_REVIEW_DISC.copy(data, 0);
      Buffer.from(agentIdBytes).copy(data, 8);
      Buffer.from(taskIdBytes).copy(data, 40);
      data.writeUInt8(rating, 72);

      const ix = new TransactionInstruction({
        programId: STOVERA_ESCROW_PROGRAM_ID,
        keys: [
          { pubkey: reviewPDA, isSigner: false, isWritable: true },
          { pubkey: agentPDA,  isSigner: false, isWritable: true },
          { pubkey: taskPDA,   isSigner: false, isWritable: false },
          { pubkey: publicKey, isSigner: true,  isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data,
      });

      const tx = new Transaction().add(ix);
      const sig = await sendTransaction(tx, connection);
      setTxSig(sig);

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });

      // Also save to Supabase
      fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          userAddress: publicKey.toBase58(),
          taskId: `0x${taskIdHex}`,
          rating,
          comment: comment.trim() || null,
          txHash: sig,
        }),
      }).catch(() => {});

      setStep("success");
      onSuccess(sig);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message.slice(0, 140) : "Transaction failed";
      setErrorMsg(msg);
      setStep("error");
    }
  }, [publicKey, rating, agentId, taskIdHex, comment, sendTransaction, connection, onSuccess]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,20,10,0.85)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#0F1F0F", border: "1px solid rgba(200,168,75,0.4)", width: "100%", maxWidth: 420, padding: 0 }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(200,168,75,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.2em", color: "#6B7B6B", textTransform: "uppercase", marginBottom: 4 }}>On-chain Review</p>
            <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 18, color: "#F5F0E8", letterSpacing: "0.05em" }}>{agentName}</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#6B7B6B", fontSize: 18, cursor: "pointer", padding: "4px 8px" }}>✕</button>
        </div>

        <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
          {step !== "success" ? (
            <>
              {/* Stars */}
              <div>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.15em", color: "#6B7B6B", textTransform: "uppercase", marginBottom: 12 }}>Rating</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      style={{
                        background: "transparent", border: "none", cursor: "pointer", padding: "4px 2px",
                        fontSize: 32, lineHeight: 1,
                        color: s <= (hovered || rating) ? "#C8A84B" : "rgba(200,168,75,0.2)",
                        transition: "color 0.1s, transform 0.1s",
                        transform: s <= (hovered || rating) ? "scale(1.15)" : "scale(1)",
                      }}
                    >★</button>
                  ))}
                </div>
                {rating > 0 && (
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#C8A84B", marginTop: 6, letterSpacing: "0.1em" }}>
                    {["", "POOR", "FAIR", "GOOD", "GREAT", "EXCELLENT"][rating]}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.15em", color: "#6B7B6B", textTransform: "uppercase", marginBottom: 8 }}>Comment <span style={{ color: "rgba(107,123,107,0.6)" }}>(optional)</span></p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={280}
                  rows={3}
                  placeholder="Describe your experience..."
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(245,240,232,0.04)", border: "1px solid rgba(200,168,75,0.25)",
                    color: "#F5F0E8", fontFamily: "Inter, sans-serif", fontSize: 13,
                    padding: "10px 12px", resize: "none", outline: "none",
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {/* On-chain notice */}
              <div style={{ padding: "8px 12px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#4ade80", fontSize: 12, marginTop: 1 }}>◎</span>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#4ade80", lineHeight: 1.6 }}>
                  This review is stored on-chain and immutable. Reputation updates instantly.
                </p>
              </div>

              {step === "error" && (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#ef4444", lineHeight: 1.6 }}>{errorMsg}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={rating === 0 || step === "pending"}
                style={{
                  fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 14, letterSpacing: "0.08em",
                  color: "#0F1F0F", background: rating === 0 || step === "pending" ? "#6B7B6B" : "#C8A84B",
                  border: "none", padding: "14px 0", width: "100%",
                  cursor: rating === 0 || step === "pending" ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {step === "pending" ? "CONFIRMING ON SOLANA..." : "SUBMIT REVIEW →"}
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ color: s <= rating ? "#C8A84B" : "rgba(200,168,75,0.2)" }}>★</span>
                ))}
              </div>
              <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 20, color: "#4ade80", marginBottom: 8 }}>REVIEW SUBMITTED ✓</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7B6B", lineHeight: 1.7, marginBottom: 16 }}>
                Your review is now on-chain.<br />Reputation score updated.
              </p>
              {txSig && (
                <a
                  href={`https://solscan.io/tx/${txSig}?cluster=devnet`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#C8A84B", letterSpacing: "0.1em" }}
                >
                  VIEW ON SOLSCAN ↗
                </a>
              )}
              <button onClick={onClose} style={{ display: "block", marginTop: 20, width: "100%", fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", background: "transparent", border: "1px solid rgba(107,123,107,0.3)", padding: "10px 0", cursor: "pointer" }}>
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
