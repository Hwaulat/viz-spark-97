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

      {/* Combined Gas Card */}
      <Panel
        title={
          <span className="inline-flex items-center gap-2 text-amber-500 font-semibold">
            <Fuel className="h-4 w-4" /> GAS METER (Total Boiler 1 + 2 + 3)
          </span>
        }
        subtitle="1 combined gas meter represents total consumption of all three boilers"
        right={<span className="rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-[10px] font-mono font-semibold">COMBINED (1 METER)</span>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ValueDisplay label="Current Gas Consumption" value={BOILER_GAS.instantFlow} unit={BOILER_GAS.unit} tone="warn" />
          <ValueDisplay label="Total Consumption Today" value={BOILER_GAS.todayTotal.toLocaleString()} unit={BOILER_GAS.todayUnit} />
          <div className="rounded-md bg-secondary/50 px-3 py-2.5 border border-border/50 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Gas Line Pressure</div>
              <div className="text-lg font-mono font-semibold mt-1 text-foreground">4.2 <span className="text-xs text-muted-foreground font-normal">bar</span></div>
              <div className="text-[11px] text-ok font-medium mt-0.5">● Supply Line Normal</div>
            </div>
            <Fuel className="h-7 w-7 text-amber-500/60" />
          </div>
        </div>
      </Panel>

      {/* 3 Boiler Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {BOILERS.map((b) => (
          <Panel
            key={b.id}
            tone={b.alarm ? "warn" : "ok"}
            title={<span className="inline-flex items-center gap-2"><Flame className="h-3.5 w-3.5" />{b.name}</span>}
            right={
              <span className="inline-flex items-center gap-2 text-xs font-mono">
                <StatusDot state={b.alarm ? "warn" : "on"} pulse={b.alarm} />
                {b.running ? "ON" : "OFF"}
              </span>
            }
          >
            <div className="grid grid-cols-2 gap-3">
              <ValueDisplay label="Actual Temp 1" value={b.temp1.toFixed(1)} unit="°C" tone={b.alarm ? "warn" : "default"} />
              <ValueDisplay label="Actual Temp 2" value={b.temp2.toFixed(1)} unit="°C" tone="ok" />
              <ValueDisplay label="Pressure" value={b.pressure.toFixed(1)} unit="bar" />
              <ValueDisplay label="Operating Hours" value={b.runningHours.toFixed(1)} unit="hrs" />
            </div>

            {/* ON/OFF Timeline */}
            <div className="mt-3 rounded-md bg-secondary/60 border border-border/50 px-3 py-2 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Power className="h-3.5 w-3.5 text-ok" /> ON at
              </span>
              <span className="font-mono font-semibold">{b.onTime}</span>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Power className="h-3.5 w-3.5 text-destructive" /> OFF at
              </span>
              <span className="font-mono font-semibold">{b.offTime}</span>
            </div>

            {/* Energy & Gas Summary */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-secondary/50 border border-border/50 p-2.5">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Energy</div>
                <div className="mt-1 flex items-baseline justify-between font-mono">
                  <span className="text-[11px] text-muted-foreground">Avg</span>
                  <span className="text-sm font-semibold tabular-nums">{b.energyAvg} <span className="text-[10px] text-muted-foreground">kWh</span></span>
                </div>
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-[11px] text-muted-foreground">Total</span>
                  <span className="text-sm font-semibold tabular-nums">{b.energyTotal.toLocaleString()} <span className="text-[10px] text-muted-foreground">kWh</span></span>
                </div>
              </div>
              <div className="rounded-md bg-secondary/50 border border-border/50 p-2.5">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Gas</div>
                <div className="mt-1 flex items-baseline justify-between font-mono">
                  <span className="text-[11px] text-muted-foreground">Avg</span>
                  <span className="text-sm font-semibold tabular-nums">{b.gasAvg} <span className="text-[10px] text-muted-foreground">m³/h</span></span>
                </div>
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-[11px] text-muted-foreground">Total</span>
                  <span className="text-sm font-semibold tabular-nums">{b.gasTotal.toLocaleString()} <span className="text-[10px] text-muted-foreground">m³</span></span>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex flex-col gap-1 rounded-md bg-secondary/60 px-3 py-2 border border-border/50">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs"><Flame className="h-3.5 w-3.5 text-warn" />Status Burner</span>
                  <span className="inline-flex items-center gap-2 text-xs font-mono">
                    <StatusDot state={b.fireBurner ? "on" : "off"} />
                    {b.fireBurner ? "ON" : "OFF"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground border-t border-border/50 pt-1">
                  <span>Durasi ON</span>
                  <span className="font-mono text-foreground">{b.burnerDuration}</span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2 border border-border/50">
                <span className="inline-flex items-center gap-2 text-xs"><Cog className="h-3.5 w-3.5 text-primary" />Motor Pump</span>
                <span className="inline-flex items-center gap-2 text-xs font-mono">
                  <StatusDot state={b.motorPump ? "on" : "off"} />
                  {b.motorPump ? "RUNNING" : "STOPPED"}
                </span>
              </div>
            </div>

            {/* Details button */}
            <Link
              to="/boiler-details/$id"
              params={{ id: String(b.id) }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              <Gauge className="h-3.5 w-3.5" /> Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Panel>
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
