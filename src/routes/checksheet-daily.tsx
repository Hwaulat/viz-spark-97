import { createFileRoute } from "@tanstack/react-router";
import { Panel, StatusDot } from "@/components/panel";
import { DAILY_PROGRESS_DATA, DailyProgressRecord, CHECKSHEET_ITEMS } from "@/lib/mock-data";
import { Calendar, CheckCircle2, Clock, AlertTriangle, Send, UserCheck, Plus, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/checksheet-daily")({
  head: () => ({
    meta: [
      { title: "Daily Progress Check — Utility Monitoring" },
      { name: "description", content: "Daily checksheet data entry and progress tracking per shift and area." },
    ],
  }),
  component: DailyProgressCheck,
});

function DailyProgressCheck() {
  const [selectedDate, setSelectedDate] = useState("2026-07-21");
  const [selectedShift, setSelectedShift] = useState("Shift 1");
  const [selectedArea, setSelectedArea] = useState("Oven Area");
  const [submitted, setSubmitted] = useState(false);

  // Local state for interactive form inputs
  const [checks, setChecks] = useState([
    { id: 1, param: "Zone 1 Burner Pressure", std: "2.0 - 2.5 bar", actual: "2.2", status: "OK", pic: "Budi Santoso" },
    { id: 2, param: "Zone 2 Temp Deviation", std: "185 - 195 °C", actual: "191", status: "OK", pic: "Budi Santoso" },
    { id: 3, param: "Zone 3 Temp Deviation", std: "178 - 182 °C", actual: "176", status: "NG", pic: "Budi Santoso", note: "Valve adjusted" },
    { id: 4, param: "Exhaust Motor Vibration", std: "< 2.5 mm/s", actual: "1.1", status: "OK", pic: "Ahmad Rizky" },
    { id: "5", param: "Fresh Air Damper Position", std: "45% - 50%", actual: "48%", status: "OK", pic: "Ahmad Rizky" },
    { id: 6, param: "Safety Interlock Check", std: "Functional", actual: "Functional", status: "OK", pic: "Ahmad Rizky" },
  ]);

  const handleActualChange = (id: number | string, val: string) => {
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, actual: val } : c))
    );
  };

  const handleStatusToggle = (id: number | string) => {
    setChecks((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "OK" ? "NG" : "OK" } : c
      )
    );
  };

  const completedCount = checks.filter((c) => c.actual.trim() !== "").length;
  const progressPct = Math.round((completedCount / checks.length) * 100);
  const ngCount = checks.filter((c) => c.status === "NG").length;

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Checksheet System
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">
            Daily Progress Check
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daily parameter inspection form and real-time shift checklist tracking.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-md text-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none"
            />
          </div>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="bg-card border border-border px-3 py-2 rounded-md text-xs font-medium focus:outline-none"
          >
            <option value="Shift 1">Shift 1 (07:00 - 15:00)</option>
            <option value="Shift 2">Shift 2 (15:00 - 23:00)</option>
            <option value="Shift 3">Shift 3 (23:00 - 07:00)</option>
          </select>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-card border border-border px-3 py-2 rounded-md text-xs font-medium focus:outline-none"
          >
            <option value="Oven Area">Oven Area</option>
            <option value="Boiler Area">Boiler Area</option>
            <option value="CED Area">CED Area</option>
          </select>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel title="Shift Progress">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-mono tabular-nums text-foreground">{progressPct}%</span>
            <span className="text-xs text-muted-foreground font-mono">{completedCount}/{checks.length} Checked</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </Panel>

        <Panel title="Abnormal Items (NG)">
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-semibold font-mono tabular-nums ${ngCount > 0 ? "text-warn" : "text-ok"}`}>{ngCount}</span>
            <AlertTriangle className={`h-5 w-5 ${ngCount > 0 ? "text-warn" : "text-muted-foreground"}`} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{ngCount > 0 ? "Requires action / notes" : "All items in spec"}</p>
        </Panel>

        <Panel title="Inspector PIC">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
              BS
            </div>
            <div>
              <div className="text-sm font-semibold">Budi Santoso</div>
              <div className="text-[11px] text-muted-foreground">Senior Operator</div>
            </div>
          </div>
        </Panel>

        <Panel title="Form Status">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold">
                {submitted ? "Submitted for Review" : "Draft (In Progress)"}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {submitted ? "Sent to Hadi Kusuma" : "Save or submit when done"}
              </div>
            </div>
            <StatusDot state={submitted ? "on" : "warn"} size={10} pulse={!submitted} />
          </div>
        </Panel>
      </div>

      {/* Active Form */}
      <Panel
        title={`Checksheet Form — ${selectedArea} (${selectedShift})`}
        subtitle={`Date: ${selectedDate} · Fill actual values & set status`}
        right={
          <button
            onClick={() => setSubmitted(true)}
            disabled={submitted}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 shadow-sm"
          >
            {submitted ? (
              <>
                <Check className="h-3.5 w-3.5" /> Submitted
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" /> Submit to Approval
              </>
            )}
          </button>
        }
      >
        <div className="overflow-x-auto -mx-4 -my-4">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-4 py-2.5">No</th>
                <th className="text-left font-semibold px-4 py-2.5">Inspection Parameter</th>
                <th className="text-left font-semibold px-4 py-2.5">Standard Range</th>
                <th className="text-left font-semibold px-4 py-2.5">Actual Value</th>
                <th className="text-left font-semibold px-4 py-2.5">Status</th>
                <th className="text-left font-semibold px-4 py-2.5">PIC</th>
                <th className="text-left font-semibold px-4 py-2.5">Action / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {checks.map((c, idx) => (
                <tr key={c.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-medium">{c.param}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{c.std}</td>
                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      value={c.actual}
                      onChange={(e) => handleActualChange(c.id, e.target.value)}
                      className="w-28 rounded border border-border bg-background px-2 py-1 text-xs font-mono focus:border-primary focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => handleStatusToggle(c.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
                        c.status === "OK"
                          ? "bg-ok/15 text-ok hover:bg-ok/25"
                          : "bg-destructive/15 text-destructive hover:bg-destructive/25"
                      }`}
                    >
                      {c.status === "OK" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      {c.status}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{c.pic}</td>
                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      placeholder="Add note if NG..."
                      defaultValue={c.note || ""}
                      className="w-full max-w-xs rounded border border-border/60 bg-transparent px-2 py-1 text-xs focus:border-primary focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* History Log */}
      <Panel title="Recent Daily Progress Logs" right={<span className="text-[10px] font-mono text-muted-foreground">{DAILY_PROGRESS_DATA.length} ENTRIES</span>}>
        <div className="overflow-x-auto -mx-4 -my-4">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-4 py-2.5">Record ID</th>
                <th className="text-left font-semibold px-4 py-2.5">Date</th>
                <th className="text-left font-semibold px-4 py-2.5">Shift</th>
                <th className="text-left font-semibold px-4 py-2.5">Area</th>
                <th className="text-left font-semibold px-4 py-2.5">Checks Done</th>
                <th className="text-left font-semibold px-4 py-2.5">NG</th>
                <th className="text-left font-semibold px-4 py-2.5">Supervisor</th>
                <th className="text-left font-semibold px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DAILY_PROGRESS_DATA.map((dp) => (
                <tr key={dp.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{dp.id}</td>
                  <td className="px-4 py-2.5 text-xs font-mono">{dp.date}</td>
                  <td className="px-4 py-2.5 text-xs">{dp.shift}</td>
                  <td className="px-4 py-2.5"><span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium">{dp.area}</span></td>
                  <td className="px-4 py-2.5 text-xs font-mono">{dp.completedChecks}/{dp.totalChecks}</td>
                  <td className="px-4 py-2.5 text-xs font-mono font-semibold">{dp.ngCount > 0 ? <span className="text-warn">{dp.ngCount}</span> : "0"}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{dp.supervisor}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono ${
                        dp.status === "Completed"
                          ? "bg-ok/15 text-ok"
                          : dp.status === "Pending Review"
                          ? "bg-warn/15 text-warn"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          dp.status === "Completed" ? "bg-ok" : dp.status === "Pending Review" ? "bg-warn animate-pulse" : "bg-muted-foreground"
                        }`}
                      />
                      {dp.status}
                    </span>
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
