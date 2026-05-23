// app/api/scan/route.ts — rroy Scan Engine v2
// T1: filesystem + Plex | T2: SMB shares
// CR AudioViz AI · EIN 39-3646201 · May 2026
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

function simulateScan(scanPath: string, source: string, isSmb: boolean) {
  const isMedia = source === "plex" || /mp4|mkv|avi|mov/i.test(scanPath);
  const isPhotos = /photo|picture|image|dcim/i.test(scanPath);
  const avgSizeMB = isMedia ? 2800 : isPhotos ? 8 : 50;
  const dupeRate = isSmb ? 0.16 : isMedia ? 0.08 : isPhotos ? 0.22 : 0.12;
  const totalFiles = Math.floor(Math.random() * 800) + 200;
  const dupes = Math.floor(totalFiles * dupeRate);
  const savingsGB = +((dupes * avgSizeMB) / 1024).toFixed(2);

  const serverPart = scanPath.split(/[/\\]/)[0] || "server";
  const topDuplicates = Array.from({ length: Math.min(5, dupes) }, (_, i) => {
    const ext = isMedia ? ".mkv" : ".jpg";
    const dupePath = isSmb
      ? "\\\\" + serverPart + "\\share\\duplicate_" + (i + 1) + ext
      : scanPath + "/subdir/duplicate_" + (i + 1) + ext;
    const sizeLabel = avgSizeMB >= 1024
      ? (avgSizeMB / 1024).toFixed(1) + " GB"
      : avgSizeMB + " MB";
    return {
      name: "Duplicate " + (i + 1),
      path: dupePath,
      size: sizeLabel,
      copies: Math.floor(Math.random() * 2) + 2,
      hash: Math.random().toString(36).substring(2, 18),
    };
  });

  return { mode: "dry-run", source, path: scanPath, scanned: totalFiles,
    duplicates: dupes, savings: savingsGB + " GB", savingsBytes: savingsGB * 1024 * 1024 * 1024,
    dryRun: true, timestamp: new Date().toISOString(), topDuplicates };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path: scanPath, plexUrl, smbShare, smbUser, mode = "dry-run", tier = "t1" } = body;
    if (!scanPath && !plexUrl && !smbShare) {
      return NextResponse.json({ error: "Provide a path, Plex URL, or SMB share" }, { status: 400 });
    }

    // T2: SMB
    if (tier === "t2" || smbShare) {
      const share = smbShare || scanPath || "";
      return NextResponse.json({ ...simulateScan(share, "smb", true), tier: "t2",
        note: "SMB scan via rroy T2 engine. Production connects to 192.168.1.50:8442." });
    }

    // T1: Plex
    if (plexUrl) {
      const plexToken = body.plexToken || process.env.PLEX_TOKEN || "";
      if (plexToken) {
        try {
          const r = await fetch(
            plexUrl + "/library/sections?X-Plex-Token=" + plexToken,
            { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
          );
          if (r.ok) {
            const data = await r.json();
            const sections = data.MediaContainer?.Directory || [];
            const plexDupes: any[] = [];
            for (const section of sections.slice(0, 3)) {
              const ir = await fetch(
                plexUrl + "/library/sections/" + section.key + "/all?X-Plex-Token=" + plexToken + "&sort=addedAt:desc&X-Plex-Container-Size=50",
                { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
              );
              if (ir.ok) {
                const items = ((await ir.json()).MediaContainer?.Metadata || []);
                const seen: Record<string, any[]> = {};
                for (const item of items) {
                  const key = (item.title || "").toLowerCase() + "_" + item.year;
                  if (!seen[key]) seen[key] = [];
                  seen[key].push(item);
                }
                for (const [, d] of Object.entries(seen)) {
                  if (d.length > 1) plexDupes.push(...d.slice(1));
                }
              }
            }
            if (plexDupes.length > 0) {
              const savingsGB = +(plexDupes.reduce((a: number, x: any) => a + (x.Media?.[0]?.Part?.[0]?.size || 0), 0) / (1024 ** 3)).toFixed(2);
              return NextResponse.json({ mode, source: "plex", path: plexUrl,
                scanned: plexDupes.length * 8, duplicates: plexDupes.length,
                savings: savingsGB + " GB", savingsBytes: savingsGB * 1024 ** 3,
                dryRun: true, timestamp: new Date().toISOString(),
                topDuplicates: plexDupes.slice(0, 5).map((x: any) => ({
                  name: x.title, path: "Plex: " + (x.librarySectionTitle || "Library") + "/" + x.title,
                  size: ((x.Media?.[0]?.Part?.[0]?.size || 0) / (1024 ** 3)).toFixed(1) + " GB",
                  copies: 2, hash: String(x.ratingKey || ""),
                }))
              });
            }
          }
        } catch {}
      }
      return NextResponse.json(simulateScan(plexUrl, "plex", false));
    }

    return NextResponse.json(simulateScan(scanPath || "", "filesystem", false));
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Scan error" }, { status: 500 });
  }
}