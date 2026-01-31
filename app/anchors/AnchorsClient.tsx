"use client";

import { useMemo, useState } from "react";
import PriceChart, {
  computeLatest,
  SAMPLE_FINISHED_CATTLE_DRESSED,
  SAMPLE_FINISHED_CATTLE_LIVE,
} from "./PriceChart";

function Card({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #222",
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ color: "#aaa", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
        {value}
      </div>
      {sub ? (
        <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>{sub}</div>
      ) : null}
    </div>
  );
}

function ToggleButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        border: "1px solid #333",
        background: active ? "#222" : "transparent",
        color: "inherit",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}

export default function AnchorsClient() {
  const [marketType, setMarketType] = useState<"live" | "dressed">("live");

  const points = useMemo(() => {
    return marketType === "live"
      ? SAMPLE_FINISHED_CATTLE_LIVE
      : SAMPLE_FINISHED_CATTLE_DRESSED;
  }, [marketType]);

  const stats = computeLatest(points);

  const marketLabel = marketType === "live" ? "Live" : "Dressed";

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>
            Market Price Anchors
          </h1>
          <p style={{ marginTop: 8, color: "#aaa" }}>
            Standalone reference guide — context prices, not forecasts.
          </p>
        </div>

        <div style={{ color: "#888", fontSize: 13, marginTop: 10 }}>
          Last updated: <b style={{ color: "white" }}>{stats.lastUpdated}</b>
        </div>
      </header>

      {/* Market type toggle */}
      <section style={{ marginTop: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <ToggleButton active={marketType === "live"} onClick={() => setMarketType("live")}>
            Live
          </ToggleButton>
          <ToggleButton active={marketType === "dressed"} onClick={() => setMarketType("dressed")}>
            Dressed
          </ToggleButton>
        </div>
      </section>

      {/* Series Info */}
      <section style={{ marginTop: 18 }}>
        <div style={{ color: "#bbb", fontSize: 14 }}>
          <b>Series:</b> Finished Cattle ({marketLabel}) &nbsp;•&nbsp;
          <b>Unit:</b> $/cwt &nbsp;•&nbsp;
          <b>Market:</b> Reference
        </div>

        {/* Anchor Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginTop: 14,
          }}
        >
          <Card label="LOW" value={`$${stats.low} / cwt`} sub="Conservative reference" />
          <Card label="AVERAGE" value={`$${stats.avg} / cwt`} sub="Typical recent range" />
          <Card label="HIGH" value={`$${stats.high} / cwt`} sub="Upper recent range" />
        </div>

        {/* Chart */}
        <div style={{ marginTop: 16 }}>
          <PriceChart points={points} />
        </div>
      </section>

      {/* Methodology */}
      <section style={{ marginTop: 24 }}>
        <details
          style={{
            border: "1px solid #222",
            borderRadius: 16,
            padding: 16,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
            Source & Methodology
          </summary>

          <div style={{ marginTop: 12, color: "#bbb", lineHeight: 1.6, fontSize: 14 }}>
            <p style={{ marginTop: 0 }}>
              <b>Purpose:</b> Reference price anchors to sanity-check assumptions. Informational only — not forecasts,
              bids, or financial advice.
            </p>

            <p>
              <b>Live vs Dressed:</b> Live = live-weight pricing. Dressed = carcass-weight pricing. This toggle is
              demo-mode now; Phase 3 will compute both directly from USDA AMS report rows.
            </p>

            <p>
              <b>Units:</b> $/cwt = dollars per hundredweight.
            </p>

            <p style={{ marginBottom: 0 }}>
              <b>Source:</b> USDA AMS market reporting (to be wired in Phase 3). Demo data shown until ingestion is implemented.
            </p>
          </div>
        </details>
      </section>
    </main>
  );
}
