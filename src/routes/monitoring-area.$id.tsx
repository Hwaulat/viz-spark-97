import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, Activity, Flame, Gauge, Power, BarChart3, Filter } from "lucide-react";
import { BOILERS, BOILER_GAS, BOILER_USAGE_HISTORY } from "@/lib/mock-data";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/monitoring-area/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Monitoring Details — ${params.id}` },
      { name: "description", content: `Monitoring details for ${params.id}` },
    ],
  }),
  component: MonitoringAreaDetails,
});

function MonitoringAreaDetails() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState("Boiler Monitoring");
  const [timeFilter, setTimeFilter] = useState<"daily" | "monthly" | "yearly">("daily");

  const usageData = useMemo(() => BOILER_USAGE_HISTORY[timeFilter], [timeFilter]);
  const summary = useMemo(() => {
    const totalEnergy = usageData.reduce((acc, cur) => acc + cur.energy, 0);
    const totalGas = usageData.reduce((acc, cur) => acc + cur.gas, 0);
    return {
      totalEnergy,
      avgEnergy: Math.round(totalEnergy / usageData.length),
      totalGas,
      avgGas: Math.round(totalGas / usageData.length),
    };
  }, [usageData]);

  // Format the ID back to a readable name
  const name = id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link
            to="/monitoring-area"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Monitoring Area
          </Link>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Area Details
          </div>
          <h1 className="text-2xl font-semibold mt-1 inline-flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> {name}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Detailed parameter monitoring for this section will be displayed here.
          </p>
        </div>
      </div>

      {id === "boiler-area" ? (
        <div className="space-y-6">
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

          {/* Tabbed Section inside a Card */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex border-b border-border/50 bg-secondary/10 px-2 pt-2">
              {["Boiler Monitoring", "Cummulative Usage", "Historical Charts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "Boiler Monitoring" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {BOILERS.map((b) => (
                <div key={b.id} className="flex flex-col items-center">
                  {/* Tank illustration (Cylinder with rims) */}
                  <div className="relative w-48 flex flex-col items-center">
                    {/* Top Rim */}
                    <div className={`w-[108%] h-10 border-2 rounded-[50%] z-20 -mb-5 shadow-sm relative ${
                      b.running
                        ? "bg-gradient-to-b from-emerald-300 to-emerald-500 dark:from-emerald-700 dark:to-emerald-900 border-emerald-500 dark:border-emerald-800"
                        : "bg-gradient-to-b from-gray-300 to-gray-400 dark:from-slate-600 dark:to-slate-700 border-gray-400 dark:border-slate-800"
                    }`}>
                       <div className="absolute inset-1 rounded-[50%] border-t border-white/50"></div>
                    </div>
                    
                    {/* Body */}
                    <div className={`relative w-full h-[280px] border-x-2 flex flex-col items-center pt-8 pb-8 px-4 z-10 overflow-hidden ${
                      b.running
                        ? "border-emerald-500 dark:border-emerald-800 bg-gradient-to-r from-emerald-200 via-emerald-50 to-emerald-300 dark:from-emerald-800 dark:via-emerald-700 dark:to-emerald-900"
                        : "border-gray-400 dark:border-slate-800 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 dark:from-slate-700 dark:via-slate-500 dark:to-slate-800"
                    }`}>
                      {/* Sub-body gradient to give cylinder feel */}
                      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

                      {/* Fire glow at bottom if running */}
                      {b.running && (
                        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-emerald-400/60 via-emerald-400/10 to-transparent pointer-events-none" />
                      )}

                      <div className="text-lg font-bold flex flex-col items-center gap-1.5 z-10 text-slate-800 dark:text-slate-100 mt-2">
                        <Flame className={`h-7 w-7 ${b.running ? 'text-emerald-600 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-gray-500'}`} />
                        {b.name}
                      </div>

                      <div className="mt-5 flex flex-col gap-2 w-full text-center text-sm font-mono bg-background/70 backdrop-blur-md rounded-xl p-3 shadow-md z-10 border-t border-white/40 dark:border-white/10">
                        <div className="text-muted-foreground text-[10px] uppercase tracking-wider mb-0.5">Temperature</div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground text-xs">T1</span>
                          <span className="font-bold text-base">{b.temp1.toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-border/40">
                          <span className="text-muted-foreground text-xs">T2</span>
                          <span className="font-bold text-base">{b.temp2.toFixed(1)}°C</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Rim */}
                    <div className={`w-[108%] h-10 border-2 rounded-[50%] z-20 -mt-5 relative ${
                      b.running
                        ? "bg-gradient-to-b from-emerald-400 to-emerald-600 dark:from-emerald-800 dark:to-emerald-950 border-emerald-500 dark:border-emerald-800"
                        : "bg-gradient-to-b from-gray-400 to-gray-500 dark:from-slate-700 dark:to-slate-800 border-gray-400 dark:border-slate-800"
                    }`}>
                       <div className="absolute inset-1 rounded-[50%] border-t border-white/30"></div>
                    </div>
                    
                    {/* Base shadow/curve and Status Badge */}
                    <div className="w-[50%] h-12 bg-slate-500 dark:bg-slate-900 rounded-b-[50%] z-30 -mt-7 border-b-[3px] border-slate-600 dark:border-black flex flex-col justify-end items-center pb-0.5 shadow-lg relative">
                      <div className="absolute -top-3 bg-background/90 px-3 py-1 rounded-full shadow-md backdrop-blur-sm border border-border/50 flex items-center gap-2">
                        <StatusDot state={b.running ? "on" : "off"} />
                        <span className="text-xs font-bold font-mono tracking-widest">{b.running ? "ON" : "OFF"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details underneath the tank */}
                  <div className="mt-5 w-full space-y-3 bg-secondary/20 p-4 rounded-xl border border-border/50 shadow-sm">
                    <div className="flex flex-col text-sm border-b border-border/40 pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-muted-foreground">Boiler Status</span>
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold tracking-wider ${b.running ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>{b.running ? "ON" : "OFF"}</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1 bg-background/50 rounded-lg p-2 border border-border/30">
                        <div className="flex flex-col gap-1.5 text-muted-foreground">
                          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"><Power className="h-3.5 w-3.5 text-emerald-500" /> Start</span>
                          <span className="text-foreground font-mono font-medium">{b.onTime}</span>
                        </div>
                        <div className="w-px bg-border/50 my-1" />
                        <div className="flex flex-col gap-1.5 text-muted-foreground">
                          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"><Power className="h-3.5 w-3.5 text-destructive" /> Stop</span>
                          <span className="text-foreground font-mono font-medium">{b.offTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30 text-xs">
                          <span className="text-muted-foreground">Total Duration</span>
                          <span className="text-foreground font-mono font-semibold text-primary">{b.boilerDuration}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col text-sm border-b border-border/40 pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-muted-foreground">Burner Status</span>
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold tracking-wider ${b.fireBurner ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-muted text-muted-foreground'}`}>{b.fireBurner ? "ON" : "OFF"}</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1 bg-background/50 rounded-lg p-2 border border-border/30">
                        <div className="flex flex-col gap-1.5 text-muted-foreground">
                          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"><Flame className="h-3.5 w-3.5 text-orange-500" /> Start</span>
                          <span className="text-foreground font-mono font-medium">{b.burnerOnTime}</span>
                        </div>
                        <div className="w-px bg-border/50 my-1" />
                        <div className="flex flex-col gap-1.5 text-muted-foreground">
                          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"><Flame className="h-3.5 w-3.5 text-gray-500" /> Stop</span>
                          <span className="text-foreground font-mono font-medium">{b.burnerOffTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30 text-xs">
                          <span className="text-muted-foreground">Total Duration</span>
                          <span className="text-foreground font-mono font-semibold text-orange-500 dark:text-orange-400">{b.burnerDuration}</span>
                      </div>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Cummulative Usage" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-secondary/30 p-2 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-sm font-medium px-2 text-muted-foreground">
                  <Filter className="h-4 w-4" /> Filter by:
                </div>
                <div className="flex gap-1">
                  {(["daily", "monthly", "yearly"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeFilter(t)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                        timeFilter === t
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Panel className="p-4" title={<span className="text-muted-foreground">Total Energy</span>} subtitle={`${timeFilter} aggregate`}>
                  <div className="mt-2 text-2xl font-bold font-mono text-blue-500">
                    {summary.totalEnergy.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                  </div>
                </Panel>
                <Panel className="p-4" title={<span className="text-muted-foreground">Avg Energy / {timeFilter.replace('ly', '')}</span>} subtitle={`Average per ${timeFilter.replace('ly', '')}`}>
                  <div className="mt-2 text-2xl font-bold font-mono text-blue-400">
                    {summary.avgEnergy.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                  </div>
                </Panel>
                <Panel className="p-4" title={<span className="text-muted-foreground">Total Gas</span>} subtitle={`${timeFilter} aggregate`}>
                  <div className="mt-2 text-2xl font-bold font-mono text-emerald-500">
                    {summary.totalGas.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">m³</span>
                  </div>
                </Panel>
                <Panel className="p-4" title={<span className="text-muted-foreground">Avg Gas / {timeFilter.replace('ly', '')}</span>} subtitle={`Average per ${timeFilter.replace('ly', '')}`}>
                  <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
                    {summary.avgGas.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">m³</span>
                  </div>
                </Panel>
              </div>

              <Panel
                title={<span className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Combine Usage Trend</span>}
                subtitle={`Energy and Gas usage trend over the selected ${timeFilter} timeframe`}
              >
                <div className="h-[350px] mt-4 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                      <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", borderColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                        formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Line yAxisId="left" type="monotone" name="Energy (kWh)" dataKey="energy" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                      <Line yAxisId="right" type="monotone" name="Gas (m³)" dataKey="gas" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>
          )}

              {activeTab === "Historical Charts" && (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground bg-secondary/20">
                  <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm font-medium">Historical Trend Charts</p>
                  <p className="text-xs mt-1">Temperature and flow rate historical charts will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Placeholder Content */
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground bg-secondary/20">
          <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm font-medium">Empty Section</p>
          <p className="text-xs mt-1">Data and charts are currently being prepared.</p>
        </div>
      )}
    </div>
  );
}
