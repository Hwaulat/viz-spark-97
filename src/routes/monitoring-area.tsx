import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel, StatusDot } from "@/components/panel";
import { Activity, Thermometer, Gauge, ArrowRight, Flame, Power } from "lucide-react";
import { BOILERS } from "@/lib/mock-data";

export const Route = createFileRoute("/monitoring-area")({
  head: () => ({
    meta: [
      { title: "Monitoring Area — Utility Monitoring System" },
      {
        name: "description",
        content: "Overview of temperature and pressure across all areas.",
      },
    ],
  }),
  component: MonitoringArea,
});

const AREAS = [
  { id: "boiler-area", name: "Boiler Area", temp: "185", pressure: "9.2" },
  { id: "flood-station", name: "Flood Station", temp: "30.1", pressure: "1.6" },
  { id: "pree-degreasing", name: "Pree Degreasing", temp: "28.5", pressure: "1.8" },
  { id: "degreasing", name: "Degreasing", temp: "35.0", pressure: "2.1" },
  { id: "phosphate", name: "Phosphate", temp: "42.5", pressure: "1.5" },
  { id: "oven-sealing", name: "Oven Sealing", temp: "150", pressure: "2.3" },
  { id: "oven-topcoat", name: "Oven Topcoat", temp: "175", pressure: "2.4" },
  { id: "oven-ced", name: "Oven CED", temp: "190", pressure: "2.5" },
  { id: "pted-bag-filter", name: "PTED Bag Filter", temp: "25.0", pressure: "3.2" },
];

function MonitoringArea() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Monitoring System
          </div>
          <h1 className="text-2xl font-semibold mt-1 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" /> Monitoring Area
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time overview of temperature and pressure for all processing areas.
          </p>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((area) => (
          <Link
            key={area.id}
            to={`/monitoring-area/${area.id}`}
            className={`block group ${area.id === "boiler-area" ? "lg:col-span-3 sm:col-span-2" : ""}`}
          >
            <Panel
              className="hover:border-primary/50 transition-colors h-full flex flex-col"
              title={area.name}
              right={
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              }
            >
              {area.id === "boiler-area" ? (
                <div className="grid gap-6 lg:grid-cols-3 mt-4">
                  {BOILERS.map((b) => (
                    <div key={b.id} className="flex flex-col items-center">
                      <div className={`relative w-40 h-56 rounded-t-full border-4 flex flex-col items-center p-4 transition-colors ${b.running ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-gray-500/50 bg-gray-500/10'}`}>
                         <div className="text-base font-bold flex items-center gap-2">
                           <Flame className={`h-4 w-4 ${b.running ? 'text-emerald-500' : 'text-gray-500'}`} />
                           {b.name}
                         </div>
                         
                         <div className="mt-4 flex flex-col gap-1 w-full text-center text-xs font-mono bg-background/60 rounded-md py-1.5 border border-border/50">
                           <div>Temp 1: <span className="font-bold">{b.temp1.toFixed(1)}°C</span></div>
                           <div>Temp 2: <span className="font-bold">{b.temp2.toFixed(1)}°C</span></div>
                         </div>
                         
                         <div className="mt-auto flex items-center gap-2 bg-background/50 px-2.5 py-1 rounded-full border border-border/50">
                            <StatusDot state={b.running ? "on" : "off"} />
                            <span className="text-xs font-bold font-mono">{b.running ? "ON" : "OFF"}</span>
                         </div>
                      </div>
                      
                      <div className="mt-3 w-full max-w-[200px] space-y-2 bg-secondary/30 p-3 rounded-lg border border-border/50">
                         <div className="flex flex-col text-[11px] border-b border-border/50 pb-2">
                           <div className="flex justify-between items-center mb-1">
                             <span className="font-medium text-muted-foreground">Boiler</span>
                             <span className={`font-mono px-1.5 py-0.5 rounded font-semibold ${b.running ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>{b.running ? "ON" : "OFF"}</span>
                           </div>
                           <div className="flex justify-between mt-1">
                             <span className="text-muted-foreground flex items-center gap-1"><Power className="h-2.5 w-2.5 text-ok" /> ON: <span className="text-foreground font-mono">{b.onTime}</span></span>
                             <span className="text-muted-foreground flex items-center gap-1"><Power className="h-2.5 w-2.5 text-destructive" /> OFF: <span className="text-foreground font-mono">{b.offTime}</span></span>
                           </div>
                         </div>
                         
                         <div className="flex flex-col text-[11px]">
                           <div className="flex justify-between items-center mb-1">
                             <span className="font-medium text-muted-foreground">Burner</span>
                             <span className={`font-mono px-1.5 py-0.5 rounded font-semibold ${b.fireBurner ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>{b.fireBurner ? "ON" : "OFF"}</span>
                           </div>
                           <div className="flex justify-between mt-1">
                             <span className="text-muted-foreground">Durasi ON:</span>
                             <span className="text-foreground font-mono">{b.burnerDuration}</span>
                           </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="rounded-lg bg-secondary/50 p-3 border border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      <Thermometer className="h-3.5 w-3.5" /> Temp
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold tabular-nums">
                        {area.temp}
                      </span>
                      <span className="text-xs text-muted-foreground">°C</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 border border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      <Gauge className="h-3.5 w-3.5" /> Pressure
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold tabular-nums">
                        {area.pressure}
                      </span>
                      <span className="text-xs text-muted-foreground">bar</span>
                    </div>
                  </div>
                </div>
              )}
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}
