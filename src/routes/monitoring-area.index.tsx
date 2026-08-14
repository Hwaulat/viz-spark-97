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

type AreaCardType = "boiler" | "temp-single" | "temp-dual" | "oven-elec" | "temp-pressure" | "line-tracking";

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
  elec?: {
    amp: { min: string; act: string; max: string };
    volt: { min: string; act: string; max: string };
    kw: string;
    kwh: string;
    kvar: string;
    kvarh: string;
    pf: string;
    h2: string;
  };
}

const AREAS: AreaDef[] = [
  { id: "boiler-area", name: "Boiler Area", type: "boiler" },
  { id: "flood-station", name: "Flood Station", type: "temp-single", tempPV: "30.1", tempSP: "30.0" },
  { id: "pree-degreasing", name: "Pree Degreasing", type: "temp-dual", largeTank: { pv: "28.5", sp: "30.0" }, smallTank: { pv: "46.2", sp: "45.0" } },
  { id: "degreasing", name: "Degreasing", type: "temp-single", tempPV: "35.0", tempSP: "35.0" },
  { id: "phosphate", name: "Phosphate", type: "temp-dual", largeTank: { pv: "42.5", sp: "42.0" }, smallTank: { pv: "42.1", sp: "42.0" } },
  { id: "oven-sealing", name: "Oven Sealing", type: "oven-elec", elec: { amp: { min: "110", act: "125", max: "150" }, volt: { min: "370", act: "380", max: "390" }, kw: "45", kwh: "120", kvar: "12", kvarh: "30", pf: "0.95", h2: "0.5" } },
  { id: "oven-topcoat", name: "Oven Topcoat", type: "oven-elec", elec: { amp: { min: "130", act: "145", max: "160" }, volt: { min: "375", act: "382", max: "395" }, kw: "52", kwh: "140", kvar: "15", kvarh: "35", pf: "0.96", h2: "0.4" } },
  { id: "oven-ced", name: "Oven CED", type: "oven-elec", elec: { amp: { min: "140", act: "155", max: "170" }, volt: { min: "378", act: "385", max: "398" }, kw: "60", kwh: "165", kvar: "18", kvarh: "42", pf: "0.94", h2: "0.6" } },
  { id: "pted-bag-filter", name: "PTED Bag Filter", type: "temp-pressure", temp: "25.0", pressure: "3.2" },
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
            className="block group"
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
                          <span className="text-muted-foreground">T1: <span className="text-foreground font-bold text-sm">{b.temp1.toFixed(1)}°C</span></span>
                          <span className="text-muted-foreground">T2: <span className="text-foreground font-bold text-sm">{b.temp2.toFixed(1)}°C</span></span>
                        </div>
                      </div>

                      {/* Boiler Status */}
                      <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-border/40">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-muted-foreground">Boiler Status</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${b.running ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                            {b.running ? "ON" : "OFF"}
                          </span>
                        </div>
                        
                        <div className="bg-secondary/30 border border-border/50 rounded-lg flex">
                          <div className="flex-1 p-2.5 flex flex-col gap-1.5 border-r border-border/50">
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                              <Power className={`w-3.5 h-3.5 ${b.running ? 'text-emerald-500' : 'text-muted-foreground/50'}`} /> ON
                            </div>
                            <div className="text-xs font-mono font-bold text-foreground pl-5.5">{b.running ? b.onTime : '—'}</div>
                          </div>
                          <div className="flex-1 p-2.5 flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                              <Power className={`w-3.5 h-3.5 ${!b.running ? 'text-red-500' : 'text-muted-foreground/50'}`} /> OFF
                            </div>
                            <div className="text-xs font-mono font-bold text-foreground pl-5.5">{!b.running ? b.offTime : '—'}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center px-1">
                          <span className="text-xs font-medium text-muted-foreground">Total Duration</span>
                          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{b.boilerDuration}</span>
                        </div>
                      </div>

                      {/* Burner Status */}
                      <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-border/40">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-muted-foreground">Burner Status</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${b.fireBurner ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                            {b.fireBurner ? "ON" : "OFF"}
                          </span>
                        </div>
                        
                        <div className="bg-secondary/30 border border-border/50 rounded-lg flex">
                          <div className="flex-1 p-2.5 flex flex-col gap-1.5 border-r border-border/50">
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                              <Flame className={`w-3.5 h-3.5 ${b.fireBurner ? 'text-orange-500' : 'text-muted-foreground/50'}`} /> ON
                            </div>
                            <div className="text-xs font-mono font-bold text-foreground pl-5.5">{b.fireBurner ? b.burnerOnTime : '—'}</div>
                          </div>
                          <div className="flex-1 p-2.5 flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                              <Flame className={`w-3.5 h-3.5 ${!b.fireBurner ? 'text-red-500' : 'text-muted-foreground/50'}`} /> OFF
                            </div>
                            <div className="text-xs font-mono font-bold text-foreground pl-5.5">{!b.fireBurner ? b.burnerOffTime : '—'}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center px-1">
                          <span className="text-xs font-medium text-muted-foreground">Total Duration</span>
                          <span className="text-xs font-mono font-bold text-orange-500">{b.burnerDuration}</span>
                        </div>
                      </div>

                      {/* Pump Status */}
                      <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-border/40">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-muted-foreground">Pump Status</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${b.motorPump ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                            {b.motorPump ? "ON" : "OFF"}
                          </span>
                        </div>
                        
                        <div className="bg-secondary/30 border border-border/50 rounded-lg flex">
                          <div className="flex-1 p-2.5 flex flex-col gap-1.5 border-r border-border/50">
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                              <Activity className={`w-3.5 h-3.5 ${b.motorPump ? 'text-emerald-500' : 'text-muted-foreground/50'}`} /> ON
                            </div>
                            <div className="text-xs font-mono font-bold text-foreground pl-5.5">{b.motorPump ? b.pumpOnTime : '—'}</div>
                          </div>
                          <div className="flex-1 p-2.5 flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                              <Activity className={`w-3.5 h-3.5 ${!b.motorPump ? 'text-red-500' : 'text-muted-foreground/50'}`} /> OFF
                            </div>
                            <div className="text-xs font-mono font-bold text-foreground pl-5.5">{!b.motorPump ? b.pumpOffTime : '—'}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center px-1">
                          <span className="text-xs font-medium text-muted-foreground">Total Duration</span>
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{b.pumpDuration}</span>
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
                <div className="grid grid-cols-2 gap-3 mt-2">
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

              {area.type === "oven-elec" && area.elec && (
                <div className="grid gap-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        <Zap className="h-3.5 w-3.5 text-yellow-500" /> Ampere
                      </div>
                      <div className="flex justify-between items-end px-1 font-mono flex-1">
                        <span className="text-muted-foreground flex flex-col items-start"><span className="text-[9px]">MIN</span><span className="text-xs font-semibold">{area.elec.amp.min}</span></span>
                        <span className="text-blue-500 flex flex-col items-center"><span className="text-[9px] text-muted-foreground">ACT</span><span className="text-2xl font-bold leading-none tabular-nums">{area.elec.amp.act}</span></span>
                        <span className="text-muted-foreground flex flex-col items-end"><span className="text-[9px]">MAX</span><span className="text-xs font-semibold">{area.elec.amp.max}</span></span>
                      </div>
                    </div>
                    <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        <Zap className="h-3.5 w-3.5 text-yellow-500" /> Voltage
                      </div>
                      <div className="flex justify-between items-end px-1 font-mono flex-1">
                        <span className="text-muted-foreground flex flex-col items-start"><span className="text-[9px]">MIN</span><span className="text-xs font-semibold">{area.elec.volt.min}</span></span>
                        <span className="text-blue-500 flex flex-col items-center"><span className="text-[9px] text-muted-foreground">ACT</span><span className="text-2xl font-bold leading-none tabular-nums">{area.elec.volt.act}</span></span>
                        <span className="text-muted-foreground flex flex-col items-end"><span className="text-[9px]">MAX</span><span className="text-xs font-semibold">{area.elec.volt.max}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className="rounded bg-secondary/30 py-1.5 px-1 border border-border/50 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] text-muted-foreground">kW / kW/h</span>
                      <span className="text-sm font-semibold font-mono mt-0.5 leading-none">{area.elec.kw} / {area.elec.kwh}</span>
                    </div>
                    <div className="rounded bg-secondary/30 py-1.5 px-1 border border-border/50 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] text-muted-foreground">kVar / kVar/h</span>
                      <span className="text-sm font-semibold font-mono mt-0.5 leading-none">{area.elec.kvar} / {area.elec.kvarh}</span>
                    </div>
                    <div className="rounded bg-secondary/30 py-1.5 px-1 border border-border/50 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] text-muted-foreground">PF</span>
                      <span className="text-base font-semibold font-mono mt-0.5 leading-none">{area.elec.pf}</span>
                    </div>
                    <div className="rounded bg-secondary/30 py-1.5 px-1 border border-border/50 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] text-muted-foreground">H2</span>
                      <span className="text-base font-semibold font-mono mt-0.5 leading-none">{area.elec.h2}</span>
                    </div>
                  </div>
                </div>
              )}

              {area.type === "temp-pressure" && (
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
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}

