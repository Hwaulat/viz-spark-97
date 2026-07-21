import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import { CHECKSHEET_ITEMS, ChecksheetItem } from "@/lib/mock-data";
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Filter, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/checksheet")({
  head: () => ({
    meta: [
      { title: "Dashboard Checksheet — Utility Monitoring" },
      { name: "description", content: "Overview of equipment & parameter checksheet logs across plant areas." },
    ],
  }),
  component: DashboardChecksheet,
});

function DashboardChecksheet() {
  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const items = CHECKSHEET_ITEMS.filter((item) => {
    if (selectedArea !== "All" && item.area !== selectedArea) return false;
    if (selectedStatus !== "All" && item.status !== selectedStatus) return false;
    return true;
  });

  const totalChecks = CHECKSHEET_ITEMS.length;
  const okCount = CHECKSHEET_ITEMS.filter((i) => i.status === "OK").length;
  const ngCount = CHECKSHEET_ITEMS.filter((i) => i.status === "NG").length;
  const completionRate = Math.round((okCount / totalChecks) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Checksheet System
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">
            Dashboard Checksheet
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time status overview of quality and operational equipment checks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/checksheet-daily"
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-medium hover:bg-secondary/80 border border-border"
          >
            <Clock className="h-3.5 w-3.5 text-primary" />
            Daily Check
          </Link>
          <Link
            to="/checksheet-approval"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Approval Center
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel title="Total Checked Items">
          <div className="flex items-end justify-between">
            <ValueDisplay label="Items Checked" value={totalChecks} tone="default" />
            <ClipboardCheck className="h-5 w-5 text-muted-foreground mb-2" />
          </div>
        </Panel>
        <Panel title="Normal Status (OK)">
          <div className="flex items-end justify-between">
            <ValueDisplay label="Passed" value={okCount} tone="ok" />
            <CheckCircle2 className="h-5 w-5 text-ok mb-2" />
          </div>
        </Panel>
        <Panel title="Abnormal Status (NG)">
          <div className="flex items-end justify-between">
            <ValueDisplay label="Requires Action" value={ngCount} tone="danger" />
            <XCircle className="h-5 w-5 text-destructive mb-2" />
          </div>
        </Panel>
        <Panel title="Completion Rate">
          <div className="flex items-end justify-between">
            <ValueDisplay label="Target: 95%" value={`${completionRate}%`} tone={completionRate >= 90 ? "ok" : "warn"} />
            <div className="h-2 w-16 rounded-full bg-secondary overflow-hidden mb-3">
              <div
                className={`h-full ${completionRate >= 90 ? "bg-ok" : "bg-warn"}`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </Panel>
      </div>

      {/* Area Completion Bars */}
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { area: "Oven Area", total: 18, checked: 18, ng: 1, color: "bg-primary" },
          { area: "Boiler Area", total: 14, checked: 14, ng: 0, color: "bg-ok" },
          { area: "CED Area", total: 22, checked: 22, ng: 1, color: "bg-warn" },
        ].map((a) => {
          const pct = Math.round((a.checked / a.total) * 100);
          return (
            <Panel key={a.area} title={a.area} right={<span className="text-xs font-mono text-muted-foreground">{pct}% Done</span>}>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Checks Completed</span>
                  <span className="font-mono font-medium">{a.checked} / {a.total}</span>
                </div>
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full ${a.color}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-muted-foreground">Abnormalities (NG):</span>
                  <span className={`font-mono font-semibold ${a.ng > 0 ? "text-destructive" : "text-ok"}`}>{a.ng} item(s)</span>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      {/* Table Section */}
      <Panel
        title="Recent Checksheet Items"
        right={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-secondary/60 rounded-lg p-1 text-xs">
              <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                aria-label="Filter Area"
                className="bg-transparent border-none text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="All">All Areas</option>
                <option value="Oven">Oven</option>
                <option value="Boiler">Boiler</option>
                <option value="CED">CED</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary/60 rounded-lg p-1 text-xs">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                aria-label="Filter Status"
                className="bg-transparent border-none text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="OK">OK Only</option>
                <option value="NG">NG Only</option>
              </select>
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto -mx-4 -my-4">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-4 py-2.5">ID</th>
                <th className="text-left font-semibold px-4 py-2.5">Area</th>
                <th className="text-left font-semibold px-4 py-2.5">Parameter</th>
                <th className="text-left font-semibold px-4 py-2.5">Standard</th>
                <th className="text-left font-semibold px-4 py-2.5">Actual</th>
                <th className="text-left font-semibold px-4 py-2.5">Status</th>
                <th className="text-left font-semibold px-4 py-2.5">Shift</th>
                <th className="text-left font-semibold px-4 py-2.5">Inspector</th>
                <th className="text-left font-semibold px-4 py-2.5">Time</th>
                <th className="text-left font-semibold px-4 py-2.5">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{item.id}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase">
                      {item.area}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium">{item.parameter}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground font-mono">{item.standard} {item.unit}</td>
                  <td className="px-4 py-2.5 text-xs font-mono font-semibold">{item.actual} {item.unit}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        item.status === "OK"
                          ? "bg-ok/15 text-ok"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      <StatusDot state={item.status === "OK" ? "on" : "alarm"} size={6} />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{item.shift}</td>
                  <td className="px-4 py-2.5 text-xs">{item.checkedBy}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{item.time}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground italic">
                    {item.note || "—"}
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
