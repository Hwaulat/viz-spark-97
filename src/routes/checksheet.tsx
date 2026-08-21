import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel } from "@/components/panel";
import { CHECKSHEET_ITEMS } from "@/lib/mock-data";
import {
  ClipboardList,
  CheckCircle2,
  X,
  Sparkles,
  Calendar,
  Download,
  ChevronDown,
  Search,
  LayoutDashboard,
} from "lucide-react";
import { useState, useMemo } from "react";
import { INSPECTIONS, getTrendDataForParameter } from "@/lib/checksheet-data";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/checksheet")({
  head: () => ({
    meta: [
      { title: "Dashboard Checksheet — Utility Monitoring" },
      {
        name: "description",
        content:
          "QC Checksheet dashboard with measurement trends and inspection status overview.",
      },
    ],
  }),
  component: DashboardChecksheet,
});

/* ── component ────────────────────────────────────────────── */
function DashboardChecksheet() {
  const [partNumber, setPartNumber] = useState("Part Number - Name");
  const [parameter, setParameter] = useState("Point Stay Middle");
  const [timeFrame] = useState("01/06/2026 - 30/06/2026");

  const totalInspection = INSPECTIONS.length;
  const totalOk = INSPECTIONS.filter(i => i.checked === "ok").length;
  const totalWaiting = INSPECTIONS.filter(i => i.checked === "waiting").length;
  const totalNg = INSPECTIONS.filter(i => i.checked === "ng").length;
  
  const okPct = totalInspection > 0 ? Number(((totalOk / totalInspection) * 100).toFixed(1)) : 0;
  const ngPct = totalInspection > 0 ? Number(((totalNg / totalInspection) * 100).toFixed(1)) : 0;
  const waitingPct = totalInspection > 0 ? Number(((totalWaiting / totalInspection) * 100).toFixed(1)) : 0;

  const trendData = useMemo(() => getTrendDataForParameter(parameter), [parameter]);

  return (
    <div className="p-6 space-y-4">
      {/* ── Title row ───────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Month picker */}
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            June 2026
          </button>
          {/* Export PDF */}
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">
            <Download className="h-4 w-4" />
            Export Pdf
          </button>
        </div>
      </div>

      {/* ── Filter Report ───────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h2 className="text-lg font-semibold">Filter Report</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {/* Part Number & Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">
              Part Number &amp; Name
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
              />
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </div>

          {/* Parameter */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">
              Parameter
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={parameter}
                onChange={(e) => setParameter(e.target.value)}
              />
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </div>

          {/* Time Frame */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">
              Time Frame
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm">{timeFrame}</span>
            </div>
          </div>

          {/* Create Report */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-transparent select-none">
              Action
            </label>
            <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">
              Create Report
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Inspection */}
        <SummaryCard
          label="Total Inspection"
          value={totalInspection}
          sub="+12.1%"
          subColor="text-ok"
          iconBg="bg-destructive/10"
          icon={<ClipboardList className="h-4.5 w-4.5 text-destructive" />}
        />
        {/* Total (OK) */}
        <SummaryCard
          label="Total (OK)"
          value={totalOk}
          sub={`${okPct}%`}
          subColor="text-muted-foreground"
          iconBg="bg-ok/10"
          icon={<CheckCircle2 className="h-4.5 w-4.5 text-ok" />}
        />
        {/* Total (Waiting) */}
        <SummaryCard
          label="Total (Waiting)"
          value={totalWaiting}
          sub="Needs Attention"
          subColor="text-warn"
          iconBg="bg-warn/10"
          icon={<Sparkles className="h-4.5 w-4.5 text-warn" />}
        />
        {/* Total (NG) */}
        <SummaryCard
          label="Total (NG)"
          value={totalNg}
          sub="Critical"
          subColor="text-destructive"
          iconBg="bg-destructive/10"
          icon={<X className="h-4.5 w-4.5 text-destructive" />}
        />
      </div>

      {/* ── Bottom Row: Trend + Inspection Status ───────── */}
      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        {/* Measurement Trend */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Measurement Trend</h3>
              <p className="text-xs text-muted-foreground">
                Middle Point Stay Analysis for MUFFLER
              </p>
            </div>
            <span className="rounded-full bg-ok/10 px-3 py-1 text-xs text-ok">
              Stable
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 1000]}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "lux",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    fontSize: 12,
                    fill: "var(--muted-foreground)",
                  },
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
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Days
          </p>
        </div>

        {/* Inspection Status */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center">
          <div className="text-center mb-3">
            <h3 className="text-lg font-semibold">Inspection Status</h3>
            <p className="text-xs text-muted-foreground">
              Current Period Status Distribution
            </p>
          </div>
          <div className="text-2xl font-semibold mb-5">{okPct}%</div>
          <div className="w-full space-y-4">
            {/* Status OK */}
            <ProgressRow
              label="Status OK"
              value={`${okPct}%`}
              pct={okPct}
              barBg="bg-ok/15"
              barFill="bg-ok"
            />
            {/* Status NG */}
            <ProgressRow
              label="Status NG"
              value={`${ngPct}%`}
              pct={ngPct}
              barBg="bg-destructive/15"
              barFill="bg-destructive"
            />
            {/* Waiting */}
            <ProgressRow
              label="Waiting"
              value={`${waitingPct}%`}
              pct={waitingPct}
              barBg="bg-warn/15"
              barFill="bg-warn"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function SummaryCard({
  label,
  value,
  sub,
  subColor,
  iconBg,
  icon,
}: {
  label: string;
  value: number;
  sub: string;
  subColor: string;
  iconBg: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-card border border-border p-3 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className={`text-xs ${subColor}`}>{sub}</div>
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  pct,
  barBg,
  barFill,
}: {
  label: string;
  value: string;
  pct: number;
  barBg: string;
  barFill: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground text-xs">{label}</span>
        <span className="font-semibold text-sm">{value}</span>
      </div>
      <div className={`h-1.5 rounded-full ${barBg} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${barFill}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
