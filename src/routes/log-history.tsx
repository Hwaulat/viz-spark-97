import { createFileRoute } from "@tanstack/react-router";
import { Panel, StatusDot } from "@/components/panel";
import { Search, Filter, Download } from "lucide-react";
import { ALARMS } from "@/lib/mock-data";

export const Route = createFileRoute("/log-history")({
  head: () => ({
    meta: [
      { title: "Log History — Utility Monitoring System" },
      { name: "description", content: "Chronological log of alarms, operator actions, and system events." },
    ],
  }),
  component: LogHistoryPage,
});

const EXTRA = [
  { t: "2026-07-21 07:22:11", area: "System", eq: "Auth", msg: "User 'operator1' signed in", sev: "info", user: "operator1" },
  { t: "2026-07-21 07:18:03", area: "Boiler", eq: "Boiler 1", msg: "Setpoint changed 183°C → 185°C", sev: "info", user: "supervisor" },
  { t: "2026-07-21 06:55:47", area: "CED", eq: "PUS111", msg: "Manual restart", sev: "info", user: "operator2" },
  { t: "2026-07-21 06:41:29", area: "Oven", eq: "Zone 3", msg: "Ack alarm — Temp below range", sev: "info", user: "supervisor" },
  { t: "2026-07-21 06:12:00", area: "System", eq: "Scheduler", msg: "Daily report generated", sev: "info", user: "system" },
];

const FULL_LOG = [
  ...ALARMS.map((a) => ({ ...a, t: `2026-07-21 ${a.t}`, user: "system" })),
  ...EXTRA,
];

function LogHistoryPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Log History</div>
          <h1 className="text-2xl font-semibold mt-1">Events & Alarm Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Chronological history of alarms, acknowledgements, and operator actions.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search event, equipment, user…" className="h-9 w-72 rounded-md border border-border bg-card pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs hover:bg-secondary"><Filter className="h-3.5 w-3.5" />Filter</button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"><Download className="h-3.5 w-3.5" />Export CSV</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Events Today", v: "142", tone: "" },
          { l: "Alarms", v: "6", tone: "text-warn" },
          { l: "Acknowledged", v: "5", tone: "text-ok" },
          { l: "Operator Actions", v: "18", tone: "" },
        ].map((k) => (
          <Panel key={k.l} title={k.l}>
            <div className={`text-3xl font-semibold font-mono tabular-nums ${k.tone}`}>{k.v}</div>
          </Panel>
        ))}
      </div>

      <Panel title="Event Log" right={<span className="text-[10px] font-mono text-muted-foreground">{FULL_LOG.length} ENTRIES</span>}>
        <div className="overflow-x-auto -mx-4 -my-4">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                {["Timestamp", "Severity", "Area", "Equipment", "Message", "User"].map((h) => (
                  <th key={h} className="text-left font-semibold px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FULL_LOG.map((r, i) => (
                <tr key={i} className="hover:bg-secondary/40">
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{r.t}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <StatusDot state={r.sev === "warn" ? "warn" : "idle"} size={8} />
                      <span className={`text-[11px] font-mono uppercase ${r.sev === "warn" ? "text-warn" : "text-muted-foreground"}`}>{r.sev}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5"><span className="rounded bg-secondary px-2 py-0.5 text-[10px] uppercase">{r.area}</span></td>
                  <td className="px-4 py-2.5 font-mono text-xs">{r.eq}</td>
                  <td className="px-4 py-2.5 text-foreground">{r.msg}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
