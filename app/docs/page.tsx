// app/docs/page.tsx — rroy Documentation
// CR AudioViz AI · EIN 39-3646201 · May 2026

const SECTIONS = [
  {
    title: "Quick Start",
    content: `rroy works in three steps:

1. Enter your scan path or Plex server URL
2. Run a dry-run scan (no files deleted)
3. Review results and confirm deletion

All deletions require explicit confirmation. rroy never auto-deletes.`,
  },
  {
    title: "Tier 1: Plex + Filesystem (Live)",
    content: `Scan your Plex media library for duplicates.

**Plex URL format:** http://192.168.1.50:32400
**Plex Token:** Found in Plex settings → Account → Authorized Devices

**Filesystem scan:** Enter any local or mounted path:
- /mnt/synology/media
- /media/movies
- /home/user/downloads

rroy compares files by MD5 hash, not just filename. Catches renamed duplicates.`,
  },
  {
    title: "Tier 2: SMB / NAS Shares (Coming Soon)",
    content: `Scan Windows network shares and NAS devices.

**Supported:** SMB/CIFS, NFS, WebDAV
**Coming:** Scheduled scans, email reports, automatic tagging

**Synology DeathStar:** Connect via smb://192.168.1.141/media`,
  },
  {
    title: "Tier 3: Enterprise (Roadmap)",
    content: `Large-scale deduplication for enterprises.

- S3, Azure Blob, GCS support
- Petabyte-scale scanning
- REST API for integration
- Audit trail and compliance reports
- SLA-backed support`,
  },
  {
    title: "Safety",
    content: `rroy is built with safety as the top priority:

- Dry-run mode shows what WOULD be deleted — nothing is removed without confirmation
- Deleted files go to trash first (not permanent delete) when possible
- Full scan logs are kept for 30 days
- Never deletes the last copy of any file`,
  },
];

export default function DocsPage() {
  return (
    <div style={{ minHeight:"100vh", background:"#040912", color:"#e2e8f0", fontFamily:"system-ui" }}>
      <nav style={{ background:"#1E3A5F", padding:"0 20px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <a href="/" style={{ fontWeight:900, color:"#FF0800", fontSize:16, fontStyle:"italic", textDecoration:"none" }}>rroy</a>
          <span style={{ color:"#374151", fontSize:12 }}>/ docs</span>
        </div>
        <a href="/" style={{ color:"#9CA3AF", fontSize:12, textDecoration:"none" }}>← Back</a>
      </nav>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"48px 24px 80px" }}>
        <h1 style={{ fontSize:"clamp(22px,4vw,36px)", fontWeight:900, color:"#fff", margin:"0 0 8px" }}>Documentation</h1>
        <p style={{ color:"#374151", fontSize:13, margin:"0 0 40px" }}>rroy v1.0 · CR AudioViz AI · EIN: 39-3646201</p>

        {SECTIONS.map(s => (
          <div key={s.title} style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#00B4D8", margin:"0 0 12px" }}>{s.title}</h2>
            <div style={{ background:"#0F1F32", border:"1px solid rgba(0,180,216,0.1)", borderRadius:12, padding:"18px 20px" }}>
              <pre style={{ margin:0, whiteSpace:"pre-wrap", fontSize:14, color:"#9CA3AF", lineHeight:1.7, fontFamily:"system-ui" }}>{s.content}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}