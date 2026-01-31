import PriceChart, {
  computeLatest,
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
      {sub && (
        <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function AnchorsPage() {
  const stats = computeLatest(SAMPLE_FINISHED_CATTLE_LIVE);

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
          <h1
            style={{
              fontSize: 36,
              fontWeight: 900,
              margin: 0,
            }}
          >
            Market Price Anchors
          </h1>
          <p style={{ marginTop: 8, color: "#aaa" }}>
            Standalone reference guide — context prices, not forecasts.
          </p>
        </div>

        <div style={{ color: "#888", fontSize: 13, marginTop: 10 }}>
          Last updated:{" "}
          <b style={{ color: "white" }}>{stats.lastUpdated}</b>
        </div>
      </header>

      {/* Series Info */}
      <section style={{ marginTop: 18 }}>
        <div style={{ color: "#bbb", fontSize: 14 }}>
          <b>Series:</b> Finished Cattle (Live) &nbsp;•&nbsp;
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
          <Card
            label="LOW"
            value={`$${stats.low} / cwt`}
            sub="Conservative reference"
          />
          <Card
            label="AVERAGE"
            value={`$${stats.avg} / cwt`}
            sub="Typical recent range"
          />
          <Card
            label="HIGH"
            value={`$${stats.high} / cwt`}
            sub="Upper recent range"
          />
        </div>

        {/* Chart */}
        <div style={{ marginTop: 16 }}>
          <PriceChart points={SAMPLE_FINISHED_CATTLE_LIVE} />
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
          <summary
            style={{
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Source & Methodology
          </summary>

          <div
            style={{
              marginTop: 12,
              color: "#bbb",
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            <p style={{ marginTop: 0 }}>
              <b>Purpose:</b> This page provides reference price anchors to help
              producers, processors, and buyers sanity-check assumptions. These
              values are informational only and are not forecasts, bids, or
              financial advice.
            </p>

            <p>
              <b>Definitions:</b> “Low / Average / High” represent simplified
              recent market ranges for comparable categories. In future phases,
              these will be calculated directly from USDA AMS report rows and
              stored historically.
            </p>

            <p>
              <b>Units:</b> $/cwt = dollars per hundredweight. “Live” pricing
              refers to live-weight transactions (not dressed).
            </p>

            <p style={{ marginBottom: 0 }}>
              <b>Source:</b> USDA Agricultural Marketing Service (AMS). Demo data
              shown until scheduled report ingestion is implemented.
            </p>
          </div>
        </details>
      </section>
    </main>
  );
}
