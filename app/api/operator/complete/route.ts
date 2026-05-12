import { NextRequest, NextResponse } from "next/server";
import {
  Connection, Keypair, PublicKey,
  Transaction, TransactionInstruction, SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { createServerClient } from "@/lib/supabase";

const PROGRAM_ID  = new PublicKey("8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka");
const TASK_SEED   = Buffer.from("task");
const STATE_SEED  = Buffer.from("state");
// complete_task discriminator from IDL
const DISC = Buffer.from([109, 167, 192, 41, 129, 108, 220, 196]);

export async function POST(req: NextRequest) {
  // Auth check
  const secret = req.headers.get("x-operator-secret");
  if (secret !== process.env.OPERATOR_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { taskIdHex, actualCostLamports = 0 } = await req.json();
    if (!taskIdHex) return NextResponse.json({ error: "taskIdHex required" }, { status: 400 });

    // Load operator keypair
    const kpBs58 = process.env.OPERATOR_KEYPAIR_BS58;
    if (!kpBs58) return NextResponse.json({ error: "Operator keypair not configured" }, { status: 500 });
    const operator = Keypair.fromSecretKey(bs58.decode(kpBs58));

    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!, "confirmed");

    // task_id bytes
    const taskIdHexClean = taskIdHex.replace(/^0x/, "");
    const taskIdBytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      taskIdBytes[i] = parseInt(taskIdHexClean.slice(i * 2, i * 2 + 2), 16);
    }

    // Derive PDAs
    const [taskPDA]  = PublicKey.findProgramAddressSync([TASK_SEED, taskIdBytes], PROGRAM_ID);
    const [statePDA] = PublicKey.findProgramAddressSync([STATE_SEED], PROGRAM_ID);

    // Read task account to get user pubkey
    const taskInfo = await connection.getAccountInfo(taskPDA);
    if (!taskInfo) return NextResponse.json({ error: "Task account not found on-chain" }, { status: 404 });

    // TaskAccount layout (after 8 discriminator):
    // task_id[32] + user[32] + agent_operator[32] + deposit_lamports[8] + actual_cost[8] + status[1] + created_at[8] + bump[1]
    const taskData = taskInfo.data;
    const userPubkey = new PublicKey(taskData.slice(8 + 32, 8 + 32 + 32));

    // Build complete_task instruction data: disc(8) + _task_id(32) + actual_cost_lamports(8)
    const data = Buffer.alloc(8 + 32 + 8);
    DISC.copy(data, 0);
    Buffer.from(taskIdBytes).copy(data, 8);
    const cost = BigInt(actualCostLamports);
    data.writeUInt32LE(Number(cost & 0xFFFFFFFFn), 40);
    data.writeUInt32LE(Number((cost >> 32n) & 0xFFFFFFFFn), 44);

    const ix = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: taskPDA,                  isSigner: false, isWritable: true },
        { pubkey: statePDA,                 isSigner: false, isWritable: false },
        { pubkey: operator.publicKey,       isSigner: false, isWritable: true },  // agent_operator receives payment
        { pubkey: userPubkey,               isSigner: false, isWritable: true },  // user receives refund
        { pubkey: operator.publicKey,       isSigner: true,  isWritable: true },  // operator signer
        { pubkey: SystemProgram.programId,  isSigner: false, isWritable: false },
      ],
      data,
    });

    const tx = new Transaction().add(ix);
    const sig = await sendAndConfirmTransaction(connection, tx, [operator]);

    // Update DB status to completed
    const db = createServerClient();
    await db
      .from("tasks")
      .update({
        status: "completed",
        actual_cost_sol: (actualCostLamports / 1e9).toString(),
        tx_hash_complete: sig,
        completed_at: new Date().toISOString(),
      })
      .eq("task_id_bytes32", `0x${taskIdHexClean}`);

    return NextResponse.json({ success: true, sig, taskIdHex: taskIdHexClean });
  } catch (e) {
    console.error("complete_task error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
