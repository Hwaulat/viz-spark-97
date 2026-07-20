import { createFileRoute } from "@tanstack/react-router";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import { OVEN_ZONES, energyTrend } from "@/lib/mock-data";
import { Zap, Thermometer } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/oven")({
  head: () => ({
    meta: [
      { title: "Oven Area — Utility Monitoring" },
      { name: "description", content: "Oven energy consumption and multi-zone temperature monitoring." },
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
                    <span className={`text-2xl font-mono font-semibold tabular-nums ${tone==="warn"?"text-warn":"text-foreground"}`}>{z.pv}</span>
                    <span className="text-[10px] text-muted-foreground">°C PV</span>
                  </div>
                  <div className="mt-0.5 text-[10px] font-mono text-muted-foreground">
                    SP {z.sp}°C · Δ {dev > 0 ? "+" : ""}{dev}°C
                  </div>
                  {/* mini bar */}
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
