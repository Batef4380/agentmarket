import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// POST /api/tasks — called by frontend after depositForTask tx confirms
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      taskIdBytes32,
      agentId,
      userAddress,
      operatorAddress,
      depositSol,
      txHashDeposit,
    } = body;

    if (!taskIdBytes32 || !agentId || !userAddress || !operatorAddress || !depositSol) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = createServerClient();

    const { data, error } = await db
      .from("tasks")
      .insert({
        task_id_bytes32: taskIdBytes32,
        agent_id: agentId,
        user_address: userAddress,
        operator_address: operatorAddress,
        deposit_sol: depositSol,
        status: "pending",
        tx_hash_deposit: txHashDeposit ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task: data }, { status: 201 });
  } catch (e) {
    console.error("POST /api/tasks error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/tasks?userAddress=0x...
export async function GET(req: NextRequest) {
  const userAddress = req.nextUrl.searchParams.get("userAddress");
  if (!userAddress) {
    return NextResponse.json({ error: "userAddress required" }, { status: 400 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("tasks")
    .select("*")
    .eq("user_address", userAddress)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tasks: data });
}
