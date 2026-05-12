import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { agentId, userAddress, taskId, rating, comment, txHash } = await req.json();

    if (!agentId || !userAddress || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = createServerClient();
    const { data, error } = await db
      .from("reviews")
      .insert({
        agent_id: agentId,
        user_address: userAddress,
        task_id: null,
        rating,
        comment: comment ?? null,
        tx_hash: txHash ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ review: data }, { status: 201 });
  } catch (e) {
    console.error("POST /api/reviews error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get("agentId");
  const summary = req.nextUrl.searchParams.get("summary");
  const db = createServerClient();

  // ?summary=1 → return { agentId: { avg, count } } for all agents
  if (summary === "1") {
    const { data, error } = await db.from("reviews").select("agent_id, rating");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const map: Record<string, { total: number; count: number }> = {};
    for (const r of data ?? []) {
      if (!map[r.agent_id]) map[r.agent_id] = { total: 0, count: 0 };
      map[r.agent_id].total += r.rating;
      map[r.agent_id].count += 1;
    }
    const result: Record<string, { avg: number; count: number }> = {};
    for (const [id, v] of Object.entries(map)) {
      result[id] = { avg: Math.round((v.total / v.count) * 10) / 10, count: v.count };
    }
    return NextResponse.json({ summary: result });
  }

  const userAddress = req.nextUrl.searchParams.get("userAddress");

  if (userAddress) {
    const { data, error } = await db
      .from("reviews")
      .select("*")
      .eq("user_address", userAddress)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ reviews: data });
  }

  if (!agentId) return NextResponse.json({ error: "agentId or userAddress required" }, { status: 400 });

  const { data, error } = await db
    .from("reviews")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data });
}
