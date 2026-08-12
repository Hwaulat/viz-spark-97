import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel } from "@/components/panel";
import { Activity, Thermometer, Gauge, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/monitoring-area")({
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

const AREAS = [
  { id: "boiler-area", name: "Boiler Area", temp: "185", pressure: "9.2" },
  { id: "flood-station", name: "Flood Station", temp: "30.1", pressure: "1.6" },
  { id: "pree-degreasing", name: "Pree Degreasing", temp: "28.5", pressure: "1.8" },
  { id: "degreasing", name: "Degreasing", temp: "35.0", pressure: "2.1" },
  { id: "phosphate", name: "Phosphate", temp: "42.5", pressure: "1.5" },
  { id: "oven-sealing", name: "Oven Sealing", temp: "150", pressure: "2.3" },
  { id: "oven-topcoat", name: "Oven Topcoat", temp: "175", pressure: "2.4" },
  { id: "oven-ced", name: "Oven CED", temp: "190", pressure: "2.5" },
  { id: "pted-bag-filter", name: "PTED Bag Filter", temp: "25.0", pressure: "3.2" },
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
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="rounded-lg bg-secondary/50 p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    <Thermometer className="h-3.5 w-3.5" /> Temp
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold tabular-nums">
                      {area.temp}
                    </span>
                    <span className="text-xs text-muted-foreground">°C</span>
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    <Gauge className="h-3.5 w-3.5" /> Pressure
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold tabular-nums">
                      {area.pressure}
                    </span>
                    <span className="text-xs text-muted-foreground">bar</span>
                  </div>
                </div>
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}
