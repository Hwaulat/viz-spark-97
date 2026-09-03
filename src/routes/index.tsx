import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AlertTriangle, Activity, Zap, Gauge, Flame, Waves, Thermometer, ArrowRight } from "lucide-react";
import { Panel, StatusDot } from "@/components/panel";
import { ALARMS, energyTrend } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: '/monitoring-area',
    })
  },
  head: () => ({
    meta: [
      { title: "Overview — Utility Monitoring System" },
      { name: "description", content: "Cross-area plant overview: Boiler, CED, Oven status, alarms and energy trend." },
    ],
  }),
  component: Overview,
});

const AREAS = [
  { to: "/boiler", label: "Boiler Area", status: "3/3 Running", meta: "0 Active Alarm", tone: "ok", icon: Flame, badge: "NORMAL" },
  { to: "/ced", label: "CED Area", status: "Line Active", meta: "42 Skids on line", tone: "warn", icon: Waves, badge: "WARN" },
  { to: "/oven", label: "Oven Area", status: "Running", meta: "1,240 kW instant", tone: "ok", icon: Thermometer, badge: "NORMAL" },
] as const;

const KPIS = [
  { label: "Active Alarms", value: "1", icon: AlertTriangle, tone: "warn" as const },
  { label: "Avg Uptime Today", value: "99.4%", icon: Activity, tone: "ok" as const },
  { label: "Energy Today", value: "8,450", unit: "kWh", icon: Zap, tone: "default" as const },
  { label: "Equipment Running", value: "17/18", icon: Gauge, tone: "ok" as const },
];

function Overview() {
  const data = energyTrend();
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Plant Overview</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Utility Monitoring Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Consolidated real-time view across Boiler, CED, and Oven areas.</p>
      </div>

      {/* Area cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {AREAS.map((a) => (
          <Link key={a.to} to={a.to} className="group">
            <Panel
              tone={a.tone === "warn" ? "warn" : "ok"}
              title={<span className="inline-flex items-center gap-2"><a.icon className="h-3.5 w-3.5" />{a.label}</span>}
              right={<span className={`rounded px-2 py-0.5 text-[10px] font-mono ${a.tone === "warn" ? "bg-warn/15 text-warn" : "bg-ok/15 text-ok"}`}>{a.badge}</span>}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-semibold">{a.status}</div>
                  <div className="text-xs text-muted-foreground mt-1">{a.meta}</div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </div>
            </Panel>
          </Link>
        ))}
      </div>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-lg bg-card border border-border p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-secondary/80 text-muted-foreground ${k.tone === "warn" ? "bg-warn/10 text-warn" : k.tone === "ok" ? "bg-ok/10 text-ok" : ""}`}>
                <k.icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-sm font-medium text-foreground">{k.label}</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${k.tone === "warn" ? "text-warn" : k.tone === "ok" ? "text-ok" : ""}`}>{k.value}</span>
                {k.unit && <span className="text-xs font-medium text-muted-foreground">{k.unit}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Trend */}
        <Panel className="lg:col-span-2" title="Energy Consumption Trend" subtitle="Boiler vs Oven — last 24h (kWh)" right={
          <div className="flex gap-1 text-[10px] font-mono text-muted-foreground">
            {["24H","7D","30D"].map((r,i) => <button key={r} className={`px-2 py-1 rounded ${i===0?"bg-primary/20 text-primary":"hover:bg-secondary"}`}>{r}</button>)}
          </div>
        }>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="boiler" stroke="var(--chart-1)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="oven" stroke="var(--chart-3)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Alarms */}
        <Panel title="Recent Alarms & Events" right={<span className="text-[10px] font-mono text-muted-foreground">LIVE</span>}>
          <ul className="divide-y divide-border -mx-4 -my-4">
            {ALARMS.map((a, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-2.5 hover:bg-secondary/40">
                <StatusDot state={a.sev === "warn" ? "warn" : "idle"} size={8} pulse={a.sev==="warn" && i===0} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-muted-foreground">{a.t}</span>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase">{a.area}</span>
                    <span className="text-foreground truncate">{a.eq}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.msg}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
