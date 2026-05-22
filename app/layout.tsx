// app/layout.tsx — rroy
// CR AudioViz AI · EIN 39-3646201 · May 2026
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "rroy — Universal Deduplication | CR AudioViz AI",
  description: "Find and remove duplicate files across Plex, NAS, and cloud storage. CR AudioViz AI, EIN 39-3646201.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  );
}
