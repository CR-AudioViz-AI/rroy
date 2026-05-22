"use client";
// app/page.tsx — rroy: Universal Deduplication Tool
// T1: Plex + Filesystem | T2: SMB/NAS | T3: Enterprise
// CR AudioViz AI · EIN 39-3646201 · May 2026
import { useState } from "react";

const TIERS = [
  { id:"t1", icon:"🎬", name:"Tier 1 — Media Library", sub:"Plex + Filesystem",
    desc:"Find duplicate movies, shows, and music across your Plex library and NAS.", color:"#00B4D8",
    features:["Plex API integration","NAS/SMB scanning","Bitrate comparison","Safe delete","Free space estimate"],
    status:"✅ Live" },
  { id:"t2", icon:"🖥️", name:"Tier 2 — Network Shares", sub:"SMB / NFS / Cloud",
    desc:"Deduplicate across SMB shares, NFS mounts, and cloud storage.", color:"#1E3A5F",
    features:["SMB share support","Cross-drive dedup","Hash comparison","Dry-run mode","Scheduled scans"],
    status:"🔨 In Development" },
  { id:"t3", icon:"🏢", name:"Tier 3 — Enterprise", sub:"Multi-site / S3 / Scale",
    desc:"Enterprise deduplication across S3, Azure Blob, and large-scale storage.", color:"#FF0800",
    features:["S3 / Azure Blob","Petabyte scale","API access","Audit trail","SLA support"],
    status:"🗺️ On Roadmap" },
];

export default function RroyHome() {
  const [path, setPath] = useState("");
  const [plexUrl, setPlexUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  async function scan() {
    if (!path && !plexUrl) return;
    setScanning(true); setResults(null);
    try {
      const r = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, plexUrl, mode: "dry-run" }),
      });
      setResults(await r.json());
    } catch { setResults({ error: "Scan failed." }); }
    setScanning(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#040912", color:"#e2e8f0", fontFamily:"system-ui" }}>
      <nav style={{ background:"#1E3A5F", padding:"0 20px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontWeight:900, color:"#FF0800", fontSize:18, fontStyle:"italic" }}>rroy</span>
          <span style={{ color:"#374151", fontSize:11 }}>Universal Dedup · EIN 39-3646201</span>
        </div>
        <a href="https://craudiovizai.com/auth/signup" style={{ background:"#FF0800", color:"#fff", borderRadius:7, padding:"5px 14px", fontSize:12, fontWeight:700, textDecoration:"none" }}>Sign Up</a>
      </nav>

      <section style={{ background:"linear-gradient(135deg,#1E3A5F,#040912)", padding:"64px 24px 56px", textAlign:"center" }}>
        <h1 style={{ fontSize:"clamp(28px,5vw,54px)", fontWeight:900, color:"#fff", margin:"0 0 14px", lineHeight:1.05 }}>
          <span style={{ color:"#FF0800", fontStyle:"italic" }}>rroy</span><br />Universal Deduplication
        </h1>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:15, lineHeight:1.65, margin:"0 0 32px", maxWidth:500, marginLeft:"auto", marginRight:"auto" }}>
          Find and remove duplicate files across Plex, NAS, SMB shares, and cloud storage. Save terabytes.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="#scan" style={{ background:"#FF0800", color:"#fff", borderRadius:12, padding:"13px 28px", fontSize:15, fontWeight:800, textDecoration:"none" }}>Start Scanning</a>
          <a href="/docs" style={{ background:"rgba(0,180,216,0.15)", color:"#00B4D8", border:"1px solid rgba(0,180,216,0.3)", borderRadius:12, padding:"13px 28px", fontSize:15, fontWeight:700, textDecoration:"none" }}>Docs</a>
        </div>
      </section>

      <section id="scan" style={{ maxWidth:700, margin:"0 auto", padding:"40px 20px 0" }}>
        <div style={{ background:"#0F1F32", border:"1px solid rgba(0,180,216,0.12)", borderRadius:16, padding:"24px 28px" }}>
          <h2 style={{ margin:"0 0 16px", fontSize:16, fontWeight:800, color:"#fff" }}>Quick Scan (Dry Run)</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <input value={path} onChange={e=>setPath(e.target.value)} placeholder="/mnt/synology/media or /media/movies"
              style={{ background:"#172D48", border:"1px solid rgba(0,180,216,0.15)", borderRadius:8, padding:"11px 14px", color:"#e2e8f0", fontSize:13, outline:"none", fontFamily:"system-ui" }} />
            <input value={plexUrl} onChange={e=>setPlexUrl(e.target.value)} placeholder="Plex URL (optional): http://192.168.1.50:32400"
              style={{ background:"#172D48", border:"1px solid rgba(0,180,216,0.15)", borderRadius:8, padding:"11px 14px", color:"#e2e8f0", fontSize:13, outline:"none", fontFamily:"system-ui" }} />
            <button onClick={scan} disabled={scanning||(!path&&!plexUrl)}
              style={{ background:scanning||(!path&&!plexUrl)?"#0F1F32":"#1E3A5F", color:scanning||(!path&&!plexUrl)?"#374151":"#00B4D8", border:"1px solid rgba(0,180,216,0.2)", borderRadius:8, padding:"11px", fontSize:14, fontWeight:700, cursor:scanning||(!path&&!plexUrl)?"not-allowed":"pointer", fontFamily:"system-ui" }}>
              {scanning?"Scanning...":"🔍 Run Dry-Run Scan"}
            </button>
          </div>
          {results && (
            <div style={{ marginTop:16, padding:"14px 16px", background:results.error?"rgba(255,8,0,0.08)":"rgba(0,180,216,0.06)", border:`1px solid ${results.error?"rgba(255,8,0,0.2)":"rgba(0,180,216,0.15)"}`, borderRadius:10, fontSize:13, color:"#e2e8f0" }}>
              {results.error ? results.error : (
                <div>
                  <p style={{ margin:"0 0 6px", fontWeight:700, color:"#00B4D8" }}>Scan Results (dry-run — no files deleted)</p>
                  <p style={{ margin:"0 0 4px" }}>Files scanned: <strong>{results.scanned}</strong></p>
                  <p style={{ margin:"0 0 4px" }}>Duplicates found: <strong style={{ color:"#FF0800" }}>{results.duplicates}</strong></p>
                  <p style={{ margin:0 }}>Space recoverable: <strong style={{ color:"#FF0800" }}>{results.savings}</strong></p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section style={{ maxWidth:1060, margin:"0 auto", padding:"48px 20px 72px" }}>
        <h2 style={{ textAlign:"center", fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 32px" }}>Three tiers for every scale</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {TIERS.map(t => (
            <div key={t.id} style={{ background:"#0F1F32", border:`1px solid ${t.color}25`, borderRadius:18, padding:"24px 22px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontSize:32 }}>{t.icon}</span>
                <span style={{ background:`${t.color}18`, color:t.color, border:`1px solid ${t.color}30`, borderRadius:20, padding:"2px 10px", fontSize:10, fontWeight:700 }}>{t.status}</span>
              </div>
              <h3 style={{ margin:"0 0 3px", fontSize:15, fontWeight:800, color:t.color }}>{t.name}</h3>
              <p style={{ margin:"0 0 10px", fontSize:12, color:"#6B7280" }}>{t.sub}</p>
              <p style={{ margin:"0 0 16px", fontSize:13, color:"#9CA3AF", lineHeight:1.5 }}>{t.desc}</p>
              <ul style={{ listStyle:"none", margin:0, padding:0 }}>
                {t.features.map((f,i) => <li key={i} style={{ display:"flex", gap:7, fontSize:12, color:"#6B7280", marginBottom:6 }}><span style={{ color:t.color }}>✓</span>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop:"1px solid rgba(0,180,216,0.08)", padding:"14px 24px", textAlign:"center" }}>
        <p style={{ color:"#374151", fontSize:11, margin:0 }}>© 2026 CR AudioViz AI, LLC — EIN: 39-3646201 · Built by Roy Henderson</p>
      </footer>
    </div>
  );
}