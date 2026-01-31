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
import type { Point } from "./data";

function monthLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

export default function PriceChart({ points }: { points: Point[] }) {
  const [range, setRange] = useState<"6m" | "12m" | "all">("all");

  const data = useMemo(() => {
    if (!points || points.length === 0) return [];
    if (range === "all") return points;

    const cutoffMonths = range === "6m" ? 6 : 12;
    const last = new Date(points[points.length - 1].date + "T00:00:00");
    const cutoff = new Date(last);
    cutoff.setMonth(cutoff.getMonth() - cutoffMonths);

    return points.filter((p) => new Date(p.date + "T00:00:00") >= cutoff);
  }, [range, points]);

  if (!data.length) {
    return (
      <div style={{ marginTop: 16, color: "#aaa" }}>
        No data available for this series.
      </div>
    );
  }

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
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={monthLabel} minTickGap={24} />
            <YAxis />
            <Tooltip
              formatter={(val: any, name: any) => [
                `$${val}`,
                String(name).toUpperCase(),
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />

            <Area type="monotone" dataKey="high" stroke="none" fillOpacity={0.08} />
            <Area type="monotone" dataKey="low" stroke="none" fillOpacity={0.08} />

            <Line type="monotone" dataKey="avg" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="low" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="high" dot={false} strokeWidth={1} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
