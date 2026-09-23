import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Panel } from "@/components/panel";
import { Activity, Thermometer, Gauge, ArrowRight, Flame, Zap, Power, Filter, Waves } from "lucide-react";
import { BOILERS } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, BarChart, Bar, Cell } from "recharts";

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

type AreaCardType = "boiler" | "temp-single" | "temp-dual" | "oven" | "temp-pressure" | "line-tracking" | "pted-wrapper";

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
    temp1: string;
    temp2: string;
    pressure: string;
    running?: boolean;
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
  { id: "pted-area", name: "PTED Area", type: "pted-wrapper" },
  { id: "oven-sealing", name: "Oven Sealing", type: "oven", oven: { temp1: "186.5", temp2: "184.0", pressure: "2.1", running: true } },
  { id: "oven-topcoat", name: "Oven Topcoat", type: "oven", oven: { temp1: "191.0", temp2: "189.5", pressure: "2.4", running: true } },
  { id: "oven-ced", name: "Oven CED", type: "oven", oven: { temp1: "182.0", temp2: "179.0", pressure: "2.8", running: false } },
];


function BagFilterItemDialog({ item, children }: { item: { name: string, val: string, val2?: string, id: string, unit?: string, valName?: string, val2Name?: string, minStd?: number, maxStd?: number, minStd2?: number, maxStd2?: number, minStdName?: string, maxStdName?: string, minStd2Name?: string, maxStd2Name?: string }, children: React.ReactNode }) {
  const data = useMemo(() => {
    const base1 = parseFloat(item.val);
    const base2 = item.val2 ? parseFloat(item.val2) : undefined;
    return Array.from({ length: 30 }, (_, i) => {
      const time = new Date(Date.now() - (29 - i) * 60000);
      const res: any = {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        value1: +(base1 + (Math.random() * (base1 * 0.05) - (base1 * 0.025))).toFixed(1),
      };
      if (base2 !== undefined) {
        res.value2 = +(base2 + (Math.random() * (base2 * 0.05) - (base2 * 0.025))).toFixed(1);
      }
      return res;
    });
  }, [item.val, item.val2]);

  const minLimit1 = item.minStd !== undefined ? item.minStd : +(parseFloat(item.val) * 0.95).toFixed(1);
  const maxLimit1 = item.maxStd;
  const minLimit2 = item.minStd2 !== undefined ? item.minStd2 : (item.val2 ? +(parseFloat(item.val2) * 0.95).toFixed(1) : undefined);
  const maxLimit2 = item.maxStd2;

  const unit = item.unit || "°C";

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-6">
        <DialogHeader className="border-b border-border/50 pb-4 mb-2">
          <DialogTitle className="uppercase text-xs font-bold text-muted-foreground tracking-wider text-left">{item.name} TRENDS</DialogTitle>
        </DialogHeader>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} stroke="hsl(var(--muted-foreground))" axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={['dataMin - 1', 'dataMax + 1']} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
                labelStyle={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {minLimit1 !== undefined && <ReferenceLine y={minLimit1} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: `${item.minStdName || 'Standard MIN'} ${item.minStd !== undefined ? `(${item.minStd})` : ''}`, fill: '#ef4444', fontSize: 10 }} />}
              {maxLimit1 !== undefined && <ReferenceLine y={maxLimit1} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: `${item.maxStdName || 'Standard MAX'} ${item.maxStd !== undefined ? `(${item.maxStd})` : ''}`, fill: '#ef4444', fontSize: 10 }} />}
              <Line type="monotone" dataKey="value1" name={item.valName || `Value (${unit})`} stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              {item.val2 !== undefined && (
                <>
                  {minLimit2 !== undefined && <ReferenceLine y={minLimit2} stroke="orange" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: `${item.minStd2Name || 'Standard MIN'} ${item.minStd2 !== undefined ? `(${item.minStd2})` : ''}`, fill: 'orange', fontSize: 10 }} />}
                  {maxLimit2 !== undefined && <ReferenceLine y={maxLimit2} stroke="orange" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: `${item.maxStd2Name || 'Standard MAX'} ${item.maxStd2 !== undefined ? `(${item.maxStd2})` : ''}`, fill: 'orange', fontSize: 10 }} />}
                  <Line type="monotone" dataKey="value2" name={item.val2Name || `Value 2 (${unit})`} stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AreaCard({ area }: { area: AreaDef }) {
  const isPtedWrapper = area.type === "pted-wrapper";
  const [bagFilterTab, setBagFilterTab] = useState("pre-treatment");

  const getLimitColor = (val: string | number | undefined, min: number, max: number, defaultClass: string = "text-foreground", okClass?: string) => {
    if (val === undefined) return defaultClass;
    const v = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(v)) return defaultClass;
    if (v < min || v > max) return "text-destructive font-bold";
    return okClass || defaultClass;
  };

  const content = (
    <Panel
      className={`h-full flex flex-col ${!isPtedWrapper ? 'hover:border-primary/50 transition-colors' : ''}`}
      bodyClassName={isPtedWrapper || area.type === "boiler" ? 'flex-1 flex flex-col' : ''}
      title={area.name}
      right={
        !isPtedWrapper && (
          <div className="flex items-center gap-3">
            {area.type === "boiler" && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[7px] md:text-[9px] xl:text-[11px] font-bold text-muted-foreground uppercase tracking-tighter sm:tracking-widest hidden sm:inline">Panel Burner Status</span>
                <span className="text-[7px] md:text-[9px] xl:text-[11px] font-bold text-muted-foreground uppercase tracking-tighter sm:tracking-widest sm:hidden">Status</span>
                <span className="text-[8px] sm:text-[10px] xl:text-[11px] px-1.5 sm:px-2.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">ON</span>
              </div>
            )}
            {area.type === "oven" && area.oven && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[7px] md:text-[9px] xl:text-[11px] font-bold text-muted-foreground uppercase tracking-tighter sm:tracking-widest">Status <span className="hidden sm:inline">Oven</span></span>
                <span className={`text-[8px] sm:text-[10px] xl:text-[11px] px-1.5 sm:px-2.5 py-0.5 rounded font-bold ${area.oven.running ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                  {area.oven.running ? 'ON' : 'OFF'}
                </span>
              </div>
            )}
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        )
      }
    >
      {area.type === "boiler" && (
        <div className="flex flex-col flex-1 gap-2 mt-2">
          {BOILERS.map((b) => (
            <div key={b.id} className="flex-1 rounded-md bg-background p-3 border border-border/50 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold flex items-center gap-1.5">
                  <Flame className={`h-4 w-4 ${b.running ? 'text-emerald-500' : 'text-gray-400'}`} /> {b.name}
                  {b.id === 1 && <span className="ml-2 text-[11px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">OK</span>}
                  {b.id === 2 && <span className="ml-2 text-[11px] px-2 py-0.5 rounded font-bold bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">OK</span>}
                  {b.id === 3 && <span className="ml-2 text-[11px] px-2 py-0.5 rounded font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">NG</span>}
                </span>

                <div className="flex gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono items-center flex-wrap justify-end">
                  <span className="text-muted-foreground flex items-baseline gap-1 sm:gap-2">T1 <span className={`font-bold text-base sm:text-lg xl:text-2xl ${getLimitColor(b.temp1, 175, 188, "text-foreground", "text-emerald-500")}`}>{b.temp1.toFixed(1)}°C</span></span>
                  <span className="text-muted-foreground flex items-baseline gap-1 sm:gap-2">T2 <span className={`font-bold text-base sm:text-lg xl:text-2xl ${getLimitColor(b.temp2, 175, 188, "text-foreground", "text-emerald-500")}`}>{b.temp2.toFixed(1)}°C</span></span>
                </div>
              </div>

              <div className="mt-4 w-full">
                <div className="flex flex-col gap-2.5 w-full">
                  <div className="bg-secondary/30 border border-border/50 rounded-lg flex">
                    <div className="flex-1 p-2 flex flex-col gap-1 border-r border-border/50">
                      <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                        <Activity className="w-3 h-3 text-muted-foreground/70" /> Status
                      </div>
                      <div className="pl-4.5 mt-0.5">
                        <span className={`text-[9px] sm:text-[10px] xl:text-[11px] px-1.5 sm:px-2 py-0.5 rounded font-bold ${b.running ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {b.running ? "ON" : "OFF"}
                        </span>
                      </div>
                    </div>
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
                  <span className={`text-2xl font-semibold tabular-nums ${getLimitColor(area.largeTank?.pv, parseFloat(area.largeTank?.sp || "0") - 2, parseFloat(area.largeTank?.sp || "0") + 2)}`}>{area.largeTank?.pv}</span>
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
                  <span className={`text-2xl font-semibold tabular-nums ${getLimitColor(area.smallTank?.pv, parseFloat(area.smallTank?.sp || "0") - 2, parseFloat(area.smallTank?.sp || "0") + 2)}`}>{area.smallTank?.pv}</span>
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
        <div className={`grid ${area.id === "oven-ced" ? "grid-cols-2" : "grid-cols-3"} gap-2 mt-2`}>
          <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Zap className="h-3 w-3" /> Power Panel</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold font-mono ${area.oven.running ? "text-emerald-500" : "text-muted-foreground"}`}>
                {area.id === "oven-ced" ? "98.2" : area.id === "oven-sealing" ? "124.5" : "145.0"}
              </span>
              <span className="text-[10px] text-muted-foreground">kWh</span>
            </div>
          </div>
          {area.id !== "oven-ced" && (
            <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temp</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold font-mono ${getLimitColor(area.oven.temp1, 180, 190, "text-emerald-500", "text-emerald-500")}`}>{area.oven.temp1}</span>
                <span className="text-[10px] text-muted-foreground">°C</span>
              </div>
            </div>
          )}
          <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Gauge className="h-3 w-3" /> Pressure</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold font-mono ${getLimitColor(area.oven.pressure, 2.0, 2.5, "text-emerald-500", "text-emerald-500")}`}>{area.oven.pressure}</span>
              <span className="text-[10px] text-muted-foreground">MPa</span>
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
              <span className="text-xs text-muted-foreground">MPa</span>
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
                  <span className="text-[9px] text-muted-foreground">MPa</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-muted-foreground/80 text-[9px] uppercase">OUT</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-semibold tabular-nums text-blue-500">{area.pted.pressureOut}</span>
                  <span className="text-[9px] text-muted-foreground">MPa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {area.type === "pted-wrapper" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 h-full">
          {/* PTED Equipment Card */}
          <div className="border border-border/50 rounded-lg p-4 bg-background flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Activity className="h-4 w-4" /> PTED Equipment</h3>
              <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 border border-orange-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                Fluid Temperature
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { name: "Flood Station", id: "flood-station", pv: "30.1", sp: "30.0", bgClass: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20" },
                { name: "Pre-Degreasing", id: "pre-degreasing", pv: "46.2", sp: "45.0", bgClass: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20" },
                { name: "Degreasing", id: "degreasing", pv: "35.0", sp: "35.0", bgClass: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20" },
                { name: "Phosphate", id: "phosphate", pv: "42.5", sp: "42.0", bgClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20" }
              ].map(eq => (
                <Link to="/monitoring-area/$id" params={{ id: eq.id }} key={eq.name} className={`flex-1 flex items-center justify-between p-3 rounded-lg border transition-all group ${eq.bgClass}`}>
                  <span className="text-sm font-semibold flex items-center gap-2">{eq.name} <ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" /></span>
                  <div className="flex gap-5">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] uppercase flex items-center gap-1 opacity-70"><Thermometer className="h-3 w-3" /> Temp PV</span>
                      <div className="flex items-baseline gap-1 mt-0.5"><span className={`font-mono font-bold text-lg md:text-xl xl:text-3xl ${getLimitColor(eq.pv, parseFloat(eq.sp) - 2, parseFloat(eq.sp) + 2, "text-foreground", "text-emerald-500")}`}>{eq.pv}</span><span className="text-xs sm:text-sm opacity-70">°C</span></div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] uppercase flex items-center gap-1 opacity-70"><Thermometer className="h-3 w-3" /> Temp SP</span>
                      <div className="flex items-baseline gap-1 mt-0.5"><span className="font-mono font-bold text-lg md:text-xl xl:text-3xl text-foreground">{eq.sp}</span><span className="text-xs sm:text-sm opacity-70">°C</span></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bag Filter Card */}
          <div className="border border-border/50 rounded-lg p-4 bg-background flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <Link to="/monitoring-area/$id" params={{ id: "bag-filter" }} className="w-fit group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <Filter className="h-4 w-4" /> Bag Filter <ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </h3>
              </Link>
              <div className="flex bg-secondary/50 p-0.5 rounded-md items-center shadow-sm border border-border/50">
                <button onClick={(e) => { e.preventDefault(); setBagFilterTab("pre-treatment"); }} className={`text-[9px] sm:text-[10px] px-2 py-1 rounded-sm font-medium transition-colors ${bagFilterTab === 'pre-treatment' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Pre-Treatment</button>
                <button onClick={(e) => { e.preventDefault(); setBagFilterTab("ced"); }} className={`text-[9px] sm:text-[10px] px-2 py-1 rounded-sm font-medium transition-colors ${bagFilterTab === 'ced' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>CED Line</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {[
                { name: "WR 5", val: "45.5", id: "bag-filter-wr5", minStd: 20, maxStd: 35, unit: "MPa", line: "pre-treatment", bgClass: "bg-blue-300/10 border-blue-400/30 text-black-700 dark:text-blue-400" },
                { name: "Pre Degreasing", val: "45.5", id: "bag-filter-pre-deg", minStd: 20, maxStd: 35, unit: "MPa", line: "pre-treatment", bgClass: "bg-purple-300/10 border-black-500/30 text-black-700 dark:text-purple-400" },
                { name: "Degreasing", val: "34.8", id: "bag-filter-deg", minStd: 20, maxStd: 35, unit: "MPa", line: "pre-treatment", bgClass: "bg-amber-300/10 border-amber-500/30 text-black-700 dark:text-amber-400" },
                { name: "Pressure IN", val: "34.8", id: "bag-filter-pressure-in", minStd: 20, maxStd: 35, unit: "MPa", line: "pre-treatment", bgClass: "bg-red-300/10 border-red-500/30 text-black-700 dark:text-red-400", groupTitle: "Phosphating" },
                { name: "Pressure OUT", val: "34.8", id: "bag-filter-pressure-out", minStd: 20, maxStd: 35, unit: "MPa", line: "pre-treatment", bgClass: "bg-red-300/10 border-red-500/30 text-black-700 dark:text-red-400" },
                { name: "DI 1", val: "25.0", id: "bag-filter-di1", minStd: 20, maxStd: 35, unit: "MPa", line: "ced", bgClass: "bg-cyan-300/10 border-cyan-500/30 text-black-700 dark:text-cyan-400" },
                { name: "DI 2", val: "25.1", id: "bag-filter-di2", minStd: 20, maxStd: 35, unit: "MPa", line: "ced", bgClass: "bg-cyan-300/10 border-cyan-500/30 text-black-700 dark:text-cyan-400" },
                { name: "Pressure UF 1", val: "25.1", id: "bag-filter-pressure-uf1", minStd: 20, maxStd: 35, unit: "MPa", line: "ced", bgClass: "bg-red-300/10 border-red-500/30 text-black-700 dark:text-red-400" },
                { name: "Conductivity UF 1", val: "25.1", id: "bag-filter-conductivity-uf1", minStd: 20, maxStd: 35, unit: "µS", line: "ced", bgClass: "bg-red-300/10 border-red-500/30 text-black-700 dark:text-red-400" },
                { name: "UF Module", val: "25.1", id: "bag-filter-ufmodule", minStd: 20, maxStd: 35, unit: "L/Min", line: "ced", bgClass: "bg-red-300/10 border-red-500/30 text-black-700 dark:text-red-400" },

                { name: "Pressure UF 2", val: "25.1", id: "bag-filter-pressure-uf2", minStd: 20, maxStd: 35, unit: "MPa", line: "ced", bgClass: "bg-green-300/10 border-green-500/30 text-black-700 dark:text-green-400" },
                { name: "Conductivity UF 2", val: "25.1", id: "bag-filter-conductivity-uf2", minStd: 20, maxStd: 35, unit: "µS", line: "ced", bgClass: "bg-green-300/10 border-green-500/30 text-black-700 dark:text-green-400" },
                { name: "CED 1", val: "28.5", id: "bag-filter-ced1", minStd: 20, maxStd: 35, unit: "MPa", line: "ced", bgClass: "bg-indigo-300/10 border-indigo-500/30 text-black-700 dark:text-indigo-400" },
                { name: "CED 2", val: "28.3", id: "bag-filter-ced2", minStd: 20, maxStd: 35, unit: "MPa", line: "ced", bgClass: "bg-violet-300/10 border-violet-500/30 text-black-700 dark:text-violet-400" },
                { name: "Fluid Level", val: "28.5", id: "bag-filter-fluid-level", minStd: 20, maxStd: 35, unit: "mm", line: "ced", bgClass: "bg-indigo-300/10 border-indigo-500/30 text-black-700 dark:text-indigo-400" }
              ].filter(t => t.line === bagFilterTab).map(t => [
                t.groupTitle ? (
                  <div key={`${t.name}-title`} className="col-span-2 mt-1.5 mb-0.5 px-0.5 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.groupTitle}</span>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                ) : null,
                <div key={t.name} className={`flex flex-col text-left p-2.5 rounded border justify-center gap-0.5 w-full ${t.bgClass} ${t.name === 'Degreasing' ? 'col-span-2' : ''}`}>
                  <span className="text-[10px] uppercase tracking-wider font-medium opacity-80">{t.name}</span>
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-mono text-3xl font-bold ${getLimitColor(t.val, 20, 35, "text-emerald-500")}`}>{t.val}</span>
                      <span className="text-sm opacity-70">{t.unit || "°C"}</span>
                    </div>
                    {t.val2 && (
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] uppercase opacity-70 mb-0.5">{t.label2}</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className={`font-mono text-2xl font-bold ${getLimitColor(t.val2, t.minStd2 || 0, t.maxStd2 || 100, "text-emerald-500")}`}>{t.val2}</span>
                          <span className="text-[10px] opacity-70">{t.unit2}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ])}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
            </div>
          </div>
        </div>
      )}

    </Panel>
  );

  if (isPtedWrapper) {
    return <div className="block h-full">{content}</div>;
  }

  return (
    <Link to="/monitoring-area/$id" params={{ id: area.id }} className="block group h-full">
      {content}
    </Link>
  );
}

function MonitoringArea() {
  const col1Areas = ["boiler-area"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];
  const ptedArea = AREAS.find(a => a.id === "pted-area");
  const ovenAreas = ["oven-sealing", "oven-topcoat", "oven-ced"].map(id => AREAS.find(a => a.id === id)).filter(Boolean) as AreaDef[];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold mt-1 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" /> Monitoring Area
          </h1>
        </div>
      </div>
      {/* Layout Grid */}
      <div className="flex flex-col gap-6">
        {/* Top Section */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Column 1: Boiler Area */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {col1Areas.map(area => <AreaCard key={area.id} area={area} />)}
          </div>

          {/* Column 2: PTED Area */}
          <div className="flex flex-col gap-4 lg:col-span-3 h-full">
            {ptedArea && <AreaCard area={ptedArea} />}
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
