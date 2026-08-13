import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Activity, Flame, Gauge, Power } from "lucide-react";
import { BOILERS, BOILER_GAS } from "@/lib/mock-data";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";

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

          {/* Tabs */}
          <div className="flex border-b border-border/50">
            {["Boiler Monitoring", "Cummulative Usage", "Historical Charts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Boiler Monitoring" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {BOILERS.map((b) => (
                <div key={b.id} className="flex flex-col items-center">
                  {/* Tank illustration */}
                  <div className="relative w-48 h-[270px] rounded-t-[60px] rounded-b-2xl border-2 border-border shadow-xl overflow-hidden bg-gradient-to-b from-secondary/80 to-secondary/30 flex flex-col items-center p-5">
                    {/* Subtle inner reflection */}
                    <div className="absolute inset-y-0 left-4 w-4 bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-full blur-[2px]" />
                    <div className="absolute inset-y-0 right-2 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none rounded-full blur-[4px]" />
                    
                    {/* Fire glow at bottom */}
                    {b.running && (
                      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent pointer-events-none" />
                    )}
                    
                    <div className="text-lg font-bold flex flex-col items-center gap-1.5 z-10">
                      <Flame className={`h-7 w-7 ${b.running ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'text-gray-500'}`} />
                      {b.name}
                    </div>
                    
                    <div className="mt-5 flex flex-col gap-2 w-full text-center text-sm font-mono bg-background/80 backdrop-blur-md rounded-xl p-3 border border-border/50 shadow-sm z-10">
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
                    
                    <div className="mt-auto flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full border border-border/50 shadow-sm z-10 backdrop-blur-sm">
                        <StatusDot state={b.running ? "on" : "off"} />
                        <span className="text-sm font-bold font-mono tracking-widest">{b.running ? "ON" : "OFF"}</span>
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
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground bg-secondary/20">
              <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm font-medium">Cummulative Usage Data</p>
              <p className="text-xs mt-1">Energy and Gas consumption aggregations are currently being prepared.</p>
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
