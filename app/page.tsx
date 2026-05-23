"use client";
// app/page.tsx — rroy v2 — full dedup tool with mobile support
// CR AudioViz AI · EIN 39-3646201 · May 2026
import { useState } from "react";

export default function RroyHome() {
  const [tab,setTab]=useState<"filesystem"|"plex"|"smb">("plex");
  const [input,setInput]=useState(""); const [token,setToken]=useState("");
  const [result,setResult]=useState<any>(null); const [loading,setLoading]=useState(false);

  async function scan(){
    if(!input.trim())return; setLoading(true);setResult(null);
    const body: any = {mode:"dry-run"};
    if(tab==="plex"){body.plexUrl=input;body.plexToken=token;}
    else if(tab==="smb"){body.smbShare=input;body.tier="t2";}
    else{body.path=input;}
    try{
      const r=await fetch("/api/scan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      setResult(await r.json());
    }catch{setResult({error:"Scan failed."});}
    setLoading(false);
  }

  const presets=[
    {label:"Synology /media",  value:"\\\\192.168.1.141\\media",  tab:"smb" as const},
    {label:"Synology /photos", value:"\\\\192.168.1.141\\photos", tab:"smb" as const},
    {label:"Ubuntu /downloads",value:"/home/downloads",                 tab:"filesystem" as const},
    {label:"Plex (local)",     value:"http://192.168.1.50:32400",       tab:"plex" as const},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#040912",color:"#e2e8f0",fontFamily:"system-ui"}}>
      <nav style={{background:"#1E3A5F",padding:"0 16px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontWeight:900,color:"#FF0800",fontSize:18,fontStyle:"italic"}}>rroy</span>
          <span style={{color:"#374151",fontSize:11}}>dedup engine</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <a href="/docs" style={{color:"#6B7280",textDecoration:"none",fontSize:12}}>Docs</a>
          <a href="/smb" style={{color:"#6B7280",textDecoration:"none",fontSize:12}}>T2 SMB</a>
          <a href="https://craudiovizai.com/auth/signup" style={{background:"#FF0800",color:"#fff",borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:700,textDecoration:"none"}}>Sign Up</a>
        </div>
      </nav>

      <section style={{background:"linear-gradient(135deg,#1E3A5F,#040912)",padding:"52px 20px 44px",textAlign:"center"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <h1 style={{fontSize:"clamp(28px,5vw,52px)",fontWeight:900,color:"#fff",margin:"0 0 10px",lineHeight:1.0}}>
            <span style={{color:"#FF0800",fontStyle:"italic"}}>rroy</span>
          </h1>
          <p style={{fontSize:"clamp(14px,2vw,18px)",color:"rgba(255,255,255,0.7)",margin:"0 0 6px"}}>Universal deduplication. Plex · Filesystem · SMB.</p>
          <p style={{fontSize:12,color:"#374151"}}>CR AudioViz AI · EIN: 39-3646201</p>
        </div>
      </section>

      <div style={{maxWidth:720,margin:"0 auto",padding:"28px 16px 72px"}}>
        {/* Tier tabs */}
        <div style={{display:"flex",gap:6,marginBottom:20}}>
          {[["plex","🎬 Plex"],["filesystem","📁 Filesystem"],["smb","🖧 SMB/NAS"]].map(([t,l])=>(
            <button key={t} onClick={()=>{setTab(t as any);setInput("");setResult(null);}}
              style={{background:tab===t?"rgba(255,8,0,0.15)":"#0F1F32",color:tab===t?"#FF0800":"#6B7280",border:`1px solid ${tab===t?"rgba(255,8,0,0.3)":"rgba(255,255,255,0.07)"}`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontFamily:"system-ui",fontSize:13,fontWeight:600}}>
              {l}
            </button>
          ))}
        </div>

        {/* Quick presets */}
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {presets.map(p=>(
            <button key={p.label} onClick={()=>{setTab(p.tab);setInput(p.value);}}
              style={{background:"rgba(255,8,0,0.05)",color:"#6B7280",border:"1px solid rgba(255,8,0,0.1)",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontFamily:"system-ui",fontSize:11}}>
              {p.label}
            </button>
          ))}
        </div>

        <div style={{background:"#0F1F32",border:"1px solid rgba(255,8,0,0.12)",borderRadius:14,padding:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              placeholder={tab==="plex"?"Plex URL: http://192.168.1.50:32400":tab==="smb"?"SMB share: \\\\192.168.1.141\\media":"/path/to/scan"}
              style={{background:"#172D48",border:"1px solid rgba(255,8,0,0.15)",borderRadius:8,padding:"11px 13px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"system-ui"}}/>
            {tab==="plex"&&<input value={token} onChange={e=>setToken(e.target.value)} placeholder="Plex Token (optional)"
              style={{background:"#172D48",border:"1px solid rgba(255,8,0,0.1)",borderRadius:8,padding:"11px 13px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"system-ui"}}/>}
            <button onClick={scan} disabled={loading||!input.trim()}
              style={{background:loading||!input.trim()?"#0A1628":"#FF0800",color:loading||!input.trim()?"#374151":"#fff",border:"none",borderRadius:9,padding:"12px",fontSize:14,fontWeight:700,cursor:loading||!input.trim()?"not-allowed":"pointer",fontFamily:"system-ui"}}>
              {loading?"Scanning (dry-run)...":"🔍 Scan for Duplicates"}
            </button>
          </div>

          {result&&!result.error&&(
            <div style={{marginTop:16,padding:"14px",background:"rgba(255,8,0,0.05)",border:"1px solid rgba(255,8,0,0.12)",borderRadius:10}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                {[["Files scanned",result.scanned],["Duplicates",result.duplicates],["Space saved",result.savings]].map(([l,v])=>(
                  <div key={l as string} style={{textAlign:"center",background:"#172D48",borderRadius:8,padding:"10px 6px"}}>
                    <div style={{fontSize:18,fontWeight:900,color:"#FF0800"}}>{v}</div>
                    <div style={{fontSize:10,color:"#374151"}}>{l}</div>
                  </div>
                ))}
              </div>
              {result.topDuplicates?.map((d:any,i:number)=>(
                <div key={i} style={{background:"#172D48",borderRadius:8,padding:"9px 11px",marginBottom:7}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:2}}>{d.name}</div>
                  <div style={{fontSize:10,color:"#6B7280",marginBottom:2}}>{d.path}</div>
                  <div style={{fontSize:10,color:"#374151"}}>{d.size} · {d.copies} copies · {d.hash?.slice(0,8)}</div>
                </div>
              ))}
              <p style={{fontSize:10,color:"#374151",margin:"8px 0 0"}}>Dry-run only. No files deleted.</p>
            </div>
          )}
          {result?.error&&<p style={{marginTop:12,fontSize:12,color:"#FF0800"}}>{result.error}</p>}
        </div>

        <div style={{marginTop:20,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          {[["T1","Plex + Filesystem","Live — scan your media library and local drives","🎬"],
            ["T2","SMB / NAS","Beta — scan network shares and NAS devices","🖧"],
            ["T3","Enterprise","Coming — S3, Azure Blob, petabyte scale","☁️"]].map(([tier,name,desc,icon])=>(
            <div key={tier} style={{background:"#0F1F32",border:"1px solid rgba(255,8,0,0.08)",borderRadius:12,padding:"14px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <span style={{fontSize:18}}>{icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:"#FF0800"}}>Tier {tier}</span>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{name}</div>
              <div style={{fontSize:11,color:"#374151"}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}