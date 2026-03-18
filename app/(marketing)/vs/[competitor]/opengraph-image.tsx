import { ImageResponse } from "next/og";
import { getCompetitor } from "@/lib/content/competitors";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic OG image template for /vs/[competitor] pages.
 * Template: dark card with TTYC name | "vs" | Competitor name.
 * Adding a new competitor automatically gets its own OG image —
 * no extra work needed beyond updating competitors.tsx.
 */
export default async function Image({
  params,
}: {
  params: { competitor: string };
}) {
  const data = getCompetitor(params.competitor);
  const competitorName = data?.name ?? params.competitor;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Subtle green glow behind center */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 300,
            background: "radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Logos row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* TTYC box */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Mic icon in green */}
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#22c55e">
              <path d="M12 1a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 9a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V20h3v2H8v-2h3v-2.07A8 8 0 0 1 4 10h2z" />
            </svg>
          </div>

          {/* VS badge */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.05em",
            }}
          >
            vs
          </div>

          {/* Competitor box */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "-0.02em",
              }}
            >
              {competitorName.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Talk To Your Computer
          <br />
          <span style={{ color: "rgba(255,255,255,0.45)" }}>vs {competitorName}</span>
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          talktoyour.computer
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
