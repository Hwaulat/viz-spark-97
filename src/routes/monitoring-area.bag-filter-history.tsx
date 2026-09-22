import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronLeft, Calendar, ChevronDown, Filter, BarChart3 } from "lucide-react";
import { Search } from "@/components/ui/search";
import { SelectInput } from "@/components/ui/select-input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

export const Route = createFileRoute("/monitoring-area/bag-filter-history")({
  head: () => ({
    meta: [
      { title: "Bag Filter History — Utility Monitoring System" },
      { name: "description", content: "Bag Filter History" },
    ],
  }),
  component: BagFilterHistory,
});

function BagFilterHistory() {
  const [activeTab, setActiveTab] = useState("CED Line");
  const [activeHEPressureTab, setActiveHEPressureTab] = useState("IN");
  const [activeDITab, setActiveDITab] = useState("DI 1");
  const [activeCEDTab, setActiveCEDTab] = useState("CED 1");
  const [activeTimeRange, setActiveTimeRange] = useState("Daily");

  const chartData = useMemo(() => {
    let length = 24;
    if (activeTimeRange === "Monthly") length = 30;
    else if (activeTimeRange === "Yearly") length = 12;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return Array.from({ length }, (_, i) => {
      let timeLabel = `${i.toString().padStart(2, '0')}:00`;
      if (activeTimeRange === "Monthly") timeLabel = `Day ${i + 1}`;
      else if (activeTimeRange === "Yearly") timeLabel = months[i];

      return {
        time: timeLabel,
        di1: +(Math.random() * 5 + 20).toFixed(1),
        di2: +(Math.random() * 5 + 20).toFixed(1),
        di3: +(Math.random() * 5 + 20).toFixed(1),
        uf2: +(Math.random() * 5 + 25).toFixed(1),
        uf1: +(Math.random() * 5 + 25).toFixed(1),
        ced1: +(Math.random() * 5 + 28).toFixed(1),
        ced2: +(Math.random() * 5 + 28).toFixed(1),
        wr5: +(Math.random() * 5 + 20).toFixed(1),
        degreasing: +(Math.random() * 5 + 22).toFixed(1),
        preDegreasing: +(Math.random() * 5 + 24).toFixed(1),
        heIn: +(Math.random() * 5 + 30).toFixed(1),
        heOut: +(Math.random() * 5 + 32).toFixed(1),
        minLimit: 20,
        maxLimit: 35,
      };
    });
  }, [activeTimeRange]);

  const renderChart = (dataKey: string, name: string, color: string) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
        <YAxis 
          width={50}
          tick={{ fontSize: 10 }} 
          stroke="hsl(var(--muted-foreground))" 
          domain={['dataMin - 2', 'dataMax + 2']} 
          axisLine={false} 
          tickLine={false}
          label={{ 
            value: "Pressure (MPa)", 
            angle: -90, 
            position: "insideLeft", 
            style: { textAnchor: "middle", fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 } 
          }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
          itemStyle={{ color: '#fff', fontSize: '12px' }}
          labelStyle={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
        <Line type="monotone" dataKey="maxLimit" name="Max" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" dot={false} activeDot={false} />
        <Line type="monotone" dataKey="minLimit" name="Min" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" dot={false} activeDot={false} />
        <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            to="/monitoring-area/$id"
            params={{ id: "bag-filter" }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm hover:bg-secondary transition-colors text-sm font-medium text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
             <BarChart3 className="h-5 w-5 text-primary" /> Historical Charts
          </h1>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto overflow-x-auto custom-scrollbar">
            {["CED Line", "Pre-Treatment Line"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 whitespace-nowrap transition-colors ${activeTab === t
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 h-auto overflow-x-auto custom-scrollbar">
            {["Daily", "Monthly", "Yearly"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTimeRange(t)}
                className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 whitespace-nowrap transition-colors ${activeTimeRange === t
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Charts 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
        {activeTab === "CED Line" ? (
          <>
            {/* Chart 1: DI Water Spray */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0">
                 <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trend DI Water Spray</h2>
                   <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 shrink-0">
                     {["DI 1", "DI 2", "DI 3"].map(tab => (
                       <button 
                         key={tab} 
                         onClick={() => setActiveDITab(tab)}
                         className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 whitespace-nowrap transition-colors ${activeDITab === tab
                           ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                           : "hover:text-gray-700 dark:hover:text-gray-300"
                           }`}
                       >{tab}</button>
                     ))}
                   </div>
                </div>
                <div className="h-[250px] w-full">
                   {renderChart(activeDITab.toLowerCase().replace(' ', ''), `Pressure ${activeDITab} (MPa)`, "#3b82f6")}
                </div>
              </div>

              {/* Chart 2: UF 2 */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0">
                   <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trend UF 2</h2>
                </div>
                <div className="h-[250px] w-full">
                   {renderChart("uf2", "Pressure UF 2 (MPa)", "#10b981")}
                </div>
              </div>

              {/* Chart 3: UF 1 */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0">
                   <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trend UF 1</h2>
                </div>
                <div className="h-[250px] w-full">
                   {renderChart("uf1", "Pressure UF 1 (MPa)", "#f59e0b")}
                </div>
              </div>

              {/* Chart 4: CED */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0">
                   <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trend CED</h2>
                   <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 shrink-0">
                     {["CED 1", "CED 2"].map(tab => (
                       <button 
                         key={tab} 
                         onClick={() => setActiveCEDTab(tab)}
                         className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 whitespace-nowrap transition-colors ${activeCEDTab === tab
                           ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                           : "hover:text-gray-700 dark:hover:text-gray-300"
                           }`}
                       >{tab}</button>
                     ))}
                   </div>
                </div>
                <div className="h-[250px] w-full">
                   {renderChart(activeCEDTab.toLowerCase().replace(' ', ''), `Pressure ${activeCEDTab} (MPa)`, "#8b5cf6")}
                </div>
            </div>
          </>
        ) : (
          <>
            {/* Chart 1: WR 5 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0">
                 <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trend Water Rinse 5</h2>
              </div>
              <div className="h-[250px] w-full">
                 {renderChart("wr5", "Pressure WR 5 (MPa)", "#3b82f6")}
              </div>
            </div>

            {/* Chart 2: Degreasing */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0">
                 <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trend Degreasing</h2>
              </div>
              <div className="h-[250px] w-full">
                 {renderChart("degreasing", "Pressure Degreasing (MPa)", "#10b981")}
              </div>
            </div>

            {/* Chart 3: Pre-Degreasing */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0">
                 <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trend Pre-Degreasing</h2>
              </div>
              <div className="h-[250px] w-full">
                 {renderChart("preDegreasing", "Pressure Pre-Degreasing (MPa)", "#f59e0b")}
              </div>
            </div>

            {/* Chart 4: HE Pressure */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0">
                 <h2 className="text-xl font-bold tracking-tight text-foreground">Pressure Trend HE Pressure</h2>
                 <div className="flex bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 shrink-0">
                   {["IN", "OUT"].map(tab => (
                     <button 
                       key={tab} 
                       onClick={() => setActiveHEPressureTab(tab)}
                       className={`text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium h-8 px-4 whitespace-nowrap transition-colors ${activeHEPressureTab === tab
                         ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                         : "hover:text-gray-700 dark:hover:text-gray-300"
                         }`}
                     >{tab}</button>
                   ))}
                 </div>
              </div>
              <div className="h-[250px] w-full">
                 {renderChart(activeHEPressureTab === "IN" ? "heIn" : "heOut", `Pressure HE ${activeHEPressureTab} (MPa)`, "#8b5cf6")}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
