import { createFileRoute, Link } from "@tanstack/react-router";
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

          {/* 3 Boiler Tanks Illustration */}
          <div className="grid gap-6 lg:grid-cols-3">
            {BOILERS.map((b) => (
              <div key={b.id} className="flex flex-col items-center">
                {/* Tank illustration */}
                <div className={`relative w-48 h-64 rounded-t-full border-4 flex flex-col items-center p-6 transition-colors ${b.running ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-gray-500/50 bg-gray-500/10'}`}>
                   <div className="text-lg font-bold flex items-center gap-2">
                     <Flame className={`h-5 w-5 ${b.running ? 'text-emerald-500' : 'text-gray-500'}`} />
                     {b.name}
                   </div>
                   
                   <div className="mt-6 flex flex-col gap-2 w-full text-center text-sm font-mono bg-background/60 rounded-md py-2 border border-border/50">
                     <div>Temp 1: <span className="font-bold">{b.temp1.toFixed(1)}°C</span></div>
                     <div>Temp 2: <span className="font-bold">{b.temp2.toFixed(1)}°C</span></div>
                   </div>
                   
                   <div className="mt-auto flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                      <StatusDot state={b.running ? "on" : "off"} />
                      <span className="text-sm font-bold font-mono">{b.running ? "ON" : "OFF"}</span>
                   </div>
                </div>
                
                {/* Details underneath the tank */}
                <div className="mt-4 w-full space-y-3 bg-secondary/30 p-4 rounded-xl border border-border/50">
                   <div className="flex flex-col text-sm border-b border-border/50 pb-3">
                     <div className="flex justify-between items-center mb-1.5">
                       <span className="font-medium text-muted-foreground">Boiler Status</span>
                       <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${b.running ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>{b.running ? "ON" : "OFF"}</span>
                     </div>
                     <div className="flex justify-between text-xs mt-1">
                       <span className="text-muted-foreground flex items-center gap-1.5"><Power className="h-3 w-3 text-ok" /> ON: <span className="text-foreground font-mono">{b.onTime}</span></span>
                       <span className="text-muted-foreground flex items-center gap-1.5"><Power className="h-3 w-3 text-destructive" /> OFF: <span className="text-foreground font-mono">{b.offTime}</span></span>
                     </div>
                   </div>
                   
                   <div className="flex flex-col text-sm">
                     <div className="flex justify-between items-center mb-1.5">
                       <span className="font-medium text-muted-foreground">Burner Status</span>
                       <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${b.fireBurner ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>{b.fireBurner ? "ON" : "OFF"}</span>
                     </div>
                     <div className="flex justify-between text-xs mt-1">
                       <span className="text-muted-foreground">Durasi ON:</span>
                       <span className="text-foreground font-mono">{b.burnerDuration}</span>
                     </div>
                   </div>
                   
                   <Link
                     to="/boiler-details/$id"
                     params={{ id: String(b.id) }}
                     className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition"
                   >
                     <Gauge className="h-3.5 w-3.5" /> Detail Lengkap
                   </Link>
                </div>
              </div>
            ))}
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
