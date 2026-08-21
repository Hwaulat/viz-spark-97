import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronDown, LayoutDashboard } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export const Route = createFileRoute("/checksheet")({
  head: () => ({
    meta: [
      { title: "Dashboard Checksheet — Utility Monitoring" },
      {
        name: "description",
        content: "Checksheet dashboard displaying pressure trends.",
      },
    ],
  }),
  component: DashboardChecksheet,
});

const STATION_OPTIONS_1 = [
  "Pre Degreasing",
  "Degreasing",
  "ED 1",
  "ED 2",
  "DI 1",
  "DI 2",
  "UF 1",
  "UF 2",
  "WR 5",
  "UF Module",
];

const STATION_OPTIONS_2 = ["UF Modul", "UF 1", "UF 2"];

const MONTH_OPTIONS = ["August 2026", "September 2026", "October 2026"];

// Helper to generate mock data within 0.01 - 0.025
function generatePressureData(dates: string[], seedPrefix: string) {
  return dates.map((date, i) => {
    // some pseudo-randomness based on index
    const baseIn = 0.012 + Math.abs(Math.sin(i * 12.3)) * 0.01; // between 0.012 and 0.022
    const baseOut = 0.01 + Math.abs(Math.cos(i * 5.4)) * 0.008; // between 0.01 and 0.018

    return {
      date,
      IN: Number(baseIn.toFixed(4)),
      OUT: Number(baseOut.toFixed(4)),
    };
  });
}

const TABS = [
  "Cleaning Bag Filter & Control Preassure",
  "Waste Disposal",
  "Control Point",
  "Equipment Pre-Treatment",
  "Chemical CED",
  "ED Ampere",
];

const FRIDAYS_AUG_2026 = ["07 Aug", "14 Aug", "21 Aug", "28 Aug"];
const ALL_DAYS_AUG_2026 = Array.from({ length: 31 }, (_, i) => String(i + 1));

function DashboardChecksheet() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [globalMonth, setGlobalMonth] = useState(MONTH_OPTIONS[0]);

  const [station1, setStation1] = useState(STATION_OPTIONS_1[0]);
  const [station2, setStation2] = useState(STATION_OPTIONS_2[0]);

  const dataBagFilter = useMemo(
    () => generatePressureData(FRIDAYS_AUG_2026, station1 + globalMonth),
    [station1, globalMonth]
  );

  const dataControlPressure = useMemo(
    () => generatePressureData(ALL_DAYS_AUG_2026, station2 + globalMonth),
    [station2, globalMonth]
  );

  // Y-Axis Ticks
  const yTicks = [0.01, 0.015, 0.02, 0.025];

  return (
    <div className="p-6 space-y-6">
      {/* ── Title row ───────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        <LayoutDashboard className="h-5 w-5 text-foreground" />
        <h1 className="text-xl font-bold tracking-tight">Dashboard Checksheet</h1>
      </div>

      {/* ── Tabs & Global Filter ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab List */}
        <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1 overflow-x-auto border border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-background text-primary shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Global Month Filter */}
        <div className="relative shrink-0">
          <select
            className="appearance-none bg-background border border-border rounded-lg pl-4 pr-10 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            value={globalMonth}
            onChange={(e) => setGlobalMonth(e.target.value)}
          >
            {MONTH_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {activeTab === TABS[0] && (
        <>
          {/* ── Card 1: Pressure by Cleaning Bag Filter ──────── */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg font-semibold">Pressure by Cleaning Bag Filter</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Station Filter */}
                <div className="relative">
                  <select
                    className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                    value={station1}
                    onChange={(e) => setStation1(e.target.value)}
                  >
                    {STATION_OPTIONS_1.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataBagFilter} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                domain={[0.01, 0.025]}
                ticks={yTicks}
                tickFormatter={(val) => val.toFixed(3)}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="IN"
                name="IN"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="OUT"
                name="OUT"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f97316", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Card 2: Pressure by Control Pressure ─────────── */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-semibold">Pressure by Control Pressure</h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Station Filter */}
            <div className="relative">
              <select
                className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                value={station2}
                onChange={(e) => setStation2(e.target.value)}
              >
                {STATION_OPTIONS_2.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataControlPressure} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                domain={[0.01, 0.025]}
                ticks={yTicks}
                tickFormatter={(val) => val.toFixed(3)}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="IN"
                name="IN"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="OUT"
                name="OUT"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f97316", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
