export type Point = {
  date: string; // YYYY-MM-DD
  low: number;
  avg: number;
  high: number;
};

export function computeLatest(points: Point[]) {
  const latest = points?.[points.length - 1];
  return {
    lastUpdated: latest?.date ?? "—",
    low: latest?.low ?? 0,
    avg: latest?.avg ?? 0,
    high: latest?.high ?? 0,
  };
}

/**
 * DEMO DATA
 * Replace with USDA AMS ingestion in Phase 3.
 */

// Finished Cattle - Live ($/cwt)
export const SAMPLE_FINISHED_CATTLE_LIVE: Point[] = [
  { date: "2025-01-05", low: 182, avg: 186, high: 190 },
  { date: "2025-02-02", low: 185, avg: 189, high: 193 },
  { date: "2025-03-02", low: 188, avg: 192, high: 196 },
  { date: "2025-04-06", low: 186, avg: 190, high: 194 },
  { date: "2025-05-04", low: 187, avg: 191, high: 195 },
  { date: "2025-06-01", low: 190, avg: 194, high: 198 },
];

// Finished Cattle - Dressed ($/cwt)
export const SAMPLE_FINISHED_CATTLE_DRESSED: Point[] = [
  { date: "2025-01-05", low: 285, avg: 292, high: 299 },
  { date: "2025-02-02", low: 289, avg: 296, high: 303 },
  { date: "2025-03-02", low: 294, avg: 301, high: 308 },
  { date: "2025-04-06", low: 292, avg: 299, high: 306 },
  { date: "2025-05-04", low: 293, avg: 300, high: 307 },
  { date: "2025-06-01", low: 297, avg: 304, high: 311 },
];

// Feeder Cattle - Live ($/cwt) (demo)
export const SAMPLE_FEEDER_CATTLE_LIVE: Point[] = [
  { date: "2025-01-05", low: 238, avg: 246, high: 254 },
  { date: "2025-02-02", low: 242, avg: 250, high: 258 },
  { date: "2025-03-02", low: 248, avg: 256, high: 264 },
  { date: "2025-04-06", low: 245, avg: 253, high: 261 },
  { date: "2025-05-04", low: 247, avg: 255, high: 263 },
  { date: "2025-06-01", low: 252, avg: 260, high: 268 },
];

export type MarketType = "live" | "dressed";
export type SeriesId = "finished_cattle" | "feeder_cattle";

export type SeriesConfig = {
  id: SeriesId;
  label: string;
  unit: string;
  supportedMarkets: MarketType[];
  getPoints: (market: MarketType) => Point[];
};

export const SERIES: SeriesConfig[] = [
  {
    id: "finished_cattle",
    label: "Finished Cattle",
    unit: "$/cwt",
    supportedMarkets: ["live", "dressed"],
    getPoints: (market) =>
      market === "dressed"
        ? SAMPLE_FINISHED_CATTLE_DRESSED
        : SAMPLE_FINISHED_CATTLE_LIVE,
  },
  {
    id: "feeder_cattle",
    label: "Feeder Cattle",
    unit: "$/cwt",
    supportedMarkets: ["live"],
    getPoints: () => SAMPLE_FEEDER_CATTLE_LIVE,
  },
];
