import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import {
  CED_STATIONS,
  CED_ZONES,
  CED_PROCESS_TEMPS,
  CED_PUMPS,
  CED_VALVES,
  cedTempTrend,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  Gauge,
  Waves,
  Thermometer,
  Activity,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export const Route = createFileRoute("/ced")({
  head: () => ({
    meta: [
      { title: "CED Area — Utility Monitoring" },
      {
        name: "description",
        content:
          "Cathodic Electro-Deposition line — 5 zone temperatures, skid tracking & station details.",
      },
    ],
  }),
  component: CEDArea,
});

function CEDArea() {
  const [tab, setTab] = useState<"temps" | "line" | "process">("temps");
  const [zone, setZone] = useState("phos");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            CED Area · CB-B11
          </div>
          <h1 className="text-2xl font-semibold mt-1">
            Cathodic Electro-Deposition Line
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            5 Process Zone Temperature Monitoring, Line Tracking, Pumps P1/P2 & Modulating Valves.
          </p>
        </div>
        <div className="inline-flex rounded-md border border-border bg-panel p-1 text-xs font-mono">
          {(["temps", "line", "process"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1.5 rounded uppercase tracking-wider transition",
                tab === t
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "temps"
                ? "Zone Temp & Trend"
                : t === "line"
                ? "Line Tracking"
                : "Process Detail"}
            </button>
          ))}
        </div>
      </div>

      {tab === "temps" ? (
        <ProcessZoneTemperatures />
      ) : tab === "line" ? (
        <LineTracking />
      ) : (
        <ProcessDetail zone={zone} setZone={setZone} />
      )}
    </div>
  );
}

/* ---------- 2.1 & 2.3 Process Zone Temperatures & Alarm Logic ---------- */
function ProcessZoneTemperatures() {
  const [activeSeries, setActiveSeries] = useState<Record<string, boolean>>({
    flood: true,
    predeg: true,
    deg: true,
    phos: true,
    ced: true,
  });

  const floodAlarm = CED_PROCESS_TEMPS.find(
    (t) => t.id === "flood" && t.pv < t.sp
  );
  const trendData = cedTempTrend();

  const toggleSeries = (key: string) => {
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const colors: Record<string, string> = {
    flood: "var(--chart-4)",
    predeg: "var(--chart-1)",
    deg: "var(--chart-2)",
    phos: "var(--chart-3)",
    ced: "var(--chart-5)",
  };

  return (
    <div className="space-y-6">
      {/* Alarm Banner if Flood PV < SP */}
      {floodAlarm && (
        <div className="rounded-lg border border-destructive/60 bg-destructive/10 p-4 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 pulse-alarm text-destructive" />
            <div>
              <div className="font-semibold text-sm">
                ALARM: Station Flood Temperature Low (PV &lt; SP)
              </div>
              <div className="text-xs text-destructive/90 mt-0.5">
                Actual: <strong>{floodAlarm.pv}°C</strong> · Target (SP):{" "}
                <strong>{floodAlarm.sp}°C</strong> · Actual temperature is below target!
              </div>
            </div>
          </div>
          <span className="rounded bg-destructive text-destructive-foreground px-2.5 py-1 text-xs font-mono font-semibold">
            ALARM ACTIVE
          </span>
        </div>
      )}

      {/* 5 Cards for Process Zone Temps */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-primary" />
          5 CED Process Zone Temperature Points
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CED_PROCESS_TEMPS.map((t) => {
            const isAlarm = t.pv < t.sp && t.id === "flood";
            const dev = +(t.pv - t.sp).toFixed(1);
            return (
              <Panel
                key={t.id}
                tone={isAlarm ? "danger" : "ok"}
                title={<span className="text-[10px] font-mono">{t.name}</span>}
                right={
                  <StatusDot
                    state={isAlarm ? "alarm" : "on"}
                    pulse={isAlarm}
                    size={8}
                  />
                }
              >
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={cn(
                        "text-2xl font-mono font-semibold tabular-nums",
                        isAlarm ? "text-destructive" : "text-foreground"
                      )}
                    >
                      {t.pv}
                    </span>
                    <span className="text-xs text-muted-foreground">{t.unit} PV</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/50">
                    <span>SP: {t.sp}°C</span>
                    <span className={dev < 0 ? "text-destructive font-semibold" : "text-ok"}>
                      Δ {dev > 0 ? "+" : ""}{dev}°C
                    </span>
                  </div>
                  {isAlarm && (
                    <div className="mt-1 rounded bg-destructive/15 px-1.5 py-0.5 text-[9px] font-mono text-destructive text-center font-bold">
                      PV &lt; SP ALARM
                    </div>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      </div>

      {/* Multi-Series Trend Chart */}
      <Panel
        title={
          <span className="inline-flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Multi-Series Temperature Trend Chart (5 CED Zones — 24H)
          </span>
        }
        subtitle="Overlay all zones simultaneously or filter by clicking legend buttons on the right"
        right={
          <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
            {CED_PROCESS_TEMPS.map((z) => (
              <button
                key={z.id}
                onClick={() => toggleSeries(z.id)}
                className={cn(
                  "px-2 py-1 rounded border transition flex items-center gap-1.5",
                  activeSeries[z.id]
                    ? "bg-secondary text-foreground border-border font-medium"
                    : "opacity-40 border-transparent bg-transparent text-muted-foreground"
                )}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: colors[z.id] }}
                />
                {z.name.replace("Temperature ", "")}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} domain={[25, 60]} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {activeSeries.flood && (
                <Line type="monotone" name="Flood" dataKey="flood" stroke={colors.flood} strokeWidth={2} dot={false} />
              )}
              {activeSeries.predeg && (
                <Line type="monotone" name="Pre-Degreasing" dataKey="predeg" stroke={colors.predeg} strokeWidth={2} dot={false} />
              )}
              {activeSeries.deg && (
                <Line type="monotone" name="Degreasing" dataKey="deg" stroke={colors.deg} strokeWidth={2} dot={false} />
              )}
              {activeSeries.phos && (
                <Line type="monotone" name="Phosphate" dataKey="phos" stroke={colors.phos} strokeWidth={2} dot={false} />
              )}
              {activeSeries.ced && (
                <Line type="monotone" name="CED Bath" dataKey="ced" stroke={colors.ced} strokeWidth={2} dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* 2.4 Water Pumps (P1, P2) & 2.5 Modulating Valves (VAM) */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pumps P1 / P2 Status */}
        <Panel
          title="Water Pumps Status (P1 & P2)"
          subtitle="Circulation pump ON / OFF status per station"
        >
          <div className="overflow-x-auto -mx-4 -my-4">
            <table className="w-full text-xs">
              <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-4 py-2.5">Station</th>
                  <th className="text-center font-semibold px-4 py-2.5">Pump P1</th>
                  <th className="text-center font-semibold px-4 py-2.5">Pump P2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CED_PUMPS.map((p, i) => (
                  <tr key={i} className="hover:bg-secondary/40">
                    <td className="px-4 py-2.5 font-medium">{p.station}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-semibold",
                          p.p1 === "ON"
                            ? "bg-ok/15 text-ok"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <StatusDot state={p.p1 === "ON" ? "on" : "off"} size={6} />
                        {p.p1}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-semibold",
                          p.p2 === "ON"
                            ? "bg-ok/15 text-ok"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <StatusDot state={p.p2 === "ON" ? "on" : "off"} size={6} />
                        {p.p2}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Modulating Valves (VAM) */}
        <Panel
          title="Modulating Valve (VAM % Opening)"
          subtitle="Display of modulating control valve opening percentage"
        >
          <div className="space-y-3">
            {CED_VALVES.map((v) => (
              <div
                key={v.tag}
                className="rounded-md border border-border/50 bg-secondary/30 p-2.5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-xs text-primary">
                      {v.tag}
                    </span>
                    <span className="text-xs text-foreground font-medium">
                      {v.name}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-48 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${v.openPct}%` }}
                    />
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-semibold text-primary">
                    {v.openPct}%
                  </span>
                  <div className="text-[10px] text-muted-foreground">Opening</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* 2.2 ES-B1, ES-B2, ES-B3 Placeholder Section */}
      <Panel
        title={
          <span className="inline-flex items-center gap-2 text-amber-500 font-semibold">
            <HelpCircle className="h-4 w-4" /> ES Station Points (ES-B1, ES-B2, ES-B3)
          </span>
        }
        subtitle="ES point monitoring slot/placeholder (awaiting detail confirmation of function & data)"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {["ES-B1", "ES-B2", "ES-B3"].map((es) => (
            <div
              key={es}
              className="rounded-lg border border-dashed border-border/80 bg-secondary/20 p-4 text-center space-y-2"
            >
              <div className="font-mono text-sm font-semibold text-foreground">
                {es}
              </div>
              <div className="inline-block rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-medium">
                ⏳ Pending Confirmation
              </div>
              <p className="text-[11px] text-muted-foreground">
                Functions & data have not been defined in detail yet.
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------- 2.2 Line Tracking Component ---------- */
function LineTracking() {
  const occupied = CED_STATIONS.filter((s) => s.occupied).length;
  const stuck = CED_STATIONS.filter((s) => s.stuck).length;
  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Panel title="Line Occupancy">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-semibold">{occupied}</span>
            <span className="text-sm text-muted-foreground">
              / {CED_STATIONS.length} stations
            </span>
          </div>
        </Panel>
        <Panel title="Avg Cycle Time">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-semibold">42.6</span>
            <span className="text-sm text-muted-foreground">min / skid</span>
          </div>
        </Panel>
        <Panel title="Stuck Skids" tone={stuck > 0 ? "warn" : "default"}>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-3xl font-mono font-semibold", stuck && "text-warn")}>
              {stuck}
            </span>
            <span className="text-sm text-muted-foreground">&gt; 5 min idle</span>
          </div>
        </Panel>
        <Panel title="Line Mode">
          <div className="flex items-center gap-2">
            <StatusDot state="on" />
            <span className="text-lg font-mono">AUTO</span>
            <span className="ml-auto text-[10px] text-muted-foreground">ES: NORMAL</span>
          </div>
        </Panel>
      </div>

      <Panel
        title={
          <span className="inline-flex items-center gap-2">
            <Waves className="h-3.5 w-3.5" />
            Skid Tracking Map (Green = Skid Present)
          </span>
        }
        subtitle="Real-time position of skids along the CED line (U-loop layout)"
        right={
          <span className="font-mono text-[11px] text-muted-foreground">
            {new Date().toLocaleString("en-GB", { hour12: false })}
          </span>
        }
      >
        {/* Zone legend */}
        <div className="flex flex-wrap gap-3 mb-3 text-[10px] font-mono">
          {CED_ZONES.map((z) => (
            <span key={z.key} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded" style={{ background: z.color }} />
              <span className="uppercase tracking-wider text-muted-foreground">
                {z.label}
              </span>
            </span>
          ))}
        </div>

        <div className="rounded-md border border-border bg-background/60 grid-bg overflow-x-auto">
          <svg
            viewBox="0 0 1200 410"
            className="w-full min-w-[900px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Zone backdrops */}
            {(() => {
              const groups: Record<string, { min: number; max: number; y: number }> = {};
              CED_STATIONS.forEach((s) => {
                const g = groups[s.zone] ?? { min: s.x, max: s.x, y: s.y };
                g.min = Math.min(g.min, s.x - 20);
                g.max = Math.max(g.max, s.x + 20);
                g.y = s.y;
                groups[s.zone] = g;
              });
              return CED_ZONES.map((z) => {
                const g = groups[z.key];
                if (!g) return null;
                return (
                  <g key={z.key}>
                    <rect
                      x={g.min}
                      y={g.y - 28}
                      width={g.max - g.min}
                      height={56}
                      rx={10}
                      fill={z.color}
                      opacity={0.14}
                      stroke={z.color}
                      strokeOpacity={0.4}
                    />
                    <text
                      x={(g.min + g.max) / 2}
                      y={g.y - 34}
                      textAnchor="middle"
                      fontSize={9}
                      fill="var(--muted-foreground)"
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: 1.4,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {z.label}
                    </text>
                  </g>
                );
              });
            })()}

            {/* Conveyor path */}
            <path
              d={`M 40 90 L 1160 90 Q 1190 90 1190 120 L 1190 290 Q 1190 320 1160 320 L 40 320 Q 10 320 10 290 L 10 120 Q 10 90 40 90 Z`}
              fill="none"
              stroke="var(--grid-line)"
              strokeWidth={22}
              strokeLinejoin="round"
            />
            <path
              d={`M 40 90 L 1160 90 Q 1190 90 1190 120 L 1190 290 Q 1190 320 1160 320 L 40 320 Q 10 320 10 290 L 10 120 Q 10 90 40 90 Z`}
              fill="none"
              stroke="var(--border)"
              strokeWidth={1}
              strokeDasharray="4 6"
            />

            {/* Direction arrows */}
            <g fill="var(--primary)" opacity={0.8}>
              <polygon points="600,84 610,90 600,96" />
              <polygon
                points="600,314 610,320 600,326"
                transform="translate(-20,0) scale(-1,1) translate(-1200,0)"
              />
            </g>

            {/* Stations */}
            {CED_STATIONS.map((s) => {
              const zone = CED_ZONES.find((z) => z.key === s.zone)!;
              const isStuck = s.stuck;
              return (
                <g key={s.id}>
                  <title>{`${s.id} — ${zone.label}${
                    s.occupied ? ` · occupied ${s.since}` : " · empty"
                  }`}</title>
                  {s.occupied ? (
                    <>
                      {/* Green = skid/unit present */}
                      <circle
                        cx={s.x}
                        cy={s.y}
                        r={9}
                        fill={isStuck ? "var(--warn)" : "var(--ok)"}
                        stroke={isStuck ? "var(--warn)" : "var(--ok)"}
                        opacity={0.95}
                        style={{
                          filter: `drop-shadow(0 0 4px ${
                            isStuck ? "var(--warn)" : "var(--ok)"
                          })`,
                        }}
                      />
                      {isStuck && (
                        <circle
                          cx={s.x}
                          cy={s.y}
                          r={13}
                          fill="none"
                          stroke="var(--warn)"
                          strokeWidth={1.5}
                          opacity={0.5}
                        >
                          <animate
                            attributeName="r"
                            values="9;16;9"
                            dur="1.4s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.6;0;0.6"
                            dur="1.4s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </>
                  ) : (
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r={8}
                      fill="var(--background)"
                      stroke="var(--muted-foreground)"
                      strokeWidth={1.5}
                      opacity={0.7}
                    />
                  )}
                  <text
                    x={s.x}
                    y={s.y + 26}
                    textAnchor="middle"
                    fontSize={8}
                    fill="var(--muted-foreground)"
                    fontFamily="var(--font-mono)"
                  >
                    {s.id}
                  </text>
                </g>
              );
            })}

            {/* Loading / unloading markers */}
            <g fontFamily="var(--font-mono)" fontSize={10} fill="var(--primary)">
              <text x={40} y={64} textAnchor="middle">
                ▶ LOAD
              </text>
              <text x={1160} y={355} textAnchor="middle">
                UNLOAD ▶
              </text>
            </g>
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ok shadow-[0_0_6px_var(--ok)]" />
            GREEN = SKID PRESENT
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-muted-foreground" />
            EMPTY STATION
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-warn shadow-[0_0_6px_var(--warn)]" />
            STUCK &gt; 5min
          </span>
        </div>
      </Panel>
    </>
  );
}

/* ---------- Process Detail Mimic ---------- */
const ZONE_TABS = [
  { key: "deg", label: "Degreasing" },
  { key: "act", label: "Activation" },
  { key: "phos", label: "Phosphating" },
  { key: "rinse", label: "Rinse" },
  { key: "ecoat", label: "Flood / E-Coat" },
];

function ProcessDetail({
  zone,
  setZone,
}: {
  zone: string;
  setZone: (z: string) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex rounded-md border border-border bg-panel p-1 text-xs font-mono">
          {ZONE_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setZone(t.key)}
              className={cn(
                "px-3 py-1.5 rounded uppercase tracking-wider transition",
                zone === t.key
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <ValueDisplay label="PV Temperature" value="49.2" unit="°C" tone="ok" />
        <ValueDisplay label="Setpoint" value="48.0" unit="°C" />
        <ValueDisplay label="Modulating Valve (VAM211)" value="45%" tone="ok" />
        <ValueDisplay label="Pumps (P1/P2)" value="ON / ON" tone="ok" />
      </div>

      <Panel
        title={
          <span className="inline-flex items-center gap-2">
            <Gauge className="h-3.5 w-3.5" />
            P&ID Mimic — {ZONE_TABS.find((z) => z.key === zone)?.label}
          </span>
        }
        subtitle="Monitoring P&ID station process"
        right={
          <span className="rounded bg-warn/15 text-warn px-2 py-0.5 text-[10px] font-mono inline-flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            READ-ONLY
          </span>
        }
      >
        <div className="rounded-md border border-border bg-background/60 grid-bg p-4">
          <svg viewBox="0 0 900 380" className="w-full">
            {/* Tank */}
            <g>
              <rect
                x="120"
                y="140"
                width="260"
                height="160"
                rx="8"
                fill="none"
                stroke="var(--primary)"
                strokeWidth={2}
              />
              <rect
                x="120"
                y="140"
                width="260"
                height="160"
                rx="8"
                fill="var(--primary)"
                opacity={0.05}
              />
              <text
                x="250"
                y="170"
                textAnchor="middle"
                fontSize={11}
                fill="var(--muted-foreground)"
                fontFamily="var(--font-mono)"
              >
                PROCESS TANK
              </text>
              <rect
                x="130"
                y="200"
                width="240"
                height="90"
                fill="var(--chart-1)"
                opacity={0.18}
              />
              <text
                x="250"
                y="260"
                textAnchor="middle"
                fontSize={26}
                fill="var(--foreground)"
                fontFamily="var(--font-mono)"
                fontWeight={600}
              >
                49.2°C
              </text>
              <text
                x="250"
                y="282"
                textAnchor="middle"
                fontSize={10}
                fill="var(--muted-foreground)"
                fontFamily="var(--font-mono)"
              >
                PV / SP 48.0°C
              </text>
            </g>

            {/* Pipes */}
            <g stroke="var(--muted-foreground)" strokeWidth={2} fill="none" opacity={0.7}>
              <path d="M 60 220 L 120 220" />
              <path d="M 380 220 L 500 220" />
              <path d="M 500 220 L 500 100 L 620 100" />
              <path d="M 500 220 L 620 220" />
              <path d="M 720 100 L 820 100 L 820 220 L 720 220" />
              <path d="M 820 220 L 820 320 L 250 320 L 250 300" />
            </g>

            {/* Pump P1 (PUS111) */}
            <g transform="translate(60,220)">
              <circle r={22} fill="var(--card)" stroke="var(--ok)" strokeWidth={2} />
              <circle r={8} fill="var(--ok)" opacity={0.5} />
              <text
                y={40}
                textAnchor="middle"
                fontSize={10}
                fill="var(--foreground)"
                fontFamily="var(--font-mono)"
              >
                Pump P1
              </text>
              <text
                y={52}
                textAnchor="middle"
                fontSize={9}
                fill="var(--ok)"
                fontFamily="var(--font-mono)"
              >
                ON
              </text>
            </g>

            {/* Valve Modulasi VAM211 */}
            <g transform="translate(440,220)">
              <polygon
                points="-14,-10 14,-10 0,10"
                fill="var(--ok)"
                opacity={0.7}
                stroke="var(--ok)"
              />
              <polygon
                points="-14,10 14,10 0,-10"
                fill="var(--ok)"
                opacity={0.7}
                stroke="var(--ok)"
              />
              <text
                y={30}
                textAnchor="middle"
                fontSize={10}
                fill="var(--foreground)"
                fontFamily="var(--font-mono)"
              >
                VAM211
              </text>
              <text
                y={42}
                textAnchor="middle"
                fontSize={9}
                fill="var(--primary)"
                fontFamily="var(--font-mono)"
              >
                Open 45%
              </text>
            </g>

            {/* Pump P2 */}
            <g transform="translate(720,220)">
              <circle r={18} fill="var(--card)" stroke="var(--ok)" strokeWidth={2} />
              <text
                y={32}
                textAnchor="middle"
                fontSize={9}
                fill="var(--ok)"
                fontFamily="var(--font-mono)"
              >
                Pump P2 · ON
              </text>
            </g>
          </svg>
        </div>
      </Panel>
    </>
  );
}
