import { NextResponse } from "next/server";

const AUTH_URL = process.env.ORBITPORT_AUTH_URL ?? "https://dev-1usujmbby8627ni8.us.auth0.com";
const API_URL = process.env.ORBITPORT_API_URL ?? "https://op.spacecomputer.io";
const CLIENT_ID = process.env.ORBITPORT_CLIENT_ID;
const CLIENT_SECRET = process.env.ORBITPORT_CLIENT_SECRET;

// SpaceComputer public IPFS beacon
const IPNS = "k2k4r8lvomw737sajfnpav0dpeernugnryng50uheyk1k39lursmn09f";
const IPFS_GATEWAYS = [
  `https://ipfs.io/ipns/${IPNS}`,
  `https://dweb.link/ipns/${IPNS}`,
  `https://cloudflare-ipfs.com/ipns/${IPNS}`,
];

async function fetchFromOrbitport(): Promise<{
  values: string[];
  source: string;
  signature: string | null;
  sequence: number | null;
}> {
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error("No Orbitport credentials");

  const authRes = await fetch(`${AUTH_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: `${API_URL}/api`,
      grant_type: "client_credentials",
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!authRes.ok) throw new Error(`Auth failed: ${authRes.status}`);
  const { access_token } = await authRes.json();

  const res = await fetch(`${API_URL}/api/v1/services/trng`, {
    headers: { Authorization: `Bearer ${access_token}` },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`TRNG failed: ${res.status}`);
  const data = await res.json();

  // SpaceComputer response: { service, source, data: "0x...", signature }
  const hexValue: string = data.data ?? data.value ?? "";
  return {
    values: [hexValue],
    source: data.source ?? "cosmic/aptos_orbital",
    signature: data.signature ?? null,
    sequence: data.sequence ?? null,
  };
}

async function fetchFromIPFS(): Promise<{
  values: string[];
  source: string;
  signature: string | null;
  sequence: number | null;
}> {
  for (const url of IPFS_GATEWAYS) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const json = await res.json();
      const ctrng: string[] = json.data?.ctrng ?? [];
      if (ctrng.length === 0) continue;
      return {
        values: ctrng,
        source: "ipfs_beacon",
        signature: json.data?.signature ?? null,
        sequence: json.data?.sequence ?? null,
      };
    } catch {
      continue;
    }
  }
  throw new Error("All IPFS gateways failed");
}

export async function GET() {
  // Priority 1: Authenticated Orbitport API (real satellite cTRNG)
  try {
    const result = await fetchFromOrbitport();
    return NextResponse.json({ ...result, live: true, via: "orbitport_api" });
  } catch (e) {
    console.log("[cTRNG] Orbitport API unavailable:", (e as Error).message);
  }

  // Priority 2: Public IPFS beacon
  try {
    const result = await fetchFromIPFS();
    return NextResponse.json({ ...result, live: true, via: "ipfs_beacon" });
  } catch (e) {
    console.log("[cTRNG] IPFS beacon unavailable:", (e as Error).message);
  }

  // Priority 3: Date-seeded deterministic fallback (changes daily)
  const d = new Date();
  const n = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const seed1 = ((n * 2654435761) >>> 0).toString(16).padStart(8, "0");
  const seed2 = ((n * 40503 + 7) >>> 0).toString(16).padStart(8, "0");
  const seed3 = ((n * 1664525 + 1013904223) >>> 0).toString(16).padStart(8, "0");

  return NextResponse.json({
    values: [
      seed1.repeat(8),
      seed2.repeat(8),
      seed3.repeat(8),
    ],
    source: "date_seeded",
    signature: null,
    sequence: null,
    live: false,
    via: "fallback",
  });
}
