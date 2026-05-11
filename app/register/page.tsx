"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import AppNav from "@/components/app/AppNav";
import Link from "next/link";

const CATEGORIES = ["DeFi", "Research", "Analytics", "Development", "Security", "DePIN"];

const INPUT_STYLE = {
  width: "100%",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 12,
  color: "#1A2E1A",
  background: "#fff",
  border: "2px solid #1A2E1A",
  padding: "10px 14px",
  outline: "none",
  boxSizing: "border-box" as const,
};

const LABEL_STYLE = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 9,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "#6B7B6B",
  display: "block",
  marginBottom: 6,
};

const ERROR_STYLE = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 9,
  color: "#ef4444",
  marginTop: 4,
  letterSpacing: "0.05em",
};

export default function RegisterPage() {
  const { publicKey, connected } = useWallet();
  const address = publicKey?.toBase58() ?? undefined;
  const isConnected = connected;

  const [form, setForm] = useState({
    name: "",
    category: "Research",
    description: "",
    endpoint: "",
    price: "",
    capabilities: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [capTags, setCapTags] = useState<string[]>([]);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
    if (k === "capabilities") {
      setCapTags(v.split(",").map((c) => c.trim()).filter(Boolean));
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (form.description.trim().length < 20) e.description = "Min 20 characters";
    if (!form.endpoint.trim()) e.endpoint = "Required";
    else if (!form.endpoint.startsWith("http")) e.endpoint = "Must start with http(s)://";
    if (!form.price.trim()) e.price = "Required";
    else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) e.price = "Must be a positive number";
    if (capTags.length === 0) e.capabilities = "Add at least one capability";
    return e;
  };

  const handleSubmit = () => {
    if (!isConnected) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const agent = {
      id: `user_${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      endpoint: form.endpoint.trim(),
      price: parseFloat(form.price).toString(),
      capabilities: capTags,
      notes: form.notes.trim(),
      submittedBy: address,
      submittedAt: new Date().toISOString(),
      status: "pending",
      score: 0,
      reviews: 0,
    };

    const existing = JSON.parse(localStorage.getItem("stovera_pool") || "[]");
    existing.push(agent);
    localStorage.setItem("stovera_pool", JSON.stringify(existing));
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", paddingTop: 60 }}>
      <AppNav />

      {/* Hero */}
      <div style={{ background: "#0F1F0F", borderBottom: "1px solid rgba(200,168,75,0.3)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.3em", color: "#C8A84B", textTransform: "uppercase", marginBottom: 10 }}>
            Agent Submission
          </p>
          <h1 style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", color: "#F5F0E8", letterSpacing: "0.02em", marginBottom: 12 }}>
            REGISTER YOUR AGENT
          </h1>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#6B7B6B", lineHeight: 1.7, maxWidth: 560 }}>
            Submit your AI agent for listing on Stovera. It will enter the Verify Pool where community verifiers review and approve it before going live on the market.
          </p>

          {/* Flow steps */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 24, flexWrap: "wrap" }}>
            {["Submit Form", "Verify Pool", "Verifier Review", "Live on Market"].map((step, i, arr) => (
              <div key={step} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 22, height: 22, background: i === 0 ? "#C8A84B" : "rgba(200,168,75,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: i === 0 ? "#0F1F0F" : "#C8A84B",
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: i === 0 ? "#F5F0E8" : "#6B7B6B", letterSpacing: "0.05em" }}>
                    {step}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: "#C8A84B", margin: "0 12px", fontSize: 12 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>
        {!isConnected ? (
          <div style={{ border: "2px solid #C8A84B", padding: "40px 24px", textAlign: "center", background: "#fff" }}>
            <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 20, color: "#1A2E1A", marginBottom: 8 }}>
              Connect Your Wallet
            </p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#6B7B6B", letterSpacing: "0.05em" }}>
              You must connect a wallet to submit an agent.
            </p>
          </div>
        ) : submitted ? (
          <div style={{ border: "2px solid #4ade80", padding: "48px 24px", textAlign: "center", background: "#fff" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <p style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: 24, color: "#1A2E1A", marginBottom: 8 }}>
              AGENT SUBMITTED
            </p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#6B7B6B", letterSpacing: "0.05em", marginBottom: 28, lineHeight: 1.7 }}>
              Your agent is now in the Verify Pool. Community verifiers<br />will review it shortly. You&apos;ll be notified when it goes live.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link href="/verify" style={{
                fontFamily: "var(--font-anton), Anton, sans-serif",
                fontSize: 13, letterSpacing: "0.08em",
                color: "#F5F0E8", background: "#1A2E1A",
                textDecoration: "none", padding: "10px 24px",
                display: "inline-block",
              }}>
                VIEW VERIFY POOL →
              </Link>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", category: "Research", description: "", endpoint: "", price: "", capabilities: "", notes: "" }); setCapTags([]); }}
                style={{
                  fontFamily: "var(--font-anton), Anton, sans-serif",
                  fontSize: 13, letterSpacing: "0.08em",
                  color: "#1A2E1A", background: "transparent",
                  border: "2px solid #1A2E1A", padding: "10px 24px", cursor: "pointer",
                }}
              >
                SUBMIT ANOTHER
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Submitted by */}
            <div style={{ marginBottom: 24, padding: "10px 14px", background: "rgba(200,168,75,0.08)", border: "1px solid rgba(200,168,75,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#6B7B6B", letterSpacing: "0.1em" }}>
                SUBMITTING AS
              </span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#C8A84B" }}>
                {address?.slice(0, 10)}...{address?.slice(-6)}
              </span>
            </div>

            {/* Section: Basic Info */}
            <div style={{ background: "#fff", border: "2px solid #1A2E1A", marginBottom: 20 }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(26,46,26,0.15)", background: "#1A2E1A" }}>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.2em", color: "#C8A84B", textTransform: "uppercase" }}>
                  01 — Basic Information
                </p>
              </div>
              <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <label style={LABEL_STYLE}>Agent Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. YieldOptimizer.eth"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      style={{ ...INPUT_STYLE, borderColor: errors.name ? "#ef4444" : "#1A2E1A" }}
                    />
                    {errors.name && <p style={ERROR_STYLE}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      style={{ ...INPUT_STYLE, cursor: "pointer" }}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={LABEL_STYLE}>Description * <span style={{ color: "#6B7B6B", fontWeight: "normal" }}>(min 20 chars)</span></label>
                  <textarea
                    placeholder="What does your agent do? What problems does it solve?"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={4}
                    style={{ ...INPUT_STYLE, resize: "vertical", borderColor: errors.description ? "#ef4444" : "#1A2E1A" }}
                  />
                  {errors.description && <p style={ERROR_STYLE}>{errors.description}</p>}
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", marginTop: 4 }}>
                    {form.description.length} chars
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Technical */}
            <div style={{ background: "#fff", border: "2px solid #1A2E1A", marginBottom: 20 }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(26,46,26,0.15)", background: "#1A2E1A" }}>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.2em", color: "#C8A84B", textTransform: "uppercase" }}>
                  02 — Technical Details
                </p>
              </div>
              <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={LABEL_STYLE}>Agent Endpoint URL *</label>
                  <input
                    type="url"
                    placeholder="https://api.youragent.xyz/v1"
                    value={form.endpoint}
                    onChange={(e) => set("endpoint", e.target.value)}
                    style={{ ...INPUT_STYLE, borderColor: errors.endpoint ? "#ef4444" : "#1A2E1A" }}
                  />
                  {errors.endpoint && <p style={ERROR_STYLE}>{errors.endpoint}</p>}
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", marginTop: 4 }}>
                    The API endpoint users will call to run your agent
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <label style={LABEL_STYLE}>Price per Task (SOL) *</label>
                    <input
                      type="number"
                      placeholder="0.001"
                      step="0.0001"
                      min="0"
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      style={{ ...INPUT_STYLE, borderColor: errors.price ? "#ef4444" : "#1A2E1A" }}
                    />
                    {errors.price && <p style={ERROR_STYLE}>{errors.price}</p>}
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Capabilities * <span style={{ color: "#6B7B6B" }}>(comma-separated)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. DeFi Analysis, Reporting"
                      value={form.capabilities}
                      onChange={(e) => set("capabilities", e.target.value)}
                      style={{ ...INPUT_STYLE, borderColor: errors.capabilities ? "#ef4444" : "#1A2E1A" }}
                    />
                    {errors.capabilities && <p style={ERROR_STYLE}>{errors.capabilities}</p>}
                  </div>
                </div>
                {capTags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {capTags.map((tag) => (
                      <span key={tag} style={{
                        fontFamily: "JetBrains Mono, monospace", fontSize: 9,
                        letterSpacing: "0.05em", color: "#1A2E1A",
                        border: "1px solid rgba(26,46,26,0.4)", padding: "3px 8px",
                        background: "rgba(26,46,26,0.05)",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section: Notes */}
            <div style={{ background: "#fff", border: "2px solid #1A2E1A", marginBottom: 32 }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(26,46,26,0.15)", background: "#1A2E1A" }}>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.2em", color: "#C8A84B", textTransform: "uppercase" }}>
                  03 — Notes for Verifiers <span style={{ color: "#6B7B6B", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </p>
              </div>
              <div style={{ padding: "24px 20px" }}>
                <textarea
                  placeholder="Any additional context for verifiers — audit reports, GitHub links, documentation..."
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  style={{ ...INPUT_STYLE, resize: "vertical" }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                fontFamily: "var(--font-anton), Anton, sans-serif",
                fontSize: 15,
                letterSpacing: "0.1em",
                color: "#F5F0E8",
                background: "#1A2E1A",
                border: "none",
                padding: "16px 0",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#C8A84B")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1A2E1A")}
            >
              SUBMIT TO VERIFY POOL →
            </button>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#6B7B6B", textAlign: "center", marginTop: 12, letterSpacing: "0.1em" }}>
              By submitting you agree that your agent endpoint is functional and does not violate Stovera guidelines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
