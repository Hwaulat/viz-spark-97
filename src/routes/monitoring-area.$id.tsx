import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronLeft, Activity, Flame, Gauge, Power, BarChart3, Filter, Waves, Zap, Thermometer } from "lucide-react";
import { BOILERS, BOILER_GAS, BOILER_USAGE_HISTORY, LINE_TRACKING_STATIONS, LINE_TRACKING_ZONES, PROCESS_DETAIL_STATIONS, ovenElecDailyTrend, ovenElecMonthlyTrend, ovenElecYearlyTrend } from "@/lib/mock-data";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LineTrackingSvg from "@/assets/Line-Tracking.svg";
import StationPreDegreasingPng from "@/assets/Pre-degreasing.png";
import StationFloodPng from "@/assets/Flood.png";
import StationPhosphatePng from "@/assets/Phosphate-1.png";
import StationDegreasingPng from "@/assets/Degreasing.png";
import StationDegreasingNewPng from "@/assets/Degreasing-New.png";
import MapsPtedAreaPng from "@/assets/Maps-Pted-Area.png";
export const Route = createFileRoute("/monitoring-area/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Monitoring Details — ${params.id}` },
      { name: "description", content: `Monitoring details for ${params.id}` },
    ],
  }),
  component: MonitoringAreaDetails,
});



function OvenDetailContent({ id }: { id: string }) {
  const [timeFilter, setTimeFilter] = useState<"daily" | "monthly" | "yearly">("daily");
  
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel className="p-4 bg-card/60 flex flex-col justify-center items-center text-center">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Thermometer className="h-3.5 w-3.5" /> Temperature 1
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-mono font-bold ${data[data.length - 1]?.temp1 > standard ? 'text-destructive' : 'text-emerald-500'}`}>{data[data.length - 1]?.temp1?.toFixed(1) || "0.0"}</span>
            <span className="text-sm text-muted-foreground">°C</span>
          </div>
          <div className="flex gap-3 mt-2 text-[10px] font-mono font-semibold">
            <span className="text-emerald-500/90">MIN: {temp1Min.toFixed(1)}</span>
            <span className="text-rose-500/90">MAX: {temp1Max.toFixed(1)}</span>
          </div>
        </Panel>
        <Panel className="p-4 bg-card/60 flex flex-col justify-center items-center text-center">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Thermometer className="h-3.5 w-3.5" /> Temperature 2
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-mono font-bold ${data[data.length - 1]?.temp2 > standard ? 'text-destructive' : 'text-emerald-500'}`}>{data[data.length - 1]?.temp2?.toFixed(1) || "0.0"}</span>
            <span className="text-sm text-muted-foreground">°C</span>
          </div>
          <div className="flex gap-3 mt-2 text-[10px] font-mono font-semibold">
            <span className="text-emerald-500/90">MIN: {temp2Min.toFixed(1)}</span>
            <span className="text-rose-500/90">MAX: {temp2Max.toFixed(1)}</span>
          </div>
        </Panel>
        <Panel className="p-4 bg-card/60 flex flex-col justify-center items-center text-center">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" /> Pressure
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-foreground">{data[data.length - 1]?.pressure?.toFixed(2) || "0.00"}</span>
            <span className="text-sm text-muted-foreground">bar</span>
          </div>
          <div className="flex gap-3 mt-2 text-[10px] font-mono font-semibold">
            <span className="text-emerald-500/90">MIN: {pressureMin.toFixed(2)}</span>
            <span className="text-rose-500/90">MAX: {pressureMax.toFixed(2)}</span>
          </div>
        </Panel>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Power Consumption (kW) */}
        <Panel title="Power Consumption Trend" className="p-4 bg-card/60">
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="kw" name="Active Power (kW)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorKw)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Cumulative Energy */}
        <Panel title="Cumulative Energy Usage" className="p-4 bg-card/60">
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="kwh" name="Energy (kWh)" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Cumulative Gas */}
        <Panel title="Cumulative Gas Usage" className="p-4 bg-card/60">
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="gas" name="Gas (m³)" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Temperature Trend */}
        <Panel title="Temperature Trend" className="p-4 bg-card/60">
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="temp1" name="Temp 1 (°C)" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="temp2" name="Temp 2 (°C)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tempMin" name="Standard Min" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} opacity={0.6} dot={false} />
                <Line type="monotone" dataKey="tempMax" name="Standard Max" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} opacity={0.6} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Pressure Trend */}
        <Panel title="Pressure Trend" className="p-4 bg-card/60">
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="pressure" name="Pressure (bar)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pressureMin" name="Pressure Min" stroke="#8b5cf6" strokeDasharray="3 3" strokeWidth={1.5} opacity={0.6} dot={false} />
                <Line type="monotone" dataKey="pressureMax" name="Pressure Max" stroke="#8b5cf6" strokeDasharray="3 3" strokeWidth={1.5} opacity={0.6} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
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
  if (!data) return null;
  return (
    <div className="animate-in fade-in duration-300">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Panel className="p-4 shadow-sm border border-border/50 bg-card/60">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">PV Temperature</div>
          <div className="flex items-baseline gap-1"><span className={`text-3xl font-mono font-bold ${data.alarm ? 'text-destructive' : 'text-emerald-500'}`}>{data.pv}</span><span className="text-sm">°C</span></div>
        </Panel>
        <Panel className="p-4 shadow-sm border border-border/50 bg-card/60">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">SP Temperature</div>
          <div className="flex items-baseline gap-1"><span className="text-3xl font-mono font-bold">{data.sp}</span><span className="text-sm">°C</span></div>
        </Panel>
      </div>

      {/* Station Illustration */}
      <div className="border border-border/50 rounded-lg overflow-hidden bg-background mb-6">
        <div className="flex justify-between items-center p-3 bg-secondary/30 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Station Diagram — {data.name}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 border border-orange-500/20">READ-ONLY</span>
        </div>
        
        <div className="relative w-full overflow-auto flex items-center justify-center p-4">
          {tabKey === "pre-degreasing" ? (
            <img src={StationPreDegreasingPng} alt={`Station ${data.name}`} className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert" />
          ) : tabKey === "degreasing" ? (
            <img src={StationDegreasingNewPng} alt={`Station ${data.name}`} className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert" />
          ) : tabKey === "flood" ? (
            <img src={StationFloodPng} alt={`Station ${data.name}`} className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert" />
          ) : tabKey === "phosphate" ? (
            <img src={StationPhosphatePng} alt={`Station ${data.name}`} className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert" />
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground text-sm">Station diagram coming soon</div>
          )}
        </div>
      </div>

      {/* Temperature Trend Chart */}
      <Panel title="Temperature Trends">
        <div className="h-[300px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={Array.from({ length: 30 }, (_, i) => {
                const time = new Date(Date.now() - (29 - i) * 60000);
                return {
                  time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  pv: +(parseFloat(data.pv) + (Math.random() * 2 - 1)).toFixed(1),
                };
              })} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
              <YAxis tick={{ fontSize: 10 }} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <ReferenceLine y={parseFloat(data.sp)} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: `Set Point (${data.sp}°C)`, fill: '#ef4444', fontSize: 10 }} />
              <Line type="monotone" dataKey="pv" name="Actual Temp" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function MonitoringAreaDetails() {
  const [historicalBoilerTab, setHistoricalBoilerTab] = useState("Boiler 1");
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState("Boiler Monitoring");
  const [timeFilter, setTimeFilter] = useState<"daily" | "monthly" | "yearly">("daily");
  const [processDetailTab, setProcessDetailTab] = useState("pre-degreasing");

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
      <div className="flex items-start gap-4">
        <Link
          to="/monitoring-area"
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm hover:bg-secondary transition-colors text-sm font-medium text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Monitoring Area
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
              <ValueDisplay label="Power Panel" value={BOILER_GAS.powerPanel} unit="kw/h" tone="default" />
            </div>
          </Panel>

          {/* Tabbed Section inside a Card */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-border/50 bg-secondary/10 px-4 py-2">
              <TabsList>
                {["Boiler Monitoring", "Cummulative Usage", "Historical Charts"].map((tab) => (
                  <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
                ))}
              </TabsList>

              {activeTab === "Cummulative Usage" && (
                <div className="flex gap-1 bg-background/50 p-1 rounded-md border border-border/50">
                  <div className="flex items-center gap-2 text-sm font-medium px-2 text-muted-foreground mr-1">
                    <Filter className="h-3.5 w-3.5" /> Filter by:
                  </div>
                  {(["daily", "monthly", "yearly"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeFilter(t)}
                      className={`px-3 py-1 text-xs font-medium rounded transition ${
                        timeFilter === t
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              <TabsContent value="Boiler Monitoring">
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

                      <div className="mt-5 flex flex-col gap-2 w-full text-center text-sm font-mono bg-background/70 backdrop-blur-md rounded-lg p-3 shadow-md z-10 border-t border-white/40 dark:border-white/10">
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
                    
                    <div className="flex flex-col text-sm border-b border-border/40 pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-muted-foreground">Burner Status</span>
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold tracking-wider ${b.fireBurner ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-muted text-muted-foreground'}`}>{b.fireBurner ? "ON" : "OFF"}</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1 bg-background/50 rounded-lg p-2 border border-border/30">
                        <div className="flex flex-col gap-1.5 text-muted-foreground">
                          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"><Flame className="h-3.5 w-3.5 text-orange-500" /> ON</span>
                          <span className="text-foreground font-mono font-bold text-lg">{b.burnerOnTime}</span>
                        </div>
                        <div className="w-px bg-border/50 my-1" />
                        <div className="flex flex-col gap-1.5 text-muted-foreground">
                          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"><Flame className="h-3.5 w-3.5 text-gray-500" /> OFF</span>
                          <span className="text-foreground font-mono font-bold text-lg">{b.burnerOffTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30 text-xs">
                          <span className="text-muted-foreground">Total Duration</span>
                          <span className="text-foreground font-mono font-semibold text-orange-500 dark:text-orange-400 text-lg">{b.burnerDuration}</span>
                      </div>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
              </TabsContent>

              <TabsContent value="Cummulative Usage">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                <div className="rounded-lg bg-card border border-border p-4 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500">
                      <Zap className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Total Energy</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-blue-500">{summary.totalEnergy.toLocaleString()}</span>
                      <span className="text-xs font-medium text-muted-foreground">kWh</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-card border border-border p-4 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-400/10 text-blue-400">
                      <Zap className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-medium text-foreground uppercase">Avg Energy / {timeFilter.replace('ly', '')}</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-blue-400">{summary.avgEnergy.toLocaleString()}</span>
                      <span className="text-xs font-medium text-muted-foreground">kWh</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-card border border-border p-4 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                      <Flame className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Total Gas</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-emerald-500">{summary.totalGas.toLocaleString()}</span>
                      <span className="text-xs font-medium text-muted-foreground">m³</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-card border border-border p-4 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-emerald-400/10 text-emerald-400">
                      <Flame className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-medium text-foreground uppercase">Avg Gas / {timeFilter.replace('ly', '')}</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-emerald-400">{summary.avgGas.toLocaleString()}</span>
                      <span className="text-xs font-medium text-muted-foreground">m³</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Combine Usage Trend</h2>
                  <p className="text-sm text-muted-foreground mt-1">Energy and Gas usage trend over the selected {timeFilter} timeframe.</p>
                </div>
                <div className="h-[350px] mt-6 w-full">
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
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                      <Line yAxisId="left" type="monotone" name="Energy (kWh)" dataKey="energy" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }} activeDot={{ r: 6 }} />
                      <Line yAxisId="right" type="monotone" name="Gas (m³)" dataKey="gas" stroke="#10b981" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

              <TabsContent value="Historical Charts">
                <Tabs value={historicalBoilerTab} onValueChange={setHistoricalBoilerTab} className="space-y-6">
                  {/* Temperature & Pressure Trends */}
                  <div className="flex flex-col gap-6">
                    {/* Temperature */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-foreground">Temperature Trends by Minute</h2>
                          <p className="text-sm text-muted-foreground mt-1">Real-time temperature monitoring against standard limits.</p>
                        </div>
                        <TabsList>
                          {["Boiler 1", "Boiler 2", "Boiler 3"].map(tab => (
                            <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
                          ))}
                        </TabsList>
                      </div>
                      <div className="h-[300px] w-full p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={MINUTE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                            <ReferenceLine y={190} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'MIN', fill: '#ef4444', fontSize: 10 }} />
                            <ReferenceLine y={230} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'MAX', fill: '#ef4444', fontSize: 10 }} />
                            <Line type="monotone" dataKey={historicalBoilerTab === "Boiler 1" ? "temp1_b1" : historicalBoilerTab === "Boiler 2" ? "temp1_b2" : "temp1_b3"} name="Actual Temp 1" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line type="monotone" dataKey={historicalBoilerTab === "Boiler 1" ? "temp2_b1" : historicalBoilerTab === "Boiler 2" ? "temp2_b2" : "temp2_b3"} name="Actual Temp 2" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line type="monotone" dataKey="none_max" name="MAX" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={false} activeDot={false} />
                            <Line type="monotone" dataKey="none_min" name="MIN" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={false} activeDot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pressure */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trends by Minute</h2>
                        <p className="text-sm text-muted-foreground mt-1">Real-time pressure monitoring against standard limits.</p>
                      </div>
                      <div className="h-[300px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={MINUTE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                            <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'MIN', fill: '#ef4444', fontSize: 10 }} />
                            <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'MAX', fill: '#ef4444', fontSize: 10 }} />
                            <Line type="monotone" dataKey="pressure" name="Pressure (bar)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line type="monotone" dataKey="none_max" name="MAX" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={false} activeDot={false} />
                            <Line type="monotone" dataKey="none_min" name="MIN" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} dot={false} activeDot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Energy vs Gas */}
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground">Energy Consumption vs Gas Usage by Minute</h2>
                      <p className="text-sm text-muted-foreground mt-1">Comparison of energy and gas consumption trends.</p>
                    </div>
                    <div className="h-[350px] w-full mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MINUTE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                          <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
                          <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                          <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12 }} />
                          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                          <Line yAxisId="left" type="monotone" dataKey="energy" name="Energy (kWh)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                          <Line yAxisId="right" type="monotone" dataKey="gas" name="Gas Usage (m³)" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Tabs>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      ) : id === "line-tracking" ? (
        <div className="space-y-6">
          <Tabs defaultValue="Line Tracking" className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col w-full">
            <div className="flex border-b border-border/50 bg-secondary/10 px-4 py-2">
              <TabsList>
                {["Line Tracking", "Process Detail"].map((tab) => (
                  <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="Line Tracking">
                <div className="border border-border/50 rounded-lg overflow-hidden bg-background">
                  {/* Map Header */}
                  <div className="flex flex-col gap-2 p-4 border-b border-border/50 bg-secondary/20">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Waves className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Skid Tracking Map (Green = Skid Present)</span>
                      </div>
                      <span suppressHydrationWarning className="text-xs font-mono text-muted-foreground">{new Date().toLocaleString('en-GB')}</span>
                    </div>
                    <p className="text-foreground text-sm">Real-time position of skids along the CED line (U-loop layout)</p>
                  </div>

                  {/* L-Shape Map Content */}
                  <div className="relative w-full min-h-[600px] overflow-auto flex items-center justify-center bg-background p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzQxNTUiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cjwvc3ZnPg==')]">
                    <img src={LineTrackingSvg} alt="Line Tracking Map" className="drop-shadow-sm dark:invert dark:opacity-80" style={{ filter: "drop-shadow(0px 0px 4px rgba(0,0,0,0.2))" }} />
                  </div>
                  
                  {/* Map Legend Footer */}
                  <div className="flex gap-4 p-3 bg-secondary/10 border-t border-border/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> GREEN = SKID PRESENT</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border-[1.5px] border-gray-400"></div> EMPTY STATION</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="Process Detail">
                <Tabs defaultValue="pre-degreasing" className="space-y-4">
                  {/* Sub-tabs for Process Detail */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <TabsList>
                      {["pre-degreasing", "degreasing", "phosphate", "flood"].map((tab) => (
                        <TabsTrigger key={tab} value={tab}>{tab.replace("-", " ")}</TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {["pre-degreasing", "degreasing", "phosphate", "flood"].map((tab) => (
                    <TabsContent key={tab} value={tab}>
                      <StationDetailContent tabKey={tab} />
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      ) : ["flood-station", "degreasing", "pree-degreasing", "phosphate"].includes(id) ? (
        <div className="space-y-6">
           <div className="bg-card border border-border rounded-lg shadow-sm p-6">
             <StationDetailContent tabKey={
               id === "flood-station" ? "flood" :
               id === "pree-degreasing" ? "pre-degreasing" :
               id
             } />
           </div>
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
                     <img src={MapsPtedAreaPng} alt="PTED Bag Filter" className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert" style={{ clipPath: 'inset(12% 0 0 0)' }} />
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      ) : ["oven-sealing", "oven-topcoat", "oven-ced"].includes(id) ? (
        <OvenDetailContent id={id} />
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
