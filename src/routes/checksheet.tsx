import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronDown, LayoutDashboard, Calendar, Droplet } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
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

function generateWasteDisposalData(dates: string[], seedPrefix: string) {
  return dates.map((date, i) => {
    return {
      date,
      mixing: Math.floor(20 + Math.abs(Math.sin(i * 3.3)) * 80),
      mini: Math.floor(10 + Math.abs(Math.cos(i * 2.4)) * 50),
      pted: Math.floor(30 + Math.abs(Math.sin(i * 1.4)) * 70),
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
  
  // Date range filter string for all sections
  const [globalDateRange, setGlobalDateRange] = useState("01 Aug 2026 - 31 Aug 2026");

  const [station1, setStation1] = useState(STATION_OPTIONS_1[0]);
  const [station2, setStation2] = useState(STATION_OPTIONS_2[0]);

  const dataBagFilter = useMemo(
    () => generatePressureData(FRIDAYS_AUG_2026, station1 + globalDateRange),
    [station1, globalDateRange]
  );

  const dataControlPressure = useMemo(
    () => generatePressureData(ALL_DAYS_AUG_2026, station2 + globalDateRange),
    [station2, globalDateRange]
  );

  const dataWasteDisposal = useMemo(
    () => generateWasteDisposalData(ALL_DAYS_AUG_2026, globalDateRange),
    [globalDateRange]
  );

  // Totals for summary cards
  const totalMixing = dataWasteDisposal.reduce((acc, val) => acc + val.mixing, 0);
  const totalMini = dataWasteDisposal.reduce((acc, val) => acc + val.mini, 0);
  const totalPted = dataWasteDisposal.reduce((acc, val) => acc + val.pted, 0);
  const totalOilWeight = totalMixing + totalMini + totalPted;

  // Y-Axis Ticks for Pressure charts
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

        {/* Global Date Range Filter */}
        <div className="relative shrink-0">
          <button className="flex items-center gap-2 bg-background border border-border rounded-lg pl-3 pr-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {globalDateRange}
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
          </button>
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

      {activeTab === TABS[1] && (
        <div className="space-y-6">
          {/* ── Summary Cards ───────────────────────────────── */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Total Oil Weight"
              value={`${totalOilWeight} L`}
              sub="Total Accumulation"
              subColor="text-muted-foreground"
              iconBg="bg-primary/10"
              icon={<Droplet className="h-4.5 w-4.5 text-primary" />}
            />
            <SummaryCard
              label="Oil Weight Mixing"
              value={`${totalMixing} L`}
              sub="Mixing Process"
              subColor="text-blue-500"
              iconBg="bg-blue-500/10"
              icon={<Droplet className="h-4.5 w-4.5 text-blue-500" />}
            />
            <SummaryCard
              label="Oil Weight Mini"
              value={`${totalMini} L`}
              sub="Mini Process"
              subColor="text-blue-700"
              iconBg="bg-blue-700/10"
              icon={<Droplet className="h-4.5 w-4.5 text-blue-700" />}
            />
            <SummaryCard
              label="Oil Weight PTED"
              value={`${totalPted} L`}
              sub="PTED Process"
              subColor="text-blue-900"
              iconBg="bg-blue-900/10"
              icon={<Droplet className="h-4.5 w-4.5 text-blue-900" />}
            />
          </div>

          {/* ── Chart Section ───────────────────────────────── */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Waste Disposal Trends</h2>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={600}>
                <BarChart
                  data={dataWasteDisposal}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    label={{
                      value: "Oil Weight (Drum)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "var(--muted-foreground)",
                      fontSize: 12,
                    }}
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
                  <Bar dataKey="mixing" name="Mixing" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mini" name="Mini" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pted" name="PTED" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  subColor,
  iconBg,
  icon,
}: {
  label: string;
  value: number | string;
  sub: string;
  subColor: string;
  iconBg: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-card border border-border p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`text-xs ${subColor}`}>{sub}</div>
      </div>
    </div>
  );
}
