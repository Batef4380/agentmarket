import { NextResponse } from "next/server";
import { createOrbitportSDK } from "@spacecomputer-io/orbitport-sdk-ts";

const CLIENT_ID = process.env.ORBITPORT_CLIENT_ID;
const CLIENT_SECRET = process.env.ORBITPORT_CLIENT_SECRET;
const AUTH_URL = process.env.ORBITPORT_AUTH_URL ?? "https://dev-1usujmbby8627ni8.us.auth0.com";
const API_URL = process.env.ORBITPORT_API_URL ?? "https://op.spacecomputer.io";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySDK = Record<string, any>;

async function getRandom(sdk: AnySDK) {
  return sdk.ctrngService.random();
}

export async function GET() {
  // Priority 1: Authenticated Orbitport API (real satellite cTRNG)
  if (CLIENT_ID && CLIENT_SECRET) {
    try {
      const sdk = createOrbitportSDK({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        authDomain: AUTH_URL,
        apiUrl: API_URL,
      }) as AnySDK;
      const result = await getRandom(sdk);
      if (result.success && result.data) {
        const d = result.data as Record<string, unknown>;
        return NextResponse.json({
          values: [d.data as string],
          source: (d.service as string) ?? "cosmic/aptos_orbital",
          signature: (d.signature as string) ?? null,
          sequence: (d.sequence as number) ?? null,
          timestamp: (d.timestamp as string) ?? null,
          provider: (d.provider as string) ?? null,
          live: true,
          via: "orbitport_api",
        });
      }
    } catch (e) {
      console.log("[cTRNG] Orbitport API error:", (e as Error).message);
    }
  }

  // Priority 2: Public IPFS beacon via SDK (no credentials needed)
  try {
    const sdk = createOrbitportSDK({}) as AnySDK;
    const result = await getRandom(sdk);
    if (result.success && result.data) {
      const d = result.data as Record<string, unknown>;
      return NextResponse.json({
        values: [d.data as string],
        source: (d.service as string) ?? "ipfs-beacon",
        signature: (d.signature as string) ?? null,
        sequence: (d.sequence as number) ?? null,
        timestamp: (d.timestamp as string) ?? null,
        provider: (d.provider as string) ?? "ipfs-beacon",
        live: true,
        via: "ipfs_beacon",
      });
    }
  } catch (e) {
    console.log("[cTRNG] IPFS beacon error:", (e as Error).message);
  }

  // Priority 3: Date-seeded deterministic fallback (changes daily)
  const d = new Date();
  const n = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const s1 = ((n * 2654435761) >>> 0).toString(16).padStart(8, "0");
  const s2 = ((n * 40503 + 7) >>> 0).toString(16).padStart(8, "0");
  const s3 = ((n * 1664525 + 1013904223) >>> 0).toString(16).padStart(8, "0");

  return NextResponse.json({
    values: [s1.repeat(8), s2.repeat(8), s3.repeat(8)],
    source: "date_seeded",
    signature: null,
    sequence: null,
    timestamp: new Date().toISOString(),
    provider: "fallback",
    live: false,
    via: "fallback",
  });
}
