import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/panel";
import { Plus, Save, Search, Settings2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/master-data")({
  head: () => ({
    meta: [
      { title: "Master Data — Utility Monitoring System" },
      { name: "description", content: "Configure parameter standards: min, max, and alarm thresholds for Boiler, CED, and Oven." },
    ],
  }),
  component: MasterDataPage,
});

type Param = {
  id: string; area: "Boiler" | "CED" | "Oven"; equipment: string;
  parameter: string; unit: string; min: number; max: number; sp: number; deadband: number; active: boolean;
};

const PARAMS: Param[] = [
  { id: "BLR-01-T1", area: "Boiler", equipment: "Boiler 1", parameter: "Steam Temperature 1", unit: "°C", min: 175, max: 195, sp: 185, deadband: 2, active: true },
  { id: "BLR-01-T2", area: "Boiler", equipment: "Boiler 1", parameter: "Steam Temperature 2", unit: "°C", min: 175, max: 195, sp: 185, deadband: 2, active: true },
  { id: "BLR-02-T1", area: "Boiler", equipment: "Boiler 2", parameter: "Steam Temperature 1", unit: "°C", min: 175, max: 195, sp: 185, deadband: 2, active: true },
  { id: "BLR-PR-01", area: "Boiler", equipment: "Boiler 1", parameter: "Steam Pressure", unit: "bar", min: 6, max: 10, sp: 8, deadband: 0.3, active: true },
  { id: "CED-PH-01", area: "CED", equipment: "Phosphating Tank", parameter: "pH Level", unit: "pH", min: 3.0, max: 3.6, sp: 3.3, deadband: 0.1, active: true },
  { id: "CED-TP-01", area: "CED", equipment: "Degreasing Tank", parameter: "Bath Temperature", unit: "°C", min: 45, max: 55, sp: 50, deadband: 1, active: true },
  { id: "CED-CD-01", area: "CED", equipment: "E-Coat Rectifier", parameter: "DC Voltage", unit: "V", min: 250, max: 320, sp: 285, deadband: 5, active: true },
  { id: "CED-SK-01", area: "CED", equipment: "Line Conveyor", parameter: "Skid Cycle Time", unit: "min", min: 3, max: 6, sp: 4.5, deadband: 0.3, active: true },
  { id: "OVN-Z1-T", area: "Oven", equipment: "Oven Zone 1", parameter: "Zone Temperature", unit: "°C", min: 180, max: 190, sp: 185, deadband: 2, active: true },
  { id: "OVN-Z2-T", area: "Oven", equipment: "Oven Zone 2", parameter: "Zone Temperature", unit: "°C", min: 185, max: 195, sp: 190, deadband: 2, active: true },
  { id: "OVN-Z3-T", area: "Oven", equipment: "Oven Zone 3", parameter: "Zone Temperature", unit: "°C", min: 175, max: 185, sp: 180, deadband: 2, active: true },
  { id: "OVN-KWH", area: "Oven", equipment: "Oven Main Meter", parameter: "Instant Power", unit: "kW", min: 800, max: 1400, sp: 1200, deadband: 30, active: true },
];

const TABS: Array<Param["area"] | "All"> = ["All", "Boiler", "CED", "Oven"];

function MasterDataPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [q, setQ] = useState("");
  const rows = PARAMS.filter((p) => (tab === "All" || p.area === tab) && (q === "" || `${p.equipment} ${p.parameter} ${p.id}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Master Data</div>
          <h1 className="text-2xl font-semibold mt-1">Parameter Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure operating standards — min, max, setpoint, and deadband for each parameter.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs hover:bg-secondary"><Save className="h-3.5 w-3.5" />Save Changes</button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"><Plus className="h-3.5 w-3.5" />New Parameter</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Total Parameters", v: PARAMS.length.toString() },
          { l: "Boiler", v: PARAMS.filter((p) => p.area === "Boiler").length.toString() },
          { l: "CED", v: PARAMS.filter((p) => p.area === "CED").length.toString() },
          { l: "Oven", v: PARAMS.filter((p) => p.area === "Oven").length.toString() },
        ].map((k) => (
          <Panel key={k.l} title={k.l}>
            <div className="text-3xl font-semibold font-mono tabular-nums">{k.v}</div>
          </Panel>
        ))}
      </div>

      <Panel
        title={<span className="inline-flex items-center gap-2"><Settings2 className="h-3.5 w-3.5" />Parameter Standards</span>}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search parameter…" className="h-8 w-64 rounded-md border border-border bg-card pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="flex rounded-md border border-border overflow-hidden text-[11px] font-mono">
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 ${tab === t ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{t.toUpperCase()}</button>
              ))}
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto -mx-4 -my-4">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                {["ID", "Area", "Equipment", "Parameter", "Unit", "Min", "Setpoint", "Max", "Deadband", "Status"].map((h) => (
                  <th key={h} className="text-left font-semibold px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-2 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-2"><span className="rounded bg-secondary px-2 py-0.5 text-[10px] uppercase">{p.area}</span></td>
                  <td className="px-4 py-2 text-xs">{p.equipment}</td>
                  <td className="px-4 py-2 text-xs text-foreground">{p.parameter}</td>
                  <td className="px-4 py-2 text-xs font-mono text-muted-foreground">{p.unit}</td>
                  <td className="px-4 py-2"><input defaultValue={p.min} className="w-20 rounded border border-border bg-background px-2 py-1 text-xs font-mono outline-none focus:ring-2 focus:ring-primary/40" /></td>
                  <td className="px-4 py-2"><input defaultValue={p.sp} className="w-20 rounded border border-border bg-background px-2 py-1 text-xs font-mono outline-none focus:ring-2 focus:ring-primary/40" /></td>
                  <td className="px-4 py-2"><input defaultValue={p.max} className="w-20 rounded border border-border bg-background px-2 py-1 text-xs font-mono outline-none focus:ring-2 focus:ring-primary/40" /></td>
                  <td className="px-4 py-2"><input defaultValue={p.deadband} className="w-20 rounded border border-border bg-background px-2 py-1 text-xs font-mono outline-none focus:ring-2 focus:ring-primary/40" /></td>
                  <td className="px-4 py-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={p.active} className="peer sr-only" />
                      <span className="relative h-4 w-8 rounded-full bg-muted peer-checked:bg-primary transition">
                        <span className="absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition peer-checked:translate-x-4" />
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">{p.active ? "ACTIVE" : "OFF"}</span>
                    </label>
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
