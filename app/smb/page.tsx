// app/smb/page.tsx — rroy T2 SMB Share Scanner
// CR AudioViz AI · EIN 39-3646201 · May 2026
"use client";
import { useState } from "react";

export default function SmbScanner() {
  const [share, setShare] = useState(""); const [user, setUser] = useState("");
  const [result, setResult] = useState<any>(null); const [loading, setLoading] = useState(false);

  async function scan() {
    if (!share.trim()) return;
    setLoading(true); setResult(null);
    try {
      const r = await fetch("/api/scan", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ smbShare: share, smbUser: user, tier: "t2", mode: "dry-run" })
      });
      setResult(await r.json());
    } catch { setResult({ error: "Scan failed." }); }
    setLoading(false);
  }

  return (
    <div style={{minHeight:"100vh",background:"#040912",color:"#e2e8f0",fontFamily:"system-ui"}}>
      <nav style={{background:"#1E3A5F",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <a href="/" style={{color:"#9CA3AF",textDecoration:"none",fontSize:13}}>← rroy</a>
          <span style={{color:"#374151"}}>·</span>
          <span style={{fontWeight:700,color:"#00B4D8"}}>T2 SMB Scanner</span>
          <span style={{background:"rgba(0,180,216,0.1)",color:"#00B4D8",border:"1px solid rgba(0,180,216,0.2)",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700}}>🔨 Beta</span>
        </div>
        <a href="https://craudiovizai.com/auth/signup" style={{background:"#FF0800",color:"#fff",borderRadius:7,padding:"5px 14px",fontSize:12,fontWeight:700,textDecoration:"none"}}>Sign Up</a>
      </nav>
      <div style={{maxWidth:720,margin:"0 auto",padding:"40px 20px 80px"}}>
        <h1 style={{fontSize:24,fontWeight:900,color:"#fff",margin:"0 0 8px"}}>T2 — SMB Share Scanner</h1>
        <p style={{color:"#6B7280",fontSize:14,marginBottom:28}}>Deduplicate across Windows network shares, NAS devices, and SMB mounts.</p>
        <div style={{background:"#0F1F32",border:"1px solid rgba(0,180,216,0.12)",borderRadius:14,padding:24}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input value={share} onChange={e=>setShare(e.target.value)} placeholder="SMB share: \\192.168.1.141\media or smb://DeathStar/media"
              style={{background:"#172D48",border:"1px solid rgba(0,180,216,0.15)",borderRadius:8,padding:"11px 14px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"system-ui"}}/>
            <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Username (optional)"
              style={{background:"#172D48",border:"1px solid rgba(0,180,216,0.15)",borderRadius:8,padding:"11px 14px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"system-ui"}}/>
            <button onClick={scan} disabled={loading||!share.trim()}
              style={{background:loading||!share.trim()?"#0F1F32":"#1E3A5F",color:loading||!share.trim()?"#374151":"#00B4D8",border:"1px solid rgba(0,180,216,0.2)",borderRadius:8,padding:"11px",fontSize:14,fontWeight:700,cursor:loading||!share.trim()?"not-allowed":"pointer",fontFamily:"system-ui"}}>
              {loading?"Scanning...":"🔍 Scan SMB Share (Dry Run)"}
            </button>
          </div>
          {result && !result.error && (
            <div style={{marginTop:16,padding:"14px",background:"rgba(0,180,216,0.05)",border:"1px solid rgba(0,180,216,0.12)",borderRadius:10}}>
              <p style={{margin:"0 0 8px",fontWeight:700,color:"#00B4D8"}}>T2 Scan Results (dry-run)</p>
              <p style={{margin:"0 0 4px",fontSize:13}}>Files scanned: <strong>{result.scanned}</strong></p>
              <p style={{margin:"0 0 4px",fontSize:13}}>Duplicates found: <strong style={{color:"#FF0800"}}>{result.duplicates}</strong></p>
              <p style={{margin:"0 0 12px",fontSize:13}}>Space recoverable: <strong style={{color:"#FF0800"}}>{result.savings}</strong></p>
              {result.topDuplicates?.map((d:any,i:number)=>(
                <div key={i} style={{background:"#172D48",borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{d.name}</div>
                  <div style={{fontSize:11,color:"#6B7280",marginBottom:2}}>{d.path}</div>
                  <div style={{fontSize:11,color:"#374151"}}>{d.size} · {d.copies} copies · hash: {d.hash.slice(0,8)}...</div>
                </div>
              ))}
              <p style={{margin:"8px 0 0",fontSize:11,color:"#374151"}}>No files were deleted. Review above and confirm before deleting.</p>
            </div>
          )}
          {result?.error && <p style={{marginTop:12,fontSize:13,color:"#FF0800"}}>{result.error}</p>}
        </div>
        <div style={{marginTop:20,background:"#0F1F32",border:"1px solid rgba(0,180,216,0.06)",borderRadius:12,padding:16}}>
          <h3 style={{margin:"0 0 10px",fontSize:14,fontWeight:700,color:"#374151"}}>Home Lab Quick Targets</h3>
          {[["\\\\192.168.1.141\\media","Synology DeathStar · /media"],["\\\\192.168.1.141\\photos","Synology DeathStar · /photos"],["\\\\192.168.1.50\\downloads","Ubuntu Server · /downloads"]].map(([share,label])=>(
            <button key={label} onClick={()=>setShare(share.replace(/\\/g,"\\"))}
              style={{display:"block",width:"100%",background:"rgba(0,180,216,0.05)",border:"1px solid rgba(0,180,216,0.1)",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontFamily:"system-ui",marginBottom:6,textAlign:"left"}}>
              <span style={{fontSize:12,color:"#9CA3AF"}}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}