import { createClient } from "@supabase/supabase-js";

// Browser client (anon key) — lazy singleton
let _supabase: ReturnType<typeof createClient> | null = null;
export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

// Server-side client with service role (for API routes that need to bypass RLS)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type TaskRow = {
  id: string;
  task_id_bytes32: string;
  agent_id: string;
  user_address: string;
  operator_address: string;
  deposit_sol: string;
  actual_cost_sol: string | null;
  status: "pending" | "executing" | "completed" | "cancelled";
  tx_hash_deposit: string | null;
  tx_hash_complete: string | null;
  created_at: string;
  completed_at: string | null;
};

export type AgentRow = {
  id: string;
  name: string;
  description: string;
  long_description: string | null;
  category: string;
  price_label: string;
  deposit_multiplier: number;
  operator_address: string;
  status: "verified" | "pending" | "rejected";
  submitter_address: string | null;
  trust_score: number;
  created_at: string;
};

export type ReviewRow = {
  id: string;
  agent_id: string;
  user_address: string;
  task_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};
