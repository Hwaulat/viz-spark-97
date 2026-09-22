import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronLeft, Activity, Flame, Gauge, Power, BarChart3, Filter, Waves, Zap, Thermometer, DollarSign, Fuel, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ChevronDown, Calendar, Eye, Download, Pencil, Trash2, X } from "lucide-react";
import { Search } from "@/components/ui/search";
import { SelectInput } from "@/components/ui/select-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BOILERS, BOILER_GAS, BOILER_USAGE_HISTORY, BOILER_LOG_HISTORY, ENERGY_PRICE_PER_KWH, GAS_PRICE_PER_MMBTU, LINE_TRACKING_STATIONS, LINE_TRACKING_ZONES, PROCESS_DETAIL_STATIONS, ovenElecDailyTrend, ovenElecMonthlyTrend, ovenElecYearlyTrend } from "@/lib/mock-data";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import { Tabs } from "@/components/tabs";
import { StatCardGrid } from "@/components/stat-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs as RawTabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, THead, TBody, Th, Tr, Td } from "@/components/ui/table";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LineTrackingPng from "@/assets/Line Tracking.png";
import StationPreDegreasingPng from "@/assets/Pre-Degreasing.png";
import StationFloodPng from "@/assets/Flood.png";
import StationPhosphatePng from "@/assets/Phosphate.png";
import StationDegreasingPng from "@/assets/Degreasing.png";
import StationDegreasingNewPng from "@/assets/Degreasing.png";
import Boiler1Png from "@/assets/Boiler 1.png";
import Boiler2Png from "@/assets/Boiler 2.png";
import Boiler3Png from "@/assets/Boiler 3.png";
import DenahFixPng from "@/assets/Denah Fix.png";
export const Route = createFileRoute("/monitoring-area/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Monitoring Details — ${params.id}` },
      { name: "description", content: `Monitoring details for ${params.id}` },
    ],
  }),
  component: MonitoringAreaDetails,
});


const NEW_LOG_HISTORY = [
  {
    status: "Open",
    downtime: "No",
    abnormalStatus: "Trouble",
    title: "Wire rope fatique breaks at Crane CC1",
    startingDate: "18/07/2026 13:00:00",
    equipmentN: "OA010311",
  },
  {
    status: "Close Confirm",
    downtime: "Yes",
    abnormalStatus: "Trouble",
    title: "Air Disk Brake for POR RCL Leakage at Diafragh Membran",
    startingDate: "18/07/2026 10:55:00",
    equipmentN: "RR040154",
  }
];



function OvenDetailContent({ id }: { id: string }) {
  const [timeFilter, setTimeFilter] = useState<"daily" | "monthly" | "yearly">("daily");
  const [usageTab, setUsageTab] = useState<"Energy" | "Gas">("Energy");

  const ovenData = useMemo(() => {
    let baseKw = 50;
    let baseVolt = 380;
    let name = "Oven";
    let standard = 185;
    let elec = { amp: { min: "110", act: "125", max: "150" }, volt: { min: "370", act: "380", max: "390" }, kw: "45", kwh: "120", kvar: "12", kvarh: "30", pf: "0.95", h2: "0.5" };

    if (id === "oven-sealing") {
      name = "Oven Sealing";
      baseKw = 45;
      standard = 185;
    } else if (id === "oven-topcoat") {
      name = "Oven Topcoat";
      baseKw = 52;
      standard = 190;
      elec = { amp: { min: "130", act: "145", max: "160" }, volt: { min: "375", act: "382", max: "395" }, kw: "52", kwh: "140", kvar: "15", kvarh: "35", pf: "0.96", h2: "0.4" };
    } else if (id === "oven-ced") {
      name = "Oven CED";
      baseKw = 60;
      standard = 180;
      elec = { amp: { min: "140", act: "155", max: "170" }, volt: { min: "378", act: "385", max: "398" }, kw: "60", kwh: "165", kvar: "18", kvarh: "42", pf: "0.94", h2: "0.6" };
    }

    const data = timeFilter === "daily"
      ? ovenElecDailyTrend(baseKw, baseVolt)
      : timeFilter === "monthly"
        ? ovenElecMonthlyTrend(baseKw, baseVolt)
        : ovenElecYearlyTrend(baseKw, baseVolt);

    return { name, data, elec, standard };
  }, [id, timeFilter]);

  const { name, data, elec, standard } = ovenData;

  const temp1Min = Math.min(...data.map((d: any) => d.temp1));
  const temp1Max = Math.max(...data.map((d: any) => d.temp1));
  const temp2Min = Math.min(...data.map((d: any) => d.temp2));
  const temp2Max = Math.max(...data.map((d: any) => d.temp2));
  const pressureMin = Math.min(...data.map((d: any) => d.pressure));
  const pressureMax = Math.max(...data.map((d: any) => d.pressure));

  const tempMin = Math.min(temp1Min, temp2Min);
  const tempMax = Math.max(temp1Max, temp2Max);

  const chartData = data.map((d: any) => ({
    ...d,
    temp1Min, temp1Max, temp2Min, temp2Max, pressureMin, pressureMax, tempMin, tempMax
  }));

  return (
    <div className="animate-in fade-in duration-300 p-4 xl:p-6 space-y-8">
      {/* Summary Cards */}
      <div className="mb-6">
        <StatCardGrid
          columns={3}
          items={[
            {
              title: "",
              value: (
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-mono font-bold text-2xl">ON</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold tracking-wider uppercase">Running</span>
                    <Link to="/monitoring-area/oven-log-history" className="text-xs text-blue-500 hover:text-blue-600 italic underline ml-auto transition-colors">
                      Log history
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-xs font-mono mt-1">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground/70 text-[9px] uppercase">Time ON</span>
                      <span className="font-bold text-emerald-500 text-sm">06:00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground/70 text-[9px] uppercase">Time OFF</span>
                      <span className="font-bold text-rose-500 text-sm">--:--</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground/70 text-[9px] uppercase">Total Duration</span>
                      <span className="font-bold text-foreground text-sm">8h 15m</span>
                    </div>
                  </div>
                </div>
              ),
              variant: "stat-side",
              icon: <Activity />,
              iconBg: "bg-emerald-500/10 text-emerald-500",
            },
            {
              title: "Temperature",
              value: (
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className={data[data.length - 1]?.temp1 > standard ? 'text-destructive font-mono font-bold text-3xl' : 'text-emerald-500 font-mono font-bold text-3xl'}>{data[data.length - 1]?.temp1?.toFixed(1) || "0.0"}</span>
                    <span className="text-sm text-muted-foreground font-normal">°C</span>
                  </div>
                  <div className="flex gap-3 text-[10px] font-mono font-semibold items-center">
                    <span className="text-emerald-500/90">MIN: {temp1Min.toFixed(1)}</span>
                    <span className="text-rose-500/90">MAX: {temp1Max.toFixed(1)}</span>
                  </div>
                </div>
              ),
              variant: "stat-side",
              icon: <Thermometer />,
              iconBg: "bg-blue-500/10 text-blue-500",
            },
            {
              title: "Pressure",
              value: (
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-foreground font-mono font-bold text-3xl">{data[data.length - 1]?.pressure?.toFixed(2) || "0.00"}</span>
                    <span className="text-sm text-muted-foreground font-normal">MPa</span>
                  </div>
                  <div className="flex gap-3 text-[10px] font-mono font-semibold">
                    <span className="text-emerald-500/90">MIN: {pressureMin.toFixed(2)}</span>
                    <span className="text-rose-500/90">MAX: {pressureMax.toFixed(2)}</span>
                  </div>
                </div>
              ),
              variant: "stat-side",
              icon: <Gauge />,
              iconBg: "bg-amber-500/10 text-amber-500",
            }
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Overview Trends</h2>
          <p className="text-sm text-muted-foreground mt-1">Energy, gas, and power trends for {name}.</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto shrink-0">
          {(["daily", "monthly", "yearly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 transition-colors ${timeFilter === t
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Power Consumption (kW) */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Power Consumption Trend</h2>
          </div>
          <div className="h-[250px] mt-6 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(val) => val.toFixed(0)} label={{ value: 'kW', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#f59e0b', fontSize: 12, fontWeight: 600 } }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="kw" name="Active Power (kW)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorKw)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cumulative Usage */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Cumulative {usageTab} Usage</h2>
            <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto shrink-0">
              {(["Energy", "Gas"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setUsageTab(t)}
                  className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 transition-colors ${usageTab === t
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            {usageTab === "Energy" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(val) => val.toLocaleString()} label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#f59e0b', fontSize: 12, fontWeight: 600 } }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="kwh" name="Energy (kWh)" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(val) => val.toLocaleString()} label={{ value: 'MMBTU', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#10b981', fontSize: 12, fontWeight: 600 } }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="gas" name="Gas (MMBTU)" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Temperature Trend */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Temperature Trend</h2>
          </div>
          <div className="h-[250px] mt-6 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(val) => val.toFixed(0)} label={{ value: '°C', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#ef4444', fontSize: 12, fontWeight: 600 } }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="temp1" name="Temperature (°C)" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tempMin" name="Min" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} opacity={0.6} dot={false} />
                <Line type="monotone" dataKey="tempMax" name="Max" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} opacity={0.6} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pressure Trend */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trend</h2>
          </div>
          <div className="h-[250px] mt-6 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['dataMin - 0.5', 'dataMax + 0.5']} tickFormatter={(val) => val.toFixed(2)} label={{ value: 'MPa', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#8b5cf6', fontSize: 12, fontWeight: 600 } }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="pressure" name="Pressure (MPa)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pressureMin" name="Min" stroke="#8b5cf6" strokeDasharray="3 3" strokeWidth={1.5} opacity={0.6} dot={false} />
                <Line type="monotone" dataKey="pressureMax" name="Max" stroke="#8b5cf6" strokeDasharray="3 3" strokeWidth={1.5} opacity={0.6} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const MINUTE_DATA = Array.from({ length: 30 }, (_, i) => {
  const time = new Date(Date.now() - (29 - i) * 60000);
  return {
    time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp1_b1: +(200 + Math.random() * 20).toFixed(1),
    temp2_b1: +(210 + Math.random() * 20).toFixed(1),
    temp1_b2: +(195 + Math.random() * 20).toFixed(1),
    temp2_b2: +(205 + Math.random() * 20).toFixed(1),
    temp1_b3: +(202 + Math.random() * 20).toFixed(1),
    temp2_b3: +(212 + Math.random() * 20).toFixed(1),
    pressure: +(5 + Math.random() * 2).toFixed(2),
    energy: +(50 + Math.random() * 10).toFixed(1),
    gas: +(30 + Math.random() * 5).toFixed(1),
  };
});

function StationDetailContent({ tabKey }: { tabKey: string }) {
  const data = PROCESS_DETAIL_STATIONS[tabKey as keyof typeof PROCESS_DETAIL_STATIONS] as Record<string, any> | undefined;
  const [timeFilter, setTimeFilter] = useState<"daily" | "monthly" | "yearly">("daily");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const trendData = useMemo(() => {
    if (!data) return [];

    let length = 24;
    let getLabel = (i: number) => {
      if (timeFilter === "daily") {
        return `${i.toString().padStart(2, '0')}:00`;
      } else if (timeFilter === "monthly") {
        return `Day ${i + 1}`;
      } else {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[i];
      }
    };

    if (timeFilter === "daily") length = 24;
    else if (timeFilter === "monthly") length = 30;
    else length = 12;

    return Array.from({ length }, (_, i) => ({
      time: getLabel(i),
      pv: +(parseFloat(data.pv) + (Math.random() * 2 - 1)).toFixed(1),
      sp: parseFloat(data.sp),
    }));
  }, [data, timeFilter]);

  const tableData = useMemo(() => {
    if (!data) return [];
    return Array.from({ length: 10 }, (_, i) => {
      // 16 September 2026, 10:00 (decrementing hour for each row)
      const date = new Date(2026, 8, 16, 10 - i, 0);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      return {
        time: `${day} ${month} ${year}, ${timeStr}`,
        pv: +(parseFloat(data.pv) + (Math.random() * 2 - 1)).toFixed(1),
        sp: parseFloat(data.sp),
        pv_large: +(parseFloat(data.pv) + 5 + (Math.random() * 2 - 1)).toFixed(1),
        sp_large: parseFloat(data.sp) + 5,
      };
    });
  }, [data]);

  if (!data) return null;
  return (
    <div className="animate-in fade-in duration-300 bg-card border border-border rounded-lg shadow-sm p-4 m-4">
      {/* Summary Cards */}
      <div className="mb-6">
        {(tabKey === "pre-degreasing" || tabKey === "phosphate") ? (
          <StatCardGrid
            columns={4}
            items={[
              {
                title: "SP Temp (Small Tank)",
                value: <div className="flex items-baseline gap-1"><span className="text-blue-500">{data.sp}</span><span className="text-sm text-muted-foreground font-normal">°C</span></div>,
                variant: "stat-side",
                icon: <Thermometer />,
                iconBg: "bg-blue-500/10 text-blue-500",
              },
              {
                title: "PV Temp (Small Tank)",
                value: <div className="flex items-baseline gap-1"><span className={data.alarm ? "text-destructive" : "text-blue-500"}>{data.pv}</span><span className="text-sm text-muted-foreground font-normal">°C</span></div>,
                variant: "stat-side",
                icon: <Thermometer />,
                iconBg: "bg-blue-500/10 text-blue-500",
              },
              {
                title: "SP Temp (Large Tank)",
                value: <div className="flex items-baseline gap-1"><span className="text-blue-500">{(parseFloat(data.sp) + 5).toString()}</span><span className="text-sm text-muted-foreground font-normal">°C</span></div>,
                variant: "stat-side",
                icon: <Thermometer />,
                iconBg: "bg-blue-500/10 text-blue-500",
              },
              {
                title: "PV Temp (Large Tank)",
                value: <div className="flex items-baseline gap-1"><span className={data.alarm ? "text-destructive" : "text-blue-500"}>{(parseFloat(data.pv) + 5).toFixed(1)}</span><span className="text-sm text-muted-foreground font-normal">°C</span></div>,
                variant: "stat-side",
                icon: <Thermometer />,
                iconBg: "bg-blue-500/10 text-blue-500",
              }
            ]}
          />
        ) : (
          <StatCardGrid
            columns={2}
            items={[
              {
                title: "SP Temperature",
                value: <div className="flex items-baseline gap-1"><span className="text-blue-500">{data.sp}</span><span className="text-sm text-muted-foreground font-normal">°C</span></div>,
                variant: "stat-side",
                icon: <Thermometer />,
                iconBg: "bg-blue-500/10 text-blue-500",
              },
              {
                title: "PV Temperature",
                value: <div className="flex items-baseline gap-1"><span className={data.alarm ? "text-destructive" : "text-blue-500"}>{data.pv}</span><span className="text-sm text-muted-foreground font-normal">°C</span></div>,
                variant: "stat-side",
                icon: <Thermometer />,
                iconBg: "bg-blue-500/10 text-blue-500",
              }
            ]}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Station Illustration */}
        <div className="lg:col-span-5 border border-border/50 rounded-lg overflow-hidden bg-background flex flex-col h-full">
          <div className="flex justify-between items-center p-3 bg-secondary/30 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Station Diagram — {data.name}</span>
            </div>
            <div className="flex items-center gap-4">

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 border border-orange-500/20">VIEW-ONLY</span>
            </div>
          </div>

          <div
            className="relative w-full flex-1 flex items-center justify-center min-h-[250px] cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
            onClick={() => setIsImageModalOpen(true)}
            title="Click to enlarge"
          >
            {tabKey === "pre-degreasing" ? (
              <img src={StationPreDegreasingPng} alt={`Station ${data.name}`} className="absolute inset-0 w-full h-full object-fill mix-blend-multiply dark:mix-blend-screen dark:invert" />
            ) : tabKey === "degreasing" ? (
              <img src={StationDegreasingNewPng} alt={`Station ${data.name}`} className="absolute inset-0 w-full h-full object-fill mix-blend-multiply dark:mix-blend-screen dark:invert" />
            ) : tabKey === "flood" ? (
              <img src={StationFloodPng} alt={`Station ${data.name}`} className="absolute inset-0 w-full h-full object-fill mix-blend-multiply dark:mix-blend-screen dark:invert" />
            ) : tabKey === "phosphate" ? (
              <img src={StationPhosphatePng} alt={`Station ${data.name}`} className="absolute inset-0 w-full h-full object-fill mix-blend-multiply dark:mix-blend-screen dark:invert" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Station diagram coming soon</div>
            )}
          </div>
        </div>

        {/* Temperature Trend Chart */}
        <div className="lg:col-span-7 rounded-xl border bg-card p-6 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Temperature Trends</h2>
              <p className="text-sm text-muted-foreground mt-1">Temperature PV and SP trend over the selected {timeFilter} timeframe.</p>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto shrink-0">
              {(["daily", "monthly", "yearly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 transition-colors ${timeFilter === t
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  {t === "daily" ? "Daily" : t === "monthly" ? "Monthly" : "Yearly"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} axisLine={false} label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 12, fill: '#3b82f6', fontWeight: 600 } }} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
                <Line type="monotone" dataKey="sp" name="Set Point" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} />
                <Line type="monotone" dataKey="pv" name="Actual Temp" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table History */}
      {!["flood", "pre-degreasing", "degreasing", "phosphate"].includes(tabKey) && (
        <>
          <h3 className="text-lg font-semibold text-foreground mt-8 mb-4">Temperature History</h3>
          <div className="w-full rounded-lg border border-border bg-card shadow-sm overflow-hidden mb-2">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row items-center gap-4 px-4 py-3 bg-secondary/10 border-b border-border/50 w-full">
              <Search placeholder="Search" containerClassName="flex-1 w-full" />
              <SelectInput
                datalist={[
                  { label: "All Status", value: "all" },
                  { label: "Normal", value: "normal" },
                  { label: "Critical", value: "critical" },
                ]}
                placeholder="Status"
                containerClassName="w-full lg:w-40"
              />
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm text-muted-foreground cursor-pointer hover:bg-secondary/20 transition-colors h-[40px]">
                <Calendar className="h-4 w-4" />
                <span>dd/mm/yyyy - dd/mm/yyyy</span>
              </div>
            </div>

            <Table freezeHeader={false}>
              <THead>
                <Tr noHover>
                  <Th sortable column="time">TIME / PERIOD</Th>
                  {!(tabKey === "flood" || tabKey === "degreasing") && (
                    <>
                      <Th sortable column="sp" className="text-right">SET POINT (SP) SMALL TANK</Th>
                      <Th sortable column="pv" className="text-right">ACTUAL TEMP. (PV) SMALL TANK</Th>
                    </>
                  )}
                  <Th sortable column="sp_large" className="text-right">SET POINT (SP) LARGE TANK</Th>
                  <Th sortable column="pv_large" className="text-right">ACTUAL TEMP. (PV) LARGE TANK</Th>
                  <Th sortable column="status" className="text-center">STATUS</Th>
                </Tr>
              </THead>
              <TBody>
                {tableData.map((row, idx) => {
                  const diff = Math.abs(row.pv - row.sp);
                  const diffLarge = Math.abs(row.pv_large - row.sp_large);

                  let isCritical = false;
                  if (tabKey === "flood" || tabKey === "degreasing") {
                    isCritical = diffLarge > 2;
                  } else {
                    isCritical = diff > 2 || diffLarge > 2;
                  }

                  return (
                    <Tr key={idx}>
                      <Td className="font-medium text-foreground">{row.time}</Td>
                      {!(tabKey === "flood" || tabKey === "degreasing") && (
                        <>
                          <Td className="text-right font-mono font-medium text-foreground">{row.sp.toFixed(1)} °C</Td>
                          <Td className="text-right font-mono font-medium text-blue-500">{row.pv.toFixed(1)} °C</Td>
                        </>
                      )}
                      <Td className="text-right font-mono font-medium text-foreground">{row.sp_large.toFixed(1)} °C</Td>
                      <Td className="text-right font-mono font-medium text-blue-500">{row.pv_large.toFixed(1)} °C</Td>
                      <Td className="text-center">
                        {isCritical ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">CRITICAL</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">NORMAL</span>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </Table>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-border/60">
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <div className="flex items-center justify-between w-[60px] px-2 py-1.5 border border-border rounded-md bg-background cursor-pointer hover:bg-secondary/40 transition-colors">
                    <span>10</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </div>
                </div>
                <span>1–10 of {tableData.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">«</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">‹</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1F5AA6] text-white text-sm font-semibold border border-[#1F5AA6]">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">›</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">»</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Image Modal Popup */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative bg-background rounded-xl shadow-2xl border border-border/50 max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-border/50 bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Station Diagram — {data.name}
              </h3>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-0 overflow-auto flex-1 flex items-center justify-center min-h-[50vh] w-full">
              {tabKey === "pre-degreasing" ? (
                <img src={StationPreDegreasingPng} alt={`Station ${data.name}`} className="w-full h-full object-fill mix-blend-multiply dark:mix-blend-screen dark:invert" />
              ) : tabKey === "degreasing" ? (
                <img src={StationDegreasingNewPng} alt={`Station ${data.name}`} className="w-full h-full object-fill mix-blend-multiply dark:mix-blend-screen dark:invert" />
              ) : tabKey === "flood" ? (
                <img src={StationFloodPng} alt={`Station ${data.name}`} className="w-full h-full object-fill mix-blend-multiply dark:mix-blend-screen dark:invert" />
              ) : tabKey === "phosphate" ? (
                <img src={StationPhosphatePng} alt={`Station ${data.name}`} className="w-full h-full object-fill mix-blend-multiply dark:mix-blend-screen dark:invert" />
              ) : (
                <div className="text-muted-foreground">No diagram available</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MonitoringAreaDetails() {
  const [historicalBoilerTab, setHistoricalBoilerTab] = useState("Boiler 1");
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState("Boiler Monitoring");
  const [lineTrackingTab, setLineTrackingTab] = useState("Line Tracking");
  const [timeFilter, setTimeFilter] = useState<"daily" | "monthly" | "yearly">("daily");
  const [processDetailTab, setProcessDetailTab] = useState("pre-degreasing");
  const [logHistoryTab, setLogHistoryTab] = useState("Boiler 1");
  const [histEnergyPrice, setHistEnergyPrice] = useState(ENERGY_PRICE_PER_KWH.toString());
  const [histGasPrice, setHistGasPrice] = useState(GAS_PRICE_PER_MMBTU.toString());

  const usageData = useMemo(() => BOILER_USAGE_HISTORY[timeFilter], [timeFilter]);
  const summary = useMemo(() => {
    const totalEnergy = usageData.reduce((acc, cur) => acc + cur.energy, 0);
    const totalGas = usageData.reduce((acc, cur) => acc + cur.gas, 0);
    return {
      totalEnergy,
      avgEnergy: Math.round(totalEnergy / usageData.length),
      totalGas,
      avgGas: Math.round(totalGas / usageData.length),
      totalPriceEnergy: totalEnergy * ENERGY_PRICE_PER_KWH,
      totalPriceGas: totalGas * GAS_PRICE_PER_MMBTU,
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
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            to="/monitoring-area"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm hover:bg-secondary transition-colors text-sm font-medium text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-semibold inline-flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> {name}
          </h1>
        </div>

        {id === "line-tracking" && (
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto overflow-x-auto custom-scrollbar">
              {["Line Tracking", "Process Detail"].map((t) => (
                <button
                  key={t}
                  onClick={() => setLineTrackingTab(t)}
                  className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 whitespace-nowrap transition-colors ${lineTrackingTab === t
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {lineTrackingTab === "Process Detail" && (
              <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto overflow-x-auto custom-scrollbar">
                {[
                  { id: "pre-degreasing", label: "Pre Degreasing" },
                  { id: "degreasing", label: "Degreasing" },
                  { id: "phosphate", label: "Phosphate" },
                  { id: "flood", label: "Flood" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProcessDetailTab(tab.id)}
                    className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 whitespace-nowrap transition-colors ${processDetailTab === tab.id
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {id === "bag-filter" && (
          <div className="ml-auto">
            <Link
              to="/monitoring-area/bag-filter-history"
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1F5AA6] px-3 py-1.5 shadow-sm hover:bg-[#1F5AA6]/90 transition-colors text-sm font-medium text-white border border-[#1F5AA6]"
            >
              <BarChart3 className="h-4 w-4" />
              Historical Charts
            </Link>
          </div>
        )}
      </div>

      {id === "boiler-area" ? (
        <div className="space-y-6">
          {/* Summary Card */}
          <StatCardGrid
            columns={4}
            items={[
              {
                title: "Gas Flow",
                value: `${BOILER_GAS.instantFlow} MMBTU/m`,
                variant: "stat-side",
                icon: <Fuel />,
                iconBg: "bg-amber-500/10 text-amber-500",
              },
              {
                title: "Gas Pressure",
                value: `${BOILER_GAS.gasPressure} MPa`,
                variant: "stat-side",
                icon: <Gauge />,
                iconBg: "bg-blue-500/10 text-blue-500",
              },
              {
                title: "Power Panel",
                value: `${BOILER_GAS.powerPanel} kw/h`,
                variant: "stat-side",
                icon: <Zap />,
                iconBg: "bg-emerald-500/10 text-emerald-500",
              },
              {
                title: "Panel Boiler Status",
                value: (
                  <span className={`inline-block text-sm px-3 py-1 mt-1 rounded-md font-bold ${BOILER_GAS.panelBoilerStatus === "ON" ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {BOILER_GAS.panelBoilerStatus}
                  </span>
                ),
                variant: "stat-side",
                icon: <Power />,
                iconBg: BOILER_GAS.panelBoilerStatus === "ON" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive",
              }
            ]}
          />

          {/* Tabbed Section inside a Card */}
          <Tabs
            variant="default"
            value={activeTab}
            onValueChange={setActiveTab}
            className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
            listClassName="m-4 ml-4 mt-4"
            rightElement={
              activeTab === "Cummulative Usage" ? (
                <div className="flex items-center bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto mr-4">
                  <div className="flex items-center gap-2 text-xs font-medium px-2 text-muted-foreground mr-1">
                    <Filter className="h-3.5 w-3.5" /> Filter by:
                  </div>
                  {(["daily", "monthly", "yearly"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeFilter(t)}
                      className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 transition-colors ${timeFilter === t
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              ) : null
            }
            items={[
              {
                value: "Boiler Monitoring",
                label: "Boiler Monitoring",
                content: (
                  <>
                    <div className="grid gap-6 lg:grid-cols-3 m-4">
                      {BOILERS.map((b) => (
                        <div key={b.id} className="flex flex-col items-center">
                          {/* Tank illustration (Cylinder with rims) */}
                          <div className="relative w-full flex flex-col items-center">
                            <img
                              src={b.name === "Boiler 1" ? Boiler1Png : b.name === "Boiler 2" ? Boiler2Png : Boiler3Png}
                              alt={b.name}
                              className="w-full max-w-[280px] object-contain"
                            />
                            <div className="mt-2 bg-background/90 px-3 py-1 rounded-full shadow-md backdrop-blur-sm border border-border/50 flex items-center gap-2">
                              <StatusDot state={b.running ? "on" : "off"} />
                              <span className="text-xs font-bold font-mono tracking-widest">{b.running ? "ON" : "OFF"}</span>
                            </div>
                          </div>

                          {/* Details underneath the tank */}
                          <div className="mt-5 w-full space-y-3 bg-secondary/20 p-4 rounded-lg border border-border/50 shadow-sm">
                            <div className="flex flex-col text-sm border-b border-border/40 pb-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-muted-foreground">Boiler Status</span>
                                <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold tracking-wider ${b.running ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>{b.running ? "ON" : "OFF"}</span>
                              </div>
                              <div className="flex justify-between text-xs mt-1 bg-background/50 rounded-lg p-2 border border-border/30">
                                <div className="flex flex-col gap-1.5 text-muted-foreground">
                                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"><Power className="h-3.5 w-3.5 text-emerald-500" /> ON</span>
                                  <span className="text-foreground font-mono font-bold text-lg">{b.onTime}</span>
                                </div>
                                <div className="w-px bg-border/50 my-1" />
                                <div className="flex flex-col gap-1.5 text-muted-foreground">
                                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"><Power className="h-3.5 w-3.5 text-destructive" /> OFF</span>
                                  <span className="text-foreground font-mono font-bold text-lg">{b.offTime}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30 text-xs">
                                <span className="text-muted-foreground">Total Duration</span>
                                <span className="text-foreground font-mono font-semibold text-primary text-lg">{b.boilerDuration}</span>
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Log History Table */}
                    <div className="mt-8 m-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground">Log History</h3>
                      </div>
                      {/* Search and Filters */}
                      <RawTabs value={logHistoryTab} onValueChange={setLogHistoryTab} className="w-full rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                        {/* Filter Bar: Search + Tabs + Date Range in one row */}
                        <div className="flex flex-col lg:flex-row items-center gap-4 px-4 py-3 bg-secondary/10 border-b border-border/50 w-full">
                          <Search placeholder="Search" containerClassName="flex-1 w-full" />
                          <TabsList className="bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto">
                            <TabsTrigger value="Boiler 1" className="text-gray-500 dark:text-gray-400 rounded-lg text-xs data-[state=inactive]:hover:text-gray-700 dark:data-[state=inactive]:hover:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white h-8 font-medium transition-colors">Boiler 1</TabsTrigger>
                            <TabsTrigger value="Boiler 2" className="text-gray-500 dark:text-gray-400 rounded-lg text-xs data-[state=inactive]:hover:text-gray-700 dark:data-[state=inactive]:hover:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white h-8 font-medium transition-colors">Boiler 2</TabsTrigger>
                            <TabsTrigger value="Boiler 3" className="text-gray-500 dark:text-gray-400 rounded-lg text-xs data-[state=inactive]:hover:text-gray-700 dark:data-[state=inactive]:hover:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white h-8 font-medium transition-colors">Boiler 3</TabsTrigger>
                          </TabsList>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm text-muted-foreground cursor-pointer hover:bg-secondary/20 transition-colors">
                            <Calendar className="h-4 w-4" />
                            <span>dd/mm/yyyy - dd/mm/yyyy</span>
                          </div>
                        </div>

                        {/* Table Content per Boiler */}
                        {["Boiler 1", "Boiler 2", "Boiler 3"].map((boilerName) => (
                          <TabsContent key={boilerName} value={boilerName} className="mt-0">
                            <Table freezeHeader={false}>
                              <THead>
                                <Tr noHover>
                                  <Th sortable column="on">ON</Th>
                                  <Th sortable column="off">OFF</Th>
                                  <Th sortable column="totalDuration">TOTAL DURATION</Th>
                                </Tr>
                              </THead>
                              <TBody>
                                {(BOILER_LOG_HISTORY[boilerName as keyof typeof BOILER_LOG_HISTORY] || []).map((log, idx) => (
                                  <Tr key={idx}>
                                    <Td>{log.on}</Td>
                                    <Td>{log.off}</Td>
                                    <Td className="text-muted-foreground">{log.totalDuration}</Td>
                                  </Tr>
                                ))}
                              </TBody>
                            </Table>

                            {/* Pagination Footer */}
                            <div className="flex items-center justify-between px-4 py-4 border-t border-border/60">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                  <span>Rows per page</span>
                                  <div className="flex items-center justify-between w-[60px] px-2 py-1.5 border border-border rounded-md bg-background cursor-pointer hover:bg-secondary/40 transition-colors">
                                    <span>10</span>
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                  </div>
                                </div>
                                <span>1–10 of 2479</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">«</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">‹</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1F5AA6] text-white text-sm font-semibold border border-[#1F5AA6]">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">3</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">4</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">5</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">›</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors text-sm font-medium">»</button>
                              </div>
                            </div>
                          </TabsContent>
                        ))}
                      </RawTabs>
                    </div>
                  </>
                ),
              },
              {
                value: "Cummulative Usage",
                label: "Cummulative Usage",
                content: (
                  <div className="space-y-6">
                    <div className="m-4">
                      <StatCardGrid
                        columns={3}
                        items={[
                          {
                            title: "Total Energy",
                            value: `${summary.totalEnergy.toLocaleString()} kWh`,
                            variant: "stat-side",
                            icon: <Zap />,
                            iconBg: "bg-blue-500/10 text-blue-500",
                          },
                          {
                            title: `Avg Energy / ${timeFilter === 'daily' ? 'day' : timeFilter.replace('ly', '')}`,
                            value: `${summary.avgEnergy.toLocaleString()} kWh`,
                            variant: "stat-side",
                            icon: <Zap />,
                            iconBg: "bg-blue-400/10 text-blue-400",
                          },
                          {
                            title: "Total Price Energy",
                            value: `Rp ${summary.totalPriceEnergy.toLocaleString()}`,
                            subtitle: `@ Rp ${ENERGY_PRICE_PER_KWH.toLocaleString()}/kWh`,
                            variant: "stat-side",
                            icon: <DollarSign />,
                            iconBg: "bg-violet-500/10 text-violet-500",
                            valueColor: "text-violet-500",
                          },
                          {
                            title: "Total Gas",
                            value: `${summary.totalGas.toLocaleString()} MMBTU`,
                            variant: "stat-side",
                            icon: <Flame />,
                            iconBg: "bg-amber-500/10 text-amber-500",
                          },
                          {
                            title: `Avg Gas / ${timeFilter === 'daily' ? 'day' : timeFilter.replace('ly', '')}`,
                            value: `${summary.avgGas.toLocaleString()} MMBTU`,
                            variant: "stat-side",
                            icon: <Flame />,
                            iconBg: "bg-emerald-400/10 text-emerald-400",
                          },
                          {
                            title: "Total Price Gas",
                            value: `Rp ${summary.totalPriceGas.toLocaleString()}`,
                            subtitle: `@ Rp ${GAS_PRICE_PER_MMBTU.toLocaleString()}/MMBTU`,
                            variant: "stat-side",
                            icon: <DollarSign />,
                            iconBg: "bg-amber-500/10 text-amber-500",
                            valueColor: "text-amber-500",
                          }
                        ]}
                      />
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm m-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-foreground">Combine Usage Trend</h2>
                          <p className="text-sm text-muted-foreground mt-1">Energy and Gas usage trend over the selected {timeFilter} timeframe.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 sm:mt-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Energy Price:</span>
                            <Input
                              type="number"
                              prefix="Rp"
                              containerClassName="w-fit min-w-0"
                              fieldClassName="h-8 bg-background border border-border"
                              className="px-2 min-w-0 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0"
                              style={{ width: `${Math.max(histEnergyPrice.toString().length + 3, 5)}ch` }}
                              value={histEnergyPrice}
                              onChange={e => setHistEnergyPrice(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Gas Price:</span>
                            <Input
                              type="number"
                              prefix="Rp"
                              containerClassName="w-fit min-w-0"
                              fieldClassName="h-8 bg-background border border-border"
                              className="px-2 min-w-0 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0"
                              style={{ width: `${Math.max(histGasPrice.toString().length + 3, 5)}ch` }}
                              value={histGasPrice}
                              onChange={e => setHistGasPrice(e.target.value)}
                            />
                          </div>
                          <Button size="sm" className="h-8">Update</Button>
                        </div>
                      </div>
                      <div className="h-[350px] mt-6 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={usageData} margin={{ top: 20, right: 50, left: 50, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft', offset: -35, style: { fontSize: 12, fill: '#3b82f6', fontWeight: 600 } }} />
                            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} label={{ value: 'Gas (MMBTU)', angle: 90, position: 'insideRight', offset: -35, style: { fontSize: 12, fill: '#10b981', fontWeight: 600 } }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", borderColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}
                              itemStyle={{ color: "#fff" }}
                              formatter={(value: number, name: string) => {
                                if (name === "Energy (kWh)") {
                                  const price = value * ENERGY_PRICE_PER_KWH;
                                  return [`${value.toLocaleString()} kWh (Price: Rp ${price.toLocaleString()})`, name];
                                }
                                if (name === "Gas (MMBTU)") {
                                  const price = value * GAS_PRICE_PER_MMBTU;
                                  return [`${value.toLocaleString()} MMBTU (Price: Rp ${price.toLocaleString()})`, name];
                                }
                                return [value.toLocaleString(), name];
                              }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                            <Line yAxisId="left" type="monotone" name="Energy (kWh)" dataKey="energy" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }} activeDot={{ r: 6 }} />
                            <Line yAxisId="right" type="monotone" name="Gas (MMBTU)" dataKey="gas" stroke="#10b981" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                value: "Historical Charts",
                label: "Historical Charts",
                content: (
                  <div className="space-y-6">
                    {/* Temperature & Pressure Trends */}
                    <div className="flex flex-col gap-6">
                      {/* Temperature */}
                      <div className="rounded-xl border bg-card p-6 shadow-sm ml-4 mr-4">
                        <RawTabs value={historicalBoilerTab} onValueChange={setHistoricalBoilerTab} className="w-full">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div>
                              <h2 className="text-xl font-bold tracking-tight text-foreground">Temperature Trends by Minute</h2>
                              <p className="text-sm text-muted-foreground mt-1">Real-time temperature monitoring against standard limits.</p>
                            </div>
                            <TabsList className="bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto">
                              {["Boiler 1", "Boiler 2", "Boiler 3"].map(tab => (
                                <TabsTrigger
                                  key={tab}
                                  value={tab}
                                  className="text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 transition-colors data-[state=inactive]:hover:text-gray-700 dark:data-[state=inactive]:hover:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                                >
                                  {tab}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                          </div>
                          {["Boiler 1", "Boiler 2", "Boiler 3"].map(tab => (
                            <TabsContent key={tab} value={tab} className="mt-0 outline-none">
                              <div className="h-[300px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={MINUTE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
                                    <YAxis tick={{ fontSize: 10 }} label={{ value: 'Temperature', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 600 } }} />
                                    <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12, color: "#fff" }} />
                                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                                    <ReferenceLine y={190} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'MIN', fill: '#ef4444', fontSize: 10 }} />
                                    <ReferenceLine y={230} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'MAX', fill: '#ef4444', fontSize: 10 }} />
                                    <Line type="monotone" dataKey={tab === "Boiler 1" ? "temp1_b1" : tab === "Boiler 2" ? "temp1_b2" : "temp1_b3"} name="Actual Temp 1" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                    <Line type="monotone" dataKey={tab === "Boiler 1" ? "temp2_b1" : tab === "Boiler 2" ? "temp2_b2" : "temp2_b3"} name="Actual Temp 2" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="none_max" name="MAX" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={false} activeDot={false} />
                                    <Line type="monotone" dataKey="none_min" name="MIN" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={false} activeDot={false} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </TabsContent>
                          ))}
                        </RawTabs>
                      </div>

                      {/* Pressure */}
                      <div className="rounded-xl border bg-card p-6 shadow-sm ml-4 mr-4">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trends by Minute</h2>
                          <p className="text-sm text-muted-foreground mt-1">Real-time pressure monitoring against standard limits.</p>
                        </div>
                        <div className="h-[300px] w-full mt-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MINUTE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                              <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
                              <YAxis tick={{ fontSize: 10 }} label={{ value: 'Pressure', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 600 } }} />
                              <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12, color: "#fff" }} />
                              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                              <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'MIN', fill: '#ef4444', fontSize: 10 }} />
                              <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'MAX', fill: '#ef4444', fontSize: 10 }} />
                              <Line type="monotone" dataKey="pressure" name="Pressure (MPa)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                              <Line type="monotone" dataKey="none_max" name="MAX" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={false} activeDot={false} />
                              <Line type="monotone" dataKey="none_min" name="MIN" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={false} activeDot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Energy vs Gas */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm ml-4 mr-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-foreground">Energy Consumption vs Gas Usage by Minute</h2>
                          <p className="text-sm text-muted-foreground mt-1">Comparison of energy and gas consumption trends.</p>
                        </div>
                      </div>
                      <div className="h-[350px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={MINUTE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
                            <YAxis yAxisId="left" tick={{ fontSize: 10 }} label={{ value: 'Energy', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#3b82f6', fontSize: 12, fontWeight: 600 } }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} label={{ value: 'Gas', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#10b981', fontSize: 12, fontWeight: 600 } }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}
                              itemStyle={{ fontSize: 12, color: "#fff" }}
                              formatter={(value: number, name: string) => {
                                if (name === "Energy (kWh)") {
                                  const price = value * parseFloat(histEnergyPrice || "0");
                                  return [`${value.toLocaleString()} kWh (Rp ${price.toLocaleString()})`, name];
                                }
                                if (name === "Gas Usage (m³)") {
                                  const price = value * parseFloat(histGasPrice || "0");
                                  return [`${value.toLocaleString()} m³ (Rp ${price.toLocaleString()})`, name];
                                }
                                return [value.toLocaleString(), name];
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                            <Line yAxisId="left" type="monotone" dataKey="energy" name="Energy (kWh)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line yAxisId="right" type="monotone" dataKey="gas" name="Gas Usage (m³)" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />

        </div>
      ) : id === "line-tracking" ? (
        <div className="space-y-6">
          {lineTrackingTab === "Line Tracking" ? (
            <div className="border border-border/50 rounded-lg overflow-hidden bg-background mb-4">
              {/* L-Shape Map Content */}
              <div className="w-full overflow-hidden flex items-center justify-center bg-background bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cjwvc3ZnPg==')]">
                <img src={LineTrackingPng} alt="Line Tracking Map" className="w-full h-auto object-cover drop-shadow-sm dark:invert dark:opacity-80 mix-blend-multiply dark:mix-blend-screen" />
              </div>

              {/* Map Legend Footer */}
              <div className="flex gap-4 p-3 bg-secondary/10 border-t border-border/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> GREEN = SKID PRESENT</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border-[1.5px] border-gray-400"></div> EMPTY STATION</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-4">
              <StationDetailContent tabKey={processDetailTab} />
            </div>
          )}
        </div>
      ) : ["flood-station", "degreasing", "pre-degreasing", "phosphate"].includes(id) ? (
        <div className="mt-2">
          <StationDetailContent tabKey={
            id === "flood-station" ? "flood" :
              id
          } />
        </div>
      ) : id === "pted-bag-filter" ? (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg shadow-sm p-6">
            <div className="animate-in fade-in duration-300">
              {/* Station Illustration */}
              <div className="border border-border/50 rounded-lg overflow-hidden bg-background">
                <div className="flex justify-between items-center p-3 bg-secondary/30 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Station Diagram — PTED Bag Filter</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 border border-orange-500/20">READ-ONLY</span>
                </div>

                <div className="relative w-full overflow-hidden flex items-center justify-center p-4">
                  <div className="w-full -mt-[12%]">
                    {/* Maps-Pted-Area.png has been deleted, using a placeholder text for now */}
                    <div className="h-48 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">Map Image Missing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : ["oven-sealing", "oven-topcoat", "oven-ced"].includes(id) ? (
        <OvenDetailContent id={id} />
      ) : id === "bag-filter" ? (
        <div className="animate-in fade-in duration-300">
          <div className="border border-border/50 rounded-lg overflow-hidden bg-background shadow-sm">
            <div className="flex justify-between items-center p-3 bg-white dark:bg-background border-b border-border/50">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bag Filter Layout Diagram</span>
              </div>

            </div>
            <div className="w-full bg-white dark:bg-background flex items-center justify-center overflow-hidden">
              <img src={DenahFixPng} alt="Bag Filter Layout" className="w-full h-auto object-cover drop-shadow-sm dark:invert" />
            </div>
          </div>
        </div>
      ) : (
        /* Placeholder Content */
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground bg-secondary/20">
          <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm font-medium">Empty Section</p>
          <p className="text-xs mt-1">Data and charts are currently being prepared.</p>
        </div>
      )}
    </div>
  );
}
