import { useMemo } from "react";

function AnimatedPipe({ d, animated = true }: { d: string; animated?: boolean }) {
  return (
    <g>
      <path d={d} stroke="#2563eb" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {animated && (
        <path
          d={d}
          stroke="#93c5fd"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10 10"
          className="animate-pipe-flow"
        />
      )}
    </g>
  );
}

function Pump({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="0" r="16" fill="white" stroke="black" strokeWidth="2" />
      <circle cx="-3" cy="-3" r="8" fill="#84cc16" />
      <path d="M 0 -16 L 0 -24 L 12 -24 L 12 -12" fill="none" stroke="black" strokeWidth="2" />
      <text x="-25" y="5" textAnchor="end" fontSize="12" fill="#333">{label}</text>
    </g>
  );
}

function Valve({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-12" y="-12" width="24" height="24" fill="#d9f99d" stroke="black" strokeWidth="2" />
      <circle cx="0" cy="0" r="5" fill="#84cc16" />
      <text x="0" y="-18" textAnchor="middle" fontSize="12" fill="#333">{label}</text>
    </g>
  );
}

function DataBox({ x, y, title, pv, sp }: { x: number; y: number; title?: string; pv: string | number; sp: string | number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {title && (
        <rect x="0" y="0" width="80" height="20" fill="#84cc16" stroke="black" strokeWidth="1" />
      )}
      {title && (
        <text x="40" y="14" textAnchor="middle" fontSize="12" fill="black">{title}</text>
      )}
      <rect x="0" y={title ? 20 : 0} width="80" height="40" fill="white" stroke="black" strokeWidth="1" />
      <line x1="0" y1={title ? 40 : 20} x2="80" y2={title ? 40 : 20} stroke="black" strokeWidth="1" />
      <text x="-5" y={title ? 35 : 15} textAnchor="end" fontSize="12" fill="#22c55e">PV</text>
      <text x="40" y={title ? 35 : 15} textAnchor="middle" fontSize="12" fill="black">{pv}°C</text>
      <text x="-5" y={title ? 55 : 35} textAnchor="end" fontSize="12" fill="#64748b">SP</text>
      <text x="40" y={title ? 55 : 35} textAnchor="middle" fontSize="12" fill="black">{sp}°C</text>
    </g>
  );
}

export default function AnimatedPreDegreasingDiagram({
  pvLarge = 45, spLarge = 45, pvSmall = 84, spSmall = 80
}: any) {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl">
      <style>
        {`
          @keyframes pipeFlow {
            from { stroke-dashoffset: 20; }
            to { stroke-dashoffset: 0; }
          }
          .animate-pipe-flow {
            animation: pipeFlow 0.5s linear infinite;
          }
        `}
      </style>
      <svg viewBox="0 0 1200 800" className="w-full h-auto min-w-[800px]">
        {/* House outlines */}
        <path d="M 50 600 L 50 250 L 200 200 L 350 250 L 350 300" stroke="black" strokeWidth="3" fill="none" />
        <path d="M 1150 600 L 1150 280 L 950 220 L 750 250" stroke="black" strokeWidth="3" fill="none" />
        <path d="M 200 200 L 200 180" stroke="black" strokeWidth="3" fill="none" />

        {/* Top Fan FAE111 */}
        <g transform="translate(100, 80)">
          <circle cx="0" cy="0" r="15" fill="white" stroke="black" strokeWidth="2" />
          <circle cx="0" cy="0" r="8" fill="#d9f99d" />
          <path d="M 0 -15 L 0 -25 L -20 -25" stroke="black" strokeWidth="2" fill="none" />
          <text x="0" y="-30" textAnchor="middle" fontSize="12">FAE111</text>
        </g>
        <line x1="50" y1="110" x2="1100" y2="110" stroke="#84cc16" strokeWidth="2" />

        {/* Tanks */}
        {/* Large Tank Top Left */}
        <path d="M 200 250 L 350 250 L 350 320 L 450 420 L 550 420" stroke="black" strokeWidth="2" fill="#a5f3fc" fillOpacity="0.5" />
        <path d="M 200 250 L 350 250 L 350 320 L 450 420" stroke="black" strokeWidth="2" fill="none" />
        
        {/* Small Tank Bottom Left (HAE211) */}
        <rect x="130" y="550" width="100" height="120" fill="#a5f3fc" fillOpacity="0.5" stroke="black" strokeWidth="3" />
        <rect x="150" y="600" width="30" height="60" fill="none" stroke="black" strokeWidth="1" />
        <text x="130" y="690" textAnchor="end" fontSize="12">HAE211</text>

        {/* Funnel Tank Center (PUT211) */}
        <path d="M 450 550 L 450 630 L 600 630 L 600 550" fill="#a5f3fc" fillOpacity="0.5" stroke="black" strokeWidth="2" />

        {/* Far Right Filter Tank */}
        <path d="M 980 280 L 1150 280 L 1150 380 L 1080 480 L 1020 380 L 980 380 Z" fill="#a5f3fc" fillOpacity="0.5" stroke="black" strokeWidth="2" />

        {/* Heat Exchanger */}
        <rect x="850" y="380" width="60" height="60" fill="white" stroke="black" strokeWidth="2" />
        <text x="880" y="405" textAnchor="middle" fontSize="12">HEX</text>
        <text x="880" y="420" textAnchor="middle" fontSize="12">211</text>

        {/* Small Funnel Center Right */}
        <path d="M 700 350 L 740 350 L 740 400 L 720 430 L 720 450 L 700 450 Z" fill="#f1f5f9" stroke="black" strokeWidth="1" />

        {/* Pipes with Animation */}
        {/* Feed line from top */}
        <AnimatedPipe d="M 500 130 L 500 230 L 800 230 L 800 280 L 980 280" />
        {/* Line from Large tank */}
        <AnimatedPipe d="M 230 280 L 230 350 L 180 350 L 180 580 L 200 580" />
        <AnimatedPipe d="M 280 280 L 280 400 L 450 400 L 500 470 L 500 550" />
        <AnimatedPipe d="M 350 300 L 350 400 L 450 400" />
        
        {/* Line from HAE211 */}
        <AnimatedPipe d="M 200 600 L 200 400 L 260 400" />
        <AnimatedPipe d="M 220 620 L 280 620 L 280 650 L 850 650 L 850 440" />

        {/* Line from HEX to right tank */}
        <AnimatedPipe d="M 880 380 L 880 250 L 1050 250 L 1050 280" />
        <AnimatedPipe d="M 910 440 L 910 700 L 1150 700" />

        {/* Line from right tank */}
        <AnimatedPipe d="M 1000 380 L 1000 400 L 800 400 L 800 450" />

        {/* Pumps */}
        <Pump x="260" y="380" label="FUS211" />
        <Pump x="350" y="380" label="PUS211" />
        <Pump x="630" y="390" label="PUS211" />
        <Pump x="630" y="600" label="PUT211" />

        {/* Valves */}
        <Valve x="580" y="230" label="VAA211" />
        <Valve x="800" y="280" label="VAA212" />
        <Valve x="500" y="470" label="VAA213" />
        <Valve x="720" y="470" label="VAA214" />
        <Valve x="850" y="550" label="VAM211" />

        {/* Data Boxes */}
        <DataBox x="400" y="270" title="AUTO" pv={pvLarge} sp={spLarge} />
        <DataBox x="170" y="700" pv={pvSmall} sp={spSmall} />

        <text x="800" y="720" fontSize="12" fill="#333">HOT WATER</text>
      </svg>
    </div>
  );
}
