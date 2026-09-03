import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Panel, ValueDisplay } from "@/components/panel";
import { BOILERS, boilerEnergyDaily, boilerGasDaily } from "@/lib/mock-data";
import { ChevronLeft, Flame, Fuel, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export const Route = createFileRoute("/boiler-details/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Boiler ${params.id} Details — Utility Monitoring` },
      { name: "description", content: `Daily energy consumption and gas usage charts for Boiler ${params.id}.` },
    ],
  }),
  component: BoilerDetails,
  notFoundComponent: () => (
    <div className="p-6"><p className="text-sm text-muted-foreground">Boiler not found.</p></div>
  ),
});

function BoilerDetails() {
  const { id } = Route.useParams();
  const boiler = BOILERS.find((b) => String(b.id) === id);
  if (!boiler) throw notFound();

  const energyData = boilerEnergyDaily();
  const gasData = boilerGasDaily();
  const energySum = energyData.reduce((a, r) => a + r.energy, 0);
  const gasSum = gasData.reduce((a, r) => a + r.gas, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-4">
        <Link 
          to="/boiler" 
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm hover:bg-secondary transition-colors text-sm font-medium text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Boiler Details</div>
          <h1 className="text-2xl font-semibold mt-1 inline-flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" /> {boiler.name} — Consumption History
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Daily energy consumption and total gas usage (last 30 days).</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <ValueDisplay label="Total Energy (30d)" value={energySum.toLocaleString()} unit="kWh" tone="ok" />
        <ValueDisplay label="Avg Energy / Day" value={Math.round(energySum / 30).toLocaleString()} unit="kWh" />
        <ValueDisplay label="Total Gas (30d)" value={gasSum.toLocaleString()} unit="m³" tone="warn" />
        <ValueDisplay label="Avg Gas / Day" value={Math.round(gasSum / 30).toLocaleString()} unit="m³" />
      </div>

      <Panel
        title={<span className="inline-flex items-center gap-2"><Zap className="h-3.5 w-3.5" /> Energy Consumption — Daily</span>}
        subtitle="kWh consumed per day"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 11, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="energy" name="Energy (kWh)" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel
        title={<span className="inline-flex items-center gap-2 text-amber-500"><Fuel className="h-3.5 w-3.5" /> Total Gas Usage — Daily</span>}
        subtitle="m³ consumed per day"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gasData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 11, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="gas" name="Gas (m³)" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
