import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, category, description, price_label, capabilities, notes, submitter_address, operator_address } = body;

    if (!id || !name || !submitter_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = createServerClient();
    const insertPayload: Record<string, unknown> = {
      id,
      name,
      category: category ?? "General",
      description,
      price_label,
      submitter_address,
      operator_address: operator_address ?? submitter_address,
      status: "pending",
      trust_score: 0,
    };

    // Include capabilities/notes only if columns exist (added via migration)
    if (capabilities !== undefined) insertPayload.capabilities = capabilities ?? [];
    if (notes !== undefined && notes !== null) insertPayload.notes = notes;

    let { data, error } = await db.from("agents").insert(insertPayload).select().single();

    // If capabilities column doesn't exist, retry without it
    if (error?.message?.includes("capabilities") || error?.message?.includes("notes")) {
      delete insertPayload.capabilities;
      delete insertPayload.notes;
      ({ data, error } = await db.from("agents").insert(insertPayload).select().single());
    }

    if (error) {
      console.error("[register] Supabase insert error:", error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }
    return NextResponse.json({ agent: data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
