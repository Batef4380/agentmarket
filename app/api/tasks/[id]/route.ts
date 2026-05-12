import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET /api/tasks/[id] — by task_id_bytes32
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = createServerClient();
  const { data, error } = await db
    .from("tasks")
    .select("*")
    .eq("task_id_bytes32", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ task: data });
}

// PATCH /api/tasks/[id] — update status (called by operator backend or webhook)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, actualCostSol, txHashComplete } = body;

    // Validate secret header to prevent unauthorized status changes
    const authHeader = req.headers.get("x-operator-secret");
    if (authHeader !== process.env.OPERATOR_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServerClient();
    const update: Record<string, unknown> = { status };
    if (actualCostSol !== undefined) update.actual_cost_sol = actualCostSol;
    if (txHashComplete) update.tx_hash_complete = txHashComplete;
    if (status === "completed" || status === "cancelled") {
      update.completed_at = new Date().toISOString();
    }

    const { data, error } = await db
      .from("tasks")
      .update(update)
      .eq("task_id_bytes32", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task: data });
  } catch (e) {
    console.error("PATCH /api/tasks/[id] error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
