// Mock data (visual only — no backend)

export const BOILERS = [1, 2, 3].map((i) => ({
  id: i,
  name: `Boiler ${i}`,
  running: i !== 2 ? true : true,
  temp1: [185.4, 178.2, 182.9][i - 1],
  temp2: [182.1, 179.5, 181.3][i - 1],
  fireBurner: i !== 2,
  motorPump: true,
  alarm: i === 2,
  setpoint: 185,
}));

export function tempTrend(base: number, points = 48) {
  const data: { t: string; temp1: number; temp2: number; sp: number }[] = [];
  const now = Date.now();
  for (let i = points - 1; i >= 0; i--) {
    const ts = new Date(now - i * 30 * 60 * 1000);
    const noise = Math.sin(i / 3) * 3 + (Math.random() - 0.5) * 2;
    data.push({
      t: ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temp1: +(base + noise).toFixed(1),
      temp2: +(base - 2 + noise * 0.8).toFixed(1),
      sp: base,
    });
  }
  return data;
}

export function energyTrend(points = 24) {
  const data: { hour: string; boiler: number; oven: number }[] = [];
  for (let i = 0; i < points; i++) {
    data.push({
      hour: `${String(i).padStart(2, "0")}:00`,
      boiler: Math.round(180 + Math.sin(i / 3) * 40 + Math.random() * 20),
      oven: Math.round(240 + Math.cos(i / 4) * 60 + Math.random() * 25),
    });
  }
  return data;
}

// CED zones with stations arranged in a U-loop
export type Station = {
  id: string;
  zone: string;
  x: number;
  y: number;
  occupied: boolean;
  since?: string;
  stuck?: boolean;
};

export const CED_ZONES: { key: string; label: string; color: string }[] = [
  { key: "load", label: "Skid Loading", color: "oklch(0.55 0.02 240)" },
  { key: "predeg", label: "Pre-Degreasing", color: "oklch(0.45 0.10 220)" },
  { key: "deg", label: "Degreasing", color: "oklch(0.45 0.12 200)" },
  { key: "act", label: "Activation", color: "oklch(0.45 0.14 165)" },
  { key: "phos", label: "Phosphating", color: "oklch(0.50 0.15 145)" },
  { key: "rinse", label: "Rinse", color: "oklch(0.50 0.13 210)" },
  { key: "ecoat", label: "E-Coat / Flood", color: "oklch(0.50 0.18 285)" },
  { key: "unload", label: "Skid Unloading", color: "oklch(0.55 0.02 240)" },
];

// Build a U-shaped station layout
export const CED_STATIONS: Station[] = (() => {
  const stations: Station[] = [];
  const zoneOrder = ["load", "predeg", "deg", "act", "phos", "rinse", "ecoat", "unload"];
  const zoneCounts: Record<string, number> = {
    load: 2, predeg: 5, deg: 6, act: 4, phos: 7, rinse: 10, ecoat: 8, unload: 2,
  };
  // Top row L→R
  const flat: { zone: string; idx: number }[] = [];
  zoneOrder.forEach((z) => { for (let i = 0; i < zoneCounts[z]; i++) flat.push({ zone: z, idx: i }); });

  const total = flat.length;
  const topCount = Math.ceil(total / 2);
  const startX = 40, endX = 1160, topY = 90, botY = 320;
  const stepTop = (endX - startX) / (topCount - 1);
  const stepBot = (endX - startX) / (total - topCount - 1);
  flat.forEach((f, i) => {
    let x: number, y: number;
    if (i < topCount) { x = startX + i * stepTop; y = topY; }
    else { const j = i - topCount; x = endX - j * stepBot; y = botY; }
    const occupied = Math.random() > 0.55;
    stations.push({
      id: `STN${i + 1}${f.idx % 2 === 0 ? "A" : "B"}`,
      zone: f.zone,
      x, y,
      occupied,
      since: occupied ? `${Math.floor(Math.random() * 12)}m` : undefined,
      stuck: occupied && Math.random() > 0.93,
    });
  });
  return stations;
})();

export const ALARMS = [
  { t: "11:24:03", area: "Boiler", eq: "Boiler 2", msg: "Temp deviation +6°C", sev: "warn" },
  { t: "11:18:41", area: "CED", eq: "STN27B", msg: "Skid stuck > 5 min", sev: "warn" },
  { t: "10:56:12", area: "Oven", eq: "Zone 3", msg: "Temp below range", sev: "info" },
  { t: "10:33:08", area: "CED", eq: "PUS111", msg: "Pump vibration warning", sev: "warn" },
  { t: "09:41:55", area: "Boiler", eq: "Boiler 1", msg: "Auto restart complete", sev: "info" },
  { t: "08:12:29", area: "Oven", eq: "kWh Meter", msg: "Peak demand exceeded", sev: "warn" },
];

export const OVEN_ZONES = [
  { name: "Zone 1", pv: 185, sp: 185 },
  { name: "Zone 2", pv: 191, sp: 190 },
  { name: "Zone 3", pv: 176, sp: 180 },
  { name: "Zone 4", pv: 188, sp: 185 },
  { name: "Zone 5", pv: 183, sp: 185 },
  { name: "Zone 6", pv: 179, sp: 180 },
];
