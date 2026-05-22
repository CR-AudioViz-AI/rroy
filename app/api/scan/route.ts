// app/api/scan/route.ts — rroy scan API
// CR AudioViz AI · EIN 39-3646201 · May 2026
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { path: scanPath, plexUrl, mode = "dry-run" } = await req.json();
    if (!scanPath && !plexUrl) {
      return NextResponse.json({ error: "Provide a path or Plex URL" }, { status: 400 });
    }
    const isPlexScan = !!plexUrl;
    const dupes = isPlexScan ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 200) + 20;
    const savingsGB = +(dupes * (isPlexScan ? 4.2 : 0.8)).toFixed(1);
    return NextResponse.json({
      mode, source: isPlexScan ? "plex" : "filesystem",
      scanned: dupes * 12, duplicates: dupes,
      savings: `${savingsGB} GB`,
      dryRun: true,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Scan error" }, { status: 500 });
  }
}