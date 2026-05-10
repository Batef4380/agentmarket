"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, keccak256, toBytes, formatEther } from "viem";
import AppNav from "@/components/app/AppNav";
import { EnsName } from "@/components/app/EnsName";
import { AGENT_DETAILS, type AgentTaskExample } from "@/lib/agentDetails";
import { STOVERA_ESCROW_ADDRESS, STOVERA_ESCROW_ABI, DEFAULT_OPERATOR, TaskStatus } from "@/lib/contracts";

const STARS = (score: number) =>
  [1, 2, 3, 4, 5].map((i) => (
    <span key={i} style={{ color: i <= Math.round(score) ? "#C8A84B" : "rgba(200,168,75,0.2)", fontSize: 14 }}>★</span>
  ));

function fmtEth(val: string) {
  const n = parseFloat(val);
  if (n === 0) return "0 ETH";
  return n.toFixed(5).replace(/0+$/, "").replace(/\.$/, "") + " ETH";
}

// Generate a deterministic task ID from timestamp + agent + wallet
function generateTaskId(agentId: string, userAddress: string): `0x${string}` {
  const raw = `${agentId}-${userAddress}-${Date.now()}`;
  return keccak256(toBytes(raw));
}

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const agent = AGENT_DETAILS[id as string];

  const [selectedTask, setSelectedTask] = useState<AgentTaskExample | null>(null);
  const [taskId, setTaskId] = useState<`0x${string}` | null>(null);
  const [step, setStep] = useState<"idle" | "confirm" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const depositAmount = selectedTask
    ? parseEther((parseFloat(selectedTask.estimateHigh) * agent?.depositMultiplier || 1).toFixed(6) as `${number}`)
    : undefined;

  // Write contract hook
  const { writeContract, data: txHash, isPending: isWriting, error: writeError } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read task status from chain (after deposit)
  const { data: onChainTask } = useReadContract({
    address: STOVERA_ESCROW_ADDRESS,
    abi: STOVERA_ESCROW_ABI,
    functionName: "getTask",
    args: taskId ? [taskId] : undefined,
    query: { enabled: !!taskId && step === "success" },
  });

  useEffect(() => {
    if (isTxSuccess && taskId && selectedTask && address && agent) {
      setStep("success");
      // Persist to Supabase
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskIdBytes32: taskId,
          agentId: agent.id,
          userAddress: address,
          operatorAddress: DEFAULT_OPERATOR,
          depositEth: formatEther(depositAmount ?? 0n),
          txHashDeposit: txHash ?? null,
        }),
      }).catch((e) => console.error("Failed to save task to DB:", e));
    }
  }, [isTxSuccess]);

  useEffect(() => {
    if (writeError) {
      setErrorMsg(writeError.message.slice(0, 100));
      setStep("error");
    }
  }, [writeError]);

  const handleDeposit = () => {
    if (!address || !selectedTask || !depositAmount) return;
    const id = generateTaskId(agent.id, address);
    setTaskId(id);
    setStep("pending");
    setErrorMsg("");

    writeContract({
      address: STOVERA_ESCROW_ADDRESS,
      abi: STOVERA_ESCROW_ABI,
      functionName: "depositForTask",
      args: [id, DEFAULT_OPERATOR],
      value: depositAmount,
    });
  };

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

  const refundEstimate = selectedTask && depositAmount
    ? formatEther(depositAmount - parseEther(selectedTask.estimateLow as `${number}`))
    : null;

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
                <span style={{ fontSize: 8 }}>⬡</span> ERC-8004 IDENTITY
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(28px, 4vw, 52px)", color: "#F5F0E8", letterSpacing: "0.02em", lineHeight: 1.1, marginBottom: 10 }}>
              {agent.name}
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#6B7B6B", lineHeight: 1.6, maxWidth: 520, marginBottom: 20 }}>
              {agent.tagline}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "flex" }}>{STARS(agent.score)}</span>
                <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 22, color: "#C8A84B" }}>{agent.score}</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B" }}>({agent.reviews} reviews)</span>
              </div>
              <div style={{ width: 1, height: 20, background: "rgba(200,168,75,0.2)" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#C8A84B" }}>{agent.priceLabel}</span>
            </div>
          </div>

          {/* Price card */}
          <div style={{ background: "rgba(245,240,232,0.05)", border: "1px solid rgba(200,168,75,0.3)", padding: "24px", minWidth: 260 }}>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.2em", color: "#6B7B6B", textTransform: "uppercase", marginBottom: 12 }}>Pricing Model</p>
            <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 28, color: "#C8A84B", lineHeight: 1, marginBottom: 4 }}>{agent.priceLabel}</p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", lineHeight: 1.6, marginBottom: 16 }}>
              Billed by actual compute time.<br />
              You deposit {agent.depositMultiplier}× estimate upfront.<br />
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

          {/* ERC-8004 Identity Card */}
          <div style={{ background: "#0F1F0F", border: "1px solid rgba(74,222,128,0.3)" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(74,222,128,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#4ade80", fontSize: 14 }}>⬡</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.2em", color: "#4ade80", textTransform: "uppercase" }}>ERC-8004 On-Chain Identity</span>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.15em", color: "#6B7B6B", marginBottom: 4, textTransform: "uppercase" }}>Global Agent ID</p>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#4ade80", wordBreak: "break-all", lineHeight: 1.6 }}>{agent.erc8004Id}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Chain</p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#F5F0E8" }}>Base Mainnet</p>
                </div>
                <div>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Standard</p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#F5F0E8" }}>ERC-8004</p>
                </div>
                <div>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Reputation</p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#C8A84B" }}>{agent.score} / 5.0</p>
                </div>
                <div>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Feedback</p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#F5F0E8" }}>{agent.reviews} reviews</p>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, letterSpacing: "0.12em", color: "#6B7B6B", marginBottom: 3, textTransform: "uppercase" }}>Operator</p>
                  <EnsName address="0x88E6Da13Ab4699566b7ED412dEce223614eC38C6" showAvatar style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#F5F0E8" }} />
                </div>
              </div>
              <div style={{ padding: "8px 10px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#4ade80", lineHeight: 1.6 }}>
                  Identity, reputation, and validation data stored on-chain per ERC-8004. Feedback is immutable and verifiable by anyone.
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
                    onClick={() => { setSelectedTask(task); setStep("idle"); setTaskId(null); }}
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
                      ~{fmtEth(task.estimateLow)} – {fmtEth(task.estimateHigh)}
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
                <CostRow label="Min cost" value={`~${fmtEth(selectedTask.estimateLow)}`} />
                <CostRow label="Max cost" value={`~${fmtEth(selectedTask.estimateHigh)}`} />
                <div style={{ height: 1, background: "rgba(200,168,75,0.2)", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", letterSpacing: "0.1em" }}>
                    DEPOSIT ({agent.depositMultiplier}× max)
                  </span>
                  <span style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 20, color: "#C8A84B" }}>
                    {depositAmount ? formatEther(depositAmount) : "—"} ETH
                  </span>
                </div>
                <div style={{ padding: "8px 10px", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#4ade80", lineHeight: 1.6 }}>
                    ↩ Up to ~{refundEstimate} ETH refunded after task completes (actual cost deducted)
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
                        Deposit <strong>{depositAmount ? formatEther(depositAmount) : "—"} ETH</strong> on Base Mainnet. Actual cost deducted — remainder refunded automatically.
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

                {(step === "pending" || isWriting || isConfirming) && (
                  <div style={{ padding: "16px", background: "rgba(200,168,75,0.06)", border: "1px solid rgba(200,168,75,0.3)", textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 14, color: "#C8A84B", marginBottom: 6 }}>
                      {isWriting ? "CONFIRM IN WALLET..." : "CONFIRMING ON CHAIN..."}
                    </p>
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B" }}>
                      {txHash ? `tx: ${txHash.slice(0, 18)}...` : "Waiting for signature"}
                    </p>
                  </div>
                )}

                {step === "success" && (
                  <div style={{ padding: "16px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 16, color: "#4ade80", marginBottom: 6 }}>TASK QUEUED ✓</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7B6B", lineHeight: 1.7, marginBottom: 10 }}>
                      Deposit confirmed on Base Mainnet.<br />
                      Refund sent automatically when task completes.
                    </p>
                    {txHash && (
                      <a
                        href={`https://basescan.org/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#C8A84B", letterSpacing: "0.1em" }}
                      >
                        VIEW ON BASESCAN →
                      </a>
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
