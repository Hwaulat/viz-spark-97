import { createFileRoute } from "@tanstack/react-router";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import { OVEN_ZONES, OVENS, OVEN_GAS, energyTrend } from "@/lib/mock-data";
import { Zap, Thermometer, Flame, Fuel } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/oven")({
  head: () => ({
    meta: [
      { title: "Oven Area — Utility Monitoring" },
      { name: "description", content: "Oven energy consumption, per-unit temperature and gas monitoring." },
    ],
  }),
  component: OvenArea,
});

function OvenArea() {
  const data = energyTrend();
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Oven Area</div>
        <h1 className="text-2xl font-semibold mt-1">Cure Oven — Energy & Thermal Profile</h1>
      </div>

      {/* Combined Gas Meter */}
      <Panel
        title={
          <span className="inline-flex items-center gap-2 text-amber-500 font-semibold">
            <Fuel className="h-4 w-4" /> GAS METER (Total Oven 1 + 2 + 3)
          </span>
        }
        subtitle="1 combined gas meter represents total consumption of all three ovens"
        right={<span className="rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-[10px] font-mono font-semibold">COMBINED (1 METER)</span>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ValueDisplay label="Current Gas Consumption" value={OVEN_GAS.instantFlow} unit={OVEN_GAS.unit} tone="warn" />
          <ValueDisplay label="Total Consumption Today" value={OVEN_GAS.todayTotal.toLocaleString()} unit={OVEN_GAS.todayUnit} />
          <div className="rounded-md bg-secondary/50 px-3 py-2.5 border border-border/50 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Gas Line Pressure</div>
              <div className="text-lg font-mono font-semibold mt-1 text-foreground">3.8 <span className="text-xs text-muted-foreground font-normal">bar</span></div>
              <div className="text-[11px] text-ok font-medium mt-0.5">● Supply Line Normal</div>
            </div>
            <Fuel className="h-7 w-7 text-amber-500/60" />
          </div>
        </div>
      </Panel>

      {/* Per-Oven Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {OVENS.map((o) => {
          const dev = o.temp - o.setpoint;
          const tone = o.alarm || Math.abs(dev) > 3 ? "warn" : "ok";
          return (
            <Panel
              key={o.id}
              tone={tone === "warn" ? "warn" : "ok"}
              title={<span className="inline-flex items-center gap-2"><Flame className="h-3.5 w-3.5" />{o.name}</span>}
              right={
                <span className="inline-flex items-center gap-2 text-xs font-mono">
                  <StatusDot state={tone === "warn" ? "warn" : "on"} pulse={o.alarm} />
                  {o.running ? "RUNNING" : "STOPPED"}
                </span>
              }
            >
              <div className="grid grid-cols-2 gap-3">
                <ValueDisplay label="Temperature" value={o.temp.toFixed(1)} unit="°C" tone={o.temp > o.setpoint ? "danger" : "ok"} />
                <ValueDisplay label="Setpoint" value={o.setpoint} unit="°C" />
                <ValueDisplay label="Gas Flow" value={o.gasFlow} unit="m³/h" tone="warn" />
                <ValueDisplay label="Gas Today" value={o.gasTotal.toLocaleString()} unit="m³" />
              </div>
              <div className="mt-3 rounded-md bg-secondary/60 border border-border/50 px-3 py-2 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Energy Today
                </span>
                <span className="font-mono font-semibold">{o.energy.toLocaleString()} <span className="text-[10px] text-muted-foreground">kWh</span></span>
              </div>
            </Panel>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title={<span className="inline-flex items-center gap-2"><Zap className="h-3.5 w-3.5" />kWh Meter</span>}
          right={<StatusDot state="on" />}
          tone="ok"
        >
          <div className="grid grid-cols-3 gap-3">
            <ValueDisplay label="Instant" value="1,240" unit="kW" tone="ok" />
            <ValueDisplay label="Today" value="8,450" unit="kWh" />
            <ValueDisplay label="This Month" value="210,300" unit="kWh" />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-2">
              <span>HOURLY CONSUMPTION</span>
              <span>vs YESTERDAY: −3.2%</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" />
                  <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={10} interval={2} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="oven" fill="var(--chart-1)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-3 rounded-md bg-secondary/60 border border-border/50 p-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Estimated cost today (Rp 1,450/kWh)</span>
            <span className="font-mono font-semibold">Rp 12,252,500</span>
          </div>
        </Panel>

        <Panel
          title={<span className="inline-flex items-center gap-2"><Thermometer className="h-3.5 w-3.5" />Temperature Recorder</span>}
          right={<span className="text-[10px] font-mono text-muted-foreground">6 ZONES · AUTO</span>}
        >
          <div className="grid grid-cols-2 gap-3">
            {OVEN_ZONES.map((z) => {
              const dev = z.pv - z.sp;
              const tone = Math.abs(dev) > 3 ? "warn" : "ok";
              return (
                <div key={z.name} className="rounded-md bg-secondary/50 border border-border/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">{z.name}</span>
                    <StatusDot state={tone === "warn" ? "warn" : "on"} size={8} />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className={`text-2xl font-mono font-semibold tabular-nums ${z.pv > z.sp ? "text-destructive" : "text-ok"}`}>{z.pv}</span>
                    <span className="text-[10px] text-muted-foreground">°C PV</span>
                  </div>
                  <div className="mt-0.5 text-[10px] font-mono text-muted-foreground">
                    SP {z.sp}°C · Δ {dev > 0 ? "+" : ""}{dev}°C
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
                    <div
                      className={`h-full ${tone==="warn"?"bg-warn":"bg-ok"}`}
                      style={{ width: `${Math.min(100, (z.pv / 250) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
