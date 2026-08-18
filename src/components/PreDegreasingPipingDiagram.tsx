import { useMemo } from "react";

// Reusable SVG sub-components for the piping diagram

function Pipe({ x1, y1, x2, y2, thickness = 12 }: { x1: number; y1: number; x2: number; y2: number; thickness?: number }) {
  const half = thickness / 2;
  // Determine direction
  const isHorizontal = y1 === y2;
  const isVertical = x1 === x2;

  if (isHorizontal) {
    return (
      <g>
        <rect x={Math.min(x1, x2)} y={y1 - half} width={Math.abs(x2 - x1)} height={thickness} rx={1} fill="url(#pipeGradH)" stroke="#7a8a9a" strokeWidth={0.8} />
        <line x1={Math.min(x1, x2)} y1={y1 - half + 2} x2={Math.max(x1, x2)} y2={y1 - half + 2} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
      </g>
    );
  }
  if (isVertical) {
    return (
      <g>
        <rect x={x1 - half} y={Math.min(y1, y2)} width={thickness} height={Math.abs(y2 - y1)} rx={1} fill="url(#pipeGradV)" stroke="#7a8a9a" strokeWidth={0.8} />
        <line x1={x1 - half + 2} y1={Math.min(y1, y2)} x2={x1 - half + 2} y2={Math.max(y1, y2)} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
      </g>
    );
  }
  // Diagonal fallback
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8899aa" strokeWidth={thickness} strokeLinecap="round" />;
}

function PipeElbow({ x, y, from, to, thickness = 12 }: { x: number; y: number; from: "left" | "right" | "top" | "bottom"; to: "left" | "right" | "top" | "bottom"; thickness?: number }) {
  const r = thickness;
  const half = thickness / 2;
  // Draw a rounded corner
  const dirs: Record<string, [number, number]> = {
    left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1],
  };
  const [fx, fy] = dirs[from];
  const [tx, ty] = dirs[to];

  const startX = x + fx * r;
  const startY = y + fy * r;
  const endX = x + tx * r;
  const endY = y + ty * r;

  return (
    <g>
      <path
        d={`M ${startX} ${startY} Q ${x} ${y} ${endX} ${endY}`}
        fill="none" stroke="#8899aa" strokeWidth={thickness} strokeLinecap="round"
      />
      <path
        d={`M ${startX} ${startY} Q ${x} ${y} ${endX} ${endY}`}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={thickness - 4} strokeLinecap="round"
      />
    </g>
  );
}

function Valve({ x, y, label, open, size = 20 }: { x: number; y: number; label: string; open: boolean; size?: number }) {
  const half = size / 2;
  return (
    <g>
      {/* Valve body - butterfly shape */}
      <polygon
        points={`${x - half},${y - half} ${x + half},${y} ${x - half},${y + half}`}
        fill={open ? "#3b82f6" : "#64748b"} stroke="#475569" strokeWidth={1.5}
      />
      <polygon
        points={`${x + half},${y - half} ${x - half},${y} ${x + half},${y + half}`}
        fill={open ? "#2563eb" : "#475569"} stroke="#475569" strokeWidth={1.5}
      />
      {/* Stem */}
      <line x1={x} y1={y - half - 8} x2={x} y2={y - half} stroke="#64748b" strokeWidth={3} />
      {/* Handwheel */}
      <circle cx={x} cy={y - half - 12} r={5} fill="none" stroke={open ? "#3b82f6" : "#94a3b8"} strokeWidth={2} />
      <circle cx={x} cy={y - half - 12} r={1.5} fill={open ? "#3b82f6" : "#94a3b8"} />
      {/* Label */}
      <text x={x} y={y + half + 14} textAnchor="middle" fontSize={9} fill="#94a3b8" fontWeight={600}>{label}</text>
      <text x={x} y={y + half + 24} textAnchor="middle" fontSize={8} fill={open ? "#22c55e" : "#ef4444"} fontWeight={700}>
        {open ? "OPEN" : "CLOSED"}
      </text>
    </g>
  );
}

function Tank({ x, y, width, height, label, pvTemp, spTemp, alarm = false }: {
  x: number; y: number; width: number; height: number; label: string;
  pvTemp: number; spTemp: number; alarm?: boolean;
}) {
  const fillLevel = 0.65; // 65% fill
  const fillHeight = height * fillLevel;
  const liquidColor = alarm ? "#ef4444" : "#3b82f6";

  return (
    <g>
      {/* Tank body */}
      <rect x={x} y={y} width={width} height={height} rx={6} ry={6}
        fill="#1e293b" stroke="#475569" strokeWidth={2} />
      {/* Liquid fill */}
      <rect x={x + 2} y={y + height - fillHeight} width={width - 4} height={fillHeight - 2} rx={4} ry={4}
        fill={liquidColor} opacity={0.25} />
      {/* Fill waves */}
      <path
        d={`M ${x + 2} ${y + height - fillHeight + 4} Q ${x + width * 0.25} ${y + height - fillHeight - 2} ${x + width / 2} ${y + height - fillHeight + 4} Q ${x + width * 0.75} ${y + height - fillHeight + 10} ${x + width - 2} ${y + height - fillHeight + 4}`}
        fill={liquidColor} opacity={0.15} stroke="none"
      />
      {/* Tank label */}
      <text x={x + width / 2} y={y - 10} textAnchor="middle" fontSize={11} fill="#e2e8f0" fontWeight={700} letterSpacing={0.5}>
        {label}
      </text>
      {/* Temperature display inside tank */}
      <g>
        <rect x={x + 8} y={y + height / 2 - 28} width={width - 16} height={50} rx={4}
          fill="#0f172a" opacity={0.7} stroke="#334155" strokeWidth={1} />
        {/* PV */}
        <text x={x + width / 2} y={y + height / 2 - 12} textAnchor="middle" fontSize={8} fill="#94a3b8" fontWeight={600}>
          PV TEMP
        </text>
        <text x={x + width / 2} y={y + height / 2 + 2} textAnchor="middle" fontSize={16} fill={alarm ? "#ef4444" : "#22c55e"} fontWeight={800} fontFamily="monospace">
          {pvTemp.toFixed(1)}°C
        </text>
        {/* SP */}
        <text x={x + width / 2} y={y + height / 2 + 16} textAnchor="middle" fontSize={8} fill="#64748b" fontWeight={600}>
          SP: {spTemp.toFixed(1)}°C
        </text>
      </g>
      {/* Thermometer icon on left side */}
      <g transform={`translate(${x - 14}, ${y + height / 2 - 20})`}>
        <rect x={0} y={0} width={6} height={28} rx={3} fill="#1e293b" stroke={alarm ? "#ef4444" : "#22c55e"} strokeWidth={1.5} />
        <circle cx={3} cy={32} r={6} fill={alarm ? "#ef4444" : "#22c55e"} opacity={0.8} />
        <rect x={1.5} y={10} width={3} height={20} rx={1} fill={alarm ? "#ef4444" : "#22c55e"} opacity={0.6} />
      </g>
    </g>
  );
}

function PressureGauge({ x, y, value, label }: { x: number; y: number; value: number; label: string }) {
  const r = 18;
  const angle = -140 + (value / 100) * 280; // Map 0-100 to gauge arc
  const rad = (angle * Math.PI) / 180;
  const nx = x + Math.cos(rad) * (r - 6);
  const ny = y + Math.sin(rad) * (r - 6);

  return (
    <g>
      {/* Gauge body */}
      <circle cx={x} cy={y} r={r + 4} fill="#1e293b" stroke="#475569" strokeWidth={2} />
      <circle cx={x} cy={y} r={r} fill="#0f172a" stroke="#334155" strokeWidth={1} />
      {/* Tick marks */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = (-140 + i * 35) * Math.PI / 180;
        return (
          <line key={i}
            x1={x + Math.cos(a) * (r - 2)} y1={y + Math.sin(a) * (r - 2)}
            x2={x + Math.cos(a) * (r - 5)} y2={y + Math.sin(a) * (r - 5)}
            stroke="#64748b" strokeWidth={1.5}
          />
        );
      })}
      {/* Needle */}
      <line x1={x} y1={y} x2={nx} y2={ny} stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={x} cy={y} r={3} fill="#e2e8f0" />
      {/* Value */}
      <text x={x} y={y + r + 14} textAnchor="middle" fontSize={8} fill="#94a3b8" fontWeight={600}>{label}</text>
      <text x={x} y={y + r + 24} textAnchor="middle" fontSize={10} fill="#e2e8f0" fontWeight={700} fontFamily="monospace">{value}%</text>
    </g>
  );
}

function Pump({ x, y, label, running }: { x: number; y: number; label: string; running: boolean }) {
  return (
    <g>
      {/* Pump body */}
      <circle cx={x} cy={y} r={16} fill="#1e293b" stroke={running ? "#22c55e" : "#64748b"} strokeWidth={2} />
      {/* Triangle inside */}
      <polygon
        points={`${x - 7},${y - 8} ${x - 7},${y + 8} ${x + 9},${y}`}
        fill={running ? "#22c55e" : "#64748b"} opacity={0.6}
      />
      {/* Status dot */}
      <circle cx={x + 12} cy={y - 12} r={4} fill={running ? "#22c55e" : "#ef4444"} />
      {/* Label */}
      <text x={x} y={y + 28} textAnchor="middle" fontSize={9} fill="#94a3b8" fontWeight={600}>{label}</text>
      <text x={x} y={y + 38} textAnchor="middle" fontSize={8} fill={running ? "#22c55e" : "#ef4444"} fontWeight={700}>
        {running ? "ON" : "OFF"}
      </text>
    </g>
  );
}

function FlowArrow({ x, y, direction = "right" }: { x: number; y: number; direction?: "right" | "left" | "down" | "up" }) {
  const transforms: Record<string, string> = {
    right: `translate(${x},${y})`,
    left: `translate(${x},${y}) rotate(180)`,
    down: `translate(${x},${y}) rotate(90)`,
    up: `translate(${x},${y}) rotate(-90)`,
  };
  return (
    <g transform={transforms[direction]}>
      <polygon points="-8,-5 8,0 -8,5" fill="#3b82f6" opacity={0.5} />
    </g>
  );
}

function ConnectionDot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={4} fill="#475569" stroke="#64748b" strokeWidth={1} />;
}

interface PreDegreasingDiagramProps {
  pvLarge: number;
  spLarge: number;
  pvSmall: number;
  spSmall: number;
  valve: number;
  pump1: boolean;
  pump2: boolean;
  alarm: boolean;
}

export default function PreDegreasingPipingDiagram({
  pvLarge, spLarge, pvSmall, spSmall, valve, pump1, pump2, alarm
}: PreDegreasingDiagramProps) {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 520" className="w-full h-auto min-w-[700px]" xmlns="http://www.w3.org/2000/svg">
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="pipeGradH" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b7f94" />
            <stop offset="30%" stopColor="#9aabb8" />
            <stop offset="70%" stopColor="#7a8c9c" />
            <stop offset="100%" stopColor="#5a6d7f" />
          </linearGradient>
          <linearGradient id="pipeGradV" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b7f94" />
            <stop offset="30%" stopColor="#9aabb8" />
            <stop offset="70%" stopColor="#7a8c9c" />
            <stop offset="100%" stopColor="#5a6d7f" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="900" height="520" rx="12" fill="#0f172a" />

        {/* Title */}
        <text x="450" y="30" textAnchor="middle" fontSize={14} fill="#94a3b8" fontWeight={700} letterSpacing={2}>
          PRE-DEGREASING STATION — PIPING &amp; INSTRUMENTATION
        </text>

        {/* ===== MAIN FEED LINE (Top Horizontal) ===== */}
        <text x={30} y={65} fontSize={9} fill="#64748b" fontWeight={600}>FEED MAIN</text>
        <Pipe x1={30} y1={75} x2={870} y2={75} thickness={14} />
        <FlowArrow x={120} y={75} direction="right" />
        <FlowArrow x={400} y={75} direction="right" />
        <FlowArrow x={700} y={75} direction="right" />

        {/* ===== BRANCH DOWN TO LARGE TANK ===== */}
        {/* T-Junction at x=200 */}
        <ConnectionDot x={200} y={75} />
        <Pipe x1={200} y1={82} x2={200} y2={140} />
        <FlowArrow x={200} y={110} direction="down" />

        {/* Control Valve on branch to Large Tank */}
        <Valve x={200} y={160} label="CV-101" open={true} size={18} />

        {/* Pipe down to Large Tank */}
        <Pipe x1={200} y1={185} x2={200} y2={220} />

        {/* Large Tank */}
        <Tank x={130} y={230} width={140} height={140} label="LARGE TANK"
          pvTemp={pvLarge} spTemp={spLarge} alarm={alarm} />

        {/* Pipe out bottom of Large Tank */}
        <Pipe x1={200} y1={370} x2={200} y2={420} />
        <FlowArrow x={200} y={395} direction="down" />

        {/* ===== BRANCH DOWN TO SMALL TANK ===== */}
        {/* T-Junction at x=550 */}
        <ConnectionDot x={550} y={75} />
        <Pipe x1={550} y1={82} x2={550} y2={140} />
        <FlowArrow x={550} y={110} direction="down" />

        {/* Control Valve on branch to Small Tank */}
        <Valve x={550} y={160} label="CV-102" open={true} size={18} />

        {/* Pipe down to Small Tank */}
        <Pipe x1={550} y1={185} x2={550} y2={220} />

        {/* Small Tank */}
        <Tank x={480} y={230} width={140} height={120} label="SMALL TANK"
          pvTemp={pvSmall} spTemp={spSmall} alarm={alarm} />

        {/* Pipe out bottom of Small Tank */}
        <Pipe x1={550} y1={350} x2={550} y2={420} />
        <FlowArrow x={550} y={385} direction="down" />

        {/* ===== BOTTOM DRAIN LINE ===== */}
        <Pipe x1={100} y1={420} x2={750} y2={420} thickness={14} />
        <FlowArrow x={300} y={420} direction="right" />
        <FlowArrow x={650} y={420} direction="right" />
        <ConnectionDot x={200} y={420} />
        <ConnectionDot x={550} y={420} />

        {/* Drain text */}
        <text x={800} y={424} fontSize={9} fill="#64748b" fontWeight={600}>TO DRAIN</text>
        {/* Arrow to drain */}
        <Pipe x1={750} y1={420} x2={870} y2={420} thickness={10} />
        <FlowArrow x={830} y={420} direction="right" />

        {/* ===== PUMPS ===== */}
        <Pump x={350} y={470} label="PUMP-1" running={pump1} />
        <Pipe x1={350} y1={420} x2={350} y2={452} thickness={10} />
        <ConnectionDot x={350} y={420} />

        <Pump x={450} y={470} label="PUMP-2" running={pump2} />
        <Pipe x1={450} y1={420} x2={450} y2={452} thickness={10} />
        <ConnectionDot x={450} y={420} />

        {/* ===== PRESSURE GAUGE ===== */}
        <PressureGauge x={780} y={160} value={valve} label="PRESSURE" />
        {/* Pipe from main to gauge */}
        <ConnectionDot x={780} y={75} />
        <Pipe x1={780} y1={82} x2={780} y2={135} thickness={8} />

        {/* ===== RECIRCULATION LINE ===== */}
        {/* Line from Large Tank out right side */}
        <Pipe x1={270} y1={300} x2={340} y2={300} thickness={10} />
        <FlowArrow x={310} y={300} direction="right" />
        {/* Valve on recirculation */}
        <Valve x={370} y={300} label="RV-101" open={true} size={16} />
        {/* Continue to Small Tank */}
        <Pipe x1={395} y1={300} x2={480} y2={300} thickness={10} />
        <FlowArrow x={440} y={300} direction="right" />

        {/* ===== TEST VALVE (Bottom) ===== */}
        <ConnectionDot x={100} y={420} />
        <Pipe x1={100} y1={420} x2={100} y2={480} thickness={8} />
        <Valve x={100} y={480} label="TEST VALVE" open={false} size={14} />

        {/* ===== SECTIONAL DRAIN VALVE (Right) ===== */}
        <Pipe x1={870} y1={75} x2={870} y2={130} thickness={8} />
        <Valve x={870} y={150} label="SDV-101" open={false} size={14} />
        <text x={870} y={195} textAnchor="middle" fontSize={7} fill="#64748b">SECTIONAL</text>
        <text x={870} y={203} textAnchor="middle" fontSize={7} fill="#64748b">DRAIN</text>

        {/* ===== LABELS & ANNOTATIONS ===== */}
        {/* Indicating-type floor control valve label */}
        <g transform="translate(60, 105)">
          <rect x={0} y={0} width={100} height={22} rx={4} fill="#1e293b" stroke="#334155" strokeWidth={1} />
          <text x={50} y={10} textAnchor="middle" fontSize={7} fill="#94a3b8" dominantBaseline="middle" fontWeight={600}>
            FLOOR CONTROL
          </text>
          <text x={50} y={18} textAnchor="middle" fontSize={6} fill="#64748b" dominantBaseline="middle">
            INDICATING TYPE
          </text>
        </g>

        {/* Pressure Branch Label */}
        <g transform="translate(720, 105)">
          <rect x={0} y={0} width={70} height={18} rx={4} fill="#1e293b" stroke="#334155" strokeWidth={1} />
          <text x={35} y={12} textAnchor="middle" fontSize={7} fill="#94a3b8" dominantBaseline="middle" fontWeight={600}>
            PRESS. BRANCH
          </text>
        </g>

        {/* Legend */}
        <g transform="translate(30, 485)">
          <rect x={0} y={0} width={340} height={25} rx={4} fill="#1e293b" stroke="#334155" strokeWidth={1} opacity={0.8} />
          <circle cx={15} cy={12} r={4} fill="#22c55e" />
          <text x={24} y={16} fontSize={8} fill="#94a3b8">Running</text>
          <circle cx={75} cy={12} r={4} fill="#ef4444" />
          <text x={84} y={16} fontSize={8} fill="#94a3b8">Stopped</text>
          <rect x={125} y={8} width={16} height={8} rx={1} fill="url(#pipeGradH)" stroke="#7a8a9a" strokeWidth={0.5} />
          <text x={146} y={16} fontSize={8} fill="#94a3b8">Pipe</text>
          <polygon points="175,7 185,12 175,17" fill="#3b82f6" opacity={0.6} />
          <text x={190} y={16} fontSize={8} fill="#94a3b8">Flow</text>
          <circle cx={220} cy={12} r={6} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
          <text x={230} y={16} fontSize={8} fill="#94a3b8">Valve Open</text>
          <circle cx={290} cy={12} r={6} fill="none" stroke="#64748b" strokeWidth={1.5} />
          <text x={300} y={16} fontSize={8} fill="#94a3b8">Valve Closed</text>
        </g>
      </svg>
    </div>
  );
}
