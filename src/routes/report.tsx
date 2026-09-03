import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/panel";
import { FileText, Download, Filter, Calendar } from "lucide-react";
import { energyTrend } from "@/lib/mock-data";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report — Utility Monitoring System" },
      { name: "description", content: "Generate and download periodic utility reports across Boiler, CED, and Oven." },
    ],
  }),
  component: ReportPage,
});

const ROWS = [
  { id: "RPT-2026-0721-01", area: "Boiler", period: "2026-07-20 00:00 → 24:00", type: "Daily", size: "142 KB", status: "Ready" },
  { id: "RPT-2026-0721-02", area: "Oven", period: "2026-07-20 00:00 → 24:00", type: "Daily", size: "128 KB", status: "Ready" },
  { id: "RPT-2026-0721-03", area: "CED", period: "2026-07-20 00:00 → 24:00", type: "Daily", size: "204 KB", status: "Ready" },
  { id: "RPT-2026-0720-W", area: "All Areas", period: "2026-07-13 → 2026-07-19", type: "Weekly", size: "876 KB", status: "Ready" },
  { id: "RPT-2026-0701-M", area: "All Areas", period: "2026-06 (Monthly)", type: "Monthly", size: "3.2 MB", status: "Ready" },
  { id: "RPT-2026-0721-04", area: "Boiler", period: "2026-07-21 00:00 → 12:00", type: "Ad-hoc", size: "—", status: "Generating" },
];

function ReportPage() {
  const data = energyTrend();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Report</div>
          <h1 className="text-2xl font-semibold mt-1">Utility Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate, preview, and download production & utility reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs hover:bg-secondary"><Calendar className="h-3.5 w-3.5" />Date Range</button>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs hover:bg-secondary"><Filter className="h-3.5 w-3.5" />Filter</button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"><FileText className="h-3.5 w-3.5" />Generate Report</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Reports Today", v: "12", icon: FileText, iconBg: "bg-blue-500/10 text-blue-500" },
          { l: "Pending", v: "1", icon: Calendar, iconBg: "bg-warn/10 text-warn" },
          { l: "Auto-Scheduled", v: "8", icon: Calendar, iconBg: "bg-purple-500/10 text-purple-500" },
          { l: "Total This Month", v: "246", icon: FileText, iconBg: "bg-emerald-500/10 text-emerald-500" },
        ].map((k) => (
          <div key={k.l} className="rounded-lg bg-card border border-border p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${k.iconBg}`}>
                <k.icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-sm font-medium text-foreground">{k.l}</span>
            </div>
            <div>
              <div className="text-2xl font-bold">{k.v}</div>
            </div>
          </div>
        ))}
      </div>

      <Panel title="Energy Consumption — Last 24h (kWh)" subtitle="Aggregated by area">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="boiler" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="oven" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Generated Reports" right={<span className="text-[10px] font-mono text-muted-foreground">{ROWS.length} ITEMS</span>}>
        <div className="overflow-x-auto -mx-4 -my-4">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                {["Report ID", "Area", "Period", "Type", "Size", "Status", ""].map((h) => (
                  <th key={h} className="text-left font-semibold px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-2.5 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-2.5">{r.area}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.period}</td>
                  <td className="px-4 py-2.5"><span className="rounded bg-secondary px-2 py-0.5 text-[10px] uppercase">{r.type}</span></td>
                  <td className="px-4 py-2.5 text-xs font-mono">{r.size}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${r.status === "Ready" ? "text-ok" : "text-warn"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${r.status === "Ready" ? "bg-ok" : "bg-warn animate-pulse"}`} />
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button disabled={r.status !== "Ready"} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed">
                      <Download className="h-3.5 w-3.5" />Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
