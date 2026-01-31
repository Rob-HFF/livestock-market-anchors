"use client";

import { useMemo, useState } from "react";
import PriceChart from "./PriceChart";
import { computeLatest, SERIES, type MarketType, type SeriesId } from "./data";

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
  disabled,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        border: "1px solid #333",
        background: active ? "#222" : "transparent",
        color: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 700,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {children}
    </button>
  );
}

export default function AnchorsClient() {
  const [seriesId, setSeriesId] = useState<SeriesId>("finished_cattle");
  const [marketType, setMarketType] = useState<MarketType>("live");

  const series = useMemo(() => SERIES.find((s) => s.id === seriesId)!, [seriesId]);

  // If current marketType isn't supported by the selected series, force it to the first supported one
  const safeMarketType = useMemo(() => {
    if (series.supportedMarkets.includes(marketType)) return marketType;
    return series.supportedMarkets[0];
  }, [series, marketType]);

  const points = useMemo(() => series.getPoints(safeMarketType), [series, safeMarketType]);

  const stats = computeLatest(points);

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
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

      {/* Series selector */}
      <section style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ color: "#bbb", fontSize: 14, fontWeight: 700 }}>Series</div>
        <select
          value={seriesId}
          onChange={(e) => setSeriesId(e.target.value as SeriesId)}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #333",
            background: "#111",
            color: "white",
            minWidth: 240,
          }}
        >
          {SERIES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </section>

      {/* Market toggle */}
      <section style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <ToggleButton
            active={safeMarketType === "live"}
            onClick={() => setMarketType("live")}
            disabled={!series.supportedMarkets.includes("live")}
          >
            Live
          </ToggleButton>
          <ToggleButton
            active={safeMarketType === "dressed"}
            onClick={() => setMarketType("dressed")}
            disabled={!series.supportedMarkets.includes("dressed")}
          >
            Dressed
          </ToggleButton>
        </div>

        {!series.supportedMarkets.includes("dressed") ? (
          <div style={{ color: "#777", fontSize: 13, marginTop: 8 }}>
            Note: Dressed pricing isn’t available for this series yet (demo mode).
          </div>
        ) : null}
      </section>

      {/* Series info */}
      <section style={{ marginTop: 18 }}>
        <div style={{ color: "#bbb", fontSize: 14 }}>
          <b>Series:</b> {series.label} ({safeMarketType === "live" ? "Live" : "Dressed"}) &nbsp;•&nbsp;
          <b>Unit:</b> {series.unit} &nbsp;•&nbsp;
          <b>Market:</b> Reference
        </div>

        {/* Anchor cards */}
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
              <b>Purpose:</b> Reference price anchors to sanity-check assumptions.
              Informational only — not forecasts, bids, or financial advice.
            </p>

            <p>
              <b>Live vs Dressed:</b> Live = live-weight pricing. Dressed = carcass-weight pricing.
              Some series may not support dressed pricing yet (demo mode).
            </p>

            <p>
              <b>Units:</b> $/cwt = dollars per hundredweight.
            </p>

            <p style={{ marginBottom: 0 }}>
              <b>Source:</b> USDA AMS market reporting (to be wired in Phase 3).
              Demo data shown until ingestion is implemented.
            </p>
          </div>
        </details>
      </section>
    </main>
  );
}
