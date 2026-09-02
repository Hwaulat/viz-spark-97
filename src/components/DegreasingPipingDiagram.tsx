import { useMemo } from "react";

// Reusable SVG sub-components for the piping diagram

function Pipe({ x1, y1, x2, y2, thickness = 12 }: { x1: number; y1: number; x2: number; y2: number; thickness?: number }) {
  const half = thickness / 2;
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
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8899aa" strokeWidth={thickness} strokeLinecap="round" />;
}

function Valve({ x, y, label, open, size = 20, vertical = false, color = "blue" }: { x: number; y: number; label: string; open: boolean; size?: number; vertical?: boolean; color?: "blue" | "green" }) {
  const half = size / 2;
  const openColor = color === "green" ? "#22c55e" : "#3b82f6";
  const openColorDark = color === "green" ? "#16a34a" : "#2563eb";

  return (
    <g transform={vertical ? `translate(${x},${y}) rotate(90) translate(${-x},${-y})` : ""}>
      {/* Valve body - butterfly shape */}
      <polygon
        points={`${x - half},${y - half} ${x + half},${y} ${x - half},${y + half}`}
        fill={open ? openColor : "#64748b"} stroke="#475569" strokeWidth={1.5}
      />
      <polygon
        points={`${x + half},${y - half} ${x - half},${y} ${x + half},${y + half}`}
        fill={open ? openColorDark : "#475569"} stroke="#475569" strokeWidth={1.5}
      />
      {/* Stem */}
      <line x1={x} y1={y - half - 8} x2={x} y2={y - half} stroke="#64748b" strokeWidth={3} />
      {/* Handwheel */}
      <circle cx={x} cy={y - half - 12} r={5} fill="none" stroke={open ? openColor : "#94a3b8"} strokeWidth={2} />
      <circle cx={x} cy={y - half - 12} r={1.5} fill={open ? openColor : "#94a3b8"} />
      {/* Label */}
      <text x={x} y={y + half + 14} textAnchor="middle" fontSize={9} fill="#94a3b8" fontWeight={600} transform={vertical ? `rotate(-90 ${x} ${y + half + 14})` : ""}>{label}</text>
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
      <text x={x - 25} y={y + 4} textAnchor="end" fontSize={10} fill="#94a3b8" fontWeight={600}>{label}</text>
    </g>
  );
}

function FlowArrow({ x, y, direction = "right", color = "#3b82f6" }: { x: number; y: number; direction?: "right" | "left" | "down" | "up"; color?: string }) {
  const transforms: Record<string, string> = {
    right: `translate(${x},${y})`,
    left: `translate(${x},${y}) rotate(180)`,
    down: `translate(${x},${y}) rotate(90)`,
    up: `translate(${x},${y}) rotate(-90)`,
  };
  return (
    <g transform={transforms[direction]}>
      <polygon points="-8,-5 8,0 -8,5" fill={color} opacity={1} />
    </g>
  );
}

function ConnectionDot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={4} fill="#475569" stroke="#64748b" strokeWidth={1} />;
}

interface DegreasingDiagramProps {
  pv: number;
  sp: number;
  valve: number;
  pump1: boolean;
  pump2: boolean;
  alarm: boolean;
}

export default function DegreasingPipingDiagram({
  pv, sp, valve, pump1, pump2, alarm
}: DegreasingDiagramProps) {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 520" className="w-full h-auto min-w-[700px]" xmlns="http://www.w3.org/2000/svg">
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="pipeGradH" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="30%" stopColor="#60a5fa" />
            <stop offset="70%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="pipeGradV" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="30%" stopColor="#60a5fa" />
            <stop offset="70%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="hotPipeGradH" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="hotPipeGradV" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="900" height="520" rx="12" fill="#0f172a" />

        {/* Title */}
        <text x="450" y="30" textAnchor="middle" fontSize={14} fill="#94a3b8" fontWeight={700} letterSpacing={2}>
          DEGREASING STATION — PIPING &amp; INSTRUMENTATION
        </text>

        {/* ==================================================== */}
        {/* HOT WATER LINES (TOP AND BOTTOM)                     */}
        {/* ==================================================== */}
        
        {/* Top Hot Water Line */}
        <text x={870} y={60} textAnchor="end" fontSize={12} fill="#e2e8f0" fontWeight={600}>HOT WATER</text>
        <rect x={50} y={65} width={830} height={4} fill="#94a3b8" />
        
        {/* SW221 Block from Hot Water */}
        <rect x={700} y={50} width={24} height={24} fill="#1e293b" stroke="#e2e8f0" strokeWidth={1} />
        <text x={730} y={65} fontSize={10} fill="#e2e8f0">SW221</text>
        <rect x={710} y={74} width={4} height={56} fill="#3b82f6" />
        <FlowArrow x={712} y={100} direction="down" color="#3b82f6" />

        {/* Bottom Hot Water Line */}
        <text x={550} y={485} textAnchor="end" fontSize={12} fill="#e2e8f0" fontWeight={600}>HOT WATER</text>
        <rect x={550} y={490} width={330} height={4} fill="#94a3b8" />
        <rect x={500} y={470} width={250} height={4} fill="#3b82f6" />
        <FlowArrow x={650} y={472} direction="left" color="#3b82f6" />
        <FlowArrow x={700} y={492} direction="left" color="#e2e8f0" />

        {/* ==================================================== */}
        {/* FAN (TOP LEFT)                                       */}
        {/* ==================================================== */}
        <g transform="translate(100, 60)">
          <circle cx={0} cy={0} r={16} fill="#1e293b" stroke="#22c55e" strokeWidth={2} />
          <circle cx={0} cy={0} r={6} fill="none" stroke="#22c55e" strokeWidth={2} />
          <path d="M 0,-6 Q 8,-12 6,0 Q 12,8 0,6 Q -8,12 -6,0 Q -12,-8 0,-6 Z" fill="#22c55e" opacity={0.5} />
          <circle cx={10} cy={-10} r={4} fill="#22c55e" />
          <text x={0} y={-22} textAnchor="middle" fontSize={10} fill="#94a3b8">FAE111</text>
          <text x={22} y={4} fontSize={10} fill="#94a3b8">HD</text>
          {/* Arrow out */}
          <rect x={-40} y={-2} width={24} height={4} fill="#22c55e" />
          <FlowArrow x={-40} y={0} direction="left" color="#22c55e" />
          {/* Pipe into fan */}
          <rect x={-60} y={20} width={400} height={3} fill="#22c55e" />
          <rect x={-60} y={20} width={3} height={35} fill="#22c55e" />
          <FlowArrow x={0} y={21.5} direction="left" color="#22c55e" />
        </g>

        {/* ==================================================== */}
        {/* MAIN TANK                                            */}
        {/* ==================================================== */}
        <g transform="translate(150, 130)">
          {/* Tank outline - Custom sloped shape */}
          <path 
            d="M 0,0 L 730,0 L 730,90 L 680,90 L 670,110 L 660,90 L 610,90 L 400,160 L 150,160 L 80,240 L 50,210 L 50,150 L 0,150 Z" 
            fill="none" stroke="#e2e8f0" strokeWidth={2.5} 
          />
          {/* Liquid fill */}
          <path 
            d="M 5,140 L 600,140 L 400,158 L 148,158 L 80,235 L 53,208 L 53,148 L 5,148 Z" 
            fill="#86efac" opacity={0.6} 
          />
          
          {/* Showers inside tank */}
          {[360, 400, 440, 480].map((x, i) => (
            <g key={i} transform={`translate(${x}, 100)`}>
              <rect x={-1} y={0} width={2} height={40} fill="#3b82f6" />
              <FlowArrow x={0} y={20} direction="down" color="#3b82f6" />
              <FlowArrow x={0} y={40} direction="down" color="#3b82f6" />
              {/* small sprays */}
              <path d="M -6,15 L 0,10 L 6,15 M -6,30 L 0,25 L 6,30" fill="none" stroke="#3b82f6" strokeWidth={1} />
            </g>
          ))}
          <rect x={350} y={98} width={135} height={4} fill="#3b82f6" />
          <rect x={350} y={80} width={4} height={20} fill="#3b82f6" />

          {/* Info Box */}
          <g transform="translate(200, 95)">
            <rect x={0} y={0} width={65} height={45} fill="#e2e8f0" stroke="#000" strokeWidth={1} />
            <rect x={0} y={0} width={65} height={15} fill="#4ade80" stroke="#000" strokeWidth={1} />
            <text x={32.5} y={11} textAnchor="middle" fontSize={10} fill="#000" fontWeight={700}>AUTO</text>
            <text x={5} y={26} fontSize={10} fill="#000">HE</text>
            <text x={35} y={26} fontSize={10} fill="#000">{pv.toFixed(0)}</text>
            <line x1={0} y1={30} x2={65} y2={30} stroke="#000" strokeWidth={1} />
            <text x={5} y={41} fontSize={10} fill="#000">SP</text>
            <text x={30} y={41} fontSize={10} fill="#000">{sp.toFixed(0)}°C</text>
          </g>
        </g>

        {/* ==================================================== */}
        {/* LEFT PIPING LOOP                                     */}
        {/* ==================================================== */}
        {/* Line from tank side (left) */}
        <Pipe x1={150} y1={280} x2={100} y2={280} thickness={4} />
        <Pipe x1={100} y1={280} x2={100} y2={430} thickness={4} />
        
        {/* PLC221 Pump */}
        <Pump x={100} y={310} label="PLC221" running={pump1} />
        
        {/* Filter FIL221 */}
        <g transform="translate(100, 370)">
          <circle cx={0} cy={0} r={14} fill="#1e293b" stroke="#e2e8f0" strokeWidth={1} />
          <path d="M -6,-6 L -6,6 Q 0,12 6,6 L 6,-6" fill="none" stroke="#e2e8f0" strokeWidth={1.5} />
          <text x={-25} y={4} textAnchor="end" fontSize={10} fill="#94a3b8">FIL221</text>
        </g>

        {/* Pipe out of pump/filter, goes right and up into tank */}
        <Pipe x1={100} y1={430} x2={180} y2={430} thickness={4} />
        <Pipe x1={180} y1={430} x2={180} y2={340} thickness={4} />
        <Pipe x1={180} y1={340} x2={220} y2={340} thickness={4} />
        
        <Valve x={180} y={350} label="VAA221" open={true} size={14} vertical={true} />

        {/* ==================================================== */}
        {/* BOTTOM DRAIN & RIGHT PIPING LOOP                     */}
        {/* ==================================================== */}
        <rect x={215} y={370} width={30} height={20} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="2 2" />
        <FlowArrow x={230} y={395} direction="down" color="#3b82f6" />
        
        <Pipe x1={230} y1={370} x2={230} y2={410} thickness={4} />
        <Pipe x1={230} y1={410} x2={650} y2={410} thickness={4} />
        <FlowArrow x={300} y={410} direction="right" color="#3b82f6" />
        
        {/* VAF221 */}
        <g transform="translate(560, 350)">
          <rect x={-12} y={-12} width={24} height={24} fill="#1e293b" stroke="#e2e8f0" strokeWidth={1} />
          <text x={0} y={-18} textAnchor="middle" fontSize={10} fill="#e2e8f0">VAF221</text>
        </g>
        <line x1={560} y1={362} x2={560} y2={410} stroke="#e2e8f0" strokeWidth={1} />
        
        {/* Up to HEX 221 */}
        <Pipe x1={650} y1={410} x2={650} y2={230} thickness={4} />
        <FlowArrow x={650} y={380} direction="up" color="#3b82f6" />
        <Pipe x1={650} y1={230} x2={500} y2={230} thickness={4} />
        <Pipe x1={500} y1={230} x2={500} y2={210} thickness={4} />
        <FlowArrow x={600} y={230} direction="left" color="#3b82f6" />
        
        {/* Heat Exchanger HEX 221 */}
        <g transform="translate(670, 300)">
          <rect x={-20} y={-30} width={40} height={60} fill="#e2e8f0" stroke="#000" strokeWidth={1} />
          <text x={0} y={-5} textAnchor="middle" fontSize={12} fill="#000" fontWeight={700}>HEX</text>
          <text x={0} y={15} textAnchor="middle" fontSize={12} fill="#000" fontWeight={700}>221</text>
        </g>
        
        <Pipe x1={690} y1={230} x2={690} y2={410} thickness={4} />
        <FlowArrow x={690} y={260} direction="down" color="#3b82f6" />
        <Pipe x1={690} y1={410} x2={870} y2={410} thickness={4} />
        <Pipe x1={870} y1={410} x2={870} y2={470} thickness={4} />
        <FlowArrow x={750} y={410} direction="right" color="#3b82f6" />

        {/* Hot water cross into HEX 221 */}
        <rect x={648} y={490} width={4} height={50} fill="#94a3b8" />
        <rect x={648} y={330} width={4} height={160} fill="#94a3b8" />
        <rect x={698} y={330} width={4} height={160} fill="#94a3b8" />
        
        <FlowArrow x={650} y={450} direction="up" color="#e2e8f0" />
        <FlowArrow x={700} y={450} direction="down" color="#e2e8f0" />
        
        {/* VAM221 on Hot Water Return Line */}
        <Valve x={700} y={400} label="VAM221" open={valve > 0} size={16} vertical={true} color="green" />
        <g transform="translate(730, 410)">
          <rect x={0} y={-15} width={30} height={20} fill="#e2e8f0" stroke="#000" strokeWidth={1} />
          <text x={15} y={0} textAnchor="middle" fontSize={10} fill="#000" fontWeight={600}>{valve}%</text>
        </g>

      </svg>
    </div>
  );
}
