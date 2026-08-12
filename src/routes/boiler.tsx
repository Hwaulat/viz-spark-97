import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import { BOILERS, BOILER_GAS, boilerDayTrend, boilerMonthTrend } from "@/lib/mock-data";
import { Flame, Cog, TrendingUp, Fuel, Gauge, ArrowRight, Power } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export const Route = createFileRoute("/boiler")({
  head: () => ({
    meta: [
      { title: "Boiler Area — Utility Monitoring" },
      { name: "description", content: "Real-time monitoring of 3 boiler units — temperatures, pressures, gas & running hours." },
    ],
  }),
  component: BoilerArea,
});

function BoilerArea() {
  const runningCount = BOILERS.filter(b => b.running).length;
  const burnerCount = BOILERS.filter(b => b.fireBurner).length;
  const alarmCount = BOILERS.filter(b => b.alarm).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Boiler Area</div>
          <h1 className="text-2xl font-semibold mt-1">Steam Generation Units</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitoring per unit (Temp, Pressure, Operating Hours) & Combined Gas Meter.</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="rounded-md border border-ok/40 bg-ok/10 px-3 py-1.5 font-mono text-ok">{runningCount}/3 RUNNING</span>
          <span className="rounded-md border border-border bg-secondary px-3 py-1.5 font-mono">{burnerCount}/3 BURNERS ON</span>
          <span className={`rounded-md border px-3 py-1.5 font-mono ${alarmCount ? "border-warn/50 bg-warn/10 text-warn" : "border-ok/40 bg-ok/10 text-ok"}`}>{alarmCount} ALARMS</span>
        </div>
      </div>

      {/* Summary Card */}
      <Panel
        title={
          <span className="inline-flex items-center gap-2 font-semibold">
            <Gauge className="h-4 w-4" /> Boiler Area Summary
          </span>
        }
        subtitle="Total consumption and power"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <ValueDisplay label="Gas Flow" value={BOILER_GAS.instantFlow} unit="m³/h" tone="warn" />
          <ValueDisplay label="Gas Pressure" value={BOILER_GAS.gasPressure} unit="bar" tone="ok" />
          <ValueDisplay label="Power Panel" value={BOILER_GAS.powerPanel} unit="kW" tone="default" />
        </div>
      </Panel>

      {/* 3 Boiler Tanks Illustration */}
      <div className="grid gap-6 lg:grid-cols-3">
        {BOILERS.map((b) => (
          <div key={b.id} className="flex flex-col items-center">
            {/* Tank illustration */}
            <div className={`relative w-48 h-64 rounded-t-full border-4 flex flex-col items-center p-6 transition-colors ${b.running ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-gray-500/50 bg-gray-500/10'}`}>
               <div className="text-lg font-bold flex items-center gap-2">
                 <Flame className={`h-5 w-5 ${b.running ? 'text-emerald-500' : 'text-gray-500'}`} />
                 {b.name}
               </div>
               
               <div className="mt-6 flex flex-col gap-2 w-full text-center text-sm font-mono bg-background/60 rounded-md py-2 border border-border/50">
                 <div>Temp 1: <span className="font-bold">{b.temp1.toFixed(1)}°C</span></div>
                 <div>Temp 2: <span className="font-bold">{b.temp2.toFixed(1)}°C</span></div>
               </div>
               
               <div className="mt-auto flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                  <StatusDot state={b.running ? "on" : "off"} />
                  <span className="text-sm font-bold font-mono">{b.running ? "ON" : "OFF"}</span>
               </div>
            </div>
            
            {/* Details underneath the tank */}
            <div className="mt-4 w-full space-y-3 bg-secondary/30 p-4 rounded-xl border border-border/50">
               <div className="flex flex-col text-sm border-b border-border/50 pb-3">
                 <div className="flex justify-between items-center mb-1.5">
                   <span className="font-medium text-muted-foreground">Boiler Status</span>
                   <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${b.running ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>{b.running ? "ON" : "OFF"}</span>
                 </div>
                 <div className="flex justify-between text-xs mt-1">
                   <span className="text-muted-foreground flex items-center gap-1.5"><Power className="h-3 w-3 text-ok" /> ON: <span className="text-foreground font-mono">{b.onTime}</span></span>
                   <span className="text-muted-foreground flex items-center gap-1.5"><Power className="h-3 w-3 text-destructive" /> OFF: <span className="text-foreground font-mono">{b.offTime}</span></span>
                 </div>
               </div>
               
               <div className="flex flex-col text-sm">
                 <div className="flex justify-between items-center mb-1.5">
                   <span className="font-medium text-muted-foreground">Burner Status</span>
                   <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${b.fireBurner ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>{b.fireBurner ? "ON" : "OFF"}</span>
                 </div>
                 <div className="flex justify-between text-xs mt-1">
                   <span className="text-muted-foreground">Durasi ON:</span>
                   <span className="text-foreground font-mono">{b.burnerDuration}</span>
                 </div>
               </div>
               
               <Link
                 to="/boiler-details/$id"
                 params={{ id: String(b.id) }}
                 className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition"
               >
                 <Gauge className="h-3.5 w-3.5" /> Detail Lengkap
               </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Temperature Trend */}
      <BoilerTrendChart />
    </div>
  );
}

function BoilerTrendChart() {
  const [activeBoilerId, setActiveBoilerId] = useState(1);
  const [range, setRange] = useState<"1D" | "1M">("1D");
  const activeBoiler = BOILERS.find((b) => b.id === activeBoilerId)!;
  const data = range === "1D" ? boilerDayTrend(activeBoiler.setpoint) : boilerMonthTrend(activeBoiler.setpoint);
  const xLabel = range === "1D" ? "Hour" : "Day of Month";

  return (
    <Panel
      title="Temperature Trend"
      subtitle={`${activeBoiler.name} — Actual Temp 1 & 2 (${range === "1D" ? "last 24 hours" : "last 30 days"})`}
      right={
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5" />
          {(["1D", "1M"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded ${range === r ? "bg-primary/20 text-primary" : "hover:bg-secondary"}`}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      {/* Tab List for Boiler 1 / 2 / 3 */}
      <div className="flex items-center gap-1 mb-4 bg-secondary/60 p-1 rounded-lg w-fit" role="tablist">
        {BOILERS.map((b) => (
          <button
            key={b.id}
            role="tab"
            aria-selected={activeBoilerId === b.id}
            onClick={() => setActiveBoilerId(b.id)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-2 ${
              activeBoilerId === b.id
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Flame className={`h-3.5 w-3.5 ${activeBoilerId === b.id ? "text-primary" : ""}`} />
            {b.name}
            {b.alarm && <span className="h-1.5 w-1.5 rounded-full bg-warn animate-pulse" />}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-muted-foreground font-mono">
        <span>Temp 1: <strong className="text-foreground">{activeBoiler.temp1.toFixed(1)}°C</strong></span>
        <span>Temp 2: <strong className="text-foreground">{activeBoiler.temp2.toFixed(1)}°C</strong></span>
        <span>Status: <strong className={activeBoiler.alarm ? "text-warn" : "text-ok"}>{activeBoiler.alarm ? "ALARM" : "NORMAL"}</strong></span>
        <span className="ml-auto">X-axis: {xLabel}</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" />
            <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={10} interval={range === "1D" ? 2 : 2} />
            <YAxis stroke="var(--muted-foreground)" fontSize={10} domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 11, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="temp1" name="Temp 1" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="temp2" name="Temp 2" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
