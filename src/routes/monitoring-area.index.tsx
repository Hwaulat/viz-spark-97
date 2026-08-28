import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel } from "@/components/panel";
import { Activity, Thermometer, Gauge, ArrowRight, Flame, Zap, Power } from "lucide-react";
import { BOILERS } from "@/lib/mock-data";

export const Route = createFileRoute("/monitoring-area/")({
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

type AreaCardType = "boiler" | "temp-single" | "temp-dual" | "oven" | "temp-pressure" | "line-tracking";

interface AreaDef {
  id: string;
  name: string;
  type: AreaCardType;
  temp?: string;
  pressure?: string;
  tempPV?: string;
  tempSP?: string;
  largeTank?: { pv: string; sp: string };
  smallTank?: { pv: string; sp: string };
  oven?: {
    temperature: string;
    elecUsage: string;
    gasUsage: string;
    pressureGas: string;
  };
  pted?: {
    tempIn: string;
    tempOut: string;
    pressureIn: string;
    pressureOut: string;
  };
}

const AREAS: AreaDef[] = [
  { id: "boiler-area", name: "Boiler Area", type: "boiler" },
  { id: "flood-station", name: "Flood Station", type: "temp-single", tempPV: "30.1", tempSP: "30.0" },
  { id: "pree-degreasing", name: "Pree Degreasing", type: "temp-single", tempPV: "46.2", tempSP: "45.0" },
  { id: "degreasing", name: "Degreasing", type: "temp-single", tempPV: "35.0", tempSP: "35.0" },
  { id: "phosphate", name: "Phosphate", type: "temp-single", tempPV: "42.5", tempSP: "42.0" },
  { id: "oven-sealing", name: "Oven Sealing", type: "oven", oven: { temperature: "160.0", elecUsage: "120", gasUsage: "45", pressureGas: "2.1" } },
  { id: "oven-topcoat", name: "Oven Topcoat", type: "oven", oven: { temperature: "175.5", elecUsage: "140", gasUsage: "52", pressureGas: "2.4" } },
  { id: "oven-ced", name: "Oven CED", type: "oven", oven: { temperature: "185.0", elecUsage: "165", gasUsage: "60", pressureGas: "2.8" } },
  { id: "pted-bag-filter", name: "PTED Bag Filter", type: "temp-pressure", temp: "25.0", pressure: "3.2", pted: { tempIn: "30.5", tempOut: "28.0", pressureIn: "4.5", pressureOut: "3.2" } },
];


function AreaCard({ area }: { area: AreaDef }) {
  return (
    <Link
            
            to="/monitoring-area/$id"
            params={{ id: area.id }}
            className="block group h-full"
          >
            <Panel
              className="hover:border-primary/50 transition-colors h-full flex flex-col"
              title={area.name}
              right={
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              }
            >
              {area.type === "boiler" && (
                <div className="grid gap-2 mt-2">
                  {BOILERS.map((b) => (
                    <div key={b.id} className="rounded-md bg-background p-3 border border-border/50 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold flex items-center gap-1.5">
                          <Flame className={`h-4 w-4 ${b.running ? 'text-emerald-500' : 'text-gray-400'}`} /> {b.name}
                        </span>
                        <div className="flex gap-4 text-xs font-mono items-center">
    <span className="text-muted-foreground flex items-baseline gap-2">T1 <span className="text-foreground font-bold text-2xl">{b.temp1.toFixed(1)}°C</span></span>
    <span className="text-muted-foreground flex items-baseline gap-2">T2 <span className="text-foreground font-bold text-2xl">{b.temp2.toFixed(1)}°C</span></span>
  </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/40">
                        {/* Boiler Status */}
                        <div className="flex flex-col gap-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-muted-foreground">Boiler Status</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${b.running ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                              {b.running ? "ON" : "OFF"}
                            </span>
                          </div>
                          
                          <div className="bg-secondary/30 border border-border/50 rounded-lg flex">
                            <div className="flex-1 p-2 flex flex-col gap-1 border-r border-border/50">
                              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                                <Power className={`w-3 h-3 ${b.running ? 'text-emerald-500' : 'text-muted-foreground/50'}`} /> ON
                              </div>
                              <div className="text-sm font-mono font-bold text-foreground pl-4.5">{b.running ? b.onTime : '—'}</div>
                            </div>
                            <div className="flex-1 p-2 flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                                <Power className={`w-3 h-3 ${!b.running ? 'text-red-500' : 'text-muted-foreground/50'}`} /> OFF
                              </div>
                              <div className="text-sm font-mono font-bold text-foreground pl-4.5">{!b.running ? b.offTime : '—'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Pump Status */}
                        <div className="flex flex-col gap-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-muted-foreground">Pump Status</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${b.motorPump ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                              {b.motorPump ? "ON" : "OFF"}
                            </span>
                          </div>
                          
                          <div className="bg-secondary/30 border border-border/50 rounded-lg flex">
                            <div className="flex-1 p-2 flex flex-col gap-1 border-r border-border/50">
                              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                                <Activity className={`w-3 h-3 ${b.motorPump ? 'text-emerald-500' : 'text-muted-foreground/50'}`} /> ON
                              </div>
                              <div className="text-sm font-mono font-bold text-foreground pl-4.5">{b.motorPump ? b.pumpOnTime : '—'}</div>
                            </div>
                            <div className="flex-1 p-2 flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                                <Activity className={`w-3 h-3 ${!b.motorPump ? 'text-red-500' : 'text-muted-foreground/50'}`} /> OFF
                              </div>
                              <div className="text-sm font-mono font-bold text-foreground pl-4.5">{!b.motorPump ? b.pumpOffTime : '—'}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {area.type === "line-tracking" && (
                <div className="grid gap-2 mt-2">
                  <div className="rounded-md bg-secondary/50 p-2 border border-border/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-muted-foreground">Pre-Degreasing</span>
                      <div className="flex gap-2">
                        <span className="text-foreground">PV: 46.2°C</span>
                        <span className="text-muted-foreground">SP: 45.0°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md bg-secondary/50 p-2 border border-border/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-muted-foreground">Degreasing</span>
                      <div className="flex gap-2">
                        <span className="text-foreground">PV: 52.8°C</span>
                        <span className="text-muted-foreground">SP: 52.0°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md bg-secondary/50 p-2 border border-border/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-muted-foreground">Flood</span>
                      <div className="flex gap-2">
                        <span className="text-destructive font-semibold">PV: 28.5°C</span>
                        <span className="text-muted-foreground">SP: 30.0°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md bg-secondary/50 p-2 border border-border/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-muted-foreground">Phosphate</span>
                      <div className="flex gap-2">
                        <span className="text-foreground">PV: 42.1°C</span>
                        <span className="text-muted-foreground">SP: 42.0°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {area.type === "temp-single" && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="rounded-lg bg-secondary/50 p-3 border border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      <Thermometer className="h-3.5 w-3.5" /> Temp PV
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold tabular-nums">{area.tempPV}</span>
                      <span className="text-xs text-muted-foreground">°C</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 border border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      <Thermometer className="h-3.5 w-3.5" /> Temp SP
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold tabular-nums">{area.tempSP}</span>
                      <span className="text-xs text-muted-foreground">°C</span>
                    </div>
                  </div>
                </div>
              )}

              {area.type === "temp-dual" && (
                <div className="flex flex-col gap-3 mt-2">
                  <div className="rounded-lg bg-secondary/50 p-2.5 border border-border/50 flex flex-col gap-1.5">
                    <div className="text-[10px] font-semibold text-muted-foreground text-center border-b border-border/50 pb-1.5">
                      Large Tank
                    </div>
                    <div className="flex justify-between px-1 mt-0.5">
                      <div className="flex flex-col items-start">
                        <span className="text-muted-foreground/80 text-[9px] uppercase">PV</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-2xl font-semibold tabular-nums">{area.largeTank?.pv}</span>
                          <span className="text-[10px] text-muted-foreground">°C</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-muted-foreground/80 text-[9px] uppercase">SP</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-2xl font-semibold tabular-nums">{area.largeTank?.sp}</span>
                          <span className="text-[10px] text-muted-foreground">°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5 border border-border/50 flex flex-col gap-1.5">
                    <div className="text-[10px] font-semibold text-muted-foreground text-center border-b border-border/50 pb-1.5">
                      Small Tank
                    </div>
                    <div className="flex justify-between px-1 mt-0.5">
                      <div className="flex flex-col items-start">
                        <span className="text-muted-foreground/80 text-[9px] uppercase">PV</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-2xl font-semibold tabular-nums">{area.smallTank?.pv}</span>
                          <span className="text-[10px] text-muted-foreground">°C</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-muted-foreground/80 text-[9px] uppercase">SP</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-2xl font-semibold tabular-nums">{area.smallTank?.sp}</span>
                          <span className="text-[10px] text-muted-foreground">°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {area.type === "oven" && area.oven && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temp</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono">{area.oven.temperature}</span>
                      <span className="text-[10px] text-muted-foreground">°C</span>
                    </div>
                  </div>
                  <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-500" /> Elec Usage</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono">{area.oven.elecUsage}</span>
                      <span className="text-[10px] text-muted-foreground">kWh/day</span>
                    </div>
                  </div>
                  <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Flame className="h-3 w-3 text-orange-500" /> Gas Usage</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono">{area.oven.gasUsage}</span>
                      <span className="text-[10px] text-muted-foreground">m³/day</span>
                    </div>
                  </div>
                  <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Gauge className="h-3 w-3" /> Gas Press</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono">{area.oven.pressureGas}</span>
                      <span className="text-[10px] text-muted-foreground">bar</span>
                    </div>
                  </div>
                </div>
              )}

              {area.type === "temp-pressure" && area.id !== "pted-bag-filter" && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="rounded-lg bg-secondary/50 p-3 border border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      <Thermometer className="h-3.5 w-3.5" /> Temp
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold tabular-nums">{area.temp}</span>
                      <span className="text-xs text-muted-foreground">°C</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 border border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      <Gauge className="h-3.5 w-3.5" /> Pressure
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold tabular-nums">{area.pressure}</span>
                      <span className="text-xs text-muted-foreground">bar</span>
                    </div>
                  </div>
                </div>
              )}

              {area.id === "pted-bag-filter" && area.pted && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="rounded-lg bg-secondary/50 p-2.5 border border-border/50 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-1.5 justify-center">
                      <Thermometer className="h-3.5 w-3.5" /> Temperature
                    </div>
                    <div className="flex justify-between px-1 mt-0.5">
                      <div className="flex flex-col items-start">
                        <span className="text-muted-foreground/80 text-[9px] uppercase">IN</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xl font-semibold tabular-nums text-foreground">{area.pted.tempIn}</span>
                          <span className="text-[9px] text-muted-foreground">°C</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-muted-foreground/80 text-[9px] uppercase">OUT</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xl font-semibold tabular-nums text-emerald-500">{area.pted.tempOut}</span>
                          <span className="text-[9px] text-muted-foreground">°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5 border border-border/50 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-1.5 justify-center">
                      <Gauge className="h-3.5 w-3.5" /> Pressure
                    </div>
                    <div className="flex justify-between px-1 mt-0.5">
                      <div className="flex flex-col items-start">
                        <span className="text-muted-foreground/80 text-[9px] uppercase">IN</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xl font-semibold tabular-nums text-foreground">{area.pted.pressureIn}</span>
                          <span className="text-[9px] text-muted-foreground">bar</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-muted-foreground/80 text-[9px] uppercase">OUT</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xl font-semibold tabular-nums text-blue-500">{area.pted.pressureOut}</span>
                          <span className="text-[9px] text-muted-foreground">bar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </Panel>
          </Link>
  );
}

function MonitoringArea() {
  const col1Areas = ["boiler-area"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];
  const col2Areas = ["flood-station", "degreasing", "pted-bag-filter"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];
  const col3Areas = ["pree-degreasing", "phosphate"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];
  const ovenAreas = ["oven-sealing", "oven-topcoat", "oven-ced"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];

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

      {/* Layout Grid */}
      <div className="flex flex-col gap-6">
        {/* Top Section */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Column 1: Boiler Area */}
          <div className="flex flex-col gap-4">
            {col1Areas.map(area => <AreaCard key={area.id} area={area} />)}
          </div>
          
          {/* Column 2: Flood, Degreasing, PTED */}
          <div className="flex flex-col gap-4">
            {col2Areas.map(area => <AreaCard key={area.id} area={area} />)}
          </div>
          
          {/* Column 3: Pre Degreasing, Phosphate */}
          <div className="flex flex-col gap-4">
            {col3Areas.map(area => <AreaCard key={area.id} area={area} />)}
          </div>
        </div>

        {/* Bottom Section: Ovens */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ovenAreas.map(area => <AreaCard key={area.id} area={area} />)}
        </div>
      </div>
    </div>
  );
}
