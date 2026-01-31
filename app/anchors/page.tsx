import PriceChart from "./PriceChart";

export default function AnchorsPage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 36, fontWeight: "bold" }}>Market Price Anchors</h1>

      <p style={{ marginTop: 8, color: "#aaa" }}>
        Reference livestock market prices for decision-making.
      </p>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>
          Finished Cattle (Live) — Sample Anchor
        </h2>

        <PriceChart />
      </section>
    </main>
  );
}

