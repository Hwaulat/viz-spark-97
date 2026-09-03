import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
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
  { id: "oven-sealing", name: "Oven Sealing", type: "oven", oven: { temp1: "186.5", temp2: "184.0", pressure: "2.1" } },
  { id: "oven-topcoat", name: "Oven Topcoat", type: "oven", oven: { temp1: "191.0", temp2: "189.5", pressure: "2.4" } },
  { id: "oven-ced", name: "Oven CED", type: "oven", oven: { temp1: "182.0", temp2: "179.0", pressure: "2.8" } },
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
                !isPtedWrapper && <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              }
            >
              {area.type === "boiler" && (
                <div className="flex flex-col flex-1 gap-2 mt-2">
                  {BOILERS.map((b) => (
                    <div key={b.id} className="flex-1 rounded-md bg-background p-3 border border-border/50 shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold flex items-center gap-1.5">
                          <Flame className={`h-4 w-4 ${b.running ? 'text-emerald-500' : 'text-gray-400'}`} /> {b.name}
                          {b.id === 1 && <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">OK</span>}
                          {b.id === 2 && <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded font-bold bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">OK</span>}
                          {b.id === 3 && <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">NG</span>}
                        </span>
                        <div className="flex gap-4 text-xs font-mono items-center">
    <span className="text-muted-foreground flex items-baseline gap-2">T1 <span className={`font-bold text-2xl ${getLimitColor(b.temp1, 175, 188, "text-foreground", "text-emerald-500")}`}>{b.temp1.toFixed(1)}°C</span></span>
    <span className="text-muted-foreground flex items-baseline gap-2">T2 <span className={`font-bold text-2xl ${getLimitColor(b.temp2, 175, 188, "text-foreground", "text-emerald-500")}`}>{b.temp2.toFixed(1)}°C</span></span>
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
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temp 1</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-bold font-mono ${getLimitColor(area.oven.temp1, parseFloat(area.oven.temp1) - 5, parseFloat(area.oven.temp1) + 5)}`}>{area.oven.temp1}</span>
                      <span className="text-[10px] text-muted-foreground">°C</span>
                    </div>
                  </div>
                  <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temp 2</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-bold font-mono ${getLimitColor(area.oven.temp2, parseFloat(area.oven.temp2) - 5, parseFloat(area.oven.temp2) + 5)}`}>{area.oven.temp2}</span>
                      <span className="text-[10px] text-muted-foreground">°C</span>
                    </div>
                  </div>
                  <div className="rounded bg-secondary/50 p-2 border border-border/50 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><Gauge className="h-3 w-3" /> Pressure</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-bold font-mono ${getLimitColor(area.oven.pressure, 1.8, 3.0)}`}>{area.oven.pressure}</span>
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

              {area.type === "pted-wrapper" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 h-full">
                  {/* PTED Equipment Card */}
                  <div className="border border-border/50 rounded-lg p-4 bg-background flex flex-col h-full">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5"><Activity className="h-4 w-4" /> PTED Equipment</h3>
                    <div className="flex flex-col gap-3 flex-1">
                      {[
                        { name: "Flood Station", id: "flood-station", pv: "30.1", sp: "30.0" },
                        { name: "Pree Degreasing", id: "pree-degreasing", pv: "46.2", sp: "45.0" },
                        { name: "Degreasing", id: "degreasing", pv: "35.0", sp: "35.0" },
                        { name: "Phosphate", id: "phosphate", pv: "42.5", sp: "42.0" }
                      ].map(eq => (
                        <Link to="/monitoring-area/$id" params={{ id: eq.id }} key={eq.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 flex-1 hover:bg-secondary/80 hover:border-primary/50 transition-all group">
                          <span className="text-sm font-semibold group-hover:text-primary transition-colors flex items-center gap-2">{eq.name} <ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" /></span>
                          <div className="flex gap-5">
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temp PV</span>
                              <div className="flex items-baseline gap-1 mt-0.5"><span className={`font-mono font-bold text-3xl ${getLimitColor(eq.pv, parseFloat(eq.sp) - 2, parseFloat(eq.sp) + 2, "text-foreground", "text-emerald-500")}`}>{eq.pv}</span><span className="text-sm text-muted-foreground">°C</span></div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temp SP</span>
                              <div className="flex items-baseline gap-1 mt-0.5"><span className="font-mono font-bold text-3xl text-foreground">{eq.sp}</span><span className="text-sm text-muted-foreground">°C</span></div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Bag Filter Card */}
                  <div className="border border-border/50 rounded-lg p-4 bg-background flex flex-col h-full">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Filter className="h-4 w-4" /> Bag Filter
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4 flex-1">
                      {[
                        { name: "Pre Degreasing", val: "45.5", id: "bag-filter-pre-deg", minStd: 20, maxStd: 35 },
                        { name: "Degreasing", val: "34.8", id: "bag-filter-deg", minStd: 20, maxStd: 35 },
                        { name: "DI 1", val: "25.0", id: "bag-filter-di1", minStd: 20, maxStd: 35 },
                        { name: "DI 2", val: "25.1", id: "bag-filter-di2", minStd: 20, maxStd: 35 },
                        { name: "WR 5", val: "24.9", id: "bag-filter-wr5", minStd: 20, maxStd: 35 },
                        { name: "CED 1", val: "28.5", id: "bag-filter-ced1", minStd: 20, maxStd: 35 },
                        { name: "CED 2", val: "28.3", id: "bag-filter-ced2", minStd: 20, maxStd: 35 },
                        { name: "UF 1", val: "26.2", id: "bag-filter-uf1", minStd: 20, maxStd: 35 },
                        { name: "UF 2", val: "26.0", id: "bag-filter-uf2", minStd: 20, maxStd: 35 }

                      ].map(t => (
                        <BagFilterItemDialog key={t.name} item={t}>
                          <button className="flex flex-col text-left p-3 rounded bg-secondary/30 border border-border/50 justify-center gap-1 hover:border-primary/50 hover:bg-secondary/80 transition-colors group w-full">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium group-hover:text-primary transition-colors">{t.name}</span>
                            <div className="flex items-baseline gap-1">
                              <span className={`font-mono text-3xl font-bold ${getLimitColor(t.val, 20, 35, "text-emerald-500")}`}>{t.val}</span>
                              <span className="text-sm text-muted-foreground">°C</span>
                            </div>
                          </button>
                        </BagFilterItemDialog>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="col-span-2">
                        <BagFilterItemDialog item={{ name: "UF 1 & UF 2 Tank", val: "120.5", val2: "118.2", id: "bag-filter-uf-tank", unit: "µS/cm", valName: "UF 1 Cond", val2Name: "UF 2 Cond", minStd: 100, maxStd: 150, minStd2: 100, maxStd2: 150, minStdName: "Standard Conductivity 1 MIN", maxStdName: "Standard Conductivity 1 MAX", minStd2Name: "Standard Conductivity 2 MIN", maxStd2Name: "Standard Conductivity 2 MAX" }}>
                        <button className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex flex-col gap-2 hover:border-primary/50 hover:bg-secondary/80 transition-colors group text-left w-full h-full">
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5 border-b border-border/50 pb-2 group-hover:text-primary transition-colors"><Waves className="h-3.5 w-3.5" /> UF 1 & 2 Tank</span>
                          <div className="flex justify-between mt-1 items-end h-full">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-muted-foreground mb-0.5">UF 1</span>
                              <div className="flex items-baseline gap-1 whitespace-nowrap">
                                <span className={`font-mono text-3xl font-bold ${getLimitColor("120.5", 100, 150)}`}>120.5</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] text-muted-foreground mb-0.5">UF 2</span>
                              <div className="flex items-baseline gap-1 whitespace-nowrap">
                                <span className={`font-mono text-3xl font-bold ${getLimitColor("118.2", 100, 150, "text-blue-500")}`}>118.2</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </BagFilterItemDialog>
                      </div>
                      
                      <BagFilterItemDialog item={{ name: "UF Module", val: "15.0", id: "bag-filter-uf-module", unit: "L/Min", minStd: 10, maxStd: 20 }}>
                        <button className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex flex-col gap-2 hover:border-primary/50 hover:bg-secondary/80 transition-colors group text-left w-full h-full">
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5 border-b border-border/50 pb-2 group-hover:text-primary transition-colors"><Waves className="h-3.5 w-3.5" /> UF Module</span>
                          <div className="flex flex-col mt-1">
                            <span className="text-[9px] text-muted-foreground mb-0.5">Flowmeter</span>
                            <div className="flex items-baseline gap-1 whitespace-nowrap">
                              <span className={`font-mono text-3xl font-bold ${getLimitColor("15.0", 10.0, 20.0, "text-emerald-500")}`}>15.0</span>
                              <span className="text-xs font-normal text-muted-foreground">L/Min</span>
                            </div>
                          </div>
                        </button>
                      </BagFilterItemDialog>
                    </div>

                    <div className="mt-auto">
                      <BagFilterItemDialog item={{ name: "HE Pressure", val: "4.5", val2: "3.2", id: "bag-filter-he-pressure", unit: "bar", valName: "IN (bar)", val2Name: "OUT (bar)", minStd: 4.0, maxStd: 5.0, minStd2: 2.0, maxStd2: 4.0 }}>
                        <button className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex flex-col gap-2 hover:border-primary/50 hover:bg-secondary/80 transition-colors group text-left w-full h-full">
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5 border-b border-border/50 pb-2 group-hover:text-primary transition-colors"><Gauge className="h-3.5 w-3.5" /> HE Pressure</span>
                          <div className="flex justify-between mt-1 items-end h-full">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-muted-foreground mb-0.5">IN</span>
                              <div className="flex items-baseline gap-1 whitespace-nowrap">
                                <span className={`font-mono text-3xl font-bold ${getLimitColor("4.5", 4.0, 5.0)}`}>4.5</span>
                                <span className="text-xs font-normal text-muted-foreground">bar</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] text-muted-foreground mb-0.5">OUT</span>
                              <div className="flex items-baseline gap-1 whitespace-nowrap">
                                <span className={`font-mono text-3xl font-bold ${getLimitColor("3.2", 2.0, 4.0, "text-blue-500")}`}>3.2</span>
                                <span className="text-xs font-normal text-muted-foreground/70">bar</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </BagFilterItemDialog>
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
          
          {/* Column 2 & 3: PTED Area */}
          <div className="flex flex-col gap-4 lg:col-span-2 h-full">
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
