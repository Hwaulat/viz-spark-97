import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, StatusDot, ValueDisplay } from "@/components/panel";
import { CED_STATIONS, CED_ZONES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowRight, Filter, Gauge, Waves } from "lucide-react";

export const Route = createFileRoute("/ced")({
  head: () => ({
    meta: [
      { title: "CED Area — Utility Monitoring" },
      { name: "description", content: "Cathodic Electro-Deposition line — skid tracking and process station detail." },
    ],
  }),
  component: CEDArea,
});

function CEDArea() {
  const [tab, setTab] = useState<"line" | "process">("line");
  const [zone, setZone] = useState("phos");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">CED Area · CB-B11</div>
          <h1 className="text-2xl font-semibold mt-1">Cathodic Electro-Deposition Line</h1>
        </div>
        <div className="inline-flex rounded-md border border-border bg-panel p-1 text-xs font-mono">
          {(["line","process"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-3 py-1.5 rounded uppercase tracking-wider transition",
                tab === t ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}>
              {t === "line" ? "Line Tracking" : "Process Detail"}
            </button>
          ))}
        </div>
      </div>

      {tab === "line" ? <LineTracking /> : <ProcessDetail zone={zone} setZone={setZone} />}
    </div>
  );
}

function LineTracking() {
  const occupied = CED_STATIONS.filter(s => s.occupied).length;
  const stuck = CED_STATIONS.filter(s => s.stuck).length;
  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Panel title="Line Occupancy"><div className="flex items-baseline gap-2"><span className="text-3xl font-mono font-semibold">{occupied}</span><span className="text-sm text-muted-foreground">/ {CED_STATIONS.length} stations</span></div></Panel>
        <Panel title="Avg Cycle Time"><div className="flex items-baseline gap-2"><span className="text-3xl font-mono font-semibold">42.6</span><span className="text-sm text-muted-foreground">min / skid</span></div></Panel>
        <Panel title="Stuck Skids" tone={stuck > 0 ? "warn" : "default"}>
          <div className="flex items-baseline gap-2"><span className={cn("text-3xl font-mono font-semibold", stuck && "text-warn")}>{stuck}</span><span className="text-sm text-muted-foreground">&gt; 5 min idle</span></div>
        </Panel>
        <Panel title="Line Mode"><div className="flex items-center gap-2"><StatusDot state="on" /><span className="text-lg font-mono">AUTO</span><span className="ml-auto text-[10px] text-muted-foreground">ES: NORMAL</span></div></Panel>
      </div>

      <Panel
        title={<span className="inline-flex items-center gap-2"><Waves className="h-3.5 w-3.5" />Skid Tracking Map</span>}
        subtitle="Real-time position of skids along the CED line (U-loop layout)"
        right={<span className="font-mono text-[11px] text-muted-foreground">{new Date().toLocaleString("en-GB",{hour12:false})}</span>}
      >
        {/* Zone legend */}
        <div className="flex flex-wrap gap-3 mb-3 text-[10px] font-mono">
          {CED_ZONES.map(z => (
            <span key={z.key} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded" style={{ background: z.color }} />
              <span className="uppercase tracking-wider text-muted-foreground">{z.label}</span>
            </span>
          ))}
        </div>

        <div className="rounded-md border border-border bg-background/60 grid-bg overflow-x-auto">
          <svg viewBox="0 0 1200 410" className="w-full min-w-[900px]" preserveAspectRatio="xMidYMid meet">
            {/* Zone backdrops (rough spans) */}
            {(() => {
              // group stations by zone to get x range
              const groups: Record<string, {min:number,max:number,y:number}> = {};
              CED_STATIONS.forEach(s => {
                const g = groups[s.zone] ?? {min: s.x, max: s.x, y: s.y};
                g.min = Math.min(g.min, s.x - 20);
                g.max = Math.max(g.max, s.x + 20);
                g.y = s.y;
                groups[s.zone] = g;
              });
              return CED_ZONES.map(z => {
                const g = groups[z.key];
                if (!g) return null;
                return (
                  <g key={z.key}>
                    <rect x={g.min} y={g.y - 28} width={g.max - g.min} height={56} rx={10}
                      fill={z.color} opacity={0.14} stroke={z.color} strokeOpacity={0.4} />
                    <text x={(g.min + g.max)/2} y={g.y - 34} textAnchor="middle"
                      fontSize={9} fill="var(--muted-foreground)"
                      style={{ textTransform: "uppercase", letterSpacing: 1.4, fontFamily: "var(--font-mono)" }}>
                      {z.label}
                    </text>
                  </g>
                );
              });
            })()}

            {/* Conveyor path — U loop connecting top row to bottom row */}
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
              <polygon points="600,314 610,320 600,326" transform="translate(-20,0) scale(-1,1) translate(-1200,0)" />
            </g>

            {/* Stations */}
            {CED_STATIONS.map(s => {
              const zone = CED_ZONES.find(z => z.key === s.zone)!;
              const isStuck = s.stuck;
              return (
                <g key={s.id}>
                  <title>{`${s.id} — ${zone.label}${s.occupied ? ` · occupied ${s.since}` : " · empty"}`}</title>
                  {s.occupied ? (
                    <>
                      <circle cx={s.x} cy={s.y} r={9}
                        fill={isStuck ? "var(--warn)" : "var(--ok)"}
                        stroke={isStuck ? "var(--warn)" : "var(--ok)"}
                        opacity={0.95}
                        style={{ filter: `drop-shadow(0 0 4px ${isStuck ? "var(--warn)" : "var(--ok)"})` }}
                      />
                      {isStuck && <circle cx={s.x} cy={s.y} r={13} fill="none" stroke="var(--warn)" strokeWidth={1.5} opacity={0.5}>
                        <animate attributeName="r" values="9;16;9" dur="1.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="1.4s" repeatCount="indefinite" />
                      </circle>}
                    </>
                  ) : (
                    <circle cx={s.x} cy={s.y} r={8} fill="var(--background)" stroke="var(--muted-foreground)" strokeWidth={1.5} opacity={0.7} />
                  )}
                  <text x={s.x} y={s.y + 26} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" fontFamily="var(--font-mono)">
                    {s.id}
                  </text>
                </g>
              );
            })}

            {/* Loading / unloading markers */}
            <g fontFamily="var(--font-mono)" fontSize={10} fill="var(--primary)">
              <text x={40} y={64} textAnchor="middle">▶ LOAD</text>
              <text x={1160} y={355} textAnchor="middle">UNLOAD ▶</text>
            </g>
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ok shadow-[0_0_6px_var(--ok)]" />OCCUPIED</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-muted-foreground" />EMPTY</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-warn shadow-[0_0_6px_var(--warn)]" />STUCK &gt; 5min</span>
        </div>
      </Panel>
    </>
  );
}

/* ---------- Process Detail (P&ID mimic) ---------- */

const ZONE_TABS = [
  { key: "deg", label: "Degreasing" },
  { key: "act", label: "Activation" },
  { key: "phos", label: "Phosphating" },
  { key: "rinse", label: "Rinse" },
  { key: "ecoat", label: "Flood / E-Coat" },
];

function ProcessDetail({ zone, setZone }: { zone: string; setZone: (z: string) => void }) {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex rounded-md border border-border bg-panel p-1 text-xs font-mono">
          {ZONE_TABS.map(t => (
            <button key={t.key} onClick={() => setZone(t.key)}
              className={cn("px-3 py-1.5 rounded uppercase tracking-wider transition",
                zone === t.key ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          {["MAIN","MANUAL","TREND","ALARM"].map((b,i) => (
            <button key={b} className={cn("px-3 py-1.5 rounded border border-border",
              i===0 ? "bg-primary/15 text-primary border-primary/40" : "bg-secondary text-muted-foreground hover:text-foreground")}>{b}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <ValueDisplay label="PV Temperature" value="49.2" unit="°C" tone="ok" />
        <ValueDisplay label="Setpoint" value="48.0" unit="°C" />
        <ValueDisplay label="Deviation" value="+1.2" unit="°C" tone="ok" />
        <ValueDisplay label="Mode" value="AUTO" />
      </div>

      <Panel
        title={<span className="inline-flex items-center gap-2"><Gauge className="h-3.5 w-3.5" />P&ID Mimic — {ZONE_TABS.find(z=>z.key===zone)?.label}</span>}
        subtitle="Read-only monitoring. Control actions remain at physical HMI/PLC."
        right={<span className="rounded bg-warn/15 text-warn px-2 py-0.5 text-[10px] font-mono inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" />READ-ONLY</span>}
      >
        <div className="rounded-md border border-border bg-background/60 grid-bg p-4">
          <svg viewBox="0 0 900 380" className="w-full">
            {/* Tank */}
            <g>
              <rect x="120" y="140" width="260" height="160" rx="8" fill="none" stroke="var(--primary)" strokeWidth={2} />
              <rect x="120" y="140" width="260" height="160" rx="8" fill="var(--primary)" opacity={0.05} />
              <text x="250" y="170" textAnchor="middle" fontSize={11} fill="var(--muted-foreground)" fontFamily="var(--font-mono)">PROCESS TANK</text>
              {/* liquid level */}
              <rect x="130" y="200" width="240" height="90" fill="var(--chart-1)" opacity={0.18} />
              <text x="250" y="260" textAnchor="middle" fontSize={26} fill="var(--foreground)" fontFamily="var(--font-mono)" fontWeight={600}>49.2°C</text>
              <text x="250" y="282" textAnchor="middle" fontSize={10} fill="var(--muted-foreground)" fontFamily="var(--font-mono)">PV / SP 48.0°C</text>
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

            {/* Pump PUS111 */}
            <g transform="translate(60,220)">
              <circle r={22} fill="var(--card)" stroke="var(--ok)" strokeWidth={2} />
              <circle r={8} fill="var(--ok)" opacity={0.5} />
              <text y={40} textAnchor="middle" fontSize={10} fill="var(--foreground)" fontFamily="var(--font-mono)">PUS111</text>
              <text y={52} textAnchor="middle" fontSize={9} fill="var(--ok)" fontFamily="var(--font-mono)">RUN</text>
            </g>

            {/* Valve VAM111 (modulating) */}
            <g transform="translate(440,220)">
              <polygon points="-14,-10 14,-10 0,10" fill="var(--ok)" opacity={0.7} stroke="var(--ok)" />
              <polygon points="-14,10 14,10 0,-10" fill="var(--ok)" opacity={0.7} stroke="var(--ok)" />
              <text y={30} textAnchor="middle" fontSize={10} fill="var(--foreground)" fontFamily="var(--font-mono)">VAM111</text>
              <text y={42} textAnchor="middle" fontSize={9} fill="var(--primary)" fontFamily="var(--font-mono)">9%</text>
            </g>

            {/* Heat Exchanger HEX111 */}
            <g transform="translate(670,100)">
              <rect x={-50} y={-22} width={100} height={44} rx={4} fill="var(--card)" stroke="var(--primary)" strokeWidth={2} />
              <path d="M -40 0 L -20 -12 L 0 12 L 20 -12 L 40 0" stroke="var(--warn)" strokeWidth={2} fill="none" />
              <text y={-32} textAnchor="middle" fontSize={10} fill="var(--foreground)" fontFamily="var(--font-mono)">HEX111</text>
              <text y={38} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" fontFamily="var(--font-mono)">HOT WATER</text>
            </g>

            {/* Valve VAA111 */}
            <g transform="translate(600,220)">
              <polygon points="-10,-8 10,-8 0,8" fill="var(--ok)" stroke="var(--ok)" />
              <polygon points="-10,8 10,8 0,-8" fill="var(--ok)" stroke="var(--ok)" />
              <text y={26} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" fontFamily="var(--font-mono)">VAA111 OPEN</text>
            </g>

            {/* Filter (for phosphating) */}
            {zone === "phos" && (
              <g transform="translate(820,320)">
                <rect x={-18} y={-24} width={36} height={48} rx={4} fill="var(--card)" stroke="var(--warn)" strokeWidth={2} />
                <line x1={-18} y1={-8} x2={18} y2={-8} stroke="var(--warn)" />
                <line x1={-18} y1={8} x2={18} y2={8} stroke="var(--warn)" />
                <text y={40} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" fontFamily="var(--font-mono)">FK FILTER</text>
              </g>
            )}

            {/* Pump PUT111 */}
            <g transform="translate(720,220)">
              <circle r={18} fill="var(--card)" stroke="var(--ok)" strokeWidth={2} />
              <text y={32} textAnchor="middle" fontSize={9} fill="var(--ok)" fontFamily="var(--font-mono)">PUT111 · RUN</text>
            </g>
          </svg>
        </div>

        {/* Legend / element list */}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-border/50 bg-secondary/40 p-3">
            <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">Pumps</div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between"><span>PUS111</span><span className="inline-flex items-center gap-1.5"><StatusDot state="on" size={7}/>RUNNING</span></div>
              <div className="flex justify-between"><span>PUT111</span><span className="inline-flex items-center gap-1.5"><StatusDot state="on" size={7}/>RUNNING</span></div>
            </div>
          </div>
          <div className="rounded-md border border-border/50 bg-secondary/40 p-3">
            <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">Valves</div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between"><span>VAM111</span><span className="text-primary">MOD 9%</span></div>
              <div className="flex justify-between"><span>VAA111</span><span className="text-ok">OPEN</span></div>
              <div className="flex justify-between"><span>VAA112</span><span className="text-muted-foreground">CLOSED</span></div>
            </div>
          </div>
          <div className="rounded-md border border-border/50 bg-secondary/40 p-3">
            <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">
              {zone === "phos" ? <span className="inline-flex items-center gap-1"><Filter className="h-3 w-3"/>Filters</span> : "Heat Exchanger"}
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              {zone === "phos" ? (
                <>
                  <div className="flex justify-between"><span>No.1 FK</span><span className="text-ok">NORMAL</span></div>
                  <div className="flex justify-between"><span>No.2 FK</span><span className="text-warn">CHECK ΔP</span></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between"><span>HEX111 In</span><span>62°C</span></div>
                  <div className="flex justify-between"><span>HEX111 Out</span><span>49°C</span></div>
                </>
              )}
            </div>
          </div>
        </div>
      </Panel>

      <div className="flex gap-2 justify-end text-[11px] font-mono">
        <button className="px-3 py-2 rounded border border-border bg-secondary hover:text-primary inline-flex items-center gap-1">Open Trend <ArrowRight className="h-3 w-3" /></button>
        <button className="px-3 py-2 rounded border border-border bg-secondary hover:text-primary inline-flex items-center gap-1">Alarm History <ArrowRight className="h-3 w-3" /></button>
      </div>
    </>
  );
}
