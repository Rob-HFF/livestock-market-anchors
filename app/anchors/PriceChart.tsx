"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";
import { useMemo, useState } from "react";

type Point = {
  date: string; // YYYY-MM-DD
  low: number;
  avg: number;
  high: number;
};

const SAMPLE: Point[] = [
  { date: "2025-01-05", low: 182, avg: 186, high: 190 },
  { date: "2025-02-02", low: 185, avg: 189, high: 193 },
  { date: "2025-03-02", low: 188, avg: 192, high: 196 },
  { date: "2025-04-06", low: 186, avg: 190, high: 194 },
  { date: "2025-05-04", low: 187, avg: 191, high: 195 },
  { date: "2025-06-01", low: 190, avg: 194, high: 198 },
];

function monthLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

export default function PriceChart() {
  const [range, setRange] = useState<"6m" | "12m" | "all">("all");

  const data = useMemo(() => {
    if (range === "all") return SAMPLE;
    const cutoffMonths = range === "6m" ? 6 : 12;
    const last = new Date(SAMPLE[SAMPLE.length - 1].date + "T00:00:00");
    const cutoff = new Date(last);
    cutoff.setMonth(cutoff.getMonth() - cutoffMonths);
    return SAMPLE.filter((p) => new Date(p.date + "T00:00:00") >= cutoff);
  }, [range]);

  const latest = data[data.length - 1];

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setRange("6m")}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #333",
              background: range === "6m" ? "#222" : "transparent",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            6M
          </button>
          <button
            onClick={() => setRange("12m")}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #333",
              background: range === "12m" ? "#222" : "transparent",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            12M
          </button>
          <button
            onClick={() => setRange("all")}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #333",
              background: range === "all" ? "#222" : "transparent",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            All
          </button>
        </div>

        <div style={{ color: "#aaa", fontSize: 14 }}>
          Latest: <b style={{ color: "white" }}>${latest.avg}</b> / cwt &nbsp; •
          &nbsp; Low ${latest.low} &nbsp; • &nbsp; High ${latest.high}
        </div>
      </div>

      <div
        style={{
          height: 320,
          border: "1px solid #222",
          borderRadius: 16,
          padding: 12,
          marginTop: 12,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={monthLabel}
              minTickGap={24}
            />
            <YAxis />
            <Tooltip
              formatter={(val: any, name: any) => [`$${val}`, name.toUpperCase()]}
              labelFormatter={(label) => `Date: ${label}`}
            />

            {/* range band */}
            <Area type="monotone" dataKey="high" stroke="none" fillOpacity={0.08} />
            <Area type="monotone" dataKey="low" stroke="none" fillOpacity={0.08} />

            <Line type="monotone" dataKey="avg" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="low" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="high" dot={false} strokeWidth={1} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p style={{ marginTop: 10, color: "#888", fontSize: 13 }}>
        Demo data shown. Next step: pull USDA reports on a schedule and store history.
      </p>
    </div>
  );
}
